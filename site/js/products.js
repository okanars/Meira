/* Ürün veritabanı: üreticinin (Dongguan Andusic Technology Co. Ltd.) 2025 ürün kataloğundan (İngilizce çeviri) derlenmiştir.
 * [DOĞRULANACAK] FDA, gıda sınıfı malzeme ve güvenlik standardı ifadeleri üretici beyanıdır;
 * sitede "üretici beyanına göre" kalıbıyla verilir. Belge talep edilmeden kesin ifade kullanmayın.
 * Ürün videoları (videos): Meira'nın ilettiği üretici tanıtım videoları, images/products/videos/<file>.mp4
 * ve kapak karesi <file>.jpg / .webp. Başlık (title) ürün adı içermez; özet (summary) videoda gösterileni anlatır. Desenli panellerdeki yazı üreticinin markasıdır.
 * Koku adları: otel ve parfüm markası adları nötr, betimleyici adlarla değiştirildi (RAPOR.md).
 * MEIRA Kozmetik Difüzör Fiyat Listesi 2026'da (son sürüm, Kasım 2026) yer alan ürünlerde (ADS-687, ADS-689, CK-629,
 * CK-644, zemin tipi ADS-687, ADS-685, ADS-620B/640B/670B) model kodu, ölçü, güç, hazne, kapsama ve fiyat bu listeden
 * alınmıştır; katalogla çelişen değerlerde liste esas alınır. Kapsama m³ olarak verilir.
 * price: liste fiyatı (TL, KDV DAHİL; Meira'nın 2026-11-17 tarihli fiyat güncellemesi). Sitede "KDV dahil" ile
 * gösterilir. Seride en düşük ve en yüksek fiyat [min, max]; seri fiyatları variants içinde. Sitede online satış yoktur;
 * teklif adet ve koşullara göre hazırlanır. "Pek yakında" ürünlerde fiyat gösterilmez (veride durur).
 * CK-629'un fiyatı (3.000) eski listeden ve KDV hariçtir; ürün satışa açılırsa güncellenmelidir.
 * Model kodları (2026-11-17): 150 ml kompakt masaüstü model (ck687) ADS-686A/B; zemin tipi kolon (ck686, katalogda
 * CK-686) ADS-687A/B. Sayfa adresleri (urun-ck687 / urun-ck686) arama motorlarında kayıtlı olduğu için değiştirilmedi.
 * CK-628 ön yüz ölçüsü (66 × 212) Meira'nın ilettiği ölçü çiziminden; derinlik 56 mm.
 * pin: katalog sıralamasında en başa alınan ürün (ADS-689).
 * model: fiyat listesindeki tam model numaraları (renk ya da sürüm başına bir kod; teklif listesine ve e-postaya bu yazılır).
 * family: düzyazıda kullanılan kısa aile adı (ör. soru-cevaplarda "ADS-686 ne kadar ses çıkarır?").
 * colors: kartta ve ürün sayfasında gösterilen renk seçenekleri { code, name, hex }; code, o rengin model numarasıdır.
 * options: seri ürünlerde seçilebilen modeller { code, price, cov: [min, max] } (ör. ADS-620B / 640B / 670B).
 * Kategori ve özellikler fiyat listesine göre: "Kurulum: Masaüstü" olanlar (ADS-686, ADS-689, CK-629) ve ADS-685'in
 * yerini alan CK-683 Masaüstü kategorisinde; listede kontrol yöntemi "-" olanlarda (ADS-687 kolon, ADS-620B serisi)
 * uygulama ya da kumanda iddiası yoktur. Görsel ve videolardan özellik çıkarılmaz.
 * ADS-685 2026-11-17'de katalogdan çıkarıldı; yerini CK-683 aldı (ana görsel: dört renkli CK-683 fotoğrafı, eski
 * ads685-g1). urun-ads685.html adresi .htaccess ile urun-ck683.html'e yönlendirilir.
 * premium: metal (alüminyum) gövdeli modeller; katalogda "Premium" filtresiyle ve öne çıkarılarak gösterilir.
 * soon: model kodu CK ile başlayan ürünler ile ADS-622 ve ADS-611 henüz satışta değil; "Pek yakında" etiketiyle
 * gösterilir, kartları tıklanmaz ve teklif listesine eklenmez (CK için dosyanın sonunda atanır; tek bir ürün için
 * soon: false yazılabilir). Satışta olan CK modelleri: CK-683, CK-644.
 * CK-611/612/613 ve CK-621/622/623 serileri katalogdan çıkarıldı (2026-11).
 * Esanslar: sitede ESSENCES gösterilir (dosyanın sonu). SCENTS ve OILS eski taslak veridir, sitede kullanılmaz. */
const CATEGORIES = [
  { id: 'all',   label: 'Tüm Ürünler' },
  { id: 'wall',  label: 'Duvar Tipi Difüzörler' },
  { id: 'pro',   label: 'Profesyonel & Klima Bağlantılı' },
  { id: 'plug',  label: 'Prize Takılan & Pasif' },
  { id: 'home',  label: 'Masaüstü & Taşınabilir' }
];

const COMMON_USE_COMMERCIAL = 'Otel lobisi, otel koridoru, restoran, bar, eğlence mekânı, toplantı salonu, showroom, galeri, güzellik salonu, zincir mağaza, sinema';
const COMMON_USE_SMALL = 'Otel odası, banyo, güzellik salonu, oturma odası, ofis, asansör, koridor ve merdiven boşluğu, evcil hayvan alanı';

const PRODUCTS = [
  {
    id: 'ck628', model: 'CK-628', cat: 'wall', badge: 'Akıllı kumanda',
    title: 'Ultrasonik Akıllı Duvar Difüzörü',
    short: 'Ultrasonik teknolojiyle çalışan, 300 m³ kapsamalı kompakt duvar difüzörü; uzaktan kumandalı, ışık sensörlü ve LCD ekranlı seçenekleri bulunur.',
    desc: 'Ultrasonik atomizasyon, esansı hızlı ve homojen biçimde havaya yayar. Cihaz dört adet AA pil ya da Type-C 6V adaptörle çalışır; uzaktan kumandalı, ışık sensörlü ve LCD dijital ekranlı seçenekleriyle farklı kullanım ihtiyaçlarına uyum sağlar. Gövde, yüksek sıcaklığa dayanıklı PP malzemeden üretilmiştir; üretici beyanına göre bu malzeme gıda sınıfındadır, koku yapmaz, toksik değildir ve FDA dahil uluslararası güvenlik standartlarına uygundur. Yapışkan bantla yaklaşık üç saniyede, duvarda iz bırakmadan monte edilir.',
    img: 'ck628', pos: '40% 50%', gallery: 7,
    features: ['Ultrasonik atomizasyon', 'Uzaktan kumanda ya da elle kontrol', 'Sessiz çalışma (<8 dBA)', 'Pil ya da Type-C ile çalışma', 'Duvarda ya da masada kullanım', 'Zamanlı püskürtme', 'Değiştirilebilir ultrasonik plaka'],
    variants: ['CK-628A (Beyaz)', 'CK-628B (Siyah)', 'Akıllı kumanda: CK-628-YK', 'LED ışık algılama: CK-628-LED', 'LCD dijital ekran: CK-628-LCD'],
    colors: [{ code: 'CK-628A', name: 'Beyaz', hex: '#F3F2EE' }, { code: 'CK-628B', name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '66 × 56 × 212 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP (gıda sınıfı)'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '< 8 dBA'], ['Esans kapasitesi', '168 ml'], ['Kapsama alanı', '300 m³'], ['Güç kaynağı', '4 × AA pil / Type-C 6V'], ['Net ağırlık', '223 g'], ['Koli', '50 adet · 493×395×380 mm · 14,8 kg brüt']],
    use: COMMON_USE_SMALL
  },
  {
    id: 'ck629', model: 'CK-629A-APP / CK-629B-APP', family: 'CK-629', price: 3000, cat: 'home',
    title: '300 ml Ultrasonik Akıllı Difüzör',
    short: 'Bluetooth uygulamayla yönetilen, 300 ml hazneli ultrasonik difüzör; 300-800 m³ kapsama.',
    desc: 'Ultrasonik atomizasyon, esansı ince bir sis hâlinde havaya verir; cihaz Bluetooth mobil uygulama üzerinden yönetilir. PP gövdeli model DC 6V ile 2 W güç çeker, 35 dB’i aşmayan bir ses seviyesinde çalışır ve 300 ml esans haznesiyle 300-800 m³’lük bir alanı kokulandırır. Beyaz ve siyah renk seçenekleri vardır.',
    img: 'ck629', pos: '50% 50%', gallery: 2,
    features: ['Ultrasonik atomizasyon', 'Bluetooth uygulama kontrolü', 'Sessiz çalışma (≤35 dB)', '300 ml esans haznesi'],
    variants: ['CK-629A-APP (Beyaz)', 'CK-629B-APP (Siyah)'],
    colors: [{ code: 'CK-629A-APP', name: 'Beyaz', hex: '#F3F2EE' }, { code: 'CK-629B-APP', name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '175 × 65 × 290 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '300 ml'], ['Kapsama alanı', '300-800 m³'], ['Kontrol', 'Bluetooth uygulama'], ['Kurulum', 'Masaüstü']],
    use: COMMON_USE_SMALL
  },
  {
    id: 'ck638', model: 'CK-638', cat: 'wall',
    title: 'Ultrasonik Duvar Difüzörü (LED / LCD)',
    short: 'Korozyona dayanıklı PP gövdeli, ışık sensörlü ve LCD kontrol panelli seçenekleri bulunan ultrasonik difüzör; 300 m³ kapsama.',
    desc: 'CK-638, ultrasonik atomizasyonla esansı hızla yayar. Uzaktan kumandalı, ışık sensörlü ve LCD dijital kontrol panelli seçenekleri bulunur. Gövdesi korozyona dayanıklı PP malzemeden üretilmiştir; üretici beyanına göre bu malzeme gıda sınıfındadır ve FDA standartlarına uygundur. İz bırakmayan yapışkan bantla yaklaşık üç saniyede monte edilir.',
    img: 'ck638', pos: '40% 50%', gallery: 11,
    features: ['Ultrasonik atomizasyon', 'Uzaktan kumanda ya da elle kontrol', 'Sessiz çalışma', 'Pil ya da Type-C ile çalışma', 'Duvarda ya da masada kullanım', 'Zamanlı püskürtme', 'Değiştirilebilir ultrasonik plaka'],
    variants: ['CK-638A', 'CK-638B', 'Akıllı kumanda: CK-638-YK', 'LED: CK-638-LED', 'LCD: CK-638-LCD'],
    colors: [{ name: 'Beyaz', hex: '#F3F2EE' }, { name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '85 × 65 × 180 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP (gıda sınıfı)'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '< 8 dBA'], ['Esans kapasitesi', '168 ml'], ['Kapsama alanı', '300 m³'], ['Güç kaynağı', '4 × AA pil / Type-C 6V'], ['Net ağırlık', '255 g'], ['Koli', '50 adet · 493×395×380 mm · 14,8 kg brüt']],
    use: COMMON_USE_SMALL
  },
  {
    id: 'ck648', model: 'CK-648', cat: 'wall',
    title: 'Ultrasonik Duvar Difüzörü (3 Renk)',
    short: 'Üç renk seçeneğiyle farklı iç mekânlara uyum sağlayan kompakt ultrasonik difüzör; 300 m³ kapsama.',
    desc: 'Hafif ve taşınabilir tasarımı sayesinde kolayca konumlandırılır. Uzaktan kumandalı, ışık sensörlü ve LCD dijital ekranlı seçenekleri vardır. Gövde, yüksek sıcaklığa dayanıklı PP malzemeden üretilmiştir; üretici beyanına göre bu malzeme gıda sınıfındadır, koku yapmaz, toksik değildir ve FDA standartlarına uygundur.',
    img: 'ck648', pos: '40% 50%', gallery: 9,
    features: ['Ultrasonik atomizasyon', 'Uzaktan kumanda ya da elle kontrol', 'Sessiz çalışma', 'Pil ya da Type-C ile çalışma', 'Duvarda ya da masada kullanım', 'Zamanlı püskürtme'],
    variants: ['CK-648A', 'CK-648B', 'CK-648C', 'Akıllı kumanda: CK-648-YK', 'LED: CK-648-LED', 'LCD: CK-648-LCD'],
    specs: [['Boyut', '85 × 65 × 180 mm'], ['Renk', 'Beyaz / Siyah / Siyah (alternatif)'], ['Malzeme', 'PP (gıda sınıfı)'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '< 8 dBA'], ['Esans kapasitesi', '168 ml'], ['Kapsama alanı', '300 m³'], ['Güç kaynağı', '4 × AA pil / Type-C 6V'], ['Net ağırlık', '255 g'], ['Koli', '50 adet · 493×395×380 mm · 14,4 kg brüt']],
    use: 'Eğlence mekânı, otel odası, banyo, güzellik salonu, oturma odası, ofis, asansör, koridor ve merdiven boşluğu, evcil hayvan alanı'
  },
  {
    id: 'ck688', model: 'CK-688', cat: 'wall', badge: 'Ultra İnce',
    title: 'Çift Akışkanlı Büyük Alan Difüzörü',
    short: 'Yalnızca 5,3 cm kalınlığındaki gövdesi, 500 ml haznesi ve uygulama kontrolüyle 800 m³ kapsama.',
    desc: 'Çift akışkanlı atomizasyon, esansı hızlı ve homojen biçimde dağıtır. Dört adet AA pil ya da Type-C 6V adaptörle çalışır; uzaktan kumanda ve mobil uygulama ile yönetilir. Gövdesi yüksek sıcaklığa ve korozyona dayanıklı PP malzemeden üretilmiştir; üretici beyanına göre bu malzeme gıda sınıfındadır ve FDA standartlarına uygundur. Yaklaşık üç saniyede, duvarda iz bırakmadan monte edilir.',
    img: 'ck688', pos: '35% 50%', gallery: 12,
    features: ['Çift akışkanlı atomizasyon', 'Uzaktan kumanda ve mobil uygulama', 'Sessiz çalışma (<36 dB)', 'Pil ya da adaptörle çalışma', 'İz bırakmayan duvar montajı', 'Zamanlı püskürtme', 'Yalnızca 5,3 cm kalınlık'],
    variants: ['CK-688A (Beyaz)', 'CK-688B (Siyah)'],
    colors: [{ code: 'CK-688A', name: 'Beyaz', hex: '#F3F2EE' }, { code: 'CK-688B', name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '168 × 53 × 240 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP (gıda sınıfı)'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '< 36 dB'], ['Esans kapasitesi', '500 ml'], ['Kapsama alanı', '800 m³'], ['Güç kaynağı', '4 × AA pil / Type-C 6V'], ['Net ağırlık', '618 g'], ['Koli', '32 adet · 480×360×600 mm · 24,5 kg brüt']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck689', model: 'ADS-689B / ADS-689-YK', family: 'ADS-689', price: 20000, cat: 'home', pin: true,
    title: 'Çift Akışkanlı Ultra İnce Difüzör',
    short: 'Bluetooth uygulama ya da kablosuz kumandayla yönetilen ince gövdeli difüzör; 500 ml hazne, 600-800 m³ kapsama ve 35 dB’i aşmayan sessiz çalışma.',
    desc: 'Çift akışkanlı atomizasyon, esansı hızlı ve homojen biçimde yayar. İki sürümü vardır: Bluetooth uygulamayla yönetilen ADS-689B ve kablosuz kumandalı ADS-689-YK. ABS ve PP gövde yüksek sıcaklığa dayanıklıdır; üretici beyanına göre malzeme koku yapmaz, toksik değildir ve FDA standartlarına uygundur. 500 ml esans haznesiyle 600-800 m³’lük alanlar için uygundur.',
    img: 'ck689', pos: '35% 50%', gallery: 3,
    features: ['Çift akışkanlı atomizasyon', 'Bluetooth uygulama ya da kablosuz kumanda', 'Sessiz çalışma (≤35 dB)', 'Pil ya da adaptörle çalışma', 'Zamanlı püskürtme', 'Özel tasarım seçeneği'],
    variants: ['ADS-689B · Bluetooth uygulama (Beyaz / Siyah)', 'ADS-689-YK · Kablosuz kumanda (Beyaz / Siyah)'],
    colors: [{ name: 'Beyaz', hex: '#F3F2EE' }, { name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '168 × 53,8 × 240 mm'], ['Renk', 'Beyaz / Siyah (opsiyonel)'], ['Malzeme', 'ABS + PP'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '500 ml'], ['Kapsama alanı', '600-800 m³'], ['Kontrol', 'Bluetooth uygulama (ADS-689B) / kablosuz kumanda (ADS-689-YK)'], ['Kurulum', 'Masaüstü'], ['Güç kaynağı', '4 × AA pil / Type-C 6V'], ['Net ağırlık', '536 g'], ['Koli', '32 adet · 480×360×600 mm · 21,6 kg brüt']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck687', model: 'ADS-686A / ADS-686B', family: 'ADS-686', price: 15000, cat: 'home',
    title: 'Kompakt Çift Akışkanlı Difüzör',
    short: 'Yenilenmiş ekran paneline ve Bluetooth uygulama kontrolüne sahip, 150 ml hazneli kompakt difüzör; 300-600 m³ kapsama.',
    desc: 'Çift akışkanlı atomizasyon, esansı hızlı ve eşit biçimde dağıtır. Bluetooth mobil uygulama ve yenilenmiş ekran paneli sayesinde kullanımı kolaydır. Gövde, yüksek sıcaklığa dayanıklı PP malzemeden üretilmiştir; üretici beyanına göre bu malzeme gıda sınıfındadır ve FDA dahil uluslararası standartlara uygundur.',
    img: 'ck687', pos: '40% 50%', gallery: 22,
    videos: [{ file: 'ck687-kurulum', duration: 65, title: 'Kurulumdan çalışma programına', teaser: 'Cihazın hazırlanmasını ve uygulamadan haftalık çalışma programı kurmayı adım adım izleyin.', summary: 'Pillerin ve esans şişesinin takılması gösteriliyor. Ardından ekrandaki ayar tuşları ve telefon uygulamasında haftalık çalışma programının nasıl oluşturulduğu adım adım anlatılıyor. Son bölümde cihaz masa üzerinde, prize bağlı olarak kullanılıyor.' }],
    features: ['Çift akışkanlı atomizasyon', 'Bluetooth uygulama kontrolü', 'Yenilenmiş ekran paneli', 'Sessiz çalışma (≤35 dB)', 'Zamanlı püskürtme'],
    variants: ['ADS-686A (Beyaz)', 'ADS-686B (Siyah)'],
    colors: [{ code: 'ADS-686A', name: 'Beyaz', hex: '#F3F2EE' }, { code: 'ADS-686B', name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '148 × 67 × 185 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '150 ml'], ['Kapsama alanı', '300-600 m³'], ['Kontrol', 'Bluetooth uygulama, yenilenmiş ekran paneli'], ['Kurulum', 'Masaüstü'], ['Net ağırlık', '512 g'], ['Koli', '30 adet · 465×385×490 mm · 19 kg brüt']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck631', model: 'CK-631', cat: 'pro', badge: 'Profesyonel',
    title: 'Hava Pompalı Klima Bağlantılı Difüzör',
    short: 'Dahili hava pompası, 800 ml hazne ve 3.500 m³ kapsama; Bluetooth ya da WiFi ile kontrol.',
    desc: 'Dahili hava pompasıyla çalışan ve klima (HVAC) sistemlerine entegre edilebilen bir difüzör. Çalışma saatleri ve koku yoğunluğu telefon üzerinden hassas biçimde ayarlanır. Kızılötesi yağ seviyesi algılama ve soğuk hava difüzyonu özellikleri sunar. Gövde gıda sınıfı PP malzemeden üretilmiştir; üretici beyanına göre FDA standartlarına uygundur.',
    img: 'ck631', pos: '40% 50%', gallery: 3,
    features: ['Bluetooth / WiFi ile uzaktan kontrol', 'Güçlü atomizasyon', 'Dahili hava pompası', '24 saatlik akıllı zamanlayıcı', 'Klima (HVAC) bağlantısı', 'Kızılötesi yağ seviyesi algılama', 'Soğuk hava difüzyonu'],
    variants: ['CK-631A (Beyaz)', 'CK-631B (Siyah)'],
    colors: [{ code: 'CK-631A', name: 'Beyaz', hex: '#F3F2EE' }, { code: 'CK-631B', name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '265 × 115 × 252 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP (gıda sınıfı)'], ['Gerilim / Güç', 'DC 12V / 12W'], ['Ses seviyesi', '< 42 dBA'], ['Esans kapasitesi', '800 ml'], ['Kapsama alanı', '3.500 m³'], ['Güç girişi', 'Type-C'], ['Koli', '36 adet · 480×360×600 mm']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck620', model: 'ADS-620B / ADS-640B / ADS-670B', family: 'ADS-620B / 640B / 670B', price: [25000, 50000], cat: 'pro', badge: 'Seri',
    title: 'Yüksek Hacimli Sis Difüzör Serisi',
    short: 'Zemine yerleştirilen ve klima (HVAC) sistemine bağlanabilen metal gövdeli seri; 1000 ml hazne, 2.000-12.000 m³ kapsama.',
    desc: 'Yüksek sis hacmi sayesinde koku, cihaz çalışmaya başladıktan kısa süre sonra mekâna yayılır. Zemine yerleştirilir ve merkezi klima (HVAC) sistemine bağlanabilir. 35 dB’i aşmayan sessiz çalışmasının yanı sıra tak-çıkar atomizer başlığı ve manyetik kilidi sayesinde bakımı da kolaydır. Üç kapasite seçeneğiyle 2.000 m³’ten 12.000 m³’e kadar alanlar için uygun model seçilebilir.',
    img: 'ck620', pos: '50% 50%', gallery: 11, premium: true,
    // Seri içinde seçilebilen modeller: kartta ve ürün sayfasında seçici; fiyat ve kapsama seçime göre değişir,
    // teklif listesine seçilen kod yazılır. price (yukarıda) en düşük-en yüksek aralığı olarak kalır.
    options: [
      { code: 'ADS-620B', price: 25000, cov: [2000, 5000] },
      { code: 'ADS-640B', price: 30000, cov: [4000, 8000] },
      { code: 'ADS-670B', price: 50000, cov: [7000, 12000] }
    ],
    features: ['Yüksek sis hacmi', 'Sessiz çalışma (≤35 dB)', 'Zemine yerleştirme', '1000 ml hazne', 'Klima (HVAC) bağlantısı', 'Metal gövde'],
    // [DOĞRULANACAK] Listede ADS-640B ve ADS-670B için aynı ölçü (428×128×372 mm) verilmiş.
    variants: ['ADS-620B · 328×128×372 mm · 12W · 2.000-5.000 m³ · 25.000 TL (KDV dahil)', 'ADS-640B · 428×128×372 mm · 15W · 4.000-8.000 m³ · 30.000 TL (KDV dahil)', 'ADS-670B · 428×128×372 mm · 18W · 7.000-12.000 m³ · 50.000 TL (KDV dahil)'],
    colors: [{ name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '328 / 428 / 428 × 128 × 372 mm'], ['Renk', 'Siyah'], ['Malzeme', 'Metal'], ['Gerilim', 'DC 12V'], ['Güç', '12W / 15W / 18W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '1000 ml'], ['Kapsama alanı', '2.000-5.000 / 4.000-8.000 / 7.000-12.000 m³'], ['Kurulum', 'Zemin; klima (HVAC) sistemine bağlanabilir'], ['Koli', '1 adet']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck686', model: 'ADS-687A / ADS-687B', family: 'ADS-687 kolon', price: 50000, cat: 'pro', badge: 'Kolon',
    title: 'Nano Atomizasyonlu Kolon Difüzör',
    short: 'Zeminde ayakta duran alüminyum kolon difüzör; 1000 ml hazne ve 4.000 m³ kapsama.',
    desc: 'Zeminde ayakta duran, taş dokulu atomizer başlığıyla dikkat çeken kolon tipi ticari difüzör. Tak-çıkar atomizer sayesinde esans değişimi kolaydır; manyetik kilit mekanizması başlığı güvenle sabitler. 1000 ml esans haznesi ve nano sis teknolojisiyle 4.000 m³’lük alanları kokulandırır; taze hava sistemine de bağlanabilir.',
    img: 'ck686', pos: '50% 35%', gallery: 3, premium: true,
    // Videoda ürün üreticinin "M63" koduyla ve 1000 ml olarak tanıtılıyor (fiyat listesiyle uyumlu).
    videos: [{ file: 'ck686-tanitim', duration: 101, title: 'Tasarım ayrıntıları ve sis çıkışı', teaser: 'Alüminyum gövdenin ayrıntılarını, esans değişimini ve yoğun sis çıkışını yakından görün.', summary: 'Alüminyum gövdenin ayrıntıları, çıkarılabilir atomizer başlığı ve esans şişesinin değiştirilmesi yakından gösteriliyor. Ardından cihazın yoğun ve dengeli sis çıkışı izleniyor.' }],
    features: ['Nano atomizasyon', 'Sessiz çalışma (≤35 dB)', 'Adaptörle çalışma (DC 12V)', 'Taze hava sistemine bağlanabilir', '1000 ml hazne'],
    variants: ['ADS-687A (Beyaz)', 'ADS-687B (Siyah)'],
    colors: [{ code: 'ADS-687A', name: 'Beyaz', hex: '#F3F2EE' }, { code: 'ADS-687B', name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '575 × 115 × 160 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'Alüminyum alaşım'], ['Gerilim / Güç', 'DC 12V / 12W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '1000 ml'], ['Kapsama alanı', '4.000 m³'], ['Kurulum', 'Zemin (ayakta durur)']],
    use: COMMON_USE_COMMERCIAL + ', satış salonu'
  },
  {
    id: 'ck683', model: 'CK-683', family: 'CK-683', price: 25000, cat: 'home', badge: 'Pilli', soon: false,
    title: 'Kompakt Alüminyum Çift Akışkanlı Difüzör',
    short: '5000 mAh dahili pili, Bluetooth kontrolü ve 300 m³ kapsamasıyla kablosuz kullanılabilen alüminyum difüzör.',
    desc: 'Kompakt gövdesi sayesinde az yer kaplar ve kolayca taşınır. 5000 mAh dahili pili, cihazın prize bağlı kalmadan uzun süre çalışmasını sağlar; 300 m³’lük alanları kokulandırır. Ayarlar Bluetooth bağlantısıyla kolayca yönetilir; Type-C şarj girişi ve su geçirmez dokunmatik kontrol paneli bulunur.',
    img: 'ck683', pos: '50% 50%', gallery: 19, premium: true,
    // Ana görsel (ck683.jpg) dört renkli fotoğraf (eski ads685-g1); eski ana görsel ck683-g1, eski g1-g18 ise g2-g19 oldu.
    // Üreticinin İngilizce tanıtım görselleri (images/products/ck683-b<n>.jpg / .webp / -960.webp).
    // [DOĞRULANACAK] Görsellerdeki değerler (Ø94×318 mm, 120 ml, 4000 sq ft) katalogla çelişiyor; teknik veriler katalogdan.
    banners: [
      'Modern bir salonda sehpa üzerinde siyah difüzör ve telefon uygulaması; evde otel atmosferi',
      'Kitaplıklı bir çalışma odasında difüzör; ev, otel, AVM, kafe, yemekhane ve ofis kullanım alanları',
      'Siyah difüzör ve özellikleri: 5000 mAh pil, alüminyum gövde, zamanlı püskürtme, uygulama ve kumanda kontrolü',
      'Salonda çalışan difüzör; Bluetooth uygulaması, uzaktan kumanda ve düğmeyle üç kontrol yöntemi',
      'Sehpa üzerinde difüzör; yedi renkli taban ışığı, zamanlayıcı ve üç yoğunluk seviyesi',
      'Çalışma masasında difüzör; 5000 mAh dahili pil ve Type-C şarj girişi',
      'Bir dairenin kesit çiziminde ortada çalışan difüzör; kapsama alanı gösterimi',
      'Bir kafede tezgâh üzerinde çalışan difüzör',
      'Yatak odasında komodin üzerinde çalışan difüzör',
      'Ailenin ve köpeğin oturduğu salonda sehpa üzerinde çalışan difüzör',
      'Yatak odasında komodin üzerinde difüzör ve üreticinin ürün parametreleri tablosu'
    ],
    videos: [{ file: 'ck683-tanitim', duration: 76, title: 'Prize bağlı kalmadan, her yerde', teaser: 'Kablosuz kullanımı, saniyeler süren esans değişimini ve güvenlik sensörünü yakından görün.', summary: 'Dahili pili sayesinde kablosuz çalışan cihaz kutusundan çıkarılıyor. Esans şişesinin birkaç saniyede değiştirilmesi, cihaz devrildiğinde çalışmayı durduran güvenlik sensörü ve hem uzaktan kumandayla hem de telefon uygulamasıyla yapılan ayarlar gösteriliyor.' }],
    features: ['Çift akışkanlı atomizasyon', 'Bluetooth uygulama kontrolü', 'Sessiz çalışma (≤38 dB)', 'Dahili pil (5000 mAh)', 'Type-C şarj girişi', 'Su geçirmez dokunmatik kontrol'],
    variants: ['Bronz', 'Siyah', 'Kahverengi', 'Yeşil'],
    colors: [{ name: 'Bronz', hex: '#9C8468' }, { name: 'Siyah', hex: '#1C1C1E' }, { name: 'Kahverengi', hex: '#A8603A' }, { name: 'Yeşil', hex: '#6B7556' }],
    specs: [['Boyut', 'Ø92 × 305 mm'], ['Renk', 'Bronz / Siyah / Kahverengi / Yeşil'], ['Malzeme', 'Alüminyum alaşım'], ['Gerilim / Güç', 'DC5V-2A (Type-C) / 8W'], ['Pil', '5000 mAh'], ['Ses seviyesi', '≤ 38 dB'], ['Esans kapasitesi', '110 ml'], ['Kapsama alanı', '300 m³'], ['Net ağırlık', '0,82 kg']],
    use: COMMON_USE_COMMERCIAL + ', satış salonu'
  },
  {
    id: 'ck644', model: 'CK-644A / CK-644B', family: 'CK-644', price: 15000, cat: 'plug', badge: 'Prize Takılan', soon: false,
    title: 'Akıllı Bluetooth Prize Difüzörü',
    short: 'Prize takılarak duvarda çalışan, Bluetooth kontrollü difüzör; 100 ml hazne ve 100-300 m³ kapsama.',
    desc: 'Hafif PP gövdesi ve tak-çalıştır tasarımı sayesinde prize takıldığı anda kullanıma hazırdır. Duvarı delmeye gerek kalmadan doğrudan prize takılır; farklı priz tiplerine uygun üç fiş seçeneği sunar. Çalışma ayarları Bluetooth mobil uygulama üzerinden yönetilir.',
    img: 'ck644', pos: '40% 50%', gallery: 10,
    videos: [
      { file: 'ck644-siyah-kurulum', label: 'Siyah', duration: 60, title: 'Prize takın, uygulamadan yönetin', teaser: 'Prize takıldığı anda çalışan cihazın uygulama ayarlarını ve gece modunu izleyin.', summary: 'Esans şişesinin değiştirilmesi, cihazın prize takılması ve çalışma saatlerinin telefon uygulamasından ayarlanması gösteriliyor. Uygulamada beş farklı çalışma programına kadar tanımlama yapılabiliyor. Video, karanlık ortamlar için tasarlanan gece moduyla sona eriyor.' },
      { file: 'ck644-beyaz-kurulum', label: 'Beyaz', duration: 59, title: 'Prize takın, uygulamadan yönetin', teaser: 'Prize takıldığı anda çalışan cihazın uygulama ayarlarını ve gece modunu izleyin.', summary: 'Esans şişesinin değiştirilmesi, cihazın prize takılması ve çalışma saatlerinin telefon uygulamasından ayarlanması gösteriliyor. Uygulamada beş farklı çalışma programına kadar tanımlama yapılabiliyor. Video, karanlık ortamlar için tasarlanan gece moduyla sona eriyor.' }
    ],
    features: ['Çift akışkanlı atomizasyon', 'Bluetooth uygulama kontrolü', 'Sessiz çalışma (≤35 dB)', 'Tak ve çalıştır', 'Duvara zarar vermez'],
    variants: ['CK-644A (Beyaz)', 'CK-644B (Siyah)', 'İki pimli / Avrupa tipi iki yuvarlak pimli / üç pimli fiş'],
    colors: [{ code: 'CK-644A', name: 'Beyaz', hex: '#F3F2EE' }, { code: 'CK-644B', name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '150 × 73 × 235 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP'], ['Gerilim / Güç', 'DC 6V / 5W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '100 ml'], ['Kapsama alanı', '100-300 m³'], ['Kontrol', 'Bluetooth uygulama'], ['Kurulum', 'Duvara monte (prize takılır)']],
    use: 'Ev, banyo, asansör, koridor'
  },
  {
    id: 'ck645', model: 'CK-645', cat: 'plug', badge: 'Prize Takılan',
    title: 'İnce Gövdeli Akıllı Priz Difüzörü',
    short: 'Bluetooth ya da akıllı mod seçenekli, 100 ml hazneli ince priz difüzörü; üç fiş seçeneği.',
    desc: 'Hafif PP gövdeli ve sade tasarımlı bir priz difüzörü. Duvarı delmeye gerek kalmadan farklı priz tiplerine takılır. Bluetooth sürümü ve akıllı sürüm (24 saat modu ya da ışık algılama) olmak üzere iki seçeneği vardır.',
    img: 'ck645', pos: '30% 50%', gallery: 0,
    features: ['Çift akışkanlı atomizasyon', 'Bluetooth ya da elle kontrol', 'Sessiz çalışma (<38 dB)', 'Tak ve çalıştır', 'Duvara zarar vermez', '24 saat modu'],
    variants: ['CK-645A (Beyaz)', 'CK-645B (Siyah)'],
    colors: [{ code: 'CK-645A', name: 'Beyaz', hex: '#F3F2EE' }, { code: 'CK-645B', name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '70 × 61 × 270 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP'], ['Gerilim / Güç', '100-240V / 2,5W'], ['Ses seviyesi', '< 38 dB'], ['Esans kapasitesi', '100 ml'], ['Kapsama alanı', '300 m³'], ['Koli', '6 adet']],
    use: 'Ev, banyo, asansör, koridor'
  },
  {
    id: 'ck608d', model: 'CK-608D', cat: 'home', badge: 'Araç & Ev',
    title: 'Araç ve Ev Tipi Taşınabilir Difüzör (Rose Gold)',
    short: 'Bej ve rose gold renk seçenekli, 2000 mAh pilli, 5-20 ml hazneli taşınabilir difüzör.',
    desc: 'Kompakt ve şık tasarımıyla evde de araçta da kullanılabilir. 2000 mAh pili sayesinde uzun süre kablosuz çalışır.',
    img: 'ck608d', pos: '50% 50%', gallery: 0,
    features: ['Ultrasonik atomizasyon', 'Tek tuşla kontrol', 'Sessiz çalışma'],
    variants: ['Bej', 'Rose Gold'],
    colors: [{ name: 'Bej', hex: '#E2D2BA' }, { name: 'Rose Gold', hex: '#D8A595' }],
    specs: [['Boyut', '71 × 138 mm'], ['Renk', 'Bej / Rose Gold'], ['Malzeme', 'ABS'], ['Güç', 'DC5V-0,5A / 2,5W'], ['Pil', '2000 mAh'], ['Esans kapasitesi', '5 - 20 ml'], ['Kapsama alanı', '100 m³'], ['Koli', '60 adet']],
    use: 'Yatak odası, çalışma odası, oturma odası, araç'
  },
  {
    id: 'ads622', model: 'ADS-622', cat: 'home', badge: 'Dekoratif', soon: true,
    title: 'Masif Ahşap Tabanlı Aroma Difüzörü',
    short: 'Cam gövdeli, masif ahşap tabanlı ve yedi renkli gece lambalı aroma difüzörü; Type-C ile şarj edilir.',
    desc: 'Sessiz çalışan ve zamanlayıcılı bu aroma difüzörü, masif ahşap tabanı ve renkli gece lambasıyla dekoratif bir obje olarak da öne çıkar. Type-C ile şarj edilir; telefon şarj adaptörü, powerbank ya da dizüstü bilgisayarla beslenebilir. Üretici beyanına göre güvenli malzemelerden üretilmiştir.',
    img: 'ads622', pos: '50% 50%', gallery: 0,
    features: ['Sessiz çalışma ve zamanlayıcı', 'Type-C şarj', 'Güvenli malzeme', 'Masif ahşap taban', 'Renkli gece lambası'],
    variants: [],
    specs: [['Boyut', '105 × 105 × 150 mm'], ['Malzeme', 'Masif ahşap + cam'], ['Işık', '7 renk geçişli + sabit ışık'], ['Güç / Gerilim', '5W / DC5V-1A'], ['Pil', '2000 mAh'], ['Ağırlık', '375 g'], ['Kapsama alanı', '50 m²']],
    use: 'Yatak odası, çalışma odası, oturma odası'
  },
  {
    id: 'ads611', model: 'ADS-611', cat: 'home', badge: 'Dekoratif', soon: true,
    title: 'Kum Saati Tasarımlı Aroma Difüzörü',
    short: 'Cam ve masif ahşap gövdeli, yedi renkli ışıklı aroma difüzörü; üç renk seçeneği (A/B/C).',
    desc: 'Kum saatini andıran formu, masif ahşap tabanı ve renkli gece lambasıyla kompakt ve dekoratif bir aroma difüzörü. Type-C ile şarj edilir, sessiz çalışır ve zamanlayıcısı vardır.',
    img: 'ads611', pos: '50% 50%', gallery: 0,
    features: ['Sessiz çalışma ve zamanlayıcı', 'Type-C şarj', 'Güvenli malzeme', 'Masif ahşap taban', 'Renkli gece lambası'],
    variants: ['ADS-611A', 'ADS-611B', 'ADS-611C'],
    specs: [['Boyut', '78 × 78 × 150 mm'], ['Malzeme', 'Masif ahşap + cam'], ['Işık', '7 renk geçişli + sabit ışık'], ['Güç / Gerilim', '5W / DC5V-1A'], ['Pil', '2000 mAh'], ['Ağırlık', '300 g'], ['Kapsama alanı', '50 m²']],
    use: 'Yatak odası, çalışma odası, oturma odası'
  },
];

// Satış durumu: CK kodlu modeller henüz satışta değil (bkz. dosya başı); ADS-622 ve ADS-611 kayıtlarında soon: true. Ürün kaydında soon: false yazılarak
// tek tek açılabilir.
PRODUCTS.forEach(p => { if (p.soon === undefined) p.soon = /^CK/.test(p.model); });

// Katalog sırası (katalog ızgarası, tools/build.mjs ve urunler.html aynı işlevi kullanır): önce satıştaki ürünler,
// "pek yakında"lar en sonda; her grupta öne alınan (pin: true) ürün en başta, sonra videolu ürünler, ardından
// premium (metal gövdeli) modeller; eşitlikte veri sırası.
function catalogOrder(list) {
  return list
    .map((p, i) => [p, i])
    .sort(([a, i], [b, j]) => (!!a.soon - !!b.soon) || (!!b.pin - !!a.pin) || (!!b.videos - !!a.videos) || (!!b.premium - !!a.premium) || i - j)
    .map(([p]) => p);
}

const SCENTS = [
  { name: 'Yasemin & Vanilya', family: 'Çiçeksi · Pudralı', top: 'Portakal, limon', mid: 'Leylak, yasemin, gül, ylang-ylang', base: 'Vanilya, misk' },
  { name: 'Gardenya Beyaz Çay', family: 'Ferah · Çiçeksi', top: 'Beyaz çay', mid: 'Gardenya, yeşil çay, zencefil', base: 'Beyaz misk' },
  { name: 'Falling in Love with Paris', family: 'Çiçeksi · Meyvemsi', top: 'Ananas, manolya, şeftali, limon', mid: 'Papatya, menekşe, yasemin, gül', base: 'Vanilya, misk' },
  { name: 'Bergamot & Sandal Ağacı', family: 'Çiçeksi · Odunsu', top: 'Limon, bergamot, hindistan cevizi', mid: 'Yasemin, vadi zambağı', base: 'Sandal, amber, meşe yosunu' },
  { name: 'Encountering White Tea', family: 'Ferah · Çay', top: 'Yeşil çay, limon, mandalina', mid: 'Beyaz çay', base: 'Beyaz amber, misk' },
  { name: 'Beyaz Gül & Misk', family: 'Ferah · Çay', top: 'Aldehit, narenciye', mid: 'Yasemin, vadi zambağı, beyaz gül', base: 'Misk' },
  { name: 'Frenk Üzümü & İris', family: 'Narenciye · Odunsu', top: 'Siyah frenk üzümü, Sicilya bergamotu', mid: 'Portakal çiçeği, iris, sedir', base: 'Sandal, amber, meşe yosunu' },
  { name: 'Stellar Encounters', family: 'Meyvemsi · Ferah', top: 'Greyfurt, elma', mid: 'Beyaz çiçekler, yasemin, gül', base: 'Misk' },
  { name: 'Kiraz & Beyaz Çiçek', family: 'Çiçeksi · Baharatlı', top: 'Kiraz, limon, bergamot', mid: 'Beyaz çiçek, gül, hindistan cevizi', base: 'Sandal, amber, misk' },
  { name: 'Gül & Sedir', family: 'Gül · Odunsu', top: 'Portakal, limon', mid: 'Gül, lavanta', base: 'Sedir, amber' },
  { name: 'Fougère No. 2', family: 'Ferah · Lavanta', top: 'Taze narenciye', mid: 'Lavanta, papatya, gül', base: 'Beyaz misk, amber' },
  { name: 'Misket Limonu & Adaçayı', family: 'Narenciye · Tatlı', top: 'Limon, misket limonu', mid: 'Adaçayı, biberiye, portakal çiçeği', base: 'Kar çamı, amber' }
];

const OILS = [
  { code: 'ADS-168', name: 'Esans Kartuşu', note: '168 ml · 72 adet/koli', type: 'Esans' },
  { code: 'ADS-500W', name: 'Difüzör Esansı', note: '500 ml · 12 adet/koli', type: 'Esans' },
  { code: 'ADS-5000W', name: 'Difüzör Esansı', note: '5 L · 2 adet/koli', type: 'Esans' },
  { code: 'ADS-500', name: 'Suda Çözünür Esans', note: '500 ml · 12 adet/koli', type: 'Esans' },
  { code: 'ADS-5000Y', name: 'Suda Çözünür Esans', note: '5 L · 2 adet/koli', type: 'Esans' },
  { code: 'ADS-103', name: 'Koku Giderici Poşet', note: '100 adet/koli', type: 'Koku Giderme' },
  { code: 'ADS-001', name: 'Aromatik Poşet', note: '100 adet/koli', type: 'Koku Giderme' },
  { code: 'ADS-002', name: 'Pisuvar Koku Tableti', note: '100 adet/koli · limon / lavanta / geranyum', type: 'Koku Giderme' }
];

// =============================================================================
// ESANSLAR (esanslar.html, katalogdaki "Esans koleksiyonu" kartı, ürün sayfalarındaki esans bölümü, teklif listesi)
// Kaynak: Meira'nın ilettiği koku piramidi görselleri (2026-11-19, koku_piramitleri/ klasörü, git'e girmez).
// Notalar görsellerden birebir aktarılmıştır; katman anlatımı (story) ve his (mood) sitenin
// yazdığı genel anlatımdır. Görseller tools/esans-gorselleri.py ile images/essences/ altına hazırlanır.
//
// Aileler müşterinin kod ön eklerinden: NON = non-alerjen, NTR = nötralizör (kötü koku giderici), PRF = parfüm,
// CİC = çiçeksi, ORY = oryantal. [DOĞRULANACAK] PRF ve ORY ön eklerinin anlamı müşteriden teyit edilmeli
// (PRF "parfüm su grubu" diye iletildi; ORY oryantal olarak yorumlandı). Non-alerjen ve nötralizör nitelikleri
// üretici beyanıdır; sitede bu kalıpla verilir.
// [DOĞRULANACAK] Müşterinin gönderdiği bazı görseller birebir aynı dosya: NON014, NON018, NTR001 ve NTR005 aynı
// piramidi; NON008 ve NON024 aynı piramidi paylaşıyor (img alanı ortak). NON015'te üst ve dip notalar aynı yazılmış.
// Doğru görseller gelince dosyayı koku_piramitleri/ klasörüne koyup betiği çalıştırın, notaları burada düzeltin.
//
// Alanlar:
//   id: adres çapası (esanslar.html#esans-<id>) ve teklif listesi kimliği (ürün kimlikleriyle çakışmaz)
//   code: esans kodu, fam: ESSENCE_FAMILIES kimliği, name: esans adı, img: images/essences/<img>.jpg
//   hue: sahnenin renk tonu (HSL 0-360), palette: arka plan hareketinin renkleri (görselin baskın renklerinden)
//   motion: arka plan hareketi (js/essences.js): petals (süzülen yapraklar), mist (dalga ve kabarcık),
//     wind (rüzgâr ve yaprak), fizz (yükselen ışıltılı kabarcıklar), ember (sıcak kıvılcım ve duman),
//     powder (yavaş süzülen pudra bulutları), rain (yağmur ve damla halkaları), stars (yıldızlı gece)
//   top / heart / base: üst, orta ve dip notalar; mood: üç kelimelik his
//   story: piramidin üç katmanında gösterilen cümleler [üst, orta, dip]. Notalar köşeli parantezle yazılır ve vurgulanır
//     ("[Bergamot] ve [limon]la ..."); her katmanın cümlesi o katmanın notalarının hepsini, birer kez içermelidir
//     (sayfada notalar ayrıca listelenmez). Ek varsa parantezin dışına yazılır: "[greyfurt]la".
//   sprites: arka planda süzülen malzeme çizimleri (js/essences.js SPRITES), koku piramidi görselindeki malzemelerden;
//     ilk öğe kokunun en belirgin malzemesidir ve daha sık görünür. Kullanılabilen çizimler:
//     citrus:orange|lemon|lime|grapefruit|bergamot, leaf[:dark|mint], blossom:white|pink|cream, rose:pink|red|white|blue,
//     violet, lavender, bells (müge), cinnamon, anise, wood[:dark], amber, crystal, vanilla, musk, drop, apple,
//     fruit:peach|mango|pineapple, berry, coconut, melon, fig, pinecone, saffron
// İngilizce metinler products.en.js içindedir.
// =============================================================================
// Esanslar yayında mı? false iken menüde "Yakında" görünür, esanslar.html "hazırlanıyor" sayfasıdır, katalogda esans
// kartı ve sekmesi gizlidir, ürün sayfalarındaki esans bölümü kilitlidir. Değiştirince node tools/build.mjs çalıştırın.
const ESSENCES_LIVE = true;

const ESSENCE_FAMILIES = [
  {
    id: 'non', prefix: 'NON', label: 'Non-alerjen',
    text: 'Üretici beyanına göre alerjen içermeyecek şekilde formüle edilen esanslar. Kalabalık ve hassas kişilerin bulunduğu kapalı alanlarda temiz, yumuşak ve dengeli bir koku bırakır.',
    spaces: ['Otel odası ve lobi', 'Klinik ve bekleme alanı', 'Ofis', 'Spa']
  },
  {
    id: 'ntr', prefix: 'NTR', label: 'Nötralizör',
    text: 'Kötü kokuyu yalnızca örtmek yerine nötralize etmeye yönelik esanslar. Kokunun sorun olduğu alanlarda havayı temizlenmiş gibi ferah bırakır.',
    spaces: ['Tuvalet ve lavabo', 'Otopark ve asansör', 'Mutfak ve atık alanı', 'Sigara alanı']
  },
  {
    id: 'prf', prefix: 'PRF', label: 'Parfüm',
    text: 'Parfüm karakterinde, katmanlı ve imza niteliğinde kokular. Markanın kendini anlattığı alanlarda akılda kalan bir iz bırakır.',
    spaces: ['Mağaza ve showroom', 'Otel lobisi', 'Butik']
  },
  {
    id: 'cic', prefix: 'CİC', label: 'Çiçeksi',
    text: 'Beyaz çiçeklerin ve yeşil yaprakların zarif dünyası: aydınlık, yumuşak ve davetkâr.',
    spaces: ['Butik mağaza', 'Spa', 'Karşılama alanı']
  },
  {
    id: 'ory', prefix: 'ORY', label: 'Oryantal',
    text: 'Amber, vanilya ve sıcak odunsu notalarla derin ve sarıcı kokular; akşam saatlerine ve dinlenme alanlarına yakışır.',
    spaces: ['Lounge ve bar', 'Restoran', 'Otel lobisi']
  }
];

const ESSENCES = [
  // ---- Non-alerjen ----
  {
    id: 'non001', code: 'NON001', fam: 'non', name: 'Florina', img: 'non001',
    hue: 288, palette: ['#7A3E8E', '#E68AA6', '#C9A27E'], motion: 'powder',
    top: ['Ferah sabunsu', 'Temiz aldehit etkisi', 'Yeşil'],
    heart: ['Beyaz çiçek', 'Gül', 'Menekşe', 'Hafif meyvemsi'],
    base: ['Temiz misk', 'Yumuşak amber', 'Sandal ağacı'],
    mood: ['Temiz', 'Sabunsu', 'Pudralı'],
    sprites: ['blossom:white', 'rose:pink', 'violet', 'leaf', 'crystal', 'wood', 'musk', 'drop'],
    story: [
      "Temiz çamaşırı andıran [ferah sabunsu] bir açılış; [temiz aldehit etkisi] ve [yeşil] bir tazelik.",
      "[Beyaz çiçek], [gül] ve [menekşe]den yumuşak bir buket; [hafif meyvemsi] bir dokunuş.",
      "[Temiz misk], [yumuşak amber] ve [sandal ağacı]; pudralı, sakin bir derinlik."
    ]
  },
  {
    id: 'non007', code: 'NON007', fam: 'non', name: 'GreenX', img: 'non007',
    hue: 78, palette: ['#8DBA3C', '#F2C14E', '#E2574C'], motion: 'fizz',
    top: ['Yeşil elma', 'Ananas', 'Muz'],
    heart: ['Şeftali', 'Ahududu', 'Tropikal meyve'],
    base: ['Vanilya', 'Krema', 'Misk', 'Hindistan cevizi'],
    mood: ['Meyvemsi', 'Tropikal', 'Neşeli'],
    sprites: ['apple', 'fruit:peach', 'berry', 'coconut', 'fruit:pineapple', 'blossom:cream', 'vanilla', 'leaf'],
    story: [
      "[Yeşil elma], [ananas] ve [muz]la sulu, tropikal bir başlangıç.",
      "[Şeftali], [ahududu] ve [tropikal meyve] tatlılığı artırır.",
      "[Vanilya], [krema], [misk] ve [hindistan cevizi] ile sıcak, kremsi bir kapanış."
    ]
  },
  {
    id: 'non008', code: 'NON008', fam: 'non', name: 'Relax', img: 'non008',
    hue: 36, palette: ['#F2A23A', '#D9534F', '#C9A27E'], motion: 'powder',
    top: ['Bergamot', 'Limon', 'Greyfurt'],
    heart: ['Yasemin', 'Gül', 'Menekşe'],
    base: ['Pudralı', 'Yeşil', 'Yumuşak'],
    mood: ['Dingin', 'Aydınlık', 'Yumuşak'],
    sprites: ['citrus:grapefruit', 'citrus:lemon', 'citrus:bergamot', 'rose:red', 'violet', 'blossom:white', 'leaf', 'wood'],
    story: [
      "[Bergamot], [limon] ve [greyfurt]la aydınlık bir başlangıç.",
      "[Yasemin], [gül] ve [menekşe]den yumuşak bir çiçek dokusu.",
      "[Pudralı], [yeşil] ve [yumuşak] bir iz; adına yakışır sakin, dengeli bir hava."
    ]
  },
  {
    id: 'non009', code: 'NON009', fam: 'non', name: 'Amber Kirke', img: 'non009',
    hue: 182, palette: ['#2A9D9A', '#E39A3B', '#E9F3EE'], motion: 'mist',
    top: ['Ferah', 'Yeşil', 'Hafif ozonik'],
    heart: ['Yasemin', 'Beyaz çiçekler', 'Gül'],
    base: ['Beyaz misk', 'Amber', 'Sandal ağacı'],
    mood: ['Ferah', 'Ozonik', 'Sıcak'],
    sprites: ['drop', 'blossom:white', 'bells', 'rose:pink', 'lavender', 'amber', 'musk', 'wood', 'leaf'],
    story: [
      "Denizden esen temiz havayı andıran [ferah], [yeşil] ve [hafif ozonik] bir açılış.",
      "[Yasemin], [beyaz çiçekler] ve [gül] kalbi aydınlatır.",
      "[Beyaz misk], [amber] ve [sandal ağacı] sıcak, kalıcı bir iz bırakır."
    ]
  },
  {
    id: 'non013', code: 'NON013', fam: 'non', name: 'RBL IST', img: 'non013',
    hue: 22, palette: ['#8C3A15', '#D9822B', '#6B7F3A'], motion: 'ember',
    top: ['Bergamot', 'Greyfurt', 'Aromatik'],
    heart: ['Aromatik baharat', 'Karanfil', 'Tarçın', 'Baharatlı çiçekler'],
    base: ['Sedir', 'Sandal', 'Vetiver', 'Paçuli', 'Amber'],
    mood: ['Baharatlı', 'Odunsu', 'Karakterli'],
    sprites: ['citrus:grapefruit', 'citrus:bergamot', 'cinnamon', 'anise', 'rose:red', 'pinecone', 'wood', 'amber', 'leaf:dark'],
    story: [
      "[Bergamot] ve [greyfurt]la canlı, [aromatik] bir açılış.",
      "[Aromatik baharat], [karanfil], [tarçın] ve [baharatlı çiçekler]den sıcak bir kalp.",
      "[Sedir], [sandal], [vetiver], [paçuli] ve [amber]; güçlü, karakterli bir imza."
    ]
  },
  {
    id: 'non014', code: 'NON014', fam: 'non', name: 'Blue Diamond', img: 'non014',
    hue: 214, palette: ['#3E6FB0', '#9CC3E6', '#F2B33D'], motion: 'stars',
    top: ['Ferah', 'Yeşil', 'Narenciyeli', 'Hafif meyvemsi'],
    heart: ['Zengin', 'Doğal hissiyatlı', 'Beyaz çiçek ağırlıklı'],
    base: ['Temiz misk', 'Kremsi odunsu'],
    mood: ['Işıltılı', 'Ferah', 'Zarif'],
    sprites: ['crystal', 'citrus:lemon', 'blossom:white', 'blossom:pink', 'lavender', 'pinecone', 'wood', 'amber'],
    story: [
      "[Ferah], [yeşil], [narenciyeli] ve [hafif meyvemsi] ışıltılı bir açılış.",
      "[Zengin], [doğal hissiyatlı] ve [beyaz çiçek ağırlıklı] zarif bir kalp.",
      "[Temiz misk] ve [kremsi odunsu] notalarla yumuşak bir kapanış."
    ]
  },
  {
    id: 'non015', code: 'NON015', fam: 'non', name: 'Lotus', img: 'non015',
    hue: 276, palette: ['#6B3FA0', '#E58FA0', '#F1E6D6'], motion: 'petals',
    top: ['Beyaz misk', 'Sandal', 'Pudramsı odunsuluk'],
    heart: ['Beyaz çiçekler', 'Meyve', 'Gül'],
    base: ['Beyaz misk', 'Sandal', 'Pudramsı odunsuluk'],
    mood: ['Sakin', 'Pudralı', 'Çiçeksi'],
    sprites: ['blossom:white', 'rose:pink', 'violet', 'lavender', 'wood', 'musk', 'drop'],
    story: [
      "[Beyaz misk], [sandal] ve [pudramsı odunsuluk]la kadifemsi bir açılış.",
      "[Beyaz çiçekler], [meyve] ve [gül]; nilüferin sakin, temiz zarafeti.",
      "[Beyaz misk], [sandal] ve [pudramsı odunsuluk] kokuyu sonuna kadar yumuşak tutar."
    ]
  },
  {
    id: 'non016', code: 'NON016', fam: 'non', name: 'Powder', img: 'non016',
    hue: 42, palette: ['#E5A831', '#F3E2C7', '#B8692A'], motion: 'powder',
    top: ['Hafif turunçgil', 'Ahududu'],
    heart: ['Yasemin', 'Gül', 'Kremsi meyve'],
    base: ['Yoğun vanilya', 'Beyaz misk', 'Amber'],
    mood: ['Pudralı', 'Vanilyalı', 'Sarıcı'],
    sprites: ['citrus:lemon', 'berry', 'blossom:white', 'rose:white', 'amber', 'wood', 'musk', 'vanilla'],
    story: [
      "[Hafif turunçgil] ve [ahududu]yla tatlı, aydınlık bir açılış.",
      "[Yasemin], [gül] ve [kremsi meyve] kokuyu yumuşatır.",
      "[Yoğun vanilya], [beyaz misk] ve [amber]; pudralı, sarıcı bir sıcaklık."
    ]
  },
  {
    id: 'non018', code: 'NON018', fam: 'non', name: 'Ocean', img: 'non014',
    hue: 198, palette: ['#2F7FB8', '#7CC6D9', '#F2B33D'], motion: 'mist',
    top: ['Ferah', 'Yeşil', 'Narenciyeli', 'Hafif meyvemsi'],
    heart: ['Zengin', 'Doğal hissiyatlı', 'Beyaz çiçek ağırlıklı'],
    base: ['Temiz misk', 'Kremsi odunsu'],
    mood: ['Ferah', 'Temiz', 'Açık hava'],
    sprites: ['drop', 'citrus:lemon', 'blossom:white', 'leaf', 'lavender', 'pinecone', 'wood', 'amber'],
    story: [
      "Açık havanın temizliğini taşıyan [ferah], [yeşil], [narenciyeli] ve [hafif meyvemsi] bir açılış.",
      "[Zengin], [doğal hissiyatlı] ve [beyaz çiçek ağırlıklı] dolgun bir kalp.",
      "[Temiz misk] ve [kremsi odunsu] dip ferahlığı uzun süre taşır."
    ]
  },
  {
    id: 'non020', code: 'NON020', fam: 'non', name: 'Woody', img: 'non020',
    hue: 218, palette: ['#1F3A5F', '#A9773F', '#D9D3C4'], motion: 'wind',
    top: ['Aromatik', 'Hafif çiçeksi'],
    heart: ['Beyaz çiçekler', 'Müge', 'Gül'],
    base: ['Beyaz misk', 'Sandal', 'Paçuli', 'Amber'],
    mood: ['Odunsu', 'Derin', 'Dengeli'],
    sprites: ['wood', 'leaf:dark', 'blossom:white', 'citrus:lime', 'bells', 'rose:white', 'amber', 'musk', 'drop'],
    story: [
      "[Aromatik] ve [hafif çiçeksi] temiz bir açılış.",
      "[Beyaz çiçekler], [müge] ve [gül]den aydınlık bir kalp.",
      "[Beyaz misk], [sandal], [paçuli] ve [amber]; derin, odunsu ve güven veren bir karakter."
    ]
  },
  {
    id: 'non021', code: 'NON021', fam: 'non', name: 'Jasmine', img: 'non021',
    hue: 62, palette: ['#E7C53A', '#7FA33A', '#F4F0E2'], motion: 'petals',
    top: ['Limon', 'Greyfurt', 'Kavun', 'Yeşil elma'],
    heart: ['Gül', 'Neroli', 'Menekşe'],
    base: ['Pudralı', 'Yeşil', 'Yumuşak'],
    mood: ['Aydınlık', 'Sulu', 'Çiçeksi'],
    sprites: ['citrus:lemon', 'citrus:grapefruit', 'melon', 'apple', 'blossom:white', 'lavender', 'bells', 'leaf', 'vanilla'],
    story: [
      "[Limon], [greyfurt], [kavun] ve [yeşil elma]yla sulu, ferah bir açılış.",
      "[Gül], [neroli] ve [menekşe]; beyaz çiçek bahçesinin aydınlığı.",
      "[Pudralı], [yeşil] ve [yumuşak] bir iz uzun süre hissedilir."
    ]
  },
  {
    id: 'non023', code: 'NON023', fam: 'non', name: 'Ocean', img: 'non023',
    hue: 188, palette: ['#3FA7B5', '#E7B98A', '#F1E4C4'], motion: 'mist',
    top: ['Yeşil', 'Ferah', 'Meyvemsi'],
    heart: ['Yasemin', 'Gül', 'Müge'],
    base: ['Pudralı', 'Odunsu', 'Vanilya'],
    mood: ['Hafif', 'Ferah', 'Yumuşak'],
    sprites: ['leaf', 'blossom:white', 'rose:pink', 'vanilla', 'wood', 'drop'],
    story: [
      "Deniz kıyısında esen hafif bir rüzgâr gibi [yeşil], [ferah] ve [meyvemsi] bir açılış.",
      "[Yasemin], [gül] ve [müge]den yumuşak bir çiçek dokusu.",
      "[Pudralı], [odunsu] ve [vanilya]lı sıcak, rahat bir kapanış."
    ]
  },
  {
    id: 'non024', code: 'NON024', fam: 'non', name: 'Yağmur Ormanları', img: 'non008',
    hue: 138, palette: ['#3D7A45', '#8DBF6A', '#C9A27E'], motion: 'rain',
    top: ['Bergamot', 'Limon', 'Greyfurt'],
    heart: ['Yasemin', 'Gül', 'Menekşe'],
    base: ['Pudralı', 'Yeşil', 'Yumuşak'],
    mood: ['Yeşil', 'Serin', 'Canlandırıcı'],
    sprites: ['leaf', 'leaf:dark', 'leaf:mint', 'citrus:bergamot', 'citrus:lemon', 'blossom:white', 'violet', 'drop'],
    story: [
      "[Bergamot], [limon] ve [greyfurt]; yağmur sonrası taze hava.",
      "[Yasemin], [gül] ve [menekşe] kalpte çiçekli bir dolgunluk verir.",
      "[Pudralı], [yeşil] ve [yumuşak]; ormanın serin, dingin havası."
    ]
  },
  {
    id: 'non025', code: 'NON025', fam: 'non', name: 'Mango', img: 'non025',
    hue: 32, palette: ['#F08A1C', '#8DBF3C', '#E85D3A'], motion: 'fizz',
    top: ['Yeşil', 'Limonlu', 'Sulu'],
    heart: ['Mango', 'Şeftali', 'Kavun'],
    base: ['Temiz misk', 'Tatlı', 'Yumuşak'],
    mood: ['Güneşli', 'Meyvemsi', 'Neşeli'],
    sprites: ['fruit:mango', 'citrus:lime', 'fruit:peach', 'melon', 'blossom:white', 'musk', 'vanilla', 'leaf'],
    story: [
      "[Yeşil], [limonlu] ve [sulu] canlı bir açılış.",
      "[Mango], [şeftali] ve [kavun]la olgun, güneşli bir meyve kalbi.",
      "[Temiz misk] ile [tatlı] ve [yumuşak] bir kapanış; neşeli ama ağır değil."
    ]
  },
  {
    id: 'non026', code: 'NON026', fam: 'non', name: 'Japon Kirazı', img: 'non026',
    hue: 344, palette: ['#E89AB0', '#C98B5A', '#F6E7C8'], motion: 'petals',
    top: ['Ferah', 'Temiz', 'Hafif turunçgil'],
    heart: ['Yasemin', 'Müge', 'Pudralı çiçekler'],
    base: ['Beyaz misk', 'Amber', 'Odunsu'],
    mood: ['Zarif', 'Pudralı', 'Bahar'],
    sprites: ['blossom:pink', 'citrus:orange', 'blossom:white', 'leaf', 'amber', 'wood'],
    story: [
      "[Ferah], [temiz] ve [hafif turunçgil] bir bahar sabahı.",
      "[Yasemin], [müge] ve [pudralı çiçekler]; kiraz çiçeği mevsiminin zarafeti.",
      "[Beyaz misk], [amber] ve [odunsu] notalarla yumuşak bir sıcaklık."
    ]
  },
  {
    id: 'non027', code: 'NON027', fam: 'non', name: 'Oud Malaki Conc.', img: 'non027',
    hue: 24, palette: ['#8C3A0E', '#D8801C', '#3E1F0C'], motion: 'ember',
    top: ['Baharat', 'Turunçgil', 'Aromatik'],
    heart: ['Reçine', 'Kuru odun', 'Baharat'],
    base: ['Oud', 'Amber', 'Sedir', 'Sandal', 'Misk'],
    mood: ['Yoğun', 'Dumanlı', 'Kalıcı'],
    sprites: ['citrus:orange', 'saffron', 'cinnamon', 'amber', 'wood:dark', 'wood', 'lavender', 'pinecone', 'anise'],
    story: [
      "[Baharat], [turunçgil] ve [aromatik] otlarla yoğun bir açılış.",
      "Kalbinde [reçine], [kuru odun] ve [baharat].",
      "[Oud], [amber], [sedir], [sandal] ve [misk]; derin, dumanlı ve uzun süre hissedilen bir iz."
    ]
  },
  // ---- Nötralizör ----
  {
    id: 'ntr001', code: 'NTR001', fam: 'ntr', name: 'Delicious', img: 'non014',
    hue: 92, palette: ['#8DBA3C', '#E2574C', '#F2C14E'], motion: 'fizz',
    top: ['Ferah', 'Yeşil', 'Narenciyeli', 'Hafif meyvemsi'],
    heart: ['Zengin', 'Doğal hissiyatlı', 'Beyaz çiçek ağırlıklı'],
    base: ['Temiz misk', 'Kremsi odunsu'],
    mood: ['Canlı', 'Meyvemsi', 'Temiz'],
    sprites: ['citrus:lemon', 'citrus:orange', 'blossom:white', 'blossom:pink', 'leaf', 'pinecone', 'wood', 'amber'],
    story: [
      "[Ferah], [yeşil], [narenciyeli] ve [hafif meyvemsi]; iştah açıcı, canlı bir başlangıç.",
      "[Zengin], [doğal hissiyatlı] ve [beyaz çiçek ağırlıklı] bir kalp kokuyu yumuşatır.",
      "[Temiz misk] ve [kremsi odunsu] notalar rahatsız etmeyen, temiz bir iz bırakır."
    ]
  },
  {
    id: 'ntr002', code: 'NTR002', fam: 'ntr', name: 'Marine', img: 'ntr002',
    hue: 160, palette: ['#1E8A5C', '#6CC3B5', '#E9F5EE'], motion: 'mist',
    top: ['Deniz esintisi', 'Bergamot', 'Limon', 'Nane'],
    heart: ['Yasemin', 'Müge', 'Gül', 'Sulu çiçekler'],
    base: ['Sedir', 'Amber', 'Sandal', 'Beyaz misk'],
    mood: ['Serin', 'Canlandırıcı', 'Temiz'],
    sprites: ['citrus:bergamot', 'citrus:lime', 'leaf:mint', 'drop', 'blossom:white', 'rose:white', 'pinecone', 'wood', 'amber'],
    story: [
      "[Deniz esintisi], [bergamot], [limon] ve [nane]; serin, canlandırıcı bir açılış.",
      "[Yasemin], [müge], [gül] ve [sulu çiçekler] kalbi aydınlatır.",
      "[Sedir], [amber], [sandal] ve [beyaz misk] temizlik hissini kalıcı kılar."
    ]
  },
  {
    id: 'ntr003', code: 'NTR003', fam: 'ntr', name: 'Berga', img: 'ntr003',
    hue: 174, palette: ['#2F8C82', '#C7D44A', '#E9F3F2'], motion: 'fizz',
    top: ['Deniz esintisi', 'Bergamot', 'Limon'],
    heart: ['Yasemin', 'Müge', 'Lavanta benzeri ferahlık'],
    base: ['Beyaz misk', 'Amber', 'Sedir'],
    mood: ['Ferah', 'Narenciye', 'Hafif'],
    sprites: ['citrus:lime', 'citrus:lemon', 'drop', 'blossom:white', 'lavender', 'amber', 'wood', 'musk'],
    story: [
      "[Deniz esintisi], [bergamot] ve [limon]la ferah bir açılış.",
      "[Yasemin], [müge] ve [lavanta benzeri ferahlık]tan temiz bir kalp.",
      "[Beyaz misk], [amber] ve [sedir]; hafif ama kalıcı bir zemin."
    ]
  },
  {
    id: 'ntr004', code: 'NTR004', fam: 'ntr', name: 'Citrus', img: 'ntr004',
    hue: 318, palette: ['#7A2A5C', '#E8B33A', '#8A6BB8'], motion: 'fizz',
    top: ['Ferah', 'Turunçgil ve yeşil açılış'],
    heart: ['Yasemin', 'Gül', 'Beyaz çiçek', 'Menekşe'],
    base: ['Kremsi', 'Misk', 'Odunsu', 'Pudralı'],
    mood: ['Canlı', 'Çiçeksi', 'Yumuşak'],
    sprites: ['fig', 'lavender', 'rose:red', 'blossom:white', 'violet', 'vanilla', 'amber', 'leaf'],
    story: [
      "[Ferah] bir [turunçgil ve yeşil açılış].",
      "[Yasemin], [gül], [beyaz çiçek] ve [menekşe]den zengin bir kalp.",
      "[Kremsi] ve [pudralı] bir dokuyla [misk] ve [odunsu] notalar; temizlik hissine yumuşak bir sıcaklık."
    ]
  },
  {
    id: 'ntr005', code: 'NTR005', fam: 'ntr', name: 'Fresh', img: 'non014',
    hue: 150, palette: ['#3BAA8A', '#BFE3D4', '#F2C14E'], motion: 'mist',
    top: ['Ferah', 'Yeşil', 'Narenciyeli', 'Hafif meyvemsi'],
    heart: ['Zengin', 'Doğal hissiyatlı', 'Beyaz çiçek ağırlıklı'],
    base: ['Temiz misk', 'Kremsi odunsu'],
    mood: ['Ferah', 'Yeşil', 'Temiz'],
    sprites: ['leaf:mint', 'citrus:lime', 'citrus:lemon', 'blossom:white', 'lavender', 'drop', 'wood', 'amber'],
    story: [
      "Havayı açan [ferah], [yeşil], [narenciyeli] ve [hafif meyvemsi] bir açılış.",
      "[Zengin], [doğal hissiyatlı] ve [beyaz çiçek ağırlıklı] yumuşak bir dolgunluk.",
      "[Temiz misk] ve [kremsi odunsu] notalar ferahlığı ortamda uzun süre tutar."
    ]
  },
  // ---- Parfüm ----
  {
    id: 'prf005', code: 'PRF005', fam: 'prf', name: 'Kenzy', img: 'prf005',
    hue: 300, palette: ['#8A6BB8', '#9BBF3A', '#E58FA0'], motion: 'petals',
    top: ['Bergamot', 'Lavanta', 'Turunçgil'],
    heart: ['Yasemin', 'Gül', 'Beyaz çiçek', 'Menekşe'],
    base: ['Sedir', 'Sandal', 'Misk'],
    mood: ['Zarif', 'Aromatik', 'Çiçeksi'],
    sprites: ['lavender', 'citrus:lime', 'citrus:lemon', 'blossom:white', 'rose:pink', 'violet', 'pinecone', 'wood', 'amber'],
    story: [
      "[Bergamot], [lavanta] ve [turunçgil]le ferah, aromatik bir açılış.",
      "[Yasemin], [gül], [beyaz çiçek] ve [menekşe]; parfüm karakterinde zengin bir kalp.",
      "[Sedir], [sandal] ve [misk] zarif, kalıcı bir imza bırakır."
    ]
  },
  {
    id: 'prf006', code: 'PRF006', fam: 'prf', name: 'Million', img: 'prf006',
    hue: 40, palette: ['#C9A24A', '#E2574C', '#5A2E14'], motion: 'fizz',
    top: ['Greyfurt', 'Ozon', 'Yeşil aromatik'],
    heart: ['Yasemin', 'Gül', 'Meyvemsi çiçekler'],
    base: ['Sedir', 'Deri', 'Amber', 'Misk'],
    mood: ['Işıltılı', 'İddialı', 'Sıcak'],
    sprites: ['citrus:grapefruit', 'leaf:mint', 'drop', 'rose:red', 'blossom:white', 'bells', 'wood:dark', 'amber'],
    story: [
      "[Greyfurt], [ozon] ve [yeşil aromatik] notalarla enerjik bir açılış.",
      "[Yasemin], [gül] ve [meyvemsi çiçekler]den parlak bir kalp.",
      "[Sedir], [deri], [amber] ve [misk]; ışıltılı, iddialı bir derinlik."
    ]
  },
  // ---- Çiçeksi ----
  {
    id: 'cic006', code: 'CİC006', fam: 'cic', name: 'Gardenia', img: 'cic006',
    hue: 142, palette: ['#2E8B57', '#F2EEE3', '#7B5EA7'], motion: 'petals',
    top: ['Bergamot', 'Portakal', 'Yeşil yaprak'],
    heart: ['Gardenya', 'Yasemin', 'Nergis', 'Menekşe'],
    base: ['Beyaz misk', 'Sandal', 'Yosun'],
    mood: ['Zarif', 'Yeşil', 'Beyaz çiçek'],
    sprites: ['blossom:white', 'citrus:bergamot', 'citrus:lime', 'violet', 'leaf', 'wood', 'drop'],
    story: [
      "[Bergamot], [portakal] ve [yeşil yaprak]la parlak bir açılış.",
      "[Gardenya] ve [yasemin]in kremsi beyaz çiçekleri; [nergis] ve [menekşe]yle zarif bir derinlik.",
      "[Beyaz misk], [sandal] ve [yosun]; yağmur sonrası bahçenin serinliği."
    ]
  },
  // ---- Oryantal ----
  {
    id: 'ory006', code: 'ORY006', fam: 'ory', name: 'Dark Moon', img: 'ory006',
    hue: 222, palette: ['#2B4A6B', '#9FB4C7', '#E3B04B'], motion: 'stars',
    top: ['Ferah', 'Aromatik', 'Çiçeksi'],
    heart: ['Yasemin', 'Müge', 'Gül', 'Menekşe'],
    base: ['Sandal', 'Beyaz misk', 'Amber', 'Vanilya'],
    mood: ['Gizemli', 'Sarıcı', 'Sıcak'],
    sprites: ['rose:blue', 'lavender', 'citrus:lemon', 'blossom:white', 'violet', 'wood', 'amber', 'vanilla'],
    story: [
      "Gecenin serinliğini andıran [ferah], [aromatik] ve [çiçeksi] bir açılış.",
      "[Yasemin], [müge], [gül] ve [menekşe]den zarif bir buket.",
      "[Sandal], [beyaz misk], [amber] ve [vanilya]; ay ışığında sıcak, sarıcı bir iz."
    ]
  }
];

// Katalogdaki esans kartının görseli: çubuklu oda kokusu (koleksiyonun girişi)
const ESSENCE_COVER = { img: 'reed1', pos: '50% 60%' };
