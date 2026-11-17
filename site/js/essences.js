/**
 * Esans sayfası (esanslar.html): koku ailesi ve esans seçimi; seçilen esansa göre sahnenin rengi ve arka plan hareketi.
 *
 * İçerik sayfada önceden basılıdır (tools/build.mjs essencesPage, veri products.js ESSENCES). Burada yalnızca:
 *   - koku ailesi düğmeleri ve esans seçici (hangi esans görünür),
 *   - sahnenin renk tonu: --e-h (style.css .essence-stage zemin ve vurgu renklerini bundan türetir),
 *   - arka plandaki canvas hareketi: petals (çiçeksi), mist (ferah), wind (odunsu).
 * Hareket sabit hızlı ve süreklidir; sekme gizliyken, sahne ekran dışındayken ve "Hareketi durdur" ile durur.
 * Azaltılmış hareket tercihinde döngü çalışmaz, tek bir durağan kare çizilir (renk değişimi kalır).
 */
(function () {
  const stage = document.querySelector('[data-essences]');
  if (!stage) return;

  const root = document.documentElement;
  const EN = root.lang === 'en';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

  const toneButtons = Array.from(stage.querySelectorAll('[data-tone-btn]'));
  const picks = Array.from(stage.querySelectorAll('[data-pick]'));
  const panels = Array.from(stage.querySelectorAll('.essence'));
  const picker = stage.querySelector('.essence-picker');
  const toneText = stage.querySelector('[data-tone-text]');
  const motionBtn = stage.querySelector('[data-essence-motion]');
  const canvas = stage.querySelector('canvas');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

  // ---------------------------------------------------------------------------
  // Sahne (canvas)
  // ---------------------------------------------------------------------------
  const rand = (a, b) => a + Math.random() * (b - a);
  const TAU = Math.PI * 2;
  let W = 0, H = 0;
  let mode = '';            // çizilen hareket
  let hue = 0, curHue = 0;  // hedef ve o an çizilen renk tonu (ton değişimi yumuşak geçer)
  let items = [];           // parçacıklar
  let extras = [];          // ikincil parçacıklar (yaprak, damlacık)
  let time = 0, last = 0, raf = 0, swapTimer = 0;
  let userPaused = false, offscreen = false;

  // Parçacık rengi: açık temada zemine göre koyu, koyu temada açık ton
  function ink(alpha, shift = 0) {
    const dark = root.dataset.theme === 'dark';
    return `hsla(${curHue}, ${dark ? 46 : 40}%, ${(dark ? 72 : 44) + shift}%, ${alpha})`;
  }

  // Yoğunluk ekran alanına göre ölçeklenir (telefonda daha az parçacık)
  const density = () => Math.max(0.45, Math.min(1.3, (W * H) / (1440 * 900)));

  function seed() {
    const k = density();
    items = [];
    extras = [];
    if (mode === 'wind') {
      // Rüzgâr çizgileri: soldan sağa akan, dalgalanan ince çizgiler
      for (let i = 0; i < Math.round(44 * k); i++) items.push({ x: rand(-200, W), y: rand(0, H), v: rand(50, 130), len: rand(70, 200), amp: rand(6, 22), f: rand(0.004, 0.009), ph: rand(0, TAU), a: rand(0.10, 0.30), w: rand(0.8, 1.7) });
      // Rüzgârda sürüklenen yapraklar
      for (let i = 0; i < Math.round(9 * k); i++) extras.push({ x: rand(0, W), y: rand(0, H), v: rand(40, 90), s: rand(5, 9), rot: rand(0, TAU), vr: rand(-1.2, 1.2), ph: rand(0, TAU), a: rand(0.22, 0.42) });
    } else if (mode === 'petals') {
      // Süzülen çiçek yaprakları: yavaşça düşer, sağa sola salınır, dönerken incelir
      for (let i = 0; i < Math.round(26 * k); i++) items.push({ x: rand(0, W), y: rand(0, H), s: rand(7, 16), vy: rand(16, 38), vx: rand(4, 16), amp: rand(12, 30), f: rand(0.4, 0.9), ph: rand(0, TAU), rot: rand(0, TAU), vr: rand(-0.6, 0.6), flip: rand(0, TAU), vf: rand(0.6, 1.4), a: rand(0.22, 0.48) });
    } else if (mode === 'mist') {
      // Dalgalar: ekranın alt yarısında üst üste, farklı hızlarda kayan yumuşak katmanlar
      for (let i = 0; i < 4; i++) items.push({ base: 0.60 + i * 0.095, amp: 14 + i * 6, lambda: 420 + i * 170, v: (i % 2 ? -1 : 1) * (12 + i * 7), a: 0.07 + i * 0.022, ph: rand(0, TAU) });
      // Yükselen damlacıklar
      for (let i = 0; i < Math.round(22 * k); i++) extras.push({ x: rand(0, W), y: rand(0, H), r: rand(1.5, 4.5), vy: rand(8, 22), amp: rand(4, 14), f: rand(0.5, 1.1), ph: rand(0, TAU), a: rand(0.16, 0.38) });
    }
  }

  function drawWind(dt) {
    const gust = 1 + 0.35 * Math.sin(time * 0.35); // rüzgâr yer yer hızlanır
    ctx.lineCap = 'round';
    for (const p of items) {
      p.x += p.v * gust * dt;
      if (p.x - p.len > W) { p.x = rand(-160, -20); p.y = rand(0, H); }
      const yAt = x => p.y + p.amp * Math.sin(x * p.f + p.ph + time * 0.6);
      const x0 = p.x - p.len;
      const g = ctx.createLinearGradient(x0, 0, p.x, 0);
      g.addColorStop(0, ink(0));
      g.addColorStop(1, ink(p.a));
      ctx.strokeStyle = g;
      ctx.lineWidth = p.w;
      ctx.beginPath();
      ctx.moveTo(x0, yAt(x0));
      for (let i = 1; i <= 6; i++) { const x = x0 + (p.len * i) / 6; ctx.lineTo(x, yAt(x)); }
      ctx.stroke();
    }
    for (const p of extras) {
      p.x += p.v * gust * dt;
      p.y += Math.sin(time * 0.8 + p.ph) * 14 * dt;
      p.rot += p.vr * dt;
      if (p.x - p.s > W) { p.x = -p.s; p.y = rand(0, H); }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = ink(p.a);
      ctx.beginPath();
      ctx.moveTo(-p.s, 0);
      ctx.quadraticCurveTo(0, -p.s * 0.6, p.s, 0);
      ctx.quadraticCurveTo(0, p.s * 0.6, -p.s, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawPetals(dt) {
    for (const p of items) {
      p.y += p.vy * dt;
      p.x += p.vx * dt;
      p.rot += p.vr * dt;
      p.flip += p.vf * dt;
      if (p.y - p.s > H) { p.y = -p.s; p.x = rand(-40, W); }
      if (p.x - p.s > W + 40) p.x = -p.s;
      const x = p.x + p.amp * Math.sin(time * p.f + p.ph);
      ctx.save();
      ctx.translate(x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.5 + 0.5 * Math.abs(Math.cos(p.flip)));
      ctx.fillStyle = ink(p.a, 8);
      ctx.beginPath();
      ctx.moveTo(0, -p.s);
      ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.6, 0, p.s);
      ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.6, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawMist(dt) {
    for (const p of items) {
      const base = H * p.base;
      ctx.fillStyle = ink(p.a);
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W + 24; x += 24) {
        const y = base
          + p.amp * Math.sin(((x + p.v * time) / p.lambda) * TAU + p.ph)
          + p.amp * 0.4 * Math.sin(((x - p.v * 0.6 * time) / (p.lambda * 0.37)) * TAU);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();
    }
    ctx.lineWidth = 1;
    for (const p of extras) {
      p.y -= p.vy * dt;
      if (p.y + p.r < 0) { p.y = H + p.r; p.x = rand(0, W); }
      const x = p.x + p.amp * Math.sin(time * p.f + p.ph);
      const fade = Math.min(1, p.y / (H * 0.25)); // üstte sönerek kaybolur
      ctx.strokeStyle = ink(p.a * fade);
      ctx.fillStyle = ink(p.a * fade * 0.3);
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, TAU);
      ctx.fill();
      ctx.stroke();
    }
  }

  function draw(dt) {
    // Renk tonu hedefe en kısa yoldan yaklaşır
    const d = ((hue - curHue + 540) % 360) - 180;
    curHue = Math.abs(d) < 0.5 || !dt ? hue : (curHue + d * Math.min(1, dt * 4) + 360) % 360;
    ctx.clearRect(0, 0, W, H);
    if (mode === 'wind') drawWind(dt);
    else if (mode === 'petals') drawPetals(dt);
    else if (mode === 'mist') drawMist(dt);
  }

  const running = () => !userPaused && !offscreen && !document.hidden && !reduce.matches;

  function frame(now) {
    raf = 0;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    draw(dt);
    if (running()) raf = requestAnimationFrame(frame);
  }
  function play() {
    if (!ctx || raf || !running()) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  // Döngü çalışmıyorken (azaltılmış hareket, duraklatma) görünen kareyi yeniler
  function still() {
    if (ctx && !running()) draw(0);
  }

  function resize() {
    if (!ctx) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Telefonda adres çubuğu açılıp kapanınca yükseklik biraz değişir: parçacıklar yeniden dağıtılmaz
    const reseed = w !== W || Math.abs(h - H) > 120;
    W = w; H = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reseed) seed();
    still();
  }

  // Hareket değişimi: canvas kısa bir solmayla yeni harekete geçer; aynı ailede yalnızca renk tonu değişir
  function setScene(motion, h, instant) {
    hue = h;
    if (!ctx) return;
    if (motion === mode) { still(); return; }
    clearTimeout(swapTimer);
    const swap = () => {
      mode = motion;
      curHue = hue;
      seed();
      canvas.classList.add('is-on');
      still();
      play();
    };
    if (instant || !mode) { swap(); return; }
    canvas.classList.remove('is-on');
    swapTimer = setTimeout(swap, 220);
  }

  // ---------------------------------------------------------------------------
  // Seçim
  // ---------------------------------------------------------------------------
  function select(id, { animate = false, instant = false, updateUrl = true } = {}) {
    const panel = panels.find(p => p.dataset.essence === id);
    if (!panel) return false;
    const tone = panel.dataset.tone;

    toneButtons.forEach(b => {
      const on = b.dataset.toneBtn === tone;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
      if (on && toneText) toneText.textContent = b.dataset.text || '';
    });
    let inTone = 0;
    picks.forEach(b => {
      const same = b.dataset.tone === tone;
      b.classList.toggle('is-in-tone', same);
      b.setAttribute('aria-pressed', String(b.dataset.pick === id));
      if (same) inTone++;
    });
    if (picker) picker.hidden = inTone < 2; // ailede tek esans varsa seçici gereksiz
    panels.forEach(p => p.classList.toggle('is-active', p === panel));

    stage.style.setProperty('--e-h', panel.dataset.hue);
    stage.dataset.tone = tone;
    setScene(panel.dataset.motion, Number(panel.dataset.hue), instant);

    if (animate && panel.animate) {
      panel.animate(
        reduce.matches
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
        { duration: 240, easing: EASE_OUT }
      );
    }
    if (updateUrl && window.history && history.replaceState) history.replaceState(null, '', `#esans-${id}`);
    return true;
  }

  const fromHash = () => (window.location.hash.match(/^#esans-([\w-]+)$/) || [])[1];

  // Fareyle seçimde kısa bir geçiş; klavyede anında (e.detail klavyede 0'dır)
  toneButtons.forEach(btn => btn.addEventListener('click', e => {
    const first = panels.find(p => p.dataset.tone === btn.dataset.toneBtn);
    if (first && !first.classList.contains('is-active')) select(first.dataset.essence, { animate: e.detail > 0 });
  }));
  picks.forEach(btn => btn.addEventListener('click', e => {
    if (btn.getAttribute('aria-pressed') !== 'true') select(btn.dataset.pick, { animate: e.detail > 0 });
  }));
  window.addEventListener('hashchange', () => { const id = fromHash(); if (id) select(id, { updateUrl: false }); });

  // ---------------------------------------------------------------------------
  // Başlatma
  // ---------------------------------------------------------------------------
  if (ctx) {
    resize();
    let resizeFrame = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    });
    document.addEventListener('visibilitychange', play);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { offscreen = !entry.isIntersecting; play(); }).observe(stage);
    }
    // Tema değişince durağan kare yeni renkle çizilir
    if ('MutationObserver' in window) new MutationObserver(still).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    // Durdur / oynat (WCAG 2.2.2); azaltılmış harekette hareket zaten yoktur, düğme gizli kalır
    const syncMotionBtn = () => {
      if (!motionBtn) return;
      motionBtn.hidden = reduce.matches;
      motionBtn.setAttribute('aria-pressed', String(userPaused));
      const label = motionBtn.querySelector('span');
      if (label) label.textContent = userPaused
        ? (EN ? 'Play motion' : 'Hareketi oynat')
        : (EN ? 'Pause motion' : 'Hareketi durdur');
    };
    motionBtn?.addEventListener('click', () => { userPaused = !userPaused; syncMotionBtn(); play(); });
    const onReduceChange = () => { syncMotionBtn(); still(); play(); };
    if (reduce.addEventListener) reduce.addEventListener('change', onReduceChange);
    syncMotionBtn();
  }

  const initial = fromHash();
  const active = panels.find(p => p.classList.contains('is-active')) || panels[0];
  if (!(initial && select(initial, { instant: true, updateUrl: false })) && active) {
    select(active.dataset.essence, { instant: true, updateUrl: false });
  }
})();
