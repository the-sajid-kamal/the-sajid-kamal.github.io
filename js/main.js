/* ============================================
   Main JavaScript - Interactive Features
   ============================================ */

// Visitors can ask their device for less motion (an accessibility setting on
// iOS, Android, macOS and Windows). When they do, every effect below either
// switches off or shows its end state straight away.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initCustomCursor();
    initNavigation();
    initParticleBackground();
    initTypingEffect();
    initCounterAnimation();
    initScrollAnimations();
    initSkillBars();
    initSmoothScroll();
    initContactForm();
    initHeroParallax();
});

/* ============================================
   Custom Cursor
   ============================================ */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (!cursor || !follower) return;

    // Only for a real mouse or trackpad. Phones and tablets keep their normal behaviour.
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer || prefersReducedMotion) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    let visible = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!visible) {
            // Appear where the mouse is, instead of sliding in from the top-left corner
            cursorX = followerX = mouseX;
            cursorY = followerY = mouseY;
            root.classList.add('cursor-visible');
            visible = true;
        }
    });

    root.addEventListener('mouseleave', () => {
        root.classList.remove('cursor-visible');
        visible = false;
    });

    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows immediately
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower has delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .timeline-content, .skill-category, .contact-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hover'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
}

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        updateActiveLink();
    }, { passive: true });

    function setMenuOpen(open) {
        navToggle?.classList.toggle('active', open);
        navMenu?.classList.toggle('active', open);
        navToggle?.setAttribute('aria-expanded', String(open));
    }

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        setMenuOpen(!navMenu.classList.contains('active'));
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    // Close menu with the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            setMenuOpen(false);
            navToggle?.focus();
        }
    });

    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ============================================
   Particle Background (js/particles.js)
   ============================================ */
function initParticleBackground() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof ParticleSystem === 'undefined') return;

    // With reduced motion the particles are drawn once and stay still
    new ParticleSystem(canvas, { animate: !prefersReducedMotion });
}

/* ============================================
   Typing Effect
   ============================================ */
function initTypingEffect() {
    const typedElement = document.querySelector('.typed-text');
    if (!typedElement) return;

    const words = [
        'data-driven insights',
        'creative campaigns',
        'strategic branding',
        'digital innovation',
        'market leadership'
    ];

    if (prefersReducedMotion) {
        typedElement.textContent = words[0];
        typedElement.classList.add('is-static');
        return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typedElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typedElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* ============================================
   Counter Animation
   The final numbers ("6+", "100+", "140%") are written in the HTML, so they
   are right even without JavaScript or with reduced motion. Here we count
   up to them from zero when they scroll into view.
   ============================================ */
function initCounterAnimation() {
    if (prefersReducedMotion) return;

    const counters = document.querySelectorAll('.stat-number[data-count]');

    counters.forEach(counter => {
        counter.textContent = '0' + (counter.dataset.suffix || '');
    });

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const suffix = element.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        const updateCounter = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out
            element.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(updateCounter);
        };

        requestAnimationFrame(updateCounter);
    }
}

/* ============================================
   Scroll Animations (AOS-like)
   ============================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    if (prefersReducedMotion) {
        animatedElements.forEach(el => el.classList.add('aos-animate'));
        return;
    }

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-aos-delay'), 10) || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));
}

/* ============================================
   Skill Bars Animation
   ============================================ */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.getAttribute('data-width') + '%';
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
}

/* ============================================
   Smooth Scroll
   ============================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });
}

/* ============================================
   Contact Form
   Sends the message to FormSubmit's JSON endpoint (data-endpoint on the
   form) so the visitor stays on the page, then reports the real result.
   If anything goes wrong, the visitor is given the email address instead.
   ============================================ */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    const originalButton = submitBtn.innerHTML;
    const endpoint = form.dataset.endpoint || form.action;
    const fallbackEmail = form.dataset.fallbackEmail;

    function showStatus(type, message, email) {
        if (!status) return;
        status.className = 'form-status' + (type ? ` is-${type}` : '');
        status.textContent = message;
        if (email) {
            const link = document.createElement('a');
            link.href = `mailto:${email}`;
            link.textContent = email;
            status.append(' ', link, '.');
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';
        showStatus('', '');

        try {
            // Sent as ordinary form fields (not JSON), so the browser needs no
            // extra CORS round trip before the actual request.
            const response = await fetch(endpoint, {
                method: 'POST',
                body: new URLSearchParams(new FormData(form)),
                headers: { 'Accept': 'application/json' }
            });

            const data = await response.json().catch(() => ({}));

            // FormSubmit replies {"success": "true"} (a string). Formspree ({"ok": true})
            // and Web3Forms ({"success": true}) are accepted too, in case the site
            // switches provider later.
            const sent = response.ok && (String(data.success) === 'true' || data.ok === true);
            if (!sent) {
                // e.g. "This form needs Activation..." before the address is activated
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            form.reset();
            showStatus('success', "Thanks! Your message has been sent. I'll get back to you soon.");
        } catch (error) {
            console.error('Contact form could not be sent:', error);
            showStatus(
                'error',
                fallbackEmail
                    ? "Sorry, your message couldn't be sent right now. Please email me directly at"
                    : "Sorry, your message couldn't be sent right now. Please try again later.",
                fallbackEmail
            );
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalButton;
        }
    });
}

/* ============================================
   Parallax Effect on Hero
   ============================================ */
function initHeroParallax() {
    const hero = document.querySelector('.hero-content');
    if (!hero || prefersReducedMotion) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            // Nothing to do once the hero is well out of view
            if (scrolled < window.innerHeight * 1.5) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                hero.style.opacity = Math.max(0, 1 - scrolled / 700);
            }
            ticking = false;
        });
    }, { passive: true });
}

/* ============================================
   Preloader (optional)
   ============================================ */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
