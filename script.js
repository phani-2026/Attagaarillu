/* ══════════════════════════════════════════
   ATTAGAARILLU – script.js
   Navbar • Carousel • Menu Tabs • Gallery
   Emotions • Scroll Reveal • Back to Top
══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── NAVBAR ── */
  const navbar     = document.getElementById('navbar');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNavLink();
    toggleBackToTop();
    triggerScrollReveal();
    triggerEmotionBars();
  }, { passive: true });

  navToggle && navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav on link click (mobile)
  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── ACTIVE NAV LINK ── */
  const sections = document.querySelectorAll('section[id], footer[id]');
  function updateActiveNavLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinkEls.forEach(link => {
      link.classList.toggle(
        'active-nav',
        link.getAttribute('href') === `#${current}`
      );
    });
  }

  /* ── SMOOTH SCROLL for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── TESTIMONIAL CAROUSEL ── */
  const track     = document.getElementById('testimonialTrack');
  const prevBtn   = document.getElementById('testimonialPrev');
  const nextBtn   = document.getElementById('testimonialNext');
  const dotsWrap  = document.getElementById('carouselDots');

  if (track) {
    const slides    = track.querySelectorAll('.testimonial-slide');
    let current     = 0;
    let autoInterval;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function goTo(idx) {
      current = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    }

    function startAuto() {
      stopAuto();
      autoInterval = setInterval(() => goTo(current + 1), 5000);
    }
    function stopAuto() { clearInterval(autoInterval); }

    prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? goTo(current + 1) : goTo(current - 1); startAuto(); }
    }, { passive: true });

    startAuto();
  }

  /* ── MENU FILTER TABS ── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.tab;
      menuCards.forEach(card => {
        const cats = (card.dataset.category || '').split(/\s+/);
        const show = filter === 'all' || cats.includes(filter);
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  /* ── EMOTION BARS ANIMATION ── */
  let emotionAnimated = false;
  function triggerEmotionBars() {
    if (emotionAnimated) return;
    const section = document.querySelector('#testimonials');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      emotionAnimated = true;
      document.querySelectorAll('.emotion-bar').forEach(bar => {
        bar.style.width = bar.style.getPropertyValue('--w') || bar.getAttribute('style').match(/--w:([^;]+)/)?.[1] || '0%';
      });
    }
  }

  /* ── SCROLL REVEAL ── */
  function addRevealClasses() {
    const selectors = [
      '#about .about-content',
      '#about .about-visual',
      '#menu .menu-card',
      '#why-us .why-card',
      '#experience .experience-content',
      '#experience .experience-visual',
      '#gallery .gallery-item',
      '#contact .contact-card',
      '#contact .contact-cta-block',
      '#testimonials .emotion-bar-section',
    ];
    selectors.forEach((sel, si) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 4) * 0.1}s`;
      });
    });
    // Directional reveals
    document.querySelector('.about-visual')?.classList.add('reveal-left');
    document.querySelector('.about-content')?.classList.add('reveal-right');
    document.querySelector('.experience-visual')?.classList.add('reveal-left');
    document.querySelector('.experience-content')?.classList.add('reveal-right');
  }

  function triggerScrollReveal() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) el.classList.add('visible');
    });
  }

  // Run on load
  addRevealClasses();
  setTimeout(triggerScrollReveal, 100);

  /* ── GALLERY LIGHTBOX ── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  // Create lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image lightbox');
  lb.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,.92); backdrop-filter:blur(12px);
    align-items:center; justify-content:center; cursor:zoom-out;
  `;
  const lbImg = document.createElement('img');
  lbImg.style.cssText = 'max-width:90vw; max-height:88vh; border-radius:12px; box-shadow:0 0 80px rgba(0,0,0,.8); object-fit:contain;';
  const lbClose = document.createElement('button');
  lbClose.innerHTML = '✕';
  lbClose.setAttribute('aria-label', 'Close lightbox');
  lbClose.style.cssText = `
    position:absolute; top:20px; right:24px; color:#fff; font-size:1.5rem;
    background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.2);
    border-radius:50%; width:44px; height:44px; cursor:pointer; display:flex;
    align-items:center; justify-content:center; transition:all .2s ease;
  `;
  lb.appendChild(lbImg);
  lb.appendChild(lbClose);
  document.body.appendChild(lb);

  galleryItems.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const src = item.querySelector('img').src;
      const alt = item.querySelector('img').alt;
      lbImg.src = src;
      lbImg.alt = alt;
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  }
  lb.addEventListener('click', e => { if (e.target === lb || e.target === lbClose) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ── BACK TO TOP ── */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── INTERSECTION OBSERVER fallback for older browsers ── */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
  }

  /* ── NAVBAR active style injection ── */
  const style = document.createElement('style');
  style.textContent = `.active-nav { color: var(--gold) !important; }`;
  document.head.appendChild(style);

  /* ── On DOM ready ── */
  document.addEventListener('DOMContentLoaded', () => {
    triggerScrollReveal();
    triggerEmotionBars();
  });

})();
