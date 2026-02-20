// Minimal JS for hamburger menu (fast + accessible)
(() => {
  const btn = document.querySelector('.menu-btn');
  const panel = document.getElementById('menuPanel');
  const links = panel?.querySelectorAll('a.menu-link') || [];

  if (!btn || !panel) return;

  const closeMenu = () => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
  };

  btn.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  links.forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (!panel.classList.contains('open')) return;
    const target = e.target;
    if (target === btn || btn.contains(target)) return;
    if (target === panel || panel.contains(target)) return;
    closeMenu();
  });
})();


// Gallery nav (desktop). Safe no-op if gallery not present.
(() => {
  const gallery = document.querySelector('.gallery');
  const prev = document.querySelector('.gallery-arrow.prev');
  const next = document.querySelector('.gallery-arrow.next');
  if (!gallery || !prev || !next) return;

  const scrollByCard = (dir) => {
    const item = gallery.querySelector('.gallery-item');
    const gap = 12;
    const width = item ? item.getBoundingClientRect().width : 600;
    gallery.scrollBy({ left: dir * (width + gap), behavior: 'smooth' });
  };

  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));
})();


// Lightbox for gallery images
(() => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const imgEl = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
  const nextBtn = lightbox.querySelector('.lightbox-arrow.next');

  const galleryImgs = Array.from(document.querySelectorAll('.gallery-img'));
  let idx = -1;

  const render = () => {
    if (!galleryImgs.length) return;
    if (idx < 0) idx = 0;
    if (idx >= galleryImgs.length) idx = galleryImgs.length - 1;
    const t = galleryImgs[idx];
    const full = t.getAttribute('data-full') || t.getAttribute('src');
    imgEl.src = full;
    imgEl.alt = t.getAttribute('alt') || 'Enlarged facility photo';
  };

  const next = () => {
    if (!galleryImgs.length) return;
    idx = (idx + 1) % galleryImgs.length;
    render();
  };

  const prev = () => {
    if (!galleryImgs.length) return;
    idx = (idx - 1 + galleryImgs.length) % galleryImgs.length;
    render();
  };

  const open = (src, alt, startIndex) => {
    imgEl.src = src;
    imgEl.alt = alt || 'Enlarged facility photo';
    idx = (typeof startIndex === 'number') ? startIndex : galleryImgs.findIndex((i) => (i.getAttribute('data-full') || i.getAttribute('src')) === src);
    if (idx < 0) idx = 0;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.setAttribute('aria-hidden', 'true');
    imgEl.src = '';
    document.body.style.overflow = '';
  };

  const isOpen = () => lightbox.getAttribute('aria-hidden') === 'false';

  // Keyboard navigation in lightbox
  const onKey = (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') return close();
    if (e.key === 'ArrowRight') return next();
    if (e.key === 'ArrowLeft') return prev();
  };
  document.addEventListener('keydown', onKey);

  // Swipe navigation in lightbox
  let startX = null;
  let startY = null;
  lightbox.addEventListener('touchstart', (e) => {
    if (!isOpen()) return;
    if (e.touches && e.touches.length === 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    if (!isOpen()) return;
    if (startX === null || startY === null) return;
    const t = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : null;
    if (!t) return;
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    startX = null;
    startY = null;

    // Horizontal swipe threshold + ignore mostly vertical swipes
    if (Math.abs(dx) < 50) return;
    if (Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  }, { passive: true });

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.classList && t.classList.contains('gallery-img')) {
      const full = t.getAttribute('data-full') || t.getAttribute('src');
      const startIndex = galleryImgs.indexOf(t);
      open(full, t.getAttribute('alt'), startIndex);
    }
  });

  closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') close();
  });
})();


/* ================================
   GALLERY NAVIGATION (CENTER ACCURATE)
   Fixes iOS/Safari partial scroll issues
================================ */
(() => {
  const gallery = document.querySelector('.gallery');
  const prev = document.querySelector('.gallery-nav.prev, .gallery-arrow.prev');
  const next = document.querySelector('.gallery-nav.next, .gallery-arrow.next');
  if (!gallery || !prev || !next) return;

  const getItems = () => Array.from(gallery.querySelectorAll('.gallery-item'));
  let index = 0;

  const centerScrollLeftFor = (el) => {
    const galleryRect = gallery.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const elCenterFromGalleryLeft = (elRect.left - galleryRect.left) + (elRect.width / 2);
    return gallery.scrollLeft + elCenterFromGalleryLeft - (galleryRect.width / 2);
  };

  const scrollToIndex = (i) => {
    const items = getItems();
    if (!items.length) return;

    index = Math.max(0, Math.min(items.length - 1, i));
    const targetLeft = centerScrollLeftFor(items[index]);
    gallery.scrollTo({ left: targetLeft, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => scrollToIndex(index - 1));
  next.addEventListener('click', () => scrollToIndex(index + 1));

  let raf = null;
  gallery.addEventListener('scroll', () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const items = getItems();
      if (!items.length) return;

      const galleryCenter = gallery.scrollLeft + (gallery.clientWidth / 2);
      let best = 0;
      let bestDist = Infinity;

      items.forEach((el, i) => {
        const elCenter = el.offsetLeft + (el.offsetWidth / 2);
        const d = Math.abs(elCenter - galleryCenter);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });

      index = best;
    });
  });

  window.addEventListener('resize', () => {
    setTimeout(() => scrollToIndex(index), 50);
  });
})();

