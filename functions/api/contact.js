// =====================================================================
//  Contact form handler (Cloudflare Pages Function) at POST /api/contact
//
//  It checks the message, then emails it to you through Resend
//  (resend.com, free for 3,000 emails a month). Set these in Cloudflare:
//  Workers & Pages → your project → Settings → Variables and Secrets
//
//    RESEND_API_KEY        (secret)  your Resend API key
//    CONTACT_TO_EMAIL      (text)    where messages go, e.g. sajidkamal214@gmail.com
//    CONTACT_FROM_EMAIL    (text)    optional, e.g. "Website <hello@thesajidkamal.me>"
//                                    (needs your domain verified in Resend; until then
//                                    the default onboarding@resend.dev sender is used)
//    TURNSTILE_SECRET_KEY  (secret)  optional, switches on Cloudflare Turnstile checks
//
//  Replies: {"ok": true} when sent; {"ok": false, "error": "..."} otherwise,
//  and the page then shows your email address instead.
// =====================================================================

const TOPICS = {
  hiring: 'A role or hiring',
  consulting: 'Consulting or advisory',
  venture: 'Investment or a venture',
  speaking: 'Speaking or media',
  other: 'Something else',
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const clean = (value, max) => String(value ?? '').replace(/\r\n?/g, '\n').trim().slice(0, max);
const oneLine = (value) => value.replace(/[\r\n]+/g, ' ');

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method_not_allowed' }, 405);
  }

  // Only accept posts from this site's own pages
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }

  let data;
  try {
    const type = request.headers.get('Content-Type') || '';
    data = type.includes('application/json')
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Spam trap: a hidden field that only bots fill in. Pretend it worked.
  if (clean(data.website, 200)) return json({ ok: true });

  const name = oneLine(clean(data.name, 100));
  const email = oneLine(clean(data.email, 200));
  const organisation = oneLine(clean(data.organisation, 150));
  const message = clean(data.message, 5000);
  const topic = TOPICS[data.topic] ? data.topic : 'other';

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'invalid' }, 422);
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const form = new FormData();
    form.append('secret', env.TURNSTILE_SECRET_KEY);
    form.append('response', clean(data['cf-turnstile-response'], 4000));
    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) form.append('remoteip', ip);
    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form })
      .then((r) => r.json())
      .catch(() => ({ success: false }));
    if (!check.success) return json({ ok: false, error: 'turnstile' }, 403);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    organisation ? `Organisation: ${organisation}` : null,
    `Topic: ${TOPICS[topic]}`,
    '',
    message,
    '',
    '— Sent from the contact form on thesajidkamal.me',
  ].filter((line) => line !== null).join('\n');

  const response = await fetch(env.RESEND_API_URL || 'https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || 'Website contact form <onboarding@resend.dev>',
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `[${TOPICS[topic]}] ${name}${organisation ? `, ${organisation}` : ''}`,
      text,
    }),
  }).catch(() => null);

  if (!response || !response.ok) {
    return json({ ok: false, error: 'send_failed' }, 502);
  }
  return json({ ok: true });
}
