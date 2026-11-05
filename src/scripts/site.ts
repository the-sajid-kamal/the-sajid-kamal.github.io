// =====================================================================
//  Site behaviour. Everything here is an enhancement: every page works
//  and shows all its content without it.
//  Runs on the first page load and again after each page change
//  (the site uses smooth page transitions).
// =====================================================================

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let pageAbort: AbortController | null = null;
let clockTimer: number | undefined;

document.addEventListener('astro:page-load', () => {
  pageAbort?.abort();
  pageAbort = new AbortController();
  const signal = pageAbort.signal;
  window.clearInterval(clockTimer);

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
  initClock();
  initOwnerPreview();
});

/* Header: solid background with a hairline once the page scrolls */
function initHeader(signal: AbortSignal) {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let ticking = false;
  const update = () => { header.classList.toggle('is-scrolled', window.scrollY > 8); ticking = false; };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true, signal });
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
    if (label) label.textContent = open ? 'Close' : 'Menu';
  };
  toggle.addEventListener('click', () => setOpen(!root.classList.contains('menu-open')), { signal });
  menu.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setOpen(false); }, { signal });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
  }, { signal });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); }, { signal });
}

/* Light / dark switch (remembered on this device) */
function initThemeToggle() {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button) return;
  const root = document.documentElement;
  const sync = () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  sync();
  button.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch { /* private mode */ }
    sync();
  });
}

/* Any paragraph or list item in an article that starts with "[" is a placeholder */
function markPlaceholders() {
  document.querySelectorAll('.prose p, .prose li, .prose h2, .prose h3, .prose blockquote').forEach((el) => {
    if (el.textContent?.trim().startsWith('[')) el.classList.add('placeholder');
  });
}

/* Fade-in on scroll. Only elements that start below the fold are hidden. */
function initReveal() {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length || reduceMotion() || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  const fold = window.innerHeight * 0.94;
  items.forEach((el) => {
    if (el.getBoundingClientRect().top < fold) return;
    const index = Array.prototype.indexOf.call(el.parentElement?.children ?? [], el);
    el.style.transitionDelay = `${(index % 3) * 90}ms`;
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* Numbers count up from zero when they appear (final values are already in the HTML) */
function initCountUp() {
  const numbers = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!numbers.length || reduceMotion() || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target as HTMLElement;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / 1600, 1);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  numbers.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible: leave it
    el.textContent = '0';
    observer.observe(el);
  });
}

/* "How I can help" tabs, with arrow keys and links like /#for-investors */
function initTabs(signal: AbortSignal) {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((wrap) => {
    const tabs = Array.from(wrap.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls') || ''));
    if (!tabs.length) return;

    const select = (i: number, focus = false) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (panels[j]) panels[j]!.hidden = !on;
      });
      if (focus) tabs[i].focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i), { signal });
      tab.addEventListener('keydown', (e) => {
        const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
        if (e.key in keys) { e.preventDefault(); select((i + keys[e.key] + tabs.length) % tabs.length, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
      }, { signal });
    });

    const fromHash = () => {
      const i = panels.findIndex((p) => p && `#${p.id}` === location.hash);
      if (i >= 0) { select(i); wrap.scrollIntoView({ block: 'start' }); }
    };
    wrap.classList.add('is-ready');
    select(0);
    fromHash();
    window.addEventListener('hashchange', fromHash, { signal });
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
  });
}

/* Contact form: sends in the background and reports the real result */
function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const status = form.querySelector<HTMLElement>('.form-status')!;
  const buttonHtml = button.innerHTML;
  const fallbackEmail = form.dataset.fallbackEmail || '';

  // Pre-select the topic from links like /contact/?topic=consulting
  const topic = new URLSearchParams(location.search).get('topic');
  const select = form.querySelector<HTMLSelectElement>('select[name="topic"]');
  if (topic && select && Array.from(select.options).some((o) => o.value === topic)) select.value = topic;

  // Cloudflare Turnstile (only if a site key is set in site.config.ts)
  const widget = form.querySelector<HTMLElement>('.cf-turnstile');
  if (widget) loadTurnstile(widget);

  const show = (type: '' | 'success' | 'error', message: string, email?: string) => {
    status.className = 'form-status' + (type ? ` is-${type}` : '');
    status.textContent = message;
    if (email) {
      const link = document.createElement('a');
      link.href = `mailto:${email}`;
      link.textContent = email;
      status.append(' ', link, '.');
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    button.disabled = true;
    button.textContent = 'Sending…';
    show('', '');
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
      show('success', 'Thank you. Your message has been sent, and I’ll reply soon.');
      (window as any).turnstile?.reset?.();
    } catch (error) {
      console.error('Contact form could not be sent:', error);
      show('error', 'Sorry, your message couldn’t be sent right now. Please email me directly at', fallbackEmail);
    } finally {
      button.disabled = false;
      button.innerHTML = buttonHtml;
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

/* Articles: thin progress bar along the top */
function initReadingProgress(signal: AbortSignal) {
  const bar = document.querySelector<HTMLElement>('[data-reading-progress]');
  const article = document.querySelector<HTMLElement>('[data-article] .prose');
  if (!bar || !article) return;
  let ticking = false;
  const update = () => {
    const rect = article.getBoundingClientRect();
    const total = rect.height - window.innerHeight * 0.6;
    const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
    bar.style.transform = `scaleX(${progress})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true, signal });
  update();
}

/* "Copy" buttons: the short bio and article links */
function initCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    if (!navigator.clipboard) return;
    button.hidden = false;
    const original = button.textContent;
    button.addEventListener('click', async () => {
      const source = button.dataset.copy!;
      const text = source === 'url' ? location.href : document.querySelector(source)?.textContent?.trim().replace(/\s+/g, ' ') ?? '';
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied';
        setTimeout(() => { button.textContent = original; }, 2000);
      } catch { /* clipboard blocked */ }
    });
  });
}

/* Footer: the time in Dhaka */
function initClock() {
  const wrap = document.querySelector<HTMLElement>('[data-clock-wrap]');
  const el = document.querySelector<HTMLElement>('[data-clock]');
  if (!wrap || !el) return;
  const format = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: el.dataset.timezone || 'Asia/Dhaka' });
  const tick = () => { el.textContent = format.format(new Date()); };
  tick();
  wrap.hidden = false;
  clockTimer = window.setInterval(tick, 30_000);
}

/* Owner preview (only for you): add ?preview to any address to see unfinished
   content, try palettes and outline every placeholder. Remembered while the tab
   is open; × to leave. Visitors never see unfinished content. */
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
    root.classList.remove('show-drafts', 'outline-placeholders');
    bar.remove();
  });

  function apply() {
    root.setAttribute('data-palette', state.palette!);
    root.classList.add('show-drafts');
    root.classList.toggle('outline-placeholders', !!state.placeholders);
    bar.querySelectorAll<HTMLElement>('.owner-preview__swatch').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.palette === state.palette)));
    bar.querySelector('[data-ph]')!.setAttribute('aria-pressed', String(!!state.placeholders));
    save(state);
  }
  document.querySelector('.owner-preview')?.remove();
  document.body.append(bar);
  apply();
}
