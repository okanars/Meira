# Lobi Tasarım Sistemi

JVCK ürünlerinin Türkiye distribütörü için B2B tanıtım ve teklif toplama sitesinin görsel dili.
Bu belge `site/css/style.css` dosyasının kaynağıdır. CSS'teki her değişken burada tanımlanır;
yeni bir bileşen eklemeden önce buradaki kurallara bakın.

## 1. Tasarım okuması

> B2B ürün kataloğu ve teklif sitesi; otel, ofis ve mağaza satın alma ekipleri için.
> Dil: sakin, editoryal, otel lobisi hissi. Doğal CSS, karakterli serif başlık, temiz sans gövde,
> düşük yoğunlukta hareket.

| Ayar | Değer | Gerekçe |
| :--- | :--- | :--- |
| Tasarım çeşitliliği | 6 / 10 | Editoryal ritim, asimetrik bölümler; katalog ızgarası taranabilir kalır. |
| Hareket yoğunluğu | 3 / 10 | Yalnızca ince scroll girişleri ve hover geçişleri. |
| Görsel yoğunluk | 3 / 10 (katalog: 5) | Bol boşluk; katalog ve teknik tablolarda bilgi yoğunluğu artar. |

**Tema:** Yalnızca açık tema. Ürün fotoğrafları açık iç mekânlarda çekilmiş; koyu temada
fotoğraf kenarları kopuk duruyor. Sayfa içinde ters renkli bölüm yok (tema kilidi).

## 2. Renk

Sıcak taş nötrleri ve tek vurgu rengi: koyu çam yeşili. Altın, pirinç, bordo, kil tonları kullanılmaz.

| Değişken | Değer | Kullanım |
| :--- | :--- | :--- |
| `--c-bg` | `#EEEBE5` | Sayfa zemini (traverten) |
| `--c-bg-deep` | `#E4E0D8` | Aynı paletin bir ton koyusu; ayrılması gereken bant bölümler, footer |
| `--c-surface` | `#F7F6F2` | Paneller, form alanları, modal, çekmece |
| `--c-ink` | `#22211E` | Başlık ve gövde metni |
| `--c-ink-2` | `#55524B` | İkincil metin, açıklamalar |
| `--c-ink-3` | `#66625A` | Etiketler, küçük meta bilgi |
| `--c-line` | `rgba(34,33,30,.12)` | Ayırıcı çizgiler |
| `--c-line-strong` | `#8C877D` | Form alanı kenarı, ikincil buton kenarı (3:1 UI kontrastı) |
| `--c-accent` | `#2F4B40` | Tek vurgu: birincil buton, odak halkası, aktif durum, bağlantı vurgusu |
| `--c-accent-hover` | `#243A31` | Birincil buton hover |
| `--c-accent-tint` | `#DCE3DC` | Seçili satır, bilgi bandı zemini |
| `--c-on-accent` | `#F5F3EE` | Vurgu zemini üzerindeki metin |
| `--c-error` | `#963A2C` | Form hata metni ve kenarı |

**Kontrast (WCAG 2.1):**

| Ön plan | `--c-bg` | `--c-bg-deep` | `--c-surface` |
| :--- | :--- | :--- | :--- |
| `--c-ink` | 13.5:1 | 12.2:1 | 14.9:1 |
| `--c-ink-2` | 6.6:1 | 5.9:1 | 7.2:1 |
| `--c-ink-3` | 5.1:1 | 4.6:1 | 5.6:1 |
| `--c-accent` | 8.0:1 | 7.3:1 | 8.8:1 |
| `--c-error` | 6.0:1 | 5.4:1 | 6.6:1 |

`--c-on-accent` / `--c-accent`: 8.6:1. Tüm metin çiftleri AA'yı geçer.

**Kurallar**
- Vurgu rengi sayfanın her yerinde aynıdır. İkinci bir vurgu rengi eklenmez.
- Saf siyah (`#000`) ve saf beyaz (`#fff`) kullanılmaz.
- Gölgeler mürekkep tonundan türetilir, siyahtan değil.
- Zemine çok hafif bir doku (grain) eklenir: sabit, `pointer-events: none` bir katmanda, opaklık 0.035.

## 3. Tipografi

| Rol | Font | Ağırlık | Not |
| :--- | :--- | :--- | :--- |
| Başlık (display, h1-h3) | Cormorant Garamond | 500, 600, italik 500 | Otel tabelası ve basılı katalog karakteri |
| Gövde ve arayüz | Geist | 400, 500, 600 | Temiz, nötr, iyi Türkçe desteği |
| Sayılar | Geist, `tabular-nums` | | Teknik değerler hizalı durur |

Fontlar `site/fonts/` altında yerel barındırılır (latin + latin-ext; Türkçe karakterler dahil).
Harici font isteği yoktur.

**Ölçek (akışkan)**

| Token | Değer | Kullanım |
| :--- | :--- | :--- |
| `--fs-display` | `clamp(2.75rem, 1.9rem + 3.6vw, 5rem)` | Ana sayfa hero başlığı |
| `--fs-h1` | `clamp(2.5rem, 1.9rem + 2.6vw, 4.25rem)` | Sayfa başlıkları |
| `--fs-h2` | `clamp(2rem, 1.6rem + 1.8vw, 3.1rem)` | Bölüm başlıkları |
| `--fs-h3` | `clamp(1.45rem, 1.3rem + 0.6vw, 1.8rem)` | Kart, ürün, liste başlıkları |
| `--fs-lead` | `clamp(1.08rem, 1rem + 0.35vw, 1.25rem)` | Giriş paragrafı |
| `--fs-body` | `1rem` (16 px) | Gövde |
| `--fs-small` | `0.875rem` | Meta, açıklama |
| `--fs-label` | `0.75rem` | Etiket, sayaç |

**Kurallar**
- Başlıklarda satır yüksekliği 1.05-1.15; gövdede 1.65.
- Paragraf genişliği en fazla `62ch`.
- Başlıklarda vurgu için aynı fontun italiği kullanılır, başka font karıştırılmaz.
- İtalik başlıkta alt uzantılı harf (g, ğ, y, p, j, ş) varsa satır yüksekliği en az 1.1.
- Büyük harfli küçük etiket (eyebrow) en fazla her üç bölümde bir kullanılır.
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
- Tam ekran bölümlerde `100vh` yerine `100dvh`.

## 5. Köşe ve kenar

Tek kural: **mimari, keskin köşeler.**

| Token | Değer | Kullanım |
| :--- | :--- | :--- |
| `--r` | `2px` | Butonlar, form alanları, görseller, paneller, modal, çekmece |
| `--r-round` | `999px` | Yalnızca teklif listesi sayaç rozeti (sayı dairesi) |

Kartlar kenarlıkla değil, boşluk ve zemin tonuyla ayrılır. Kenarlık yalnızca form alanlarında,
ikincil butonda ve ayırıcı çizgilerde kullanılır.

## 6. Gölge ve derinlik

| Token | Değer | Kullanım |
| :--- | :--- | :--- |
| `--shadow-float` | `0 30px 80px -30px rgba(34,33,30,.28)` | Modal, çekmece |
| `--shadow-toast` | `0 12px 32px -12px rgba(34,33,30,.35)` | Bildirim |

Kart, buton ve görsellerde gölge yoktur. Derinlik, bindirme (negatif margin) ve zemin tonu farkıyla kurulur.
Bulanıklık (`backdrop-filter`) yalnızca sabit başlıkta kullanılır.

## 7. Bileşenler

**Başlık (header):** 72 px, yapışkan. Sayfanın üstünde şeffaf; kaydırınca `--c-bg` %88 + bulanıklık
ve alt çizgi. 1100 px altında menü butonu. Aktif sayfa, bağlantının altında 1 px vurgu çizgisiyle gösterilir.

**Mobil menü:** Tam ekran panel, animasyonsuz açılır. Escape ve bağlantı tıklaması kapatır.
`aria-expanded` güncellenir, gövde kaydırması kilitlenir.

**Butonlar** (yükseklik 48 px, büyük boy 56 px, metin tek satır):
- `.btn--primary`: vurgu zemini. Hover: `--c-accent-hover`. Basınca `translateY(1px)`.
- `.btn--quiet`: şeffaf, `--c-line-strong` kenar. Hover: mürekkep %4 zemin.
- `.link-arrow`: üçüncül metin bağlantısı, ok ikonu hover'da 3 px kayar.
- Aynı niyet için tek etiket: teklif = "Teklif iste", listeye ekleme = "Listeye ekle",
  katalog = "Ürünleri incele".

**Ürün kartı:** Kenarlıksız. Üstte 4:3 görsel plakası, altında model kodu, serif başlık, iki satırlık
kısa açıklama, kapsama ve kapasite (tabular), en altta hizalı eylemler (İncele, Listeye ekle).

**Filtre ve arama:** Metin sekmeleri; aktif sekme mürekkep rengi ve alt vurgu çizgisi. Animasyon yok.
Arama alanının görünür etiketi vardır.

**Ürün modalı:** İki sütun (galeri, içerik). Teknik değerler satır çizgili tablo yerine etiket-değer
hücrelerinden oluşan iki sütunlu ızgarada. Escape, arka plan tıklaması ve kapat butonu kapatır;
odak modalın içinde kalır, kapanınca tetikleyen öğeye döner.

**Teklif listesi çekmecesi:** Sağdan 440 px panel, animasyonsuz. Ürün satırı: küçük görsel, model,
başlık, adet ayarı, kaldır. Boş durumda kataloğa yönlendiren açıklama.

**Bildirim (toast):** Mürekkep zemin, açık metin, sağ altta (mobilde altta tam genişlik).
Yalnızca opaklık geçişi, 160 ms.

**Formlar:** Etiket alanın üstünde, yardım metni altta, hata metni alanın hemen altında
(`aria-describedby`, `aria-invalid`). Placeholder etiket yerine kullanılmaz.
Odak: kenar vurgu rengi + 3 px `--c-accent-tint` halka.

**Video:** `<figure>` içinde, altında "Görsel temsilidir." notu ve durdur/oynat butonu.
`prefers-reduced-motion: reduce` durumunda otomatik oynatılmaz.

**İkonlar:** Phosphor Icons Light, tek SVG sprite (`site/images/icons.svg`). Boyut 18-20 px,
renk `currentColor`. Elle çizilmiş ikon yok, emoji yok.

## 8. Hareket

| Kural | Değer |
| :--- | :--- |
| Süre | En fazla 280 ms |
| Eğri | `--ease-out: cubic-bezier(0.2, 0.8, 0.2, 1)`. `ease-in` kullanılmaz. |
| Özellikler | Yalnızca `transform` ve `opacity` |
| Scroll girişi | `opacity 0 → 1`, `translateY(12px) → 0`, 280 ms, IntersectionObserver, bir kez |
| Hover | Renk ve zemin 180 ms; ok ikonu `translateX(3px)`; görsel `scale(1.02)` 280 ms |
| Basma | `translateY(1px)` |
| Animasyonsuz alanlar | Filtre, arama, menü, teklif listesi çekmecesi, küratör ve simülatör geçişleri |
| Yasak | `scale(0)` girişi, sonsuz döngü animasyonu, `window.addEventListener('scroll')` |
| Azaltılmış hareket | `prefers-reduced-motion: reduce` ile tüm geçişler ve scroll girişleri kapanır, videolar durur |

## 9. Erişilebilirlik

- Her sayfada "İçeriğe geç" bağlantısı.
- Odak halkası: `outline: 2px solid var(--c-accent); outline-offset: 3px` (yalnızca `:focus-visible`).
- Tüm etkileşimli öğeler klavye ile kullanılabilir; sekmeler ok tuşlarıyla gezilir.
- Anlamlı görsellerde açıklayıcı alt metin; süs görsellerinde `alt=""`.
- Dokunma hedefi en az 44 x 44 px.

## 10. Z-index ölçeği

| Token | Değer | Katman |
| :--- | :--- | :--- |
| `--z-header` | 30 | Yapışkan başlık |
| `--z-menu` | 40 | Mobil menü |
| `--z-overlay` | 50 | Modal ve çekmece |
| `--z-toast` | 60 | Bildirim |
| `--z-grain` | 70 | Doku katmanı (tıklanamaz) |
