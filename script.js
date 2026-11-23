(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Seamless Compact Animated O.B.E. Emblem (Always Autoplay + Click Toggle)
     ------------------------------------------------------------------------ */
  function initMotionEmblem() {
    const trigger = document.querySelector('.obe-motion-trigger');
    const video = document.querySelector('.obe-motion-video');
    const hint = document.querySelector('.obe-motion-hint');

    if (!trigger || !video) return;

    // Keep compact brand emblem reliably looping & autoplaying regardless of OS motion setting
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    function syncState() {
      const isPaused = video.paused;
      trigger.dataset.state = isPaused ? 'paused' : 'playing';
      trigger.setAttribute('aria-pressed', String(isPaused));
      trigger.setAttribute(
        'aria-label',
        isPaused ? 'Play O.B.E. animated brand emblem' : 'Pause O.B.E. animated brand emblem'
      );
      if (hint) {
        hint.textContent = isPaused ? 'Paused · Play' : 'Pause';
      }
    }

    function attemptAutoplay() {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(syncState).catch(syncState);
      } else {
        syncState();
      }
    }

    trigger.addEventListener('click', () => {
      if (video.paused) {
        video.play().then(syncState).catch(syncState);
      } else {
        video.pause();
        syncState();
      }
    });

    video.addEventListener('play', syncState);
    video.addEventListener('pause', syncState);

    if (video.readyState >= 2) {
      attemptAutoplay();
    } else {
      video.addEventListener('loadeddata', attemptAutoplay, { once: true });
      attemptAutoplay();
    }
  }

  /* ------------------------------------------------------------------------
     2. Filterable Portfolio Grid with Subtle Reveal Transitions
     ------------------------------------------------------------------------ */
  function initPortfolioFilters() {
    const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
    const cards = Array.from(document.querySelectorAll('.project-card'));

    if (!filterButtons.length || !cards.length) return;

    function applyFilter(category) {
      let visibleCount = 0;

      cards.forEach((card) => {
        const matches = category === 'all' || card.dataset.category === category;
        card.classList.remove('is-entering');

        if (matches) {
          card.classList.remove('is-hidden');
          // Restart subtle entrance animation with gentle stagger
          void card.offsetWidth;
          card.style.animationDelay = `${Math.min(visibleCount * 45, 225)}ms`;
          card.classList.add('is-entering');
          visibleCount += 1;
        } else {
          card.classList.add('is-hidden');
          card.style.animationDelay = '';
        }
      });
    }

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter || 'all';

        filterButtons.forEach((other) => {
          const isActive = other === btn;
          other.classList.toggle('active', isActive);
          other.setAttribute('aria-pressed', String(isActive));
        });

        applyFilter(category);
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. Mobile Navigation Drawer & Sticky Header Elevation
     ------------------------------------------------------------------------ */
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.getElementById('primary-nav-links');

    if (header) {
      const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (toggle && navLinks) {
      function closeMenu() {
        toggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      }

      toggle.addEventListener('click', () => {
        const nextExpanded = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(nextExpanded));
        navLinks.classList.toggle('is-open', nextExpanded);
      });

      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
          closeMenu();
          toggle.focus();
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMotionEmblem();
    initPortfolioFilters();
    initNavigation();
  });
})();
