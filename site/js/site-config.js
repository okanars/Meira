/**
 * Site yapılandırması: marka ve iletişim bilgileri tek yerden yönetilir.
 * Sayfadaki [data-site] alanları ve teklif mesajı metni bu değerlerden doldurulur.
 *
 * Alan adı: www.meiraairscent.com. İletişim bilgisi (adres dahil) değişirse:
 *   1. Aşağıdaki değerleri değiştirin.
 *   2. tools/build.mjs içindeki EMAIL (ve alan adı değişirse SITE_URL) değerini değiştirip `node tools/build.mjs` çalıştırın
 *      (footer, kanonik adresler, Open Graph, yapılandırılmış veri, sitemap.xml, robots.txt yeniden yazılır).
 *   3. api/send-quote.php içindeki $TO_EMAIL ve $FROM_EMAIL değerlerini güncelleyin.
 */
(function (root) {
  const SITE = {
    brand: 'Meira',
    email: 'info@meiraairscent.com',
    phone: '+90\u00A0552\u00A0777\u00A019\u00A074', // bölünmez boşluk: numara satır sonunda bölünmez
    phoneHref: '+905527771974',
    // Genel adres (oda sicil kaydı). Altbilgi ve iletişim sayfasında; tools/build.mjs ADDRESS ile aynı tutulmalı
    address: document.documentElement.lang === 'en' ? 'Karakuyu Mah. 92008 Sk. No: 42/7 İç Kapı No: 8, Seyhan / Adana, Türkiye' : 'Karakuyu Mah. 92008 Sk. No: 42/7 İç Kapı No: 8, Seyhan / Adana'
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
