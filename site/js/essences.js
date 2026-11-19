/**
 * Esans sayfası (esanslar.html): koku ailesi ve esans seçimi; seçilen esansa göre sahnenin rengi ve arka plan hareketi.
 *
 * İçerik sayfada önceden basılıdır (tools/build.mjs essencesPage, veri products.js ESSENCES). Burada yalnızca:
 *   - aile sekmeleri, esans seçici, önceki / sonraki düğmeleri ve adres çapaları (#esans-<id>, #aile-<aile>),
 *   - sahnenin renk tonu: --e-h (style.css türetilmiş renkleri bundan hesaplar; ton değişimini burada kare kare yazarız),
 *   - seçilen panelin giriş animasyonu (is-entering: görsel tepeden açılır, piramit katmanları sırayla kurulur),
 *   - arka plandaki canvas hareketi. Renkler esansın koku piramidi görselinden çıkarılan paletten (data-palette) gelir;
 *     hareket kokunun karakterine göre seçilir (data-motion): petals, mist, wind, fizz, ember, powder, rain, stars.
 *     Hareketin üstünde, piramit görselindeki malzemelerin çizimleri süzülür (data-sprites: dilim portakal, yaprak,
 *     çiçek, tarçın, amber...).
 * Hareket sabit hızlı ve süreklidir; imleç sahnede gezinince parçacıklar o yöne hafifçe sürüklenir (yalnızca fare).
 * Sekme gizliyken, sahne ekran dışındayken ve "Hareketi durdur" ile durur. Azaltılmış hareket tercihinde döngü
 * çalışmaz, tek bir durağan kare çizilir (renk değişimi kalır).
 */
(function () {
  const stage = document.querySelector('[data-essences]');
  if (!stage) return;

  const root = document.documentElement;
  const EN = root.lang === 'en';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const famButtons = Array.from(stage.querySelectorAll('[data-fam-btn]'));
  const picks = Array.from(stage.querySelectorAll('[data-pick]'));
  const panels = Array.from(stage.querySelectorAll('.essence'));
  const picker = stage.querySelector('[data-picker]');
  const famText = stage.querySelector('[data-fam-text]');
  const motionBtn = stage.querySelector('[data-essence-motion]');
  const stepNav = stage.querySelector('[data-step-nav]');
  const stepPos = stage.querySelector('[data-step-pos]');
  const canvas = stage.querySelector('canvas');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

  // ---------------------------------------------------------------------------
  // Renkler: palet (#RRGGBB) temaya göre okunur hâle getirilir. Açık temada zemine göre koyu, koyu temada açık ton.
  // ---------------------------------------------------------------------------
  const hexToRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  function rgbToHsl([r, g, b]) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }
    return [h, s * 100, l * 100];
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let pal = [[200, 30, 50], [200, 30, 60], [200, 30, 70]];   // o an çizilen palet (HSL)
  let palTarget = pal;
  function readPalette(panel) {
    const dark = root.dataset.theme === 'dark';
    return (panel.dataset.palette || '').split(',').filter(Boolean).map(hex => {
      const [h, s, l] = rgbToHsl(hexToRgb(hex.trim()));
      return [h, clamp(s, 18, 72), dark ? clamp(l, 62, 82) : clamp(l, 30, 58)];
    });
  }
  // Ton farkı en kısa yoldan kapanır (ör. 350 -> 10, 340 derece değil 20 derece)
  function mixPal(dt) {
    const k = dt ? Math.min(1, dt * 3.5) : 1;
    pal = pal.map((c, i) => {
      const t = palTarget[i % palTarget.length];
      const dh = ((t[0] - c[0] + 540) % 360) - 180;
      return [(c[0] + dh * k + 360) % 360, c[1] + (t[1] - c[1]) * k, c[2] + (t[2] - c[2]) * k];
    });
  }
  const col = (i, a, dl = 0) => { const c = pal[i % 3]; return `hsla(${c[0].toFixed(1)}, ${c[1].toFixed(1)}%, ${clamp(c[2] + dl, 0, 100).toFixed(1)}%, ${a})`; };

  // ---------------------------------------------------------------------------
  // Sahne (canvas)
  // ---------------------------------------------------------------------------
  const rand = (a, b) => a + Math.random() * (b - a);
  const TAU = Math.PI * 2;
  let W = 0, H = 0;
  let mode = '';
  let items = [], extras = [], fx = [];
  let time = 0, last = 0, raf = 0, swapTimer = 0;
  let userPaused = false, offscreen = false;
  // İmleç rüzgârı: imleç sahnenin sağındaysa parçacıklar sağa sürüklenir (yumuşak, en fazla ±28 px/sn)
  let windX = 0, windTarget = 0;

  const density = () => clamp((W * H) / (1440 * 900), 0.45, 1.3);
  const n = base => Math.max(4, Math.round(base * density()));

  // ---------------------------------------------------------------------------
  // Malzeme çizimleri: her esansın koku piramidi görselindeki malzemeler (dilim portakal, yaprak, çiçek, tarçın,
  // amber...) arka planda süzülür (data-sprites, products.js ESSENCES sprites). Her çizim bir kez ekran dışı bir
  // canvas'a yapılır ve önbellekte tutulur; karede yalnızca kopyalanır. Çizimler (0, 0) merkezli, r yarıçaplıdır.
  // ---------------------------------------------------------------------------
  const SPRITE_PX = 96;
  const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; };
  const rad = (g, x, y, r0, r1, stops) => { const gr = g.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; };
  const circle = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, TAU); };
  // Damla biçimli taç yaprağı: merkezden yukarı (-y) doğru
  function petal(g, r, w = 0.5) {
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(r * w * 1.1, -r * 0.3, r * w * 0.85, -r * 0.95, 0, -r);
    g.bezierCurveTo(-r * w * 0.85, -r * 0.95, -r * w * 1.1, -r * 0.3, 0, 0);
  }

  const SPRITES = {
    citrus(g, r, v) {
      const C = {
        orange: ['#E9791A', '#F9A23C', '#FFE6BE'], lemon: ['#E3BC16', '#F6D945', '#FFF7CF'],
        lime: ['#5E9A26', '#9FCB45', '#F0F8D3'], grapefruit: ['#D9473A', '#F5866B', '#FFE1D4'],
        bergamot: ['#93AD2A', '#C9D951', '#F6F8D5']
      }[v] || ['#E9791A', '#F9A23C', '#FFE6BE'];
      g.fillStyle = rad(g, -r * 0.25, -r * 0.25, r * 0.2, r * 1.1, [[0, C[1]], [1, C[0]]]);
      circle(g, 0, 0, r); g.fill();
      g.fillStyle = C[2]; circle(g, 0, 0, r * 0.87); g.fill();
      const n = 9;
      for (let i = 0; i < n; i++) {
        const a0 = (i * TAU) / n + 0.06, a1 = ((i + 1) * TAU) / n - 0.06, am = (a0 + a1) / 2;
        g.fillStyle = rad(g, 0, 0, r * 0.1, r * 0.8, [[0, C[2]], [0.3, C[1]], [1, C[0]]]);
        g.beginPath();
        g.moveTo(Math.cos(am) * r * 0.12, Math.sin(am) * r * 0.12);
        g.arc(0, 0, r * 0.79, a0, a1);
        g.closePath();
        g.fill();
        // meyve keseciklerinin parıltısı
        g.fillStyle = 'rgba(255,255,255,0.35)';
        g.beginPath();
        g.ellipse(Math.cos(am) * r * 0.5, Math.sin(am) * r * 0.5, r * 0.05, r * 0.14, am + Math.PI / 2, 0, TAU);
        g.fill();
      }
      g.fillStyle = C[2]; circle(g, 0, 0, r * 0.1); g.fill();
    },
    leaf(g, r, v) {
      const C = { dark: ['#1E5428', '#3D8A3F'], mint: ['#2F9E62', '#86D493'], sage: ['#6F8F6B', '#B3C8AA'] }[v] || ['#2E7A31', '#69B04F'];
      g.rotate(-0.45);
      g.fillStyle = lin(g, -r * 0.4, -r, r * 0.4, r, [[0, C[1]], [1, C[0]]]);
      const shape = () => {
        g.beginPath();
        g.moveTo(0, -r);
        g.bezierCurveTo(r * 0.72, -r * 0.45, r * 0.58, r * 0.5, 0, r * 0.88);
        g.bezierCurveTo(-r * 0.58, r * 0.5, -r * 0.72, -r * 0.45, 0, -r);
      };
      shape();
      g.fill();
      g.strokeStyle = C[0];
      g.lineCap = 'round';
      g.lineWidth = r * 0.05;
      g.beginPath(); g.moveTo(0, r * 0.8); g.lineTo(0, r * 1.02); g.stroke(); // sap
      g.save();
      shape();
      g.clip(); // damarlar yaprağın içinde kalır
      g.strokeStyle = 'rgba(255,255,255,0.45)';
      g.beginPath(); g.moveTo(0, -r * 0.82); g.quadraticCurveTo(r * 0.06, 0, 0, r * 0.9); g.stroke();
      g.lineWidth = r * 0.025;
      for (let i = 0; i < 4; i++) {
        const y = -r * 0.5 + i * r * 0.32;
        g.beginPath();
        g.moveTo(0, y); g.quadraticCurveTo(r * 0.2, y - r * 0.08, r * 0.4, y - r * 0.24);
        g.moveTo(0, y); g.quadraticCurveTo(-r * 0.2, y - r * 0.08, -r * 0.4, y - r * 0.24);
        g.stroke();
      }
      g.restore();
    },
    blossom(g, r, v) {
      const C = { pink: ['#FFE6EE', '#F4A7C0', '#F1C24A'], cream: ['#FFF8E6', '#EAD6A4', '#E2B437'] }[v] || ['#FFFFFF', '#E9E2D0', '#F1C232'];
      for (let i = 0; i < 5; i++) {
        g.save();
        g.rotate((i * TAU) / 5);
        g.fillStyle = lin(g, 0, 0, 0, -r, [[0, C[1]], [0.45, C[0]], [1, C[0]]]);
        petal(g, r, 0.55);
        g.fill();
        g.strokeStyle = 'rgba(110,90,60,0.14)';
        g.lineWidth = 1;
        g.stroke();
        g.beginPath(); g.moveTo(0, -r * 0.18); g.lineTo(0, -r * 0.72); g.stroke();
        g.restore();
      }
      g.fillStyle = rad(g, 0, 0, 0, r * 0.2, [[0, '#FFF3B0'], [1, C[2]]]);
      circle(g, 0, 0, r * 0.18); g.fill();
      g.fillStyle = 'rgba(150,100,20,0.7)';
      for (let i = 0; i < 8; i++) { const a = (i * TAU) / 8; circle(g, Math.cos(a) * r * 0.25, Math.sin(a) * r * 0.25, r * 0.035); g.fill(); }
    },
    rose(g, r, v) {
      const C = {
        red: ['#E6505F', '#B11E34', '#6E0C1D'], white: ['#FFFDF8', '#EFE3D0', '#B8A07E'],
        blue: ['#D3E1F5', '#8EAEDD', '#4F72AE']
      }[v] || ['#F8BACB', '#E37A9B', '#A93E63'];
      const petalAt = (a, d, pr, k) => {
        const x = Math.cos(a) * d, y = Math.sin(a) * d;
        g.fillStyle = rad(g, x - pr * 0.3, y - pr * 0.3, 0, pr * 1.2, [[0, C[0]], [1, k ? C[0] : C[1]]]);
        circle(g, x, y, pr); g.fill();
        g.strokeStyle = C[2]; g.globalAlpha = 0.35; g.lineWidth = 1; g.stroke(); g.globalAlpha = 1;
      };
      for (let i = 0; i < 5; i++) petalAt((i * TAU) / 5 - Math.PI / 2, r * 0.45, r * 0.52, false);
      for (let i = 0; i < 4; i++) petalAt((i * TAU) / 4 + 0.4, r * 0.27, r * 0.38, true);
      for (let i = 0; i < 3; i++) petalAt((i * TAU) / 3 + 1.1, r * 0.13, r * 0.25, false);
      g.strokeStyle = C[2]; g.lineWidth = r * 0.045; g.lineCap = 'round';
      g.beginPath();
      for (let t = 0; t < TAU * 2.2; t += 0.15) { const rr = r * 0.03 + t * r * 0.018; g.lineTo(Math.cos(t) * rr, Math.sin(t) * rr); }
      g.stroke();
    },
    violet(g, r) {
      const spots = [[-2.2, 0.4, 0.4], [-0.95, 0.4, 0.4], [2.75, 0.42, 0.38], [0.4, 0.42, 0.38], [1.57, 0.5, 0.46]];
      spots.forEach(([a, d, pr]) => {
        const x = Math.cos(a) * r * d, y = Math.sin(a) * r * d;
        g.fillStyle = rad(g, x * 0.6, y * 0.6, 0, r * pr * 1.3, [[0, '#B596E6'], [0.6, '#7B4BC4'], [1, '#55268F']]);
        circle(g, x, y, r * pr); g.fill();
      });
      g.strokeStyle = 'rgba(40,10,70,0.5)'; g.lineWidth = r * 0.025;
      for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(0, r * 0.1); g.lineTo(i * r * 0.14, r * 0.45); g.stroke(); }
      g.fillStyle = '#FFFFFF'; circle(g, 0, 0, r * 0.13); g.fill();
      g.fillStyle = '#F2C230'; circle(g, 0, r * 0.03, r * 0.08); g.fill();
    },
    lavender(g, r) {
      g.rotate(0.3);
      g.strokeStyle = '#6E8F4E'; g.lineWidth = r * 0.06; g.lineCap = 'round';
      g.beginPath(); g.moveTo(0, r); g.quadraticCurveTo(r * 0.08, 0, 0, -r * 0.95); g.stroke();
      for (let i = 0; i < 11; i++) {
        const t = i / 10, y = -r * 0.95 + t * r * 1.05, side = i % 2 ? 1 : -1;
        g.fillStyle = rad(g, side * r * 0.08, y, 0, r * 0.16, [[0, '#B79BE6'], [1, '#6C48B0']]);
        g.beginPath(); g.ellipse(side * r * 0.08, y, r * 0.085, r * 0.14, side * 0.5, 0, TAU); g.fill();
      }
    },
    bells(g, r) {
      g.strokeStyle = '#5F8E45'; g.lineWidth = r * 0.05; g.lineCap = 'round';
      g.beginPath(); g.moveTo(-r * 0.8, r * 0.95); g.quadraticCurveTo(-r * 0.4, -r * 0.9, r * 0.75, -r * 0.6); g.stroke();
      [[-0.42, -0.2], [-0.12, -0.52], [0.22, -0.66], [0.55, -0.62]].forEach(([u, v2], i) => {
        const x = u * r, y = v2 * r + r * 0.2, s = r * (0.3 - i * 0.03);
        g.beginPath(); g.moveTo(x, v2 * r - r * 0.02); g.lineTo(x, y - s * 0.6); g.lineWidth = r * 0.025; g.stroke();
        g.fillStyle = rad(g, x - s * 0.2, y - s * 0.3, 0, s * 1.2, [[0, '#FFFFFF'], [1, '#DDE8D0']]);
        g.beginPath();
        g.moveTo(x - s * 0.55, y + s * 0.45);
        g.bezierCurveTo(x - s * 0.6, y - s * 0.7, x + s * 0.6, y - s * 0.7, x + s * 0.55, y + s * 0.45);
        g.quadraticCurveTo(x + s * 0.3, y + s * 0.25, x, y + s * 0.5);
        g.quadraticCurveTo(x - s * 0.3, y + s * 0.25, x - s * 0.55, y + s * 0.45);
        g.fill();
        g.strokeStyle = 'rgba(90,120,70,0.35)'; g.lineWidth = 1; g.stroke();
        g.strokeStyle = '#5F8E45';
      });
    },
    cinnamon(g, r) {
      const stick = (oy, rot) => {
        g.save(); g.rotate(rot); g.translate(0, oy);
        const h = r * 0.17;
        g.fillStyle = lin(g, 0, -h, 0, h, [[0, '#A9632F'], [0.45, '#C98446'], [1, '#6E3716']]);
        g.beginPath(); g.roundRect ? g.roundRect(-r * 0.92, -h, r * 1.84, h * 2, h * 0.5) : g.rect(-r * 0.92, -h, r * 1.84, h * 2); g.fill();
        g.strokeStyle = 'rgba(70,30,10,0.35)'; g.lineWidth = 1;
        for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(-r * 0.85, i * h * 0.45); g.lineTo(r * 0.8, i * h * 0.45 + 1); g.stroke(); }
        g.fillStyle = '#5A2A10';
        g.beginPath(); g.ellipse(r * 0.9, 0, h * 0.45, h, 0, 0, TAU); g.fill();
        g.strokeStyle = '#D79A5E'; g.lineWidth = 1.2;
        g.beginPath(); for (let t = 0; t < TAU * 1.6; t += 0.2) { const rr = 1 + t * 0.9; g.lineTo(r * 0.9 + Math.cos(t) * rr * 0.45, Math.sin(t) * rr); } g.stroke();
        g.restore();
      };
      stick(-r * 0.2, -0.5);
      stick(r * 0.22, -0.32);
    },
    anise(g, r) {
      for (let i = 0; i < 8; i++) {
        g.save(); g.rotate((i * TAU) / 8);
        g.fillStyle = lin(g, 0, -r * 0.15, 0, -r, [[0, '#5B2A12'], [1, '#9A5428']]);
        g.beginPath(); g.ellipse(0, -r * 0.55, r * 0.15, r * 0.42, 0, 0, TAU); g.fill();
        g.fillStyle = '#E2B07A'; g.beginPath(); g.ellipse(0, -r * 0.6, r * 0.06, r * 0.12, 0, 0, TAU); g.fill();
        g.restore();
      }
      g.fillStyle = '#4A220E'; circle(g, 0, 0, r * 0.14); g.fill();
    },
    wood(g, r, v) {
      const C = v === 'dark' ? ['#7A4A2B', '#4E2C17', '#2B160A', '#9A6A47'] : ['#E2C196', '#BC9062', '#8A5E36', '#F1DDBF'];
      const log = (oy, len, h, rot) => {
        g.save(); g.rotate(rot); g.translate(0, oy);
        g.fillStyle = lin(g, 0, -h, 0, h, [[0, C[0]], [0.5, C[1]], [1, C[2]]]);
        g.fillRect(-len, -h, len * 1.8, h * 2);
        g.strokeStyle = 'rgba(60,30,10,0.25)'; g.lineWidth = 1;
        for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(-len, i * h * 0.35); g.bezierCurveTo(-len * 0.3, i * h * 0.35 + 2, len * 0.2, i * h * 0.35 - 2, len * 0.8, i * h * 0.35); g.stroke(); }
        g.fillStyle = C[3];
        g.beginPath(); g.ellipse(len * 0.8, 0, h * 0.42, h, 0, 0, TAU); g.fill();
        g.strokeStyle = C[1]; g.globalAlpha = 0.6;
        for (let k = 1; k <= 3; k++) { g.beginPath(); g.ellipse(len * 0.8, 0, h * 0.42 * (k / 3.4), h * (k / 3.4), 0, 0, TAU); g.stroke(); }
        g.globalAlpha = 1;
        g.restore();
      };
      log(-r * 0.22, r * 0.95, r * 0.2, -0.35);
      log(r * 0.25, r * 0.8, r * 0.17, -0.18);
    },
    amber(g, r, v) {
      const C = v === 'ice' ? ['#FFFFFF', '#D5ECF8', '#8DBBD8'] : ['#FFDA85', '#F2981E', '#A9510A'];
      const pts = [[0, 0.95], [0.85, 0.8], [1.6, 1], [2.45, 0.82], [3.3, 0.96], [4.15, 0.78], [5.2, 0.92]].map(([a, k]) => [Math.cos(a) * r * k, Math.sin(a) * r * k]);
      g.fillStyle = rad(g, -r * 0.25, -r * 0.3, r * 0.05, r * 1.1, [[0, C[0]], [0.45, C[1]], [1, C[2]]]);
      g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 1;
      pts.forEach(([x, y]) => { g.beginPath(); g.moveTo(r * 0.12, -r * 0.08); g.lineTo(x, y); g.stroke(); });
      g.strokeStyle = v === 'ice' ? 'rgba(80,130,170,0.5)' : 'rgba(120,50,0,0.45)';
      g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.55)';
      g.beginPath(); g.moveTo(-r * 0.5, -r * 0.35); g.lineTo(-r * 0.2, -r * 0.6); g.lineTo(-r * 0.1, -r * 0.4); g.closePath(); g.fill();
    },
    crystal(g, r) { SPRITES.amber(g, r, 'ice'); },
    vanilla(g, r) {
      const pod = (oy, rot) => {
        g.save(); g.rotate(rot); g.translate(0, oy);
        g.fillStyle = lin(g, 0, -r * 0.16, 0, r * 0.12, [[0, '#6B4527'], [1, '#24140A']]);
        g.beginPath();
        g.moveTo(-r * 0.95, 0); g.quadraticCurveTo(0, -r * 0.3, r * 0.95, -r * 0.06);
        g.quadraticCurveTo(r, 0, r * 0.95, r * 0.05);
        g.quadraticCurveTo(0, -r * 0.08, -r * 0.95, r * 0.1);
        g.quadraticCurveTo(-r, r * 0.05, -r * 0.95, 0); g.fill();
        g.strokeStyle = 'rgba(200,150,100,0.6)'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(-r * 0.85, r * 0.01); g.quadraticCurveTo(0, -r * 0.22, r * 0.85, -r * 0.04); g.stroke();
        g.restore();
      };
      pod(-r * 0.2, 0.5);
      pod(r * 0.05, 0.38);
      g.save(); g.translate(-r * 0.45, r * 0.45); g.scale(0.5, 0.5); SPRITES.blossom(g, r, 'cream'); g.restore();
    },
    musk(g, r) {
      [[-0.45, 0.15, 0.42], [0.46, 0.12, 0.44], [0, 0.36, 0.42], [-0.2, -0.3, 0.42], [0.25, -0.28, 0.41], [0, 0, 0.5]].forEach(([x, y, k]) => {
        g.fillStyle = rad(g, x * r - r * 0.08, y * r - r * 0.1, 0, r * k * 1.15, [[0, '#FFFFFF'], [0.7, '#F4F1EA'], [1, '#D9D3C6']]);
        circle(g, x * r, y * r, r * k); g.fill();
      });
      g.strokeStyle = 'rgba(200,195,185,0.7)'; g.lineWidth = 0.8;
      for (let i = 0; i < 11; i++) { const a = (i * TAU) / 11; g.beginPath(); g.moveTo(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.58); g.lineTo(Math.cos(a + 0.2) * r * 0.98, Math.sin(a + 0.2) * r * 0.84); g.stroke(); }
    },
    drop(g, r) {
      g.beginPath();
      g.moveTo(0, -r);
      g.bezierCurveTo(r * 0.2, -r * 0.6, r * 0.62, -r * 0.2, r * 0.62, r * 0.25);
      g.arc(0, r * 0.25, r * 0.62, 0, Math.PI);
      g.bezierCurveTo(-r * 0.62, -r * 0.2, -r * 0.2, -r * 0.6, 0, -r);
      g.fillStyle = rad(g, -r * 0.15, r * 0.05, r * 0.05, r * 0.9, [[0, 'rgba(240,250,255,0.9)'], [1, 'rgba(110,170,210,0.75)']]);
      g.fill();
      g.strokeStyle = 'rgba(70,130,180,0.55)'; g.lineWidth = 1.2; g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.9)';
      g.beginPath(); g.ellipse(-r * 0.22, r * 0.08, r * 0.1, r * 0.2, 0.4, 0, TAU); g.fill();
    },
    apple(g, r) {
      g.fillStyle = rad(g, -r * 0.3, -r * 0.2, r * 0.1, r * 1.1, [[0, '#D6EE7E'], [0.55, '#93C63E'], [1, '#5A9224']]);
      g.beginPath();
      g.moveTo(0, -r * 0.55);
      g.bezierCurveTo(r * 0.55, -r * 0.95, r * 1.05, -r * 0.35, r * 0.85, r * 0.3);
      g.bezierCurveTo(r * 0.7, r * 0.85, r * 0.25, r * 0.95, 0, r * 0.8);
      g.bezierCurveTo(-r * 0.25, r * 0.95, -r * 0.7, r * 0.85, -r * 0.85, r * 0.3);
      g.bezierCurveTo(-r * 1.05, -r * 0.35, -r * 0.55, -r * 0.95, 0, -r * 0.55);
      g.fill();
      g.strokeStyle = '#6B4423'; g.lineWidth = r * 0.07; g.lineCap = 'round';
      g.beginPath(); g.moveTo(0, -r * 0.5); g.quadraticCurveTo(r * 0.05, -r * 0.8, r * 0.15, -r * 0.95); g.stroke();
      g.save(); g.translate(r * 0.3, -r * 0.82); g.scale(0.32, 0.32); SPRITES.leaf(g, r, 'mint'); g.restore();
    },
    fruit(g, r, v) {
      const C = { mango: ['#FFE47E', '#F6A33A', '#D9482B'], pineapple: ['#FFF0A0', '#F5C93D', '#C98A1C'] }[v] || ['#FFD7A8', '#F59B6C', '#D4473C'];
      g.fillStyle = rad(g, -r * 0.3, -r * 0.3, r * 0.1, r * 1.1, [[0, C[0]], [0.55, C[1]], [1, C[2]]]);
      if (v === 'mango') { g.beginPath(); g.ellipse(0, 0, r * 0.95, r * 0.75, -0.5, 0, TAU); g.fill(); }
      else { circle(g, 0, 0, r * 0.85); g.fill(); }
      if (v === 'pineapple') {
        g.save();
        circle(g, 0, 0, r * 0.85); g.clip();
        g.strokeStyle = 'rgba(150,100,20,0.45)'; g.lineWidth = 1;
        for (let i = -4; i <= 4; i++) { g.beginPath(); g.moveTo(i * r * 0.25 - r * 0.5, -r); g.lineTo(i * r * 0.25 + r * 0.5, r); g.stroke(); g.beginPath(); g.moveTo(i * r * 0.25 + r * 0.5, -r); g.lineTo(i * r * 0.25 - r * 0.5, r); g.stroke(); }
        g.restore();
      } else {
        g.strokeStyle = 'rgba(160,50,30,0.3)'; g.lineWidth = r * 0.04;
        g.beginPath(); g.moveTo(0, -r * 0.8); g.quadraticCurveTo(r * 0.3, 0, 0, r * 0.8); g.stroke();
      }
      g.save(); g.translate(r * 0.15, -r * 0.85); g.scale(0.35, 0.35); SPRITES.leaf(g, r); g.restore();
    },
    berry(g, r) {
      const pts = [];
      for (let row = 0; row < 5; row++) { const y = -r * 0.55 + row * r * 0.3, w = [2, 3, 4, 3, 2][row]; for (let i = 0; i < w; i++) pts.push([(i - (w - 1) / 2) * r * 0.3, y]); }
      pts.forEach(([x, y]) => {
        g.fillStyle = rad(g, x - r * 0.05, y - r * 0.05, 0, r * 0.2, [[0, '#F7889B'], [0.6, '#C9213F'], [1, '#860D25']]);
        circle(g, x, y, r * 0.17); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.7)'; circle(g, x - r * 0.05, y - r * 0.06, r * 0.035); g.fill();
      });
      g.fillStyle = '#4F8A35';
      for (let i = 0; i < 5; i++) { g.save(); g.translate(0, -r * 0.72); g.rotate((i - 2) * 0.5); g.beginPath(); g.ellipse(0, -r * 0.1, r * 0.05, r * 0.16, 0, 0, TAU); g.fill(); g.restore(); }
    },
    coconut(g, r) {
      g.fillStyle = rad(g, 0, 0, r * 0.7, r, [[0, '#8A5A36'], [1, '#4E2E18']]);
      circle(g, 0, 0, r); g.fill();
      g.strokeStyle = 'rgba(200,160,110,0.45)'; g.lineWidth = 1;
      for (let i = 0; i < 26; i++) { const a = (i * TAU) / 26; g.beginPath(); g.moveTo(Math.cos(a) * r * 0.86, Math.sin(a) * r * 0.86); g.lineTo(Math.cos(a + 0.12) * r * 0.99, Math.sin(a + 0.12) * r * 0.99); g.stroke(); }
      g.fillStyle = '#3A2213'; circle(g, 0, 0, r * 0.82); g.fill();
      g.fillStyle = rad(g, -r * 0.15, -r * 0.15, 0, r * 0.8, [[0, '#FFFFFF'], [1, '#EFE9DC']]);
      circle(g, 0, 0, r * 0.74); g.fill();
    },
    melon(g, r) {
      g.save(); g.translate(0, -r * 0.25);
      g.fillStyle = '#7FA94A'; g.beginPath(); g.arc(0, 0, r, 0, Math.PI); g.closePath(); g.fill();
      g.fillStyle = '#F4E3B0'; g.beginPath(); g.arc(0, 0, r * 0.9, 0, Math.PI); g.closePath(); g.fill();
      g.fillStyle = rad(g, 0, 0, r * 0.1, r * 0.85, [[0, '#FFC487'], [1, '#F08A3C']]);
      g.beginPath(); g.arc(0, 0, r * 0.84, 0, Math.PI); g.closePath(); g.fill();
      g.fillStyle = '#FBEFD2';
      for (let i = 0; i < 7; i++) { g.beginPath(); g.ellipse((i - 3) * r * 0.17, r * 0.2, r * 0.035, r * 0.07, 0, 0, TAU); g.fill(); }
      g.restore();
    },
    fig(g, r) {
      g.fillStyle = rad(g, -r * 0.2, 0, r * 0.2, r, [[0, '#7A3A72'], [1, '#3E1838']]);
      g.beginPath(); g.moveTo(0, -r); g.bezierCurveTo(r * 0.45, -r * 0.6, r * 0.95, 0, r * 0.75, r * 0.55); g.quadraticCurveTo(0, r * 1.05, -r * 0.75, r * 0.55); g.bezierCurveTo(-r * 0.95, 0, -r * 0.45, -r * 0.6, 0, -r); g.fill();
      g.fillStyle = '#F2D6C2'; g.beginPath(); g.ellipse(0, r * 0.2, r * 0.6, r * 0.62, 0, 0, TAU); g.fill();
      g.fillStyle = rad(g, 0, r * 0.25, 0, r * 0.55, [[0, '#F7A08A'], [1, '#C2353A']]);
      g.beginPath(); g.ellipse(0, r * 0.22, r * 0.5, r * 0.52, 0, 0, TAU); g.fill();
      g.fillStyle = 'rgba(255,240,210,0.85)';
      for (let i = 0; i < 18; i++) { const a = i * 2.4, d = r * (0.12 + (i % 5) * 0.07); circle(g, Math.cos(a) * d, r * 0.22 + Math.sin(a) * d, r * 0.025); g.fill(); }
    },
    pinecone(g, r) {
      g.rotate(0.35);
      g.fillStyle = rad(g, -r * 0.2, -r * 0.2, r * 0.1, r, [[0, '#B88050'], [1, '#5A3216']]);
      g.beginPath(); g.ellipse(0, 0, r * 0.62, r * 0.95, 0, 0, TAU); g.fill();
      for (let row = 0; row < 7; row++) {
        const y = -r * 0.75 + row * r * 0.25, w = Math.sqrt(Math.max(0, 1 - (y / (r * 0.95)) ** 2)) * r * 0.6;
        for (let x = -w + r * 0.14 * (row % 2); x <= w; x += r * 0.28) {
          g.fillStyle = 'rgba(60,30,10,0.45)'; g.beginPath(); g.ellipse(x, y + r * 0.04, r * 0.13, r * 0.08, 0, 0, Math.PI); g.fill();
          g.strokeStyle = 'rgba(230,190,140,0.5)'; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y, r * 0.13, r * 0.08, 0, 0, Math.PI); g.stroke();
        }
      }
    },
    saffron(g, r) {
      g.lineCap = 'round';
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI / 2 + (i - 3) * 0.32;
        g.strokeStyle = lin(g, 0, r * 0.6, Math.cos(a) * r, Math.sin(a) * r, [[0, '#8E140F'], [0.7, '#D1281C'], [1, '#F2A23A']]);
        g.lineWidth = r * 0.06;
        g.beginPath(); g.moveTo(0, r * 0.65);
        g.quadraticCurveTo(Math.cos(a) * r * 0.3 + (i % 2 ? 6 : -6), Math.sin(a) * r * 0.3, Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95);
        g.stroke();
      }
    }
  };

  const spriteCache = new Map();
  function spriteCanvas(key) {
    if (spriteCache.has(key)) return spriteCache.get(key);
    const [name, variant] = key.split(':');
    let c = null;
    if (SPRITES[name]) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const px = Math.round(SPRITE_PX * dpr);
      const art = document.createElement('canvas');
      art.width = art.height = px;
      const g = art.getContext('2d');
      if (g) {
        g.scale(dpr, dpr);
        g.translate(SPRITE_PX / 2, SPRITE_PX / 2);
        SPRITES[name](g, SPRITE_PX * 0.42, variant);
        // Tek parça yumuşak gölge: çizim zeminden hafifçe ayrılır
        c = document.createElement('canvas');
        c.width = c.height = px;
        const s2 = c.getContext('2d');
        s2.shadowColor = 'rgba(40, 25, 10, 0.22)';
        s2.shadowBlur = 6 * dpr;
        s2.shadowOffsetY = 3 * dpr;
        s2.drawImage(art, 0, 0);
      }
    }
    spriteCache.set(key, c);
    return c;
  }

  // Süzülen malzemeler: kokunun hareketiyle aynı yöne gider (yapraklar ve yağmurda düşer, rüzgârda yana kayar,
  // diğerlerinde yavaşça yükselir). Esans değişince eskiler solar, yenileri belirir.
  let floaters = [];
  let spriteKeys = [];
  let floatMotion = '';
  const FLOAT_DIR = {
    petals: { vx: [2, 10], vy: [10, 22] },
    rain: { vx: [6, 14], vy: [18, 32] },
    wind: { vx: [22, 44], vy: [-4, 4] },
    rise: { vx: [-4, 4], vy: [-20, -9] }
  };
  // Konum: geniş ekranda başlık metninin olmadığı sağ yarıda ve sol kenar boşluğunda (metnin üstünden geçmesin);
  // dar ekranda metin tüm genişliği kapladığı için her yerde, ama daha saydam (drawFloaters).
  const spawnX = () => (W < 900 ? rand(0, W) : Math.random() < 0.84 ? rand(W * 0.53, W) : rand(0, W * 0.06));
  function makeFloater(key, fromEdge) {
    const d = FLOAT_DIR[floatMotion] || FLOAT_DIR.rise;
    const t = Math.random();
    const s = t < 0.5 ? rand(30, 40) : t < 0.88 ? rand(42, 56) : rand(60, 76);
    const f = {
      key, img: spriteCanvas(key), s, x: spawnX(), y: rand(0, H),
      vx: rand(d.vx[0], d.vx[1]), vy: rand(d.vy[0], d.vy[1]), rot: rand(-0.6, 0.6), vr: rand(-0.3, 0.3),
      ph: rand(0, TAU), amp: rand(6, 16), a: s > 58 ? rand(0.4, 0.55) : rand(0.62, 0.88), fa: 0, out: false
    };
    if (fromEdge) {
      if (Math.abs(f.vx) > Math.abs(f.vy)) f.x = f.vx > 0 ? -s : W + s;
      else f.y = f.vy > 0 ? -s : H + s;
      f.fa = 1;
    }
    return f;
  }
  function setFloaters(panel) {
    spriteKeys = (panel.dataset.sprites || '').split(',').filter(Boolean);
    floatMotion = panel.dataset.motion;
    floaters.forEach(f => { f.out = true; });
    if (!spriteKeys.length || !W) return;
    const count = Math.max(6, Math.round(13 * density()));
    const lead = Math.round(count * 0.32);
    for (let i = 0; i < count; i++) floaters.push(makeFloater(i < lead ? spriteKeys[0] : spriteKeys[1 + ((i - lead) % Math.max(1, spriteKeys.length - 1))] || spriteKeys[0], false));
  }
  // Listedeki ilk malzeme kokunun en belirgin malzemesidir (ör. Oud Malaki'de dilim portakal): daha sık görünür
  const pickKey = () => (Math.random() < 0.32 || spriteKeys.length < 2 ? spriteKeys[0] : spriteKeys[1 + Math.floor(Math.random() * (spriteKeys.length - 1))]);
  function drawFloaters(dt) {
    const dim = (root.dataset.theme === 'dark' ? 0.8 : 1) * (W < 900 ? 0.7 : 1);
    floaters = floaters.filter(f => {
      if (!dt) { if (f.out) return false; f.fa = 1; } // durağan kare: eskiler hemen gider
      else f.fa = f.out ? f.fa - dt * 2.2 : Math.min(1, f.fa + dt * 1.2);
      if (f.out && f.fa <= 0) return false;
      f.x += (f.vx + windX * 0.8) * dt;
      f.y += f.vy * dt;
      f.rot += f.vr * dt;
      const pad = f.s * 1.2;
      if (f.x < -pad || f.x > W + pad || f.y < -pad || f.y > H + pad) {
        if (f.out) return false;
        Object.assign(f, makeFloater(pickKey(), true));
      }
      if (!f.img) return true;
      const k = f.s / (SPRITE_PX * 0.84); // çizimin yarıçapı SPRITE_PX * 0.42
      ctx.save();
      ctx.globalAlpha = f.a * f.fa * dim;
      ctx.translate(f.x + Math.sin(time * 0.6 + f.ph) * f.amp, f.y);
      ctx.rotate(f.rot + Math.sin(time * 0.4 + f.ph) * 0.15);
      ctx.drawImage(f.img, (-SPRITE_PX * k) / 2, (-SPRITE_PX * k) / 2, SPRITE_PX * k, SPRITE_PX * k);
      ctx.restore();
      return true;
    });
  }

  function seed() {
    items = []; extras = []; fx = [];
    if (mode === 'wind') {
      for (let i = 0; i < n(44); i++) items.push({ x: rand(-200, W), y: rand(0, H), v: rand(50, 130), len: rand(70, 200), amp: rand(6, 22), f: rand(0.004, 0.009), ph: rand(0, TAU), a: rand(0.12, 0.32), w: rand(0.8, 1.7), c: i % 2 });
      for (let i = 0; i < n(10); i++) extras.push({ x: rand(0, W), y: rand(0, H), v: rand(40, 90), s: rand(5, 10), rot: rand(0, TAU), vr: rand(-1.2, 1.2), ph: rand(0, TAU), a: rand(0.25, 0.45), c: 1 + (i % 2) });
    } else if (mode === 'petals') {
      for (let i = 0; i < n(28); i++) items.push({ x: rand(0, W), y: rand(0, H), s: rand(7, 16), vy: rand(16, 38), vx: rand(4, 16), amp: rand(12, 30), f: rand(0.4, 0.9), ph: rand(0, TAU), rot: rand(0, TAU), vr: rand(-0.6, 0.6), flip: rand(0, TAU), vf: rand(0.6, 1.4), a: rand(0.24, 0.5), c: i % 3 });
    } else if (mode === 'mist') {
      for (let i = 0; i < 4; i++) items.push({ base: 0.6 + i * 0.095, amp: 14 + i * 6, lambda: 420 + i * 170, v: (i % 2 ? -1 : 1) * (12 + i * 7), a: 0.07 + i * 0.022, ph: rand(0, TAU) });
      for (let i = 0; i < n(24); i++) extras.push({ x: rand(0, W), y: rand(0, H), r: rand(1.5, 4.5), vy: rand(8, 22), amp: rand(4, 14), f: rand(0.5, 1.1), ph: rand(0, TAU), a: rand(0.18, 0.4), c: 1 + (i % 2) });
    } else if (mode === 'fizz') {
      // Yükselen kabarcıklar (turunçgil ve meyvenin canlılığı) ve yanıp sönen ışıltılar
      for (let i = 0; i < n(40); i++) items.push({ x: rand(0, W), y: rand(0, H), r: rand(1.5, 6.5), vy: rand(28, 85), amp: rand(3, 10), f: rand(1, 2.4), ph: rand(0, TAU), a: rand(0.22, 0.5), c: i % 3 });
      for (let i = 0; i < n(14); i++) extras.push({ x: rand(0, W), y: rand(0, H), s: rand(3, 7), ph: rand(0, TAU), f: rand(0.6, 1.4), c: i % 3 });
    } else if (mode === 'ember') {
      // Sıcak kıvılcımlar yavaşça yükselir, titreşir; arkada kıvrılarak yükselen duman
      for (let i = 0; i < n(30); i++) items.push({ x: rand(0, W), y: rand(0, H), r: rand(1.2, 3.4), vy: rand(10, 32), amp: rand(10, 30), f: rand(0.2, 0.6), ph: rand(0, TAU), fl: rand(2, 6), a: rand(0.35, 0.7), c: i % 2 });
      for (let i = 0; i < 5; i++) extras.push({ x: rand(0.1, 0.9) * W, y: rand(0, H * 1.4), vy: rand(14, 26), len: rand(160, 320), amp: rand(18, 40), ph: rand(0, TAU), w: rand(14, 30), a: rand(0.05, 0.1) });
    } else if (mode === 'powder') {
      // Pudra bulutları: büyük, yumuşak, çok yavaş süzülen lekeler ve ince toz
      for (let i = 0; i < n(14); i++) items.push({ x: rand(0, W), y: rand(0, H), r: rand(40, 120), vx: rand(-8, 8), vy: rand(-6, 6), ph: rand(0, TAU), a: rand(0.07, 0.16), c: i % 3 });
      for (let i = 0; i < n(36); i++) extras.push({ x: rand(0, W), y: rand(0, H), r: rand(0.8, 2), vx: rand(-6, 6), vy: rand(-10, -2), ph: rand(0, TAU), a: rand(0.2, 0.45), c: i % 3 });
    } else if (mode === 'rain') {
      // Çapraz düşen yağmur, yere değdiği yerde halka; rüzgârda birkaç yaprak
      for (let i = 0; i < n(70); i++) items.push({ x: rand(-100, W), y: rand(-H, H), len: rand(10, 24), v: rand(380, 620), a: rand(0.14, 0.32), stop: rand(0.55, 1) * H });
      for (let i = 0; i < n(6); i++) extras.push({ x: rand(0, W), y: rand(0, H), v: rand(30, 60), s: rand(6, 10), rot: rand(0, TAU), vr: rand(-1, 1), ph: rand(0, TAU), a: rand(0.25, 0.4), c: 1 + (i % 2) });
    } else if (mode === 'stars') {
      // Gece: yanıp sönen dört köşeli yıldızlar, ara sıra kayan yıldız, köşede ay ışığı
      for (let i = 0; i < n(46); i++) items.push({ x: rand(0, W), y: rand(0, H), s: rand(1.5, 5), ph: rand(0, TAU), f: rand(0.4, 1.3), vx: rand(-3, -1), c: i % 3 });
      extras.push({ next: rand(2, 5), active: false });
    }
  }

  // Ekranın dışına çıkan parçacık diğer kenardan girer
  const wrapX = (p, pad) => { if (p.x > W + pad) p.x = -pad; else if (p.x < -pad) p.x = W + pad; };

  function leaf(p, dt, color) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-p.s, 0);
    ctx.quadraticCurveTo(0, -p.s * 0.6, p.s, 0);
    ctx.quadraticCurveTo(0, p.s * 0.6, -p.s, 0);
    ctx.fill();
    ctx.restore();
  }

  function drawWind(dt) {
    const gust = 1 + 0.35 * Math.sin(time * 0.35);
    ctx.lineCap = 'round';
    for (const p of items) {
      p.x += (p.v * gust + windX) * dt;
      if (p.x - p.len > W) { p.x = rand(-160, -20); p.y = rand(0, H); }
      if (p.x < -260) p.x = W + p.len;
      const yAt = x => p.y + p.amp * Math.sin(x * p.f + p.ph + time * 0.6);
      const x0 = p.x - p.len;
      const g = ctx.createLinearGradient(x0, 0, p.x, 0);
      g.addColorStop(0, col(p.c, 0));
      g.addColorStop(1, col(p.c, p.a));
      ctx.strokeStyle = g;
      ctx.lineWidth = p.w;
      ctx.beginPath();
      ctx.moveTo(x0, yAt(x0));
      for (let i = 1; i <= 6; i++) { const x = x0 + (p.len * i) / 6; ctx.lineTo(x, yAt(x)); }
      ctx.stroke();
    }
    for (const p of extras) {
      p.x += (p.v * gust + windX) * dt;
      p.y += Math.sin(time * 0.8 + p.ph) * 14 * dt;
      p.rot += p.vr * dt;
      if (p.x - p.s > W) { p.x = -p.s; p.y = rand(0, H); }
      wrapX(p, 20);
      leaf(p, dt, col(p.c, p.a));
    }
  }

  function drawPetals(dt) {
    for (const p of items) {
      p.y += p.vy * dt;
      p.x += (p.vx + windX) * dt;
      p.rot += p.vr * dt;
      p.flip += p.vf * dt;
      if (p.y - p.s > H) { p.y = -p.s; p.x = rand(-40, W); }
      wrapX(p, 40);
      const x = p.x + p.amp * Math.sin(time * p.f + p.ph);
      ctx.save();
      ctx.translate(x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.5 + 0.5 * Math.abs(Math.cos(p.flip)));
      ctx.fillStyle = col(p.c, p.a, 8);
      ctx.beginPath();
      ctx.moveTo(0, -p.s);
      ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.6, 0, p.s);
      ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.6, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawMist(dt) {
    items.forEach((p, i) => {
      const base = H * p.base;
      ctx.fillStyle = col(i % 2 ? 0 : 1, p.a);
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
    });
    ctx.lineWidth = 1;
    for (const p of extras) {
      p.y -= p.vy * dt;
      p.x += windX * dt;
      if (p.y + p.r < 0) { p.y = H + p.r; p.x = rand(0, W); }
      wrapX(p, 10);
      const x = p.x + p.amp * Math.sin(time * p.f + p.ph);
      const fade = Math.min(1, p.y / (H * 0.25));
      ctx.strokeStyle = col(p.c, p.a * fade);
      ctx.fillStyle = col(p.c, p.a * fade * 0.3);
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, TAU);
      ctx.fill();
      ctx.stroke();
    }
  }

  function sparkle(x, y, s, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.quadraticCurveTo(x, y, x + s, y);
    ctx.quadraticCurveTo(x, y, x, y + s);
    ctx.quadraticCurveTo(x, y, x - s, y);
    ctx.quadraticCurveTo(x, y, x, y - s);
    ctx.fill();
  }

  function drawFizz(dt) {
    ctx.lineWidth = 1;
    for (const p of items) {
      p.y -= p.vy * dt * (1 + 0.6 * (1 - p.y / H)); // yükseldikçe hızlanır
      p.x += windX * dt;
      if (p.y + p.r < 0) { p.y = H + rand(0, 40); p.x = rand(0, W); }
      wrapX(p, 10);
      const x = p.x + p.amp * Math.sin(time * p.f + p.ph);
      const fade = Math.min(1, p.y / (H * 0.2));
      ctx.strokeStyle = col(p.c, p.a * fade);
      ctx.fillStyle = col(p.c, p.a * fade * 0.25);
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, TAU);
      ctx.fill();
      ctx.stroke();
      if (p.r > 3.5) { // parlama noktası
        ctx.fillStyle = col(p.c, p.a * fade * 0.9, 30);
        ctx.beginPath();
        ctx.arc(x - p.r * 0.35, p.y - p.r * 0.35, p.r * 0.22, 0, TAU);
        ctx.fill();
      }
    }
    for (const p of extras) {
      const tw = Math.sin(time * p.f * TAU * 0.5 + p.ph);
      if (tw < -0.98) { p.x = rand(0, W); p.y = rand(0, H); }
      if (tw > 0) sparkle(p.x, p.y, p.s * tw, col(p.c, 0.55 * tw, 10));
    }
  }

  function drawEmber(dt) {
    // Duman: dikey, kıvrılan geniş ve çok soluk şeritler
    ctx.lineCap = 'round';
    for (const s of extras) {
      s.y -= s.vy * dt;
      if (s.y + s.len < 0) { s.y = H + rand(0, 200); s.x = rand(0.1, 0.9) * W; }
      ctx.strokeStyle = col(0, s.a);
      ctx.lineWidth = s.w;
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const t = i / 12, y = s.y + t * s.len;
        const x = s.x + s.amp * Math.sin(t * 3 + time * 0.5 + s.ph) * (0.4 + t);
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    for (const p of items) {
      p.y -= p.vy * dt;
      p.x += windX * dt;
      if (p.y + p.r < 0) { p.y = H + rand(0, 30); p.x = rand(0, W); }
      wrapX(p, 20);
      const x = p.x + p.amp * Math.sin(time * p.f + p.ph);
      const flick = 0.6 + 0.4 * Math.sin(time * p.fl + p.ph);
      const fade = Math.min(1, p.y / (H * 0.3));
      ctx.fillStyle = col(1, p.a * flick * fade * 0.25, 10);
      ctx.beginPath();
      ctx.arc(x, p.y, p.r * 3.2, 0, TAU);
      ctx.fill();
      ctx.fillStyle = col(p.c, p.a * flick * fade, 12);
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, TAU);
      ctx.fill();
    }
  }

  function drawPowder(dt) {
    for (const p of items) {
      p.x += (p.vx + windX * 0.6) * dt;
      p.y += p.vy * dt + Math.sin(time * 0.3 + p.ph) * 4 * dt;
      if (p.y < -p.r) p.y = H + p.r; else if (p.y > H + p.r) p.y = -p.r;
      wrapX(p, p.r);
      const breathe = 1 + 0.08 * Math.sin(time * 0.5 + p.ph);
      const r = p.r * breathe;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, col(p.c, p.a, 10));
      g.addColorStop(1, col(p.c, 0, 10));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, TAU);
      ctx.fill();
    }
    for (const p of extras) {
      p.x += (p.vx + windX) * dt + Math.sin(time + p.ph) * 3 * dt;
      p.y += p.vy * dt;
      if (p.y < -4) { p.y = H + 4; p.x = rand(0, W); }
      wrapX(p, 4);
      ctx.fillStyle = col(p.c, p.a * (0.6 + 0.4 * Math.sin(time * 1.5 + p.ph)));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, TAU);
      ctx.fill();
    }
  }

  function drawRain(dt) {
    const slant = 0.22 + windX / 400;
    ctx.lineCap = 'round';
    ctx.lineWidth = 1.1;
    for (const p of items) {
      p.y += p.v * dt;
      p.x += p.v * slant * dt;
      if (p.y > p.stop) {
        if (fx.length < 40) fx.push({ x: p.x, y: p.y, r: 1, a: p.a * 1.4 }); // damla halkası
        p.y = rand(-80, -10);
        p.x = rand(-100, W);
        p.stop = rand(0.55, 1) * H;
      }
      ctx.strokeStyle = col(0, p.a);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.len * slant, p.y - p.len);
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    fx = fx.filter(r => {
      r.r += 26 * dt;
      r.a -= 0.55 * dt;
      if (r.a <= 0) return false;
      ctx.strokeStyle = col(1, r.a);
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.r, r.r * 0.32, 0, 0, TAU);
      ctx.stroke();
      return true;
    });
    for (const p of extras) {
      p.x += (p.v + windX) * dt;
      p.y += (18 + Math.sin(time * 0.8 + p.ph) * 14) * dt;
      p.rot += p.vr * dt;
      if (p.y - p.s > H) { p.y = -p.s; p.x = rand(0, W); }
      wrapX(p, 20);
      leaf(p, dt, col(p.c, p.a));
    }
  }

  function drawStars(dt) {
    // Köşede ay ışığı
    const glow = ctx.createRadialGradient(W * 0.86, H * 0.12, 0, W * 0.86, H * 0.12, Math.max(W, H) * 0.45);
    glow.addColorStop(0, col(1, 0.22, 10));
    glow.addColorStop(1, col(1, 0, 10));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    for (const p of items) {
      p.x += (p.vx + windX * 0.3) * dt;
      wrapX(p, 10);
      const tw = 0.5 + 0.5 * Math.sin(time * p.f * TAU * 0.5 + p.ph);
      sparkle(p.x, p.y, p.s * (0.5 + 0.5 * tw), col(p.c, 0.18 + 0.5 * tw, 6));
    }
    // Kayan yıldız: birkaç saniyede bir, sol üste doğru çapraz
    const sh = extras[0];
    if (!sh) return;
    if (!sh.active) {
      sh.next -= dt;
      if (sh.next <= 0) Object.assign(sh, { active: true, x: rand(0.35, 1) * W, y: rand(0, 0.4) * H, t: 0, v: rand(520, 760) });
      return;
    }
    sh.t += dt;
    sh.x -= sh.v * dt;
    sh.y += sh.v * 0.42 * dt;
    const life = 1 - sh.t / 0.9;
    if (life <= 0 || sh.x < -50) { sh.active = false; sh.next = rand(4, 9); return; }
    const g = ctx.createLinearGradient(sh.x, sh.y, sh.x + 140, sh.y - 59);
    g.addColorStop(0, col(2, 0.75 * life, 10));
    g.addColorStop(1, col(2, 0, 10));
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(sh.x, sh.y);
    ctx.lineTo(sh.x + 140, sh.y - 59);
    ctx.stroke();
  }

  const DRAW = { wind: drawWind, petals: drawPetals, mist: drawMist, fizz: drawFizz, ember: drawEmber, powder: drawPowder, rain: drawRain, stars: drawStars };

  function draw(dt) {
    mixPal(dt);
    windX += (windTarget - windX) * Math.min(1, dt * 1.5);
    ctx.clearRect(0, 0, W, H);
    drawFloaters(dt);
    (DRAW[mode] || (() => {}))(dt);
  }

  const running = () => !userPaused && !offscreen && !document.hidden && !reduce.matches;

  function frame(now) {
    raf = 0;
    const dt = Math.max(0, Math.min((now - last) / 1000, 0.05));
    last = now;
    time += dt;
    draw(dt);
    if (running()) raf = requestAnimationFrame(frame);
  }
  function play() {
    stage.classList.toggle('is-still', userPaused);
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
    if (reseed) {
      seed();
      // Malzemeler yeni boyuta göre yeniden dağıtılır
      if (current) { floaters = []; setFloaters(current); floaters.forEach(f => { f.fa = 1; }); }
    }
    still();
  }

  // Hareket değişimi: canvas kısa bir solmayla yeni harekete geçer; aynı harekette yalnızca palet değişir
  function setScene(panel, instant) {
    palTarget = readPalette(panel);
    if (!palTarget.length) palTarget = pal;
    if (!ctx) return;
    setFloaters(panel);
    const motion = panel.dataset.motion;
    if (motion === mode) { still(); return; }
    clearTimeout(swapTimer);
    const swap = () => {
      mode = motion;
      pal = palTarget.slice();
      seed();
      canvas.classList.add('is-on');
      still();
      play();
    };
    if (instant || !mode) { swap(); return; }
    canvas.classList.remove('is-on');
    swapTimer = setTimeout(swap, 260);
  }

  // ---------------------------------------------------------------------------
  // Seçim
  // ---------------------------------------------------------------------------
  let current = null;
  let hue = Number(stage.style.getPropertyValue('--e-h')) || 0;
  let hueAnim = 0;
  // Renk tonu en kısa yoldan ve yumuşakça döner (350 -> 10: 20 derece). hsl() 360'ı aşan tonu kendisi sarar.
  // Azaltılmış harekette ve ilk açılışta anında.
  function setHue(target, instant) {
    const from = hue;
    const to = hue + (((target - hue + 540) % 360) - 180);
    cancelAnimationFrame(hueAnim);
    const put = v => { hue = v; stage.style.setProperty('--e-h', v.toFixed(1)); };
    if (instant || reduce.matches || Math.abs(to - from) < 0.5) { put(((to % 360) + 360) % 360); return; }
    const t0 = performance.now();
    // Kare zaman damgası t0'dan biraz önce olabilir: oran 0-1 aralığında tutulur; bitişte ton 0-360'a döner
    const tick = now => {
      const k = Math.max(0, Math.min(1, (now - t0) / 800));
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // ease-in-out (ekranda yer değiştiren renk)
      put(from + (to - from) * e);
      if (k < 1) hueAnim = requestAnimationFrame(tick);
      else put(((to % 360) + 360) % 360);
    };
    hueAnim = requestAnimationFrame(tick);
  }
  const lastInFam = {}; // her ailede en son bakılan esans (sekmeye dönünce o açılır)
  const panelOf = id => panels.find(p => p.dataset.essence === id);
  const famPanels = fam => panels.filter(p => p.dataset.fam === fam);

  // Görsel henüz inmediyse giriş animasyonu iner inmez başlar (en fazla 700 ms beklenir)
  function enter(panel) {
    panel.classList.remove('is-entering');
    void panel.offsetWidth;
    const img = panel.querySelector('.essence__figure img');
    const go = () => {
      panel.classList.add('is-entering');
      clearTimeout(panel._enterTimer);
      panel._enterTimer = setTimeout(() => panel.classList.remove('is-entering'), 2200);
    };
    if (!img || img.complete) { go(); return; }
    let done = false;
    const once = () => { if (!done) { done = true; go(); } };
    img.addEventListener('load', once, { once: true });
    img.addEventListener('error', once, { once: true });
    setTimeout(once, 700);
  }

  // Seçili esansın görselini ve aynı ailedeki komşularınınkini önceden indirir
  function preload(panel) {
    if (!panel || panel._preloaded) return;
    panel._preloaded = true;
    const source = panel.querySelector('.essence__figure source');
    const img = panel.querySelector('.essence__figure img');
    if (!img) return;
    const pre = new Image();
    if (source) { pre.sizes = source.sizes; pre.srcset = source.srcset; }
    pre.src = img.getAttribute('src');
  }

  function select(id, { animate = false, instant = false, updateUrl = true } = {}) {
    const panel = panelOf(id);
    if (!panel) return false;
    const fam = panel.dataset.fam;
    current = panel;
    lastInFam[fam] = id;

    famButtons.forEach(b => {
      const on = b.dataset.famBtn === fam;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
      if (on && famText) famText.textContent = b.dataset.text || '';
    });
    picks.forEach(b => {
      b.classList.toggle('is-in-fam', b.dataset.fam === fam);
      b.setAttribute('aria-pressed', String(b.dataset.pick === id));
    });
    panels.forEach(p => p.classList.toggle('is-active', p === panel));

    setHue(Number(panel.dataset.hue), instant);
    stage.dataset.fam = fam;
    stage.dataset.motion = panel.dataset.motion;
    setScene(panel, instant);

    // Önceki / sonraki: ailedeki sıra
    const list = famPanels(fam);
    const i = list.indexOf(panel);
    if (stepNav) {
      stepNav.hidden = list.length < 2;
      if (stepPos) stepPos.textContent = `${i + 1} / ${list.length}`;
    }
    preload(list[(i + 1) % list.length]);
    preload(list[(i - 1 + list.length) % list.length]);

    // Telefondaki şeritte seçili esans görünür alana kayar (sayfa dikeyde kaymaz)
    const pick = picks.find(b => b.dataset.pick === id);
    if (picker && pick && picker.scrollWidth > picker.clientWidth) {
      const left = pick.offsetLeft - (picker.clientWidth - pick.offsetWidth) / 2;
      picker.scrollTo({ left, behavior: reduce.matches || instant ? 'auto' : 'smooth' });
    }

    if (animate) enter(panel);
    if (updateUrl && window.history && history.replaceState) history.replaceState(null, '', `#esans-${id}`);
    return true;
  }

  function selectFam(fam, opts) {
    const list = famPanels(fam);
    const id = lastInFam[fam] || (list[0] && list[0].dataset.essence);
    return id ? select(id, opts) : false;
  }

  function step(dir, opts) {
    if (!current) return;
    const list = famPanels(current.dataset.fam);
    const next = list[(list.indexOf(current) + dir + list.length) % list.length];
    select(next.dataset.essence, opts);
  }

  // Aile sekmelerine kaydırır (aile kartlarından ve sayfa içi bağlantılardan gelindiğinde; sabit başlık payı CSS'te)
  const controls = stage.querySelector('.essence-controls') || stage;
  function toStage() {
    controls.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
  }

  famButtons.forEach(btn => btn.addEventListener('click', () => {
    if (btn.getAttribute('aria-pressed') !== 'true') selectFam(btn.dataset.famBtn, { animate: true });
  }));
  picks.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.getAttribute('aria-pressed') !== 'true') select(btn.dataset.pick, { animate: true });
    });
    btn.addEventListener('pointerenter', () => preload(panelOf(btn.dataset.pick)));
    btn.addEventListener('focus', () => preload(panelOf(btn.dataset.pick)));
  });
  // Seçicide ok tuşları: ailedeki önceki / sonraki esansa geçer ve odağı taşır
  picker?.addEventListener('keydown', (e) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir || !e.target.closest('[data-pick]')) return;
    e.preventDefault();
    step(dir, { animate: true });
    picks.find(b => b.dataset.pick === current.dataset.essence)?.focus();
  });
  stepNav?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-step]');
    if (btn) step(Number(btn.dataset.step), { animate: true });
  });

  // Sayfanın alt bölümlerindeki aile kartları ve renk küreleri
  document.addEventListener('click', (e) => {
    const famLink = e.target.closest('[data-fam-link]');
    const pickLink = e.target.closest('[data-pick-link]');
    if (!famLink && !pickLink) return;
    e.preventDefault();
    if (famLink) {
      selectFam(famLink.dataset.famLink, { animate: true, updateUrl: false });
      if (history.replaceState) history.replaceState(null, '', `#aile-${famLink.dataset.famLink}`);
    } else {
      select(pickLink.dataset.pickLink, { animate: true });
    }
    toStage();
  });

  function fromHash(animate) {
    const h = window.location.hash;
    const e = (h.match(/^#esans-([\w-]+)$/) || [])[1];
    if (e) return select(e, { animate, updateUrl: false });
    const f = (h.match(/^#aile-([\w-]+)$/) || [])[1];
    if (f) return selectFam(f, { animate, updateUrl: false });
    return false;
  }
  window.addEventListener('hashchange', () => { if (fromHash(true)) toStage(); });

  // Teklif listesine eklenen esansın seçicideki küresi kısa bir "parlama" yapar (ekleme components.js'te)
  stage.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add-to-list]');
    if (!add || reduce.matches) return;
    const orb = picks.find(b => b.dataset.pick === add.dataset.addToList)?.querySelector('.essence-orb');
    orb?.animate?.([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  });

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
    // Tema değişince palet yeni temaya göre okunur ve durağan kare yeniden çizilir
    if ('MutationObserver' in window) {
      new MutationObserver(() => { if (current) { palTarget = readPalette(current); pal = palTarget.slice(); } still(); })
        .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }
    // İmleç rüzgârı (yalnızca fare; dokunmatikte kaydırmayla karışmasın)
    stage.addEventListener('pointermove', (e) => {
      if (!finePointer.matches || e.pointerType !== 'mouse') return;
      windTarget = ((e.clientX / Math.max(1, window.innerWidth)) - 0.5) * 56;
    });
    stage.addEventListener('pointerleave', () => { windTarget = 0; });

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
    motionBtn?.addEventListener('click', () => { userPaused = !userPaused; syncMotionBtn(); play(); still(); });
    const onReduceChange = () => { syncMotionBtn(); still(); play(); };
    if (reduce.addEventListener) reduce.addEventListener('change', onReduceChange);
    syncMotionBtn();
  }

  // İlk seçim: adresteki çapa (#esans-... / #aile-...) ya da sayfada işaretli esans. Sayfa açılışında da giriş oynar.
  if (!fromHash(true)) {
    const active = panels.find(p => p.classList.contains('is-active')) || panels[0];
    if (active) select(active.dataset.essence, { animate: true, instant: true, updateUrl: false });
  }
  if (stepNav) stepNav.hidden = !current || famPanels(current.dataset.fam).length < 2;
})();
