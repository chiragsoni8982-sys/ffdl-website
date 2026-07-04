/* ============================================
   URBNEXA — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBlueprintCanvas();
  initHeaderScroll();
  initMobileNav();
  initScrollSpy();
  initRevealOnScroll();
  initHeroTitleAnimation();
  initStatCounters();
  initContactForm();
  initBackToTop();
  initSmoothAnchors();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* --------------------------------------------
   1. Blueprint hero canvas — draws schematic
      lines that resemble a building elevation
   -------------------------------------------- */
function initBlueprintCanvas() {
  const svg = document.getElementById('blueprint-svg');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const lines = [
    // ground line
    { d: 'M0,720 H1200', accent: false, delay: 0 },
    // building outline (simple tower elevation)
    { d: 'M780,720 V340 H1020 V720', accent: false, delay: 0.1 },
    { d: 'M780,340 L900,260 L1020,340', accent: true, delay: 0.3 },
    // floor divisions
    { d: 'M780,420 H1020', accent: false, delay: 0.4 },
    { d: 'M780,500 H1020', accent: false, delay: 0.5 },
    { d: 'M780,580 H1020', accent: false, delay: 0.6 },
    { d: 'M780,660 H1020', accent: false, delay: 0.7 },
    // crane
    { d: 'M120,720 V160 M120,160 H460 M120,220 L60,160', accent: false, delay: 0.15 },
    { d: 'M380,160 V200', accent: true, delay: 0.5 },
    // secondary low structure
    { d: 'M520,720 V560 H700 V720', accent: false, delay: 0.25 },
    { d: 'M520,560 H700', accent: false, delay: 0.45 },
    { d: 'M520,640 H700', accent: false, delay: 0.55 },
    // measurement marks
    { d: 'M1050,340 V720 M1040,340 H1060 M1040,720 H1060', accent: true, delay: 0.8 },
  ];

  lines.forEach(({ d, accent }) => {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', accent ? 'bp-line bp-accent' : 'bp-line');
    svg.appendChild(path);
  });

  // Stagger the draw-in via animation-delay, computed from path length-ish order
  const paths = svg.querySelectorAll('path');
  paths.forEach((p, i) => {
    p.style.animationDelay = `${0.15 + i * 0.12}s`;
  });
}

/* --------------------------------------------
   2. Header background on scroll
   -------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const toggle = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* --------------------------------------------
   3. Mobile nav toggle
   -------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('mobile-open');
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------
   4. Scroll-spy: highlight active nav link
   -------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------
   5. Generic reveal-on-scroll for content blocks
   -------------------------------------------- */
function initRevealOnScroll() {
  const targets = document.querySelectorAll(
    '.about-copy, .about-panel, .service-card, .contact-info, .contact-form, .section-head'
  );

  targets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // slight stagger for grouped items like service cards
          const delay = entry.target.classList.contains('service-card')
            ? Array.from(document.querySelectorAll('.service-card')).indexOf(entry.target) * 70
            : 0;
          setTimeout(() => entry.target.classList.add('in-view'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* --------------------------------------------
   6. Hero title line-by-line rise animation
   -------------------------------------------- */
function initHeroTitleAnimation() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  // Trigger immediately on load since it's above the fold
  requestAnimationFrame(() => title.classList.add('in-view'));
}

/* --------------------------------------------
   7. Animated stat counters (Home section)
   -------------------------------------------- */
function initStatCounters() {
  const statEls = document.querySelectorAll('.stat');
  if (!statEls.length) return;

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const numSpan = el.querySelector('.stat-num');
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = Math.round(eased * target);
      numSpan.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        numSpan.textContent = target;
      }
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  statEls.forEach((el) => observer.observe(el));
}

/* --------------------------------------------
   8. Contact form validation + fake submit
   -------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('.btn-submit');
  const submitText = form.querySelector('.btn-submit-text');

  const fields = {
    name: {
      el: document.getElementById('name'),
      errorEl: document.getElementById('name-error'),
      validate: (v) => v.trim().length >= 2,
      message: 'Please enter your full name.',
    },
    email: {
      el: document.getElementById('email'),
      errorEl: document.getElementById('email-error'),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'Please enter a valid email address.',
    },
    phone: {
      el: document.getElementById('phone'),
      errorEl: document.getElementById('phone-error'),
      validate: (v) => v.trim() === '' || /^[\d\s+\-()]{7,}$/.test(v.trim()),
      message: 'Please enter a valid phone number.',
    },
    message: {
      el: document.getElementById('message'),
      errorEl: document.getElementById('message-error'),
      validate: (v) => v.trim().length >= 10,
      message: 'Please add a few details about your project (min. 10 characters).',
    },
  };

  const validateField = (key) => {
    const field = fields[key];
    const valid = field.validate(field.el.value);
    const wrapper = field.el.closest('.form-field');
    if (!valid) {
      wrapper.classList.add('error');
      field.errorEl.textContent = field.message;
    } else {
      wrapper.classList.remove('error');
      field.errorEl.textContent = '';
    }
    return valid;
  };

  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      const wrapper = fields[key].el.closest('.form-field');
      if (wrapper.classList.contains('error')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = Object.keys(fields).map((key) => validateField(key));
    const allValid = results.every(Boolean);

    if (!allValid) {
      statusEl.textContent = 'Please fix the highlighted fields and try again.';
      statusEl.className = 'form-status error';
      return;
    }

    // Simulate async submission (no backend wired up)
    submitBtn.disabled = true;
    submitText.textContent = 'Sending…';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitText.textContent = 'Send Inquiry';
      statusEl.textContent = 'Thanks — your inquiry has been received. We\'ll be in touch within one business day.';
      statusEl.className = 'form-status success';
      form.reset();
    }, 1100);
  });
}

/* --------------------------------------------
   9. Back-to-top button
   -------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  };

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------
   10. Smooth anchor scrolling with header offset
   -------------------------------------------- */
function initSmoothAnchors() {
  const header = document.getElementById('header');
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
