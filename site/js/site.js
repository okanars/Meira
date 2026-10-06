/**
 * Sunum katmanı davranışları: scroll girişleri, video kontrolleri, yıl.
 * İş mantığı (teklif listesi, form, küratör) components.js içindedir.
 */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Scroll girişleri: IntersectionObserver, her öğe bir kez
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(el => io.observe(el));
  }

  // Tanıtım videoları: durdur/oynat butonu, azaltılmış harekette otomatik oynatma yok
  function initVideos() {
    document.querySelectorAll('[data-video]').forEach(figure => {
      const video = figure.querySelector('video');
      const toggle = figure.querySelector('.video-toggle');
      if (!video || !toggle) return;
      const label = toggle.querySelector('.video-toggle__label');

      function sync() {
        const paused = video.paused;
        toggle.dataset.state = paused ? 'paused' : 'playing';
        if (label) label.textContent = paused ? 'Videoyu oynat' : 'Videoyu durdur';
      }

      if (reduceMotion.matches) {
        video.removeAttribute('autoplay');
        video.pause();
      }

      toggle.addEventListener('click', () => {
        if (video.paused) {
          const p = video.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
          video.pause();
        }
      });
      video.addEventListener('play', sync);
      video.addEventListener('pause', sync);
      sync();
    });
  }

  function initYear() {
    const y = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = y; });
  }

  // Katalogdaki ürün sayısı tek kaynaktan (products.js) okunur
  function initCounts() {
    if (typeof PRODUCTS === 'undefined') return;
    document.querySelectorAll('[data-product-count]').forEach(el => { el.textContent = PRODUCTS.length; });
  }

  function init() {
    initReveal();
    initVideos();
    initYear();
    initCounts();
  }

  document.documentElement.classList.add('js');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
