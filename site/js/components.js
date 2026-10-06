/**
 * Paylaşılan bileşenler ve durum: teklif listesi (sepet), çekmece, bildirim,
 * navigasyon, iletişim formu, koku küratörü, atomizasyon simülatörü.
 * Görsel sınıflar DESIGN.md / css/style.css ile eşleşir.
 */

(function (root) {
  const SITE_CFG = root.SITE || { brand: 'Meira', email: 'info@meira.com.tr' };
  const ICONS = 'images/icons.svg';

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
    return `images/${p.external ? 'general' : 'products'}/${p.img}.jpg`;
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
    // Katalogda olmayan kayıtları yok say (eski sürümden kalan geçersiz kimlikler)
    if (typeof PRODUCTS !== 'undefined') {
      cart = cart.filter(item => item && findProduct(item.id));
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
      toast.show({ message: 'Bu ürün katalogda bulunamadı.', type: 'error' });
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

    const name = product ? `${product.model} ${product.title}` : 'Ürün';
    toast.show({
      message: `<strong>${esc(name)}</strong> teklif listesine eklendi.`,
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
      toast.show({ message: 'Ürün teklif listesinden kaldırıldı.', type: 'info' });
    }
    saveCart(cart);
  }

  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== productId);
    saveCart(cart);
    toast.show({ message: 'Ürün teklif listesinden çıkarıldı.', type: 'info' });
  }

  function clearCart() {
    saveCart([]);
    toast.show({ message: 'Teklif listesi temizlendi.', type: 'info' });
  }

  function getCartTotalCount() {
    const cart = getCart();
    return cart.reduce((acc, cur) => acc + (cur.qty || 1), 0);
  }

  // Otomatik teklif mesaj metni oluşturucu
  function buildQuoteMessageText() {
    const cart = getCart();
    if (!cart.length || typeof PRODUCTS === 'undefined') return '';

    let text = `Merhaba ${SITE_CFG.brand} Satış Ekibi,\n\n`;
    text += `Aşağıda listelediğim ürünler için birim fiyat, stok durumu ve teslimat süresi içeren bir teklif rica ediyorum:\n\n`;

    let line = 0;
    cart.forEach(item => {
      const p = findProduct(item.id);
      if (!p) return;
      line += 1;

      const cap = specValue(p, /kapasite/i) || '-';
      const area = specValue(p, /kapsama/i) || '-';

      text += `${line}. [${p.model}] ${p.title}\n`;
      text += `   - Talep adedi: ${item.qty} adet\n`;
      text += `   - Kapsama: ${area} | Kapasite: ${cap}\n\n`;
    });

    text += `PROJE / UYGULAMA ALANI:\n`;
    text += `Mekân tipi: [Örn: Otel lobisi / Mağaza / Ofis]\n`;
    text += `Alan veya hacim: [Örn: ~1.200 m²]\n`;
    text += `Ek istekler: [Montaj, özel koku vb.]\n`;

    return text;
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
          <h2 id="drawer-title">Teklif listesi</h2>
          <button type="button" class="icon-btn" id="dc-drawer-close" aria-label="Teklif listesini kapat">${icon('x')}</button>
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
          <h3>Listeniz boş</h3>
          <p>Katalogdan cihaz ve esans ekleyerek tek seferde teklif isteyebilirsiniz.</p>
        </div>
      `;
      footerContainer.innerHTML = `
        <a href="urunler.html" class="btn btn--quiet btn--block" id="dc-btn-browse">Ürünleri incele</a>
      `;
      return;
    }

    itemsContainer.innerHTML = cart.map(item => {
      const p = findProduct(item.id);
      if (!p) return '';
      return `
        <div class="drawer-item" data-id="${esc(p.id)}">
          <img src="${productImage(p)}" alt="" class="drawer-item-img" loading="lazy">
          <div class="drawer-item-info">
            <span class="drawer-item-model">${esc(p.model)}</span>
            <div class="drawer-item-title">${esc(p.title)}</div>
          </div>
          <button type="button" class="icon-btn drawer-item-remove" data-act="remove" aria-label="${esc(p.model)} ürününü listeden kaldır">${icon('trash')}</button>
          <div class="qty-controls" role="group" aria-label="${esc(p.model)} adedi">
            <button type="button" class="qty-btn" data-act="minus" aria-label="Adedi azalt">${icon('minus')}</button>
            <span class="qty-val">${item.qty}</span>
            <button type="button" class="qty-btn" data-act="plus" aria-label="Adedi artır">${icon('plus')}</button>
          </div>
        </div>
      `;
    }).join('');

    const total = getCartTotalCount();
    footerContainer.innerHTML = `
      <button type="button" class="btn btn--primary btn--lg btn--block" id="dc-btn-go-quote">
        <span>Teklif formuna aktar</span>
        ${icon('arrow-right', 'icon--move')}
      </button>
      <div class="drawer-footer__meta">
        <span class="num">${cart.length} model, toplam ${total} adet</span>
        <button type="button" id="dc-btn-clear-cart">Listeyi temizle</button>
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
  function updateBadge() {
    const total = getCartTotalCount();
    const grew = lastBadgeTotal !== null && total > lastBadgeTotal;
    lastBadgeTotal = total;
    document.querySelectorAll('.dc-cart-count').forEach(b => {
      b.textContent = total;
      b.classList.toggle('empty', total === 0);
      // Liste büyüdüğünde rozet kısa bir büyüme yapar: eklenen ürünün nereye gittiğini gösterir
      if (grew && !reduceMotion.matches && b.animate) {
        b.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.22)' }, { transform: 'scale(1)' }],
          { duration: 260, easing: EASE_OUT }
        );
      }
    });
    document.querySelectorAll('.quote-trigger').forEach(btn => {
      btn.setAttribute('aria-label', `Teklif listesi, ${total} adet ürün`);
    });
  }

  // Listeye ekleme butonları 1,6 s boyunca "Eklendi" durumuna geçer (geri bildirim tıklanan yerde).
  // Butonların kendi tıklama işleyicileri değişmez; bu dinleyici yalnızca görünümü günceller.
  const ADD_SELECTOR = '[data-act="add-quote"], [data-add], [data-add-product], [data-add-to-list]';
  function confirmAdded(btn) {
    const label = btn.querySelector('span');
    const use = btn.querySelector('use');
    if (!btn.dataset.label && label) btn.dataset.label = label.textContent;
    if (!btn.dataset.icon && use) btn.dataset.icon = use.getAttribute('href');
    clearTimeout(btn._addedTimer);
    btn.classList.add('is-added');
    if (label) label.textContent = 'Eklendi';
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
        zoom.setAttribute('aria-label', on ? 'Yakınlaştırmayı kapat' : 'Görseli yakınlaştır');
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
      if (btn && !btn.disabled) confirmAdded(btn);
    }, true);
  }

  // =========================================================================
  // 4. BAŞLIK, MENÜ, AKTİF SAYFA
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
  // 5. İLETİŞİM SAYFASI: FORM DOLDURMA, DOĞRULAMA, GÖNDERİM
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

  function validateField(field) {
    const value = field.value.trim();
    if (field.required && !value) {
      setFieldError(field, field.dataset.requiredMsg || 'Bu alan zorunludur.');
      return false;
    }
    if (field.type === 'email' && value && !EMAIL_RE.test(value)) {
      setFieldError(field, 'Geçerli bir e-posta adresi girin (ör. ad@firma.com).');
      return false;
    }
    setFieldError(field, '');
    return true;
  }

  function initContactPage() {
    const form = document.getElementById('contactForm');
    const messageField = document.getElementById('contactMessage');
    const quoteBanner = document.getElementById('quoteBanner');
    if (!form || !messageField) return;

    const urlParams = new URLSearchParams(window.location.search);
    const hasQuoteParam = urlParams.has('teklif') || urlParams.has('from');
    const cart = getCart();

    if (cart.length > 0) {
      // Mesaj kutusu boşsa veya teklif bağlantısından gelinmişse otomatik doldur
      if (!messageField.value.trim() || hasQuoteParam) {
        messageField.value = buildQuoteMessageText();

        if (quoteBanner) {
          quoteBanner.hidden = false;
          quoteBanner.innerHTML = `
            <span>${icon('check')} Teklif listenizdeki <strong class="num">${getCartTotalCount()} adet ürün</strong> mesaja aktarıldı.</span>
            <button type="button" class="inline-action" id="bannerEditList">Listeyi düzenle</button>
          `;
          document.getElementById('bannerEditList')?.addEventListener('click', openDrawer);
        }
      }
    }

    const required = Array.from(form.querySelectorAll('[required]'));
    required.forEach(field => {
      field.addEventListener('blur', () => { if (field.value.trim() || field.hasAttribute('aria-invalid')) validateField(field); });
      field.addEventListener('input', () => { if (field.hasAttribute('aria-invalid')) validateField(field); });
    });

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
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Gönderiliyor</span>`;

      const payload = {
        name: form.querySelector('[name="name"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        phone: form.querySelector('[name="phone"]')?.value.trim() || '',
        company: form.querySelector('[name="company"]')?.value.trim() || '',
        subject: form.querySelector('[name="subject"]')?.value || 'Teklif Talebi',
        message: messageField.value.trim(),
        hp_company_website: form.querySelector('[name="hp_company_website"]')?.value || '',
        items: getCart()
      };

      function restoreButton() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }

      let response;
      try {
        response = await fetch('api/send-quote.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (networkError) {
        restoreButton();
        showFormError(`Bağlantı kurulamadı. Lütfen tekrar deneyin veya ${SITE_CFG.email} adresine yazın.`);
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
        showFormError(data.error || `Talebiniz gönderilemedi. Lütfen tekrar deneyin veya ${SITE_CFG.email} adresine yazın.`);
      }

      function handleSuccess(result) {
        const modeNote = result.mode === 'preview'
          ? '<p class="note">Yerel önizleme: PHP çalışmadığı için talep sunucuya gönderilmedi.</p>'
          : result.mode === 'demo'
            ? '<p class="note">Demo modu açık: e-posta gönderilmedi. Canlıya alırken api/send-quote.php içindeki $DEMO_MODE değerini false yapın.</p>'
            : '';
        form.innerHTML = `
          <div class="form-success" tabindex="-1" id="formSuccess">
            <h2>Talebiniz alındı</h2>
            <p>Teklif listeniz ve proje bilgileriniz satış ekibine iletildi. Referans numaranız: <span class="ref">${esc(result.reference || '-')}</span></p>
            ${modeNote}
            <div class="btn-row">
              <a href="urunler.html" class="btn btn--quiet">Ürünleri incele</a>
            </div>
          </div>
        `;
        document.getElementById('formSuccess')?.focus();
        if (quoteBanner) quoteBanner.hidden = true;
        saveCart([]);
      }
    });
  }

  // =========================================================================
  // 6. KOKU KÜRATÖRÜ (Ana sayfa)
  // Cihazlar PRODUCTS'tan, koku notaları SCENTS'ten okunur; burada uydurma veri yok.
  // =========================================================================
  const ATMOSPHERES = {
    hotel: {
      title: 'Otel lobisi ve karşılama alanları',
      desc: 'Yüksek tavanlı, sürekli kullanılan alanlar için klima sistemine bağlanabilen, geniş kapsamalı bir cihaz ve yumuşak, ferah bir çay kokusu.',
      productId: 'ck631',
      scent: 'Encountering White Tea',
      image: 'images/products/ck631.jpg',
      alt: 'Otel resepsiyonunda duvara monte CK-631 difüzör'
    },
    office: {
      title: 'Ofis ve toplantı alanları',
      desc: 'Çalışma alanları ve toplantı odaları için ince gövdeli, uygulamayla zamanlanabilen bir duvar cihazı ve hafif, temiz bir koku.',
      productId: 'ck688',
      scent: 'Gardenya Beyaz Çay',
      image: 'images/products/ck688.jpg',
      alt: 'Aydınlık bir salonda duvara monte CK-688 difüzör ve telefon uygulaması'
    },
    retail: {
      title: 'Mağaza ve showroom',
      desc: 'Satış alanının büyüklüğüne göre seçilebilen üç farklı kapasitede seri ve meyvemsi, ferah bir koku.',
      productId: 'ck620',
      scent: 'Stellar Encounters',
      image: 'images/products/ck620.jpg',
      alt: 'Butik bir iç mekânda zemine yerleştirilmiş siyah CK-620 difüzör'
    },
    residence: {
      title: 'Rezidans ve özel yaşam alanları',
      desc: 'Yatak odası ve salon gibi küçük alanlar için pilli, taşınabilir alüminyum bir cihaz ve lavantalı, sakin bir koku.',
      productId: 'ck683',
      scent: 'Fougère No. 2',
      image: 'images/products/ck683.jpg',
      alt: 'Mermer komodin üzerinde gümüş renkli CK-683 difüzör'
    }
  };

  function renderAtmosphere(key) {
    const data = ATMOSPHERES[key];
    const p = findProduct(data.productId);
    const s = (typeof SCENTS !== 'undefined') ? SCENTS.find(x => x.name === data.scent) : null;
    if (!p) return '';

    const coverage = specValue(p, /kapsama/i);
    const noise = specValue(p, /ses/i);

    return `
      <div class="curator__panel">
        <div class="media"><img src="${data.image}" alt="${esc(data.alt)}" loading="lazy"></div>
        <div class="curator__body">
          <h3>${esc(data.title)}</h3>
          <p>${esc(data.desc)}</p>
          <dl class="spec-pairs">
            <div class="span-2"><dt>Önerilen cihaz</dt><dd>${esc(p.model)}, ${esc(p.title)}</dd></div>
            ${coverage ? `<div><dt>Kapsama alanı</dt><dd>${esc(coverage)}</dd></div>` : ''}
            ${noise ? `<div><dt>Ses seviyesi (üretici verisi)</dt><dd>${esc(noise)}</dd></div>` : ''}
            ${s ? `<div class="span-2"><dt>Önerilen koku</dt><dd>${esc(s.name)} <span class="meta">(${esc(s.family)})</span></dd></div>` : ''}
          </dl>
          ${s ? `
          <div class="notes-line">
            <span><b>Üst nota</b>${esc(s.top)}</span>
            <span><b>Kalp notası</b>${esc(s.mid)}</span>
            <span><b>Dip nota</b>${esc(s.base)}</span>
          </div>` : ''}
          <div class="btn-row">
            <button type="button" class="btn btn--primary" data-add-product="${esc(p.id)}">${icon('plus', 'icon--sm')}<span>Listeye ekle</span></button>
            <a href="urun-${encodeURIComponent(p.id)}.html" class="link-arrow">Ürünü incele ${icon('arrow-right')}</a>
          </div>
        </div>
      </div>
    `;
  }

  function initAtmosphereSelector() {
    const tabs = Array.from(document.querySelectorAll('.atmosphere-tab'));
    const box = document.getElementById('atmosphereContent');
    if (!tabs.length || !box) return;

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
  }

  // =========================================================================
  // 7. ATOMİZASYON KARŞILAŞTIRMASI (Teknoloji sayfası)
  // Sayısal değer yok: üreticinin teknoloji açıklamasına dayanan nitel karşılaştırma.
  // =========================================================================
  function initParticleSimulator() {
    const btns = document.querySelectorAll('.particle-toggle-btn');
    const simDisplay = document.getElementById('simDisplay');
    if (!btns.length || !simDisplay) return;

    const SIM_DATA = {
      nano: {
        status: 'Çift akışkanlı (basınçlı hava) atomizasyon',
        desc: 'Basınçlı hava esansı mikro parçacıklara ayırır; üreticinin açıklamasına göre iyonize, yüksek hızlı bir hızlandırıcı bu parçacıkları nano ölçeğe indirir. Çok ince parçacıklar yüzeye çarptığında kırılmadan geri seker.',
        size: 'Nano ölçekli parçacık',
        contact: 'Yüzeyden seker, yapışmaz',
        residue: 'Islak kalıntı bırakmaz'
      },
      aerosol: {
        status: 'Büyük damlacıklı püskürtme',
        desc: 'Büyük yağ damlacıkları yüzeye çarptığında kırılır. Temas ettiği mobilya, cam ve tekstil yüzeylerinde ıslak kalıntı bırakabilir.',
        size: 'Büyük yağ damlacığı',
        contact: 'Çarpınca kırılır',
        residue: 'Islak kalıntı bırakabilir'
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
          <div class="sim-metric"><dt>Parçacık</dt><dd>${esc(d.size)}</dd></div>
          <div class="sim-metric"><dt>Yüzeyle temas</dt><dd>${esc(d.contact)}</dd></div>
          <div class="sim-metric"><dt>Kalıntı</dt><dd>${esc(d.residue)}</dd></div>
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
    esc
  };

})(window);
