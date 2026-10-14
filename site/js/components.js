/**
 * Paylaşılan bileşenler ve durum: teklif listesi (sepet), çekmece, bildirim,
 * navigasyon, tema seçimi, iletişim formu, cihaz küratörü, atomizasyon simülatörü.
 * Görsel sınıflar DESIGN.md / css/style.css ile eşleşir.
 *
 * İki dil: metinler tt('Türkçe', 'English') ile yazılır; dil <html lang> değerinden okunur.
 * İngilizce sayfalar site/en/ altındadır; kök klasördeki dosyalara (görsel, API) <html data-base="../"> ile ulaşılır.
 */

(function (root) {
  const SITE_CFG = root.SITE || { brand: 'Meira', email: 'info@meirascent.com' };
  const EN = document.documentElement.lang === 'en';
  const tt = (tr, en) => (EN ? en : tr);
  const LOCALE = EN ? 'en-GB' : 'tr-TR';
  const BASE = document.documentElement.dataset.base || '';
  // Simge dosyasının sürümlü adresi sayfadaki ilk simgeden okunur (tools/build.mjs sürüm ekler)
  const ICONS = ((document.querySelector('use[href*="icons.svg"]') || {}).getAttribute?.('href') || `${BASE}images/icons.svg`).split('#')[0];
  // Teknik veri etiketleri iki dilde aranır (products.en.js etiketleri İngilizcedir)
  const RE_COV = /kapsama|coverage/i;
  const RE_CAP = /kapasite|capacity/i;
  const RE_NOISE = /^ses|^noise/i;

  function icon(name, cls) {
    return `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true" focusable="false"><use href="${ICONS}#i-${name}"></use></svg>`;
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function findProduct(id) {
    return (typeof PRODUCTS !== 'undefined') ? PRODUCTS.find(p => p.id === id) : null;
  }

  function productImage(p) {
    return `${BASE}images/${p.external ? 'general' : 'products'}/${p.img}.jpg`;
  }

  // Küçük ürün görseli: modern tarayıcıya 640 px WebP, diğerlerine özgün JPEG
  function productThumb(p, cls, extra) {
    const webp = p.external ? '' : `${BASE}images/products/w640/${p.img}.webp`;
    return `<picture>${webp ? `<source type="image/webp" srcset="${webp}">` : ''}<img src="${productImage(p)}" alt="" class="${cls || ''}" loading="lazy" decoding="async"${extra || ''}></picture>`;
  }

  function specValue(p, pattern) {
    const row = p.specs.find(s => pattern.test(s[0]));
    return row ? row[1] : '';
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // Modal ve çekmecede odağı içeride tutar
  function trapFocus(container, event) {
    if (event.key !== 'Tab') return;
    const items = Array.from(container.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // =========================================================================
  // 1. TEKLİF LİSTESİ (SEPET) DURUMU
  // =========================================================================
  const STORAGE_KEY = 'dc_quote_cart_v2';

  function getCart() {
    let cart = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Eski dizi formatını kontrol et
        const legacy = localStorage.getItem('dc_quote');
        if (legacy) {
          const arr = JSON.parse(legacy);
          cart = arr.map(id => ({ id, qty: 1 }));
        }
      } else {
        cart = JSON.parse(raw);
      }
    } catch (e) {
      cart = [];
    }
    if (!Array.isArray(cart)) return [];
    // Katalogda olmayan ve satışta olmayan (soon) kayıtları yok say (eski sürümden kalan kimlikler)
    if (typeof PRODUCTS !== 'undefined') {
      cart = cart.filter(item => { const p = item && findProduct(item.id); return p && !p.soon; });
    }
    return cart;
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage error', e);
    }
    window.dispatchEvent(new CustomEvent('dc:cart-updated', { detail: { cart } }));
  }

  function addToCart(productId, qty = 1) {
    const product = findProduct(productId);
    if (typeof PRODUCTS !== 'undefined' && !product) {
      toast.show({ message: tt('Bu ürün katalogda bulunamadı.', 'This product is not in the catalogue.'), type: 'error' });
      return;
    }
    if (product && product.soon) {
      toast.show({ message: tt('Bu ürün henüz satışta değil.', 'This product is not on sale yet.'), type: 'error' });
      return;
    }
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty: Math.max(1, qty) });
    }
    saveCart(cart);

    const name = product ? `${product.model} ${product.title}` : tt('Ürün', 'Product');
    toast.show({
      message: tt(`<strong>${esc(name)}</strong> teklif listesine eklendi.`, `<strong>${esc(name)}</strong> added to the quote list.`),
      type: 'accent'
    });
  }

  function updateCartQty(productId, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== productId);
      toast.show({ message: tt('Ürün teklif listesinden kaldırıldı.', 'Product removed from the quote list.'), type: 'info' });
    }
    saveCart(cart);
  }

  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== productId);
    saveCart(cart);
    toast.show({ message: tt('Ürün teklif listesinden çıkarıldı.', 'Product removed from the quote list.'), type: 'info' });
  }

  function clearCart() {
    saveCart([]);
    toast.show({ message: tt('Teklif listesi temizlendi.', 'Quote list cleared.'), type: 'info' });
  }

  function getCartTotalCount() {
    const cart = getCart();
    return cart.reduce((acc, cur) => acc + (cur.qty || 1), 0);
  }

  // Otomatik teklif mesaj metni oluşturucu. topic: iletişim formundaki konu (TOPICS); giriş cümlesi konuya göre değişir.
  function buildQuoteMessageText(topic = 'numune') {
    const cart = getCart();
    if (!cart.length || typeof PRODUCTS === 'undefined') return '';

    let text = tt(`Merhaba ${SITE_CFG.brand} Satış Ekibi,\n\n`, `Hello ${SITE_CFG.brand} Sales Team,\n\n`);
    text += `${(TOPICS[topic] || TOPICS.numune).intro}\n\n`;

    let line = 0;
    cart.forEach(item => {
      const p = findProduct(item.id);
      if (!p) return;
      line += 1;

      const cap = specValue(p, RE_CAP) || '-';
      const area = specValue(p, RE_COV) || '-';

      text += `${line}. [${p.model}] ${p.title}\n`;
      text += tt(`   - Talep adedi: ${item.qty} adet\n`, `   - Quantity: ${item.qty}\n`);
      text += tt(`   - Kapsama: ${area} | Kapasite: ${cap}\n\n`, `   - Coverage: ${area} | Capacity: ${cap}\n\n`);
    });

    return text.trimEnd() + '\n';
  }

  // =========================================================================
  // 2. BİLDİRİM (TOAST)
  // =========================================================================
  const toast = {
    show({ message, type = 'accent', duration = 3400 }) {
      let container = document.getElementById('dc-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'dc-toast-container';
        container.className = 'toast-container';
        container.setAttribute('role', 'status');
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
      }

      const el = document.createElement('div');
      el.className = 'toast';
      const glyph = type === 'error' ? 'warning-circle' : 'check';
      el.innerHTML = `
        <span class="toast-icon ${type}">${icon(glyph)}</span>
        <span class="toast-msg">${message}</span>
      `;

      container.appendChild(el);
      void el.offsetWidth; // başlangıç durumunu uygulat, giriş geçişi çalışsın
      el.classList.add('show');

      setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 200);
      }, duration);
    }
  };

  // =========================================================================
  // 3. TEKLİF LİSTESİ ÇEKMECESİ (animasyonsuz)
  // =========================================================================
  let drawerReturnFocus = null;

  function ensureDrawer() {
    let overlay = document.getElementById('dc-cart-drawer');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'dc-cart-drawer';
    overlay.className = 'drawer-overlay';
    overlay.innerHTML = `
      <div class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div class="drawer-header">
          <h2 id="drawer-title">${tt('Teklif listesi', 'Quote list')}</h2>
          <button type="button" class="icon-btn" id="dc-drawer-close" aria-label="${tt('Teklif listesini kapat', 'Close the quote list')}">${icon('x')}</button>
        </div>
        <div class="drawer-body" id="dc-drawer-items"></div>
        <div class="drawer-footer" id="dc-drawer-footer"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('#dc-drawer-close') || e.target.closest('#dc-btn-browse')) {
        closeDrawer();
      }
    });
    overlay.addEventListener('keydown', (e) => trapFocus(overlay.querySelector('.drawer-panel'), e));

    // Satır işlemleri: adet artır/azalt, kaldır
    overlay.querySelector('#dc-drawer-items').addEventListener('click', (e) => {
      const row = e.target.closest('.drawer-item');
      const control = e.target.closest('[data-act]');
      if (!row || !control) return;
      const id = row.dataset.id;
      const act = control.dataset.act;
      if (act === 'plus') updateCartQty(id, 1);
      else if (act === 'minus') updateCartQty(id, -1);
      else if (act === 'remove') removeFromCart(id);
      restoreDrawerFocus(id, act);
    });

    overlay.querySelector('#dc-drawer-footer').addEventListener('click', (e) => {
      if (e.target.closest('#dc-btn-go-quote')) {
        closeDrawer();
        window.location.href = 'iletisim.html?teklif=1';
      } else if (e.target.closest('#dc-btn-clear-cart')) {
        clearCart();
        document.getElementById('dc-drawer-close')?.focus();
      }
    });

    return overlay;
  }

  // Liste yeniden çizildikten sonra odağı aynı kontrole (yoksa kapat butonuna) taşır
  function restoreDrawerFocus(id, act) {
    const overlay = document.getElementById('dc-cart-drawer');
    if (!overlay || !overlay.classList.contains('open')) return;
    const target = overlay.querySelector(`.drawer-item[data-id="${CSS.escape(id)}"] [data-act="${act}"]`)
      || overlay.querySelector('.drawer-item [data-act="remove"]')
      || document.getElementById('dc-drawer-close');
    target?.focus();
  }

  function renderDrawer() {
    const overlay = ensureDrawer();
    const itemsContainer = overlay.querySelector('#dc-drawer-items');
    const footerContainer = overlay.querySelector('#dc-drawer-footer');
    const cart = getCart();

    if (!cart.length || typeof PRODUCTS === 'undefined') {
      itemsContainer.innerHTML = `
        <div class="drawer-empty-state">
          <h3>${tt('Listeniz boş', 'Your list is empty')}</h3>
          <p>${tt('Katalogdan cihaz ekleyerek tek seferde teklif isteyebilirsiniz.', 'Add devices from the catalogue and request a quote for all of them at once.')}</p>
        </div>
      `;
      footerContainer.innerHTML = `
        <a href="urunler.html" class="btn btn--quiet btn--block" id="dc-btn-browse">${tt('Ürünleri incele', 'Browse products')}</a>
      `;
      return;
    }

    itemsContainer.innerHTML = cart.map(item => {
      const p = findProduct(item.id);
      if (!p) return '';
      return `
        <div class="drawer-item" data-id="${esc(p.id)}">
          ${productThumb(p, 'drawer-item-img')}
          <div class="drawer-item-info">
            <span class="drawer-item-model">${esc(p.model)}</span>
            <div class="drawer-item-title">${esc(p.title)}</div>
          </div>
          <button type="button" class="icon-btn drawer-item-remove" data-act="remove" aria-label="${esc(tt(`${p.model} ürününü listeden kaldır`, `Remove ${p.model} from the list`))}">${icon('trash')}</button>
          <div class="qty-controls" role="group" aria-label="${esc(tt(`${p.model} adedi`, `${p.model} quantity`))}">
            <button type="button" class="qty-btn" data-act="minus" aria-label="${tt('Adedi azalt', 'Decrease quantity')}">${icon('minus')}</button>
            <span class="qty-val">${item.qty}</span>
            <button type="button" class="qty-btn" data-act="plus" aria-label="${tt('Adedi artır', 'Increase quantity')}">${icon('plus')}</button>
          </div>
        </div>
      `;
    }).join('');

    const total = getCartTotalCount();
    footerContainer.innerHTML = `
      <button type="button" class="btn btn--primary btn--lg btn--block" id="dc-btn-go-quote">
        <span>${tt('Teklif formuna aktar', 'Transfer to quote form')}</span>
        ${icon('arrow-right', 'icon--move')}
      </button>
      <div class="drawer-footer__meta">
        <span class="num">${tt(`${cart.length} model, toplam ${total} adet`, `${cart.length} ${cart.length === 1 ? 'model' : 'models'}, ${total} ${total === 1 ? 'unit' : 'units'} in total`)}</span>
        <button type="button" id="dc-btn-clear-cart">${tt('Listeyi temizle', 'Clear list')}</button>
      </div>
    `;
  }

  function openDrawer() {
    renderDrawer();
    const overlay = document.getElementById('dc-cart-drawer');
    if (!overlay) return;
    drawerReturnFocus = document.activeElement;
    closeMobileMenu();
    // Açık bildirimler çekmecenin üzerinde kalmasın
    document.querySelectorAll('#dc-toast-container .toast').forEach(t => t.remove());
    void overlay.offsetWidth; // yeni oluşturulduysa giriş geçişi için başlangıç durumunu uygulat
    overlay.classList.add('open');
    document.body.classList.add('is-locked');
    document.getElementById('dc-drawer-close')?.focus();
  }

  function closeDrawer() {
    const overlay = document.getElementById('dc-cart-drawer');
    if (!overlay || !overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    document.body.classList.remove('is-locked');
    if (drawerReturnFocus && document.contains(drawerReturnFocus)) drawerReturnFocus.focus();
    drawerReturnFocus = null;
  }

  let lastBadgeTotal = null;
  let flyArrival = 0; // uçan nokta rozete ne zaman varacak (ms, performance.now)
  function bumpBadge(b) {
    if (reduceMotion.matches || !b.animate) return;
    b.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.28)' }, { transform: 'scale(1)' }],
      { duration: 280, easing: EASE_OUT }
    );
  }
  function updateBadge() {
    const total = getCartTotalCount();
    const grew = lastBadgeTotal !== null && total > lastBadgeTotal;
    lastBadgeTotal = total;
    const wait = Math.max(0, flyArrival - performance.now());
    document.querySelectorAll('.dc-cart-count').forEach(b => {
      b.textContent = total;
      b.classList.toggle('empty', total === 0);
      // Liste büyüdüğünde rozet kısa bir büyüme yapar: eklenen ürünün nereye gittiğini gösterir.
      // Uçan nokta varsa büyüme, nokta rozete vardığı anda olur.
      if (grew) { if (wait) setTimeout(() => bumpBadge(b), wait); else bumpBadge(b); }
    });
    document.querySelectorAll('.quote-trigger').forEach(btn => {
      btn.setAttribute('aria-label', tt(`Teklif listesi, ${total} adet ürün`, `Quote list, ${total} ${total === 1 ? 'item' : 'items'}`));
    });
  }

  // Listeye ekleme butonları 1,6 s boyunca "Eklendi" durumuna geçer (geri bildirim tıklanan yerde).
  // Butonların kendi tıklama işleyicileri değişmez; bu dinleyici yalnızca görünümü günceller.
  const ADD_SELECTOR = '[data-act="add-quote"], [data-add], [data-add-product], [data-add-to-list]';
  // Butondan başlıktaki sayaca uçan şampanya nokta: eklenen ürünün nereye gittiğini gösterir.
  // Yatay hareket ease-out, dikey hareket ease-in-out: iki ayrı eğri yolu hafifçe kavisli yapar.
  // Klavyeyle tetiklenen eklemede (event.detail === 0) ve azaltılmış harekette kullanılmaz.
  const FLY_MS = 620;
  function flyToCart(fromEl) {
    if (reduceMotion.matches) return;
    const target = Array.from(document.querySelectorAll('.quote-trigger .quote-badge')).find(el => el.offsetParent !== null);
    if (!target || !document.body.animate) return;
    const a = fromEl.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    if (!b.width || !a.width) return;
    const outer = document.createElement('span');
    const dot = document.createElement('span');
    outer.setAttribute('aria-hidden', 'true');
    outer.style.cssText = `position:fixed;left:${a.left + a.width / 2 - 7}px;top:${a.top + a.height / 2 - 7}px;z-index:var(--z-toast);pointer-events:none;`;
    dot.className = 'fly-dot';
    dot.style.position = 'static';
    dot.style.display = 'block'; // transform satır içi öğeye uygulanmaz
    outer.appendChild(dot);
    document.body.appendChild(outer);
    const dx = (b.left + b.width / 2) - (a.left + a.width / 2);
    const dy = (b.top + b.height / 2) - (a.top + a.height / 2);
    outer.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], { duration: FLY_MS, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' });
    const anim = dot.animate([
      { transform: 'translateY(0) scale(0.4)', opacity: 0 },
      { transform: `translateY(${dy * 0.35}px) scale(1)`, opacity: 1, offset: 0.25 },
      { transform: `translateY(${dy}px) scale(0.55)`, opacity: 1 }
    ], { duration: FLY_MS, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', fill: 'forwards' });
    flyArrival = performance.now() + FLY_MS - 40;
    anim.onfinish = () => outer.remove();
  }

  function confirmAdded(btn) {
    const label = btn.querySelector('span');
    const use = btn.querySelector('use');
    if (!btn.dataset.label && label) btn.dataset.label = label.textContent;
    if (!btn.dataset.icon && use) btn.dataset.icon = use.getAttribute('href');
    clearTimeout(btn._addedTimer);
    btn.classList.add('is-added');
    if (label) label.textContent = tt('Eklendi', 'Added');
    if (use) use.setAttribute('href', `${ICONS}#i-check`);
    btn._addedTimer = setTimeout(() => {
      btn.classList.remove('is-added');
      if (label && btn.dataset.label) label.textContent = btn.dataset.label;
      if (use && btn.dataset.icon) use.setAttribute('href', btn.dataset.icon);
    }, 1600);
  }
  // Ürün sayfası düğmeleri: [data-add-to-list] listeye ekler, [data-quote-now] ekleyip forma gider
  function initProductActions() {
    document.addEventListener('click', (e) => {
      const add = e.target.closest('[data-add-to-list]');
      if (add) { addToCart(add.dataset.addToList, 1); return; }
      const quote = e.target.closest('[data-quote-now]');
      if (quote) {
        const id = quote.dataset.quoteNow;
        if (!getCart().some(i => i.id === id)) addToCart(id, 1);
        window.location.href = 'iletisim.html?teklif=1';
      }
    });
  }

  // Ürün galerisi: küçük görsel seçimi ve tıklanan noktadan 2x yakınlaştırma
  function initGallery() {
    document.querySelectorAll('[data-gallery]').forEach(gallery => {
      const zoom = gallery.querySelector('[data-zoom]');
      const main = gallery.querySelector('[data-main]');
      if (!zoom || !main) return;
      function setZoom(on, x = 50, y = 50) {
        if (on) main.style.transformOrigin = `${x}% ${y}%`;
        zoom.classList.toggle('is-zoomed', on);
        zoom.setAttribute('aria-pressed', String(on));
        zoom.setAttribute('aria-label', on ? tt('Yakınlaştırmayı kapat', 'Zoom out') : tt('Görseli yakınlaştır', 'Zoom image'));
      }
      zoom.addEventListener('click', (e) => {
        const on = !zoom.classList.contains('is-zoomed');
        if (on && e.detail > 0) {
          const r = zoom.getBoundingClientRect();
          setZoom(true, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
        } else {
          setZoom(on);
        }
      });
      gallery.querySelectorAll('.modal-thumb').forEach(thumb => {
        thumb.addEventListener('click', (e) => {
          setZoom(false);
          main.src = thumb.dataset.src;
          main.style.objectPosition = thumb.dataset.pos || 'center';
          gallery.querySelectorAll('.modal-thumb').forEach(t => {
            const on = t === thumb;
            t.classList.toggle('active', on);
            t.setAttribute('aria-pressed', String(on));
          });
          // Fareyle seçimde kısa opaklık + bulanıklık köprüsü; klavyede (detail 0) animasyon yok
          if (e.detail > 0 && main.animate) {
            main.animate(
              reduceMotion.matches
                ? [{ opacity: 0.5 }, { opacity: 1 }]
                : [{ opacity: 0.4, filter: 'blur(3px)' }, { opacity: 1, filter: 'blur(0)' }],
              { duration: 200, easing: EASE_OUT }
            );
          }
        });
      });
    });
  }

  function initAddFeedback() {
    // Yakalama aşaması: katalog kartı stopPropagation kullandığı için kabarcık aşamasına ulaşmaz
    document.addEventListener('click', (e) => {
      const btn = e.target.closest(ADD_SELECTOR);
      if (!btn || btn.disabled) return;
      if (e.detail > 0) flyToCart(btn);
      confirmAdded(btn);
    }, true);
  }

  // =========================================================================
  // 4. TEMA (açık varsayılan; koyu tema seçilirse localStorage['meira-theme'] = 'dark')
  // İlk boyamadan önceki karar <head> içindeki küçük betikte verilir (tools/build.mjs BOOT_SCRIPT).
  // =========================================================================
  function initTheme() {
    const html = document.documentElement;
    const buttons = Array.from(document.querySelectorAll('[data-theme-toggle]'));
    if (!buttons.length) return;
    const sync = () => {
      const dark = html.dataset.theme === 'dark';
      buttons.forEach(b => b.setAttribute('aria-pressed', String(dark)));
    };
    buttons.forEach(btn => btn.addEventListener('click', () => {
      const dark = html.dataset.theme !== 'dark';
      // Geçiş anında renk geçişleri kapatılır: tüm sayfa tek karede yeni temaya geçer
      html.classList.add('theme-switching');
      if (dark) html.dataset.theme = 'dark';
      else delete html.dataset.theme;
      try { localStorage.setItem('meira-theme', dark ? 'dark' : 'light'); } catch (e) { /* gizli mod vb. */ }
      sync();
      requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('theme-switching')));
    }));
    sync();
  }

  // =========================================================================
  // 5. BAŞLIK, MENÜ, AKTİF SAYFA
  // =========================================================================
  function closeMobileMenu() {
    const burger = document.getElementById('burgerBtn');
    const navLinks = document.getElementById('navLinks');
    if (!navLinks || !navLinks.classList.contains('mobile-open')) return;
    navLinks.classList.remove('mobile-open');
    burger?.setAttribute('aria-expanded', 'false');
    document.querySelector('.site-header')?.classList.remove('menu-open');
    document.body.classList.remove('is-locked');
  }

  function initNavigation() {
    // Ürün ve blog sayfaları kendi bölümlerini <body data-section> ile bildirir
    const path = document.body.dataset.section || window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === path;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    const burger = document.getElementById('burgerBtn');
    const navLinks = document.getElementById('navLinks');
    const header = document.querySelector('.site-header');
    if (burger && navLinks) {
      burger.addEventListener('click', () => {
        const open = !navLinks.classList.contains('mobile-open');
        navLinks.classList.toggle('mobile-open', open);
        burger.setAttribute('aria-expanded', String(open));
        header?.classList.toggle('menu-open', open);
        document.body.classList.toggle('is-locked', open);
      });
      navLinks.addEventListener('click', (e) => {
        if (e.target.closest('a')) closeMobileMenu();
      });
      const desktop = window.matchMedia('(min-width: 1100px)');
      desktop.addEventListener('change', (e) => { if (e.matches) closeMobileMenu(); });
    }

    document.querySelectorAll('.quote-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    });

    // Başlık zemin durumu: scroll dinleyicisi yerine IntersectionObserver
    if (header && 'IntersectionObserver' in window) {
      const sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:24px;pointer-events:none;';
      document.body.prepend(sentinel);
      new IntersectionObserver(([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
      }).observe(sentinel);
    }
  }

  // =========================================================================
  // 6. İLETİŞİM SAYFASI: FORM DOLDURMA, DOĞRULAMA, GÖNDERİM
  // =========================================================================
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setFieldError(field, message) {
    const errorEl = document.getElementById(field.getAttribute('aria-describedby')?.split(' ').find(id => id.startsWith('err-')) || '');
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      if (errorEl) {
        errorEl.innerHTML = `${icon('warning-circle')}<span>${esc(message)}</span>`;
        errorEl.hidden = false;
      }
    } else {
      field.removeAttribute('aria-invalid');
      if (errorEl) {
        errorEl.hidden = true;
        errorEl.textContent = '';
      }
    }
  }

  // Onay kutusunun value'su hep doludur; dolu sayılması için işaretli olmalı
  const isFilled = field => (field.type === 'checkbox' ? field.checked : Boolean(field.value.trim()));

  function validateField(field) {
    const value = field.value.trim();
    if (field.required && !isFilled(field)) {
      setFieldError(field, field.dataset.requiredMsg || tt('Lütfen bu alanı doldurun.', 'Please fill in this field.'));
      return false;
    }
    if (field.type === 'email' && value && !EMAIL_RE.test(value)) {
      setFieldError(field, tt('Lütfen geçerli bir e-posta adresi girin (ör. ad@firma.com).', 'Please enter a valid email address (e.g. name@company.com).'));
      return false;
    }
    setFieldError(field, '');
    return true;
  }

  // Form konuları. value: arka uçtaki (api/send-quote.php) Türkçe konu listesiyle aynı değer.
  // Seçilen konuya göre açıklama, ürün bölümünün başlığı, mesaj örneği, e-postadaki giriş cümlesi ve düğme metni değişir.
  // project: proje bilgileri bölümü gösterilsin mi (open: açık gelsin); extra: seçilince işaretlenen ek istek
  const TOPICS = {
    numune: {
      value: 'Fiyat ve Numune Teklifi', project: true,
      title: tt('Fiyat ve numune teklifi', 'Price and sample quote'),
      text: tt('Seçtiğiniz ürünler için birim fiyat, stok durumu ve teslim süresi içeren bir teklif hazırlarız.', 'We prepare a quote with unit prices, availability and delivery times for the products you choose.'),
      items: tt('Teklif istenen ürünler', 'Products to quote'),
      placeholder: tt('Teslim tarihi, adet ya da sormak istediğiniz diğer konular', 'Delivery date, quantities or anything else you would like to ask'),
      intro: tt('Aşağıda listelediğim ürünler için birim fiyat, stok durumu ve teslimat süresi içeren bir teklif rica ediyorum:', 'I would like a quote with unit prices, availability and delivery times for the products listed below:'),
      submit: tt('Teklif iste', 'Request a quote')
    },
    bayilik: {
      value: 'Toptan Satış & Bayilik', project: false,
      title: tt('Toptan satış ve bayilik', 'Wholesale and dealership'),
      text: tt('Bölgenizi, satış kanallarınızı ve tahmini yıllık adedi paylaşmanız halinde toptan fiyatları ve bayilik koşullarını iletiriz.', 'Share your region, sales channels and estimated yearly volume, and we will send our wholesale prices and dealership terms.'),
      items: tt('İlgilendiğiniz ürünler', 'Products you are interested in'),
      placeholder: tt('Firmanız, bölgeniz, satış kanallarınız ve tahmini adetler', 'Your company, region, sales channels and estimated quantities'),
      intro: tt('Bayilik koşulları ve aşağıdaki ürünler için toptan fiyat bilgisi rica ediyorum:', 'I would like your dealership terms and wholesale prices for the products below:'),
      submit: tt('Başvuruyu gönder', 'Send application')
    },
    oem: {
      value: 'Özel Markalı Üretim (OEM/ODM)', project: false,
      title: tt('Özel markalı üretim (OEM / ODM)', 'Private-label production (OEM / ODM)'),
      text: tt('Logo baskısı, renk, ambalaj ya da markanıza özel koku talebinizi üreticiye iletir, süreci sizin adınıza takip ederiz.', 'We pass your request for logo printing, colours, packaging or a brand scent to the manufacturer and follow the process on your behalf.'),
      items: tt('OEM için düşündüğünüz ürünler', 'Products you are considering for OEM'),
      placeholder: tt('Logo ve renk, ambalaj, hedef adet ve tarih', 'Logo and colours, packaging, target quantity and date'),
      intro: tt('Aşağıdaki ürünlerin özel markalı (OEM) üretimi için bilgi ve teklif rica ediyorum:', 'I would like information and a quote for private-label (OEM) production of the products below:'),
      submit: tt('Talebi gönder', 'Send request')
    },
    hvac: {
      value: 'Merkezi Klima (HVAC) Projelendirme', project: true, open: true, extra: 'Klima (HVAC) bağlantısı',
      title: tt('Klima (HVAC) projesi', 'HVAC project'),
      text: tt('Alanın ölçülerini ve klima santrali bilgisini paylaşmanız halinde binanın havalandırmasına bağlanan bir kurulum öneririz.', 'Share the size of the space and details of the air handling units, and we will suggest an installation connected to the building\'s ventilation.'),
      items: tt('Proje için düşündüğünüz ürünler', 'Products you are considering for the project'),
      placeholder: tt('Kat planı, santral sayısı ve konumu, çalışma saatleri', 'Floor plan, number and location of air handling units, operating hours'),
      intro: tt('Klima sistemine bağlanacak bir proje için aşağıdaki ürünlerle ilgili teklif rica ediyorum:', 'I would like a quote for the products below for a project connected to the HVAC system:'),
      submit: tt('Proje teklifi iste', 'Request a project quote')
    },
    destek: {
      value: 'Teknik Destek ve Servis', project: false,
      title: tt('Teknik destek', 'Technical support'),
      text: tt('Cihazınızın modelini ve yaşadığınız sorunu kısaca yazmanız halinde en kısa sürede dönüş yaparız.', 'Briefly describe your device and the problem, and we will get back to you as soon as possible.'),
      items: tt('Destek istediğiniz cihaz', 'Device you need help with'),
      placeholder: tt('Cihaz modeli, satın alma tarihi ve sorunun kısa tanımı', 'Device model, purchase date and a short description of the problem'),
      intro: tt('Aşağıdaki cihazlar için teknik destek rica ediyorum:', 'I would like technical support for the devices below:'),
      submit: tt('Destek iste', 'Request support')
    }
  };

  // Mekân tipine göre kısa yönlendirme (değerler arka uçtaki Türkçe listeyle aynı)
  const SPACE_HINTS = {
    'Otel ve konaklama': tt('Lobi, koridor ve odaları ayrı ayrı belirtmeniz halinde her alan için uygun cihazı öneririz.', 'If you list the lobby, corridors and rooms separately, we will suggest a device for each.'),
    'Mağaza ve showroom': tt('Lütfen satış alanının ölçüsünü ve giriş kapısının sık açılıp açılmadığını belirtin.', 'Please give the size of the sales floor and whether the entrance door opens often.'),
    'Ofis ve plaza': tt('Toplantı odalarını ve açık ofisi ayrı belirtmeniz halinde sessiz çalışan modelleri öneririz.', 'If you list meeting rooms and the open-plan office separately, we will suggest quiet models.'),
    'Restoran ve kafe': tt('Yemek kokusuyla yarışmaması için genellikle yalnızca giriş ve bekleme alanı için öneri yaparız.', 'So that it does not compete with the food, we usually suggest scenting only the entrance and waiting area.'),
    'Spa ve güzellik salonu': tt('Kabin ve oda sayısını belirtmeniz halinde cihaz adedini birlikte hesaplarız.', 'If you give the number of cabins and rooms, we will work out the number of devices together.'),
    'AVM ve ortak alan': tt('Büyük ve bölmeli alanlarda klima (HVAC) bağlantısı genellikle daha dengeli sonuç verir.', 'In large, partitioned spaces an HVAC connection usually gives a more even result.'),
    'Sağlık ve klinik': tt('Bekleme alanları için düşük yoğunlukta, hafif kokular öneririz.', 'For waiting areas we recommend light scents at low intensity.'),
    'Konut': tt('Oda sayısını belirtmeniz halinde masaüstü ve duvar tipi modeller arasından öneri yaparız.', 'If you give the number of rooms, we will suggest tabletop or wall models.'),
    'Diğer': tt('Lütfen mekânınızı kısaca tanımlayın.', 'Please briefly describe your space.')
  };

  // Kapsama metnindeki en yüksek m³ değeri (m² ile verilen değerler hacim karşılaştırmasına alınmaz)
  function maxCoverage(p) {
    const s = specValue(p, RE_COV);
    if (!/m³/.test(s)) return 0;
    const nums = (s.match(/\d[\d.,]*/g) || []).map(n => parseInt(n.replace(/[.,]/g, ''), 10)).filter(Boolean);
    return nums.length ? Math.max(...nums) : 0;
  }

  function initContactPage() {
    const form = document.getElementById('contactForm');
    const messageField = document.getElementById('contactMessage');
    if (!form || !messageField) return;

    const urlParams = new URLSearchParams(window.location.search);
    const topicInputs = Array.from(form.querySelectorAll('[name="subject"]'));
    const introText = document.getElementById('formIntroText');
    const itemsTitle = document.getElementById('itemsTitle');
    const itemList = document.getElementById('formItemList');
    const itemSelect = document.getElementById('itemSelect');
    const itemAddBtn = document.getElementById('itemAddBtn');
    const projectDetails = document.getElementById('projectDetails');
    const summary = document.getElementById('formSummary');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn?.querySelector('span');

    const currentTopic = () => (topicInputs.find(i => i.checked) || topicInputs[0])?.dataset.topic || 'numune';
    const countText = n => tt(`${n} ürün`, `${n} ${n === 1 ? 'item' : 'items'}`);

    // ?konu=oem|numune|hvac|destek|bayilik
    const konu = urlParams.get('konu');
    if (konu && TOPICS[konu]) topicInputs.forEach(i => { i.checked = i.dataset.topic === konu; });

    // Konunun ek isteğini işaretler (ör. HVAC projesi -> "Klima (HVAC) bağlantısı"); kullanıcı sonra kaldırabilir
    function applyTopicExtra() {
      const t = TOPICS[currentTopic()];
      if (!t.extra) return;
      const chip = form.querySelector(`[name="extras[]"][value="${CSS.escape(t.extra)}"]`);
      if (chip) chip.checked = true;
    }

    // Ürün ekleme listesi: yalnızca satıştaki ürünler (products.js catalogOrder sırasıyla)
    if (itemSelect && typeof PRODUCTS !== 'undefined') {
      const available = (typeof catalogOrder === 'function' ? catalogOrder(PRODUCTS) : PRODUCTS).filter(p => !p.soon);
      itemSelect.insertAdjacentHTML('beforeend', available.map(p => `<option value="${esc(p.id)}">${esc(p.model)} · ${esc(p.title)}</option>`).join(''));
    }
    itemAddBtn?.addEventListener('click', () => {
      if (!itemSelect.value) {
        itemSelect.focus();
        toast.show({ message: tt('Lütfen listeden bir ürün seçin.', 'Please choose a product from the list.'), type: 'info' });
        return;
      }
      addToCart(itemSelect.value, 1);
      itemSelect.value = '';
    });

    // Seçili ürünler: adet artır/azalt ve kaldır doğrudan formda (teklif listesiyle aynı veri)
    function renderItems() {
      if (!itemList) return;
      const cart = getCart();
      if (!cart.length) {
        itemList.innerHTML = `<li class="item-list__empty">${tt('Henüz ürün eklenmedi. Aşağıdan ekleyebilir ya da <a href="urunler.html" class="text-link">kataloğu inceleyebilirsiniz</a>.', 'No products added yet. Add one below or <a href="urunler.html" class="text-link">browse the catalogue</a>.')}</li>`;
        return;
      }
      itemList.innerHTML = cart.map(item => {
        const p = findProduct(item.id);
        if (!p) return '';
        return `<li class="item-row" data-id="${esc(p.id)}">
          ${productThumb(p, 'item-row__img')}
          <span class="item-row__info"><span class="item-row__model">${esc(p.model)}</span><span class="item-row__name">${esc(p.title)}</span></span>
          <span class="qty-controls" role="group" aria-label="${esc(tt(`${p.model} adedi`, `${p.model} quantity`))}">
            <button type="button" class="qty-btn" data-item-act="minus" aria-label="${tt('Adedi azalt', 'Decrease quantity')}">${icon('minus')}</button>
            <span class="qty-val">${item.qty}</span>
            <button type="button" class="qty-btn" data-item-act="plus" aria-label="${tt('Adedi artır', 'Increase quantity')}">${icon('plus')}</button>
          </span>
          <button type="button" class="icon-btn item-row__remove" data-item-act="remove" aria-label="${esc(tt(`${p.model} ürününü kaldır`, `Remove ${p.model}`))}">${icon('trash')}</button>
        </li>`;
      }).join('');
    }
    itemList?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-item-act]');
      const row = e.target.closest('.item-row');
      if (!btn || !row) return;
      const id = row.dataset.id;
      const act = btn.dataset.itemAct;
      if (act === 'plus') updateCartQty(id, 1);
      else if (act === 'minus') updateCartQty(id, -1);
      else removeFromCart(id);
      // Yeniden çizimden sonra odak aynı kontrolde kalır (yoksa ekleme listesine geçer)
      (itemList.querySelector(`.item-row[data-id="${CSS.escape(id)}"] [data-item-act="${act}"]`) || itemSelect)?.focus();
    });

    // Konuya ve seçili ürünlere göre değişen metinler
    function renderTexts() {
      const t = TOPICS[currentTopic()];
      const total = getCartTotalCount();
      if (introText) introText.textContent = t.text;
      if (itemsTitle) itemsTitle.textContent = t.items;
      messageField.placeholder = t.placeholder;
      if (submitLabel) submitLabel.textContent = t.submit;
      if (summary) {
        summary.innerHTML = total
          ? `<strong>${countText(total)}</strong> · ${esc(t.title)}`
          : `${esc(t.title)} · ${tt('ürün seçilmedi', 'no products selected')}`;
      }
      if (projectDetails) projectDetails.hidden = !t.project;
    }

    topicInputs.forEach(input => input.addEventListener('change', () => {
      applyTopicExtra();
      const t = TOPICS[currentTopic()];
      if (t.open && projectDetails) projectDetails.open = true;
      renderTexts();
      updateVolume();
    }));

    // Proje bilgileri: mekân tipi ("Diğer" seçilince serbest metin), ölçüler, ek istekler
    const spaceSelect = form.querySelector('[name="space_type"]');
    const spaceOther = form.querySelector('[data-space-other]');
    const spaceOtherInput = form.querySelector('[name="space_type_other"]');
    const spaceHint = document.getElementById('spaceHint');
    const areaInput = form.querySelector('[name="area"]');
    const heightInput = form.querySelector('[name="height"]');
    const volumeOut = document.getElementById('projectVolume');

    function syncSpace() {
      if (!spaceSelect) return;
      const isOther = spaceSelect.value === 'Diğer';
      if (spaceOther) spaceOther.hidden = !isOther;
      if (!isOther && spaceOtherInput) spaceOtherInput.value = '';
      if (spaceHint) {
        const hint = SPACE_HINTS[spaceSelect.value] || '';
        spaceHint.textContent = hint;
        spaceHint.hidden = !hint;
      }
    }
    spaceSelect?.addEventListener('change', () => {
      syncSpace();
      if (spaceSelect.value === 'Diğer') spaceOtherInput?.focus();
    });

    // Boş bırakılabilir; doluysa sınırlar içinde bir sayı olmalı
    function numValue(input) {
      const raw = (input?.value || '').trim();
      if (!raw) return null;
      const n = Number(raw.replace(',', '.'));
      return Number.isFinite(n) ? n : NaN;
    }
    const fmtNum = n => n.toLocaleString(LOCALE);
    function validateNumber(input, label) {
      if (!input) return true;
      const n = numValue(input);
      if (input.validity.badInput || Number.isNaN(n)) {
        setFieldError(input, tt(`Lütfen ${label.toLocaleLowerCase('tr')} için bir sayı girin.`, `Please enter a number for ${label.toLowerCase()}.`));
        return false;
      }
      const min = Number(input.min), max = Number(input.max);
      if (n !== null && (n < min || n > max)) {
        setFieldError(input, tt(`Lütfen ${fmtNum(min)} ile ${fmtNum(max)} arasında bir değer girin.`, `Please enter a value between ${fmtNum(min)} and ${fmtNum(max)}.`));
        return false;
      }
      setFieldError(input, '');
      return true;
    }
    // Hacim ve bu hacmi karşılayan, kapsaması en yakın satıştaki model (hesaplayıcıyla aynı kural)
    function updateVolume() {
      if (!volumeOut) return;
      const a = numValue(areaInput), h = numValue(heightInput);
      if (!(a > 0 && h > 0)) { volumeOut.hidden = true; volumeOut.innerHTML = ''; return; }
      const vol = Math.round(a * h);
      const best = (typeof PRODUCTS === 'undefined' ? [] : PRODUCTS)
        .filter(p => !p.soon)
        .map(p => ({ p, cov: maxCoverage(p) }))
        .filter(x => x.cov >= vol)
        .sort((x, y) => x.cov - y.cov)[0];
      const inCart = best && getCart().some(i => i.id === best.p.id);
      volumeOut.innerHTML = `<span>${tt('Yaklaşık hava hacmi', 'Approximate air volume')}: <strong>${fmtNum(vol)} m³</strong></span>`
        + (best
          ? `<span class="form-volume__suggest">${tt('Önerilen model', 'Suggested model')}: <a href="urun-${encodeURIComponent(best.p.id)}.html">${esc(best.p.model)}</a> · ${esc(specValue(best.p, RE_COV))}
              ${inCart ? `<span class="form-volume__in">${icon('check')}${tt('Eklendi', 'Added')}</span>` : `<button type="button" class="inline-action" data-add-product="${esc(best.p.id)}">${tt('Ürünlere ekle', 'Add to products')}</button>`}</span>`
          : `<span class="form-volume__suggest">${tt('Bu hacim için birden fazla cihaz ya da klima (HVAC) bağlantılı bir kurulum gerekir.', 'This volume needs several devices or an HVAC-connected installation.')}</span>`);
      volumeOut.hidden = false;
    }
    volumeOut?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add-product]');
      if (btn) addToCart(btn.dataset.addProduct, 1);
    });
    const AREA_LABEL = tt('Taban alanı', 'Floor area');
    const HEIGHT_LABEL = tt('Tavan yüksekliği', 'Ceiling height');
    [[areaInput, AREA_LABEL], [heightInput, HEIGHT_LABEL]].forEach(([input, label]) => {
      if (!input) return;
      input.addEventListener('input', () => { updateVolume(); if (input.hasAttribute('aria-invalid')) validateNumber(input, label); });
      input.addEventListener('blur', () => validateNumber(input, label));
    });

    // Hesaplayıcıdan gelen ölçüler (ör. ?alan=150&tavan=3.2); proje bölümü açık gelir
    const alanParam = Number(urlParams.get('alan'));
    const tavanParam = Number(urlParams.get('tavan'));
    if (areaInput && alanParam > 0) areaInput.value = String(alanParam);
    if (heightInput && tavanParam > 0) heightInput.value = String(tavanParam);
    if (projectDetails && (alanParam > 0 || tavanParam > 0 || TOPICS[currentTopic()].open)) projectDetails.open = true;
    if (konu) applyTopicExtra();

    syncSpace();
    renderTexts();
    renderItems();
    updateVolume();
    window.addEventListener('dc:cart-updated', () => { renderItems(); renderTexts(); updateVolume(); });

    function projectData() {
      const t = TOPICS[currentTopic()];
      const extras = Array.from(form.querySelectorAll('[name="extras[]"]:checked')).map(el => el.value);
      if (!t.project) return { space_type: '', space_type_other: '', area: '', height: '', extras: [] };
      return {
        space_type: spaceSelect?.value || '',
        space_type_other: spaceOtherInput?.value.trim() || '',
        area: (areaInput?.value || '').trim(),
        height: (heightInput?.value || '').trim(),
        extras
      };
    }

    // E-postaya giden mesaj: seçili ürünler (konuya göre giriş cümlesiyle) ve kullanıcının notu
    function composeMessage() {
      const own = messageField.value.trim();
      const list = buildQuoteMessageText(currentTopic());
      if (!list) return own;
      return own ? `${list}\n${tt('Ek notlar', 'Additional notes')}:\n${own}` : list;
    }

    // Mesaj zorunlu değil; ama mesaj, seçili ürün ya da proje bilgisinden en az biri olmalı
    function validateContent() {
      const pr = projectData();
      const hasContent = messageField.value.trim() || pr.space_type || pr.area || pr.height || pr.extras.length || getCart().length;
      setFieldError(messageField, hasContent ? '' : tt('Lütfen talebinizi kısaca yazın, bir ürün ekleyin ya da proje bilgilerini doldurun.', 'Please briefly describe your request, add a product or fill in the project details.'));
      return Boolean(hasContent);
    }
    messageField.addEventListener('input', () => { if (messageField.hasAttribute('aria-invalid')) validateContent(); });

    const required = Array.from(form.querySelectorAll('[required]'));
    required.forEach(field => {
      field.addEventListener('blur', () => { if (isFilled(field) || field.hasAttribute('aria-invalid')) validateField(field); });
      field.addEventListener('input', () => { if (field.hasAttribute('aria-invalid')) validateField(field); });
    });

    // Aydınlatma metni: bağlantıya basılınca onay kutusunun altında açılır (kutuyu işaretlemez)
    const noticeToggle = form.querySelector('[data-notice-toggle]');
    const noticePanel = noticeToggle && document.getElementById(noticeToggle.getAttribute('aria-controls'));
    if (noticePanel) {
      noticeToggle.addEventListener('click', () => {
        const open = noticeToggle.getAttribute('aria-expanded') !== 'true';
        noticeToggle.setAttribute('aria-expanded', String(open));
        noticePanel.toggleAttribute('data-collapsed', !open);
        if (open) noticePanel.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      });
    }

    const formError = document.getElementById('formError');
    function showFormError(message) {
      if (!formError) {
        toast.show({ message: esc(message), type: 'error' });
        return;
      }
      formError.innerHTML = `${icon('warning-circle')}<span>${esc(message)}</span>`;
      formError.hidden = false;
    }

    // Form gönderim işleyicisi
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (formError) formError.hidden = true;

      const invalid = required.filter(field => !validateField(field));
      if (TOPICS[currentTopic()].project) {
        if (!validateNumber(areaInput, AREA_LABEL)) invalid.push(areaInput);
        if (!validateNumber(heightInput, HEIGHT_LABEL)) invalid.push(heightInput);
      }
      if (!validateContent()) invalid.push(messageField);
      if (invalid.length) {
        if ((invalid[0] === areaInput || invalid[0] === heightInput) && projectDetails) projectDetails.open = true;
        invalid[0].focus();
        return;
      }

      const topic = TOPICS[currentTopic()];
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>${tt('Gönderiliyor', 'Sending')}</span>`;

      const payload = {
        name: form.querySelector('[name="name"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        phone: form.querySelector('[name="phone"]')?.value.trim() || '',
        company: form.querySelector('[name="company"]')?.value.trim() || '',
        subject: topic.value,
        message: composeMessage(),
        ...projectData(),
        consent: Boolean(form.querySelector('[name="consent"]')?.checked),
        hp_company_website: form.querySelector('[name="hp_company_website"]')?.value || '',
        items: getCart()
      };

      function restoreButton() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }

      let response;
      try {
        response = await fetch(`${BASE}api/send-quote.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (networkError) {
        restoreButton();
        showFormError(tt(`Bağlantı kurulamadı. Lütfen tekrar deneyin ya da ${SITE_CFG.email} adresine yazın.`, `We could not connect. Please try again or write to ${SITE_CFG.email}.`));
        return;
      }

      const isJson = (response.headers.get('content-type') || '').includes('application/json');

      if (!isJson) {
        // PHP çalıştırmayan yerel statik sunucu (ör. python3 -m http.server): önizleme amaçlı simülasyon
        console.info('API fallback: PHP çalışmıyor, gönderim simüle edildi.');
        handleSuccess({
          reference: 'DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
          mode: 'preview'
        });
        return;
      }

      let data = {};
      try { data = await response.json(); } catch (parseError) { data = {}; }

      if (response.ok && data.success) {
        handleSuccess(data);
      } else {
        restoreButton();
        // Sunucu hata metinleri Türkçedir; İngilizce sayfada genel metin gösterilir
        const fallback = tt(`Talebiniz gönderilemedi. Lütfen tekrar deneyin ya da ${SITE_CFG.email} adresine yazın.`, `Your request could not be sent. Please try again or write to ${SITE_CFG.email}.`);
        showFormError(EN ? (response.status === 429 ? 'Too many requests in a short time. Please try again in a few minutes.' : fallback) : (data.error || fallback));
      }

      function handleSuccess(result) {
        const modeNote = result.mode === 'preview'
          ? `<p class="note">${tt('Yerel önizleme: PHP çalışmadığı için talep sunucuya gönderilmedi.', 'Local preview: the request was not sent to the server because PHP is not running.')}</p>`
          : result.mode === 'demo'
            ? `<p class="note">${tt('Not: Site şu anda deneme modundadır; talebiniz e-posta ile iletilmedi. Acil talepleriniz için lütfen e-posta adresimize yazın.', 'Note: the site is currently in demo mode and your request was not sent by email. For urgent requests, please write to our email address.')}</p>`
            : '';
        form.innerHTML = `
          <div class="form-success" tabindex="-1" id="formSuccess">
            <h2>${tt('Talebiniz alındı', 'Thank you, your request has been received')}</h2>
            <p>${tt('Talebiniz satış ekibimize iletildi; en kısa sürede sizinle iletişime geçeceğiz. Referans numaranız:', 'Your request has been sent to our sales team and we will be in touch shortly. Your reference number:')} <span class="ref">${esc(result.reference || '-')}</span></p>
            ${modeNote}
            <div class="btn-row">
              <a href="urunler.html" class="btn btn--primary">${tt('Ürünleri incele', 'Browse products')}</a>
            </div>
          </div>
        `;
        if (result.mode === 'demo') console.info('Teklif formu demo modunda: e-posta gönderilmedi. Yayına alırken api/send-quote.php içinde $DEMO_MODE = false yapın.');
        document.getElementById('formSuccess')?.focus();
        saveCart([]);
      }
    });
  }

  // =========================================================================
  // 7. CİHAZ KÜRATÖRÜ (Ana sayfa)
  // Cihazlar PRODUCTS'tan okunur; burada uydurma veri yok. Yalnızca satıştaki ürünler önerilir.
  // Esanslar kesinleşmediği için koku önerisi gösterilmez.
  // =========================================================================
  const ATMOSPHERES = {
    hotel: {
      title: tt('Otel lobisi ve karşılama alanları', 'Hotel lobbies and reception areas'),
      desc: tt('Yüksek tavanlı, sürekli kullanılan alanlar için zeminde duran, taze hava sistemine bağlanabilen alüminyum gövdeli bir kolon difüzör.', 'A free-standing aluminium column diffuser that connects to the fresh-air system, for busy spaces with high ceilings.'),
      productId: 'ck686',
      image: 'images/products/ck686.jpg',
      alt: tt('Modern bir salonda zemine yerleştirilmiş ADS-687 kolon difüzör', 'ADS-687 column diffuser standing on the floor in a modern living room')
    },
    office: {
      title: tt('Ofis ve toplantı alanları', 'Offices and meeting rooms'),
      desc: tt('Çalışma alanları ve toplantı odaları için sessiz çalışan, uygulama ya da kablosuz kumandayla zamanlanabilen ince bir duvar cihazı.', 'A quiet, slim wall unit for workspaces and meeting rooms that can be scheduled from an app or wireless remote.'),
      productId: 'ck689',
      image: 'images/products/ck689.jpg',
      alt: tt('Bir lobide duvara monte ADS-689 difüzör ve telefon uygulaması', 'ADS-689 diffuser mounted on the wall in a lobby, with the phone app')
    },
    retail: {
      title: tt('Mağaza ve showroom', 'Shops and showrooms'),
      desc: tt('Satış alanının büyüklüğüne göre üç kapasitede seçilebilen, zemine yerleştirilen ve klima sistemine bağlanabilen metal gövdeli seri.', 'A metal-bodied, floor-standing series in three capacities to suit the size of the sales floor; connects to the HVAC system.'),
      productId: 'ck620',
      image: 'images/products/ck620.jpg',
      alt: tt('Butik bir iç mekânda zemine yerleştirilmiş siyah ADS-620B difüzör', 'Black ADS-620B diffuser standing on the floor in a boutique interior')
    },
    residence: {
      title: tt('Rezidans ve özel yaşam alanları', 'Residences and private spaces'),
      desc: tt('Yatak odası ve salon gibi küçük alanlar için cam gövdeli, masif ahşap tabanlı ve şarjlı bir aroma difüzörü.', 'A rechargeable aroma diffuser with a glass body and solid wood base, for small rooms such as bedrooms and living rooms.'),
      productId: 'ads622',
      image: 'images/products/ads622.jpg',
      alt: tt('Sehpa üzerinde masif ahşap tabanlı ADS-622 aroma difüzörü', 'ADS-622 aroma diffuser with a solid wood base on a coffee table')
    }
  };

  function renderAtmosphere(key) {
    const data = ATMOSPHERES[key];
    const p = findProduct(data.productId);
    if (!p) return '';

    const coverage = specValue(p, RE_COV);
    const noise = specValue(p, RE_NOISE);

    return `
      <div class="curator__panel">
        <div class="media"><img src="${BASE}${data.image}" alt="${esc(data.alt)}" loading="lazy"></div>
        <div class="curator__body">
          <h3>${esc(data.title)}</h3>
          <p>${esc(data.desc)}</p>
          <dl class="spec-pairs">
            <div class="span-2"><dt>${tt('Önerilen cihaz', 'Recommended device')}</dt><dd>${esc(p.model)}, ${esc(p.title)}</dd></div>
            ${coverage ? `<div><dt>${tt('Kapsama alanı', 'Coverage')}</dt><dd>${esc(coverage)}</dd></div>` : ''}
            ${noise ? `<div><dt>${tt('Ses seviyesi (üretici verisi)', 'Noise level (manufacturer data)')}</dt><dd>${esc(noise)}</dd></div>` : ''}
          </dl>
          <div class="btn-row">
            <button type="button" class="btn btn--primary" data-add-product="${esc(p.id)}">${icon('plus', 'icon--sm')}<span>${tt('Listeye ekle', 'Add to list')}</span></button>
            <a href="urun-${encodeURIComponent(p.id)}.html" class="link-arrow">${tt('Ürünü incele', 'View product')} ${icon('arrow-right')}</a>
          </div>
        </div>
      </div>
    `;
  }

  function initAtmosphereSelector() {
    const tabs = Array.from(document.querySelectorAll('.atmosphere-tab'));
    const box = document.getElementById('atmosphereContent');
    if (!tabs.length || !box) return;

    // Masaüstünde aktif sekmeyi gösteren çizgi seçilen sekmeye kayar (CSS: .curator__tabs::before).
    // Klavyeyle seçimde ve ilk yerleşimde kaymadan yerleşir.
    const tabList = tabs[0].parentElement;
    function placeIndicator(tab, slide) {
      if (!tabList) return;
      if (!slide) tabList.classList.add('no-anim');
      tabList.style.setProperty('--ind-y', `${tab.offsetTop}px`);
      tabList.style.setProperty('--ind-h', `${tab.offsetHeight}px`);
      if (!slide) requestAnimationFrame(() => requestAnimationFrame(() => tabList.classList.remove('no-anim')));
    }
    let resizeFrame = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        const current = tabs.find(t => t.classList.contains('active'));
        if (current) placeIndicator(current, false);
      });
    });

    function select(tab, moveFocus, animate) {
      const key = tab.dataset.atmosphere;
      if (!ATMOSPHERES[key]) return;
      tabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      box.setAttribute('aria-labelledby', tab.id);
      placeIndicator(tab, !!animate);
      box.innerHTML = renderAtmosphere(key);
      if (animate && box.animate) {
        const frames = reduceMotion.matches
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [{ opacity: 0, filter: 'blur(4px)', transform: 'translateY(6px)' }, { opacity: 1, filter: 'blur(0)', transform: 'none' }];
        box.animate(frames, { duration: 220, easing: EASE_OUT });
      }
      if (moveFocus) tab.focus();
    }

    tabs.forEach((tab, i) => {
      // event.detail === 0: klavyeyle (Enter/Boşluk) tetiklenen tıklama; animasyonsuz
      tab.addEventListener('click', (e) => {
        if (tab.classList.contains('active')) return;
        select(tab, false, e.detail > 0);
      });
      tab.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) {
          e.preventDefault();
          select(next, true, false);
        }
      });
    });

    box.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add-product]');
      if (btn) addToCart(btn.dataset.addProduct, 1);
    });

    select(tabs.find(t => t.classList.contains('active')) || tabs[0], false, false);
    // Yazı tipi yüklenince sekme yükseklikleri değişebilir; göstergeyi yeniden hizala
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const current = tabs.find(t => t.classList.contains('active'));
        if (current) placeIndicator(current, false);
      });
    }
  }

  // =========================================================================
  // 8. ATOMİZASYON KARŞILAŞTIRMASI (Teknoloji sayfası)
  // Sayısal değer yok: üreticinin teknoloji açıklamasına dayanan nitel karşılaştırma.
  // =========================================================================
  function initParticleSimulator() {
    const btns = document.querySelectorAll('.particle-toggle-btn');
    const simDisplay = document.getElementById('simDisplay');
    if (!btns.length || !simDisplay) return;

    const SIM_DATA = {
      nano: {
        status: tt('Çift akışkanlı (basınçlı hava) atomizasyon', 'Dual-fluid (compressed air) atomisation'),
        desc: tt('Basınçlı hava esansı mikro parçacıklara ayırır; üreticinin açıklamasına göre iyonize, yüksek hızlı bir hızlandırıcı bu parçacıkları nano ölçeğe indirir. Çok ince parçacıklar yüzeye çarptığında kırılmadan geri seker.', 'Compressed air breaks the fragrance into micro particles; according to the manufacturer, an ionised high-speed accelerator reduces them to nano scale. Very fine particles bounce off surfaces without breaking.'),
        size: tt('Nano ölçekli parçacık', 'Nano-scale particles'),
        contact: tt('Yüzeyden seker, yapışmaz', 'Bounces off, does not stick'),
        residue: tt('Islak kalıntı bırakmaz', 'Leaves no wet residue')
      },
      aerosol: {
        status: tt('Büyük damlacıklı püskürtme', 'Large-droplet spray'),
        desc: tt('Büyük yağ damlacıkları yüzeye çarptığında kırılır. Temas ettiği mobilya, cam ve tekstil yüzeylerinde ıslak kalıntı bırakabilir.', 'Large oil droplets break when they hit a surface. They can leave a wet residue on furniture, glass and textiles they touch.'),
        size: tt('Büyük yağ damlacığı', 'Large oil droplets'),
        contact: tt('Çarpınca kırılır', 'Breaks on impact'),
        residue: tt('Islak kalıntı bırakabilir', 'May leave a wet residue')
      }
    };

    const simRoot = simDisplay.closest('.sim');
    function render(mode) {
      const d = SIM_DATA[mode];
      if (!d) return;
      if (simRoot) simRoot.dataset.mode = mode;
      simDisplay.innerHTML = `
        <p class="sim__status">${esc(d.status)}</p>
        <p class="sim__desc">${esc(d.desc)}</p>
        <dl class="sim-metrics">
          <div class="sim-metric"><dt>${tt('Parçacık', 'Particles')}</dt><dd>${esc(d.size)}</dd></div>
          <div class="sim-metric"><dt>${tt('Yüzeyle temas', 'Surface contact')}</dt><dd>${esc(d.contact)}</dd></div>
          <div class="sim-metric"><dt>${tt('Kalıntı', 'Residue')}</dt><dd>${esc(d.residue)}</dd></div>
        </dl>
      `;
    }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => {
          const on = b === btn;
          b.classList.toggle('active', on);
          b.setAttribute('aria-pressed', String(on));
        });
        render(btn.dataset.sim);
      });
    });

    const active = Array.from(btns).find(b => b.classList.contains('active')) || btns[0];
    render(active.dataset.sim);
  }

  // =========================================================================
  // BAŞLATMA
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    updateBadge();
    initAddFeedback();
    initProductActions();
    initGallery();
    initContactPage();
    initAtmosphereSelector();
    initParticleSimulator();

    window.addEventListener('dc:cart-updated', () => {
      updateBadge();
      renderDrawer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        closeMobileMenu();
      }
    });
  });

  // Global API
  root.MeiraApp = {
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    getCart,
    openDrawer,
    closeDrawer,
    toast,
    buildQuoteMessageText,
    trapFocus,
    icon,
    esc,
    tt,
    productThumb
  };

})(window);
