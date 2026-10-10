/**
 * Sunum katmanı davranışları: scroll girişleri, video kontrolleri, yıl.
 * İş mantığı (teklif listesi, form, küratör) components.js içindedir.
 */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;

  // Açılış perdesi (yalnızca ana sayfa, oturumun ilk açılışı). Karar <head> içinde verilir (has-intro);
  // zamanlama CSS'tedir. Burada: sayfa kaydırması kilitlenir, tıklama veya tuş perdeyi geçer,
  // süre dolunca kilit kalkar. Her sayfa oturum bayrağını yazar; site başka bir sayfadan açıldıysa
  // ana sayfaya gelindiğinde perde oynamaz.
  function initIntro() {
    try { sessionStorage.setItem('meira-visited', '1'); } catch (e) { /* gizli mod vb. */ }
    if (!root.classList.contains('has-intro')) return;
    const INTRO_MS = 2100;
    document.body.classList.add('is-locked');
    let done = false;
    function finish(skipped) {
      if (done) return;
      done = true;
      if (skipped) root.classList.add('intro-skip');
      root.classList.add('intro-done');
      document.body.classList.remove('is-locked');
      window.removeEventListener('pointerdown', onSkip, true);
      window.removeEventListener('keydown', onSkip, true);
    }
    function onSkip() { finish(true); }
    window.addEventListener('pointerdown', onSkip, true);
    window.addEventListener('keydown', onSkip, true);
    setTimeout(() => finish(false), INTRO_MS);
  }

  // Scroll girişleri: IntersectionObserver, her öğe bir kez
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-in'));
      return;
    }
    // Aynı anda görünüme giren kardeşler kademeli girer (60 ms arayla, en fazla 4 kademe)
    const io = new IntersectionObserver(entries => {
      const perParent = new Map();
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const n = perParent.get(el.parentElement) || 0;
        el.style.setProperty('--i', Math.min(n, 4));
        perParent.set(el.parentElement, n + 1);
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(el => io.observe(el));
  }

  // Tanıtım videoları: durdur/oynat butonu, azaltılmış harekette otomatik oynatma yok
  // Tanıtım videoları: ekrana yaklaşınca yüklenip sessiz oynar, ekrandan çıkınca durur (gereksiz indirme yok).
  // Durdur/oynat düğmesiyle durdurulan video kendiliğinden yeniden başlamaz. Azaltılmış harekette otomatik oynatma yok.
  function initVideos() {
    const autoplayAllowed = !reduceMotion.matches && 'IntersectionObserver' in window;
    document.querySelectorAll('[data-video]').forEach(figure => {
      const video = figure.querySelector('video');
      const toggle = figure.querySelector('.video-toggle');
      if (!video || !toggle) return;
      const label = toggle.querySelector('.video-toggle__label');
      let userPaused = false;

      function sync() {
        const paused = video.paused;
        toggle.dataset.state = paused ? 'paused' : 'playing';
        if (label) label.textContent = paused ? 'Videoyu oynat' : 'Videoyu durdur';
      }
      function play() {
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }

      toggle.addEventListener('click', () => {
        if (video.paused) { userPaused = false; play(); }
        else { userPaused = true; video.pause(); }
      });
      video.addEventListener('play', sync);
      video.addEventListener('pause', sync);
      sync();

      if (autoplayAllowed && video.hasAttribute('data-autoplay')) {
        new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) { if (!userPaused) play(); }
          else if (!video.paused) video.pause();
        }, { rootMargin: '200px 0px' }).observe(video);
      }
    });
  }


  // Ürün videoları (ana sayfa): kapak kartı tek bir <dialog> oynatıcı açar. Video yalnızca açılınca yüklenir;
  // pencere kapanınca durur ve kaynak bırakılır. Esc ve odak tuzağı <dialog>'un kendisinden gelir.
  function initVideoDialog() {
    const dialog = document.getElementById('videoDialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const video = dialog.querySelector('video');
    const title = dialog.querySelector('.video-dialog__title');
    const text = dialog.querySelector('.video-dialog__text');
    const meta = dialog.querySelector('.video-dialog__meta');

    document.querySelectorAll('[data-video-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        title.textContent = btn.dataset.title || '';
        if (text) text.textContent = btn.dataset.summary || '';
        meta.textContent = btn.dataset.meta || '';
        video.poster = btn.dataset.poster || '';
        video.src = btn.dataset.src;
        dialog.showModal();
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      });
    });
    dialog.querySelector('[data-video-close]')?.addEventListener('click', () => dialog.close());
    // Arka plana tıklama: hedef <dialog>'un kendisiyse (içerik değil) kapat
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    });
  }

  // Ürün sayfası: renk sürümleri arasında video geçişi (ör. CK-644 siyah / beyaz)
  function initVideoSwitch() {
    document.querySelectorAll('[data-video-player]').forEach(root => {
      const buttons = root.querySelectorAll('[data-video-switch]');
      const video = root.querySelector('video');
      if (!buttons.length || !video) return;
      const title = root.querySelector('[data-video-title]');
      const summary = root.querySelector('[data-video-summary]');
      const meta = root.querySelector('[data-video-meta]');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.getAttribute('aria-pressed') === 'true') return;
          const wasPlaying = !video.paused;
          buttons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
          video.pause();
          video.poster = btn.dataset.poster;
          video.querySelector('source')?.setAttribute('src', btn.dataset.src);
          video.load();
          if (title) title.textContent = btn.dataset.title;
          video.setAttribute('aria-label', btn.dataset.title);
          if (summary) summary.textContent = btn.dataset.summary;
          if (meta) meta.textContent = btn.dataset.meta;
          if (wasPlaying) {
            const p = video.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          }
        });
      });
    });
  }

  // Büyütme penceresi (sertifikalar, ürün tanıtım görselleri): [data-image-open] düğmesi büyük görseli bir
  // <dialog> içinde açar. Görsel yalnızca açılınca indirilir; WebP yüklenemezse JPEG'e düşer.
  function initImageDialog() {
    const dialog = document.getElementById('imageDialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const title = dialog.querySelector('.image-dialog__title');
    const frame = dialog.querySelector('.image-dialog__frame');
    document.querySelectorAll('[data-image-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        title.textContent = btn.dataset.title || '';
        const img = new Image(Number(btn.dataset.w) || undefined, Number(btn.dataset.h) || undefined);
        img.className = 'image-dialog__img';
        img.alt = btn.dataset.title || '';
        img.decoding = 'async';
        const jpg = new URL(btn.dataset.src, location.href).href;
        img.addEventListener('error', () => { if (img.src !== jpg) img.src = jpg; }, { once: true });
        img.src = btn.dataset.webp || btn.dataset.src;
        frame.replaceChildren(img);
        dialog.showModal();
      });
    });
    dialog.querySelector('[data-image-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  }

  // Ana sayfa görsel duvarı: üç sıra, zıt yönlerde yavaş akış.
  // Durdur/oynat düğmesi (WCAG 2.2.2); ekran dışındayken ve azaltılmış harekette durur.
  const HERO_ROWS = [
    { dur: 110, items: ['ck628', 'ck631', 'ck620', 'ck686', 'ads622', 'ck611', 'ck638', 'ck683', 'ck687', 'ck644', 'ck608ab'] },
    { dur: 140, rev: true, items: ['ck686-g1', 'ck611-g1', 'ck621-g2', 'ck689-g1', 'ck613-g1', 'ck687-g1', 'ck688-g1', 'ck631-g1', 'ck620-g1', 'ck638-g1', 'ck688-g2'] },
    { dur: 125, items: ['ck686-g2', 'reed2', 'ads611', 'ck656', 'ck683-g1', 'reed4', 'ck621', 'ck628-g2', 'ck645', 'reed3', 'ck689', 'reed1'] }
  ];

  function initHeroWall() {
    const wall = document.querySelector('[data-hero-wall]');
    if (!wall) return;
    // Her karo: WebP (modern tarayıcı) + JPEG yedeği. İlk 4 karo hemen, gerisi tembel ve düşük öncelikle yüklenir.
    const tile = (name, eager) => `<figure class="hero-row__item"><picture><source type="image/webp" srcset="images/hero/${name}.webp"><img src="images/hero/${name}.jpg" alt="" width="360" height="450" decoding="async"${eager ? '' : ' loading="lazy" fetchpriority="low"'}></picture></figure>`;
    wall.innerHTML = HERO_ROWS.map(row => {
      // İçerik iki kez yazılır: iz yarısı kadar kayınca kesintisiz başa döner
      const once = row.items.map((n, i) => tile(n, i < 4)).join('');
      const twice = row.items.map(n => tile(n, false)).join('');
      return `<div class="hero-row${row.rev ? ' hero-row--rev' : ''}"><div class="hero-row__track" style="--dur:${row.dur}s">${once}${twice}</div></div>`;
    }).join('');

    const toggle = document.querySelector('[data-wall-toggle]');
    if (reduceMotion.matches || !toggle) return;
    const label = toggle.querySelector('span');
    let userPaused = false;
    let offscreen = false;
    function apply() {
      wall.classList.toggle('is-paused', userPaused || offscreen);
      toggle.setAttribute('aria-pressed', String(userPaused));
      if (label) label.textContent = userPaused ? 'Görsel akışını oynat' : 'Görsel akışını durdur';
    }
    toggle.hidden = false;
    toggle.addEventListener('click', () => { userPaused = !userPaused; apply(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { offscreen = !entry.isIntersecting; apply(); }).observe(wall);
    }
    apply();
  }

  // Başlık, koyu hero'nun üstündeyken açık renkli metne geçer (scroll dinleyicisi yok)
  function initHeaderOnDark() {
    const header = document.querySelector('[data-header]');
    const hero = document.querySelector('[data-hero]');
    if (!header || !hero) return;
    header.classList.add('on-dark');
    if (!('IntersectionObserver' in window)) return;
    const headerH = header.offsetHeight || 72;
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('on-dark', entry.isIntersecting);
    }, { rootMargin: `0px 0px -${Math.max(window.innerHeight - headerH, 0)}px 0px` }).observe(hero);
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
    initIntro();
    initHeroWall();
    initHeaderOnDark();
    initReveal();
    initVideos();
    initVideoDialog();
    initVideoSwitch();
    initImageDialog();
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
