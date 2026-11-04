/* =====================================================================
   Sajid Kamal — site behaviour
   Everything here is an enhancement: the site works without it.
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initHeader();
  initMenu();
  initReveal();
  initFilters();
  initContactForm();
  initReadingProgress();
  initCopyButtons();
  initOwnerPreview();

  /* -------------------------------------------------------------------
     Header: solid background with a hairline once the page scrolls
     ------------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* -------------------------------------------------------------------
     Phone menu
     ------------------------------------------------------------------- */
  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.getElementById('site-menu');
    if (!toggle || !menu) return;
    var label = toggle.querySelector('[data-menu-label]');

    function setOpen(open) {
      root.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close' : 'Menu';
    }

    toggle.addEventListener('click', function () {
      setOpen(!root.classList.contains('menu-open'));
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && root.classList.contains('menu-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Close it if the window grows past the phone layout
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* -------------------------------------------------------------------
     Fade-in on scroll. Only elements that start below the fold are
     hidden, so nothing flickers on load and nothing stays hidden if
     this script fails.
     ------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length || reduceMotion || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

    var fold = window.innerHeight * 0.92;
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top < fold) return; // already on screen
      // Stagger siblings in a grid a little
      var index = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = (index % 3) * 90 + 'ms';
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /* -------------------------------------------------------------------
     Work page: filter projects by category
     ------------------------------------------------------------------- */
  function initFilters() {
    var bar = document.querySelector('[data-filter-bar]');
    if (!bar) return;
    var cards = document.querySelectorAll('[data-filter-grid] [data-category]');
    var empty = document.querySelector('[data-filter-empty]');
    bar.hidden = false;

    bar.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-filter]');
      if (!button) return;
      var filter = button.getAttribute('data-filter');
      var shown = 0;

      bar.querySelectorAll('button[data-filter]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === button));
      });
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !match;
        if (match) {
          shown++;
          card.classList.add('is-visible');
        }
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  /* -------------------------------------------------------------------
     Contact form (FormSubmit). Sends in the background and reports the
     real result; on any failure the visitor gets the email address.
     ------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form || !window.fetch) return;

    var button = form.querySelector('button[type="submit"]');
    var status = form.querySelector('.form-status');
    var buttonText = button.innerHTML;
    var endpoint = form.getAttribute('data-endpoint') || form.action;
    var fallbackEmail = form.getAttribute('data-fallback-email');

    function show(type, message, email) {
      status.className = 'form-status' + (type ? ' is-' + type : '');
      status.textContent = message;
      if (email) {
        var link = document.createElement('a');
        link.href = 'mailto:' + email;
        link.textContent = email;
        status.append(' ', link, '.');
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      button.disabled = true;
      button.textContent = 'Sending…';
      show('', '');

      fetch(endpoint, {
        method: 'POST',
        body: new URLSearchParams(new FormData(form)),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          return response.json().catch(function () { return {}; }).then(function (data) {
            // FormSubmit replies {"success": "true"}; Formspree {"ok": true}; Web3Forms {"success": true}
            var sent = response.ok && (String(data.success) === 'true' || data.ok === true);
            if (!sent) throw new Error(data.message || ('HTTP ' + response.status));
          });
        })
        .then(function () {
          form.reset();
          show('success', 'Thank you. Your message has been sent, and I’ll reply soon.');
        })
        .catch(function (error) {
          console.error('Contact form could not be sent:', error);
          show('error', 'Sorry, your message couldn’t be sent right now. Please email me directly at', fallbackEmail);
        })
        .finally(function () {
          button.disabled = false;
          button.innerHTML = buttonText;
        });
    });
  }

  /* -------------------------------------------------------------------
     Articles: thin progress bar along the top
     ------------------------------------------------------------------- */
  function initReadingProgress() {
    var bar = document.querySelector('[data-reading-progress]');
    var article = document.querySelector('[data-article] .prose');
    if (!bar || !article) return;
    var ticking = false;

    function update() {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight * 0.6;
      var progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
      bar.style.transform = 'scaleX(' + progress + ')';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* -------------------------------------------------------------------
     "Copy" buttons (the short bio on the About page)
     ------------------------------------------------------------------- */
  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(function (button) {
      var target = document.querySelector(button.getAttribute('data-copy'));
      if (!target || !navigator.clipboard) return;
      button.hidden = false;
      var original = button.textContent;

      button.addEventListener('click', function () {
        navigator.clipboard.writeText(target.textContent.trim().replace(/\s+/g, ' ')).then(function () {
          button.textContent = 'Copied';
          setTimeout(function () { button.textContent = original; }, 2000);
        });
      });
    });
  }

  /* -------------------------------------------------------------------
     Owner preview (only for you): add ?preview to any address to try the
     colour palettes and outline every placeholder. It is remembered
     while the tab is open; press × to leave.
     ------------------------------------------------------------------- */
  function initOwnerPreview() {
    var palettes = [
      ['terracotta', 'Terracotta', '#A3402A'],
      ['bottle', 'Bottle green', '#1E5A43'],
      ['indigo', 'Indigo', '#3140A6'],
      ['ink', 'Ink (dark)', '#FF8466']
    ];
    var query = new URLSearchParams(location.search);
    var state = {};
    try { state = JSON.parse(sessionStorage.getItem('owner-preview') || '{}'); } catch (e) { state = {}; }

    if (query.has('preview') || query.has('palette') || query.has('placeholders')) state.on = true;
    if (query.get('preview') === 'off') state.on = false;
    if (query.has('palette')) state.palette = query.get('palette');
    if (query.has('placeholders')) state.placeholders = query.get('placeholders') !== 'off';
    if (!state.on) return save({});

    var defaultPalette = root.getAttribute('data-default-palette') || 'terracotta';
    state.palette = state.palette || defaultPalette;
    apply();

    var bar = document.createElement('div');
    bar.className = 'owner-preview';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Owner preview');
    bar.innerHTML =
      '<span class="owner-preview__label">Palette</span>' +
      '<span class="owner-preview__swatches"></span>' +
      '<button type="button" class="owner-preview__button" data-toggle-placeholders>Placeholders</button>' +
      '<button type="button" class="owner-preview__close" aria-label="Close preview">×</button>';

    var swatches = bar.querySelector('.owner-preview__swatches');
    palettes.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'owner-preview__swatch';
      b.title = p[1];
      b.setAttribute('aria-label', p[1]);
      b.style.setProperty('--swatch', p[2]);
      b.addEventListener('click', function () { state.palette = p[0]; apply(); });
      b.dataset.palette = p[0];
      swatches.appendChild(b);
    });

    bar.querySelector('[data-toggle-placeholders]').addEventListener('click', function () {
      state.placeholders = !state.placeholders;
      apply();
    });
    bar.querySelector('.owner-preview__close').addEventListener('click', function () {
      save({});
      root.setAttribute('data-palette', defaultPalette);
      root.classList.remove('show-placeholders');
      bar.remove();
    });

    document.body.appendChild(bar);
    apply();

    function apply() {
      root.setAttribute('data-palette', state.palette);
      root.classList.toggle('show-placeholders', !!state.placeholders);
      if (typeof bar !== 'undefined' && bar) {
        bar.querySelectorAll('.owner-preview__swatch').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b.dataset.palette === state.palette));
        });
        bar.querySelector('[data-toggle-placeholders]').setAttribute('aria-pressed', String(!!state.placeholders));
      }
      save(state);
    }

    function save(value) {
      try { sessionStorage.setItem('owner-preview', JSON.stringify(value)); } catch (e) {}
    }
  }
})();
