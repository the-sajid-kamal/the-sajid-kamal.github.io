// =====================================================================
//  Tracking. One track() call sends an event to every analytics tool that
//  is switched on (Umami, Google Tag Manager / GA4, Clarity, Meta Pixel).
//  Most events are picked up automatically from what people click, so
//  new links and buttons are tracked without extra work.
//
//  Events (see README → "Analytics and tracking"):
//    cv_download, one_pager_download, vcard_download, file_download, resume_print, print,
//    email_click, phone_click, whatsapp_click, booking_click, outbound_click,
//    share, copy, language_switch, theme_toggle, audience_tab, work_filter,
//    contact_start, contact_submit, contact_error, video_play, newsletter_click,
//    scroll_depth, read_complete, engaged, not_found
//
//  To watch events as they happen, open any page with ?debug-analytics
//  (they are listed in the browser console). ?debug-analytics=off stops it.
// =====================================================================

type Props = Record<string, string | number | boolean | null | undefined>;
const w = window as any;

let debug = false;
try {
  const q = new URLSearchParams(location.search).get('debug-analytics');
  if (q !== null) localStorage.setItem('debug-analytics', q === 'off' ? '0' : '1');
  debug = localStorage.getItem('debug-analytics') === '1';
} catch { /* storage blocked */ }

// Umami loads a moment after the page; hold early events until it is ready
const umamiQueue: [string, Props][] = [];
let umamiTimer: number | undefined;
function toUmami(event: string, data: Props) {
  if (w.umami?.track) return w.umami.track(event, data);
  umamiQueue.push([event, data]);
  if (umamiTimer) return;
  let tries = 0;
  umamiTimer = window.setInterval(() => {
    if (w.umami?.track) umamiQueue.splice(0).forEach(([e, d]) => w.umami.track(e, d));
    if (w.umami?.track || ++tries > 30) { window.clearInterval(umamiTimer); umamiTimer = undefined; umamiQueue.length = 0; }
  }, 500);
}

// Events that also count as conversions in ad platforms
const metaStandard: Record<string, string> = { contact_submit: 'Lead', whatsapp_click: 'Contact', email_click: 'Contact', phone_click: 'Contact', booking_click: 'Schedule' };

export function track(event: string, props: Props = {}) {
  const data: Props = {};
  for (const [key, value] of Object.entries({ ...props, page: location.pathname, lang: document.documentElement.lang })) {
    if (value !== undefined && value !== null && value !== '') data[key] = typeof value === 'string' ? value.slice(0, 200) : value;
  }
  const run = (fn: () => void) => { try { fn(); } catch { /* a blocked tool never breaks the page */ } };
  run(() => toUmami(event, data));
  run(() => { if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...data }); });
  run(() => { w.gtag?.('event', event, data); if (event === 'contact_submit') w.gtag?.('event', 'generate_lead', data); });
  run(() => w.clarity?.('event', event));
  run(() => { if (!w.fbq) return; if (metaStandard[event]) w.fbq('track', metaStandard[event], data); else w.fbq('trackCustom', event, data); });
  if (debug) console.info('%c[track]', 'color:#A3402A;font-weight:600', event, data);
}

/* ---------------------------------------------------------------------
   Where visitors came from. Remembered for the visit (and the very first
   visit on this device), then attached to contact-form messages.
   --------------------------------------------------------------------- */
interface Visit {
  source?: string; medium?: string; campaign?: string; term?: string; content?: string;
  referrer?: string; landing: string; at: number; pages: number;
}
const read = (store: Storage, key: string) => { try { return JSON.parse(store.getItem(key) || 'null'); } catch { return null; } };
const write = (store: Storage, key: string, value: unknown) => { try { store.setItem(key, JSON.stringify(value)); } catch { /* blocked */ } };

export function captureVisit() {
  const q = new URLSearchParams(location.search);
  const utm: Partial<Visit> = {};
  (['source', 'medium', 'campaign', 'term', 'content'] as const).forEach((k) => { const v = q.get(`utm_${k}`); if (v) utm[k] = v.slice(0, 80); });
  if (!utm.source && q.get('ref')) utm.source = q.get('ref')!.slice(0, 80);
  let referrer = '';
  try { const r = document.referrer && new URL(document.referrer); if (r && r.host !== location.host) referrer = r.host; } catch { /* bad referrer */ }

  let visit: Visit | null = read(sessionStorage, 'visit');
  const isNew = !visit;
  if (!visit) visit = { ...utm, referrer: referrer || undefined, landing: (location.pathname + location.search).slice(0, 200), at: Date.now(), pages: 0 };
  else if (Object.keys(utm).length) visit = { ...visit, ...utm };
  visit.pages += 1;
  write(sessionStorage, 'visit', visit);

  if (isNew) {
    const first = read(localStorage, 'first-visit');
    if (!first) write(localStorage, 'first-visit', { source: visit.source, medium: visit.medium, referrer: visit.referrer, landing: visit.landing, at: visit.at });
    try { localStorage.setItem('visits', String(Number(localStorage.getItem('visits') || 0) + 1)); } catch { /* blocked */ }
    if (visit.source || visit.referrer) run(() => w.clarity?.('set', 'source', visit!.source || visit!.referrer));
  }
}
const run = (fn: () => void) => { try { fn(); } catch { /* ignore */ } };

/** A short summary for the contact form, so the email says what brought this person */
export function visitSummary() {
  const visit: Visit | null = read(sessionStorage, 'visit');
  const first = read(localStorage, 'first-visit');
  let visits = 1;
  try { visits = Number(localStorage.getItem('visits') || 1); } catch { /* blocked */ }
  return JSON.stringify({
    source: visit?.source, medium: visit?.medium, campaign: visit?.campaign, term: visit?.term, content: visit?.content,
    referrer: visit?.referrer, landing: visit?.landing, pages: visit?.pages, visits,
    firstSource: first?.source || first?.referrer, firstAt: first?.at, sentFrom: location.pathname,
  });
}

/* ---------------------------------------------------------------------
   Automatic events from clicks (one listener for the whole site)
   --------------------------------------------------------------------- */
const zoneOf = (el: Element) => el.closest('[data-zone]')?.getAttribute('data-zone') || (el.closest('main') ? 'page' : 'other');

export function initClickTracking() {
  if (w.__clickTracking) return;
  w.__clickTracking = true;
  document.addEventListener('click', (event) => {
    const el = (event.target as Element | null)?.closest('a, button');
    if (!el) return;
    const zone = zoneOf(el);
    const label = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    const explicit = el.getAttribute('data-track');
    if (explicit) return track(explicit, { zone, label });

    if (el.tagName !== 'A') return;
    const a = el as HTMLAnchorElement;
    const href = a.getAttribute('href') || '';
    if (a.dataset.langSwitch) return track('language_switch', { to: a.dataset.langSwitch, zone });
    if (a.dataset.shareNetwork) return track('share', { network: a.dataset.shareNetwork, zone });
    if (href.startsWith('mailto:')) return track(a.closest('[data-share]') ? 'share' : 'email_click', { zone, network: a.closest('[data-share]') ? 'email' : undefined });
    if (href.startsWith('tel:')) return track('phone_click', { zone });
    let url: URL;
    try { url = new URL(a.href); } catch { return; }
    if (/(^|\.)wa\.me$|whatsapp\.com$/.test(url.host)) return track('whatsapp_click', { zone });
    if (/\.pdf$/i.test(url.pathname)) {
      const file = decodeURIComponent(url.pathname.split('/').pop() || '');
      const name = /one-?pager/i.test(file) ? 'one_pager_download' : /cv|resume/i.test(file) ? 'cv_download' : 'file_download';
      return track(name, { zone, file });
    }
    if (/\.vcf$/i.test(url.pathname)) return track('vcard_download', { zone });
    if (/cal\.com|calendly\.com|calendar\.google|zcal\.co|tidycal\.com/.test(url.host)) return track('booking_click', { zone });
    if (url.host !== location.host) return track('outbound_click', { zone, host: url.host, url: url.href });
  }, { capture: true });

  window.addEventListener('beforeprint', () => track(location.pathname.startsWith('/resume') ? 'resume_print' : 'print'));
}

/* ---------------------------------------------------------------------
   Per page: how far people scroll, how long they stay, missing pages
   --------------------------------------------------------------------- */
export function initPageTracking(signal: AbortSignal) {
  if (document.querySelector('[data-not-found]')) track('not_found', { referrer: document.referrer || 'direct' });

  // Scroll depth: 25, 50, 75 and 100% of the page, once each
  const marks = [25, 50, 75, 100];
  let ticking = false;
  const check = () => {
    ticking = false;
    const doc = document.documentElement;
    const seen = ((window.scrollY + window.innerHeight) / Math.max(doc.scrollHeight, 1)) * 100;
    while (marks.length && seen >= marks[0] - 1) track('scroll_depth', { percent: marks.shift() });
  };
  window.addEventListener('scroll', () => { if (!ticking && marks.length) { ticking = true; requestAnimationFrame(check); } }, { passive: true, signal });

  // Engaged time: counted only while the tab is visible
  let seconds = 0;
  const timer = window.setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    seconds += 1;
    if (seconds === 30 || seconds === 120) track('engaged', { seconds });
  }, 1000);
  signal.addEventListener('abort', () => window.clearInterval(timer));
}
