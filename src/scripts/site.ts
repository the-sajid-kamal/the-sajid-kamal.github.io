// =====================================================================
//  Site behaviour. Everything here is an enhancement: every page works
//  and shows all its content without it.
//  Runs on the first page load and again after each page change
//  (the site uses smooth page transitions).
// =====================================================================
import { track, captureVisit, visitSummary, initClickTracking, initPageTracking } from './analytics';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let pageAbort: AbortController | null = null;
let clockTimer: number | undefined;

// The few words the script itself writes, in both languages
const words = {
  en: {
    menu: 'Menu', close: 'Close', toLight: 'Switch to light theme', toDark: 'Switch to dark theme',
    copied: 'Copied', linkCopied: 'Link copied', bioCopied: 'Bio copied', sending: 'Sending…',
    sent: 'Thank you. Your message has been sent, and I’ll reply soon.',
    failed: 'Sorry, your message couldn’t be sent right now. Please email me directly at',
    dismiss: 'Dismiss',
  },
  bn: {
    menu: 'মেনু', close: 'বন্ধ', toLight: 'লাইট থিমে যান', toDark: 'ডার্ক থিমে যান',
    copied: 'কপি হয়েছে', linkCopied: 'লিংক কপি হয়েছে', bioCopied: 'বায়ো কপি হয়েছে', sending: 'পাঠানো হচ্ছে…',
    sent: 'ধন্যবাদ! আপনার বার্তা পৌঁছেছে, শিগগিরই উত্তর দেব।',
    failed: 'দুঃখিত, এই মুহূর্তে বার্তাটি পাঠানো গেল না। সরাসরি ইমেইল করুন:',
    dismiss: 'বন্ধ করুন',
  },
};
const lang = () => (document.documentElement.lang === 'bn' ? 'bn' : 'en');
const say = () => words[lang()];

initClickTracking();

document.addEventListener('astro:page-load', () => {
  pageAbort?.abort();
  pageAbort = new AbortController();
  const signal = pageAbort.signal;
  window.clearInterval(clockTimer);

  captureVisit();
  initHeader(signal);
  initMenu(signal);
  initThemeToggle();
  markPlaceholders();
  initReveal();
  initCountUp();
  initTabs(signal);
  initChapters();
  initFilters();
  initContactForm();
  initReadingProgress(signal);
  initCopyButtons();
  initShare();
  initVideo();
  initPrint();
  initWhatsApp(signal);
  initPointerEffects(signal);
  initClock();
  initLanguageHint();
  initOwnerPreview();
  initPageTracking(signal);
});

/* Small message at the bottom of the screen ("Link copied") */
function toast(content: string | Node, { duration = 2600, dismissible = false } = {}) {
  document.querySelector('.toast')?.remove();
  const box = document.createElement('div');
  box.className = 'toast';
  box.setAttribute('role', 'status');
  box.append(content);
  if (dismissible) {
    const close = document.createElement('button');
    close.type = 'button';
    close.setAttribute('aria-label', say().dismiss);
    close.textContent = '×';
    close.addEventListener('click', () => hide());
    box.append(close);
  }
  document.body.append(box);
  requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('is-shown')));
  let timer = duration ? window.setTimeout(() => hide(), duration) : 0;
  function hide() { window.clearTimeout(timer); box.classList.remove('is-shown'); window.setTimeout(() => box.remove(), 500); }
  return { box, hide };
}

/* Header: solid background once the page scrolls; slides away while reading down,
   comes back as soon as you scroll up */
function initHeader(signal: AbortSignal) {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let ticking = false;
  let lastY = window.scrollY;
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    const menuOpen = document.documentElement.classList.contains('menu-open');
    if (y < 240 || y < lastY - 6 || menuOpen || header.contains(document.activeElement)) header.classList.remove('is-hidden');
    else if (y > lastY + 6) header.classList.add('is-hidden');
    if (Math.abs(y - lastY) > 6) lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true, signal });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'), { signal });
  update();
}

/* Phone menu */
function initMenu(signal: AbortSignal) {
  const root = document.documentElement;
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.getElementById('site-menu');
  if (!toggle || !menu) return;
  const label = toggle.querySelector('[data-menu-label]');
  root.classList.remove('menu-open');

  const setOpen = (open: boolean) => {
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? say().close : say().menu;
  };
  toggle.addEventListener('click', () => setOpen(!root.classList.contains('menu-open')), { signal });
  menu.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setOpen(false); }, { signal });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
  }, { signal });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); }, { signal });
}

/* Light / dark switch (remembered on this device). Where the browser can, the new
   theme spreads out in a circle from the button. */
function initThemeToggle() {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button) return;
  const root = document.documentElement;
  const sync = () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? say().toLight : say().toDark);
  };
  sync();
  button.addEventListener('click', (event) => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch { /* private mode */ }
      sync();
    };
    track('theme_toggle', { theme: next });
    const doc = document as any;
    if (!doc.startViewTransition || reduceMotion()) return apply();
    const x = event.clientX || window.innerWidth - 40;
    const y = event.clientY || 40;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.classList.add('theme-vt');
    const transition = doc.startViewTransition(apply);
    transition.ready.then(() => {
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
    transition.finished.finally(() => root.classList.remove('theme-vt'));
  });
}

/* Any paragraph or list item in an article that starts with "[" is a placeholder */
function markPlaceholders() {
  document.querySelectorAll('.prose p, .prose li, .prose h2, .prose h3, .prose blockquote').forEach((el) => {
    if (el.textContent?.trim().startsWith('[')) el.classList.add('placeholder');
  });
}

/* Fade-in on scroll, staggered. Only elements that start below the fold are hidden. */
const revealTargets = [
  '[data-reveal]', '.section-head', '.proof-item', '.chapter', '.cred-list li', '.faq details', '.contact-details li',
  '.reason-card', '.media-list li', '.credentials__list li', '.post-row', '.newsletter', '.share', '.author-box',
].join(', ');
function initReveal() {
  const items = document.querySelectorAll<HTMLElement>(revealTargets);
  if (!items.length || reduceMotion() || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  const fold = window.innerHeight * 0.94;
  items.forEach((el) => {
    if (el.closest('.paper, [hidden]') || el.getBoundingClientRect().top < fold) return;
    const index = Array.prototype.indexOf.call(el.parentElement?.children ?? [], el);
    el.style.transitionDelay = `${(index % 4) * 80}ms`;
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* Numbers count up from zero when they appear (final values are already in the HTML) */
function initCountUp() {
  const numbers = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!numbers.length || reduceMotion() || !('IntersectionObserver' in window)) return;
  const format = new Intl.NumberFormat(lang() === 'bn' ? 'bn-BD' : 'en-GB', { useGrouping: false });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target as HTMLElement;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / 1600, 1);
        el.textContent = format.format(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  numbers.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible: leave it
    el.textContent = format.format(0);
    observer.observe(el);
  });
}

/* "How I can help" tabs, with arrow keys, links like /#for-investors and a sliding highlight */
function initTabs(signal: AbortSignal) {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((wrap) => {
    const tabs = Array.from(wrap.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls') || ''));
    const list = wrap.querySelector<HTMLElement>('[role="tablist"]');
    if (!tabs.length || !list) return;
    let current = 0;

    const moveIndicator = () => {
      const tab = tabs[current];
      list.style.setProperty('--tab-x', `${tab.offsetLeft}px`);
      list.style.setProperty('--tab-y', `${tab.offsetTop}px`);
      list.style.setProperty('--tab-w', `${tab.offsetWidth}px`);
      list.style.setProperty('--tab-h', `${tab.offsetHeight}px`);
    };
    const select = (i: number, focus = false, user = false) => {
      current = i;
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (panels[j]) panels[j]!.hidden = !on;
      });
      moveIndicator();
      if (focus) tabs[i].focus();
      if (user) track('audience_tab', { audience: panels[i]?.id });
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i, false, true), { signal });
      tab.addEventListener('keydown', (e) => {
        const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
        if (e.key in keys) { e.preventDefault(); select((i + keys[e.key] + tabs.length) % tabs.length, true, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true, true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true, true); }
      }, { signal });
    });

    const fromHash = () => {
      const i = panels.findIndex((p) => p && `#${p.id}` === location.hash);
      if (i >= 0) { select(i); wrap.scrollIntoView({ block: 'start' }); }
    };
    wrap.classList.add('is-ready');
    select(0);
    fromHash();
    requestAnimationFrame(() => { moveIndicator(); wrap.classList.add('has-indicator'); });
    window.addEventListener('hashchange', fromHash, { signal });
    window.addEventListener('resize', moveIndicator, { passive: true, signal });
    document.fonts?.ready.then(moveIndicator);
  });
}

/* Story: highlight the chapter in view */
function initChapters() {
  const list = document.querySelector<HTMLElement>('[data-chapters]');
  if (!list || !('IntersectionObserver' in window)) return;
  const chapters = list.querySelectorAll<HTMLElement>('[data-chapter]');
  list.classList.add('is-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-active', entry.isIntersecting));
  }, { rootMargin: '-35% 0px -45% 0px' });
  chapters.forEach((c) => observer.observe(c));
  if (reduceMotion()) chapters.forEach((c) => c.classList.add('is-active'));
}

/* Work page: filter projects by category */
function initFilters() {
  const bar = document.querySelector<HTMLElement>('[data-filter-bar]');
  if (!bar) return;
  const cards = document.querySelectorAll<HTMLElement>('[data-filter-grid] [data-category]');
  bar.classList.add('is-ready');
  bar.addEventListener('click', (e) => {
    const button = (e.target as Element).closest<HTMLButtonElement>('button[data-filter]');
    if (!button) return;
    const filter = button.dataset.filter;
    bar.querySelectorAll('button[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    cards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.hidden = !match;
      if (match) card.classList.add('is-visible');
    });
    track('work_filter', { category: filter });
  });
}

/* Contact form: sends in the background and reports the real result */
function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const label = button.querySelector<HTMLElement>('.btn__label');
  const status = form.querySelector<HTMLElement>('.form-status')!;
  const original = label?.textContent ?? '';
  const fallbackEmail = form.dataset.fallbackEmail || '';

  // Pre-select the topic from links like /contact/?topic=consulting
  const topic = new URLSearchParams(location.search).get('topic');
  const select = form.querySelector<HTMLSelectElement>('select[name="topic"]');
  if (topic && select && Array.from(select.options).some((o) => o.value === topic)) select.value = topic;

  // Cloudflare Turnstile (only if a site key is set in site.config.ts)
  const widget = form.querySelector<HTMLElement>('.cf-turnstile');
  if (widget) loadTurnstile(widget);

  let started = false;
  form.addEventListener('focusin', () => { if (!started) { started = true; track('contact_start', { topic: select?.value }); } });

  const show = (type: '' | 'success' | 'error', message: string, email?: string) => {
    status.className = 'form-status' + (type ? ` is-${type}` : '');
    status.textContent = message;
    if (email) {
      const link = document.createElement('a');
      link.href = `mailto:${email}`;
      link.textContent = email;
      status.append(' ', link, lang() === 'bn' ? '' : '.');
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const attribution = form.querySelector<HTMLInputElement>('[data-attribution]');
    if (attribution) attribution.value = visitSummary();
    button.disabled = true;
    button.classList.add('is-sending');
    if (label) label.textContent = say().sending;
    show('', '');
    const chosen = select?.value;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await response.json().catch(() => ({}));
      // Our Cloudflare function and Formspree reply {"ok": true}; Web3Forms and FormSubmit {"success": true}
      const sent = response.ok && (data.ok === true || String(data.success) === 'true');
      if (!sent) throw new Error(data.error || data.message || `HTTP ${response.status}`);
      form.reset();
      show('success', say().sent);
      track('contact_submit', { topic: chosen });
      (window as any).turnstile?.reset?.();
    } catch (error) {
      console.error('Contact form could not be sent:', error);
      show('error', say().failed, fallbackEmail);
      track('contact_error', { topic: chosen, reason: String((error as Error)?.message || error).slice(0, 60) });
    } finally {
      button.disabled = false;
      button.classList.remove('is-sending');
      if (label) label.textContent = original;
    }
  });
}

function loadTurnstile(widget: HTMLElement) {
  const render = () => (window as any).turnstile?.render(widget, { sitekey: widget.dataset.sitekey, theme: 'auto' });
  if ((window as any).turnstile) return render();
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.onload = render;
  document.head.append(script);
}

/* Articles and case studies: thin progress bar along the top; "read" once near the end */
function initReadingProgress(signal: AbortSignal) {
  const bar = document.querySelector<HTMLElement>('[data-reading-progress]');
  const article = document.querySelector<HTMLElement>('[data-article] .prose');
  if (!bar || !article) return;
  let ticking = false;
  let done = false;
  const update = () => {
    const rect = article.getBoundingClientRect();
    const total = rect.height - window.innerHeight * 0.6;
    const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
    bar.style.transform = `scaleX(${progress})`;
    if (!done && progress > 0.9 && window.scrollY > 200) { done = true; track('read_complete', { kind: location.pathname.split('/')[1] }); }
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true, signal });
  update();
}

/* "Copy" buttons: the short bio and page links */
function initCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    if (!navigator.clipboard) return;
    button.hidden = false;
    const original = button.textContent;
    button.addEventListener('click', async () => {
      const source = button.dataset.copy!;
      const isUrl = source === 'url';
      const text = isUrl ? location.origin + location.pathname : document.querySelector(source)?.textContent?.trim().replace(/\s+/g, ' ') ?? '';
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = say().copied;
        toast(isUrl ? say().linkCopied : say().bioCopied);
        track(isUrl ? 'share' : 'copy', isUrl ? { network: 'copy' } : { what: source.replace('#', '') });
        setTimeout(() => { button.textContent = original; }, 2000);
      } catch { /* clipboard blocked */ }
    });
  });
}

/* Share: the phone's own share sheet, where the browser offers one */
function initShare() {
  document.querySelectorAll<HTMLElement>('[data-share]').forEach((box) => {
    const button = box.querySelector<HTMLButtonElement>('[data-share-native]');
    if (!button || !navigator.share) return;
    button.hidden = false;
    button.addEventListener('click', async () => {
      try {
        await navigator.share({ title: box.dataset.shareTitle, text: box.dataset.shareText || undefined, url: box.dataset.shareUrl });
        track('share', { network: 'native' });
      } catch { /* cancelled */ }
    });
  });
}

/* Intro video (hidden until switched on): the YouTube player loads only on play */
function initVideo() {
  document.querySelectorAll<HTMLElement>('[data-video]').forEach((box) => {
    box.querySelector('[data-video-play]')?.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${box.dataset.video}?autoplay=1&rel=0`;
      frame.title = box.dataset.videoTitle || 'Video';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      box.replaceChildren(frame);
      track('video_play', { video: box.dataset.video });
    }, { once: true });
  });
}

/* "Print" buttons on the résumé and one-pager */
function initPrint() {
  document.querySelectorAll<HTMLButtonElement>('[data-print]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => window.print());
  });
}

/* Floating WhatsApp button: appears once the visitor scrolls, steps aside near the
   call-to-action band and footer (which have their own WhatsApp links) */
function initWhatsApp(signal: AbortSignal) {
  const button = document.querySelector<HTMLElement>('[data-wa-float]');
  if (!button) return;
  const zones = document.querySelectorAll('.cta-band, .site-footer, .contact-grid');
  const inView = new Set<Element>();
  let ticking = false;
  const update = () => {
    ticking = false;
    button.classList.toggle('is-shown', window.scrollY > Math.min(480, window.innerHeight * 0.6) && inView.size === 0);
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)));
      update();
    });
    zones.forEach((z) => observer.observe(z));
    signal.addEventListener('abort', () => observer.disconnect());
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true, signal });
  update();
}

/* Pointer touches (mouse and trackpad only): a soft light follows the pointer across
   cards, and the main buttons lean slightly towards it */
function initPointerEffects(signal: AbortSignal) {
  if (!finePointer() || reduceMotion()) return;
  let frame = 0;
  let last: PointerEvent | null = null;
  const cards = '.service-card, .format-card, .reason-card, .quote-card, .form-card, .audience__panel';
  const magnets = '.hero .btn, .cta-band .btn, .page-head .btn, .form .btn--primary, .paper-tools .btn';
  let pulled: HTMLElement | null = null;
  const release = () => { if (pulled) { pulled.style.removeProperty('--pull-x'); pulled.style.removeProperty('--pull-y'); pulled = null; } };
  const run = () => {
    frame = 0;
    if (!last) return;
    const target = last.target as Element;
    const card = target.closest<HTMLElement>(cards);
    if (card) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${last.clientX - r.left}px`);
      card.style.setProperty('--my', `${last.clientY - r.top}px`);
    }
    const magnet = target.closest<HTMLElement>(magnets);
    if (magnet !== pulled) release();
    if (magnet) {
      const r = magnet.getBoundingClientRect();
      const dx = (last.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (last.clientY - (r.top + r.height / 2)) / (r.height / 2);
      magnet.style.setProperty('--pull-x', `${(dx * 5).toFixed(1)}px`);
      magnet.style.setProperty('--pull-y', `${(dy * 4).toFixed(1)}px`);
      pulled = magnet;
    }
  };
  document.addEventListener('pointermove', (e) => { last = e; if (!frame) frame = requestAnimationFrame(run); }, { passive: true, signal });
  document.addEventListener('pointerleave', release, { signal });
  window.addEventListener('blur', release, { signal });
}

/* Footer: the time in Dhaka */
function initClock() {
  const wrap = document.querySelector<HTMLElement>('[data-clock-wrap]');
  const el = document.querySelector<HTMLElement>('[data-clock]');
  if (!wrap || !el) return;
  const format = new Intl.DateTimeFormat(el.dataset.locale || 'en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: el.dataset.timezone || 'Asia/Dhaka' });
  const tick = () => { el.textContent = format.format(new Date()); };
  tick();
  wrap.hidden = false;
  clockTimer = window.setInterval(tick, 30_000);
}

/* Visitors whose browser prefers Bangla get a one-time hint that a Bangla version exists */
function initLanguageHint() {
  if (lang() !== 'en') return;
  const alternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="bn"]');
  if (!alternate) return;
  const prefersBangla = (navigator.languages || [navigator.language]).some((l) => /^bn\b/i.test(l));
  let seen = false;
  try { seen = localStorage.getItem('lang-hint') === '1'; } catch { /* blocked */ }
  if (!prefersBangla || seen) return;
  try { localStorage.setItem('lang-hint', '1'); } catch { /* blocked */ }
  const text = document.createElement('span');
  text.lang = 'bn';
  const link = document.createElement('a');
  link.href = new URL(alternate.href).pathname;
  link.textContent = 'বাংলায় পড়ুন';
  link.dataset.langSwitch = 'bn';
  text.append('এই পাতাটি বাংলাতেও আছে। ', link);
  window.setTimeout(() => toast(text, { duration: 9000, dismissible: true }), 1500);
}

/* Owner preview (only for you): add ?preview to any address to try palettes and
   outline every placeholder. Remembered while the tab is open; × to leave. */
function initOwnerPreview() {
  const root = document.documentElement;
  const palettes: [string, string, string][] = [
    ['terracotta', 'Terracotta', '#A3402A'],
    ['bottle', 'Bottle green', '#1E5A43'],
    ['indigo', 'Indigo', '#3140A6'],
  ];
  const query = new URLSearchParams(location.search);
  let state: { on?: boolean; palette?: string; placeholders?: boolean } = {};
  try { state = JSON.parse(sessionStorage.getItem('owner-preview') || '{}'); } catch { state = {}; }
  if (query.has('preview') || query.has('palette') || query.has('placeholders')) state.on = true;
  if (query.get('preview') === 'off') state.on = false;
  if (query.has('palette')) state.palette = query.get('palette')!;
  if (query.has('placeholders')) state.placeholders = query.get('placeholders') !== 'off';
  const save = (value: object) => { try { sessionStorage.setItem('owner-preview', JSON.stringify(value)); } catch { /* ignore */ } };
  if (!state.on) { save({}); return; }

  const defaultPalette = root.dataset.defaultPalette || 'terracotta';
  state.palette ||= defaultPalette;

  const bar = document.createElement('div');
  bar.className = 'owner-preview';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Owner preview');
  bar.innerHTML = '<span class="owner-preview__label">Palette</span><span class="owner-preview__swatches"></span>' +
    '<button type="button" class="owner-preview__button" data-ph>Placeholders</button>' +
    '<button type="button" class="owner-preview__close" aria-label="Close preview">×</button>';
  const swatches = bar.querySelector('.owner-preview__swatches')!;
  palettes.forEach(([key, name, colour]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'owner-preview__swatch';
    b.title = name;
    b.setAttribute('aria-label', name);
    b.dataset.palette = key;
    b.style.setProperty('--swatch', colour);
    b.addEventListener('click', () => { state.palette = key; apply(); });
    swatches.append(b);
  });
  bar.querySelector('[data-ph]')!.addEventListener('click', () => { state.placeholders = !state.placeholders; apply(); });
  bar.querySelector('.owner-preview__close')!.addEventListener('click', () => {
    save({});
    root.setAttribute('data-palette', defaultPalette);
    root.classList.remove('outline-placeholders');
    bar.remove();
  });

  function apply() {
    root.setAttribute('data-palette', state.palette!);
    root.classList.toggle('outline-placeholders', !!state.placeholders);
    bar.querySelectorAll<HTMLElement>('.owner-preview__swatch').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.palette === state.palette)));
    bar.querySelector('[data-ph]')!.setAttribute('aria-pressed', String(!!state.placeholders));
    save(state);
  }
  document.querySelector('.owner-preview')?.remove();
  document.body.append(bar);
  apply();
}
