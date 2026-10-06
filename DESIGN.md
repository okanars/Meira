# Lobi Tasarım Sistemi

Meira (JVCK ürünlerinin Türkiye distribütörü) B2B tanıtım ve teklif sitesinin görsel dili.
Bu belge `site/css/style.css` dosyasının kaynağıdır. CSS'teki her değişken burada tanımlanır;
yeni bir bileşen eklemeden önce buradaki kurallara bakın.

## 1. Tasarım okuması

> B2B ürün kataloğu ve teklif sitesi; otel, ofis ve mağaza satın alma ekipleri için.
> Dil: lüks mekân kokulandırma. Koyu, sinematik bir girişten sonra sakin, editoryal bir katalog.
> Parfüm evlerinin tipografisi (Didone başlık, geometrik sans), tek vurgu rengi, ölçülü hareket.

| Ayar | Değer | Gerekçe |
| :--- | :--- | :--- |
| Tasarım çeşitliliği | 6 / 10 | Editoryal ritim, asimetrik bölümler; katalog ızgarası taranabilir kalır. |
| Hareket yoğunluğu | 5 / 10 | Durum değişimi, mekânsal süreklilik ve geri bildirim için hareket; sık tekrarlanan işlemler animasyonsuz. |
| Görsel yoğunluk | 3 / 10 (katalog: 5) | Bol boşluk; katalog ve teknik tablolarda bilgi yoğunluğu artar. |

**Tema:** Açık içerik teması, koyu çerçeve. Ana sayfa girişi (hero) ve footer noir zeminde; aradaki tüm
içerik porselen fildişi zeminde. Bu tek, bilinçli bir renk bloğu kompozisyonudur (sayfa koyu açılır,
açık akar, koyu kapanır). İçerik bölümleri arasında ters renkli bölüm yoktur. Koyu tema sunulmaz:
ürün fotoğrafları açık iç mekân sahneleri.

### Tur 2 değişikliği ve nedeni

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

Porselen fildişi zemin, noir çerçeve, tek vurgu: yosun yeşili. Altın, pirinç, bordo, kil tonları kullanılmaz.

| Değişken | Değer | Kullanım |
| :--- | :--- | :--- |
| `--c-bg` | `#F3F0EA` | Sayfa zemini (porselen fildişi) |
| `--c-bg-deep` | `#E8E3DA` | Bir ton koyusu; ayrılması gereken bant bölümler, yivli doku zemini |
| `--c-surface` | `#FAF8F4` | Paneller, form alanları, modal, çekmece |
| `--c-ink` | `#171615` | Başlık ve gövde metni |
| `--c-ink-2` | `#4E4A44` | İkincil metin |
| `--c-ink-3` | `#69645C` | Etiketler, küçük meta bilgi |
| `--c-line` | `rgba(23,22,21,.12)` | Ayırıcı çizgiler |
| `--c-line-strong` | `#807A70` | Form alanı kenarı, ikincil buton kenarı (3:1 UI kontrastı) |
| `--c-accent` | `#2C463B` | Tek vurgu: birincil buton, odak halkası, aktif durum, eyebrow çizgisi |
| `--c-accent-hover` | `#213529` | Birincil buton hover |
| `--c-accent-tint` | `#DDE4DD` | Bilgi bandı zemini, odak halkası dış ışığı |
| `--c-on-accent` | `#F5F2EC` | Vurgu zemini üzerindeki metin |
| `--c-error` | `#963A2C` | Form hata metni ve kenarı |
| `--c-noir` | `#141312` | Hero ve footer zemini |
| `--c-noir-2` | `#1E1C1A` | Noir üzerinde görsel yer tutucu |
| `--c-ivory` | `#F2EEE6` | Noir üzerinde başlık, birincil açık buton zemini |
| `--c-ivory-2` | `#C9C3B8` | Noir üzerinde gövde metni |
| `--c-ivory-3` | `#A39D92` | Noir üzerinde etiket ve meta |
| `--c-line-dark` | `rgba(242,238,230,.16)` | Noir üzerinde ayırıcı ve çip kenarı |

**Kontrast (WCAG 2.1, hesaplanmış):**

| Ön plan | `--c-bg` | `--c-bg-deep` | `--c-surface` |
| :--- | :--- | :--- | :--- |
| `--c-ink` | 15.9:1 | 14.1:1 | 17.0:1 |
| `--c-ink-2` | 7.7:1 | 6.9:1 | 8.3:1 |
| `--c-ink-3` | 5.2:1 | 4.6:1 | 5.5:1 |
| `--c-accent` | 9.0:1 | 8.0:1 | 9.7:1 |
| `--c-error` | 6.3:1 | 5.6:1 | 6.7:1 |
| `--c-line-strong` (UI) | 3.7:1 | 3.3:1 | 4.0:1 |

| Noir üzerinde | Oran |
| :--- | :--- |
| `--c-ivory` | 16.0:1 |
| `--c-ivory-2` | 10.6:1 |
| `--c-ivory-3` | 6.9:1 |
| Footer dekoratif marka yazısı `#6A645D` | 3.2:1 (yalnızca büyük metin; ekran okuyucudan gizli) |

`--c-on-accent` / `--c-accent`: 9.2:1. Açık buton (noir / ivory): 16.0:1.

**Hero görsel üzerindeki metin:** örtü, en kötü durumda (beyaz görsel) bile metin bölgesinde en az %80 noir
yoğunluk verir: `--c-ivory-2` için 5.7:1 ve üzeri, `--c-ivory` için 8.7:1 ve üzeri.

**Kurallar**
- Vurgu rengi her yerde aynıdır. İkinci bir vurgu rengi eklenmez. Noir üzerinde vurgu yerine fildişi kullanılır.
- Saf siyah (`#000`) ve saf beyaz (`#fff`) kullanılmaz.
- Gölgeler mürekkep tonundan türetilir, siyahtan değil.
- Zemine çok hafif bir doku (grain) eklenir: sabit, `pointer-events: none` bir katmanda, opaklık 0.035.

## 3. Tipografi

Tur 3'te okunabilirlik için yeniden düzenlendi: Bodoni Moda'nın ince çizgileri küçük boyutta, Jost'un küçük
x-yüksekliği uzun metinde okumayı zorlaştırıyordu. Didone yalnızca büyük boyutta kaldı; geri kalan her şey
Manrope'a geçti.

| Rol | Font | Ağırlık | Not |
| :--- | :--- | :--- | :--- |
| Display, h1, h2, büyük rakamlar, footer marka yazısı | Bodoni Moda | 500, italik | Değişken; `font-optical-sizing: auto`. 28 px altında kullanılmaz |
| Gövde, arayüz, h3 ve altı, kart başlıkları, etiketler | Manrope | 400 gövde, 600 başlık/etiket | Büyük x-yüksekliği, ekranda yüksek okunabilirlik, tam Türkçe desteği |
| Teknik sayılar (tablo, kart) | Manrope, `tabular-nums` | | Hizalı durur |

Fontlar `site/fonts/` altında yerel barındırılır (değişken woff2, latin + latin-ext). Harici font isteği yoktur.

**Ölçek (akışkan)**

| Token | Değer | Kullanım |
| :--- | :--- | :--- |
| `--fs-display` | `clamp(2.6rem, 1.7rem + 4.2vw, 5.6rem)` | Ana sayfa hero başlığı |
| `--fs-h1` | `clamp(2.3rem, 1.7rem + 2.5vw, 4rem)` | Sayfa başlıkları |
| `--fs-h2` | `clamp(1.85rem, 1.5rem + 1.5vw, 2.8rem)` | Bölüm başlıkları |
| `--fs-h3` | `clamp(1.125rem, 1.05rem + 0.35vw, 1.3rem)` | Kart, ürün, liste başlıkları (Manrope 600) |
| `--fs-lead` | `clamp(1.08rem, 1rem + 0.35vw, 1.25rem)` | Giriş paragrafı |
| `--fs-body` | `1.0625rem` (17 px) | Gövde, satır yüksekliği 1.7 |
| `--fs-small` | `0.9375rem` (15 px) | Meta, açıklama |
| `--fs-label` | `0.8125rem` (13 px) | Etiket, sayaç; altına inilmez |
| `--tracking-caps` | `0.1em` | Büyük harf etiket, buton ve navigasyon aralığı |

**Kurallar**
- Başlıklarda harf aralığı negatif (`-0.015em`, display `-0.025em`); satır yüksekliği 1.04-1.3.
- Paragraf genişliği en fazla `62ch`; makale gövdesi `68ch`.
- Vurgu için aynı fontun italiği kullanılır, başka font karıştırılmaz.
- Butonlar, navigasyon, çipler ve etiketler: Manrope 600, büyük harf, `--tracking-caps`. Üçüncül metin bağlantıları
  (`.link-arrow`) cümle düzeninde kalır.
- Marka adı Bodoni Moda, büyük harf, `0.22em` aralık ("MEIRA"). Marka bağlantısı `lang="en"` taşır; aksi halde
  Türkçe büyük harf kuralı "i" harfini "İ" yapar. Alt yazı ("Türkiye") `lang="tr"`.
- Büyük harfli üst etiket (eyebrow), başında 36 px vurgu çizgisiyle, en fazla her üç bölümde bir.
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

**Başlık (header):** 72 px, yapışkan. Açık sayfalarda şeffaf başlar; kaydırınca `--c-bg` %88 + bulanıklık
ve alt çizgi. Ana sayfada hero'nun üstündeyken (`.on-dark`, IntersectionObserver) metin fildişi, kaydırınca
noir %62 + bulanıklık. Navigasyon büyük harf aralıklı; aktif sayfa 1 px vurgu çizgisi, fareyle üzerine
gelince çizgi soldan çizilir. 1100 px altında menü butonu.

**Ana sayfa girişi (hero):** `min-height: 100svh`, noir zemin; başlığın altına girer (negatif margin).
- Arkada görsel duvarı: üç sıra 4:5 karo (cihazlar, mekânlar, ev ve çubuklu ürünler), zıt yönlerde
  110-140 s'de bir tur atan sabit hızlı akış (`linear`; sürekli hareket için doğru eğri). İçerik iki kez
  yazılır, iz yarısı kadar kayınca kesintisiz başa döner. Görseller `images/hero/` altında 360 x 450 küçük
  kopyalardır (toplam ~1 MB). `site.js` doldurur; JS yoksa noir zemin görünür.
- Görsel akışı için **durdur/oynat düğmesi** (WCAG 2.2.2). Ekran dışındayken otomatik durur.
  Azaltılmış harekette akış hiç başlamaz ve düğme gizlenir.
- Örtü: soldan sağa %94 → %50, alttan %92 → 0. Mobilde yukarıdan aşağı %80 → %95.
- İçerik: eyebrow, display başlık, giriş paragrafı, ürün grubu çipleri (`urunler.html?cat=` bağlantıları),
  iki buton (açık ve hayalet). Altta katalog verileri şeridi (ürün sayısı `data-product-count`'tan).

**Butonlar** (yükseklik 50 px, büyük boy 56 px, metin tek satır, büyük harf aralıklı):
- `.btn--primary`: vurgu zemini. Hover: `--c-accent-hover`.
- `.btn--quiet`: şeffaf, `--c-line-strong` kenar. Hover: mürekkep %4 zemin.
- `.btn--light` (noir üzerinde): fildişi zemin, noir metin. `.btn--ghost-light`: fildişi %42 kenar.
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
`.prose--article` (68ch, h2 Bodoni, h3 Manrope, ince çizgili liste işaretleri, yatay kaydırılabilir ve klavyeyle
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

**Footer:** Noir zemin, fildişi tonlarında metin; beş sütun (marka, ürün grupları, kurumsal, kaynaklar, iletişim). En altta büyük Bodoni marka yazısı
(`.footer-wordmark`, `aria-hidden`, adı `site-config.js`'ten gelir).

**İkonlar:** Phosphor Icons Light, tek SVG sprite (`site/images/icons.svg`). Boyut 16-20 px,
renk `currentColor`. Elle çizilmiş ikon yok, emoji yok.

## 8. Hareket

Referans: Emil Kowalski'nin tasarım mühendisliği ilkeleri. Her animasyonun bir amacı vardır (durum değişimi,
mekânsal süreklilik, geri bildirim); "güzel görünüyor" tek başına gerekçe değildir.

| Token | Değer | Kullanım |
| :--- | :--- | :--- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Giriş, geri bildirim, çoğu geçiş |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Ekranda yer değiştiren öğe (seçim zemini, başlık geçişi) |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Çekmece, mobil alt sayfa |
| `ease` | | Renk ve zemin değişimleri (hover) |
| `linear` | | Yalnızca sabit hızlı sürekli hareket (hero görsel akışı) |
| `--t-press` | 140 ms | Basma geri bildirimi |
| `--t-fast` | 180 ms | Renk, hover, çıkışlar |
| `--t-base` | 240 ms | Giriş, opaklık |
| `--t-panel` | 280 ms | Modal, çekmece, hero girişi |
| `--press` | `scale(0.97)` | Basılabilir her öğenin `:active` durumu |

| Öğe | Davranış |
| :--- | :--- |
| Basma | Buton, sekme, çip, sayaç, ikon butonu, küçük görsel: `:active { transform: scale(0.97) }` |
| Hover | Yalnızca `@media (hover: hover) and (pointer: fine)` içinde. Görsel `scale(1.02)`, ok `translateX(3px)`, nav çizgisi soldan |
| Scroll girişi | `opacity 0 → 1`, `translateY(12px) → 0`, 240 ms, IntersectionObserver, bir kez. Aynı anda görünen kardeşler 60 ms arayla (en fazla 4) |
| Hero yüklemesi | Metin öğeleri 60 ms arayla 8 px yukarı kayarak (280 ms), görsel duvarı belirerek |
| Çekmece | Giriş `translateX(100%)` → 0, 280 ms çekmece eğrisi. Çıkış 200 ms |
| Mobil menü | Panel 200 ms belirir; bağlantılar 40 ms arayla 8 px yukarı kayar. Kapanış anında. Menü ikonu çarpıya döner |
| Bildirim | Kenardan 8 px kayarak; giriş 240 ms, çıkış 160 ms; keyframe değil geçiş (art arda eklemede kesintisiz) |
| Küratör, küçük görsel | Fareyle seçimde 200-220 ms opaklık + 3-4 px bulanıklık köprüsü (WAAPI). Klavyeyle tetiklenen tıklamada (`event.detail === 0`) animasyon yok |
| Sayfalar arası | View Transitions: eski sayfa 160 ms söner, yeni sayfa 220 ms belirir; başlık yerinde kalır |
| Animasyonsuz alanlar | Filtre, arama, hesaplayıcı sonuçları, klavyeyle sekme gezinmesi, çekmecedeki adet değişimi |
| Yasak | `ease-in`, `scale(0)` girişi, `transition: all`, 300 ms ve üzeri arayüz süresi, `window.addEventListener('scroll')`, imleç takibi, dönen yükleme göstergesi |
| İstisna | Hero görsel akışı tek sürekli animasyondur; durdur düğmesi, ekran dışında durma ve azaltılmış harekette kapanma şartıyla |

**Azaltılmış hareket (`prefers-reduced-motion: reduce`):** Konum, ölçek, kırpma ve bulanıklık kapanır
(`--press: none`, modal/çekmece/bildirim `transform: none`). Anlamaya yardım eden kısa opaklık geçişleri kalır.
Hero akışı ve videolar oynamaz; sayfalar arası geçiş kapanır.

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
| `--z-toast` | 60 | Bildirim |
| `--z-grain` | 70 | Doku katmanı (tıklanamaz) |

Hero kendi içinde `isolation: isolate` ile ayrı bir katman bağlamı kurar (duvar -2, örtü -1, içerik 0).
