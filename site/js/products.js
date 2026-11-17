/* Ürün veritabanı: üreticinin (Dongguan Andusic Technology Co. Ltd.) 2025 ürün kataloğundan (İngilizce çeviri) derlenmiştir.
 * [DOĞRULANACAK] FDA, gıda sınıfı malzeme ve güvenlik standardı ifadeleri üretici beyanıdır;
 * sitede "üretici beyanına göre" kalıbıyla verilir. Belge talep edilmeden kesin ifade kullanmayın.
 * Ürün videoları (videos): Meira'nın ilettiği üretici tanıtım videoları, images/products/videos/<file>.mp4
 * ve kapak karesi <file>.jpg / .webp. Başlık (title) ürün adı içermez; özet (summary) videoda gösterileni anlatır. Desenli panellerdeki yazı üreticinin markasıdır.
 * Koku adları: otel ve parfüm markası adları nötr, betimleyici adlarla değiştirildi (RAPOR.md).
 * MEIRA Kozmetik Difüzör Fiyat Listesi 2026'da (son sürüm, Kasım 2026) yer alan ürünlerde (ADS-687, ADS-689, CK-629,
 * CK-644, zemin tipi ADS-687, ADS-685, ADS-620B/640B/670B) model kodu, ölçü, güç, hazne, kapsama ve fiyat bu listeden
 * alınmıştır; katalogla çelişen değerlerde liste esas alınır. Kapsama m³ olarak verilir.
 * price: liste fiyatı (TL, KDV hariç). Sitede "+ KDV" ile gösterilir; KDV tutarı hesaplanmaz. Seride en düşük ve en
 * yüksek fiyat [min, max]; seri fiyatları variants içinde. Sitede online satış yoktur; teklif adet ve koşullara göre
 * hazırlanır. "Pek yakında" ürünlerde fiyat gösterilmez (veride durur).
 * Listeye göre zemin tipi kolon (ck686, katalogda CK-686) da ADS-687A/B kodunu taşır; 150 ml
 * ADS-687'den başlığı ve kategorisiyle ayrılır.
 * CK-628 ön yüz ölçüsü (66 × 212) Meira'nın ilettiği ölçü çiziminden; derinlik 56 mm.
 * pin: katalog sıralamasında en başa alınan ürün (ADS-689).
 * model: fiyat listesindeki tam model numaraları (renk ya da sürüm başına bir kod; teklif listesine ve e-postaya bu yazılır).
 * family: düzyazıda kullanılan kısa aile adı (ör. soru-cevaplarda "ADS-687 ne kadar ses çıkarır?").
 * colors: kartta ve ürün sayfasında gösterilen renk seçenekleri { code, name, hex }; code, o rengin model numarasıdır.
 * Listede ADS-687A/B kodları hem 150 ml masaüstü modelde hem zemin tipi kolon modelde geçer (listedeki gibi bırakıldı).
 * Kategori ve özellikler fiyat listesine göre: "Kurulum: Masaüstü" olanlar (ADS-687 150 ml, ADS-689, CK-629, ADS-685)
 * Masaüstü kategorisinde; listede kontrol yöntemi "-" olanlarda (ADS-687 kolon, ADS-685, ADS-620B serisi) uygulama ya
 * da kumanda iddiası yoktur. Görsel ve videolardan özellik çıkarılmaz.
 * premium: metal (alüminyum) gövdeli modeller; katalogda "Premium" filtresiyle ve öne çıkarılarak gösterilir.
 * soon: model kodu CK ile başlayan ürünler ile ADS-622 ve ADS-611 henüz satışta değil; "Pek yakında" etiketiyle
 * gösterilir, kartları tıklanmaz ve teklif listesine eklenmez (CK için dosyanın sonunda atanır; tek bir ürün için
 * soon: false yazılabilir).
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
    id: 'ck689', model: 'ADS-689B / ADS-689-YK', family: 'ADS-689', price: 3750, cat: 'home', pin: true,
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
    id: 'ck687', model: 'ADS-687A / ADS-687B', family: 'ADS-687', price: 3500, cat: 'home',
    title: 'Kompakt Çift Akışkanlı Difüzör',
    short: 'Yenilenmiş ekran paneline ve Bluetooth uygulama kontrolüne sahip, 150 ml hazneli kompakt difüzör; 300-600 m³ kapsama.',
    desc: 'Çift akışkanlı atomizasyon, esansı hızlı ve eşit biçimde dağıtır. Bluetooth mobil uygulama ve yenilenmiş ekran paneli sayesinde kullanımı kolaydır. Gövde, yüksek sıcaklığa dayanıklı PP malzemeden üretilmiştir; üretici beyanına göre bu malzeme gıda sınıfındadır ve FDA dahil uluslararası standartlara uygundur.',
    img: 'ck687', pos: '40% 50%', gallery: 22,
    videos: [{ file: 'ck687-kurulum', duration: 65, title: 'Kurulumdan çalışma programına', teaser: 'Cihazın hazırlanmasını ve uygulamadan haftalık çalışma programı kurmayı adım adım izleyin.', summary: 'Pillerin ve esans şişesinin takılması gösteriliyor. Ardından ekrandaki ayar tuşları ve telefon uygulamasında haftalık çalışma programının nasıl oluşturulduğu adım adım anlatılıyor. Son bölümde cihaz masa üzerinde, prize bağlı olarak kullanılıyor.' }],
    features: ['Çift akışkanlı atomizasyon', 'Bluetooth uygulama kontrolü', 'Yenilenmiş ekran paneli', 'Sessiz çalışma (≤35 dB)', 'Zamanlı püskürtme'],
    variants: ['ADS-687A (Beyaz)', 'ADS-687B (Siyah)'],
    colors: [{ code: 'ADS-687A', name: 'Beyaz', hex: '#F3F2EE' }, { code: 'ADS-687B', name: 'Siyah', hex: '#1C1C1E' }],
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
    id: 'ck620', model: 'ADS-620B / ADS-640B / ADS-670B', family: 'ADS-620B / 640B / 670B', price: [12000, 22000], cat: 'pro', badge: 'Seri',
    title: 'Yüksek Hacimli Sis Difüzör Serisi',
    short: 'Zemine yerleştirilen ve klima (HVAC) sistemine bağlanabilen metal gövdeli seri; 1000 ml hazne, 2.000-12.000 m³ kapsama.',
    desc: 'Yüksek sis hacmi sayesinde koku, cihaz çalışmaya başladıktan kısa süre sonra mekâna yayılır. Zemine yerleştirilir ve merkezi klima (HVAC) sistemine bağlanabilir. 35 dB’i aşmayan sessiz çalışmasının yanı sıra tak-çıkar atomizer başlığı ve manyetik kilidi sayesinde bakımı da kolaydır. Üç kapasite seçeneğiyle 2.000 m³’ten 12.000 m³’e kadar alanlar için uygun model seçilebilir.',
    img: 'ck620', pos: '50% 50%', gallery: 11, premium: true,
    features: ['Yüksek sis hacmi', 'Sessiz çalışma (≤35 dB)', 'Zemine yerleştirme', '1000 ml hazne', 'Klima (HVAC) bağlantısı', 'Metal gövde'],
    // [DOĞRULANACAK] Listede ADS-640B ve ADS-670B için aynı ölçü (428×128×372 mm) verilmiş.
    variants: ['ADS-620B · 328×128×372 mm · 12W · 2.000-5.000 m³ · 12.000 TL + KDV', 'ADS-640B · 428×128×372 mm · 15W · 4.000-8.000 m³ · 14.000 TL + KDV', 'ADS-670B · 428×128×372 mm · 18W · 7.000-12.000 m³ · 22.000 TL + KDV'],
    colors: [{ name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '328 / 428 / 428 × 128 × 372 mm'], ['Renk', 'Siyah'], ['Malzeme', 'Metal'], ['Gerilim', 'DC 12V'], ['Güç', '12W / 15W / 18W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '1000 ml'], ['Kapsama alanı', '2.000-5.000 / 4.000-8.000 / 7.000-12.000 m³'], ['Kurulum', 'Zemin; klima (HVAC) sistemine bağlanabilir'], ['Koli', '1 adet']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck686', model: 'ADS-687A / ADS-687B', family: 'ADS-687 kolon', price: 18000, cat: 'pro', badge: 'Kolon',
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
    id: 'ck683', model: 'CK-683', cat: 'pro', badge: 'Pilli',
    title: 'Kompakt Alüminyum Çift Akışkanlı Difüzör',
    short: '5000 mAh dahili pili, Bluetooth kontrolü ve 300 m³ kapsamasıyla kablosuz kullanılabilen alüminyum difüzör.',
    desc: 'Kompakt gövdesi sayesinde az yer kaplar ve kolayca taşınır. 5000 mAh dahili pili, cihazın prize bağlı kalmadan uzun süre çalışmasını sağlar; 300 m³’lük alanları kokulandırır. Ayarlar Bluetooth bağlantısıyla kolayca yönetilir; Type-C şarj girişi ve su geçirmez dokunmatik kontrol paneli bulunur.',
    img: 'ck683', pos: '50% 40%', gallery: 18, premium: true,
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
    variants: ['CK-683A (Gümüş)', 'CK-683B (Siyah)'],
    colors: [{ code: 'CK-683A', name: 'Gümüş', hex: '#C9CDD2' }, { code: 'CK-683B', name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', 'Ø92 × 305 mm'], ['Renk', 'Gümüş / Siyah'], ['Malzeme', 'Alüminyum alaşım'], ['Gerilim / Güç', 'DC5V-2A (Type-C) / 8W'], ['Pil', '5000 mAh'], ['Ses seviyesi', '≤ 38 dB'], ['Esans kapasitesi', '110 ml'], ['Kapsama alanı', '300 m³'], ['Net ağırlık', '0,82 kg']],
    use: COMMON_USE_COMMERCIAL + ', satış salonu'
  },
  {
    id: 'ads685', model: 'ADS-685C / ADS-685B', family: 'ADS-685', price: 9000, cat: 'home', badge: 'Ticari',
    title: 'Masaüstü Ticari Koku Difüzörü',
    short: 'Alüminyum kolon gövdeli masaüstü difüzör; 200 ml hazne ve 400-1.200 m³ kapsama.',
    desc: 'Ticari alanlar için tasarlanmış, alüminyum gövdeli bir masaüstü difüzör. DC 12V ile 12 W güç çeker, 35 dB’i aşmayan bir ses seviyesinde çalışır ve 200 ml esans haznesiyle 400-1.200 m³’lük bir alanı kokulandırır. Resepsiyon bankosu, konsol ya da toplantı masası gibi yüzeylerde kullanılır. Beyaz ve siyah renk seçenekleri vardır.',
    img: 'ads685', pos: '50% 50%', gallery: 1, premium: true,
    features: ['Ticari kullanım', 'Alüminyum gövde', 'Sessiz çalışma (≤35 dB)', 'Masaüstü yerleşim'],
    variants: ['ADS-685C (Beyaz)', 'ADS-685B (Siyah)'],
    colors: [{ code: 'ADS-685C', name: 'Beyaz', hex: '#F3F2EE' }, { code: 'ADS-685B', name: 'Siyah', hex: '#1C1C1E' }],
    specs: [['Boyut', '324 × 81 × 114 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'Alüminyum alaşım'], ['Gerilim / Güç', 'DC 12V / 12W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '200 ml'], ['Kapsama alanı', '400-1.200 m³'], ['Kurulum', 'Masaüstü']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck644', model: 'CK-644A / CK-644B', family: 'CK-644', price: 3000, cat: 'plug', badge: 'Prize Takılan',
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
// ESANSLAR (esanslar.html, katalogdaki "Esans koleksiyonu" kartı)
// Üç koku ailesi (ton). Her esansın bir renk tonu (hue, HSL 0-360) vardır: esans seçilince sayfa zemini ve vurgu
// rengi bu tondan türetilir (style.css .essence-stage); arka plandaki hareket koku ailesine göre değişir
// (js/essences.js): petals = süzülen yapraklar, mist = dalga ve damlacıklar, wind = rüzgâr çizgileri.
// Geçici içerik (2026-11): difüzör esansları gelene kadar eski çubuklu oda kokuları (CK-85, CK-013, CK-014,
// CK-015) esans olarak gösterilir. Esanslar geldiğinde bu listeyi değiştirmek yeterlidir:
//   id: adres çapası (esanslar.html#esans-<id>), tone: ESSENCE_TONES kimliği, img: images/general/<img>.jpg,
//   notes: koku notaları, format: ambalaj bilgisi. İngilizce metinler products.en.js içindedir.
// =============================================================================
// Esanslar yayında mı? false iken menüde "Yakında" görünür, esanslar.html "hazırlanıyor" sayfasıdır, katalogda esans
// kartı ve sekmesi gizlidir, ürün sayfalarındaki esans bölümü kilitlidir. Esanslar eklenince true yapıp
// node tools/build.mjs çalıştırın (ESSENCES listesini de güncelleyin).
const ESSENCES_LIVE = false;

const ESSENCE_TONES = [
  { id: 'floral', label: 'Çiçeksi', motion: 'petals', text: 'Gül, kiraz çiçeği ve çiçek buketleri: yumuşak, aydınlık ve davetkâr.' },
  { id: 'fresh', label: 'Ferah', motion: 'mist', text: 'Deniz esintisi ve serin çiçek notaları: temiz, açık ve hafif.' },
  { id: 'woody', label: 'Odunsu', motion: 'wind', text: 'Sandal ağacı ve çam: sıcak, kuru ve dingin; orman havası.' }
];

const ESSENCES = [
  {
    id: 'sehirde-bahar', code: 'CK-85', tone: 'floral', hue: 345,
    name: 'Şehirde Bahar',
    desc: 'Taze açmış gül ve kiraz çiçeğinin hafif, pudralı kokusu. Karşılama alanlarına ve butik mağazalara aydınlık, davetkâr bir hava katar.',
    notes: ['Gül', 'Kiraz çiçeği', 'Çiçeksi'],
    format: 'Çubuklu oda kokusu · 120 ml',
    img: 'reed1', pos: '50% 60%'
  },
  {
    id: 'ciceklerin-dansi', code: 'CK-014', tone: 'floral', hue: 285,
    name: 'Çiçeklerin Dansı',
    desc: 'Otel lobilerini çağrıştıran zengin bir çiçek buketi. Lobi ve bekleme alanlarında zarif, kalıcı bir iz bırakır.',
    notes: ['Çiçek buketi'],
    format: 'Çubuklu oda kokusu · 200 ml',
    img: 'reed2', pos: '50% 60%'
  },
  {
    id: 'cicek-bollugu', code: 'CK-013', tone: 'fresh', hue: 195,
    name: 'Çiçek Bolluğu',
    desc: 'Mavi çan çiçeği ve deniz kıyısını andıran ferah notalar. Spa, spor salonu ve yazlık mekânlarda serin ve ferah bir his bırakır.',
    notes: ['Mavi çan çiçeği', 'Yaz esintisi', 'Tropik sahil'],
    format: 'Çubuklu oda kokusu · 100 ml',
    img: 'reed3', pos: '50% 60%'
  },
  {
    id: 'sandal-agaci', code: 'CK-015', tone: 'woody', hue: 140,
    name: 'Sandal Ağacı',
    desc: 'Sandal ağacı ve çamın sıcak, kuru odunsu kokusu; bir orman yürüyüşünün dinginliği. Ofis, kütüphane ve lounge alanları için uygundur.',
    notes: ['Sandal ağacı', 'Doğu odunsu notalar', 'Çam'],
    format: 'Çubuklu oda kokusu · 100 ml',
    img: 'reed4', pos: '50% 60%'
  }
];
