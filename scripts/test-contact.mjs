// Tests for functions/api/contact.js. Run with: npm run test:contact
// Uses a fake email service, so nothing is ever sent.
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/contact.js';

const SITE = 'https://thesajidkamal.me';
const good = { name: 'Test Person', email: 'test@example.com', topic: 'consulting', organisation: 'Acme', message: 'Hello\nthere', website: '' };
const env = { RESEND_API_KEY: 'test-key', CONTACT_TO_EMAIL: 'me@example.com' };

let sent = [];
const realFetch = globalThis.fetch;
function fakeFetch(handler) {
  globalThis.fetch = async (url, init) => { sent.push({ url: String(url), init }); return handler(String(url), init); };
}
const ok = () => new Response('{"id":"1"}', { status: 200 });

async function call(body, { method = 'POST', origin = SITE, environment = env, json = true } = {}) {
  const headers = { Origin: origin };
  let payload;
  if (method === 'POST') {
    if (json) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
    else { payload = new URLSearchParams(body); }
  }
  const request = new Request(`${SITE}/api/contact`, { method, headers, body: payload });
  const response = await onRequest({ request, env: environment });
  return { status: response.status, data: await response.json() };
}

const tests = {
  'rejects GET': async () => {
    const r = await call(null, { method: 'GET' });
    assert.equal(r.status, 405);
  },
  'rejects posts from other websites': async () => {
    const r = await call(good, { origin: 'https://evil.example' });
    assert.equal(r.status, 403);
  },
  'quietly drops spam-trap submissions': async () => {
    sent = []; fakeFetch(ok);
    const r = await call({ ...good, website: 'http://spam' });
    assert.deepEqual(r, { status: 200, data: { ok: true } });
    assert.equal(sent.length, 0, 'nothing should be sent');
  },
  'rejects a bad email address': async () => {
    const r = await call({ ...good, email: 'not-an-email' });
    assert.equal(r.status, 422);
  },
  'rejects an empty message': async () => {
    const r = await call({ ...good, message: '   ' });
    assert.equal(r.status, 422);
  },
  'says when email is not set up yet': async () => {
    const r = await call(good, { environment: {} });
    assert.deepEqual(r, { status: 503, data: { ok: false, error: 'not_configured' } });
  },
  'sends the email through Resend': async () => {
    sent = []; fakeFetch(ok);
    const r = await call(good);
    assert.deepEqual(r, { status: 200, data: { ok: true } });
    assert.equal(sent.length, 1);
    assert.equal(sent[0].url, 'https://api.resend.com/emails');
    assert.equal(sent[0].init.headers.Authorization, 'Bearer test-key');
    const email = JSON.parse(sent[0].init.body);
    assert.deepEqual(email.to, ['me@example.com']);
    assert.equal(email.reply_to, 'test@example.com');
    assert.equal(email.subject, '[Consulting or advisory] Test Person, Acme');
    assert.match(email.text, /Name: Test Person\nEmail: test@example.com\nOrganisation: Acme\nTopic: Consulting or advisory\n\nHello\nthere\n\n/);
  },
  'accepts ordinary form posts too': async () => {
    sent = []; fakeFetch(ok);
    const r = await call(good, { json: false });
    assert.equal(r.status, 200);
    assert.equal(sent.length, 1);
  },
  'keeps line breaks out of the subject': async () => {
    sent = []; fakeFetch(ok);
    await call({ ...good, name: 'Evil\nBcc: x@y.z', organisation: '' });
    const email = JSON.parse(sent[0].init.body);
    assert.equal(email.subject, '[Consulting or advisory] Evil Bcc: x@y.z');
  },
  'unknown topics become "Something else"': async () => {
    sent = []; fakeFetch(ok);
    await call({ ...good, topic: 'hacking' });
    assert.match(JSON.parse(sent[0].init.body).subject, /^\[Something else\]/);
  },
  'reports when Resend fails': async () => {
    fakeFetch(() => new Response('{"message":"bad key"}', { status: 401 }));
    const r = await call(good);
    assert.deepEqual(r, { status: 502, data: { ok: false, error: 'send_failed' } });
  },
  'adds where the visitor came from': async () => {
    sent = []; fakeFetch(ok);
    const attribution = JSON.stringify({ source: 'linkedin', medium: 'social', campaign: 'share', referrer: 'www.linkedin.com', landing: '/work/sui-chokri/?utm_source=linkedin', pages: 3, visits: 2, firstSource: 'google', sentFrom: '/contact/' });
    await call({ ...good, attribution });
    const text = JSON.parse(sent[0].init.body).text;
    assert.match(text, /— How they found you —\nSource: linkedin \/ social \(campaign: share\)\nCame from: www.linkedin.com\nFirst page: \/work\/sui-chokri\/\?utm_source=linkedin\nPages viewed this visit: 3\nVisits so far: 2 \(first via google\)\nSent from: \/contact\//);
  },
  'ignores broken or hostile visit data': async () => {
    sent = []; fakeFetch(ok);
    const r = await call({ ...good, attribution: 'not json' });
    assert.equal(r.status, 200);
    assert.doesNotMatch(JSON.parse(sent[0].init.body).text, /How they found you/);
    sent = [];
    await call({ ...good, attribution: JSON.stringify({ source: 'x\nBcc: evil@example.com', pages: 'lots', visits: -4 }) });
    const text = JSON.parse(sent[0].init.body).text;
    assert.match(text, /Source: x Bcc: evil@example.com\n/);
    assert.doesNotMatch(text, /Pages viewed|Visits so far/);
  },
  'says when a message comes from the Bangla site': async () => {
    sent = []; fakeFetch(ok);
    await call({ ...good, lang: 'bn' });
    assert.match(JSON.parse(sent[0].init.body).text, /Topic: Consulting or advisory\nLanguage: Bangla \(sent from the Bangla site\)\n/);
  },
  'checks Turnstile when it is switched on': async () => {
    sent = [];
    fakeFetch((url) => url.includes('turnstile') ? new Response('{"success":false}') : ok());
    const r = await call({ ...good, 'cf-turnstile-response': 'bad' }, { environment: { ...env, TURNSTILE_SECRET_KEY: 'secret' } });
    assert.equal(r.status, 403);
    assert.equal(sent.filter((s) => s.url.includes('resend')).length, 0);
    fakeFetch((url) => url.includes('turnstile') ? new Response('{"success":true}') : ok());
    const r2 = await call({ ...good, 'cf-turnstile-response': 'good' }, { environment: { ...env, TURNSTILE_SECRET_KEY: 'secret' } });
    assert.equal(r2.status, 200);
  },
};

let failed = 0;
for (const [name, test] of Object.entries(tests)) {
  try { await test(); console.log(`  ✓ ${name}`); }
  catch (error) { failed++; console.log(`  ✗ ${name}\n    ${error.message}`); }
  finally { globalThis.fetch = realFetch; }
}
console.log(failed ? `\n${failed} test(s) failed` : `\nAll ${Object.keys(tests).length} tests passed`);
process.exit(failed ? 1 : 0);
