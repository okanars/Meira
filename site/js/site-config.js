/**
 * Site yapılandırması: marka ve iletişim bilgileri tek yerden yönetilir.
 * Sayfadaki [data-site] alanları ve teklif mesajı metni bu değerlerden doldurulur.
 *
 * [DOĞRULANACAK] Alan adı (meira.com.tr), e-posta ve telefon yer tutucudur. Kesinleşince:
 *   1. Aşağıdaki değerleri değiştirin.
 *   2. tools/build.mjs içindeki SITE_URL değerini değiştirip `node tools/build.mjs` çalıştırın
 *      (kanonik adresler, Open Graph, yapılandırılmış veri, sitemap.xml, robots.txt yeniden yazılır).
 *   3. api/send-quote.php içindeki $TO_EMAIL ve $FROM_EMAIL değerlerini güncelleyin.
 */
(function (root) {
  const SITE = {
    brand: 'Meira',
    email: 'info@meira.com.tr',
    phone: '+90\u00A0212\u00A0000\u00A000\u00A000', // bölünmez boşluk: numara satır sonunda bölünmez
    phoneHref: '+902120000000',
    city: 'İstanbul, Türkiye'
  };


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
  }

  root.SITE = SITE;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})(window);
