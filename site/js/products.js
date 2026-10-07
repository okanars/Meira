/* Ürün veritabanı: JVCK 2025 ürün kataloğundan (İngilizce çeviri) derlenmiştir.
 * [DOĞRULANACAK] FDA, gıda sınıfı malzeme ve güvenlik standardı ifadeleri üretici beyanıdır;
 * sitede "üretici beyanına göre" kalıbıyla verilir. Belge talep edilmeden kesin ifade kullanmayın.
 * [DOĞRULANACAK] Katalogda "CK-613" kodu hem elektriksiz koku kutusu (CK-613A/B/C) hem de
 * çift başlıklı difüzör serisinde (CK-613A, 2 x 5000 ml) geçiyor; üreticiden teyit edin.
 * Koku adları: otel ve parfüm markası adları nötr, betimleyici adlarla değiştirildi (RAPOR.md).
 * MEIRA Difüzör Fiyat Listesi 2026'da yer alan ürünlerde (ADS-687, CK-629, ADS-689, CK-644, CK-686,
 * ADS-685, ADS-620B/640B/670B) model kodu ve teknik veriler bu listeden alınmıştır; katalogla çelişen
 * değerlerde liste esas alınır. Fiyatlar sitede gösterilmez.
 * [DOĞRULANACAK] Listede "Kapsadığı Alan" birimsizdir; katalogla tutarlı olarak m³ kabul edildi.
 * [DOĞRULANACAK] Listede zemin tipi kolon da ADS-687A/B koduyla geçiyor (150 ml cihazla aynı kod);
 * sitede katalog kodu CK-686 korunmuştur. */
const CATEGORIES = [
  { id: 'all',   label: 'Tüm Ürünler' },
  { id: 'wall',  label: 'Duvar Tipi Difüzörler' },
  { id: 'pro',   label: 'Profesyonel & Klima Bağlantılı' },
  { id: 'plug',  label: 'Prize Takılan & Pasif' },
  { id: 'home',  label: 'Ev, Araç & Masaüstü' },
  { id: 'reed',  label: 'Çubuklu Oda Kokuları' }
];

const COMMON_USE_COMMERCIAL = 'Eğlence mekânları, otel lobisi, bar, iş toplantı salonu, showroom, güzellik salonu, restoran, galeri, otel koridoru, zincir mağazalar, sinema';
const COMMON_USE_SMALL = 'Otel odası, banyo, güzellik salonu, oturma odası, ofis, asansör, koridor/merdiven, evcil hayvan alanları';

const PRODUCTS = [
  {
    id: 'ck628', model: 'CK-628', cat: 'wall', badge: 'Akıllı kumanda',
    title: 'Ultrasonik Akıllı Duvar Difüzörü',
    short: 'LED ışık sensörü, LCD ekran ve akıllı kumanda seçenekli, 300 m³ kapsama alanlı ultrasonik difüzör.',
    desc: 'Ultrasonik atomizasyon teknolojisiyle hızlı ve homojen koku dağılımı sağlar. 4 AA pil veya Type-C 6V ile çalışır; akıllı uzaktan kumanda, LED ışık algılama ve LCD dijital ekran seçenekleri mevcuttur. Yüksek sıcaklığa dayanıklı gıda sınıfı PP malzemeden üretilmiştir; kokusuz ve toksik değildir; üretici beyanına göre uluslararası güvenlik standartları ve FDA ile uyumludur. Yapışkanla 3 saniyede, iz bırakmadan monte edilir.',
    img: 'ck628', pos: '40% 50%', gallery: 3,
    features: ['Ultrasonik atomizasyon', 'Uzaktan / manuel kontrol', 'Düşük gürültü (<8 dBA)', 'Pil veya Type-C güç', 'Masaüstü ve duvar çift kullanım', 'Zamanlı püskürtme', 'Değiştirilebilir ultrasonik plaka'],
    variants: ['CK-628A (Beyaz)', 'CK-628B (Siyah)', 'Akıllı kumanda: CK-628-YK', 'LED ışık algılama: CK-628-LED', 'LCD dijital ekran: CK-628-LCD'],
    specs: [['Boyut', '85 × 65 × 180 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP (gıda sınıfı)'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '< 8 dBA'], ['Esans kapasitesi', '168 ml'], ['Kapsama alanı', '300 m³'], ['Güç kaynağı', '4 × AA pil / Type-C 6V'], ['Net ağırlık', '223 g'], ['Koli', '50 adet · 493×395×380 mm · 14,8 kg brüt']],
    use: COMMON_USE_SMALL
  },
  {
    id: 'ck629', model: 'CK-629', cat: 'wall',
    title: '300 ml Ultrasonik Akıllı Difüzör',
    short: 'Bluetooth uygulama kontrollü, 300 ml kapasiteli ultrasonik difüzör; 300-800 m³ kapsama.',
    desc: 'Ultrasonik atomizasyonla esansı ince bir sise dönüştürür ve Bluetooth mobil uygulama üzerinden yönetilir. PP gövdeli cihaz DC 6V ile 2 W güç tüketir, ≤35 dB ses seviyesinde çalışır ve 300 ml esans haznesiyle 300-800 m³ alanı kokulandırır. Beyaz ve siyah renk seçenekleri mevcuttur.',
    img: 'ck629', pos: '50% 50%', gallery: 2,
    features: ['Ultrasonik atomizasyon', 'Bluetooth uygulama kontrolü', 'Düşük gürültü (≤35 dB)', '300 ml esans haznesi'],
    variants: ['CK-629A-APP (Beyaz)', 'CK-629B-APP (Siyah)'],
    specs: [['Boyut', '175 × 65 × 290 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '300 ml'], ['Kapsama alanı', '300-800 m³'], ['Kontrol', 'Bluetooth uygulama'], ['Kurulum', 'Masaüstü']],
    use: COMMON_USE_SMALL
  },
  {
    id: 'ck638', model: 'CK-638', cat: 'wall',
    title: 'Ultrasonik Duvar Difüzörü - LED / LCD',
    short: 'Korozyona dayanıklı PP gövde, LED sensör ve LCD kontrol paneli ile 300 m³ kapsama.',
    desc: 'Ultrasonik atomizasyonla hızlı koku dağılımı sunan CK-638; akıllı kumanda, LED ışık algılama ve LCD dijital kontrol paneli ile gelir. Gıda sınıfı, korozyona dayanıklı PP malzeme üretici beyanına göre FDA uyumludur. İz bırakmayan yapışkanla 3 saniyede kurulum yapılır.',
    img: 'ck638', pos: '40% 50%', gallery: 3,
    features: ['Ultrasonik atomizasyon', 'Uzaktan / manuel kontrol', 'Düşük gürültü', 'Pil veya Type-C güç', 'Masaüstü ve duvar çift kullanım', 'Zamanlı püskürtme', 'Değiştirilebilir ultrasonik plaka'],
    variants: ['CK-638A', 'CK-638B', 'Akıllı kumanda: CK-638-YK', 'LED: CK-638-LED', 'LCD: CK-638-LCD'],
    specs: [['Boyut', '85 × 65 × 180 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP (gıda sınıfı)'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '< 8 dBA'], ['Esans kapasitesi', '168 ml'], ['Kapsama alanı', '300 m³'], ['Güç kaynağı', '4 × AA pil / Type-C 6V'], ['Net ağırlık', '255 g'], ['Koli', '50 adet · 493×395×380 mm · 14,8 kg brüt']],
    use: COMMON_USE_SMALL
  },
  {
    id: 'ck648', model: 'CK-648', cat: 'wall',
    title: 'Ultrasonik Duvar Difüzörü - 3 Renk',
    short: 'Beyaz, siyah ve üçüncü renk seçeneğiyle eğlence mekânlarına da uygun kompakt difüzör.',
    desc: 'Taşınabilir tasarımıyla kolay kullanım sunar. Akıllı uzaktan kumanda, LED ışık algılama ve LCD dijital ekran seçenekleri vardır. Yüksek sıcaklığa dayanıklı gıda sınıfı PP, kokusuz ve toksik değildir; üretici beyanına göre FDA uyumludur.',
    img: 'ck648', pos: '40% 50%', gallery: 3,
    features: ['Ultrasonik atomizasyon', 'Uzaktan / manuel kontrol', 'Düşük gürültü', 'Pil veya Type-C güç', 'Masaüstü ve duvar çift kullanım', 'Zamanlı püskürtme'],
    variants: ['CK-648A', 'CK-648B', 'CK-648C', 'Akıllı kumanda: CK-648-YK', 'LED: CK-648-LED', 'LCD: CK-648-LCD'],
    specs: [['Boyut', '85 × 65 × 180 mm'], ['Renk', 'Beyaz / Siyah / Siyah (alternatif)'], ['Malzeme', 'PP (gıda sınıfı)'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '< 8 dBA'], ['Esans kapasitesi', '168 ml'], ['Kapsama alanı', '300 m³'], ['Güç kaynağı', '4 × AA pil / Type-C 6V'], ['Net ağırlık', '255 g'], ['Koli', '50 adet · 493×395×380 mm · 14,4 kg brüt']],
    use: 'Eğlence mekânları, otel odaları, banyo, güzellik salonu, oturma odası, ofis, asansör, koridor/merdiven, evcil hayvan alanları'
  },
  {
    id: 'ck688', model: 'CK-688', cat: 'wall', badge: 'Ultra İnce',
    title: 'Çift Akışkanlı Büyük Alan Difüzörü',
    short: '500 ml kapasite, 5,3 cm ultra ince gövde ve uygulama kontrolüyle 800 m³ kapsama.',
    desc: 'Çift akışkanlı atomizasyon ile hızlı ve homojen koku yayılımı. 4 AA pil (Type-C 6V) ile çalışır; akıllı uzaktan kumanda ve mobil uygulama ile yönetilir. Gıda sınıfı, yüksek sıcaklık ve korozyona dayanıklı PP malzeme üretici beyanına göre FDA uyumludur. Kalıntı bırakmadan 3 saniyede monte edilir.',
    img: 'ck688', pos: '35% 50%', gallery: 3,
    features: ['Çift akışkanlı atomizasyon', 'Uzaktan kumanda / mobil uygulama', 'Düşük gürültü', 'Pil veya güç kaynağı', 'Dikişsiz duvar montajı', 'Zamanlı püskürtme', 'Sadece 5,3 cm kalınlık'],
    variants: ['CK-688A (Beyaz)', 'CK-688B (Siyah)'],
    specs: [['Boyut', '168 × 53 × 240 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP (gıda sınıfı)'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '< 36 dB'], ['Esans kapasitesi', '500 ml'], ['Kapsama alanı', '800 m³'], ['Güç kaynağı', '4 × AA pil / Type-C 6V'], ['Net ağırlık', '618 g'], ['Koli', '32 adet · 480×360×600 mm · 24,5 kg brüt']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck689', model: 'ADS-689', cat: 'wall',
    title: 'Çift Akışkanlı Ultra İnce Difüzör',
    short: 'Sessiz çalışan (≤35 dB), 500 ml kapasiteli; Bluetooth uygulama ya da kablosuz kumandayla yönetilen ince difüzör.',
    desc: 'Çift akışkanlı atomizasyonla hızlı ve homojen koku yayılımı sağlar. Bluetooth uygulamalı (ADS-689B) ve kablosuz kumandalı (ADS-689-YK) iki sürümü vardır. ABS ve PP gövde yüksek sıcaklığa dayanıklıdır; kokusuz, toksik değildir ve üretici beyanına göre FDA uyumludur. 600-800 m³ alanlar için uygundur.',
    img: 'ck689', pos: '35% 50%', gallery: 3,
    features: ['Çift akışkanlı atomizasyon', 'Bluetooth uygulama veya kablosuz kumanda', 'Düşük gürültü (≤35 dB)', 'Pil veya güç kaynağı', 'Zamanlı püskürtme', 'Kişiye özel tasarım'],
    variants: ['ADS-689B · Bluetooth uygulama (Beyaz / Siyah)', 'ADS-689-YK · Kablosuz kumanda (Beyaz / Siyah)'],
    specs: [['Boyut', '168 × 53,8 × 240 mm'], ['Renk', 'Beyaz / Siyah (opsiyonel)'], ['Malzeme', 'ABS + PP'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '500 ml'], ['Kapsama alanı', '600-800 m³'], ['Kontrol', 'Bluetooth uygulama (ADS-689B) / kablosuz kumanda (ADS-689-YK)'], ['Kurulum', 'Masaüstü'], ['Güç kaynağı', '4 × AA pil / Type-C 6V'], ['Net ağırlık', '536 g'], ['Koli', '32 adet · 480×360×600 mm · 21,6 kg brüt']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck687', model: 'ADS-687', cat: 'wall',
    title: 'Kompakt Çift Akışkanlı Difüzör',
    short: '150 ml kapasiteli, yenilenmiş ekran panelli ve Bluetooth uygulama kontrollü kompakt difüzör; 300-600 m³ kapsama.',
    desc: 'Çift akışkanlı atomizasyon ile hızlı ve eşit koku dağılımı. Bluetooth mobil uygulama ve yenilenmiş ekran paneliyle kolay kullanım. Gıda sınıfı, yüksek sıcaklığa dayanıklı PP gövde; üretici beyanına göre FDA dahil uluslararası standartlara uygundur.',
    img: 'ck687', pos: '40% 50%', gallery: 3,
    features: ['Çift akışkanlı atomizasyon', 'Bluetooth uygulama kontrolü', 'Yenilenmiş ekran paneli', 'Düşük gürültü (≤35 dB)', 'Zamanlı püskürtme'],
    variants: ['ADS-687A (Beyaz)', 'ADS-687B (Siyah)'],
    specs: [['Boyut', '148 × 67 × 185 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP'], ['Gerilim / Güç', 'DC 6V / 2W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '150 ml'], ['Kapsama alanı', '300-600 m³'], ['Kontrol', 'Bluetooth uygulama, yenilenmiş ekran paneli'], ['Kurulum', 'Masaüstü'], ['Net ağırlık', '512 g'], ['Koli', '30 adet · 465×385×490 mm · 19 kg brüt']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck631', model: 'CK-631', cat: 'pro', badge: 'Profesyonel',
    title: 'Hava Pompalı Klima Bağlantılı Difüzör',
    short: 'Dahili hava pompası, 800 ml kapasite ve 3500 m³ kapsama; Bluetooth/WiFi kontrol.',
    desc: 'HVAC sistemlerine entegre edilebilen, dahili hava pompalı yenilikçi difüzör. Telefon üzerinden çalışma saatleri ve koku yoğunluğu hassas biçimde ayarlanır. Kızılötesi yağ seviyesi algılama ve soğuk hava difüzyon teknolojisi sunar. Gıda sınıfı PP; üretici beyanına göre FDA uyumlu.',
    img: 'ck631', pos: '40% 50%', gallery: 3,
    features: ['Bluetooth / WiFi uzaktan kontrol', 'Çok güçlü atomizasyon', 'Dahili hava pompası', '24 saat akıllı zamanlayıcı', 'Klima bağlantısı', 'Kızılötesi yağ seviye algılama', 'Soğuk hava difüzyonu'],
    variants: ['CK-631A (Beyaz)', 'CK-631B (Siyah)'],
    specs: [['Boyut', '265 × 115 × 252 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP (gıda sınıfı)'], ['Gerilim / Güç', 'DC 12V / 12W'], ['Ses seviyesi', '< 42 dBA'], ['Esans kapasitesi', '800 ml'], ['Kapsama alanı', '3.500 m³'], ['Güç girişi', 'Type-C'], ['Koli', '36 adet · 480×360×600 mm']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck620', model: 'ADS-620B / 640B / 670B', cat: 'pro', badge: 'Seri',
    title: 'Yüksek Hacimli Sis Difüzör Serisi',
    short: '1000 ml kapasite, 2.000-12.000 m³ kapsama; zemine yerleştirilen, klima (HVAC) sistemine bağlanabilen metal gövde.',
    desc: 'Yüksek sis hacimli teknolojiyle saniyeler içinde etki. Zemine yerleştirilir ve merkezi klima (HVAC) sistemine bağlanabilir. Akıllı uygulamadan tek tuşla kontrol, CNC ekran ve ayarlanabilir koku yoğunluğu. Çok sessiz çalışma; tak-çıkar atomizer başlığı ve manyetik kilit ile sorunsuz bakım.',
    img: 'ck620', pos: '30% 50%', gallery: 3,
    features: ['Bluetooth uygulama kontrolü', 'Süper atomizasyon', 'Düşük gürültü (≤35 dB)', 'Zemine yerleştirme', 'Zamanlı püskürtme', 'Ultra büyük kapasite', 'Klima bağlantısı', 'Dokunmatik kontrol'],
    // [DOĞRULANACAK] Listede ADS-640B ve ADS-670B için aynı ölçü (428×128×372 mm) verilmiş.
    variants: ['ADS-620B · 328×128×372 mm · 12W · 2.000-5.000 m³', 'ADS-640B · 428×128×372 mm · 15W · 4.000-8.000 m³', 'ADS-670B · 428×128×372 mm · 18W · 7.000-12.000 m³'],
    specs: [['Boyut', '328 / 428 / 428 × 128 × 372 mm'], ['Renk', 'Siyah'], ['Malzeme', 'Metal'], ['Gerilim', 'DC 12V'], ['Güç', '12W / 15W / 18W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '1000 ml'], ['Kapsama alanı', '2.000-5.000 / 4.000-8.000 / 7.000-12.000 m³'], ['Kurulum', 'Zemin; klima (HVAC) sistemine bağlanabilir'], ['Koli', '1 adet']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck611', model: 'CK-611 / 612 / 613', cat: 'pro', badge: 'Çift Başlık',
    title: 'Çift Başlıklı Havacılık Alüminyum Difüzör',
    short: '2 × 1000 / 3000 / 5000 ml seçenekli, 5.000 - 15.000 m³ kapsama alanı.',
    desc: 'Mekânın boyutuna göre tek veya çift delikli sis seçilebilen çift atomizer başlıklı tasarım; daha hızlı koku yayılımı sağlar. Merkezi klima/taze hava sistemine bağlanabilir. Akıllı uygulama ile tek tuşla kontrol, CNC ekran ve ayarlanabilir koku yoğunluğu. Ultra sessiz çalışma ile 5.000 - 15.000 m³ alanda zamanlı koku yayılımı.',
    img: 'ck611', pos: '50% 50%', gallery: 3,
    features: ['Çift başlıklı atomizasyon', 'Bluetooth uygulama kontrolü', 'Süper güçlü atomizasyon', 'Düşük gürültü', 'Zamanlı püskürtme', 'Ultra büyük kapasite', 'Klima bağlantısı'],
    variants: ['CK-611A · 2 × 1000 ml', 'CK-612A · 2 × 3000 ml', 'CK-613A · 2 × 5000 ml'],
    specs: [['Malzeme', 'Havacılık alüminyum profil'], ['Gerilim', 'DC 12V - 3A'], ['Güç', '28W'], ['Ses seviyesi', '≤ 40 dB'], ['Kapasite', '2 × 1000 / 3000 / 5000 ml'], ['Kapsama alanı', '5.000 - 15.000 m³'], ['Koli', '1 adet']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck621', model: 'CK-621 / 622 / 623', cat: 'pro',
    title: 'Havacılık Alüminyum Büyük Hacim Difüzörü',
    short: '1000 / 3000 / 5000 ml kapasite ve 8.000 m³ geniş alan kapsama.',
    desc: 'Süper atomizer başlığı, merkezi klima/taze hava sistemine bağlanabilme, akıllı uygulama ile tek tuşla kontrol, CNC ekran ve ayarlanabilir koku yoğunluğu. 8.000 m³ geniş alan koku yayılımı ve zamanlayıcı işlevi ile sürekli aromatik yayılım.',
    img: 'ck621', pos: '50% 50%', gallery: 3,
    features: ['Süper atomizasyon', 'Bluetooth uygulama kontrolü', 'Düşük gürültü', 'Zamanlı püskürtme', 'Ultra büyük kapasite', 'Klima bağlantısı'],
    variants: ['CK-621A · 1000 ml', 'CK-622A · 3000 ml', 'CK-623A · 5000 ml'],
    specs: [['Malzeme', 'Havacılık alüminyum profil'], ['Gerilim', 'DC 12V - 3A'], ['Güç', '28W'], ['Ses seviyesi', '≤ 40 dB'], ['Kapasite', '1000 / 3000 / 5000 ml'], ['Kapsama alanı', '8.000 m³'], ['Koli', '1 adet']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck686', model: 'CK-686', cat: 'pro', badge: 'Kolon',
    title: 'Nano Atomizasyonlu Kolon Difüzör',
    short: 'Zeminde ayakta duran alüminyum kolon; 500 ml kapasite ve 1.500-2.000 m³ kapsama alanı.',
    desc: 'Taş dokulu atomizer başlığıyla tasarıma imza atan, zeminde ayakta duran kolon tipi ticari difüzör. Tak-çıkar atomizer ile kolay yağ değişimi, manyetik kilit mekanizması. LED ekranlı akıllı uygulama ile tek dokunuşla kontrol. Nano sis teknolojisiyle 1.500-2.000 m³ alan difüzyonu; WiFi ve Bluetooth modlarında zamanlı çalışma, taze hava sistemine bağlanabilir.',
    img: 'ck686', pos: '50% 35%', gallery: 3,
    features: ['Nano atomizasyon', 'Bluetooth uygulama kontrolü', 'Düşük gürültü (≤35 dB)', 'Şebeke gücü', 'Taze hava sistemine bağlanabilir', 'Zamanlı püskürtme'],
    variants: ['CK-686A (Beyaz)', 'CK-686B (Siyah)'],
    specs: [['Boyut', '575 × 115 × 160 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'Alüminyum alaşım'], ['Gerilim / Güç', 'DC 12V / 12W'], ['Ses seviyesi', '≤ 35 dB'], ['Kapasite', '500 ml'], ['Kapsama alanı', '1.500-2.000 m³'], ['Kurulum', 'Zemin (ayakta durur)']],
    use: COMMON_USE_COMMERCIAL + ', satış salonu'
  },
  {
    id: 'ck683', model: 'CK-683', cat: 'pro', badge: 'Pilli',
    title: 'Kompakt Alüminyum Çift Akışkanlı Difüzör',
    short: '5000 mAh dahili pil, Bluetooth kontrol ve 300 m³ kapsama alanı.',
    desc: 'Ultra kompakt tasarım sayesinde nakliye maliyetlerini düşürür. 5000 mAh bataryasıyla kesintisiz çalışma, 300 m³ kapsama. Dahili Bluetooth ile ayarlar kolayca yönetilir; Type-C girişi, su geçirmez dokunmatik kontrol.',
    img: 'ck683', pos: '50% 40%', gallery: 3,
    features: ['Çift akışkanlı atomizasyon', 'Bluetooth uygulama kontrolü', 'Düşük gürültü', 'Dahili pil', 'Type-C arayüz', 'Su geçirmez dokunmatik kontrol'],
    variants: ['CK-683A (Gümüş)', 'CK-683B (Siyah)'],
    specs: [['Boyut', 'Ø92 × 305 mm'], ['Renk', 'Gümüş / Siyah'], ['Malzeme', 'Alüminyum alaşım'], ['Gerilim / Güç', 'DC5V-2A (Type-C) / 8W'], ['Pil', '5000 mAh'], ['Ses seviyesi', '≤ 38 dB'], ['Esans kapasitesi', '110 ml'], ['Kapsama alanı', '300 m³'], ['Net ağırlık', '0,82 kg']],
    use: COMMON_USE_COMMERCIAL + ', satış salonu'
  },
  {
    id: 'ads685', model: 'ADS-685', cat: 'pro', badge: 'Masaüstü',
    title: 'Masaüstü Ticari Koku Difüzörü',
    short: 'Alüminyum kolon gövde, 200 ml kapasite ve 400-1.200 m³ kapsama; masaüstü kullanım.',
    desc: 'Ticari alanlar için tasarlanmış, alüminyum gövdeli masaüstü difüzör. Tabanındaki ışık halkasıyla dekoratif bir duruşu vardır. DC 12V ile 12 W güç tüketir, ≤35 dB ses seviyesinde çalışır ve 200 ml esans haznesiyle 400-1.200 m³ alanı kokulandırır. Beyaz ve siyah renk seçenekleri mevcuttur.',
    img: 'ads685', pos: '50% 50%', gallery: 0,
    features: ['Ticari kullanım', 'Alüminyum gövde', 'Düşük gürültü (≤35 dB)', 'Masaüstü yerleşim'],
    variants: ['ADS-685C (Beyaz)', 'ADS-685B (Siyah)'],
    specs: [['Boyut', '324 × 81 × 114 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'Alüminyum alaşım'], ['Gerilim / Güç', 'DC 12V / 12W'], ['Ses seviyesi', '≤ 35 dB'], ['Esans kapasitesi', '200 ml'], ['Kapsama alanı', '400-1.200 m³'], ['Kurulum', 'Masaüstü']],
    use: COMMON_USE_COMMERCIAL
  },
  {
    id: 'ck656', model: 'CK-656', cat: 'pro', badge: 'Tavan Tipi',
    title: 'Tavan / Duvar / Ray Montajlı Difüzör',
    short: '350 ml şişe, 3 metrelik teleskopik çubukla merdivensiz yağ değişimi.',
    desc: 'Tavan, duvar ve ray montaj seçenekleriyle stabil performans sunan şık difüzör. 350 ml büyük kapasiteli şişe sık dolum gerektirmez. Tek parça vidalı şişe ve 3 metrelik teleskopik çubuk sayesinde merdivene çıkmadan yağ değişimi; bakım süresi ve maliyeti belirgin biçimde azalır.',
    img: 'ck656', pos: '45% 50%', gallery: 0,
    features: ['Nano atomizasyon', 'Bluetooth uygulama kontrolü', 'Düşük gürültü', 'İz bırakmayan montaj', '24 saat modu'],
    variants: ['CK-656A (Beyaz)', 'CK-656B (Siyah)', 'Klasik el ile yağ değişimi veya merdivensiz yağ değişimi versiyonu'],
    specs: [['Boyut', '147 × 147 × 188 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP'], ['Gerilim', 'DC 12V'], ['Ses seviyesi', '< 38 dB'], ['Kapasite', '300 ml / 350 ml'], ['Kapsama alanı', '500 m³'], ['Koli', '18 adet']],
    use: 'Otel, havalimanı, sinema, ofis, ev, banyo, asansör, koridor'
  },
  {
    id: 'ck644', model: 'CK-644', cat: 'plug', badge: 'Prize Takılan',
    title: 'Akıllı Bluetooth Prize Difüzörü',
    short: 'Prize takılarak duvara monte edilen Bluetooth difüzör; 100 ml kapasite, 100-300 m³ kapsama.',
    desc: 'Hafif PP gövde ve tak-çalıştır tasarımla anında kullanım. Prize takılarak duvara monte edilir; delme gerektirmeden çeşitli prizlere uyum sağlayan 3 fiş seçeneği sunar. Bluetooth mobil uygulama ile yönetilir.',
    img: 'ck644', pos: '40% 50%', gallery: 0,
    features: ['İki akışkanlı atomizasyon', 'Bluetooth uygulama kontrolü', 'Düşük gürültü (≤35 dB)', 'Tak ve çalıştır', 'Duvarı çizmez'],
    variants: ['CK-644A (Beyaz)', 'CK-644B (Siyah)', 'İki pimli / Avrupa tipi iki yuvarlak pimli / üç pimli fiş'],
    specs: [['Boyut', '150 × 73 × 235 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP'], ['Gerilim / Güç', 'DC 6V / 5W'], ['Ses seviyesi', '≤ 35 dB'], ['Kapasite', '100 ml'], ['Kapsama alanı', '100-300 m³'], ['Kontrol', 'Bluetooth uygulama'], ['Kurulum', 'Duvara monte (prize takılır)']],
    use: 'Ev, banyo, asansör, koridor'
  },
  {
    id: 'ck645', model: 'CK-645', cat: 'plug', badge: 'Prize Takılan',
    title: 'İnce Gövdeli Akıllı Prize Takılan Difüzör',
    short: '100 ml kapasite, Bluetooth veya akıllı mod, 3 fiş seçeneği.',
    desc: 'Hafif PP gövdeli, estetik tasarımlı Bluetooth difüzör. Delme gerektirmeden çeşitli prizlere takılır. Bluetooth versiyonu ve akıllı versiyon (24 saat modu veya ışık algılama) olarak iki seçenek.',
    img: 'ck645', pos: '30% 50%', gallery: 0,
    features: ['İki akışkanlı atomizasyon', 'Bluetooth / manuel kontrol', 'Düşük gürültü', 'Tak ve çalıştır', 'Duvarı çizmez', '24 saat modu'],
    variants: ['CK-645A (Beyaz)', 'CK-645B (Siyah)'],
    specs: [['Boyut', '70 × 61 × 270 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'PP'], ['Gerilim / Güç', '100-240V / 2,5W'], ['Ses seviyesi', '< 38 dB'], ['Kapasite', '100 ml'], ['Kapsama alanı', '300 m³'], ['Koli', '6 adet']],
    use: 'Ev, banyo, asansör, koridor'
  },
  {
    id: 'ck613', model: 'CK-613', cat: 'plug', badge: 'Elektriksiz',
    title: 'Elektriksiz Koku Kutusu',
    short: 'Küçük alanlar için pilsiz, güvenli, iz bırakmayan pasif koku kutusu (30 m³).',
    desc: 'Küçük alanlar için hızlı koku giderme, temiz hava sirkülasyonu ve kalıcı koku sağlayan kompakt koku kutusu. Elektriksiz çalışır; hamile ve bebekli ortamlara uygun, çevre dostu malzemelerle üretilmiştir. Gıda sınıfı PP; üretici beyanına göre FDA uyumlu. 3 saniyede iz bırakmadan kurulum.',
    img: 'ck613', pos: '50% 50%', gallery: 3,
    features: ['Sigara kokusunu giderir', 'Temiz hava', 'Doğal bitkisel ekstrelerle', 'Kalıcı koku', 'Duvarı çizmez', 'Güvenli ve toksik değil'],
    variants: ['CK-613A (Beyaz)', 'CK-613B (Siyah)', 'CK-613C (Gri)'],
    specs: [['Boyut', '85 × 25 × 130 mm'], ['Renk', 'Beyaz / Siyah / Gri'], ['Malzeme', 'PP (gıda sınıfı)'], ['Kapsama alanı', '30 m³'], ['Net ağırlık', '55 g'], ['Koli', '80 adet · 660×500×430 mm · 6,7 kg brüt']],
    use: 'Banyo, oda, oturma odası, asansör, koridor/merdiven, evcil hayvan alanı, gardırop, ayakkabılık'
  },
  {
    id: 'ck608ab', model: 'CK-608A / 608B', cat: 'home', badge: 'Araç & Ev',
    title: 'Araç Hava Temizleme Koku Cihazı',
    short: 'Ultrasonik atomizasyon, tek dokunuş kontrol; evde ve araçta kullanım.',
    desc: 'Kompakt, zarif ve sade tasarımıyla hem evde hem araçta kullanılabilir. Ferah ve hoş kokusu tüm duyularınızı canlandırır.',
    img: 'ck608ab', pos: '50% 50%', gallery: 0,
    features: ['Ultrasonik atomizasyon', 'Tek tuşla kontrol', 'Düşük gürültü'],
    variants: ['CK-608A (Beyaz)', 'CK-608B (Siyah)'],
    specs: [['Boyut', '71 × 138 mm'], ['Renk', 'Beyaz / Siyah'], ['Malzeme', 'ABS'], ['Güç', 'DC5V / 1W'], ['Pil', '500 mAh'], ['Kapsama alanı', '300 m³'], ['Koli', '60 adet']],
    use: 'Yatak odası, çalışma odası, oturma odası, araç'
  },
  {
    id: 'ck608d', model: 'CK-608D', cat: 'home', badge: 'Araç & Ev',
    title: 'Araç Hava Temizleyici Difüzör - Rose Gold',
    short: 'Bej / rose gold seçenekli, 2000 mAh pilli, 5-20 ml esans kapasiteli difüzör.',
    desc: 'Kompakt ve şık tasarımıyla evde ve araçta kullanılabilir. 2000 mAh bataryası ile uzun süreli kullanım sunar.',
    img: 'ck608d', pos: '50% 50%', gallery: 0,
    features: ['Ultrasonik atomizasyon', 'Tek tuşla kontrol', 'Düşük gürültü'],
    variants: ['Bej', 'Rose Gold'],
    specs: [['Boyut', '71 × 138 mm'], ['Renk', 'Bej / Rose Gold'], ['Malzeme', 'ABS'], ['Güç', 'DC5V-0,5A / 2,5W'], ['Pil', '2000 mAh'], ['Esans kapasitesi', '5 - 20 ml'], ['Kapsama alanı', '100 m³'], ['Koli', '60 adet']],
    use: 'Yatak odası, çalışma odası, oturma odası, araç'
  },
  {
    id: 'ads622', model: 'ADS-622', cat: 'home', badge: 'Dekoratif',
    title: 'Masif Ahşap Tabanlı Aroma Difüzörü',
    short: 'Cam gövde, masif ahşap taban ve 7 renkli gece lambası; Type-C şarj.',
    desc: 'Düşük gürültülü, zamanlı tasarım; Type-C şarj, güvenli malzeme, masif ahşap taban ve renkli gece lambası. Telefon şarj adaptörü, powerbank veya dizüstü bilgisayardan beslenebilir.',
    img: 'ads622', pos: '50% 50%', gallery: 0,
    features: ['Düşük gürültü, zamanlayıcı', 'Type-C şarj', 'Güvenli malzeme', 'Masif ahşap taban', 'Renkli gece lambası'],
    variants: [],
    specs: [['Boyut', '105 × 105 × 150 mm'], ['Malzeme', 'Masif ahşap + cam'], ['Işık', '7 renk geçişli + sabit ışık'], ['Güç / Gerilim', '5W / DC5V-1A'], ['Pil', '2000 mAh'], ['Ağırlık', '375 g'], ['Kapsama alanı', '50 m²']],
    use: 'Yatak odası, çalışma odası, oturma odası'
  },
  {
    id: 'ads611', model: 'ADS-611', cat: 'home', badge: 'Dekoratif',
    title: 'Kum Saati Tasarımlı Aroma Difüzörü',
    short: 'Cam ve masif ahşap, 7 renkli ışık, 3 renk seçeneği (A/B/C).',
    desc: 'Masif ahşap tabanlı, renkli gece lambalı, Type-C şarjlı kompakt dekoratif aroma difüzörü. Düşük gürültülü ve zamanlayıcılı.',
    img: 'ads611', pos: '50% 50%', gallery: 0,
    features: ['Düşük gürültü, zamanlayıcı', 'Type-C şarj', 'Güvenli malzeme', 'Masif ahşap taban', 'Renkli gece lambası'],
    variants: ['ADS-611A', 'ADS-611B', 'ADS-611C'],
    specs: [['Boyut', '78 × 78 × 150 mm'], ['Malzeme', 'Masif ahşap + cam'], ['Işık', '7 renk geçişli + sabit ışık'], ['Güç / Gerilim', '5W / DC5V-1A'], ['Pil', '2000 mAh'], ['Ağırlık', '300 g'], ['Kapsama alanı', '50 m²']],
    use: 'Yatak odası, çalışma odası, oturma odası'
  },
  {
    id: 'ck85', model: 'CK-85', cat: 'reed', badge: 'Çubuklu',
    title: 'Şehirde Bahar - Çubuklu Oda Kokusu',
    short: 'Gül ve kiraz çiçeği notaları; cam şişe, ateşsiz ve dumansız.',
    desc: 'Cam şişe gövdesi, kalıcı koku ve estetik bir duruş. Ofis, çalışma odası, salon ve yatak odası gibi küçük alanlar için.',
    img: 'reed1', external: true, pos: '50% 40%', gallery: 0,
    features: ['Ateşsiz & dumansız', 'Kalıcı koku', 'Cam şişe'],
    variants: [],
    specs: [['Kapasite', '120 ml'], ['Koku notaları', 'Gül, kiraz çiçeği, çiçeksi'], ['Koli', '20 adet']],
    use: 'Ofis, çalışma odası, oturma odası, yatak odası'
  },
  {
    id: 'ck013', model: 'CK-013', cat: 'reed', badge: 'Çubuklu',
    title: 'Çiçek Bolluğu - Çubuklu Oda Kokusu',
    short: 'Mavi rüzgâr çanı, yaz ferahlığı ve Hawaii plajı notaları.',
    desc: 'Sade ve zarif formu ile evi dekore eder, zevki yansıtır. Ofis, çalışma odası, salon ve yatak odası için.',
    img: 'reed3', external: true, pos: '50% 40%', gallery: 0,
    features: ['Ateşsiz & dumansız', 'Kalıcı koku', 'Zarif form'],
    variants: [],
    specs: [['Kapasite', '100 ml'], ['Koku notaları', 'Mavi rüzgâr çanı, yaz ferahlığı, Hawaii plajı'], ['Koli', '20 adet']],
    use: 'Ofis, çalışma odası, oturma odası, yatak odası'
  },
  {
    id: 'ck014', model: 'CK-014', cat: 'reed', badge: 'Çubuklu',
    title: 'Çiçeklerin Dansı - Çubuklu Oda Kokusu',
    short: 'Çiçeksi notalı, 200 ml cam şişeli oda kokusu.',
    desc: 'Cam şişe, kalıcı koku, estetik ve modern bir yaşam. Otel lobilerini çağrıştıran çiçeksi bir koku profili.',
    img: 'reed2', external: true, pos: '50% 40%', gallery: 0,
    features: ['Ateşsiz & dumansız', 'Kalıcı koku', 'Çiçeksi koku'],
    variants: [],
    specs: [['Kapasite', '200 ml'], ['Koku notaları', 'Çiçeksi'], ['Koli', '24 adet']],
    use: 'Ofis, çalışma odası, oturma odası, yatak odası'
  },
  {
    id: 'ck015', model: 'CK-015', cat: 'reed', badge: 'Çubuklu',
    title: 'Sandal Ağacı - Çubuklu Oda Kokusu',
    short: 'Doğu odunsu notaları, çam; ruha ve bedene iyi gelen aroma.',
    desc: 'Keyifli aroması beden ve ruhu rahatlatır; şık ve kaliteli bir görünüm sunar.',
    img: 'reed4', external: true, pos: '50% 40%', gallery: 0,
    features: ['Ateşsiz & dumansız', 'Kalıcı koku', 'Odunsu aroma'],
    variants: [],
    specs: [['Kapasite', '100 ml'], ['Koku notaları', 'Sandal ağacı, Doğu odunsu, çam'], ['Koli', '24 adet']],
    use: 'Ofis, çalışma odası, oturma odası, yatak odası'
  }
];

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
