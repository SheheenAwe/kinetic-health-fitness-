/* ================================
   GALLERY NAVIGATION (SCROLL SNAP)
================================ */

(() => {
  const gallery = document.querySelector('.gallery');
  const prev = document.querySelector('.gallery-arrow.prev');
  const next = document.querySelector('.gallery-arrow.next');

  if (!gallery || !prev || !next) return;

  const items = Array.from(gallery.querySelectorAll('.gallery-item'));
  let index = 0;

  const scrollToIndex = (i) => {
    if (!items.length) return;

    index = Math.max(0, Math.min(items.length - 1, i));
    items[index].scrollIntoView({
      behavior: 'smooth',
      inline: 'center'
    });
  };

  prev.addEventListener('click', () => {
    scrollToIndex(index - 1);
  });

  next.addEventListener('click', () => {
    scrollToIndex(index + 1);
  });

  gallery.addEventListener('scroll', () => {
    const center = gallery.scrollLeft + gallery.offsetWidth / 2;

    items.forEach((item, i) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;

      if (Math.abs(center - itemCenter) < item.offsetWidth / 2) {
        index = i;
      }
    });
  });
})();
