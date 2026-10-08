#!/usr/bin/env node
/**
 * Meira site üreticisi (isteğe bağlı bakım aracı; yalnızca Node yerleşik modülleri).
 *
 * Site düz HTML'dir ve çalışmak için bu betiğe ihtiyaç duymaz. Betik, tekrarlanan parçaları
 * tek kaynaktan yazmak için vardır:
 *   - Tüm sayfaların <head> bölümü (başlık, açıklama, kanonik adres, Open Graph, JSON-LD),
 *     başlık (header) ve footer'ı
 *   - Ürün sayfaları (urun-<id>.html) products.js verisinden
 *   - Blog dizini ve yazıları (tools/content/blog.mjs), Sürdürülebilirlik ve SSS (tools/content/pages.mjs)
 *   - urunler.html katalog ızgarası ve esanslar.html koku listesinin önceden basılmış HTML'i
 *   - index.html ürün videoları ve sertifika şeridi, kurumsal.html sertifikalar bölümü (işaretli bölgeler)
 *   - sitemap.xml, robots.txt, 404.html
 *
 * Kullanım:  node tools/build.mjs
 * products.js, içerik dosyaları ya da başlık/footer değiştiğinde yeniden çalıştırın.
 * Elle yazılmış sayfaların <main> içeriğine dokunmaz (katalog ve koku listesi işaretli bölümler hariç).
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { POSTS } from './content/blog.mjs';
import { SUSTAINABILITY, FAQ, PRIVACY } from './content/pages.mjs';
import { CERTS, CERT_INFO } from './content/certs.mjs';

// [DOĞRULANACAK] Alan adı yer tutucudur. Kesinleşince yalnızca bu değeri değiştirip betiği çalıştırın.
const SITE_URL = 'https://www.meira.com.tr';
const BRAND = 'Meira';
const EMAIL = 'info@meira.com.tr';
const TODAY = '2026-10-07';
const DEFAULT_OG = 'images/brand/og-meira.jpg';
const DEFAULT_OG_ALT = 'Meira: oteller, ofisler ve mağazalar için profesyonel koku difüzörleri';
const MANUFACTURER = 'Dongguan Zhiliangzhi Fragrance Technology Co., Ltd.';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(DIR, '../site');

// ---------------------------------------------------------------------------
// Veri
// ---------------------------------------------------------------------------
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(SITE, 'js/products.js'), 'utf8') + ';globalThis.__D={PRODUCTS,CATEGORIES,SCENTS,OILS};', ctx);
const { PRODUCTS, CATEGORIES, SCENTS, OILS } = ctx.__D;

const CAT_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));
const CAT_SHORT = { wall: 'Duvar tipi', pro: 'Profesyonel ve klima', plug: 'Prize takılan ve pasif', home: 'Ev, araç ve masaüstü', reed: 'Çubuklu kokular' };

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const abs = p => `${SITE_URL}/${p}`;
const icon = (name, cls = '') => `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true" focusable="false"><use href="images/icons.svg#i-${name}"></use></svg>`;
const imgPath = (p, suffix = '') => `images/${p.external ? 'general' : 'products'}/${p.img}${suffix}.jpg`;
const spec = (p, re) => (p.specs.find(s => re.test(s[0])) || [])[1] || '';
const productUrl = p => `urun-${p.id}.html`;
const postUrl = post => `blog-${post.slug}.html`;
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const trDate = iso => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const fmt = n => n.toLocaleString('tr-TR');
const clip = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:]$/, '') + '.');
const write = (file, html) => fs.writeFileSync(path.join(SITE, file),
  html.replace(/<div class="table-wrap">/g, '<div class="table-wrap" tabindex="0" role="region" aria-label="Tablo (yatay kaydırılabilir)">'));
const ld = obj => `  <script type="application/ld+json">${JSON.stringify(obj)}</script>\n`;

// Görsel boyutu: JPEG SOF ya da PNG IHDR başlığından (og:image:width/height ve img width/height için)
const sizeCache = new Map();
function imageSize(rel) {
  if (sizeCache.has(rel)) return sizeCache.get(rel);
  let out = null;
  try {
    const b = fs.readFileSync(path.join(SITE, rel));
    if (b[0] === 0x89 && b[1] === 0x50) out = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    else if (b[0] === 0xFF && b[1] === 0xD8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xFF) { i++; continue; }
        const m = b[i + 1];
        if ([0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF].includes(m)) { out = { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) }; break; }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch (e) { out = null; }
  sizeCache.set(rel, out);
  return out;
}
const dims = rel => { const d = imageSize(rel); return d ? ` width="${d.w}" height="${d.h}"` : ''; };

// Önbellek sürümü: dosya içeriğinin özeti. CSS/JS değişince adres değişir, uzun önbellek güvenle kullanılır.
const hashOf = rel => crypto.createHash('sha256').update(fs.readFileSync(path.join(SITE, rel))).digest('hex').slice(0, 10);
const JS_FILES = ['site-config', 'products', 'components', 'site'];
const VER = { css: hashOf('css/style.css'), logo: hashOf('images/brand/logo-sprite.svg'), ...Object.fromEntries(JS_FILES.map(n => [n, hashOf(`js/${n}.js`)])) };

// Meira logosu (images/brand/logo-sprite.svg). word: yazı ve duman (2,33:1), full: "AIR SCENT" sloganıyla (1,88:1)
const LOGO_VB = { word: '0 0 1199.1 515.6', full: '0 0 1199.1 638.9' };
const logo = (kind, cls) => `<svg class="${cls}" viewBox="${LOGO_VB[kind]}" aria-hidden="true" focusable="false"><use href="images/brand/logo-sprite.svg?v=${VER.logo}#logo-${kind}"></use></svg>`;

// Ürün görseli: modern tarayıcıya 640 px WebP, diğerlerine özgün JPEG (images/products/w640/*.webp)
const webpPath = (p, suffix = '') => p.external ? '' : `images/products/w640/${p.img}${suffix}.webp`;
function pictureFor(rel, { alt = '', sizes = '(min-width: 1100px) 400px, 92vw', attrs = '', small = true } = {}) {
  const m = small && rel.match(/^images\/products\/([\w-]+)\.jpg$/);
  const w = m && fs.existsSync(path.join(SITE, `images/products/w640/${m[1]}.webp`)) ? `images/products/w640/${m[1]}.webp` : '';
  return `<picture>${w ? `<source type="image/webp" srcset="${w} 640w" sizes="${sizes}">` : ''}<img src="${rel}" alt="${esc(alt)}"${dims(rel)}${attrs}></picture>`;
}
function productPicture(p, { alt = '', sizes = '(min-width: 1100px) 300px, (min-width: 640px) 45vw, 92vw', suffix = '', attrs = '' } = {}) {
  const src = imgPath(p, suffix);
  const w = webpPath(p, suffix);
  return `<picture>${w ? `<source type="image/webp" srcset="${w} 640w" sizes="${sizes}">` : ''}<img src="${src}" alt="${esc(alt)}"${dims(src)}${attrs}></picture>`;
}

// Kapsama metnindeki m³ değerleri; "/" ile ayrılan her seçenek tek değer ya da aralıktır
// (ör. "2.000-5.000 / 4.000-8.000 m³" -> [[2000, 5000], [4000, 8000]], "300 m³" -> [[300]])
function coverageValues(p) {
  const s = spec(p, /kapsama/i);
  if (!/m³/.test(s)) return [];
  return s.split('/')
    .map(part => (part.match(/\d[\d.]*/g) || []).map(n => parseInt(n.replace(/\./g, ''), 10)).filter(Boolean))
    .filter(r => r.length);
}
// Hacim aralığını belirli bir tavan yüksekliğinde taban alanına çevirir (5 m²'ye yuvarlanır)
const floorArea = (r, h) => r.map(v => fmt(Math.floor(v / h / 5) * 5)).join('-');
const volRange = r => r.map(fmt).join('-');

// ---------------------------------------------------------------------------
// Ortak parçalar
// ---------------------------------------------------------------------------
const ORG_ID = `${SITE_URL}/#organization`;
const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: BRAND,
  url: `${SITE_URL}/`,
  email: EMAIL,
  description: 'JVCK koku difüzörleri ve esanslarının Türkiye distribütörü. Oteller, ofisler, mağazalar ve yaşam alanları için profesyonel mekân kokulandırma ürünleri ve teklif.',
  address: { '@type': 'PostalAddress', addressLocality: 'İstanbul', addressCountry: 'TR' },
  areaServed: 'TR',
  logo: { '@type': 'ImageObject', url: abs('images/brand/logo-meira.png'), width: 1040, height: 600 },
  image: abs(DEFAULT_OG)
};
const WEBSITE = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: BRAND, inLanguage: 'tr-TR', publisher: { '@id': ORG_ID } };

function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, ...(it.href ? { item: abs(it.href) } : {}) }))
  };
}

function breadcrumbHtml(items) {
  return `<nav class="breadcrumb" aria-label="Sayfa konumu">
        <ol>
          ${items.map((it, i) => i === items.length - 1
            ? `<li aria-current="page">${esc(it.name)}</li>`
            : `<li><a href="${esc(it.href)}">${esc(it.name)}</a></li>`).join('\n          ')}
        </ol>
      </nav>`;
}

// Açılış perdesi kararı ilk boyamadan önce verilir: oturumda site daha önce açıldıysa ya da azaltılmış hareket
// tercih ediliyorsa perde hiç gösterilmez (no-intro). site.js her sayfada 'meira-visited' bayrağını yazar.
const INTRO_SCRIPT = `<script>(function(d){try{if(sessionStorage.getItem('meira-visited')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('no-intro')}else{d.classList.add('has-intro')}}catch(e){d.classList.add('no-intro')}})(document.documentElement);</script>`;

function head({ title, description, url, image = DEFAULT_OG, imageAlt = DEFAULT_OG_ALT, type = 'website', jsonld = [], noindex = false, dark = false, published, intro = false }) {
  const og = imageSize(image);
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
  <meta name="theme-color" content="#141C27">
${noindex ? '' : `  <link rel="canonical" href="${abs(url)}">\n`}  <meta property="og:type" content="${type}">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${abs(url)}">
  <meta property="og:image" content="${abs(image)}">
${og ? `  <meta property="og:image:width" content="${og.w}">\n  <meta property="og:image:height" content="${og.h}">\n` : ''}  <meta property="og:image:alt" content="${esc(imageAlt)}">
${published ? `  <meta property="article:published_time" content="${published}">\n  <meta property="article:modified_time" content="${published}">\n` : ''}  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="images/brand/icon-180.png">
  <link rel="manifest" href="site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="${BRAND} Blog" href="feed.xml">
  <link rel="preload" href="fonts/newsreader-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/style.css?v=${VER.css}">
  <script>document.documentElement.classList.add('js');</script>
${intro ? `  ${INTRO_SCRIPT}\n` : ''}${jsonld.map(ld).join('')}`;
}

const NAV = [
  ['urunler.html', 'Ürünler'],
  ['cozumler.html', 'Çözümler'],
  ['teknoloji.html', 'Teknoloji'],
  ['esanslar.html', 'Esanslar'],
  ['kurumsal.html', 'Kurumsal &amp; OEM'],
  ['blog.html', 'Blog'],
  ['iletisim.html', 'İletişim']
];

function header({ dark = false } = {}) {
  return `<header class="site-header"${dark ? ' data-header' : ''}>
    <div class="wrap site-header__inner">
      <a href="index.html" class="brand">${logo('word', 'brand__logo')}<span class="visually-hidden" lang="en" data-site="brand">${BRAND}</span></a>

      <nav class="nav" id="navLinks" aria-label="Ana menü">
        ${NAV.map(([href, label]) => `<a href="${href}" class="nav-item">${label}</a>`).join('\n        ')}
      </nav>

      <div class="nav-actions">
        <button type="button" class="quote-trigger" aria-label="Teklif listesi">
          ${icon('clipboard-text')}
          <span class="quote-trigger__label">Teklif listesi</span>
          <span class="quote-badge dc-cart-count empty" aria-hidden="true">0</span>
        </button>
        <button type="button" class="burger-btn" id="burgerBtn" aria-label="Menü" aria-expanded="false" aria-controls="navLinks">
          ${icon('list', 'icon--lg icon-open')}${icon('x', 'icon--lg icon-close')}
        </button>
      </div>
    </div>
  </header>`;
}

function footer() {
  const cats = CATEGORIES.filter(c => c.id !== 'all');
  return `<footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="brand">${logo('word', 'brand__logo')}<span class="visually-hidden" lang="en" data-site="brand">${BRAND}</span></a>
          <!-- [DOĞRULANACAK] Distribütörlüğün kapsamı (resmi / tek yetkili) belgelenmeden bu ifadeler kullanılmamalı. -->
          <p>JVCK koku difüzörleri ve esanslarının Türkiye distribütörü. Oteller, ofisler, mağazalar ve yaşam alanları için ürün seçimi ve teklif.</p>
          <p class="footer-certs"><a href="kurumsal.html#sertifikalar">${CERTS.map(c => esc(c.short)).join(' · ')} sertifikalı</a></p>
        </div>
        <div class="footer-col footer-col--a">
          <h2>Ürünler</h2>
          <ul>
            ${cats.map(c => `<li><a href="urunler.html?cat=${c.id}">${esc(CAT_SHORT[c.id])}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="footer-col footer-col--b">
          <h2>Kurumsal</h2>
          <ul>
            <li><a href="cozumler.html">Çözümler</a></li>
            <li><a href="teknoloji.html">Teknoloji</a></li>
            <li><a href="esanslar.html">Esanslar</a></li>
            <li><a href="kurumsal.html">Kurumsal &amp; OEM</a></li>
            <li><a href="surdurulebilirlik.html">Sürdürülebilirlik</a></li>
          </ul>
        </div>
        <div class="footer-col footer-col--c">
          <h2>Kaynaklar</h2>
          <ul>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="sss.html">Sık sorulan sorular</a></li>
            <li><a href="cozumler.html#hesaplayici">Hacim hesaplayıcı</a></li>
            <li><a href="iletisim.html">Teklif formu</a></li>
            <li><a href="gizlilik.html">Gizlilik ve KVKK</a></li>
          </ul>
        </div>
        <div class="footer-col footer-col--d">
          <h2>İletişim</h2>
          <!-- [DOĞRULANACAK] E-posta, telefon ve adres yer tutucudur (js/site-config.js). -->
          <ul>
            <li><a href="mailto:${EMAIL}" data-site-href="email"><span data-site="email">${EMAIL}</span></a></li>
            <li><a href="tel:+902120000000" data-site-href="phone"><span data-site="phone">+90&nbsp;212&nbsp;000&nbsp;00&nbsp;00</span></a></li>
            <li><span data-site="city">İstanbul, Türkiye</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-wordmark" aria-hidden="true">${logo('full', 'footer-wordmark__logo')}</div>
      <div class="footer-bottom">
        <span>© <span data-year>2026</span> <span data-site="brand">${BRAND}</span>. Tüm hakları saklıdır.</span>
        <span>Teknik veriler üreticinin 2025 ürün kataloğundan alınmıştır. <a href="gizlilik.html">Gizlilik ve KVKK</a></span>
      </div>
    </div>
  </footer>`;
}

const SCRIPTS = JS_FILES.map(n => `<script src="js/${n}.js?v=${VER[n]}"></script>`).join('\n  ');

function page({ meta, section = '', main, after = '', dark = false }) {
  return `<!DOCTYPE html>
<!-- Bu sayfa tools/build.mjs ile üretilir. Elle düzenlemeyin; içerik kaynağı için betiğe bakın. -->
<html lang="tr">
<head>${head({ ...meta, dark })}</head>
<body${section ? ` data-section="${section}"` : ''}>
  <a class="skip-link" href="#main">İçeriğe geç</a>

  ${header({ dark })}

  <main id="main">
${main}
  </main>

  ${footer()}

  ${SCRIPTS}${after}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Ürün videoları (products.js -> videos). Dosyalar images/products/videos/<file>.mp4 ve kapak <file>.jpg/.webp
// ---------------------------------------------------------------------------
const VIDEO_UPLOAD = '2026-10-08T12:00:00+03:00';
const videoSrc = v => `images/products/videos/${v.file}.mp4`;
const videoPoster = v => `images/products/videos/${v.file}.jpg`;
const mmss = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
const isoDuration = sec => `PT${Math.floor(sec / 60) ? Math.floor(sec / 60) + 'M' : ''}${sec % 60}S`;
const durationTr = sec => `${Math.floor(sec / 60)} dk${sec % 60 ? ` ${sec % 60} sn` : ''}`;
const videoMeta = v => `Video süresi ${durationTr(v.duration)}`;
const videoLd = (p, v) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: `${v.title} (${p.model}${v.label ? ` ${v.label.toLocaleLowerCase('tr')}` : ''})`,
  description: v.summary,
  thumbnailUrl: [abs(videoPoster(v))],
  uploadDate: VIDEO_UPLOAD,
  duration: isoDuration(v.duration),
  contentUrl: abs(videoSrc(v))
});

function productVideoSection(p) {
  if (!p.videos || !p.videos.length) return '';
  const v0 = p.videos[0];
  const switcher = p.videos.length > 1
    ? `<div class="video-switch" role="group" aria-label="Video">
            ${p.videos.map((v, i) => `<button type="button" class="video-switch__btn" aria-pressed="${i === 0}" data-video-switch data-src="${videoSrc(v)}" data-poster="${videoPoster(v)}" data-title="${esc(v.title)}" data-summary="${esc(v.summary)}" data-meta="${esc(videoMeta(v))}">${esc(v.label)}</button>`).join('\n            ')}
          </div>`
    : '';
  return `
    <section class="section section--dark pd-video" aria-labelledby="video-title" data-video-player>
      <div class="wrap pd-video__grid">
        <div class="pd-video__text reveal">
          <p class="section-label" aria-hidden="true">Ürün videosu</p>
          <h2 id="video-title" data-video-title>${esc(v0.title)}</h2>
          <p class="pd-video__summary" data-video-summary>${esc(v0.summary)}</p>
          ${switcher}
          <p class="note" data-video-meta>${esc(videoMeta(v0))}</p>
        </div>
        <div class="pd-video__player reveal">
          <div class="media media--16x9"><video controls playsinline preload="none" poster="${videoPoster(v0)}"${dims(videoPoster(v0))} aria-label="${esc(v0.title)}"><source src="${videoSrc(v0)}" type="video/mp4"></video></div>
        </div>
      </div>
    </section>
`;
}

// ---------------------------------------------------------------------------
// Ürün kartı (katalog ızgarası, ilgili ürünler). urunler.html içindeki şablonla aynı tutulmalı.
// ---------------------------------------------------------------------------
function productCard(p, headingTag = 'h2') {
  const area = spec(p, /kapsama/i);
  const cap = spec(p, /kapasite/i);
  return `<article class="product-card" data-id="${esc(p.id)}">
            <div class="media">${productPicture(p, { alt: p.model + ' ' + p.title, attrs: ` loading="lazy" decoding="async" style="object-position:${esc(p.pos || 'center')}"` })}${p.videos ? `<span class="product-card__video">${icon('play')}Video</span>` : ''}</div>
            <div class="product-card__body">
              <div class="product-card__top">
                <span class="product-card__code">${esc(p.model)}</span>
                ${p.badge ? `<span>${esc(p.badge)}</span>` : ''}
              </div>
              <${headingTag} class="product-card__title"><a href="${productUrl(p)}" class="product-card__link">${esc(p.title)}</a></${headingTag}>
              <p class="product-card__desc">${esc(p.short)}</p>
              <p class="product-card__meta">${[area, cap].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join('')}</p>
              <div class="product-card__actions">
                <span class="link-arrow" aria-hidden="true">İncele ${icon('arrow-right')}</span>
                <button type="button" class="btn-add" data-act="add-quote" aria-label="${esc(p.model)} ürününü teklif listesine ekle">${icon('plus')}<span>Listeye ekle</span></button>
              </div>
            </div>
          </article>`;
}

// ---------------------------------------------------------------------------
// Ürün sayfaları
// ---------------------------------------------------------------------------
function techOf(p) {
  const f = p.features.join(' ');
  if (/ultrason/i.test(f)) return 'ultrasonik';
  if (/çift akışkanlı|iki akışkanlı/i.test(f)) return 'çift akışkanlı';
  if (/nano/i.test(f)) return 'nano';
  return '';
}

function productFaq(p) {
  const items = [];
  const cov = spec(p, /kapsama/i);
  const vals = coverageValues(p);
  if (cov) {
    const tail = vals.length
      ? ` 3 m tavan yüksekliğinde bu, yaklaşık ${vals.map(r => floorArea(r, 3) + ' m²').join(' / ')} taban alanına karşılık gelir.`
      : '';
    items.push([`${p.model} ne kadar alanı kokulandırır?`, `Üretici verisine göre kapsama alanı ${cov}.${tail} Bölmeli alanlar, güçlü havalandırma ya da yoğun ziyaretçi trafiği birden fazla cihaz gerektirebilir.`]);
  }
  const tech = techOf(p);
  if (tech === 'ultrasonik') items.push([`${p.model} hangi yöntemle çalışır?`, 'Ultrasonik atomizasyonla çalışır: esans, yüksek frekansta titreşen bir plakayla ince bir sise dönüştürülür. Isı kullanılmaz.']);
  else if (tech === 'çift akışkanlı') items.push([`${p.model} hangi yöntemle çalışır?`, 'Çift akışkanlı (basınçlı hava) atomizasyonla çalışır: hava akımı esansı çok ince parçacıklara ayırır. Su ve ısı kullanılmaz.']);
  else if (tech === 'nano') items.push([`${p.model} hangi yöntemle çalışır?`, 'Üretici, bu modelde nano atomizasyon kullanıldığını belirtmektedir: esans çok ince parçacıklar halinde havaya verilir.']);
  const power = spec(p, /güç kaynağı/i) || spec(p, /gerilim|güç/i);
  if (power) items.push([`${p.model} nasıl çalıştırılır, güç kaynağı nedir?`, `Üretici verisine göre güç kaynağı: ${power}.`]);
  const noise = spec(p, /^ses/i);
  if (noise) items.push([`${p.model} ne kadar ses çıkarır?`, `Üretici verisine göre ses seviyesi ${noise}.`]);
  const cap = spec(p, /kapasite/i);
  if (cap) items.push([`Esans kapasitesi ne kadar?`, `${p.model} için esans kapasitesi ${cap}. Dolum sıklığı çalışma saatlerine, püskürtme ve bekleme sürelerine ve yoğunluk ayarına bağlıdır.`]);
  if (/klima|taze hava/i.test(p.features.join(' '))) items.push([`${p.model} klima sistemine bağlanabilir mi?`, 'Üretici verisine göre evet. Bağlantı noktası (dönüş havası kanalı ya da santral çıkışı) binanın mekanik tesisatına göre belirlenir.']);
  items.push([`${p.model} için nasıl teklif alabilirim?`, 'Bu sayfadaki "Listeye ekle" butonuyla ürünü teklif listenize ekleyin, ardından teklif formuna aktarın. Online satış yoktur; fiyat, stok durumu ve teslim süresi teklifle bildirilir.']);
  return items;
}

function productPage(p) {
  const images = [imgPath(p), ...Array.from({ length: p.gallery || 0 }, (_, i) => imgPath(p, `-g${i + 1}`))];
  const tech = techOf(p);
  const facts = [
    ['Kapsama alanı', spec(p, /kapsama/i)],
    ['Esans kapasitesi', spec(p, /kapasite/i)],
    ['Ses seviyesi', spec(p, /^ses/i)],
    ['Güç kaynağı', spec(p, /güç kaynağı/i) || spec(p, /gerilim/i)]
  ].filter(f => f[1]).slice(0, 4);
  const vals = coverageValues(p);
  const covText = spec(p, /kapsama/i);
  let fit = '';
  if (vals.length) {
    const rows = vals.map(r => `<tr><td>${volRange(r)} m³</td><td>${floorArea(r, 3)} m²</td><td>${floorArea(r, 4)} m²</td><td>${floorArea(r, 6)} m²</td></tr>`).join('');
    fit = `<h2>Mekâna uygunluk</h2>
            <p>Üretici verisine göre kapsama alanı ${esc(covText)}. Aşağıdaki tablo bu hacmin farklı tavan yüksekliklerinde yaklaşık hangi taban alanına karşılık geldiğini gösterir (açık ve tek parça bir alan için).</p>
            <div class="table-wrap">
              <table>
                <caption>Kapsama hacminin taban alanı karşılığı</caption>
                <thead><tr><th scope="col">Kapsama</th><th scope="col">3 m tavan</th><th scope="col">4 m tavan</th><th scope="col">6 m tavan</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
            <p>Kendi ölçülerinizle hesaplamak için <a href="cozumler.html#hesaplayici">hacim hesaplayıcıyı</a> kullanabilirsiniz.</p>`;
  } else if (covText) {
    fit = `<h2>Mekâna uygunluk</h2>
            <p>Üretici bu model için kapsamayı taban alanı olarak vermektedir: ${esc(covText)}. Yatak odası, çalışma odası ve benzeri küçük alanlar için uygundur.</p>`;
  }
  const uses = (p.use || '').split(',').map(s => s.trim()).filter(Boolean);
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  if (related.length < 3) related.push(...PRODUCTS.filter(x => x.cat !== p.cat && x.id !== p.id).slice(0, 3 - related.length));
  const faq = productFaq(p);
  const esansOils = OILS.filter(o => o.type === 'Esans');
  const refill = p.cat === 'reed'
    ? `<p>Çubuklu oda kokuları elektrik gerektirmez; koku, çubuklar aracılığıyla şişeden yavaşça yayılır. Diğer koku ailelerini <a href="esanslar.html">koku koleksiyonunda</a> inceleyebilirsiniz.</p>`
    : `<p>Cihazlar yeniden doldurulabilir. Dolum için sunulan esans ambalajları:</p>
            <ul class="refill-list refill-list--compact">
              ${esansOils.map(o => `<li><span class="refill-list__code">${esc(o.code)}</span><span><span class="refill-list__name">${esc(o.name)}</span><span class="refill-list__note">${esc(o.note)}</span></span></li>`).join('\n              ')}
            </ul>
            <p class="note">Modelinize uygun esans tipini ve dolum hacmini teklif aşamasında teyit ederiz.</p>
            <!-- [DOĞRULANACAK] Hangi esans tipinin (standart / suda çözünür / kartuş) hangi modelle kullanıldığı üreticiden teyit edilmeli. -->`;

  const crumbs = [
    { name: 'Ana sayfa', href: 'index.html' },
    { name: 'Ürünler', href: 'urunler.html' },
    { name: CAT_SHORT[p.cat], href: `urunler.html?cat=${p.cat}` },
    { name: p.model }
  ];
  const title = `${p.model} ${p.title} | ${BRAND}`;
  const description = clip(`${p.model} ${p.title}: ${p.short} Teknik veriler, kullanım alanları ve teklif.`, 158);
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${p.model} ${p.title}`,
    sku: p.model,
    mpn: p.model,
    category: CAT_LABEL[p.cat],
    description: p.desc,
    image: images.map(abs),
    url: abs(productUrl(p)),
    brand: { '@type': 'Brand', name: 'JVCK' },
    manufacturer: { '@type': 'Organization', name: MANUFACTURER },
    additionalProperty: p.specs.map(([k, v]) => ({ '@type': 'PropertyValue', name: k, value: v }))
  };
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

  const main = `
    <div class="wrap">
      ${breadcrumbHtml(crumbs)}
    </div>

    <section class="pd wrap" aria-labelledby="pd-title">
      <div class="pd__gallery" data-gallery>
        <button type="button" class="modal-zoom" data-zoom aria-pressed="false" aria-label="Görseli yakınlaştır"><img src="${images[0]}" alt="${esc(p.model + ' ' + p.title)}" class="modal-main-img" data-main${dims(images[0])} fetchpriority="high" style="object-position:${esc(p.pos || 'center')}"></button>
        ${images.length > 1 ? `<div class="modal-thumb-row">
          ${images.map((src, i) => `<button type="button" class="modal-thumb${i === 0 ? ' active' : ''}" data-src="${src}" data-pos="${i === 0 ? esc(p.pos || 'center') : 'center'}" aria-label="Görsel ${i + 1} / ${images.length}" aria-pressed="${i === 0}">${productPicture(p, { suffix: i === 0 ? '' : `-g${i}`, sizes: '72px', attrs: ' loading="lazy" decoding="async"' })}</button>`).join('\n          ')}
        </div>` : ''}
      </div>

      <div class="pd__info">
        <p class="pd__code"><span>${esc(p.model)}</span>${p.badge ? `<span class="pd__badge">${esc(p.badge)}</span>` : ''}</p>
        <h1 id="pd-title">${esc(p.title)}</h1>
        <p class="lead">${esc(p.short)}</p>
        ${facts.length ? `<dl class="pd-facts">
          ${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n          ')}
        </dl>` : ''}
        <div class="btn-row pd__actions">
          <button type="button" class="btn btn--primary btn--lg" data-add-to-list="${esc(p.id)}">${icon('plus', 'icon--sm')}<span>Listeye ekle</span></button>
          <button type="button" class="btn btn--quiet btn--lg" data-quote-now="${esc(p.id)}">Teklif iste</button>
        </div>
        <p class="note">Online satış yoktur; fiyat, stok ve teslim süresi teklifle bildirilir.</p>
        <ul class="pd-links">
          <li><a href="urunler.html?cat=${p.cat}" class="link-arrow">Tüm ${esc(CAT_SHORT[p.cat].toLocaleLowerCase('tr'))} modeller ${icon('arrow-right')}</a></li>
          ${tech === 'ultrasonik' || tech === 'çift akışkanlı' ? `<li><a href="blog-ultrasonik-ve-cift-akiskanli-difuzor-farki.html" class="link-arrow">Ultrasonik ve çift akışkanlı farkı ${icon('arrow-right')}</a></li>` : ''}
        </ul>
      </div>
    </section>
${productVideoSection(p)}
    <section class="section" aria-label="Ürün ayrıntıları">
      <div class="wrap pd-body">
        <div class="pd-body__main prose prose--article">
          <h2>Ürün hakkında</h2>
          <p>${esc(p.desc)}</p>
          ${p.features.length ? `<h2>Öne çıkan özellikler</h2>
          <ul class="check-list">
            ${p.features.map(f => `<li>${icon('check')}<span>${esc(f)}</span></li>`).join('\n            ')}
          </ul>` : ''}
          ${fit}
          ${uses.length ? `<h2>Kullanım alanları</h2>
          <ul class="tag-list">
            ${uses.map(u => `<li class="tag">${esc(u)}</li>`).join('\n            ')}
          </ul>` : ''}
          ${p.variants && p.variants.length ? `<h2>Varyantlar</h2>
          <ul>
            ${p.variants.map(v => `<li>${esc(v)}</li>`).join('\n            ')}
          </ul>` : ''}
        </div>
        <div class="pd-body__aside">
          <h2 id="specs-title">Teknik veriler</h2>
          <dl class="spec-table">
            ${p.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n            ')}
          </dl>
          <p class="note mt-3">Üretici katalog verisidir; değerler varyanta göre değişebilir.</p>
        </div>
      </div>
    </section>

    <section class="section section--deep" aria-labelledby="refill-title">
      <div class="wrap split split--top">
        <div class="split__a">
          <h2 id="refill-title">${p.cat === 'reed' ? 'Koku ve kullanım' : 'Esans ve dolum'}</h2>
          ${refill}
        </div>
        <div class="split__b">
          <h3>Mekânınıza uygun koku</h3>
          <p class="mt-3 text-2">Koleksiyondaki ${SCENTS.length} koku; ferah çay notalarından odunsu ve çiçeksi kokulara kadar üç katmanlı nota piramitleriyle.</p>
          <p class="mt-5"><a href="esanslar.html" class="link-arrow">Koku koleksiyonu ${icon('arrow-right')}</a></p>
          <p class="mt-2"><a href="iletisim.html?konu=numune" class="link-arrow">Numune iste ${icon('arrow-right')}</a></p>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="faq-title">
      <div class="wrap faq-layout">
        <h2 id="faq-title">${esc(p.model)} hakkında sorular</h2>
        <div class="faq">
          ${faq.map(([q, a]) => `<details class="faq__item">
            <summary>${esc(q)}${icon('plus', 'faq__icon')}</summary>
            <p>${esc(a)}</p>
          </details>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section section--flush-top" aria-labelledby="related-title">
      <div class="wrap">
        <div class="section-head">
          <h2 id="related-title">Benzer ürünler</h2>
        </div>
        <div class="product-grid product-grid--3">
          ${related.map(r => productCard(r, 'h3')).join('\n          ')}
        </div>
      </div>
    </section>
`;
  return page({
    meta: { title, description, url: productUrl(p), image: images[0], imageAlt: `${p.model} ${p.title}`, type: 'product', jsonld: [productLd, breadcrumbLd(crumbs), faqLd, ...(p.videos || []).map(v => videoLd(p, v))] },
    section: 'urunler.html',
    main
  });
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------
function postCard(post, featured = false) {
  return `<article class="post-card${featured ? ' post-card--featured' : ''}">
          <div class="media media--3x2">${pictureFor(post.image, { small: !featured, sizes: '(min-width: 1100px) 400px, (min-width: 700px) 45vw, 92vw', attrs: ` loading="lazy" decoding="async" style="object-position:${post.imagePos || 'center'}"` })}</div>
          <div class="post-card__body">
            <p class="post-card__meta"><span>${esc(post.tags[0])}</span><span><time datetime="${post.date}">${trDate(post.date)}</time></span><span>${post.minutes} dk okuma</span></p>
            <h2 class="post-card__title"><a href="${postUrl(post)}" class="post-card__link">${esc(post.title)}</a></h2>
            <p class="post-card__desc">${esc(post.description)}</p>
          </div>
        </article>`;
}

function blogIndex() {
  const crumbs = [{ name: 'Ana sayfa', href: 'index.html' }, { name: 'Blog' }];
  const main = `
    <section class="page-head" aria-labelledby="page-title">
      <div class="wrap">
        <h1 id="page-title">Mekân kokulandırma rehberi</h1>
        <p class="lead">Koku pazarlaması araştırmaları, cihaz seçimi, klima bağlantısı, esans güvenliği ve doğru yoğunluk üzerine kaynaklı rehberler.</p>
      </div>
    </section>

    <section class="section section--flush-top" aria-label="Yazılar">
      <div class="wrap">
        <div class="post-grid">
        ${POSTS.map((post, i) => postCard(post, i === 0)).join('\n        ')}
        </div>
      </div>
    </section>
`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Blog', name: `${BRAND} Blog`, url: abs('blog.html'), inLanguage: 'tr-TR', publisher: { '@id': ORG_ID },
    blogPost: POSTS.map(p => ({ '@type': 'BlogPosting', headline: p.title, url: abs(postUrl(p)), datePublished: p.date }))
  };
  return page({
    meta: { title: `Mekân Kokulandırma Rehberi ve Blog | ${BRAND}`, description: 'Koku pazarlaması, difüzör seçimi, klima bağlantısı, IFRA standartları ve doğru koku yoğunluğu üzerine kaynaklı rehber yazılar.', url: 'blog.html', image: POSTS[0].image, jsonld: [ld, breadcrumbLd(crumbs)] },
    section: 'blog.html',
    main
  });
}

function blogPost(post) {
  const crumbs = [{ name: 'Ana sayfa', href: 'index.html' }, { name: 'Blog', href: 'blog.html' }, { name: post.navTitle }];
  const related = post.related.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean).slice(0, 3);
  const others = POSTS.filter(p => p.slug !== post.slug).slice(0, 3);
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: post.title, description: post.description, image: [abs(post.image)],
    datePublished: post.date, dateModified: post.date, inLanguage: 'tr-TR',
    author: { '@type': 'Organization', name: BRAND, url: `${SITE_URL}/` },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: abs(postUrl(post)),
    keywords: post.tags.join(', ')
  };
  const main = `
    <div class="wrap">
      ${breadcrumbHtml(crumbs)}
    </div>

    <article class="article" aria-labelledby="post-title">
      <header class="article__head wrap">
        <p class="post-card__meta"><span>${post.tags.map(esc).join(', ')}</span><span><time datetime="${post.date}">${trDate(post.date)}</time></span><span>${post.minutes} dk okuma</span></p>
        <h1 id="post-title">${esc(post.title)}</h1>
      </header>
      <figure class="article__figure wrap${(imageSize(post.image)?.w || 0) < 900 ? ' article__figure--narrow' : ''}">
        <div class="media"><img src="${post.image}" alt="${esc(post.imageAlt)}"${dims(post.image)} fetchpriority="high" style="object-position:${post.imagePos || 'center'}"></div>
      </figure>
      <div class="article__body wrap">
        <div class="prose prose--article">
${post.body}
        </div>
        ${post.sources.length ? `<div class="sources">
          <h2 id="sources-title">Kaynaklar</h2>
          <ol>
            ${post.sources.map(s => `<li>${s.url ? `<a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.label)}</a>` : esc(s.label)}</li>`).join('\n            ')}
          </ol>
        </div>` : ''}
      </div>
    </article>

    ${related.length ? `<section class="section section--flush-top" aria-labelledby="related-title">
      <div class="wrap">
        <div class="section-head"><h2 id="related-title">Yazıda geçen ürünler</h2></div>
        <div class="product-grid product-grid--3">
          ${related.map(r => productCard(r, 'h3')).join('\n          ')}
        </div>
      </div>
    </section>` : ''}

    <section class="section section--deep" aria-labelledby="more-title">
      <div class="wrap">
        <div class="section-head"><h2 id="more-title">Diğer yazılar</h2></div>
        <ul class="more-posts">
          ${others.map(o => `<li><a href="${postUrl(o)}"><span class="more-posts__title">${esc(o.title)}</span><span class="more-posts__meta">${o.minutes} dk okuma</span></a></li>`).join('\n          ')}
        </ul>
      </div>
    </section>
`;
  return page({
    meta: { title: `${post.title} | ${BRAND}`.length > 70 ? `${post.navTitle} | ${BRAND}` : `${post.title} | ${BRAND}`, description: post.description, url: postUrl(post), image: post.image, imageAlt: post.imageAlt, type: 'article', published: post.date, jsonld: [articleLd, breadcrumbLd(crumbs)] },
    section: 'blog.html',
    main
  });
}

// ---------------------------------------------------------------------------
// Sürdürülebilirlik ve SSS
// ---------------------------------------------------------------------------
function sustainabilityPage() {
  const S = SUSTAINABILITY;
  const crumbs = [{ name: 'Ana sayfa', href: 'index.html' }, { name: 'Sürdürülebilirlik' }];
  const main = `
    <section class="page-head" aria-labelledby="page-title">
      <div class="wrap">
        <h1 id="page-title">${esc(S.h1)}</h1>
        <p class="lead">${esc(S.lead)}</p>
      </div>
    </section>

    <section class="section section--flush-top" aria-label="İçerik">
      <div class="wrap doc">
        <nav class="doc__toc" aria-label="Bu sayfada">
          <p class="doc__toc-title">Bu sayfada</p>
          <ol>
            ${S.sections.map(s => `<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join('\n            ')}
          </ol>
        </nav>
        <div class="doc__body prose prose--article">
          ${S.sections.map(s => `<section id="${s.id}" aria-labelledby="${s.id}-t">
            <h2 id="${s.id}-t">${esc(s.title)}</h2>
            ${s.html}
          </section>`).join('\n          ')}
          <div class="sources">
            <h2 id="sources-title">Kaynaklar</h2>
            <ol>
              ${S.sources.map(s => `<li>${s.url ? `<a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.label)}</a>` : esc(s.label)}</li>`).join('\n              ')}
            </ol>
          </div>
        </div>
      </div>
    </section>
`;
  return page({
    meta: { title: S.title, description: S.description, url: 'surdurulebilirlik.html', image: 'images/general/oilrange.jpg', jsonld: [breadcrumbLd(crumbs)] },
    main
  });
}

function faqPage() {
  const crumbs = [{ name: 'Ana sayfa', href: 'index.html' }, { name: 'Sık sorulan sorular' }];
  const all = FAQ.groups.flatMap(g => g.items);
  const ldFaq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: all.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  const main = `
    <section class="page-head" aria-labelledby="page-title">
      <div class="wrap">
        <h1 id="page-title">${esc(FAQ.h1)}</h1>
        <p class="lead">${esc(FAQ.lead)}</p>
      </div>
    </section>

    <section class="section section--flush-top" aria-label="Sorular">
      <div class="wrap faq-groups">
        ${FAQ.groups.map(g => `<div class="faq-layout">
          <h2>${esc(g.title)}</h2>
          <div class="faq">
            ${g.items.map(([q, a]) => `<details class="faq__item">
              <summary>${esc(q)}${icon('plus', 'faq__icon')}</summary>
              <p>${esc(a)}</p>
            </details>`).join('\n            ')}
          </div>
        </div>`).join('\n        ')}
        <p class="faq-more">Sorunuzun cevabını bulamadınız mı? <a href="iletisim.html" class="text-link">Teklif formundan bize yazın.</a></p>
      </div>
    </section>
`;
  return page({
    meta: { title: FAQ.title, description: FAQ.description, url: 'sss.html', jsonld: [ldFaq, breadcrumbLd(crumbs)] },
    main
  });
}

function privacyPage() {
  const P = PRIVACY;
  const crumbs = [{ name: 'Ana sayfa', href: 'index.html' }, { name: 'Gizlilik ve KVKK' }];
  const main = `
    <section class="page-head" aria-labelledby="page-title">
      <div class="wrap">
        <h1 id="page-title">${esc(P.h1)}</h1>
        <p class="lead">${esc(P.lead)}</p>
        <p class="meta mt-4">Son güncelleme: <time datetime="${P.updated}">${trDate(P.updated)}</time></p>
      </div>
    </section>

    <section class="section section--flush-top" aria-label="Metin">
      <div class="wrap doc">
        <nav class="doc__toc" aria-label="Bu sayfada">
          <p class="doc__toc-title">Bu sayfada</p>
          <ol>
            ${P.sections.map(x => `<li><a href="#${x.id}">${esc(x.title)}</a></li>`).join('\n            ')}
          </ol>
        </nav>
        <div class="doc__body prose prose--article">
          ${P.sections.map(x => `<section id="${x.id}" aria-labelledby="${x.id}-t">
            <h2 id="${x.id}-t">${esc(x.title)}</h2>
            ${x.html}
          </section>`).join('\n          ')}
        </div>
      </div>
    </section>
`;
  return page({ meta: { title: P.title, description: P.description, url: 'gizlilik.html', jsonld: [breadcrumbLd(crumbs)] }, main });
}

// RSS 2.0 beslemesi (blog)
function feed() {
  const rfc = iso => new Date(`${iso}T09:00:00+03:00`).toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BRAND} Blog</title>
    <link>${abs('blog.html')}</link>
    <description>Mekân kokulandırma, cihaz seçimi ve esans güvenliği üzerine kaynaklı rehberler.</description>
    <language>tr-TR</language>
    <lastBuildDate>${rfc(TODAY)}</lastBuildDate>
    <atom:link href="${abs('feed.xml')}" rel="self" type="application/rss+xml"/>
${POSTS.map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${abs(postUrl(p))}</link>
      <guid isPermaLink="true">${abs(postUrl(p))}</guid>
      <pubDate>${rfc(p.date)}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`).join('\n')}
  </channel>
</rss>
`;
}

// Web uygulama manifesti (ikonlar, renkler)
function manifest() {
  return JSON.stringify({
    name: `${BRAND} Türkiye`,
    short_name: BRAND,
    description: 'Profesyonel koku difüzörleri ve mekân kokulandırma.',
    lang: 'tr-TR',
    start_url: 'index.html',
    display: 'browser',
    background_color: '#F7F4EF',
    theme_color: '#141C27',
    icons: [
      { src: 'images/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'images/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }
    ]
  }, null, 2) + '\n';
}

function notFoundPage() {
  const main = `
    <section class="page-head not-found" aria-labelledby="page-title">
      <div class="wrap">
        <h1 id="page-title">Aradığınız sayfa bulunamadı</h1>
        <p class="lead">Bağlantı değişmiş ya da sayfa kaldırılmış olabilir. Aşağıdaki sayfalardan devam edebilirsiniz.</p>
        <div class="btn-row mt-7">
          <a href="urunler.html" class="btn btn--primary btn--lg">Ürünleri incele</a>
          <a href="index.html" class="btn btn--quiet btn--lg">Ana sayfa</a>
        </div>
      </div>
    </section>
`;
  return page({ meta: { title: `Sayfa bulunamadı | ${BRAND}`, description: 'Aradığınız sayfa bulunamadı.', url: '404.html', noindex: true }, main });
}

// ---------------------------------------------------------------------------
// Elle yazılmış sayfalar: <head>, header, footer ve işaretli bölümler
// ---------------------------------------------------------------------------
const HAND_PAGES = {
  'index.html': {
    title: `${BRAND} | Profesyonel Koku Difüzörleri ve Mekân Kokulandırma`,
    description: 'Oteller, ofisler ve mağazalar için profesyonel koku difüzörleri, esanslar ve dolum ürünleri. JVCK ürünlerinin Türkiye distribütörü; ürün seçimi ve teklif.',
    dark: true, intro: true, jsonld: [ORG, WEBSITE]
  },
  'urunler.html': {
    title: `Koku Difüzörü Kataloğu: Duvar Tipi, Klima ve Masaüstü | ${BRAND}`,
    description: `Duvar tipi, klima bağlantılı, prize takılan, masaüstü difüzörler ve çubuklu oda kokuları. ${PRODUCTS.length} ürünün teknik özellikleri, kapsama alanları ve teklif listesi.`,
    image: 'images/products/ck688.jpg', crumbs: 'Ürünler',
    itemList: true
  },
  'cozumler.html': {
    title: `Otel, Ofis ve Mağaza için Koku Çözümleri | ${BRAND}`,
    description: 'Mekân hacmine göre difüzör seçimi: hacim hesaplayıcı, oteller, mağazalar, ofisler ve büyük alanlar için önerilen modeller ve kapsama aralıkları.',
    image: 'images/general/video-hotel-poster.jpg', crumbs: 'Çözümler'
  },
  'teknoloji.html': {
    title: `Koku Difüzörü Teknolojisi: Ultrasonik ve Basınçlı Hava | ${BRAND}`,
    description: 'Çift akışkanlı (basınçlı hava) ve ultrasonik atomizasyon nasıl çalışır, uygulama kontrolü ve klima sistemine bağlantı. Nitel karşılaştırma ve şematik gösterim.',
    image: 'images/general/video-hero-poster.jpg', crumbs: 'Teknoloji'
  },
  'esanslar.html': {
    title: `Mekân Kokuları ve Difüzör Esansları | ${BRAND}`,
    description: `Otel lobisi karakterinde ${SCENTS.length} koku, üst, kalp ve dip notalarıyla. 500 ml ve 5 L difüzör esansları, kartuşlar ve koku giderme ürünleri.`,
    image: 'images/general/oilrange.jpg', crumbs: 'Esanslar'
  },
  'kurumsal.html': {
    title: `Kurumsal, Distribütörlük ve OEM / ODM | ${BRAND}`,
    description: 'JVCK ürünlerinin Türkiye distribütörü. ISO 9001, ISO 14001 ve ISO 22716 sertifikaları, üretici bilgileri, özel markalı üretim (OEM / ODM) ve kurumsal koku süreci.',
    image: 'images/general/factory2.jpg', crumbs: 'Kurumsal ve OEM'
  },
  'iletisim.html': {
    title: `Teklif İste ve İletişim | ${BRAND}`,
    description: 'Seçtiğiniz koku difüzörleri ve esanslar için teklif isteyin, numune ya da OEM talebinde bulunun. Teklif listenizdeki ürünler forma otomatik eklenir.',
    image: 'images/products/ck686.jpg', crumbs: 'İletişim'
  }
};

function catalogGridHtml() {
  return `<!-- katalog:basla (tools/build.mjs) -->
          ${PRODUCTS.map(p => productCard(p)).join('\n          ')}
          <!-- katalog:bitir -->`;
}

function scentsHtml() {
  return `<!-- kokular:basla (tools/build.mjs) -->
          ${SCENTS.map(s => `<article class="scent">
            <span class="scent__family">${esc(s.family)}</span>
            <h3>${esc(s.name)}</h3>
            <dl>
              <div><dt>Üst nota</dt><dd>${esc(s.top)}</dd></div>
              <div><dt>Kalp notası</dt><dd>${esc(s.mid)}</dd></div>
              <div><dt>Dip nota</dt><dd>${esc(s.base)}</dd></div>
            </dl>
            <a class="link-arrow" href="iletisim.html?esans=${encodeURIComponent(s.name)}">Numune iste ${icon('arrow-right')}</a>
          </article>`).join('\n          ')}
          <!-- kokular:bitir -->`;
}

function oilsHtml() {
  const groups = [{ type: 'Esans', title: 'Difüzör esansları' }, { type: 'Koku Giderme', title: 'Koku giderme' }];
  return `<!-- dolum:basla (tools/build.mjs) -->
          ${groups.map(g => `<div class="refill-group">
            <h3>${esc(g.title)}</h3>
            <ul class="refill-list">
              ${OILS.filter(o => o.type === g.type).map(o => `<li><span class="refill-list__code">${esc(o.code)}</span><span><span class="refill-list__name">${esc(o.name)}</span><span class="refill-list__note">${esc(o.note)}</span></span></li>`).join('\n              ')}
            </ul>
          </div>`).join('\n          ')}
          <!-- dolum:bitir -->`;
}

// Ana sayfa: ürün videoları (kapak kartı + tek bir <dialog> oynatıcı)
function homeVideosHtml() {
  const items = PRODUCTS.filter(p => p.videos && p.videos.length).map(p => ({ p, v: p.videos[0] }));
  return `<div class="video-cards">
          ${items.map(({ p, v }) => `<article class="video-card reveal">
            <button type="button" class="video-card__play" data-video-open data-src="${videoSrc(v)}" data-poster="${videoPoster(v)}" data-title="${esc(v.title)}" data-summary="${esc(v.summary)}" data-meta="${esc(videoMeta(v))}" aria-label="Videoyu izle: ${esc(v.title)}, ${durationTr(v.duration)}">
              <span class="media media--16x9"><picture><source type="image/webp" srcset="images/products/videos/${v.file}.webp 640w" sizes="(min-width: 1100px) 300px, (min-width: 640px) 45vw, 92vw"><img src="${videoPoster(v)}" alt=""${dims(videoPoster(v))} loading="lazy" decoding="async"></picture></span>
              <span class="video-card__icon">${icon('play')}</span>
              <span class="video-card__time">${mmss(v.duration)}</span>
            </button>
            <div class="video-card__body">
              <h3>${esc(v.title)}</h3>
              <p>${esc(v.teaser)}</p>
              <a href="${productUrl(p)}" class="link-arrow">Ürünü incele ${icon('arrow-right')}</a>
            </div>
          </article>`).join('\n          ')}
        </div>
        <dialog class="video-dialog" id="videoDialog" aria-labelledby="videoDialogTitle">
          <div class="video-dialog__head">
            <h2 class="video-dialog__title" id="videoDialogTitle">Ürün videosu</h2>
            <button type="button" class="video-dialog__close" data-video-close aria-label="Videoyu kapat">${icon('x')}</button>
          </div>
          <div class="media media--16x9"><video controls playsinline preload="none"></video></div>
          <div class="video-dialog__foot">
            <p class="video-dialog__text"></p>
            <p class="note video-dialog__meta"></p>
          </div>
        </dialog>`;
}

// Ana sayfa: sertifika şeridi
function certStripHtml() {
  return `<div class="cert-strip reveal">
          <p class="cert-strip__label">Uluslararası sertifikalar</p>
          <ul class="cert-strip__list">
            ${CERTS.map(c => `<li><span class="cert-strip__std">${esc(c.standard)}</span><span class="cert-strip__name">${esc(c.name)}</span></li>`).join('\n            ')}
          </ul>
          <a href="kurumsal.html#sertifikalar" class="link-arrow">Sertifikaları inceleyin ${icon('arrow-right')}</a>
        </div>`;
}

// Kurumsal: sertifikalar bölümü. Önizlemeye tıklayınca büyük görsel bir <dialog> içinde açılır (PDF yayınlanmaz).
function certsHtml() {
  return `<div class="section-head reveal">
          <h2 id="certs-title">Sertifikalarımız</h2>
          <p class="lead">Kalite, çevre ve kozmetikte iyi üretim uygulamaları alanlarındaki yönetim sistemlerimiz, ${esc(CERT_INFO.issuer.split(' (')[0])} tarafından uluslararası ISO standartlarına göre sertifikalandırılmıştır.</p>
        </div>
        <ul class="cert-grid">
          ${CERTS.map(c => `<li class="cert-card reveal">
            <button type="button" class="cert-card__doc" data-cert-open data-src="${c.image}-buyuk.jpg" data-webp="${c.image}-buyuk.webp" data-title="${esc(c.standard + ' ' + c.name)}" aria-label="${esc(c.standard)} sertifikasını büyüt">
              <picture><source type="image/webp" srcset="${c.image}.webp 480w" sizes="(min-width: 900px) 300px, 92vw"><img src="${c.image}.jpg" alt=""${dims(c.image + '.jpg')} loading="lazy" decoding="async"></picture>
              <span class="cert-card__zoom" aria-hidden="true">${icon('magnifying-glass')}Büyüt</span>
            </button>
            <p class="cert-card__std">${esc(c.standard)}</p>
            <h3 class="cert-card__name">${esc(c.name)}</h3>
            <dl class="cert-card__meta">
              <div><dt>Sertifika no</dt><dd>${esc(c.number)}</dd></div>
              <div><dt>Geçerlilik tarihi</dt><dd>${esc(CERT_INFO.validUntil)}</dd></div>
            </dl>
          </li>`).join('\n          ')}
        </ul>
        <dl class="cert-info reveal">
          <div><dt>Sertifika sahibi</dt><dd>${esc(CERT_INFO.holder)}</dd></div>
          <div><dt>Sertifikayı veren kuruluş</dt><dd>${esc(CERT_INFO.issuer)}</dd></div>
          <div><dt>Kapsam</dt><dd>${esc(CERT_INFO.scope)}</dd></div>
          <div><dt>Geçerlilik süresi</dt><dd>${esc(CERT_INFO.issued)} - ${esc(CERT_INFO.validUntil)}</dd></div>
        </dl>
        <p class="note mt-5">Sertifikaların geçerliliği her yıl yapılan gözetim denetimleriyle sürdürülür. Güncel durum, sertifikayı veren kuruluştan (${esc(CERT_INFO.verifyEmail)}) teyit edilebilir.</p>
        <dialog class="cert-dialog" id="certDialog" aria-labelledby="certDialogTitle">
          <div class="cert-dialog__head">
            <h2 class="cert-dialog__title" id="certDialogTitle">Sertifika</h2>
            <button type="button" class="video-dialog__close" data-cert-close aria-label="Kapat">${icon('x')}</button>
          </div>
          <div class="cert-dialog__frame"></div>
        </dialog>`;
}

// <!-- ad:basla ... --> ile <!-- ad:bitir --> arasını yeniden yazar
function replaceMarker(html, name, inner, file) {
  const re = new RegExp(`<!-- ${name}:basla[^>]*-->[\\s\\S]*?<!-- ${name}:bitir -->`);
  if (!re.test(html)) throw new Error(`${file}: işaret bulunamadı ${name}`);
  return html.replace(re, () => `<!-- ${name}:basla (tools/build.mjs) -->\n        ${inner}\n        <!-- ${name}:bitir -->`);
}

function replaceBetween(html, startRe, endStr, inner, file) {
  const m = html.match(startRe);
  if (!m) throw new Error(`${file}: başlangıç bulunamadı ${startRe}`);
  const start = m.index + m[0].length;
  const end = html.indexOf(endStr, start);
  if (end < 0) throw new Error(`${file}: bitiş bulunamadı ${endStr}`);
  return html.slice(0, start) + inner + html.slice(end);
}

function processHandPage(file, cfg) {
  let html = fs.readFileSync(path.join(SITE, file), 'utf8');
  const jsonld = [...(cfg.jsonld || [])];
  if (cfg.crumbs) jsonld.push(breadcrumbLd([{ name: 'Ana sayfa', href: 'index.html' }, { name: cfg.crumbs }]));
  if (cfg.itemList) {
    jsonld.push({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Ürün kataloğu', numberOfItems: PRODUCTS.length, itemListElement: PRODUCTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(productUrl(p)), name: `${p.model} ${p.title}` })) });
  }
  html = html.replace(/^<!DOCTYPE html>\n(<!--[^\n]*-->\n)?/, '<!DOCTYPE html>\n<!-- Baş bölüm, üst menü ve alt bilgi tools/build.mjs ile yazılır; ana içerik elle düzenlenir. -->\n');
  html = replaceBetween(html, /^<head>$/m, '\n</head>', head({ ...cfg, url: file, jsonld }).replace(/\n$/, ''), file);
  html = html.replace(/<body[^>]*>/, `<body data-section="${file}">`);
  html = html.replace(/<header class="site-header"[\s\S]*?<\/header>/, header({ dark: !!cfg.dark }));
  html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, footer());
  html = html.replace(/<script src="js\/([\w-]+)\.js(?:\?v=[\w]+)?"><\/script>/g, (m, n) => VER[n] ? `<script src="js/${n}.js?v=${VER[n]}"></script>` : m);
  if (file === 'urunler.html') {
    html = replaceBetween(html, /<div class="product-grid" id="catalogGrid">/, '</div>\n      <div class="empty-state"', `\n          ${catalogGridHtml()}\n        `, file);
  }
  if (file === 'index.html') {
    html = replaceMarker(html, 'videolar', homeVideosHtml(), file);
    html = replaceMarker(html, 'sertifika-seridi', certStripHtml(), file);
  }
  if (file === 'kurumsal.html') {
    html = replaceMarker(html, 'sertifikalar', certsHtml(), file);
  }
  if (file === 'esanslar.html') {
    html = replaceBetween(html, /<div class="scent-index" id="scentsContainer">/, '</div>\n      </div>\n    </section>', `\n          ${scentsHtml()}\n        `, file);
    html = replaceBetween(html, /<div class="mt-7 refill-groups" id="oilsListContainer">/, '</div>\n          <div class="mt-7 btn-row">', `\n          ${oilsHtml()}\n          `, file);
  }
  write(file, html);
}

// ---------------------------------------------------------------------------
// sitemap.xml, robots.txt
// ---------------------------------------------------------------------------
function sitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(([u, pr, imgs = []]) => `  <url>
    <loc>${abs(u)}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>${pr}</priority>
${imgs.map(im => `    <image:image><image:loc>${abs(im)}</image:loc></image:image>\n`).join('')}  </url>`).join('\n')}
</urlset>
`;
}

// ---------------------------------------------------------------------------
// Çalıştır
// ---------------------------------------------------------------------------
for (const [file, cfg] of Object.entries(HAND_PAGES)) processHandPage(file, cfg);
for (const p of PRODUCTS) write(productUrl(p), productPage(p));
write('blog.html', blogIndex());
for (const post of POSTS) write(postUrl(post), blogPost(post));
write('surdurulebilirlik.html', sustainabilityPage());
write('sss.html', faqPage());
write('404.html', notFoundPage());
write('gizlilik.html', privacyPage());
write('feed.xml', feed());
write('site.webmanifest', manifest());

const urls = [
  ['index.html', '1.0'], ['urunler.html', '0.9'], ['cozumler.html', '0.8'], ['teknoloji.html', '0.7'],
  ['esanslar.html', '0.8'], ['kurumsal.html', '0.6'], ['iletisim.html', '0.7'], ['blog.html', '0.6'],
  ['surdurulebilirlik.html', '0.5'], ['sss.html', '0.6'], ['gizlilik.html', '0.2'],
  ...PRODUCTS.map(p => [productUrl(p), '0.8', [imgPath(p), ...Array.from({ length: p.gallery || 0 }, (_, i) => imgPath(p, `-g${i + 1}`))]]),
  ...POSTS.map(p => [postUrl(p), '0.6', [p.image]])
];
write('sitemap.xml', sitemap(urls));
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Yazıldı: ${Object.keys(HAND_PAGES).length} sayfa güncellendi, ${PRODUCTS.length} ürün, ${POSTS.length} yazı, blog, sürdürülebilirlik, sss, gizlilik, 404, feed.xml, site.webmanifest, sitemap (${urls.length} adres), robots. Sürümler: css ${VER.css}`);
