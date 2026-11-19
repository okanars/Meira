#!/usr/bin/env node
/**
 * Meira site üreticisi (isteğe bağlı bakım aracı; yalnızca Node yerleşik modülleri).
 *
 * Site düz HTML'dir ve çalışmak için bu betiğe ihtiyaç duymaz. Betik, tekrarlanan parçaları
 * tek kaynaktan yazmak için vardır:
 *   - Tüm sayfaların <head> bölümü (başlık, açıklama, kanonik adres, hreflang, Open Graph, JSON-LD),
 *     başlık (header) ve footer'ı
 *   - Ürün sayfaları (urun-<id>.html) products.js verisinden
 *   - Blog dizini ve yazıları (tools/content/blog*.mjs), Sürdürülebilirlik, SSS ve Gizlilik (tools/content/pages*.mjs)
 *   - urunler.html katalog ızgarasının önceden basılmış HTML'i
 *   - index.html ürün videoları ve sertifika şeridi, kurumsal.html sertifikalar bölümü (işaretli bölgeler)
 *   - esanslar.html (products.js ESSENCES_LIVE true ise ESSENCES / ESSENCE_FAMILIES verisinden esans sayfası; false ise
 *     "hazırlanıyor" sayfası), sitemap.xml,
 *     robots.txt, 404.html
 *
 * İki dil: Türkçe sayfalar site/ kökünde, İngilizceleri site/en/ altında aynı dosya adlarıyla durur.
 * İngilizce elle yazılmış sayfalar (site/en/*.html) Türkçeleriyle aynı yapıdadır; ürün metinleri
 * js/products.en.js, yazılar content/blog.en.mjs, belge sayfaları content/pages.en.mjs içindedir.
 * Betik her sayfayı iki kez yazar; İngilizce çıktıda kök klasördeki dosyalara (images, css, js, fonts, api)
 * giden adresler "../" ile başlar.
 *
 * Kullanım:  node tools/build.mjs
 * products.js, içerik dosyaları ya da başlık/footer değiştiğinde yeniden çalıştırın.
 * Elle yazılmış sayfaların <main> içeriğine dokunmaz (katalog ve işaretli bölümler hariç).
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { POSTS as POSTS_TR } from './content/blog.mjs';
import { POSTS as POSTS_EN } from './content/blog.en.mjs';
import * as PAGES_TR from './content/pages.mjs';
import * as PAGES_EN from './content/pages.en.mjs';
import { CERTS, CERT_INFO } from './content/certs.mjs';

// Alan adı değişirse yalnızca bu değeri değiştirip betiği çalıştırın (README "Marka ve alan adı").
const SITE_URL = 'https://www.meiraairscent.com';
const BRAND = 'Meira';
const EMAIL = 'info@meiraairscent.com';
const TODAY = '2026-11-15';
const DEFAULT_OG = 'images/brand/og-meira.jpg';
// Üretici (ürünlerin geliştirildiği ve üretildiği şirket). Sitede bu adla anılır.
const MANUFACTURER = 'Dongguan Andusic Technology Co. Ltd.';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(DIR, '../site');

// ---------------------------------------------------------------------------
// Dil
// ---------------------------------------------------------------------------
let L = 'tr';
const tt = (tr, en) => (L === 'en' ? en : tr);
const OUT = file => (L === 'en' ? `en/${file}` : file);

// ---------------------------------------------------------------------------
// Veri (her dil için ayrı bağlam: İngilizcede products.en.js aynı kayıtların metinlerini değiştirir)
// ---------------------------------------------------------------------------
function loadData(files) {
  const ctx = {};
  vm.createContext(ctx);
  const src = files.map(f => fs.readFileSync(path.join(SITE, f), 'utf8')).join('\n;\n');
  vm.runInContext(src + ';globalThis.__D={PRODUCTS,CATEGORIES,ESSENCES,ESSENCE_FAMILIES,ESSENCE_COVER,ESSENCE_PRICE,ESSENCES_LIVE,catalogOrder};', ctx);
  return ctx.__D;
}
const DATA = { tr: loadData(['js/products.js']), en: loadData(['js/products.js', 'js/products.en.js']) };
const CONTENT = {
  tr: { posts: POSTS_TR, ...PAGES_TR },
  en: { posts: POSTS_EN, ...PAGES_EN }
};
const CAT_SHORT_ALL = {
  tr: { wall: 'Duvar tipi', pro: 'Profesyonel ve klima', plug: 'Prize takılan ve pasif', home: 'Masaüstü ve taşınabilir' },
  en: { wall: 'Wall-mounted', pro: 'Professional and HVAC', plug: 'Plug-in and passive', home: 'Tabletop and portable' }
};

let PRODUCTS, CATEGORIES, ESSENCES, ESSENCE_FAMILIES, ESSENCE_COVER, ESSENCE_PRICE, ESSENCES_LIVE, catalogOrder, CAT_LABEL, CAT_SHORT, POSTS, C;
function setLang(lang) {
  L = lang;
  ({ PRODUCTS, CATEGORIES, ESSENCES, ESSENCE_FAMILIES, ESSENCE_COVER, ESSENCE_PRICE, ESSENCES_LIVE, catalogOrder } = DATA[lang]);
  CAT_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));
  CAT_SHORT = CAT_SHORT_ALL[lang];
  C = CONTENT[lang];
  POSTS = C.posts;
}
setLang('tr');

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Dosya (görsel, video) mutlak adresi; sayfa adresi için pageAbs
const abs = p => `${SITE_URL}/${p}`;
const pageAbs = (p, lang = L) => `${SITE_URL}/${lang === 'en' ? 'en/' : ''}${p}`;
const icon = (name, cls = '') => `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true" focusable="false"><use href="images/icons.svg#i-${name}"></use></svg>`;
const imgPath = (p, suffix = '') => `images/${p.external ? 'general' : 'products'}/${p.img}${suffix}.jpg`;
// Teknik veri etiketleri iki dilde aranır (products.en.js etiketleri İngilizcedir)
const RE = {
  cov: /kapsama|coverage/i,
  cap: /kapasite|capacity/i,
  noise: /^ses|^noise/i,
  psu: /güç kaynağı|power supply/i,
  volt: /gerilim|voltage/i
};
const spec = (p, re) => (p.specs.find(s => re.test(s[0])) || [])[1] || '';
const productUrl = p => `urun-${p.id}.html`;
// Düzyazıdaki kısa ürün adı (model alanında renk başına kodlar olabilir: "ADS-687A / ADS-687B")
const fam = p => p.family || p.model;
const postUrl = post => `blog-${post.slug}.html`;
const MONTHS = {
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};
const fmtDate = iso => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[L][m - 1]} ${y}`; };
const fmt = n => n.toLocaleString(L === 'en' ? 'en-GB' : 'tr-TR');
const clip = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:]$/, '') + '.');
const ld = obj => `  <script type="application/ld+json">${JSON.stringify(obj)}</script>\n`;
const soonLabel = () => tt('Pek yakında', 'Coming soon');

// İngilizce çıktıda kök klasördeki dosyalara giden göreli adresler bir üst klasöre çıkar
// srcset birden fazla aday içerebilir ("a.webp 640w, b.webp 1200w"): her aday ayrı ayrı yerelleştirilir.
const localize = html => html
  .replace(/(\s(?:src|href|poster|data-src|data-poster|data-webp|action)=")(?=(?:images|css|js|fonts|api)\/|favicon\.(?:svg|ico)"|site\.webmanifest")/g, '$1../')
  .replace(/(\ssrcset=")([^"]*)"/g, (m, a, list) => `${a}${list.split(/,\s*/).map(c => (/^(?:images|css|js|fonts)\//.test(c) ? `../${c}` : c)).join(', ')}"`);

// 404 sayfası, sunucu tarafından bulunamayan herhangi bir adreste (ör. /en/a/b) sunulur; göreli adresler
// orada çözülemez. Bu yüzden 404'te bağlantı ve kaynaklar kökten başlar, JS'in görsel tabanı da köktür.
function rootRelative(out) {
  const prefix = L === 'en' ? '/en/' : '/';
  return out
    .replace(/(\s)(href|src)="(?![a-z]+:|\/|#)/g, `$1$2="${prefix}`)
    .replace(/="\/en\/\.\.\//g, '="/')
    .replace(/<html lang="(\w+)"(?: data-base="[^"]*")?>/, '<html lang="$1" data-base="/">');
}

function write(file, html) {
  let out = html
    .replace(/<div class="table-wrap">/g, `<div class="table-wrap" tabindex="0" role="region" aria-label="${tt('Tablo (yatay kaydırılabilir)', 'Table (scrolls horizontally)')}">`)
    .replace(/images\/icons\.svg(?:\?v=\w+)?#/g, `images/icons.svg?v=${VER.icons}#`);
  if (L === 'en' && /\.html$/.test(file)) out = localize(out);
  if (file === '404.html') out = rootRelative(out);
  const dest = path.join(SITE, OUT(file));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, out);
}

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
const JS_FILES = { tr: ['site-config', 'products', 'components', 'site'], en: ['site-config', 'products', 'products.en', 'components', 'site'] };
const VER = {
  css: hashOf('css/style.css'),
  logo: hashOf('images/brand/logo-sprite.svg'),
  icons: hashOf('images/icons.svg'),
  ...Object.fromEntries(JS_FILES.en.map(n => [n, hashOf(`js/${n}.js`)])),
  essences: hashOf('js/essences.js')
};

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
  const s = spec(p, RE.cov);
  if (!/m³/.test(s)) return [];
  return s.split('/')
    .map(part => (part.match(/\d[\d.,]*/g) || []).map(n => parseInt(n.replace(/[.,]/g, ''), 10)).filter(Boolean))
    .filter(r => r.length);
}
// Hacim aralığını belirli bir tavan yüksekliğinde taban alanına çevirir (5 m²'ye yuvarlanır)
const floorArea = (r, h) => r.map(v => fmt(Math.floor(v / h / 5) * 5)).join('-');
const volRange = r => r.map(fmt).join('-');

// ---------------------------------------------------------------------------
// Ortak parçalar
// ---------------------------------------------------------------------------
const ORG_ID = `${SITE_URL}/#organization`;
const orgLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: BRAND,
  url: `${SITE_URL}/`,
  email: EMAIL,
  description: tt(
    `${MANUFACTURER} koku difüzörleri ve esanslarının Türkiye distribütörü. Oteller, ofisler, mağazalar ve yaşam alanları için profesyonel mekân kokulandırma ürünleri ve teklif.`,
    `Turkish distributor of ${MANUFACTURER} scent diffusers and fragrances. Professional scenting products and quotes for hotels, offices, shops and homes.`),
  address: { '@type': 'PostalAddress', addressLocality: 'İstanbul', addressCountry: 'TR' },
  areaServed: 'TR',
  logo: { '@type': 'ImageObject', url: abs('images/brand/logo-meira.png'), width: 1040, height: 600 },
  image: abs(DEFAULT_OG)
});
const websiteLd = () => ({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: pageAbs('index.html'), name: BRAND, inLanguage: tt('tr-TR', 'en'), publisher: { '@id': ORG_ID } });

const home = () => ({ name: tt('Ana sayfa', 'Home'), href: 'index.html' });

function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, ...(it.href ? { item: pageAbs(it.href) } : {}) }))
  };
}

function breadcrumbHtml(items) {
  return `<nav class="breadcrumb" aria-label="${tt('Sayfa konumu', 'Breadcrumb')}">
        <ol>
          ${items.map((it, i) => i === items.length - 1
            ? `<li aria-current="page">${esc(it.name)}</li>`
            : `<li><a href="${esc(it.href)}">${esc(it.name)}</a></li>`).join('\n          ')}
        </ol>
      </nav>`;
}

// İlk boyamadan önce: js sınıfı ve kayıtlı tema tercihi (varsayılan açık tema; koyu tema yalnızca seçilirse)
const BOOT_SCRIPT = `<script>(function(d){d.classList.add('js');try{if(localStorage.getItem('meira-theme')==='dark')d.dataset.theme='dark'}catch(e){}})(document.documentElement);</script>`;
// Açılış perdesi kararı ilk boyamadan önce verilir: oturumda site daha önce açıldıysa ya da azaltılmış hareket
// tercih ediliyorsa perde hiç gösterilmez (no-intro). site.js her sayfada 'meira-visited' bayrağını yazar.
const INTRO_SCRIPT = `<script>(function(d){try{if(sessionStorage.getItem('meira-visited')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('no-intro')}else{d.classList.add('has-intro')}}catch(e){d.classList.add('no-intro')}})(document.documentElement);</script>`;

const DEFAULT_OG_ALT = () => tt('Meira: oteller, ofisler ve mağazalar için profesyonel koku difüzörleri', 'Meira: professional scent diffusers for hotels, offices and shops');

function head({ title, description, url, image = DEFAULT_OG, imageAlt, type = 'website', jsonld = [], noindex = false, published, intro = false }) {
  const og = imageSize(image);
  const alts = noindex ? '' : `  <link rel="alternate" hreflang="tr" href="${pageAbs(url, 'tr')}">
  <link rel="alternate" hreflang="en" href="${pageAbs(url, 'en')}">
  <link rel="alternate" hreflang="x-default" href="${pageAbs(url, 'tr')}">
`;
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
  <meta name="theme-color" content="#141C27">
${noindex ? '' : `  <link rel="canonical" href="${pageAbs(url)}">\n`}${alts}  <meta property="og:type" content="${type}">
  <meta property="og:locale" content="${tt('tr_TR', 'en_GB')}">
  <meta property="og:locale:alternate" content="${tt('en_GB', 'tr_TR')}">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${pageAbs(url)}">
  <meta property="og:image" content="${abs(image)}">
${og ? `  <meta property="og:image:width" content="${og.w}">\n  <meta property="og:image:height" content="${og.h}">\n` : ''}  <meta property="og:image:alt" content="${esc(imageAlt || DEFAULT_OG_ALT())}">
${published ? `  <meta property="article:published_time" content="${published}">\n  <meta property="article:modified_time" content="${published}">\n` : ''}  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="favicon.ico" sizes="48x48">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="images/brand/icon-180.png">
  <link rel="manifest" href="site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="${BRAND} Blog" href="feed.xml">
  <link rel="preload" href="fonts/newsreader-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/style.css?v=${VER.css}">
  ${BOOT_SCRIPT}
${intro ? `  ${INTRO_SCRIPT}\n` : ''}${jsonld.map(ld).join('')}`;
}

// Üçüncü öğe 'soon' ise bağlantı menüde görünür ama tıklanmaz
const NAV = () => [
  ['urunler.html', tt('Ürünler', 'Products')],
  ['cozumler.html', tt('Çözümler', 'Solutions')],
  ['teknoloji.html', tt('Teknoloji', 'Technology')],
  ['esanslar.html', tt('Esanslar', 'Essences'), ESSENCES_LIVE ? '' : 'soon'],
  ['kurumsal.html', tt('Kurumsal &amp; OEM', 'Company &amp; OEM')],
  ['blog.html', 'Blog'],
  ['iletisim.html', tt('İletişim', 'Contact')]
];

// Dil seçici: aynı sayfanın diğer dildeki karşılığına gider (Türkçe kökte, İngilizce en/ altında)
function langSwitch(file) {
  const trHref = L === 'en' ? `../${file}` : file;
  const enHref = L === 'en' ? file : `en/${file}`;
  return `<nav class="lang-switch" aria-label="${tt('Dil', 'Language')}">
          <a href="${trHref}" hreflang="tr" lang="tr"${L === 'tr' ? ' aria-current="true"' : ''}><span class="visually-hidden">Türkçe</span><span aria-hidden="true">TR</span></a>
          <a href="${enHref}" hreflang="en" lang="en"${L === 'en' ? ' aria-current="true"' : ''}><span class="visually-hidden">English</span><span aria-hidden="true">EN</span></a>
        </nav>`;
}

function header({ dark = false, file = 'index.html' } = {}) {
  return `<header class="site-header"${dark ? ' data-header' : ''}>
    <div class="wrap site-header__inner">
      <a href="index.html" class="brand">${logo('word', 'brand__logo')}<span class="visually-hidden" lang="en" data-site="brand">${BRAND}</span></a>

      <nav class="nav" id="navLinks" aria-label="${tt('Ana menü', 'Main menu')}">
        ${NAV().map(([href, label, state]) => state === 'soon'
          ? `<span class="nav-item nav-item--soon" role="link" aria-disabled="true">${label}<span class="nav-soon">${tt('Yakında', 'Soon')}</span></span>`
          : `<a href="${href}" class="nav-item">${label}</a>`).join('\n        ')}
      </nav>

      <div class="nav-actions">
        ${langSwitch(file)}
        <button type="button" class="theme-toggle" data-theme-toggle aria-pressed="false" aria-label="${tt('Koyu tema', 'Dark theme')}" title="${tt('Koyu tema', 'Dark theme')}">
          ${icon('moon', 'icon-moon')}${icon('sun', 'icon-sun')}
        </button>
        <button type="button" class="quote-trigger" aria-label="${tt('Teklif listesi', 'Quote list')}">
          ${icon('clipboard-text')}
          <span class="quote-trigger__label">${tt('Teklif listesi', 'Quote list')}</span>
          <span class="quote-badge dc-cart-count empty" aria-hidden="true">0</span>
        </button>
        <button type="button" class="burger-btn" id="burgerBtn" aria-label="${tt('Menü', 'Menu')}" aria-expanded="false" aria-controls="navLinks">
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
          <p>${tt(`${MANUFACTURER} koku difüzörleri ve esanslarının Türkiye distribütörü. Oteller, ofisler, mağazalar ve yaşam alanları için ürün seçimi ve teklif.`, `Turkish distributor of ${MANUFACTURER} scent diffusers and fragrances. Product selection and quotes for hotels, offices, shops and homes.`)}</p>
          <p class="footer-certs"><a href="kurumsal.html#sertifikalar">${CERTS.map(c => esc(c.short)).join(' · ')} ${tt('sertifikalı', 'certified')}</a></p>
        </div>
        <div class="footer-col footer-col--a">
          <h2>${tt('Ürünler', 'Products')}</h2>
          <ul>
            <li><a href="urunler.html?cat=premium">Premium</a></li>
            ${cats.map(c => `<li><a href="urunler.html?cat=${c.id}">${esc(CAT_SHORT[c.id])}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="footer-col footer-col--b">
          <h2>${tt('Kurumsal', 'Company')}</h2>
          <ul>
            <li><a href="cozumler.html">${tt('Çözümler', 'Solutions')}</a></li>
            <li><a href="teknoloji.html">${tt('Teknoloji', 'Technology')}</a></li>
            <li>${ESSENCES_LIVE ? `<a href="esanslar.html">${tt('Esanslar', 'Essences')}</a>` : `<span class="footer-soon" aria-disabled="true">${tt('Esanslar', 'Essences')} <span class="nav-soon">${tt('Yakında', 'Soon')}</span></span>`}</li>
            <li><a href="kurumsal.html">${tt('Kurumsal &amp; OEM', 'Company &amp; OEM')}</a></li>
            <li><a href="surdurulebilirlik.html">${tt('Sürdürülebilirlik', 'Sustainability')}</a></li>
          </ul>
        </div>
        <div class="footer-col footer-col--c">
          <h2>${tt('Kaynaklar', 'Resources')}</h2>
          <ul>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="sss.html">${tt('Sık sorulan sorular', 'Frequently asked questions')}</a></li>
            <li><a href="cozumler.html#hesaplayici">${tt('Hacim hesaplayıcı', 'Volume calculator')}</a></li>
            <li><a href="iletisim.html">${tt('Teklif formu', 'Quote form')}</a></li>
            <li><a href="gizlilik.html">${tt('Gizlilik ve KVKK', 'Privacy notice')}</a></li>
          </ul>
        </div>
        <div class="footer-col footer-col--d">
          <h2>${tt('İletişim', 'Contact')}</h2>
          <ul>
            <li><a href="mailto:${EMAIL}" data-site-href="email"><span data-site="email">${EMAIL}</span></a></li>
            <li><a href="tel:+905527771974" data-site-href="phone"><span data-site="phone">+90&nbsp;552&nbsp;777&nbsp;19&nbsp;74</span></a></li>
            <li><span data-site="city">${tt('İstanbul, Türkiye', 'Istanbul, Türkiye')}</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-wordmark" aria-hidden="true">${logo('full', 'footer-wordmark__logo')}</div>
      <div class="footer-bottom">
        <span>© <span data-year>2026</span> <span data-site="brand">${BRAND}</span>. ${tt('Tüm hakları saklıdır.', 'All rights reserved.')}</span>
        <span>${tt('Teknik veriler üretici kataloğuna ve Meira fiyat listesine dayanır.', 'Technical data are based on the manufacturer\'s catalogue and the Meira price list.')} <a href="gizlilik.html">${tt('Gizlilik ve KVKK', 'Privacy notice')}</a></span>
      </div>
    </div>
  </footer>`;
}

const SCRIPTS = () => JS_FILES[L].map(n => `<script src="js/${n}.js?v=${VER[n]}"></script>`).join('\n  ');

function page({ meta, section = '', main, after = '', dark = false }) {
  return `<!DOCTYPE html>
<!-- Bu sayfa tools/build.mjs ile üretilir. Elle düzenlemeyin; içerik kaynağı için betiğe bakın. -->
<html lang="${L}"${L === 'en' ? ' data-base="../"' : ''}>
<head>${head({ ...meta })}</head>
<body${section ? ` data-section="${section}"` : ''}>
  <a class="skip-link" href="#main">${tt('İçeriğe geç', 'Skip to content')}</a>

  ${header({ dark, file: meta.url })}

  <main id="main">
${main}
  </main>

  ${footer()}

  ${SCRIPTS()}${after}
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
const durationText = sec => L === 'en'
  ? `${Math.floor(sec / 60)} min${sec % 60 ? ` ${sec % 60} s` : ''}`
  : `${Math.floor(sec / 60)} dk${sec % 60 ? ` ${sec % 60} sn` : ''}`;
const videoMeta = v => `${tt('Video süresi', 'Video length')} ${durationText(v.duration)}`;
const videoLd = (p, v) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: `${v.title} (${fam(p)}${v.label ? ` ${v.label.toLocaleLowerCase(L)}` : ''})`,
  description: v.summary,
  thumbnailUrl: [abs(videoPoster(v))],
  uploadDate: VIDEO_UPLOAD,
  duration: isoDuration(v.duration),
  contentUrl: abs(videoSrc(v))
});

// Büyütme penceresi: [data-image-open] düğmeleri tek bir <dialog> açar (site.js initImageDialog)
const imageDialogHtml = title => `<dialog class="image-dialog" id="imageDialog" aria-labelledby="imageDialogTitle">
          <div class="image-dialog__head">
            <h2 class="image-dialog__title" id="imageDialogTitle">${esc(title)}</h2>
            <button type="button" class="video-dialog__close" data-image-close aria-label="${tt('Kapat', 'Close')}">${icon('x')}</button>
          </div>
          <div class="image-dialog__frame"></div>
        </dialog>`;

// Ürün sayfası: üreticinin yatay tanıtım görselleri (products.js -> banners; dosyalar <img>-b<n>.jpg/.webp/-960.webp)
const bannerPath = (p, i, ext = '.jpg') => `images/products/${p.img}-b${i + 1}${ext}`;
function productBannersSection(p) {
  if (!p.banners || !p.banners.length) return '';
  return `
    <section class="section" aria-labelledby="banners-title">
      <div class="wrap">
        <div class="section-head reveal">
          <h2 id="banners-title">${tt('Uygulama görselleri', 'In use')}</h2>
          <p class="lead">${tt('Cihazın farklı mekânlardaki kullanımı ve öne çıkan özellikleri. Büyütmek için görsele dokunun.', 'The device in different spaces and its key features. Tap an image to enlarge it.')}</p>
        </div>
        <ul class="banner-grid">
          ${p.banners.map((alt, i) => `<li class="reveal">
            <button type="button" class="banner-grid__item" data-image-open data-src="${bannerPath(p, i)}" data-webp="${bannerPath(p, i, '.webp')}"${(() => { const d = imageSize(bannerPath(p, i)); return d ? ` data-w="${d.w}" data-h="${d.h}"` : ''; })()} data-title="${esc(alt)}" aria-label="${tt('Görseli büyüt', 'Enlarge image')}: ${esc(alt)}">
              <picture><source type="image/webp" srcset="${bannerPath(p, i, '-960.webp')} 960w" sizes="(min-width: 900px) 620px, 92vw"><img src="${bannerPath(p, i)}" alt=""${dims(bannerPath(p, i))} loading="lazy" decoding="async"></picture>
              <span class="zoom-chip" aria-hidden="true">${icon('magnifying-glass')}${tt('Büyüt', 'Enlarge')}</span>
            </button>
          </li>`).join('\n          ')}
        </ul>
        <p class="note mt-5">${tt('Görsellerdeki İngilizce yazılar ve değerler üreticinin tanıtım malzemesine aittir; teknik veriler için yukarıdaki tabloyu esas alın.', 'The text and values in these images come from the manufacturer\'s promotional material; rely on the table above for technical data.')}</p>
      </div>
      ${imageDialogHtml(tt('Uygulama görseli', 'Product image'))}
    </section>
`;
}

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
          <p class="section-label" aria-hidden="true">${tt('Ürün videosu', 'Product video')}</p>
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
// Ürün kartı (katalog ızgarası, ilgili ürünler). urunler.html (ve en/urunler.html) içindeki şablonla aynı tutulmalı.
// Satışta olmayan (soon) ürünün kartı bağlantısızdır ve listeye eklenemez.
// ---------------------------------------------------------------------------
// Liste fiyatı; KDV dahil tutar olarak "KDV dahil" ile gösterilir. "Pek yakında" ürünlerde
// gösterilmez. components.js priceHtml ile aynı.
const fmtNum = n => Math.round(n).toLocaleString(L === 'en' ? 'en-GB' : 'tr-TR');
const priceRange = p => `${[].concat(p.price).map(fmtNum).join(' - ')} TL`;
const hasPrice = p => p.price != null && !p.soon;
function priceHtml(p, cls = 'product-card__price') {
  if (!hasPrice(p)) return '';
  const o = p.options && p.options[0];
  return `<p class="${cls}"><span class="${cls}-value"${o ? ' data-opt-price' : ''}>${priceRange(o || p)}</span> <span class="${cls}-vat">${tt('KDV dahil', 'incl. VAT')}</span></p>`;
}

// Seri ürünlerde model seçici (products.js options). components.js optionRow ile aynı işaretleme; ilk model seçili.
// Seçim fiyatı (data-opt-price), kapsamayı (data-opt-cov) ve "listeye ekle" düğmelerinin modelini değiştirir.
const optCov = o => `${fmtNum(o.cov[0])}-${fmtNum(o.cov[1])} m³`;
function optionRow(p, cls = '') {
  if (!p.options || p.soon) return '';
  return `<div class="opt-row${cls}" role="radiogroup" aria-label="${esc(tt(`${p.family || p.model}: model seçimi`, `${p.family || p.model}: choose a model`))}" data-opt-group="${esc(p.id)}">${p.options.map((o, i) => `<button type="button" class="opt-chip" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-opt="${esc(o.code)}">${esc(o.code)}</button>`).join('')}</div>`;
}

// Renk seçenekleri: kartta başlığın altında, ürün sayfasında kısa açıklamanın altında. Her rengin yanında o rengin
// model numarası (products.js colors). components.js colorRow ile aynı işaretleme.
function colorRow(p, cls = '') {
  if (!p.colors || !p.colors.length) return '';
  return `<ul class="color-row${cls}" aria-label="${tt('Renk seçenekleri', 'Colour options')}">${p.colors.map(c => `<li><span class="color-row__dot" style="--dot:${esc(c.hex)}" aria-hidden="true"></span><span class="color-row__name">${esc(c.name)}</span>${c.code ? `<span class="color-row__code">${esc(c.code)}</span>` : ''}</li>`).join('')}</ul>`;
}

function productCard(p, headingTag = 'h2') {
  const opt0 = p.options && !p.soon ? p.options[0] : null;
  const area = opt0 ? optCov(opt0) : spec(p, RE.cov);
  const cap = spec(p, RE.cap);
  const cls = `product-card${p.premium ? ' product-card--premium' : ''}${p.soon ? ' product-card--soon' : ''}`;
  return `<article class="${cls}" data-id="${esc(p.id)}">
            <div class="media">${productPicture(p, { alt: p.model + ' ' + p.title, attrs: ` loading="lazy" decoding="async" style="object-position:${esc(p.pos || 'center')}"` })}${p.videos ? `<span class="product-card__video">${icon('play')}Video</span>` : ''}${p.soon ? `<span class="product-card__soon">${soonLabel()}</span>` : ''}</div>
            <div class="product-card__body">
              <div class="product-card__top">
                <span class="product-card__code">${esc(p.model)}</span>
                ${p.premium ? '<span class="product-card__premium" lang="en">Premium</span>' : ''}
                ${p.badge ? `<span>${esc(p.badge)}</span>` : ''}
              </div>
              <${headingTag} class="product-card__title">${p.soon ? esc(p.title) : `<a href="${productUrl(p)}" class="product-card__link">${esc(p.title)}</a>`}</${headingTag}>
              ${colorRow(p)}
              ${optionRow(p)}
              <p class="product-card__desc">${esc(p.short)}</p>
              <p class="product-card__meta">${area ? `<span${opt0 ? ' data-opt-cov' : ''}>${esc(area)}</span>` : ''}${cap ? `<span>${esc(cap)}</span>` : ''}</p>
              ${priceHtml(p)}
              ${p.soon
                ? `<p class="product-card__status">${tt('Henüz satışta değil', 'Not yet on sale')}</p>`
                : `<div class="product-card__actions">
                <span class="link-arrow" aria-hidden="true">${tt('İncele', 'View')} ${icon('arrow-right')}</span>
                <button type="button" class="btn-add" data-act="add-quote" aria-label="${esc(tt(`${p.model} ürününü teklif listesine ekle`, `Add ${p.model} to the quote list`))}">${icon('plus')}<span>${tt('Listeye ekle', 'Add to list')}</span></button>
              </div>`}
            </div>
          </article>`;
}

// ---------------------------------------------------------------------------
// Ürün sayfaları
// ---------------------------------------------------------------------------
function techOf(p) {
  const f = p.features.join(' ');
  if (/ultrason/i.test(f)) return 'ultrasonic';
  if (/çift akışkanlı|iki akışkanlı|dual-fluid/i.test(f)) return 'dual';
  if (/nano/i.test(f)) return 'nano';
  return '';
}

function productFaq(p) {
  const items = [];
  const cov = spec(p, RE.cov);
  const vals = coverageValues(p);
  if (cov) {
    const tail = vals.length
      ? tt(` 3 m tavan yüksekliğinde bu, yaklaşık ${vals.map(r => floorArea(r, 3) + ' m²').join(' / ')} taban alanına karşılık gelir.`,
        ` With a 3 m ceiling this corresponds to a floor area of about ${vals.map(r => floorArea(r, 3) + ' m²').join(' / ')}.`)
      : '';
    items.push(tt(
      [`${fam(p)} ne kadar büyük bir alanı kokulandırır?`, `${fam(p)}, ${cov} büyüklüğündeki alanları kokulandırır.${tail} Bölmeli alanlar, güçlü havalandırma ya da yoğun ziyaretçi trafiği birden fazla cihaz gerektirebilir.`],
      [`How large an area does ${fam(p)} scent?`, `${fam(p)} is designed for spaces of ${cov}.${tail} Partitioned spaces, strong ventilation or heavy visitor traffic may need more than one unit.`]));
  }
  const tech = techOf(p);
  if (tech === 'ultrasonic') items.push(tt(
    [`${fam(p)} hangi yöntemle çalışır?`, 'Ultrasonik atomizasyonla çalışır: esans, yüksek frekansta titreşen bir plakayla ince bir sise dönüştürülür. Isı kullanılmaz.'],
    [`How does ${fam(p)} work?`, 'It uses ultrasonic atomisation: a plate vibrating at high frequency turns the fragrance into a fine mist. No heat is used.']));
  else if (tech === 'dual') items.push(tt(
    [`${fam(p)} hangi yöntemle çalışır?`, 'Çift akışkanlı (basınçlı hava) atomizasyonla çalışır: hava akımı esansı çok ince parçacıklara ayırır. Su ve ısı kullanılmaz.'],
    [`How does ${fam(p)} work?`, 'It uses dual-fluid (compressed air) atomisation: an air stream breaks the fragrance into very fine particles. No water or heat is used.']));
  else if (tech === 'nano') items.push(tt(
    [`${fam(p)} hangi yöntemle çalışır?`, 'Nano atomizasyonla çalışır: esans çok ince parçacıklar hâlinde havaya verilir.'],
    [`How does ${fam(p)} work?`, 'It uses nano atomisation: the fragrance is released into the air as very fine particles.']));
  const power = spec(p, RE.psu) || spec(p, /gerilim|güç|voltage|power/i);
  if (power) items.push(tt(
    [`${fam(p)} hangi güç kaynağıyla çalışır?`, `${fam(p)}, ${power} ile çalışır.`],
    [`How is ${fam(p)} powered?`, `${fam(p)} runs on ${power}.`]));
  const noise = spec(p, RE.noise);
  if (noise) items.push(tt(
    [`${fam(p)} ne kadar ses çıkarır?`, `Çalışırken ses seviyesi ${noise}.`],
    [`How loud is ${fam(p)}?`, `Its noise level in operation is ${noise}.`]));
  const cap = spec(p, RE.cap);
  if (cap) items.push(tt(
    ['Esans kapasitesi ne kadar?', `${fam(p)} modelinin esans kapasitesi: ${cap}. Dolum sıklığı çalışma saatlerine, püskürtme ve bekleme sürelerine ve yoğunluk ayarına bağlıdır.`],
    ['What is the fragrance capacity?', `The fragrance capacity of ${fam(p)} is ${cap}. How often it needs refilling depends on operating hours, spray and pause times and the intensity setting.`]));
  if (/klima|taze hava|hvac|fresh-air/i.test(p.features.join(' '))) items.push(tt(
    [`${fam(p)} klima sistemine bağlanabilir mi?`, 'Evet. Bağlantı noktası (dönüş havası kanalı ya da santral çıkışı) binanın mekanik tesisatına göre belirlenir.'],
    [`Can ${fam(p)} be connected to the HVAC system?`, 'Yes. The connection point (return air duct or air handling unit outlet) depends on the building\'s mechanical installation.']));
  if (p.soon) items.push(tt(
    [`${fam(p)} ne zaman satışa çıkacak?`, 'Bu model henüz satışta değil. Satışa çıktığında bu sayfadan teklif listesine eklenebilecek. Bilgi almak için teklif formundan bize yazabilirsiniz.'],
    [`When will ${fam(p)} be available?`, 'This model is not on sale yet. Once it is, you will be able to add it to your quote list from this page. You can write to us through the quote form for details.']));
  else items.push(tt(
    [`${fam(p)} için nasıl teklif alabilirim?`, 'Bu sayfadaki “Listeye ekle” düğmesiyle ürünü teklif listenize ekleyin, ardından listeyi teklif formuna aktarın. Online satış henüz yoktur; sayfadaki liste fiyatına KDV dahildir, teklif adede ve koşullara göre hazırlanır.'],
    [`How can I get a quote for ${fam(p)}?`, 'Add the product to your quote list with the "Add to list" button on this page, then transfer the list to the quote form. There is no online sale yet; the list price on this page includes VAT, and the quote is prepared for your quantities and terms.']));
  return items;
}

// Benzer ürünler: satıştakiler önce, aynı kategoridekiler önce, ardından katalog sırası
function relatedOf(p) {
  const order = catalogOrder(PRODUCTS);
  return PRODUCTS.filter(x => x.id !== p.id)
    .sort((a, b) => (!!a.soon - !!b.soon) || ((a.cat !== p.cat) - (b.cat !== p.cat)) || order.indexOf(a) - order.indexOf(b))
    .slice(0, 3);
}

// Esanslar yayında değilken ürün sayfasındaki esans bölümü kilitlidir (bağlantı yok)
function essenceLockedHtml() {
  return `<section class="section section--deep" aria-labelledby="refill-title">
      <div class="wrap split split--top">
        <div class="split__a">
          <h2 id="refill-title">${tt('Esans ve dolum', 'Fragrance and refills')}</h2>
          <p class="mt-4 text-2">${tt('Cihazlar yeniden doldurulabilir. Esans koleksiyonumuz hazırlanıyor; bu modele uygun esans ve dolum seçenekleri kısa süre içinde burada yer alacak. Koku numunesi için teklif formundan bize yazabilirsiniz.', 'The devices are refillable. Our fragrance collection is being prepared; the fragrances and refills suited to this model will appear here shortly. For a scent sample, write to us through the quote form.')}</p>
        </div>
        <div class="split__b">
          <div class="locked-card">
            <span class="locked-card__icon">${icon('lock')}</span>
            <p class="locked-card__title">${tt('Esanslar yakında', 'Fragrances coming soon')}</p>
            <p>${tt('Koku seçenekleri kısa süre içinde sitede yer alacak.', 'The scent range will be on the site shortly.')}</p>
          </div>
        </div>
      </div>
    </section>`;
}

// ---------------------------------------------------------------------------
// Esanslar: ortak parçalar (products.js ESSENCES, ESSENCE_FAMILIES)
// ---------------------------------------------------------------------------
const famOf = id => ESSENCE_FAMILIES.find(f => f.id === id);
// Esansın aileleri: asıl aile (kod ön eki) ve ayrıca listelendiği aileler (products.js also)
const famsOf = e => [e.fam, ...(e.also || [])];
const famLabels = e => famsOf(e).map(id => famOf(id).label).join(' · ');
// Ailedeki esanslar: önce asıl üyeler, sonra ayrıca listelenenler
const essencesOf = f => [...ESSENCES.filter(e => e.fam === f.id), ...ESSENCES.filter(e => (e.also || []).includes(f.id))];
// Liste fiyatı (KDV dahil): esansın kendi fiyatı yoksa koleksiyon fiyatı
const essencePrice = e => ({ price: e.price ?? ESSENCE_PRICE.price, size: e.size || ESSENCE_PRICE.size });
function essencePriceHtml(e, cls) {
  const { price, size } = essencePrice(e);
  return `<p class="${cls}"><span class="${cls}-value">${fmt(price)} TL</span> <span class="${cls}-vat">${esc(size)} · ${tt('KDV dahil', 'incl. VAT')}</span></p>`;
}
// Renk küresi: esansın paletinden (components.js essenceOrb ile aynı değişkenler)
const essencePal = e => `--c1:${e.palette[0]};--c2:${e.palette[1]};--c3:${e.palette[2]}`;
const essenceOrb = (e, cls = '') => `<span class="essence-orb${cls ? ' ' + cls : ''}" style="${essencePal(e)}" aria-hidden="true"></span>`;
// Koku piramidi görseli: 1200 px JPEG + WebP, 640 px WebP (tools/esans-gorselleri.py)
function essencePicture(e, { alt = '', sizes = '(min-width: 900px) 40vw, 92vw', attrs = '' } = {}) {
  const jpg = `images/essences/${e.img}.jpg`;
  const d = imageSize(jpg) || { w: 1200, h: 1200 };
  const k = Math.min(1, 640 / Math.max(d.w, d.h));
  const set = k < 1 ? `images/essences/w640/${e.img}.webp ${Math.round(d.w * k)}w, images/essences/${e.img}.webp ${d.w}w` : `images/essences/${e.img}.webp ${d.w}w`;
  return `<picture><source type="image/webp" srcset="${set}" sizes="${sizes}"><img src="${jpg}" alt="${esc(alt)}"${dims(jpg)}${attrs}></picture>`;
}
// Aile adlarının cümle içi listesi: "Non-alerjen, nötralizör, ... ve oryantal"
function famSentence() {
  const a = ESSENCE_FAMILIES.map((f, i) => (i ? f.label.toLocaleLowerCase(L) : f.label));
  return a.length > 1 ? `${a.slice(0, -1).join(', ')}${tt(' ve ', ' and ')}${a[a.length - 1]}` : a[0];
}

// Ürün sayfasındaki esans bölümü: ürün kategorisine göre öne çıkan üç esans ve koleksiyon bağlantısı.
// Seçim editoryal bir vitrindir (uyumluluk iddiası değil); sayfada esanslar için kullanım alanı yazılmaz.
const ESSENCE_PICKS = {
  wall: ['ntr002', 'ntr004', 'non001'],
  plug: ['ntr003', 'ntr005', 'non016'],
  pro: ['prf006', 'non027', 'non009'],
  home: ['cic006', 'non026', 'non008']
};
function essenceLinkHtml(p) {
  const picks = (ESSENCE_PICKS[p.cat] || ESSENCE_PICKS.home).map(id => ESSENCES.find(e => e.id === id)).filter(Boolean);
  return `<section class="section section--deep" aria-labelledby="refill-title">
      <div class="wrap split split--top">
        <div class="split__a">
          <h2 id="refill-title">${tt('Esans ve dolum', 'Fragrance and refills')}</h2>
          <p class="mt-4 text-2">${tt(`Cihaz yeniden doldurulabilir. Koleksiyonda ${ESSENCE_FAMILIES.length} koku ailesinde ${ESSENCES.length} esans var: ${esc(famSentence())}. Yanda koleksiyondan öne çıkan esanslardan bazılarını görebilirsiniz; koku piramidini inceleyip esansı teklif listenize ekleyebilir ya da numune isteyebilirsiniz.`, `The device is refillable. The collection has ${ESSENCES.length} fragrances in ${ESSENCE_FAMILIES.length} scent families: ${esc(famSentence())}. Alongside are a few highlights from the collection; view their scent pyramids, add them to your quote list or ask for a sample.`)}</p>
          <a href="esanslar.html" class="link-arrow mt-5">${tt('Tüm esansları inceleyin', 'Browse all fragrances')} ${icon('arrow-right')}</a>
        </div>
        <div class="split__b">
          <ul class="essence-mini-list">
            ${picks.map(e => `<li><a href="esanslar.html#esans-${e.id}" class="essence-mini">
              ${essenceOrb(e)}
              <span class="essence-mini__body">
                <span class="essence-mini__meta">${esc(famLabels(e))} · ${esc(e.code)}</span>
                <span class="essence-mini__name">${esc(e.name)}</span>
                <span class="essence-mini__notes">${[e.top[0], e.heart[0], e.base[0]].map(esc).join(' · ')}</span>
              </span>
              ${icon('arrow-right', 'essence-mini__arrow')}
            </a></li>`).join('\n            ')}
          </ul>
        </div>
      </div>
    </section>`;
}

// Katalogdaki esans kartı: tek kart, esans sayfasına gider; görsel çubuklu oda kokusu (products.js ESSENCE_COVER).
// components.js MeiraApp.essenceCard ile aynı tutulmalı.
function essenceCard() {
  const src = `images/general/${ESSENCE_COVER.img}.jpg`;
  return `<article class="product-card product-card--essence" data-essence-card>
            <div class="media"><picture><img src="${src}" alt="${esc(tt('Esans koleksiyonu: çubuklu oda kokusu', 'Fragrance collection: reed diffuser'))}"${dims(src)} loading="lazy" decoding="async" style="object-position:${esc(ESSENCE_COVER.pos || 'center')}"></picture></div>
            <div class="product-card__body">
              <div class="product-card__top">
                <span class="product-card__code">${tt('Esanslar', 'Essences')}</span>
                <span>${ESSENCES.length} ${tt('koku', 'scents')}</span>
              </div>
              <h2 class="product-card__title"><a href="esanslar.html" class="product-card__link">${tt('Esans koleksiyonu', 'Fragrance collection')}</a></h2>
              <p class="product-card__desc">${esc(famSentence())} ${tt('koku aileleri. Koku piramitlerini inceleyin, numune isteyin.', 'scent families. View the scent pyramids and ask for a sample.')}</p>
              <p class="product-card__orbs" aria-hidden="true">${ESSENCES.slice(0, 9).map(e => essenceOrb(e)).join('')}</p>
              <p class="product-card__meta">${ESSENCE_FAMILIES.map(f => `<span>${esc(f.label)}</span>`).join('')}</p>
              <p class="product-card__price"><span class="product-card__price-value">${fmt(ESSENCE_PRICE.price)} TL</span> <span class="product-card__price-vat">${esc(ESSENCE_PRICE.size)} · ${tt('KDV dahil', 'incl. VAT')}</span></p>
              <div class="product-card__actions">
                <span class="link-arrow" aria-hidden="true">${tt('Koleksiyonu incele', 'View the collection')} ${icon('arrow-right')}</span>
              </div>
            </div>
          </article>`;
}

function productPage(p) {
  const images = [imgPath(p), ...Array.from({ length: p.gallery || 0 }, (_, i) => imgPath(p, `-g${i + 1}`))];
  const tech = techOf(p);
  const facts = [
    [tt('Kapsama alanı', 'Coverage'), spec(p, RE.cov)],
    [tt('Esans kapasitesi', 'Fragrance capacity'), spec(p, RE.cap)],
    [tt('Ses seviyesi', 'Noise level'), spec(p, RE.noise)],
    [tt('Güç kaynağı', 'Power supply'), spec(p, RE.psu) || spec(p, RE.volt)]
  ].filter(f => f[1]).slice(0, 4);
  const vals = coverageValues(p);
  const covText = spec(p, RE.cov);
  let fit = '';
  if (vals.length) {
    const rows = vals.map(r => `<tr><td>${volRange(r)} m³</td><td>${floorArea(r, 3)} m²</td><td>${floorArea(r, 4)} m²</td><td>${floorArea(r, 6)} m²</td></tr>`).join('');
    fit = `<h2>${tt('Mekâna uygunluk', 'Suitability for your space')}</h2>
            <p>${tt(`${esc(fam(p))} modelinin kapsama alanı ${esc(covText)}. Aşağıdaki tablo bu hacmin farklı tavan yüksekliklerinde yaklaşık hangi taban alanına karşılık geldiğini gösterir (açık ve tek parça bir alan için).`, `The coverage of ${esc(fam(p))} is ${esc(covText)}. The table below shows the approximate floor area this volume corresponds to at different ceiling heights (for an open, undivided space).`)}</p>
            <div class="table-wrap">
              <table>
                <caption>${tt('Kapsama hacminin taban alanı karşılığı', 'Coverage volume as floor area')}</caption>
                <thead><tr><th scope="col">${tt('Kapsama', 'Coverage')}</th><th scope="col">${tt('3 m tavan', '3 m ceiling')}</th><th scope="col">${tt('4 m tavan', '4 m ceiling')}</th><th scope="col">${tt('6 m tavan', '6 m ceiling')}</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
            <p>${tt('Kendi ölçülerinizle hesaplamak için <a href="cozumler.html#hesaplayici">hacim hesaplayıcıyı</a> kullanabilirsiniz.', 'To calculate with your own measurements, use the <a href="cozumler.html#hesaplayici">volume calculator</a>.')}</p>`;
  } else if (covText) {
    fit = `<h2>${tt('Mekâna uygunluk', 'Suitability for your space')}</h2>
            <p>${tt(`Üretici bu model için kapsamayı taban alanı olarak vermektedir: ${esc(covText)}. Yatak odası, çalışma odası ve benzeri küçük alanlar için uygundur.`, `For this model the manufacturer gives coverage as floor area: ${esc(covText)}. Suitable for bedrooms, studies and similar small rooms.`)}</p>`;
  }
  const uses = (p.use || '').split(',').map(s => s.trim()).filter(Boolean);
  const related = relatedOf(p);
  const faq = productFaq(p);

  const crumbs = [
    home(),
    { name: tt('Ürünler', 'Products'), href: 'urunler.html' },
    { name: CAT_SHORT[p.cat], href: `urunler.html?cat=${p.cat}` },
    { name: p.model }
  ];
  const title = `${p.model} ${p.title} | ${BRAND}`;
  const description = clip(`${p.model} ${p.title}: ${p.short} ${tt('Teknik veriler, kullanım alanları ve teklif.', 'Technical data, applications and quotes.')}`, 158);
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${p.model} ${p.title}`,
    sku: p.model,
    mpn: p.model,
    category: CAT_LABEL[p.cat],
    description: p.desc,
    image: images.map(abs),
    url: pageAbs(productUrl(p)),
    brand: { '@type': 'Brand', name: BRAND },
    manufacturer: { '@type': 'Organization', name: MANUFACTURER },
    additionalProperty: p.specs.map(([k, v]) => ({ '@type': 'PropertyValue', name: k, value: v }))
  };
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  const actions = p.soon
    ? `<div class="pd__soon">
          <span class="soon-pill">${soonLabel()}</span>
          <p>${tt('Bu model henüz satışta değil. Satışa çıktığında bu sayfadan teklif listesine eklenebilecek.', 'This model is not on sale yet. Once it is, you will be able to add it to your quote list here.')}</p>
        </div>`
    : `<div class="btn-row pd__actions">
          <button type="button" class="btn btn--primary btn--lg" data-add-to-list="${esc(p.id)}"${p.options ? ` data-opt="${esc(p.options[0].code)}"` : ''}>${icon('plus', 'icon--sm')}<span>${tt('Listeye ekle', 'Add to list')}</span></button>
          <button type="button" class="btn btn--quiet btn--lg" data-quote-now="${esc(p.id)}"${p.options ? ` data-opt="${esc(p.options[0].code)}"` : ''}>${tt('Teklif iste', 'Request a quote')}</button>
        </div>
        <p class="note">${tt('Fiyatlara KDV dahildir. Online satış henüz yoktur; adet, stok ve teslim süresi teklifle bildirilir.', 'Prices include VAT. There is no online sale yet; quantities, availability and delivery time are given in the quote.')}</p>`;

  const main = `
    <div class="wrap">
      ${breadcrumbHtml(crumbs)}
    </div>

    <section class="pd wrap" aria-labelledby="pd-title">
      <div class="pd__gallery" data-gallery>
        <button type="button" class="modal-zoom" data-zoom aria-pressed="false" aria-label="${tt('Görseli yakınlaştır', 'Zoom image')}"><img src="${images[0]}" alt="${esc(p.model + ' ' + p.title)}" class="modal-main-img" data-main${dims(images[0])} fetchpriority="high" style="object-position:${esc(p.pos || 'center')}"></button>
        ${images.length > 1 ? `<div class="modal-thumb-row">
          ${images.map((src, i) => `<button type="button" class="modal-thumb${i === 0 ? ' active' : ''}" data-src="${src}" data-pos="${i === 0 ? esc(p.pos || 'center') : 'center'}" aria-label="${tt('Görsel', 'Image')} ${i + 1} / ${images.length}" aria-pressed="${i === 0}">${productPicture(p, { suffix: i === 0 ? '' : `-g${i}`, sizes: '72px', attrs: ' loading="lazy" decoding="async"' })}</button>`).join('\n          ')}
        </div>` : ''}
      </div>

      <div class="pd__info">
        <p class="pd__code"><span>${esc(p.model)}</span>${p.premium ? '<span class="pd__badge pd__badge--premium" lang="en">Premium</span>' : ''}${p.badge ? `<span class="pd__badge">${esc(p.badge)}</span>` : ''}</p>
        <h1 id="pd-title">${esc(p.title)}</h1>
        <p class="lead">${esc(p.short)}</p>
        ${p.colors && p.colors.length ? `<div class="pd-colors">
          <p class="pd-colors__label">${p.colors.length > 1 ? tt(`${p.colors.length} renk seçeneği`, `${p.colors.length} colour options`) : tt('Renk', 'Colour')}</p>
          ${colorRow(p, ' color-row--lg')}
        </div>` : ''}
        ${facts.length ? `<dl class="pd-facts">
          ${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n          ')}
        </dl>` : ''}
        ${hasPrice(p) ? `<div class="pd-price">
          <p class="pd-price__label">${p.options ? tt('Model seçin', 'Choose a model') : [].concat(p.price).length > 1 ? tt('Liste fiyatı (seriye göre)', 'List price (by model)') : tt('Liste fiyatı', 'List price')}</p>
          ${optionRow(p, ' opt-row--lg')}
          ${p.options ? `<p class="pd-price__cov">${tt('Kapsama', 'Coverage')}: <span data-opt-cov>${esc(optCov(p.options[0]))}</span></p>` : ''}
          ${priceHtml(p, 'pd-price__row')}
        </div>` : ''}
        ${actions}
        <ul class="pd-links">
          <li><a href="urunler.html?cat=${p.cat}" class="link-arrow">${tt(`Tüm ${esc(CAT_SHORT[p.cat].toLocaleLowerCase('tr'))} modeller`, `All ${esc(CAT_SHORT[p.cat].toLowerCase())} models`)} ${icon('arrow-right')}</a></li>
          ${tech === 'ultrasonic' || tech === 'dual' ? `<li><a href="blog-ultrasonik-ve-cift-akiskanli-difuzor-farki.html" class="link-arrow">${tt('Ultrasonik ve çift akışkanlı farkı', 'Ultrasonic versus dual-fluid')} ${icon('arrow-right')}</a></li>` : ''}
        </ul>
      </div>
    </section>
${productVideoSection(p)}
    <section class="section" aria-label="${tt('Ürün ayrıntıları', 'Product details')}">
      <div class="wrap pd-body">
        <div class="pd-body__main prose prose--article">
          <h2>${tt('Ürün hakkında', 'About the product')}</h2>
          <p>${esc(p.desc)}</p>
          ${p.features.length ? `<h2>${tt('Öne çıkan özellikler', 'Key features')}</h2>
          <ul class="check-list">
            ${p.features.map(f => `<li>${icon('check')}<span>${esc(f)}</span></li>`).join('\n            ')}
          </ul>` : ''}
          ${fit}
          ${uses.length ? `<h2>${tt('Kullanım alanları', 'Applications')}</h2>
          <ul class="tag-list">
            ${uses.map(u => `<li class="tag">${esc(u)}</li>`).join('\n            ')}
          </ul>` : ''}
          ${p.variants && p.variants.length ? `<h2>${tt('Varyantlar', 'Variants')}</h2>
          <ul>
            ${p.variants.map(v => `<li>${esc(v)}</li>`).join('\n            ')}
          </ul>` : ''}
        </div>
        <div class="pd-body__aside">
          <h2 id="specs-title">${tt('Teknik veriler', 'Technical data')}</h2>
          <dl class="spec-table">
            ${p.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n            ')}
          </dl>
          <p class="note mt-3">${tt('Değerler varyanta göre değişebilir.', 'Values may vary by variant.')}</p>
        </div>
      </div>
    </section>
${productBannersSection(p)}
    ${ESSENCES_LIVE ? essenceLinkHtml(p) : essenceLockedHtml()}

    <section class="section" aria-labelledby="faq-title">
      <div class="wrap faq-layout">
        <h2 id="faq-title">${tt(`${esc(fam(p))} hakkında sorular`, `Questions about ${esc(fam(p))}`)}</h2>
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
          <h2 id="related-title">${tt('Benzer ürünler', 'Similar products')}</h2>
        </div>
        <div class="product-grid product-grid--3">
          ${related.map(r => productCard(r, 'h3')).join('\n          ')}
        </div>
      </div>
    </section>
`;
  return page({
    // Satışta olmayan ürünlerin sayfası arama motorlarına kapalıdır (sitede bu sayfalara bağlantı yoktur)
    meta: { title, description, url: productUrl(p), image: images[0], imageAlt: `${p.model} ${p.title}`, type: 'product', noindex: !!p.soon, jsonld: [productLd, breadcrumbLd(crumbs), faqLd, ...(p.videos || []).map(v => videoLd(p, v))] },
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
            <p class="post-card__meta"><span>${esc(post.tags[0])}</span><span><time datetime="${post.date}">${fmtDate(post.date)}</time></span><span>${post.minutes} ${tt('dk okuma', 'min read')}</span></p>
            <h2 class="post-card__title"><a href="${postUrl(post)}" class="post-card__link">${esc(post.title)}</a></h2>
            <p class="post-card__desc">${esc(post.description)}</p>
          </div>
        </article>`;
}

function blogIndex() {
  const crumbs = [home(), { name: 'Blog' }];
  const main = `
    <section class="page-head" aria-labelledby="page-title">
      <div class="wrap">
        <h1 id="page-title">${tt('Mekân kokulandırma rehberi', 'A guide to scenting spaces')}</h1>
        <p class="lead">${tt('Koku pazarlaması araştırmaları, cihaz seçimi, klima bağlantısı, esans güvenliği ve doğru yoğunluk üzerine kaynaklı rehberler.', 'Sourced guides on scent marketing research, choosing a device, HVAC connection, fragrance safety and the right intensity.')}</p>
      </div>
    </section>

    <section class="section section--flush-top" aria-label="${tt('Yazılar', 'Articles')}">
      <div class="wrap">
        <div class="post-grid">
        ${POSTS.map((post, i) => postCard(post, i === 0)).join('\n        ')}
        </div>
      </div>
    </section>
`;
  const blogLd = {
    '@context': 'https://schema.org', '@type': 'Blog', name: `${BRAND} Blog`, url: pageAbs('blog.html'), inLanguage: tt('tr-TR', 'en'), publisher: { '@id': ORG_ID },
    blogPost: POSTS.map(p => ({ '@type': 'BlogPosting', headline: p.title, url: pageAbs(postUrl(p)), datePublished: p.date }))
  };
  return page({
    meta: {
      title: tt(`Mekân Kokulandırma Rehberi ve Blog | ${BRAND}`, `Scenting Guide and Blog | ${BRAND}`),
      description: tt('Koku pazarlaması, difüzör seçimi, klima bağlantısı, IFRA standartları ve doğru koku yoğunluğu üzerine kaynaklı rehber yazılar.', 'Sourced guides on scent marketing, choosing a diffuser, HVAC connection, IFRA standards and the right scent intensity.'),
      url: 'blog.html', image: POSTS[0].image, jsonld: [blogLd, breadcrumbLd(crumbs)]
    },
    section: 'blog.html',
    main
  });
}

function blogPost(post) {
  const crumbs = [home(), { name: 'Blog', href: 'blog.html' }, { name: post.navTitle }];
  const related = post.related.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean).slice(0, 3);
  const others = POSTS.filter(p => p.slug !== post.slug).slice(0, 3);
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: post.title, description: post.description, image: [abs(post.image)],
    datePublished: post.date, dateModified: post.date, inLanguage: tt('tr-TR', 'en'),
    author: { '@type': 'Organization', name: BRAND, url: `${SITE_URL}/` },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: pageAbs(postUrl(post)),
    keywords: post.tags.join(', ')
  };
  const main = `
    <div class="wrap">
      ${breadcrumbHtml(crumbs)}
    </div>

    <article class="article" aria-labelledby="post-title">
      <header class="article__head wrap">
        <p class="post-card__meta"><span>${post.tags.map(esc).join(', ')}</span><span><time datetime="${post.date}">${fmtDate(post.date)}</time></span><span>${post.minutes} ${tt('dk okuma', 'min read')}</span></p>
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
          <h2 id="sources-title">${tt('Kaynaklar', 'Sources')}</h2>
          <ol>
            ${post.sources.map(s => `<li>${s.url ? `<a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.label)}</a>` : esc(s.label)}</li>`).join('\n            ')}
          </ol>
        </div>` : ''}
      </div>
    </article>

    ${related.length ? `<section class="section section--flush-top" aria-labelledby="related-title">
      <div class="wrap">
        <div class="section-head"><h2 id="related-title">${tt('Yazıda geçen ürünler', 'Products in this article')}</h2></div>
        <div class="product-grid product-grid--3">
          ${related.map(r => productCard(r, 'h3')).join('\n          ')}
        </div>
      </div>
    </section>` : ''}

    <section class="section section--deep" aria-labelledby="more-title">
      <div class="wrap">
        <div class="section-head"><h2 id="more-title">${tt('Diğer yazılar', 'More articles')}</h2></div>
        <ul class="more-posts">
          ${others.map(o => `<li><a href="${postUrl(o)}"><span class="more-posts__title">${esc(o.title)}</span><span class="more-posts__meta">${o.minutes} ${tt('dk okuma', 'min read')}</span></a></li>`).join('\n          ')}
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
// Belge sayfaları: Sürdürülebilirlik, SSS, Gizlilik
// ---------------------------------------------------------------------------
function docSources(list) {
  return `<div class="sources">
            <h2 id="sources-title">${tt('Kaynaklar', 'Sources')}</h2>
            <ol>
              ${list.map(s => `<li>${s.url ? `<a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.label)}</a>` : esc(s.label)}</li>`).join('\n              ')}
            </ol>
          </div>`;
}

function docPage(D, { url, image, extraHead = '', sources = false }) {
  const crumbs = [home(), { name: D.crumb || D.h1 }];
  const main = `
    <section class="page-head" aria-labelledby="page-title">
      <div class="wrap">
        <h1 id="page-title">${esc(D.h1)}</h1>
        <p class="lead">${esc(D.lead)}</p>
        ${extraHead}
      </div>
    </section>

    <section class="section section--flush-top" aria-label="${tt('İçerik', 'Content')}">
      <div class="wrap doc">
        <nav class="doc__toc" aria-label="${tt('Bu sayfada', 'On this page')}">
          <p class="doc__toc-title">${tt('Bu sayfada', 'On this page')}</p>
          <ol>
            ${D.sections.map(s => `<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join('\n            ')}
          </ol>
        </nav>
        <div class="doc__body prose prose--article">
          ${D.sections.map(s => `<section id="${s.id}" aria-labelledby="${s.id}-t">
            <h2 id="${s.id}-t">${esc(s.title)}</h2>
            ${s.html}
          </section>`).join('\n          ')}
          ${sources ? docSources(D.sources) : ''}
        </div>
      </div>
    </section>
`;
  return page({ meta: { title: D.title, description: D.description, url, image, jsonld: [breadcrumbLd(crumbs)] }, main });
}

const sustainabilityPage = () => docPage(C.SUSTAINABILITY, { url: 'surdurulebilirlik.html', image: 'images/general/oilrange.jpg', sources: true });
const privacyPage = () => docPage(C.PRIVACY, {
  url: 'gizlilik.html',
  extraHead: `<p class="meta mt-4">${tt('Son güncelleme', 'Last updated')}: <time datetime="${C.PRIVACY.updated}">${fmtDate(C.PRIVACY.updated)}</time></p>`
});

function faqPage() {
  const F = C.FAQ;
  const crumbs = [home(), { name: F.h1 }];
  const all = F.groups.flatMap(g => g.items);
  const ldFaq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: all.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  const main = `
    <section class="page-head" aria-labelledby="page-title">
      <div class="wrap">
        <h1 id="page-title">${esc(F.h1)}</h1>
        <p class="lead">${esc(F.lead)}</p>
      </div>
    </section>

    <section class="section section--flush-top" aria-label="${tt('Sorular', 'Questions')}">
      <div class="wrap faq-groups">
        ${F.groups.map(g => `<div class="faq-layout">
          <h2>${esc(g.title)}</h2>
          <div class="faq">
            ${g.items.map(([q, a]) => `<details class="faq__item">
              <summary>${esc(q)}${icon('plus', 'faq__icon')}</summary>
              <p>${esc(a)}</p>
            </details>`).join('\n            ')}
          </div>
        </div>`).join('\n        ')}
        <p class="faq-more">${tt('Sorunuzun cevabını bulamadınız mı? <a href="iletisim.html" class="text-link">Teklif formundan bize yazın.</a>', 'Didn\'t find your answer? <a href="iletisim.html" class="text-link">Write to us through the quote form.</a>')}</p>
      </div>
    </section>
`;
  return page({ meta: { title: F.title, description: F.description, url: 'sss.html', jsonld: [ldFaq, breadcrumbLd(crumbs)] }, main });
}

// Esans sayfası (js/essences.js, style.css 32. bölüm). Üstte "sahne": aile sekmeleri, esans seçici ve seçili esansın
// paneli (koku piramidi görseli, notalar, his, önerilen mekânlar, teklif ve numune). Seçilen esansın renk tonu (hue)
// sahnenin zeminini, paleti ve hareketi (motion) arka plandaki canvas animasyonunu belirler. JS yoksa tüm esanslar
// aileleriyle alt alta görünür. Altta: koku piramidi rehberi, aile kartları, cihazlar ve numune çağrısı.
function essencesPage() {
  const first = ESSENCES.find(e => e.fam === ESSENCE_FAMILIES[0].id) || ESSENCES[0];
  const firstFam = famOf(first.fam);
  const notes = list => list.map(esc).join(' · ');
  // Katman cümlesi: köşeli parantezdeki notalar vurgulanır ("[Bergamot] ve [limon]la ..."); her nota bir kez geçer
  const story = s => esc(s).replace(/\[([^\]]+)\]/g, '<strong>$1</strong>');
  const TIERS = [
    ['top', tt('Üst notalar', 'Top notes'), tt('ilk izlenim', 'first impression')],
    ['heart', tt('Orta notalar', 'Heart notes'), tt('kokunun karakteri', 'the character')],
    ['base', tt('Dip notalar', 'Base notes'), tt('kalıcı iz', 'the lasting trace')]
  ];
  // Rehberdeki piramit simgesi: tepe (32, 0), taban 2-62 aralığında üç katman; seçili katman dolu
  const PYRAMID_BANDS = [[0, 14], [17, 31], [34, 48]];
  const edge = (y, side) => +(32 + side * 30 * (y / 48)).toFixed(2);
  const famBadge = f => `${f.prefix} · ${essencesOf(f).length} ${tt('esans', essencesOf(f).length === 1 ? 'fragrance' : 'fragrances')}`;

  const panel = e => {
    const alt = tt(`${e.name} (${e.code}) koku piramidi. Üst notalar: ${e.top.join(', ')}. Orta notalar: ${e.heart.join(', ')}. Dip notalar: ${e.base.join(', ')}.`,
      `${e.name} (${e.code}) scent pyramid. Top notes: ${e.top.join(', ')}. Heart notes: ${e.heart.join(', ')}. Base notes: ${e.base.join(', ')}.`);
    const big = imageSize(`images/essences/${e.img}.jpg`) || { w: 1200, h: 1200 };
    return `<article class="essence${e === first ? ' is-active' : ''}" id="esans-${e.id}" data-essence="${e.id}" data-fam="${e.fam}" data-fams="${famsOf(e).join(' ')}" data-hue="${e.hue}" data-motion="${e.motion}" data-palette="${e.palette.join(',')}" data-sprites="${e.sprites.join(',')}" aria-labelledby="esans-${e.id}-t">
            <div class="essence__visual">
              <button type="button" class="essence__figure" data-image-open data-src="images/essences/${e.img}.jpg" data-webp="images/essences/${e.img}.webp" data-w="${big.w}" data-h="${big.h}" data-title="${esc(`${e.name} (${e.code}) · ${tt('koku piramidi', 'scent pyramid')}`)}" aria-label="${esc(tt(`${e.name} koku piramidini büyüt`, `Enlarge the ${e.name} scent pyramid`))}">
                ${essencePicture(e, { alt, attrs: `${e === first ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"` })}
                <span class="zoom-chip" aria-hidden="true">${icon('magnifying-glass')}${tt('Büyüt', 'Enlarge')}</span>
              </button>
            </div>
            <div class="essence__body">
              <p class="essence__meta"><span class="essence__fam">${esc(famLabels(e))}</span><span class="essence__code">${esc(e.code)}</span></p>
              <h2 id="esans-${e.id}-t">${esc(e.name)}</h2>
              <ul class="essence__mood" aria-label="${tt('Kokunun hissi', 'How it feels')}">
                ${e.mood.map(m => `<li>${esc(m)}</li>`).join('')}
              </ul>
              <ol class="note-pyramid" aria-label="${tt('Koku piramidi', 'Scent pyramid')}">
                ${TIERS.map(([k, label, hint], i) => `<li class="np-tier np-tier--${k}" style="--t:${i}"><span class="np-tier__label">${label} <span class="np-tier__hint">· ${hint}</span></span><span class="np-tier__text">${story(e.story[i])}</span></li>`).join('\n                ')}
              </ol>
              ${essencePriceHtml(e, 'essence__price')}
              <div class="btn-row essence__actions">
                <button type="button" class="btn btn--primary" data-add-to-list="${e.id}">${icon('plus', 'icon--sm')}<span>${tt('Teklif listesine ekle', 'Add to quote list')}</span></button>
                <button type="button" class="btn btn--quiet" data-quote-now="${e.id}" data-sample>${tt('Numune iste', 'Ask for a sample')}</button>
              </div>
            </div>
          </article>`;
  };

  const main = `
    <section class="essence-stage" id="koleksiyon" data-essences data-fam="${first.fam}" data-motion="${first.motion}" style="--e-h:${first.hue}" aria-labelledby="page-title">
      <div class="essence-stage__bg" aria-hidden="true"><canvas></canvas></div>
      <div class="wrap essence-stage__inner">
        <div class="essence-head">
          <p class="eyebrow">${tt(`${ESSENCES.length} esans · ${ESSENCE_FAMILIES.length} koku ailesi`, `${ESSENCES.length} fragrances · ${ESSENCE_FAMILIES.length} scent families`)}</p>
          <h1 id="page-title">${tt('Esans koleksiyonu', 'Fragrance collection')}</h1>
          <p class="lead">${tt('Bir esans seçin: sayfa onun rengine ve hareketine bürünsün, koku piramidi üst notalardan dibe doğru açılsın.', 'Choose a fragrance: the page takes on its colour and movement, and its scent pyramid unfolds from the top notes down.')}</p>
        </div>

        <div class="essence-controls">
          <div class="filter-tabs essence-fams" role="group" aria-label="${tt('Koku ailesi', 'Scent family')}">
            ${ESSENCE_FAMILIES.map(f => `<button type="button" class="segment-btn${f.id === first.fam ? ' active' : ''}" data-fam-btn="${f.id}" data-text="${esc(f.text)}" aria-pressed="${f.id === first.fam}">${esc(f.label)} <span class="count">${essencesOf(f).length}</span></button>`).join('\n            ')}
          </div>
          <button type="button" class="essence-motion" data-essence-motion aria-pressed="false" hidden>${icon('pause', 'icon-pause')}${icon('play', 'icon-play')}<span>${tt('Hareketi durdur', 'Pause motion')}</span></button>
        </div>
        <p class="essence-fam-text" data-fam-text>${esc(firstFam.text)}</p>

        <div class="essence-picker" role="group" aria-label="${tt('Esans seçin', 'Choose a fragrance')}" data-picker>
          ${ESSENCES.map(e => `<button type="button" class="essence-pick${famsOf(e).includes(first.fam) ? ' is-in-fam' : ''}" data-pick="${e.id}" data-fam="${e.fam}" data-fams="${famsOf(e).join(' ')}" aria-pressed="${e === first}" aria-controls="esans-${e.id}">${essenceOrb(e)}<span class="essence-pick__name">${esc(e.name)}</span><span class="essence-pick__code">${esc(e.code)}</span></button>`).join('\n          ')}
        </div>

        <div class="essence-panels" aria-live="polite">
          ${ESSENCE_FAMILIES.map(f => `<h2 class="essence-fam-head" id="aile-${f.id}">${esc(f.label)}</h2>
          ${ESSENCES.filter(e => e.fam === f.id).map(panel).join('\n          ')}`).join('\n          ')}
        </div>

        <div class="essence-step" data-step-nav hidden>
          <button type="button" class="essence-step__btn" data-step="-1">${icon('arrow-right', 'essence-step__prev')}<span>${tt('Önceki', 'Previous')}</span></button>
          <span class="essence-step__pos num" data-step-pos></span>
          <button type="button" class="essence-step__btn" data-step="1"><span>${tt('Sonraki', 'Next')}</span>${icon('arrow-right')}</button>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="pyramid-title">
      <div class="wrap split split--wide-b">
        <div class="split__a section-head reveal">
          <h2 id="pyramid-title">${tt('Koku piramidi nasıl okunur?', 'How to read a scent pyramid')}</h2>
          <p class="lead">${tt('Her esans birbirini tamamlayan üç nota katmanından oluşur. Piramit, kokuyu ilk fark edilen notalardan kalıcı ize doğru anlatır.', 'Every fragrance is built from three layers of notes that complete one another. The pyramid describes the scent from the first notes you notice to the trace it leaves.')}</p>
        </div>
        <div class="split__b">
          <ol class="pyramid-guide">
            ${[
              [tt('Üst notalar', 'Top notes'), tt('İlk izlenim. Odaya girildiğinde ilk fark edilen hafif ve uçucu notalar: turunçgiller, yeşil yapraklar, ferah aromatikler.', 'The first impression. The light, volatile notes you notice as you walk in: citrus, green leaves, fresh aromatics.')],
              [tt('Orta notalar', 'Heart notes'), tt('Kokunun karakteri. Esansın kimliğini belirleyen çiçekler, meyveler ve baharatlar.', 'The character. The flowers, fruits and spices that give the fragrance its identity.')],
              [tt('Dip notalar', 'Base notes'), tt('Kalıcı iz. Kokuya derinlik ve süreklilik veren misk, amber, odunsular ve vanilya.', 'The lasting trace. Musk, amber, woods and vanilla that give the scent depth and continuity.')]
            ].map(([h, p], i) => `<li class="pyramid-guide__item reveal">
              <svg class="pyramid-guide__icon" viewBox="0 0 64 48" aria-hidden="true" focusable="false">${PYRAMID_BANDS.map(([y1, y2], j) => `<path d="M${edge(y1, -1)} ${y1}L${edge(y1, 1)} ${y1}L${edge(y2, 1)} ${y2}L${edge(y2, -1)} ${y2}Z"${j === i ? ' class="is-on"' : ''}/>`).join('')}</svg>
              <div><h3>${h}</h3><p>${p}</p></div>
            </li>`).join('\n            ')}
          </ol>
          <p class="note mt-5">${tt('Difüzörlerde esans ısıtılmadan, çok ince parçacıklara ayrılarak havaya verilir; ortamda kokunun bütünü hissedilir. Yoğunluğu cihazın püskürtme ve bekleme süreleriyle ayarlarsınız.', 'Diffusers release the fragrance into the air as very fine particles without heating it, so the whole scent is present in the room. You set the intensity with the device\'s spray and pause times.')}</p>
        </div>
      </div>
    </section>

    <section class="section section--deep" aria-labelledby="families-title">
      <div class="wrap">
        <div class="section-head reveal">
          <h2 id="families-title">${tt('Beş koku ailesi, beş ayrı karakter', 'Five scent families, five distinct characters')}</h2>
          <p class="lead">${tt('Aileler kokunun karakterini ve işlevini anlatır: alerjen içermeyen formüller, kötü kokuyu nötralize eden esanslar, parfüm karakterli imza kokular, çiçeksi ve oryantal notalar.', 'The families describe each scent\'s character and purpose: allergen-free formulas, odour-neutralising fragrances, perfume-like signature scents, and floral and oriental notes.')}</p>
        </div>
        <ul class="fam-grid">
          ${ESSENCE_FAMILIES.map(f => {
            const list = essencesOf(f);
            return `<li class="fam-card reveal" style="--e-h:${list[0].hue}">
            <p class="fam-card__code">${esc(famBadge(f))}</p>
            <h3>${esc(f.label)}</h3>
            <p>${esc(f.text)}</p>
            <div class="fam-card__orbs">
              ${list.slice(0, 8).map(e => `<a href="#esans-${e.id}" class="fam-card__orb" data-pick-link="${e.id}" data-fam-ctx="${f.id}" title="${esc(`${e.name} · ${e.code}`)}">${essenceOrb(e)}<span class="visually-hidden">${esc(`${e.name} (${e.code})`)}</span></a>`).join('')}${list.length > 8 ? `<span class="fam-card__more num">+${list.length - 8}</span>` : ''}
            </div>
            <a href="#aile-${f.id}" class="link-arrow" data-fam-link="${f.id}">${tt('Esansları inceleyin', 'View the fragrances')} ${icon('arrow-right')}</a>
          </li>`;
          }).join('\n          ')}
        </ul>
        <p class="note mt-7">${tt('Esansların güvenlik bilgi formunu (SDS) ve IFRA uygunluk belgelerini teklif sürecinde isteyebilirsiniz; ayrıntılar için <a href="blog-ifra-standartlari-nedir.html" class="text-link">IFRA yazımıza</a> bakabilirsiniz.', 'You can ask for the safety data sheet (SDS) and IFRA conformity documents of the fragrances during the quote process; see <a href="blog-ifra-standartlari-nedir.html" class="text-link">our IFRA article</a> for details.')}</p>
      </div>
    </section>

    <section class="section" aria-labelledby="devices-title">
      <div class="wrap">
        <div class="section-head reveal">
          <h2 id="devices-title">${tt('Esansı cihazınızla buluşturun', 'Pair the fragrance with your device')}</h2>
          <p class="lead">${tt('Esanslar Meira difüzörlerinde kullanılır. Teklif isterken cihaz modelinizi belirtin; esansı cihazınıza uygun form ve ambalajda sunalım.', 'The fragrances are used in Meira diffusers. When you request a quote, tell us your device model and we will offer the fragrance in the right form and packaging for your device.')}</p>
        </div>
        <div class="product-grid product-grid--3">
          ${catalogOrder(PRODUCTS).filter(p => !p.soon).slice(0, 3).map(p => productCard(p, 'h3')).join('\n          ')}
        </div>
        <p class="mt-6"><a href="urunler.html" class="link-arrow">${tt('Tüm difüzörleri inceleyin', 'Browse all diffusers')} ${icon('arrow-right')}</a></p>
      </div>
    </section>

    <section class="section section--deep closing-band" aria-labelledby="closing-title">
      <div class="wrap closing reveal">
        <h2 id="closing-title">${tt('Kokuyu ekranda değil, <em>mekânınızda</em> deneyin.', 'Try the scent in your <em>space</em>, not on a screen.')}</h2>
        <p>${tt('Beğendiğiniz esansları teklif listenize ekleyin, numune isteyin; kararınızı kokuyu mekânınızda deneyerek verin.', 'Add the fragrances you like to your quote list and ask for samples; decide after trying the scent in your own space.')}</p>
        <div class="btn-row">
          <a href="iletisim.html?konu=numune&amp;numune=1&amp;teklif=1" class="btn btn--primary btn--lg">${tt('Numune isteyin', 'Ask for samples')} ${icon('arrow-right', 'icon--move')}</a>
          <a href="urunler.html" class="link-arrow">${tt('Difüzörleri inceleyin', 'Browse the diffusers')} ${icon('arrow-right')}</a>
        </div>
      </div>
    </section>

    ${imageDialogHtml(tt('Koku piramidi', 'Scent pyramid'))}
`;
  const crumbs = [home(), { name: tt('Esanslar', 'Essences') }];
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: tt('Esans koleksiyonu', 'Fragrance collection'),
    numberOfItems: ESSENCES.length,
    itemListElement: ESSENCES.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: `${pageAbs('esanslar.html')}#esans-${e.id}`, name: `${e.name} (${e.code})`, image: abs(`images/essences/${e.img}.jpg`) }))
  };
  return page({
    meta: {
      title: tt(`Esans Koleksiyonu ve Koku Piramitleri | ${BRAND}`, `Fragrance Collection and Scent Pyramids | ${BRAND}`),
      description: tt(`${ESSENCES.length} esans, ${ESSENCE_FAMILIES.length} koku ailesi: ${famSentence().toLocaleLowerCase(L)}. Üst, orta ve dip notalarıyla koku piramitleri, önerilen mekânlar, teklif ve numune talebi.`, `${ESSENCES.length} fragrances in ${ESSENCE_FAMILIES.length} scent families: ${famSentence().toLowerCase()}. Scent pyramids with top, heart and base notes, suggested spaces, quotes and samples.`),
      url: 'esanslar.html', image: 'images/essences/og-esanslar.jpg', imageAlt: tt('Meira esans koleksiyonundan koku piramitleri', 'Scent pyramids from the Meira fragrance collection'),
      jsonld: [breadcrumbLd(crumbs), itemList]
    },
    section: 'esanslar.html',
    main,
    after: `\n  <script src="js/essences.js?v=${VER.essences}"></script>`
  });
}

// Esanslar yayında değilken: "hazırlanıyor" sayfası (arama motorlarına kapalı)
function essencesLockedPage() {
  const main = `
    <section class="page-head" aria-labelledby="page-title">
      <div class="wrap">
        <h1 id="page-title">${tt('Esans koleksiyonu', 'Fragrance collection')}</h1>
        <p class="lead">${tt('Esans koleksiyonumuz hazırlanıyor. Koku seçenekleri kısa süre içinde bu sayfada yer alacak.', 'Our fragrance collection is being prepared. The scent range will appear on this page shortly.')}</p>
        <div class="locked-card locked-card--inline mt-7">
          <span class="locked-card__icon">${icon('lock')}</span>
          <p class="locked-card__title">${tt('Esanslar yakında', 'Fragrances coming soon')}</p>
        </div>
        <div class="btn-row mt-7">
          <a href="urunler.html" class="btn btn--primary btn--lg">${tt('Ürünleri incele', 'Browse products')}</a>
          <a href="iletisim.html?konu=numune" class="btn btn--quiet btn--lg">${tt('Numune isteyin', 'Ask for a sample')}</a>
        </div>
      </div>
    </section>
`;
  return page({ meta: { title: tt(`Esans koleksiyonu hazırlanıyor | ${BRAND}`, `Fragrance collection in preparation | ${BRAND}`), description: tt('Esans koleksiyonumuz hazırlanıyor; koku seçenekleri kısa süre içinde sitede yer alacak.', 'Our fragrance collection is being prepared; the scent range will be on the site shortly.'), url: 'esanslar.html', noindex: true }, main });
}

// RSS 2.0 beslemesi (blog)
function feed() {
  const rfc = iso => new Date(`${iso}T09:00:00+03:00`).toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BRAND} Blog</title>
    <link>${pageAbs('blog.html')}</link>
    <description>${tt('Mekân kokulandırma, cihaz seçimi ve esans güvenliği üzerine kaynaklı rehberler.', 'Sourced guides on scenting spaces, choosing a device and fragrance safety.')}</description>
    <language>${tt('tr-TR', 'en')}</language>
    <lastBuildDate>${rfc(TODAY)}</lastBuildDate>
    <atom:link href="${pageAbs('feed.xml')}" rel="self" type="application/rss+xml"/>
${POSTS.map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${pageAbs(postUrl(p))}</link>
      <guid isPermaLink="true">${pageAbs(postUrl(p))}</guid>
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
        <h1 id="page-title">${tt('Aradığınız sayfa bulunamadı', 'Page not found')}</h1>
        <p class="lead">${tt('Bağlantı değişmiş ya da sayfa kaldırılmış olabilir. Aşağıdaki sayfalardan devam edebilirsiniz.', 'The link may have changed or the page may have been removed. You can continue from the pages below.')}</p>
        <div class="btn-row mt-7">
          <a href="urunler.html" class="btn btn--primary btn--lg">${tt('Ürünleri incele', 'Browse products')}</a>
          <a href="index.html" class="btn btn--quiet btn--lg">${tt('Ana sayfa', 'Home')}</a>
        </div>
      </div>
    </section>
`;
  return page({ meta: { title: tt(`Sayfa bulunamadı | ${BRAND}`, `Page not found | ${BRAND}`), description: tt('Aradığınız sayfa bulunamadı.', 'The page you are looking for could not be found.'), url: '404.html', noindex: true }, main });
}

// ---------------------------------------------------------------------------
// Elle yazılmış sayfalar: <head>, header, footer ve işaretli bölümler
// ---------------------------------------------------------------------------
const HAND_PAGES = () => ({
  'index.html': {
    title: tt(`${BRAND} | Profesyonel Koku Difüzörleri ve Mekân Kokulandırma`, `${BRAND} | Professional Scent Diffusers and Space Scenting`),
    description: tt(`Oteller, ofisler ve mağazalar için profesyonel koku difüzörleri. ${MANUFACTURER} ürünlerinin Türkiye distribütörü; ürün seçimi ve teklif.`, `Professional scent diffusers for hotels, offices and shops. Turkish distributor of ${MANUFACTURER} products; product selection and quotes.`),
    dark: true, intro: true, jsonld: [orgLd(), websiteLd()]
  },
  'urunler.html': {
    title: tt(`Koku Difüzörü Kataloğu: Duvar Tipi, Klima ve Masaüstü | ${BRAND}`, `Scent Diffuser Catalogue: Wall, HVAC and Tabletop | ${BRAND}`),
    description: tt(`Duvar tipi, klima bağlantılı, prize takılan ve masaüstü koku difüzörleri. ${PRODUCTS.length} ürünün teknik özellikleri, kapsama alanları, liste fiyatları ve teklif listesi.`, `Wall-mounted, HVAC-connected, plug-in and tabletop scent diffusers. Technical data, coverage, list prices and a quote list for ${PRODUCTS.length} products.`),
    image: 'images/products/ck687.jpg', crumbs: tt('Ürünler', 'Products'),
    itemList: true
  },
  'cozumler.html': {
    title: tt(`Otel, Ofis ve Mağaza için Koku Çözümleri | ${BRAND}`, `Scenting Solutions for Hotels, Offices and Shops | ${BRAND}`),
    description: tt('Mekân hacmine göre difüzör seçimi: hacim hesaplayıcı, oteller, mağazalar, ofisler ve büyük alanlar için önerilen modeller ve kapsama aralıkları.', 'Choosing a diffuser by room volume: volume calculator and recommended models and coverage for hotels, shops, offices and large spaces.'),
    image: 'images/general/video-hotel-poster.jpg', crumbs: tt('Çözümler', 'Solutions')
  },
  'teknoloji.html': {
    title: tt(`Koku Difüzörü Teknolojisi: Ultrasonik ve Basınçlı Hava | ${BRAND}`, `Diffuser Technology: Ultrasonic and Compressed Air | ${BRAND}`),
    description: tt('Çift akışkanlı (basınçlı hava) ve ultrasonik atomizasyon nasıl çalışır, uygulama kontrolü ve klima sistemine bağlantı. Nitel karşılaştırma ve şematik gösterim.', 'How dual-fluid (compressed air) and ultrasonic atomisation work, app control and HVAC connection. A qualitative comparison with a schematic view.'),
    image: 'images/general/video-hero-poster.jpg', crumbs: tt('Teknoloji', 'Technology')
  },
  'kurumsal.html': {
    title: tt(`Kurumsal, Distribütörlük ve OEM / ODM | ${BRAND}`, `Company, Distribution and OEM / ODM | ${BRAND}`),
    description: tt('Andusic ürünlerinin Türkiye distribütörü: üretici, üretim tesisi ve kalite süreçleri, ISO 9001, 14001 ve 22716 sertifikaları, OEM / ODM ve kurumsal koku süreci.', 'Turkish distributor of Andusic products: the manufacturer, its facility and quality processes, ISO 9001, 14001 and 22716 certificates, OEM / ODM.'),
    image: 'images/general/factory2.jpg', crumbs: tt('Kurumsal ve OEM', 'Company and OEM')
  },
  'iletisim.html': {
    title: tt(`Teklif İste ve İletişim | ${BRAND}`, `Request a Quote and Contact | ${BRAND}`),
    description: tt('Seçtiğiniz koku difüzörleri için teklif isteyin, numune ya da OEM talebinde bulunun. Teklif listenizdeki ürünler forma otomatik eklenir.', 'Request a quote for the scent diffusers you have chosen, or ask about samples or OEM. The products in your quote list are added to the form automatically.'),
    image: 'images/products/ck686.jpg', crumbs: tt('İletişim', 'Contact')
  }
});

function catalogGridHtml() {
  return `<!-- katalog:basla (tools/build.mjs) -->
          ${(() => {
            // Esans kartı satıştaki ürünlerden sonra, "pek yakında" ürünlerden önce (urunler.html betiğiyle aynı)
            const cards = catalogOrder(PRODUCTS).map(p => [p, productCard(p)]);
            const firstSoon = cards.findIndex(([p]) => p.soon);
            const html = cards.map(([, c]) => c);
            if (ESSENCES_LIVE) html.splice(firstSoon < 0 ? html.length : firstSoon, 0, essenceCard());
            return html.join('\n          ');
          })()}
          <!-- katalog:bitir -->`;
}

// Ana sayfa: ürün videoları (kapak kartı + tek bir <dialog> oynatıcı). Satışta olmayan ürünün kartında bağlantı yok.
function homeVideosHtml() {
  const items = catalogOrder(PRODUCTS).filter(p => p.videos && p.videos.length).map(p => ({ p, v: p.videos[0] }));
  return `<div class="video-cards">
          ${items.map(({ p, v }) => `<article class="video-card reveal">
            <button type="button" class="video-card__play" data-video-open data-src="${videoSrc(v)}" data-poster="${videoPoster(v)}" data-title="${esc(v.title)}" data-summary="${esc(v.summary)}" data-meta="${esc(videoMeta(v))}" aria-label="${tt('Videoyu izle', 'Watch the video')}: ${esc(v.title)}, ${durationText(v.duration)}">
              <span class="media media--16x9"><picture><source type="image/webp" srcset="images/products/videos/${v.file}.webp 640w" sizes="(min-width: 1100px) 300px, (min-width: 640px) 45vw, 92vw"><img src="${videoPoster(v)}" alt=""${dims(videoPoster(v))} loading="lazy" decoding="async"></picture></span>
              <span class="video-card__icon">${icon('play')}</span>
              <span class="video-card__time">${mmss(v.duration)}</span>
            </button>
            <div class="video-card__body">
              <p class="video-card__model">${esc(fam(p))}</p>
              <h3>${esc(v.title)}</h3>
              <p>${esc(v.teaser)}</p>
              ${p.soon
                ? `<span class="soon-pill">${soonLabel()}</span>`
                : `<a href="${productUrl(p)}" class="link-arrow">${tt('Ürünü incele', 'View product')} ${icon('arrow-right')}</a>`}
            </div>
          </article>`).join('\n          ')}
        </div>
        <dialog class="video-dialog" id="videoDialog" aria-labelledby="videoDialogTitle">
          <div class="video-dialog__head">
            <h2 class="video-dialog__title" id="videoDialogTitle">${tt('Ürün videosu', 'Product video')}</h2>
            <button type="button" class="video-dialog__close" data-video-close aria-label="${tt('Videoyu kapat', 'Close video')}">${icon('x')}</button>
          </div>
          <div class="media media--16x9"><video controls playsinline preload="none"></video></div>
          <div class="video-dialog__foot">
            <p class="video-dialog__text"></p>
            <p class="note video-dialog__meta"></p>
          </div>
        </dialog>`;
}

const certName = c => (L === 'en' ? c.nameEn : c.name);

// Ana sayfa: sertifika şeridi
function certStripHtml() {
  return `<div class="cert-strip reveal">
          <p class="cert-strip__label">${tt('Uluslararası sertifikalar', 'International certificates')}</p>
          <ul class="cert-strip__list">
            ${CERTS.map(c => `<li><span class="cert-strip__std">${esc(c.standard)}</span><span class="cert-strip__name">${esc(certName(c))}</span></li>`).join('\n            ')}
          </ul>
          <a href="kurumsal.html#sertifikalar" class="link-arrow">${tt('Sertifikaları inceleyin', 'View the certificates')} ${icon('arrow-right')}</a>
        </div>`;
}

// Kurumsal: sertifikalar bölümü. Önizlemeye tıklayınca büyük görsel bir <dialog> içinde açılır (PDF yayınlanmaz).
function certsHtml() {
  return `<div class="section-head reveal">
          <h2 id="certs-title">${tt('Sertifikalarımız', 'Our certificates')}</h2>
          <p class="lead">${tt(`Kalite, çevre ve kozmetikte iyi üretim uygulamaları alanlarındaki yönetim sistemlerimiz, ${esc(CERT_INFO.issuer.split(' (')[0])} tarafından uluslararası ISO standartlarına göre sertifikalandırılmıştır.`, `Our management systems for quality, the environment and good manufacturing practice in cosmetics are certified to international ISO standards by ${esc(CERT_INFO.issuer.split(' (')[0])}.`)}</p>
        </div>
        <ul class="cert-grid">
          ${CERTS.map(c => `<li class="cert-card reveal">
            <button type="button" class="cert-card__doc" data-image-open data-src="${c.image}-buyuk.jpg" data-webp="${c.image}-buyuk.webp" data-w="1240" data-h="1754" data-title="${esc(c.standard + ' ' + certName(c))}" aria-label="${esc(tt(`${c.standard} sertifikasını büyüt`, `Enlarge the ${c.standard} certificate`))}">
              <picture><source type="image/webp" srcset="${c.image}.webp 480w" sizes="(min-width: 900px) 300px, 92vw"><img src="${c.image}.jpg" alt=""${dims(c.image + '.jpg')} loading="lazy" decoding="async"></picture>
              <span class="zoom-chip" aria-hidden="true">${icon('magnifying-glass')}${tt('Büyüt', 'Enlarge')}</span>
            </button>
            <p class="cert-card__std">${esc(c.standard)}</p>
            <h3 class="cert-card__name">${esc(certName(c))}</h3>
            <dl class="cert-card__meta">
              <div><dt>${tt('Sertifika no', 'Certificate no.')}</dt><dd>${esc(c.number)}</dd></div>
              <div><dt>${tt('Geçerlilik tarihi', 'Valid until')}</dt><dd>${esc(CERT_INFO.validUntil)}</dd></div>
            </dl>
          </li>`).join('\n          ')}
        </ul>
        <dl class="cert-info reveal">
          <div><dt>${tt('Sertifika sahibi', 'Certificate holder')}</dt><dd>${esc(CERT_INFO.holder)}</dd></div>
          <div><dt>${tt('Sertifikayı veren kuruluş', 'Certification body')}</dt><dd>${esc(CERT_INFO.issuer)}</dd></div>
          <div><dt>${tt('Kapsam', 'Scope')}</dt><dd>${esc(L === 'en' ? CERT_INFO.scopeEn : CERT_INFO.scope)}</dd></div>
          <div><dt>${tt('Geçerlilik süresi', 'Validity')}</dt><dd>${esc(CERT_INFO.issued)} - ${esc(CERT_INFO.validUntil)}</dd></div>
        </dl>
        <p class="note mt-5">${tt(`Sertifikaların geçerliliği her yıl yapılan gözetim denetimleriyle sürdürülür. Güncel durum, sertifikayı veren kuruluştan (${esc(CERT_INFO.verifyEmail)}) teyit edilebilir.`, `The certificates are maintained through annual surveillance audits. Their current status can be confirmed with the certification body (${esc(CERT_INFO.verifyEmail)}).`)}</p>
        ${imageDialogHtml(tt('Sertifika', 'Certificate'))}`;
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
  let html = fs.readFileSync(path.join(SITE, OUT(file)), 'utf8');
  const jsonld = [...(cfg.jsonld || [])];
  if (cfg.crumbs) jsonld.push(breadcrumbLd([home(), { name: cfg.crumbs }]));
  if (cfg.itemList) {
    const listed = catalogOrder(PRODUCTS).filter(p => !p.soon);
    jsonld.push({ '@context': 'https://schema.org', '@type': 'ItemList', name: tt('Ürün kataloğu', 'Product catalogue'), numberOfItems: listed.length, itemListElement: listed.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: pageAbs(productUrl(p)), name: `${p.model} ${p.title}` })) });
  }
  html = html.replace(/^<!DOCTYPE html>\n(<!--[^\n]*-->\n)?/, '<!DOCTYPE html>\n<!-- Baş bölüm, üst menü ve alt bilgi tools/build.mjs ile yazılır; ana içerik elle düzenlenir. -->\n');
  html = html.replace(/<html[^>]*>/, `<html lang="${L}"${L === 'en' ? ' data-base="../"' : ''}>`);
  html = replaceBetween(html, /^<head>$/m, '\n</head>', head({ ...cfg, url: file, jsonld }).replace(/\n$/, ''), file);
  html = html.replace(/<body[^>]*>/, `<body data-section="${file}">`);
  html = html.replace(/<header class="site-header"[\s\S]*?<\/header>/, header({ dark: !!cfg.dark, file }));
  html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, footer());
  // Yalnızca esanslar yayındayken görünen öğeler (ana sayfa kısayolu, katalogdaki Esanslar sekmesi)
  html = html.replace(/(data-essence-only)(?: hidden)?/g, ESSENCES_LIVE ? '$1' : '$1 hidden');
  // Betik etiketleri dile göre yeniden yazılır (İngilizcede products.en.js eklenir)
  html = html.replace(/(?:[ \t]*<script src="(?:\.\.\/)?js\/[\w.-]+\.js(?:\?v=\w+)?"><\/script>\n?)+/, `  ${SCRIPTS()}\n`);
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
  write(file, html);
}

// ---------------------------------------------------------------------------
// sitemap.xml, robots.txt
// ---------------------------------------------------------------------------
function sitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(([u, lang, pr, imgs = []]) => `  <url>
    <loc>${pageAbs(u, lang)}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>${pr}</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${pageAbs(u, 'tr')}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${pageAbs(u, 'en')}"/>
${imgs.map(im => `    <image:image><image:loc>${abs(im)}</image:loc></image:image>\n`).join('')}  </url>`).join('\n')}
</urlset>
`;
}

// ---------------------------------------------------------------------------
// Çalıştır
// ---------------------------------------------------------------------------
const urls = [];
let pageCount = 0;
for (const lang of ['tr', 'en']) {
  setLang(lang);
  for (const [file, cfg] of Object.entries(HAND_PAGES())) { processHandPage(file, cfg); pageCount++; }
  for (const p of PRODUCTS) write(productUrl(p), productPage(p));
  write('blog.html', blogIndex());
  for (const post of POSTS) write(postUrl(post), blogPost(post));
  write('esanslar.html', ESSENCES_LIVE ? essencesPage() : essencesLockedPage());
  write('surdurulebilirlik.html', sustainabilityPage());
  write('sss.html', faqPage());
  write('404.html', notFoundPage());
  write('gizlilik.html', privacyPage());
  write('feed.xml', feed());

  urls.push(
    ...[['index.html', '1.0'], ['urunler.html', '0.9'], ['cozumler.html', '0.8'], ['teknoloji.html', '0.7'],
      ['kurumsal.html', '0.6'], ['iletisim.html', '0.7'], ['blog.html', '0.6'],
      ['surdurulebilirlik.html', '0.5'], ['sss.html', '0.6'], ['gizlilik.html', '0.2']].map(([u, pr]) => [u, lang, pr]),
    // Satışta olmayan ürünlerin sayfaları site haritasına alınmaz (noindex)
    ...PRODUCTS.filter(p => !p.soon).map(p => [productUrl(p), lang, '0.8', [imgPath(p), ...Array.from({ length: p.gallery || 0 }, (_, i) => imgPath(p, `-g${i + 1}`))]]),
    ...POSTS.map(p => [postUrl(p), lang, '0.6', [p.image]]),
    // Esans sayfası ve koku piramidi görselleri (aynı görseli paylaşan esanslar bir kez)
    ...(ESSENCES_LIVE ? [['esanslar.html', lang, '0.7', [...new Set(ESSENCES.map(e => `images/essences/${e.img}.jpg`))]]] : [])
  );
}
setLang('tr');
write('site.webmanifest', manifest());
write('sitemap.xml', sitemap(urls));
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Yazıldı (tr + en): ${pageCount} elle yazılmış sayfa güncellendi, ${PRODUCTS.length} ürün, ${POSTS.length} yazı, blog, esanslar, sürdürülebilirlik, sss, gizlilik, 404, feed.xml; site.webmanifest, sitemap (${urls.length} adres), robots. Sürümler: css ${VER.css}`);
