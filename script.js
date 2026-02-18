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
  const prev = document.querySelector('.gallery-nav.prev');
  const next = document.querySelector('.gallery-nav.next');
  if (!gallery || !prev || !next) return;

  const scrollByCard = (dir) => {
    const item = gallery.querySelector('.gallery-item');
    const gap = 14;
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

  const open = (src, alt) => {
    imgEl.src = src;
    imgEl.alt = alt || 'Enlarged facility photo';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.setAttribute('aria-hidden', 'true');
    imgEl.src = '';
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.classList && t.classList.contains('gallery-img')) {
      const full = t.getAttribute('data-full') || t.getAttribute('src');
      open(full, t.getAttribute('alt'));
    }
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') close();
  });
})();
