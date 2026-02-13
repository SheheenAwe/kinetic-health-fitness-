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
