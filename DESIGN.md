# Lobi Tasarım Sistemi

Meira (JVCK ürünlerinin Türkiye distribütörü) B2B tanıtım ve teklif sitesinin görsel dili.
Bu belge `site/css/style.css` dosyasının kaynağıdır. CSS'teki her değişken burada tanımlanır;
yeni bir bileşen eklemeden önce buradaki kurallara bakın.

## 1. Tasarım okuması

> B2B ürün kataloğu ve teklif sitesi; otel, ofis ve mağaza satın alma ekipleri için.
> Dil: lüks mekân kokulandırma. Koyu, sinematik bir girişten sonra sakin, editoryal bir katalog.
> Editoryal serif başlık, okunaklı sans gövde, üç renkli palet (gece mavisi, şampanya, porselen), ölçülü hareket.

| Ayar | Değer | Gerekçe |
| :--- | :--- | :--- |
| Tasarım çeşitliliği | 6 / 10 | Editoryal ritim, asimetrik bölümler; katalog ızgarası taranabilir kalır. |
| Hareket yoğunluğu | 5 / 10 | Durum değişimi, mekânsal süreklilik ve geri bildirim için hareket; sık tekrarlanan işlemler animasyonsuz. |
| Görsel yoğunluk | 3 / 10 (katalog: 5) | Bol boşluk; katalog ve teknik tablolarda bilgi yoğunluğu artar. |

**Tema:** Açık içerik, koyu çerçeve, renk bantlarıyla ayrılan bölümler. Hero, koyu bantlar ve footer gece
mavisi; içerik porselen; ayrılması gereken bölümler şampanya bant. Ana sayfa sırası:
koyu giriş → porselen tanıtım → şampanya küratör → porselen öne çıkanlar → koyu ev ve masaüstü →
şampanya kapanış → koyu footer. Koyu tema (tüm site) sunulmaz.

### Tur 4 değişikliği ve nedeni

Talep: ana sayfa yazıları zor okunuyor; bölümler "tek A4 sayfa" gibi; butonlar açık zemin üzerine koyu yazı;
palet sıfırdan, 2-3 renk.

| Önce | Sonra | Neden |
| :--- | :--- | :--- |
| Bodoni Moda başlık | **Newsreader** (optik boyut 36) | Sekiz aday aynı metinle karşılaştırıldı. Didone'lar (Bodoni, Playfair) ince çizgileriyle yoruyor, Garamond ve Gilda küçük boyutta silikleşiyor; Newsreader büyük boyutta şık, orta kontrastı ve açık harf içleriyle rahat okunuyor |
| Büyük harf navigasyon ve buton etiketleri | Cümle düzeni, 15 px | Büyük harfli küçük metin kelime şeklini yok eder, okumayı yavaşlatır. Büyük harf yalnızca kısa etiketlerde (eyebrow, bölüm etiketi, footer başlıkları) |
| Noir + fildişi + yosun yeşili | **Gece mavisi + şampanya + porselen** | Dört palet adayı (gece/şampanya, patlıcan/pudra, mürekkep/sis, bordo/kum) gerçek ana sayfada denendi. Gece mavisi ve şampanya otel lüksünün klasik ikilisi; gümüş ve beyaz cihazlarla, sıcak lobi fotoğraflarıyla en uyumlu olanı. Pudra fazla kozmetik, sis fazla soğuk, bordo ağır kaldı |
| Koyu zemin + açık yazılı buton | Şampanya zemin + gece mavisi yazı (şampanya bantta porselen zemin) | Talep: açık üzeri koyu. Kontrast 10,8:1 |
| Bölümler aynı zeminde, yalnızca boşlukla ayrılıyor | Renk bantları + her bölümü açan etiket ve uzanan çizgi | Bölümlerin farklı konular olduğu ilk bakışta anlaşılır |

Şampanya, premium segmentte sık kullanılan pirinç/altın klişesine yakın bir aile. Burada metalik vurgu olarak
değil, açık bir zemin tonu (buton, bant) olarak kullanılıyor; metin rengi olarak hiç kullanılmıyor.

### Tur 2 değişikliği ve nedeni (tarihçe; renk ve başlık fontu Tur 4'te değişti)

Tur 1'de palet sıcak taş grisi (`#EEEBE5`) ve çam yeşili, yazı tipleri Cormorant Garamond + Geist idi.
Tur 2'de sektöre daha uygun bir lüks dil istendi (referans: samtida.com.tr girişi):

| Önce | Sonra | Neden |
| :--- | :--- | :--- |
| Cormorant Garamond (başlık) | **Bodoni Moda** | Yüksek kontrastlı Didone, parfüm evlerinin ve lüks otel tabelalarının klasik karakteri. Cormorant küçük boyutta incelip silikleşiyordu. |
| Geist (gövde) | **Jost**, Tur 3'te **Manrope** | Jost geometrik ve şıktı ama küçük x-yüksekliği uzun metinde okumayı zorlaştırdı; Tur 3'te okunabilirlik için Manrope'a geçildi. |
| Taş grisi zemin `#EEEBE5` | Porselen fildişi `#F3F0EA` | Daha sıcak ve temiz; fotoğraflardaki beyaz cihazlarla daha az çatışıyor. |
| Yalnızca açık tema | Noir hero ve footer | Lüks segmentte koyu, sinematik giriş beklentisi; ürün görselleri koyu zeminde öne çıkıyor. |
| Çam yeşili `#2F4B40` | Yosun yeşili `#2C463B` | Aynı aile, biraz daha derin. Koku sektörünün botanik tarafına (yosun, çay, fougère) bağlanıyor. Pirinç/altın klişesinden bilinçli olarak uzak durulur. |

## 2. Renk

Üç renk ve türevleri: **gece mavisi** (koyu), **şampanya** (ikincil), **porselen** (zemin). Metin tonları gece
mavisinden, bant ve buton tonları şampanyadan türer. Dağılım yaklaşık %60 porselen, %25 gece mavisi, %15 şampanya.

| Değişken | Değer | Kullanım |
| :--- | :--- | :--- |
| `--c-bg` | `#F7F4EF` | Porselen: ana zemin |
| `--c-bg-deep` | `#EDE3D2` | Şampanya açık: ayrılan bantlar (`.section--deep`), yivli doku zemini |
| `--c-surface` | `#FCFBF8` | Kart, form, panel; şampanya bantta birincil buton zemini |
| `--c-ink` | `#141C27` | Gece mavisi: başlık ve metin |
| `--c-ink-2` | `#434D5B` | İkincil metin |
| `--c-ink-3` | `#5C6573` | Etiket, meta |
| `--c-line` | `rgba(20,28,39,.12)` | Ayırıcı çizgiler |
| `--c-line-strong` | `#7A8290` | Form alanı ve ikincil buton kenarı (3:1 UI kontrastı) |
| `--c-accent` | `#141C27` | Metin düzeyi vurgu, aktif durum, odak halkası (gece mavisi) |
| `--c-champagne` | `#DDCBAA` | Şampanya: birincil buton zemini, rozet, aktif sekme, koyu zemindeki italik vurgu |
| `--c-champagne-deep` | `#CDB68E` | Buton hover ve kenarı |
| `--c-gold-line` | `#B79C6E` | Yalnızca süs çizgileri (eyebrow çizgisi, bölüm etiketi baklavası); metin için kullanılmaz |
| `--c-error` | `#9A3B2E` | Form hata metni (işlevsel, palet dışı) |
| `--c-noir` | `#141C27` | Koyu yüzeyler: hero, `.section--dark`, footer |
| `--c-noir-2` | `#1D2735` | Koyu zeminde görsel yer tutucu |
| `--c-ivory` | `#F4EFE6` | Koyu zeminde başlık |
| `--c-ivory-2` | `#C3C8D0` | Koyu zeminde gövde |
| `--c-ivory-3` | `#9AA2AE` | Koyu zeminde etiket |
| `--c-line-dark` | `rgba(244,239,230,.16)` | Koyu zeminde ayırıcı |

**Kontrast (WCAG 2.1, hesaplanmış):**

| Ön plan | `--c-bg` porselen | `--c-bg-deep` şampanya bant | `--c-surface` |
| :--- | :--- | :--- | :--- |
| `--c-ink` | 15.6:1 | 13.5:1 | 16.6:1 |
| `--c-ink-2` | 7.8:1 | 6.7:1 | 8.3:1 |
| `--c-ink-3` | 5.4:1 | 4.6:1 | 5.7:1 |
| `--c-line-strong` (UI) | 3.5:1 | 3.1:1 | 3.7:1 |
| `--c-error` | 6.3:1 | 5.4:1 | 6.7:1 |

| Gece mavisi üzerinde | Oran |
| :--- | :--- |
| `--c-ivory` | 15.0:1 |
| `--c-ivory-2` | 10.2:1 |
| `--c-ivory-3` | 6.7:1 |
| `--c-champagne` (italik vurgu, buton zemini) | 10.8:1 |
| Footer dekoratif marka yazısı `#65707F` | 3.4:1 (yalnızca büyük metin; ekran okuyucudan gizli) |

Butonlar: gece mavisi yazı / şampanya zemin 10.8:1, hover zemininde 8.7:1, porselen zeminde 16.6:1.

**Hero görsel üzerindeki metin:** örtü metin bölgesinde en az %80 gece mavisi; `--c-ivory-2` için 5.4:1 ve üzeri,
giriş paragrafı (`#DCDFE4`) ve başlık için daha yüksek.

**Kurallar**
- Üç rengin dışına çıkılmaz. Hata rengi yalnızca form hatalarında.
- Butonlar her zaman açık zemin üzerine koyu yazıdır (bkz. bölüm 7). Koyu zeminli, açık yazılı buton yoktur.
- Saf siyah (`#000`) ve saf beyaz (`#fff`) kullanılmaz.
- Gölgeler gece mavisinden türetilir.
- Zemine çok hafif bir doku (grain) eklenir: sabit, `pointer-events: none` bir katmanda, opaklık 0.035.

## 3. Tipografi

Tur 3'te gövde Manrope'a, Tur 4'te başlıklar Bodoni Moda'dan Newsreader'a geçti (gerekçe bölüm 1).

| Rol | Font | Ağırlık | Not |
| :--- | :--- | :--- | :--- |
| Display, h1, h2, büyük rakamlar, footer marka yazısı | Newsreader | 400, italik 400 (marka 500) | Değişken ağırlık 400-600, optik boyut 36'ya sabit (dosya boyutu için). 28 px altında kullanılmaz |
| Gövde, arayüz, h3 ve altı, kart başlıkları, etiketler | Manrope | 400 gövde, 600 başlık/etiket | Büyük x-yüksekliği, ekranda yüksek okunabilirlik, tam Türkçe desteği |
| Teknik sayılar (tablo, kart) | Manrope, `tabular-nums` | | Hizalı durur |

Fontlar `site/fonts/` altında yerel barındırılır (değişken woff2, latin + latin-ext). Harici font isteği yoktur.

**Ölçek (akışkan)**

| Token | Değer | Kullanım |
| :--- | :--- | :--- |
| `--fs-display` | `clamp(2.75rem, 1.8rem + 4vw, 5.5rem)` | Ana sayfa hero başlığı |
| `--fs-h1` | `clamp(2.3rem, 1.7rem + 2.5vw, 4rem)` | Sayfa başlıkları |
| `--fs-h2` | `clamp(1.85rem, 1.5rem + 1.5vw, 2.8rem)` | Bölüm başlıkları |
| `--fs-h3` | `clamp(1.125rem, 1.05rem + 0.35vw, 1.3rem)` | Kart, ürün, liste başlıkları (Manrope 600) |
| `--fs-lead` | `clamp(1.08rem, 1rem + 0.35vw, 1.25rem)` | Giriş paragrafı |
| `--fs-body` | `1.0625rem` (17 px) | Gövde, satır yüksekliği 1.7 |
| `--fs-small` | `0.9375rem` (15 px) | Meta, açıklama |
| `--fs-label` | `0.8125rem` (13 px) | Etiket, sayaç; altına inilmez |
| `--tracking-caps` | `0.1em` | Büyük harf etiket, buton ve navigasyon aralığı |

**Kurallar**
- Başlıklarda harf aralığı hafif negatif (`-0.01em`, display `-0.015em`); satır yüksekliği 1.05-1.3.
- Paragraf genişliği en fazla `62ch`; makale gövdesi `68ch`.
- Vurgu için aynı fontun italiği kullanılır, başka font karıştırılmaz.
- Navigasyon, butonlar ve çipler cümle düzeninde (Manrope 500-600, 14-16 px). Büyük harf yalnızca kısa
  etiketlerde: eyebrow, bölüm etiketi, footer sütun başlıkları, içindekiler başlığı.
- Marka, müşterinin logosuyla gösterilir (`MEIRA LOGO 1.pdf`, vektör): serif "MEIRA", "I" üzerinde duman kıvrımı,
  altında "AIR SCENT". Kaynak `site/images/brand/logo-sprite.svg` (`#logo-word`: yazı ve duman, 2,33:1;
  `#logo-full`: sloganlı, 1,88:1), renk `currentColor`, adres içerik özetiyle sürümlü. Header'da `#logo-word`
  44 px (mobilde 34 px) yükseklikte; "AIR SCENT" bu boyutta okunmadığı için yalnızca büyük kullanımlarda
  (footer, açılış perdesi, `images/brand/meira-logo.svg`). Logonun yanında ekran okuyucu için gizli "Meira" metni
  (`lang="en"`) bulunur.
- Favicon ve uygulama ikonları: logo yazı tipindeki "M", gece mavisi zemin üzerinde şampanya.
- Büyük harfli üst etiket (eyebrow), başında 36 px şampanya çizgisiyle; yalnızca hero'da.
- Vurgu italiği açık zeminde metin renginde, koyu zeminde şampanya.
- Uzun tire ve orta uzunlukta tire kullanılmaz; aralıklarda kısa tire (`-`) kullanılır.
- Başlıklarda `text-wrap: balance`, paragraflarda `text-wrap: pretty`.

## 4. Aralık ve yerleşim

4 px tabanlı ölçek:

| Token | px | Token | px |
| :--- | :--- | :--- | :--- |
| `--s-1` | 4 | `--s-6` | 32 |
| `--s-2` | 8 | `--s-7` | 48 |
| `--s-3` | 12 | `--s-8` | 64 |
| `--s-4` | 16 | `--s-9` | 96 |
| `--s-5` | 24 | `--s-10` | 128 |

- Kapsayıcı: en fazla `1280px`, yan boşluk `clamp(16px, 4vw, 48px)`. 390 px'te 16 px.
- Bölüm boşluğu: üstte `clamp(4.5rem, 3rem + 6vw, 8.5rem)`, altta bunun 1.12 katı (optik denge).
- Yerleşim CSS Grid ile kurulur; yüzde hesabıyla flex kullanılmaz.
- Asimetrik yerleşimler 900 px altında tek sütuna iner.
- Aynı yerleşim ailesi bir sayfada en fazla bir kez kullanılır. Üst üste en fazla iki görsel/metin bölmesi.
- Tam ekran bölümlerde `100vh` yerine `100svh` / `100dvh`.

## 5. Köşe ve kenar

Tek kural: **mimari, keskin köşeler.**

| Token | Değer | Kullanım |
| :--- | :--- | :--- |
| `--r` | `2px` | Butonlar, çipler, form alanları, görseller, paneller, modal, çekmece |
| `--r-round` | `999px` | Yalnızca teklif listesi sayaç rozeti (sayı dairesi) |

Kartlar kenarlıkla değil, boşluk ve zemin tonuyla ayrılır. Kenarlık yalnızca form alanlarında,
ikincil butonda, çiplerde ve ayırıcı çizgilerde kullanılır.

## 6. Gölge, derinlik ve doku

| Token | Değer | Kullanım |
| :--- | :--- | :--- |
| `--shadow-float` | `0 30px 80px -30px rgba(23,22,21,.28)` | Modal, çekmece |
| `--shadow-toast` | `0 12px 32px -12px rgba(23,22,21,.35)` | Bildirim |
| `--fluted` | Tekrarlayan doğrusal gradyan | Yivli panel dokusu (bkz. aşağı) |

Kart, buton ve görsellerde gölge yoktur. Derinlik, bindirme (negatif margin) ve zemin tonu farkıyla kurulur.
Bulanıklık (`backdrop-filter`) yalnızca sabit başlıkta kullanılır.

**Yivli panel dokusu:** Otel lobilerindeki dikey yivli duvar kaplamasından alınan mimari motif; görsel yerine
yalnızca CSS. Her 14 px'lik yivde ışık alan bir kenar ve gölgeli bir dip, üstten hafif ışık. `--c-bg-deep`
zemin üzerinde `--fluted` görseli. Kullanım yerleri: ana sayfa kapanış bandının iki yanı (orta alan maskeyle
temiz) ve iç sayfa başlıklarının boş sağ yarısı (sola doğru maskeyle kaybolur, 900 px üstünde).

## 7. Bileşenler

**Bölüm etiketi (`.section-label`, Tur 4):** Ana sayfa bölümlerini açar: 10 px'lik döndürülmüş kare (şampanya
çizgi), büyük harf kısa etiket (13 px, 0.14em) ve satırın geri kalanını dolduran ince çizgi. Dekoratif
olduğu için `aria-hidden`; bölümün adı başlığında ya da `aria-label`'ında.

**Koyu bant (`.section--dark`, Tur 4):** Gece mavisi zemin; içindeki metin token'ları (`--c-ink`, `--c-line` vb.)
yerel olarak açık tonlara döner. İçindeki açık paneller `.theme-light` ile varsayılan tonlara geri alınır.
Odak halkası koyu bantta şampanya.

**Başlık (header):** 72 px, yapışkan, tüm sayfalarda gece mavisi zemin (footer ile birlikte koyu çerçeve);
metin token'ları yerel olarak açık tonlara döner, odak halkası şampanya. Kaydırınca gece mavisi %94 + bulanıklık.
"Teklif listesi" düğmesi başlığın en belirgin öğesidir: şampanya zemin, gece mavisi yazı, içinde gece mavisi
sayaç rozeti (boşken çerçeveli). Mobil menü paneli de gece mavisi. Ana sayfada hero'nun üstündeyken (`.on-dark`, IntersectionObserver) zemin şeffaf, kaydırınca
gece mavisi %72 + bulanıklık. Navigasyon cümle düzeninde 15 px; aktif sayfa 1 px vurgu çizgisi, fareyle
üzerine gelince çizgi soldan çizilir. 1100 px altında menü butonu.

**Ana sayfa girişi (hero):** `min-height: 100svh`, gece mavisi zemin; başlığın altına girer (negatif margin).
- Arkada görsel duvarı: üç sıra 4:5 karo (cihazlar, mekânlar, ev ve çubuklu ürünler), zıt yönlerde
  110-140 s'de bir tur atan sabit hızlı akış (`linear`; sürekli hareket için doğru eğri). İçerik iki kez
  yazılır, iz yarısı kadar kayınca kesintisiz başa döner. Görseller `images/hero/` altında 360 x 450 küçük
  kopyalardır (toplam ~1 MB). `site.js` doldurur; JS yoksa gece mavisi zemin görünür.
- Görsel akışı için **durdur/oynat düğmesi** (WCAG 2.2.2). Ekran dışındayken otomatik durur.
  Azaltılmış harekette akış hiç başlamaz ve düğme gizlenir.
- Örtü: soldan sağa %94 → %50, alttan %92 → 0. Mobilde yukarıdan aşağı %80 → %95.
- İçerik: eyebrow, display başlık, giriş paragrafı, ürün grubu çipleri (`urunler.html?cat=` bağlantıları),
  iki buton (açık ve hayalet). Altta katalog verileri şeridi (ürün sayısı `data-product-count`'tan).

**Butonlar** (yükseklik 50 px, büyük boy 56 px, metin tek satır, cümle düzeni, Manrope 600). Kural: **açık
zemin üzerine koyu yazı.**
- `.btn--primary`: şampanya zemin, şampanya-derin kenar, gece mavisi yazı. Hover: şampanya-derin zemin.
  Şampanya bant (`.section--deep`) içinde: porselen yüzey zemin, ince gece mavisi kenar.
- `.btn--quiet`: şeffaf, `--c-line-strong` kenar, gece mavisi yazı. Hover: gece mavisi %4 zemin.
- `.btn--light` (koyu zeminde): `.btn--primary` ile aynı (şampanya). `.btn--ghost-light`: fildişi %42 kenar.
- `.btn-add` (Listeye ekle): kenarlı; hover ve "Eklendi" durumunda şampanya zemin, gece mavisi yazı.
- `.link-arrow`: üçüncül metin bağlantısı, ok ikonu hover'da 3 px kayar.
- Aynı niyet için tek etiket: teklif = "Teklif iste", listeye ekleme = "Listeye ekle",
  katalog = "Ürünleri incele".
- Listeye ekleme butonları tıklanınca 1,6 s boyunca "Eklendi" + onay ikonuna döner (`.is-added`);
  başlıktaki sayaç rozeti kısa bir büyüme yapar.

**Ürün kartı:** Kenarlıksız. Üstte 4:3 görsel plakası, altında model kodu, serif başlık, iki satırlık
kısa açıklama, kapsama ve kapasite (tabular), en altta hizalı eylemler (İncele, Listeye ekle).

**Filtre ve arama:** Metin sekmeleri; aktif sekme mürekkep rengi ve alt vurgu çizgisi. Animasyon yok.
Arama alanının görünür etiketi vardır.

**Ürün sayfası (`urun-<id>.html`, Tur 3):** Sayfa konumu; solda yapışkan galeri (ana görsel bir butondur,
`[data-zoom]`: tıklanan noktadan 2 kat yakınlaşır, klavyede merkezden; küçük görseller), sağda model kodu, h1,
kısa açıklama, dört temel değer, "Listeye ekle" ve "Teklif iste". Altında açıklama, özellikler (onay ikonlu
liste), kapsama hacminin 3 / 4 / 6 m tavanda taban alanı karşılığı tablosu, kullanım alanları, varyantlar;
yanda yapışkan teknik veri tablosu. Ardından dolum, SSS akordeonu (`<details>`) ve benzer ürünler.
Ürün modalı Tur 3'te kaldırıldı; eski `urunler.html?model=` bağlantıları ürün sayfasına yönlendirilir.

**Ürün kartı bağlantısı:** Kart başlığındaki bağlantı `::after` ile tüm kartı kaplar; "Listeye ekle" butonu
`z-index` ile onun üstündedir. Odak halkası kartın çevresine çizilir.

**Blog ve belge sayfaları:** Blog dizininde ilk yazı yatay öne çıkan kart, diğerleri üç sütun. Makale gövdesi
`.prose--article` (68ch, h2 Newsreader, h3 Manrope, ince çizgili liste işaretleri, yatay kaydırılabilir ve klavyeyle
odaklanabilir tablolar), altında numaralı kaynak listesi. Sürdürülebilirlik sayfası yapışkan içindekiler +
gövde düzenindedir.

**SSS akordeonu:** `<details>`/`<summary>`; artı ikonu açılınca 45° döner, cevap kısa bir girişle belirir.

**Çekmece katmanı:** Kapalıyken `visibility: hidden` (odaklanılamaz); çıkış animasyonu bittikten
sonra kapanır. Karartma `::before` üzerinde ayrı belirir. JS yalnızca `.open` sınıfını değiştirir.

**Teklif listesi çekmecesi:** Sağdan 440 px panel. Ürün satırı: küçük görsel, model, başlık, adet ayarı,
kaldır. Boş durumda kataloğa yönlendiren açıklama.

**Bildirim (toast):** Mürekkep zemin, açık metin, sağ altta (mobilde üstte tam genişlik). Bulunduğu kenardan
kayarak gelir.

**Koku küratörü:** Masaüstünde sol sütunda sekme listesi, sağda panel. Fareyle seçimde panel kısa bir
geçişle değişir; klavyede (ok tuşları) anında.

**Atomizasyon karşılaştırması:** Kayan seçim zeminli iki seçenekli düğme grubu (`:has()` destekleyen
tarayıcılarda; desteklemeyende aktif buton kendi zeminini alır). Altında CSS ile çizilmiş şematik görünüm:
ince ve yoğun nokta bulutu yüzeye ulaşmadan söner / büyük damlacıklar yüzeyde leke bırakır. Altında
"Şematik gösterim; ölçekli değildir." notu. Otomatik hareket yok.

**Formlar:** Etiket alanın üstünde, yardım metni altta, hata metni alanın hemen altında
(`aria-describedby`, `aria-invalid`). Placeholder etiket yerine kullanılmaz.
Odak: kenar vurgu rengi + 3 px `--c-accent-tint` halka.

**Video:** `<figure>` içinde, altında "Görsel temsilidir." notu ve durdur/oynat butonu.
`prefers-reduced-motion: reduce` durumunda otomatik oynatılmaz.

**Footer:** Gece mavisi zemin, fildişi tonlarında metin, şampanya sütun başlıkları; beş sütun (marka, ürün grupları, kurumsal, kaynaklar, iletişim). Marka sütununda küçük logo ve
"ISO 9001 · ISO 14001 · ISO 22716 sertifikalı" bağlantısı (kurumsal.html#sertifikalar); en altta dekoratif tam logo
(`.footer-wordmark`, `aria-hidden`, `#65707F`).

**Ürün videoları:** Üretici tanıtım videoları (sesli, 1-1,5 dk) otomatik oynatılmaz. Ürün sayfasında koyu
bölümde `controls` ve `preload="none"` ile; renk sürümü varsa "Siyah / Beyaz" geçişi. Ana sayfada kapak kartları
tek bir `<dialog>` oynatıcı açar (giriş 220 ms, çıkış anlık; kapanınca kaynak bırakılır). Başlıklar ürün adı
içermez, videoda gösterileni anlatır (`title`); kartta tek cümlelik tanıtım (`teaser`), ürün sayfasında ve
pencerede ayrıntılı anlatım (`summary`) ve "Video süresi 1 dk 41 sn" satırı yer alır.

**Ürün galerisi ve tanıtım görselleri:** Üreticinin dekupe ürün fotoğrafları galeride 4:3 kareye, porselen
zemine eritilerek (ton eğrisi + `multiply`) yerleştirilir; galeri küçük resimleri masaüstünde alt satıra geçer,
mobilde yatay kayar. Üzerinde yazı olan yatay tanıtım görselleri kırpılmaz: ürün sayfasında "Uygulama görselleri"
ızgarasında gösterilir, tıklayınca büyür (ortak `image-dialog`).

**Sertifikalar:** Kurumsal sayfada koyu bölümde "Sertifikalarımız": üç kart (önizleme, standart, sertifika no,
geçerlilik tarihi) ve ortak bilgiler. PDF yayınlanmaz; önizlemeye tıklayınca 1240 px görsel bir `<dialog>` içinde
ekran yüksekliğine sığarak açılır ("Büyüt" etiketi farede üzerine gelince, dokunmatikte hep görünür). Ana sayfada
"Yaklaşımımız" altında metin şeridi.

**İkonlar:** Phosphor Icons Light, tek SVG sprite (`site/images/icons.svg`). Boyut 16-20 px,
renk `currentColor`. Elle çizilmiş ikon yok, emoji yok.

## 8. Hareket

Referans: Emil Kowalski'nin tasarım mühendisliği ilkeleri. Her animasyonun bir amacı vardır (durum değişimi,
mekânsal süreklilik, geri bildirim, anlatım); "güzel görünüyor" tek başına gerekçe değildir. Sıklık belirleyicidir:
sık tekrarlanan işlem animasyonsuz, nadir ve ilk kez görülen an biraz keyif taşıyabilir.

**Üç zamanlama sınıfı**

| Sınıf | Süre | Örnekler |
| :--- | :--- | :--- |
| Arayüz geri bildirimi | 140-280 ms | Basma, hover, çekmece, menü, bildirim, sekme, galeri |
| Giriş (pazarlama / anlatım) | 640-1200 ms | Kaydırma girişleri, görsel maskesi, sayfa girişleri, bölüm etiketi çizgisi |
| Açılış (oturumda bir kez) | ~2,1 s, geçilebilir | Ana sayfa perdesi |

| Token | Değer | Kullanım |
| :--- | :--- | :--- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Giriş, geri bildirim, çoğu geçiş |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Ekranda yer değiştiren öğe: görsel maskesi, perde, sekme göstergesi, çizgi çizimi |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Çekmece |
| `ease` | | Renk ve zemin değişimleri (hover) |
| `linear` | | Yalnızca sabit hızlı sürekli hareket (hero görsel akışı) ve kaydırmaya bağlı animasyonlar |
| `--t-press` / `--t-fast` / `--t-base` / `--t-panel` | 140 / 180 / 240 / 280 ms | Arayüz |
| `--t-enter` | 640 ms | Metin girişleri |
| `--t-media` | 900 ms | Görsel maskesi |
| `--press` | `scale(0.97)` | Basılabilir her öğenin `:active` durumu |

**Açılış perdesi (`.site-intro`, yalnızca ana sayfa)**
- Zaman çizelgesi: logo harfleri 60 ms arayla bulanıklıktan netleşerek yükselir (0,1-0,9 s), şampanya renkli
  duman kıvrımı aşağıdan yükselir (0,38-1,28 s), "AIR SCENT" belirir (0,7 s); 1,25 s'de işaret yükselip söner; 1,35 s'de perde `clip-path` ile
  alttan yukarı açılır (0,75 s); hero metni 1,5 s'den itibaren 80 ms arayla girer, görsel duvarı hafif
  yakınlaşmadan oturur.
- Karar `<head>` içinde, ilk boyamadan önce verilir (`has-intro` / `no-intro`). Oynamaz: oturumda site daha önce
  açıldıysa (her sayfa `sessionStorage['meira-visited']` yazar), azaltılmış hareket tercihinde, depolama
  erişilemezse.
- Zamanlama tamamen CSS'tedir; JS hata verse de perde kendiliğinden kalkar. JS yalnızca kaydırmayı kilitler ve
  tıklama ya da tuşla geçişi sağlar (geçişte 220 ms solma, hero gecikmeleri sıfırlanır).

**Kaydırma ve sayfa girişleri**

| Öğe | Davranış |
| :--- | :--- |
| `.reveal` (genel) | `opacity` + `translateY(12px)`, 240 ms, IntersectionObserver, bir kez; aynı anda görünen kardeşler 60 ms arayla |
| Metin blokları (bölüm başlığı, küratör başlığı, tanıtım, kapanış, panel) | `translateY(20px)` + `blur(6px)` → net, 640 ms, 80 ms kademe |
| Görseller (`.reveal` içindeki `.media`) | `clip-path: inset(100% ...)` → açık, 900 ms ease-in-out; fotoğraf `scale(1.12)` → 1, 1200 ms. Bitişte maske 24 px dışarı taşar (çerçeve gölgesi kesilmez) |
| Bölüm etiketi | Çizgi `scaleX(0)` → 1 (900 ms), baklava `rotate(-45deg) scale(.4)` → 45° |
| Kartlar (ürün, blog, koku) | CSS `animation-timeline: view()`: kart görünüme girerken yükselir. JS yok; filtreyle yeniden çizilen kartlarda da çalışır; desteklemeyen tarayıcıda statik |
| Hero kaydırma derinliği | `view-timeline` ile: hero metni `translateY(-72px)` ve solar, görsel sıraları `translateY(48px)` (daha yavaş) |
| İç sayfa girişi | Başlık ve giriş 80 ms arayla bulanıklıktan yükselir; yivli panel sağdan süzülür; ürün galerisi ve makale görseli maskeyle açılır |
| Sayfalar arası | View Transitions: eski sayfa 160 ms söner, yeni sayfa 220 ms'de 10 px yükselerek belirir; başlık yerinde kalır |

**Arayüz hareketleri**

| Öğe | Davranış |
| :--- | :--- |
| Basma | Buton, sekme, çip, sayaç, ikon butonu, küçük görsel: `scale(0.97)` |
| Hover | Yalnızca `@media (hover: hover) and (pointer: fine)` içinde |
| Listeye ekleme | Buton 1,6 s "Eklendi"; butondan başlıktaki sayaca şampanya nokta uçar (620 ms; yatay ease-out, dikey ease-in-out, kavisli yol); sayaç nokta vardığında büyür. Klavyeyle eklemede uçuş yok, sayaç hemen büyür |
| Küratör | Aktif sekme çizgisi seçilen sekmeye kayar (320 ms ease-in-out); panel 220 ms bulanıklık köprüsüyle değişir. Klavyede ikisi de anında |
| Katalog | Kategori değişiminde ızgara 260 ms yükselerek yenilenir (yalnızca fareyle; aramada yok) |
| Çekmece | Giriş `translateX(100%)` → 0, 280 ms çekmece eğrisi; çıkış 200 ms |
| Mobil menü | Panel 200 ms belirir; bağlantılar 40 ms arayla 8 px yükselir |
| Bildirim | Kenardan 8 px kayarak; giriş 240 ms, çıkış 160 ms; geçiş (keyframe değil) |
| Galeri | Tıklanan noktadan 2x yakınlaşma (280 ms); küçük görsel değişiminde 200 ms opaklık + bulanıklık |

**Kurallar**
- Yalnızca `transform`, `opacity`, `clip-path` ve (kısa) `filter` animasyonu. Bulanıklık en fazla 10 px, yalnızca metin
  bloklarında ve açılışta; büyük görsellerde kullanılmaz.
- `ease-in`, `scale(0)` girişi, `transition: all`, `window.addEventListener('scroll')`, imleç takibi ve dönen yükleme
  göstergesi yok.
- Klavyeyle tetiklenen işlemler (`event.detail === 0`) animasyonsuz.
- Sürekli animasyon yalnızca hero görsel akışı: durdur düğmesi, ekran dışında durma, azaltılmış harekette kapalı.

**Azaltılmış hareket (`prefers-reduced-motion: reduce`):** Açılış perdesi, görsel maskesi, bulanıklık, kart ve
kaydırma animasyonları, parallaks, uçan nokta, sekme kayması ve sayfalar arası geçiş kapanır. Anlamaya yardım eden
kısa opaklık geçişleri (180-240 ms) kalır. Hero akışı ve videolar oynamaz.

## 9. Erişilebilirlik

- Her sayfada "İçeriğe geç" bağlantısı.
- Odak halkası: `outline: 2px solid var(--c-accent); outline-offset: 3px` (yalnızca `:focus-visible`);
  footer'da fildişi.
- Tüm etkileşimli öğeler klavye ile kullanılabilir; sekmeler ok tuşlarıyla gezilir.
- Otomatik hareket eden içerik (hero akışı, videolar) durdurulabilir.
- Anlamlı görsellerde açıklayıcı alt metin; süs görsellerinde `alt=""`, süs katmanlarında `aria-hidden`.
- Dokunma hedefi en az 44 x 44 px.

## 10. Z-index ölçeği

| Token | Değer | Katman |
| :--- | :--- | :--- |
| `--z-header` | 30 | Yapışkan başlık |
| `--z-menu` | 40 | Mobil menü |
| `--z-overlay` | 50 | Modal ve çekmece |
| `--z-toast` | 60 | Bildirim, sepete uçan nokta |
| `--z-intro` | 65 | Açılış perdesi |
| `--z-grain` | 70 | Doku katmanı (tıklanamaz) |

Hero kendi içinde `isolation: isolate` ile ayrı bir katman bağlamı kurar (duvar -2, örtü -1, içerik 0).
