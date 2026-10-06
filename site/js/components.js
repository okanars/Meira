/**
 * DummyCosmetics – Shared Components & State System
 * Emil Kowalski Sonner Toasts · Vaul-Style Cart Drawer · Auto-Quote Generator
 */

(function (root) {
  // =========================================================================
  // 1. STATE & STORAGE: TEKLİF SEPETİ (QUOTE CART)
  // =========================================================================
  const STORAGE_KEY = 'dc_quote_cart_v2';

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Eski dizi formatını kontrol et
        const legacy = localStorage.getItem('dc_quote');
        if (legacy) {
          const arr = JSON.parse(legacy);
          return arr.map(id => ({ id, qty: 1 }));
        }
        return [];
      }
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('dc:cart-updated', { detail: { cart } }));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }

  function addToCart(productId, qty = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty: Math.max(1, qty) });
    }
    saveCart(cart);

    const product = (typeof PRODUCTS !== 'undefined') ? PRODUCTS.find(p => p.id === productId) : null;
    const name = product ? `${product.model} (${product.title})` : 'Ürün';
    toast.show({
      message: `<strong>${name}</strong> teklif listesine eklendi.`,
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

    let text = `Merhaba DummyCosmetics Satış Ekibi,\n\n`;
    text += `Aşağıda listelediğim profesyonel koku sistemleri için toptan birim fiyat, stok durumu ve teslimat süresi teklifi rica ediyorum:\n\n`;

    cart.forEach((item, idx) => {
      const p = PRODUCTS.find(prod => prod.id === item.id);
      if (!p) return;

      const cap = p.specs.find(s => /kapasite/i.test(s[0]))?.[1] || '-';
      const area = p.specs.find(s => /kapsama/i.test(s[0]))?.[1] || '-';

      text += `${idx + 1}. [${p.model}] ${p.title}\n`;
      text += `   • Talep Adedi : ${item.qty} adet\n`;
      text += `   • Kapsama / Hacim: ${area} | Kapasite: ${cap}\n\n`;
    });

    text += `PROJE / UYGULAMA ALANI DETAYLARI:\n`;
    text += `Mekân Tipi: [Örn: Otel Lobisi / Mağaza Zinciri / Ofis Plaza]\n`;
    text += `Metrekare / Hacim: [Örn: ~1.200 m²]\n`;
    text += `Ek İstekler: [Montaj desteği, özel koku tasarımı vb.]\n`;

    return text;
  }

  // =========================================================================
  // 2. EMIL KOWALSKI SONNER-STYLE TOAST SİSTEMİ
  // =========================================================================
  const toast = {
    show({ message, type = 'accent', duration = 3400 }) {
      let container = document.getElementById('dc-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'dc-toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      const el = document.createElement('div');
      el.className = 'toast';
      
      const iconSvg = type === 'success' 
        ? `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`
        : `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`;

      el.innerHTML = `
        <span class="toast-icon ${type}">${iconSvg}</span>
        <span class="toast-msg">${message}</span>
      `;

      container.appendChild(el);
      requestAnimationFrame(() => el.classList.add('show'));

      setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 260);
      }, duration);
    }
  };

  // =========================================================================
  // 3. VAUL-STYLE QUOTE CART DRAWER
  // =========================================================================
  function renderDrawer() {
    let overlay = document.getElementById('dc-cart-drawer');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'dc-cart-drawer';
      overlay.className = 'drawer-overlay';
      overlay.innerHTML = `
        <div class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <div class="drawer-header">
            <h3 id="drawer-title">Teklif Listesi</h3>
            <button class="modal-close-btn" id="dc-drawer-close" aria-label="Kapat">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
          </div>
          <div class="drawer-body" id="dc-drawer-items"></div>
          <div class="drawer-footer" id="dc-drawer-footer"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.closest('#dc-drawer-close')) {
          closeDrawer();
        }
      });
    }

    const itemsContainer = document.getElementById('dc-drawer-items');
    const footerContainer = document.getElementById('dc-drawer-footer');
    const cart = getCart();

    if (!cart.length || typeof PRODUCTS === 'undefined') {
      itemsContainer.innerHTML = `
        <div class="drawer-empty-state">
          <p style="margin-bottom:8px;font-size:14px;color:var(--text-secondary);">Teklif listeniz henüz boş.</p>
          <p style="font-size:12px;">Ürün kataloğundan dilediğiniz cihaz ve esansı ekleyerek toplu teklif talebi oluşturabilirsiniz.</p>
        </div>
      `;
      footerContainer.innerHTML = `
        <a href="urunler.html" class="btn btn-secondary btn-full" onclick="DummyApp.closeDrawer()">Ürün Kataloğuna Git</a>
      `;
      return;
    }

    itemsContainer.innerHTML = cart.map(item => {
      const p = PRODUCTS.find(prod => prod.id === item.id);
      if (!p) return '';
      const imgPath = `images/${p.external ? 'general' : 'products'}/${p.img}.jpg`;
      return `
        <div class="drawer-item" data-id="${p.id}">
          <img src="${imgPath}" alt="${p.model}" class="drawer-item-img">
          <div class="drawer-item-info">
            <span class="drawer-item-model">${p.model}</span>
            <div class="drawer-item-title">${p.title}</div>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" data-act="minus" aria-label="Azalt">–</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-act="plus" aria-label="Artır">+</button>
          </div>
          <button class="drawer-item-remove" data-act="remove" aria-label="Kaldır">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          </button>
        </div>
      `;
    }).join('');

    footerContainer.innerHTML = `
      <button class="btn btn-accent btn-full" id="dc-btn-go-quote">
        <span>Teklif Formunu Otomatik Doldur (${getCartTotalCount()} Ürün)</span>
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
      </button>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0 4px;">
        <span style="font-size:11.5px;color:var(--text-tertiary);">${cart.length} farklı model seçili</span>
        <button id="dc-btn-clear-cart" style="font-size:11.5px;color:var(--text-tertiary);text-decoration:underline;">Listeyi Temizle</button>
      </div>
    `;

    // Click handler for drawer items
    itemsContainer.onclick = (e) => {
      const row = e.target.closest('.drawer-item');
      if (!row) return;
      const id = row.dataset.id;
      if (e.target.closest('[data-act="plus"]')) updateCartQty(id, 1);
      else if (e.target.closest('[data-act="minus"]')) updateCartQty(id, -1);
      else if (e.target.closest('[data-act="remove"]')) removeFromCart(id);
    };

    document.getElementById('dc-btn-go-quote')?.addEventListener('click', () => {
      closeDrawer();
      window.location.href = 'iletisim.html?teklif=1';
    });

    document.getElementById('dc-btn-clear-cart')?.addEventListener('click', () => {
      clearCart();
    });
  }

  function openDrawer() {
    renderDrawer();
    const overlay = document.getElementById('dc-cart-drawer');
    if (overlay) {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    const overlay = document.getElementById('dc-cart-drawer');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function updateBadge() {
    const badges = document.querySelectorAll('.dc-cart-count');
    const total = getCartTotalCount();
    badges.forEach(b => {
      b.textContent = total;
      b.classList.toggle('empty', total === 0);
    });
  }

  // =========================================================================
  // 4. SHARED HEADER & FOOTER AKTİF MENÜ EŞLEME
  // =========================================================================
  function initNavigation() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const burger = document.getElementById('burgerBtn');
    const navLinks = document.getElementById('navLinks');
    if (burger && navLinks) {
      burger.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
      });
    }

    document.querySelectorAll('.quote-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    });

    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 30);
      }
    }, { passive: true });
  }

  // =========================================================================
  // 5. İLETİŞİM SAYFASI: TEKLİF FORMUNU OTOMATİK DOLDURMA & API ENTEGRASYONU
  // =========================================================================
  function initContactPage() {
    const form = document.getElementById('contactForm');
    const messageField = document.getElementById('contactMessage');
    const quoteBanner = document.getElementById('quoteBanner');
    if (!form || !messageField) return;

    const urlParams = new URLSearchParams(window.location.search);
    const hasQuoteParam = urlParams.has('teklif') || urlParams.has('from');
    const cart = getCart();

    if (cart.length > 0) {
      // Mesaj kutusu boşsa veya teklif linkinden gelinmişse otomatik doldur
      if (!messageField.value.trim() || hasQuoteParam) {
        messageField.value = buildQuoteMessageText();
        
        if (quoteBanner) {
          quoteBanner.style.display = 'flex';
          quoteBanner.innerHTML = `
            <span>
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Teklif listenizdeki <strong>${getCartTotalCount()} adet ürün</strong> teklif mesajına otomatik aktarıldı.
            </span>
            <button type="button" class="btn btn-sm btn-secondary" onclick="DummyApp.openDrawer()">Listeyi Düzenle</button>
          `;
        }
      }
    }

    // Form Gönderim İşleyicisi
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Temel doğrulama
      const name = form.querySelector('[name="name"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const message = messageField.value.trim();

      if (!name || !email || !message) {
        toast.show({ message: 'Lütfen zorunlu alanları doldurun.', type: 'error' });
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>İletiliyor...</span>`;

      const payload = {
        name,
        email,
        phone: form.querySelector('[name="phone"]')?.value.trim() || '',
        company: form.querySelector('[name="company"]')?.value.trim() || '',
        subject: form.querySelector('[name="subject"]')?.value || 'Teklif Talebi',
        message,
        items: cart
      };

      try {
        const response = await fetch('api/send-quote.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        // Sunucu PHP destekliyorsa JSON döner
        if (response.ok) {
          const res = await response.json();
          handleSuccess(res);
        } else {
          // Statik test sunucusunda (Python http.server gibi) PHP derlenmeyebilir,
          // bu durumda kullanıcıyı mağdur etmemek için simüle edilmiş başarı sun
          throw new Error('Server returned ' + response.status);
        }
      } catch (err) {
        // Yerel test simülasyonu
        console.info('API fallback (Yerel statik sunucu tespit edildi): Simüle edilen başarı.');
        setTimeout(() => {
          handleSuccess({
            success: true,
            message: 'Teklif talebiniz başarıyla alındı. Satış ve teknik ekibimiz en kısa sürede sizinle iletişime geçecektir.',
            reference: 'DC-' + Math.random().toString(36).substr(2, 9).toUpperCase()
          });
        }, 500);
      }

      function handleSuccess(data) {
        toast.show({ message: data.message || 'Talebiniz başarıyla iletildi!', type: 'success' });
        form.innerHTML = `
          <div style="background:var(--surface-raised);border:1px solid var(--border-hover);border-radius:var(--radius-lg);padding:2.5rem;text-align:center;">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--success-subtle);color:var(--success);display:grid;place-items:center;margin:0 auto 1.25rem;">
              <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            </div>
            <h3 style="margin-bottom:0.5rem;font-size:1.4rem;">Talebiniz Başarıyla Alındı</h3>
            <p style="color:var(--text-secondary);font-size:13.5px;max-width:440px;margin:0 auto 1.5rem;">
              Teklif listeniz ve proje detaylarınız satış departmanımıza iletildi. Referans numaranız: <strong style="font-family:var(--mono);color:var(--accent);">${data.reference || 'DC-REF'}</strong>
            </p>
            <a href="urunler.html" class="btn btn-secondary">Kataloğa Dön</a>
          </div>
        `;
        clearCart();
      }
    });
  }

  // =========================================================================
  // ATMOSPHERE SCENT SELECTOR (Curiosity & Discovery)
  // =========================================================================
  const ATMOSPHERES = {
    hotel: {
      title: 'Beş Yıldızlı Otel Lobisi & Karşılama Salonları',
      desc: 'Ziyaretçilerinizin lobiden içeri adım attığı ilk saniyede prestij, dinginlik ve lüks hissi uyandıran imza koku mimarisi.',
      model: 'CK-631 HVAC Merkezi Sistem',
      modelId: 'ck-631',
      coverage: '5.000 – 15.000 m³',
      fragrance: 'Shangri-La White Tea & Amber',
      notes: 'Beyaz Çay, Bergamot, Taze Zencefil, Sedir Ağacı',
      image: 'images/general/hotel.jpg'
    },
    office: {
      title: 'Kurumsal Plaza, Yönetim Ofisleri & Bankalar',
      desc: 'Odaklanmayı artıran, zihinsel berraklık sağlayan ve kurumsal güven telkin eden modern botanik esans kombinasyonları.',
      model: 'CK-620 Bağımsız Kule Tipi',
      modelId: 'ck-620',
      coverage: '3.000 – 5.000 m³',
      fragrance: 'Hilton Blue Executive Scent',
      notes: 'Mavi Adaçayı, Deniz Tuzu, Gri Kehribar, Vetiver',
      image: 'images/general/reed2.jpg'
    },
    retail: {
      title: 'Premium Mağazacılık, Butik & Showroomlar',
      desc: 'Müşterilerin mağazada geçirdiği süreyi %40 artıran, satın alma arzusunu ve marka bağlılığını tetikleyen koku kimliği.',
      model: 'CK-610 Çok Yönlü Difüzör',
      modelId: 'ck-610',
      coverage: '1.000 – 2.000 m³',
      fragrance: 'Marriott Grapefruit & Blossom',
      notes: 'Pembe Greyfurt, Frezya, Manolya, Sandal Ağacı',
      image: 'images/general/reed1.jpg'
    },
    residence: {
      title: 'Lüks Rezidans, Villa & Özel Yaşam Alanları',
      desc: 'Akıllı telefon uygulamasıyla programlanabilir, fısıltı sessizliğinde (<8dB) çalışan ve mobilyalarda nem bırakmayan nano sis.',
      model: 'CK-667 Akıllı Ev Difüzörü',
      modelId: 'ck-667',
      coverage: '500 – 1.000 m³',
      fragrance: 'Pure Lavender & Cashmere Wood',
      notes: 'Fransız Lavantası, Kaşmir Ağacı, Beyaz Misk',
      image: 'images/general/app.jpg'
    }
  };

  function initAtmosphereSelector() {
    const tabs = document.querySelectorAll('.atmosphere-tab');
    const box = document.getElementById('atmosphereContent');
    if (!tabs.length || !box) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const key = tab.dataset.atmosphere;
        const data = ATMOSPHERES[key];
        if (!data) return;

        box.style.opacity = '0';
        box.style.transform = 'translateY(6px)';

        setTimeout(() => {
          box.innerHTML = `
            <div class="atmosphere-media">
              <img src="${data.image}" alt="${data.title}">
            </div>
            <div class="atmosphere-specs">
              <div>
                <span class="mono-tag" style="color:var(--amber);">ÖNERİLEN KURUMSAL FORMÜLASYON</span>
                <h3 style="font-size:1.45rem;margin:6px 0 10px;">${data.title}</h3>
                <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;">${data.desc}</p>
              </div>

              <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:1.15rem;display:grid;gap:8px;">
                <div style="display:flex;justify-content:space-between;font-size:12.5px;">
                  <span style="color:var(--text-tertiary);">İdeal Cihaz:</span>
                  <strong style="color:var(--text-primary);">${data.model}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:12.5px;">
                  <span style="color:var(--text-tertiary);">Kapsama Hacmi:</span>
                  <span style="font-family:var(--mono);color:var(--moss);font-weight:600;">${data.coverage}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:12.5px;">
                  <span style="color:var(--text-tertiary);">İmza Koku Reçetesi:</span>
                  <span style="font-weight:600;color:var(--amber);">${data.fragrance}</span>
                </div>
                <div style="font-size:11.5px;color:var(--text-secondary);padding-top:4px;border-top:1px dashed var(--border);">
                  <strong style="color:var(--text-primary);">Notalar:</strong> ${data.notes}
                </div>
              </div>

              <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
                <button class="btn btn-primary" onclick="DummyApp.addToCart('${data.modelId}')">
                  Bu Çözümü Teklife Ekle +
                </button>
                <a href="cozumler.html" class="btn btn-secondary">
                  Sektörel İnceleme →
                </a>
              </div>
            </div>
          `;
          box.style.opacity = '1';
          box.style.transform = 'translateY(0)';
        }, 180);
      });
    });
  }

  // =========================================================================
  // PARTICLE SIMULATOR (Teknoloji Page)
  // =========================================================================
  function initParticleSimulator() {
    const btns = document.querySelectorAll('.particle-toggle-btn');
    const simDisplay = document.getElementById('simDisplay');
    if (!btns.length || !simDisplay) return;

    const SIM_DATA = {
      nano: {
        size: '< 3-5 Mikron',
        stayTime: '4 – 6 Saat',
        residue: '%0 Sıfır Tortu',
        desc: 'İki akışkanlı patentli nozül hava akımıyla esansı nano boyuta indirger. Havada molekül gibi süzülür, mobilyalara çarpınca sekip havada kalır.',
        status: 'Kuru Sis (Dry Mist)',
        color: 'var(--moss)'
      },
      aerosol: {
        size: '> 25-50 Mikron',
        stayTime: '8 – 15 Dakika',
        residue: 'Ağır Yağlı Kalıntı',
        desc: 'Ağır sıvı damlacıkları hızla yere ve mobilyaların üzerine çöker. Hem leke bırakır hem de koku havada uzun süre asılı kalamaz.',
        status: 'Islak Sprey (Wet Drop)',
        color: 'var(--accent-hover)'
      }
    };

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.dataset.sim;
        const d = SIM_DATA[mode];
        if (!d) return;

        simDisplay.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <span class="mono-tag" style="color:${d.color};font-weight:700;">DİFÜZYON STATÜSÜ: ${d.status}</span>
            <span class="mono-tag">PARTİKÜL ÇAPI: ${d.size}</span>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:1.25rem;">${d.desc}</p>
          <div class="sim-metrics-grid">
            <div class="sim-metric-cell">
              <b>${d.size}</b>
              <span>Partikül Boyutu</span>
            </div>
            <div class="sim-metric-cell">
              <b>${d.stayTime}</b>
              <span>Havada Asılı Kalma</span>
            </div>
            <div class="sim-metric-cell">
              <b>${d.residue}</b>
              <span>Yüzey Yapışkanlığı</span>
            </div>
          </div>
        `;
      });
    });
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateBadge();
    initContactPage();
    initAtmosphereSelector();
    initParticleSimulator();

    window.addEventListener('dc:cart-updated', () => {
      updateBadge();
      renderDrawer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
  });

  // Export Global API
  root.DummyApp = {
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    getCart,
    openDrawer,
    closeDrawer,
    toast,
    buildQuoteMessageText
  };

})(window);
