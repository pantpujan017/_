/* ─────────────────────────────────────────────
   main.js — Pujan Pant Research Site
   Handles: scroll reveal · nav behavior · mobile menu
   No dependencies. Vanilla JS only.
   ───────────────────────────────────────────── */

(function () {
  'use strict';

  // ── SCROLL REVEAL ──────────────────────────
  // Targets .reveal (section bodies) and .reveal-child (staggered items)
  // .reveal becoming visible also triggers its .reveal-child descendants

  const revealParents  = document.querySelectorAll('.reveal');
  const revealChildren = document.querySelectorAll('.reveal-child');

  const observerOpts = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const parentObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // also fire children inside this parent
        entry.target.querySelectorAll('.reveal-child').forEach(function (child) {
          child.classList.add('visible');
        });

        parentObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  revealParents.forEach(function (el) {
    parentObserver.observe(el);
  });

  // Children outside a .reveal parent (if any exist standalone)
  const childObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        childObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  revealChildren.forEach(function (el) {
    // Only observe children not inside a .reveal (those are handled above)
    if (!el.closest('.reveal')) {
      childObserver.observe(el);
    }
  });

  // ── NAV: SCROLL-AWARE OPACITY ──────────────
  // Dim the nav background once user scrolls past hero
  const nav = document.querySelector('.nav');

  function updateNav () {
    if (window.scrollY > 60) {
      nav.style.background = 'var(--bg)';
    } else {
      nav.style.background = '';
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── ACTIVE NAV LINK ─────────────────────────
  // Highlight the nav link matching the section currently in view
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(function (sec) { sectionObserver.observe(sec); });

  // ── MOBILE MENU TOGGLE ───────────────────────
  const toggle   = document.querySelector('.nav-toggle');
  const linksEl  = document.querySelector('.nav-links');

  if (toggle && linksEl) {
    toggle.addEventListener('click', function () {
      const isOpen = linksEl.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      // Animate hamburger → X
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.transform = '';
      }
    });

    // Close menu when a link is clicked
    linksEl.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        linksEl.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.transform = '';
      });
    });
  }

  // ── SMOOTH SCROLL POLYFILL ───────────────────
  // Fallback for browsers without native smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
