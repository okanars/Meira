/**
 * Site yapılandırması: marka ve iletişim bilgileri tek yerden yönetilir.
 *
 * "DummyCosmetics" geçici (placeholder) bir marka adıdır. Gerçek ad belirlendiğinde:
 *   1. Aşağıdaki değerleri değiştirin. Sayfadaki [data-site] alanları, <title> ve
 *      teklif mesajı metni bu değerlerden doldurulur.
 *   2. Arama motorları JavaScript çalıştırmadan da doğru adı görsün diye HTML
 *      dosyalarındaki statik metni de güncelleyin (komut README.md içinde).
 *   3. api/send-quote.php içindeki $TO_EMAIL, $FROM_EMAIL, $BRAND_NAME değerlerini
 *      ve sitemap.xml / robots.txt alan adını ayrıca güncelleyin.
 */
(function (root) {
  const SITE = {
    brand: 'DummyCosmetics',
    email: 'info@dummycosmetics.com.tr',
    phone: '+90 212 000 00 00',
    phoneHref: '+902120000000',
    city: 'İstanbul, Türkiye'
  };

  const PLACEHOLDER_BRAND = 'DummyCosmetics';

  function apply() {
    document.querySelectorAll('[data-site]').forEach(el => {
      const key = el.dataset.site;
      if (!(key in SITE)) return;
      el.textContent = SITE[key];
    });
    document.querySelectorAll('[data-site-href]').forEach(el => {
      const key = el.dataset.siteHref;
      if (key === 'email') el.setAttribute('href', 'mailto:' + SITE.email);
      if (key === 'phone') el.setAttribute('href', 'tel:' + SITE.phoneHref);
    });
    if (SITE.brand !== PLACEHOLDER_BRAND) {
      document.title = document.title.split(PLACEHOLDER_BRAND).join(SITE.brand);
    }
  }

  root.SITE = SITE;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})(window);
