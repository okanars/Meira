// Blog yazıları. Gövde HTML'i build.mjs tarafından blog-<slug>.html sayfalarına yazılır.
// Kurallar: şirket hakkında yeni iddia yok; ürün bilgisi yalnızca products.js'ten; dış bulgular kaynaklı.
// Uzun tire kullanılmaz. Tarih: yayın tarihi (ISO).

export const POSTS = [
  {
    slug: 'koku-pazarlamasi-nedir',
    title: 'Koku pazarlaması nedir? Araştırmalar mekân kokusu hakkında ne söylüyor',
    navTitle: 'Koku pazarlaması nedir?',
    description: 'Ortam kokusunun müşteri algısına etkisini inceleyen üç temel çalışma ve bu bulguların otel, mağaza ve ofislerde nasıl doğru kullanılacağı.',
    date: '2026-10-06',
    minutes: 6,
    image: 'images/products/ck631-g1.jpg',
    imageAlt: 'Otel lobisinde duvara monte edilmiş koku difüzörü',
    tags: ['Koku pazarlaması', 'Araştırma'],
    related: ['ck631', 'ck686', 'ck620'],
    body: `
<p class="lead">Koku pazarlaması (ortam kokulandırma), bir mekâna bilinçli olarak seçilmiş bir koku vererek ziyaretçinin o mekânı nasıl algıladığını etkilemeyi amaçlar. Otel lobileri, mağazalar, showroomlar ve ofisler bu yöntemi en sık kullanan alanlardır. Peki bilimsel araştırmalar bu etki hakkında ne söylüyor ve bulgular nasıl doğru okunmalı?</p>

<h2>Üç temel çalışma</h2>

<h3>1. Mağaza değerlendirmesi ve zaman algısı (1996)</h3>
<p>Spangenberg, Crowley ve Henderson'ın <em>Journal of Marketing</em>'de yayımlanan çalışması, ortam kokusunun perakende ortamındaki etkisini inceleyen ilk kapsamlı deneylerden biridir. Hoş bulunan bir ortam kokusu bulunan koşulda katılımcılar mağazayı ve mağazadaki ürünleri daha olumlu değerlendirdi, mağazayı tekrar ziyaret etme niyetleri arttı. Çalışmanın sık alıntılanan bir bulgusu da zaman algısıyla ilgilidir: kokulu ortamda katılımcılar mağazada geçirdikleri süreyi gerçekte olduğundan daha kısa algıladı.</p>

<h3>2. Marka hatırlama (2003)</h3>
<p>Morrin ve Ratneshwar'ın <em>Journal of Marketing Research</em>'teki iki deneyli çalışmasında ortam kokusu, hem tanınan hem de tanınmayan markaların hatırlanmasını ve tanınmasını artırdı. Dikkat çekici iki ayrıntı var: etki, kokunun ürün kategorisiyle uyumlu olup olmamasından bağımsız çıktı ve katılımcıların kendi bildirdikleri ruh hali değişmedi. Araştırmacılara göre en olası açıklama dikkat: kokulu ortamda katılımcılar ürünleri daha uzun süre inceledi.</p>

<h3>3. Otuz yılın meta-analizi (2017)</h3>
<p>Roschk, Loureiro ve Breitsohl, <em>Journal of Retailing</em>'de müzik, koku ve rengin etkilerini inceleyen 66 çalışmayı (135 etki, 15.621 katılımcı) bir araya getirdi. Koku bulunan ortamlarda haz, memnuniyet ve davranışsal niyet puanları kokusuz ortamlara göre daha yüksekti. Ancak etkinin büyüklüğü <strong>küçük ile orta arasında</strong>ydı. Veriler, kokunun etkisinin hizmet ortamlarında (otel, restoran gibi) perakendeye göre daha güçlü olma eğilimi gösterdiğine de işaret ediyor.</p>

<h2>Bulguları doğru okumak</h2>
<p>Bu çalışmalar birlikte değerlendirildiğinde tablo nettir: iyi seçilmiş bir ortam kokusu, mekânın algısını ölçülebilir biçimde iyileştirebilir. Ama üç noktayı akılda tutmak gerekir:</p>
<ul>
  <li><strong>Etki büyük değil, tutarlıdır.</strong> Meta-analiz küçük ile orta arası bir etki buluyor. "Satışları yüzde şu kadar artırır" türünden kesin vaatlere şüpheyle yaklaşın; böyle bir sonuç mekâna, ürüne ve ölçüm yöntemine göre çok değişir.</li>
  <li><strong>Koku hoş bulunmalı.</strong> Olumlu sonuçlar, katılımcıların hoş bulduğu kokularla elde edildi. Rahatsız eden ya da fazla yoğun bir koku tersi etki yaratabilir.</li>
  <li><strong>Yoğunluk belirleyicidir.</strong> İnsanlar sürekli maruz kaldıkları kokuya hızla alışır. Doğru yoğunluk ve zamanlama, kokunun fark edilir ama rahatsız edici olmayan seviyede kalmasını sağlar. Ayrıntılar için <a href="blog-koku-yorgunlugu-ve-dogru-yogunluk.html">koku yorgunluğu yazımıza</a> bakabilirsiniz.</li>
</ul>

<h2>Uygulamada dört adım</h2>
<ol>
  <li><strong>Mekânın kimliğiyle başlayın.</strong> Lüks bir otel lobisi, bir spor salonu ve bir hukuk bürosu aynı kokuyu taşımamalı. Kokunun ailesi (ferah, çiçeksi, odunsu) mekânın tonuna uymalı.</li>
  <li><strong>Hacme göre cihaz seçin.</strong> Cihazın kapsama değeri mekânın hava hacmini karşılamalı. <a href="cozumler.html#hesaplayici">Hacim hesaplayıcı</a> ile başlayabilirsiniz.</li>
  <li><strong>Tutarlı olun.</strong> Birden fazla şubesi olan işletmelerde aynı kokunun her yerde aynı yoğunlukta kullanılması, kokunun markayla ilişkilendirilmesini kolaylaştırır.</li>
  <li><strong>Geri bildirim toplayın.</strong> İlk haftalarda çalışanlardan ve misafirlerden yoğunluk hakkında görüş alın; cihazın püskürtme ve bekleme sürelerini buna göre ayarlayın.</li>
</ol>

<p>Mekânınıza uygun koku ailesini seçmek için <a href="esanslar.html">koku koleksiyonuna</a>, cihaz seçimi için <a href="urunler.html">ürün kataloğuna</a> göz atabilirsiniz.</p>
`,
    sources: [
      { label: 'Spangenberg, E. R., Crowley, A. E. ve Henderson, P. W. (1996). Improving the store environment: Do olfactory cues affect evaluations and behaviors? Journal of Marketing, 60(2), 67-80.' },
      { label: 'Morrin, M. ve Ratneshwar, S. (2003). Does it make sense to use scents to enhance brand memory? Journal of Marketing Research, 40(1), 10-25.', url: 'https://www.researchwithrutgers.com/en/publications/does-it-make-sense-to-use-scents-to-enhance-brand-memory/' },
      { label: 'Roschk, H., Loureiro, S. M. C. ve Breitsohl, J. (2017). Calibrating 30 years of experimental research: A meta-analysis of the atmospheric effects of music, scent, and color. Journal of Retailing, 93(2), 228-240.', url: 'https://doi.org/10.1016/j.jretai.2016.10.001' }
    ]
  },

  {
    slug: 'mekan-hacmine-gore-difuzor-secimi',
    title: 'Mekân hacmine göre koku difüzörü seçimi: m³ hesabı adım adım',
    navTitle: 'Hacme göre difüzör seçimi',
    description: 'Koku difüzörünün kapsama değeri neden m² değil m³ ile verilir, hacim nasıl hesaplanır ve hangi durumlarda birden fazla cihaz gerekir.',
    date: '2026-10-06',
    minutes: 5,
    image: 'images/products/ck686-g1.jpg',
    imageAlt: 'Geniş bir lobide zemine yerleştirilmiş kolon tipi difüzör',
    tags: ['Rehber', 'Cihaz seçimi'],
    related: ['ck628', 'ck688', 'ck686', 'ck621'],
    body: `
<p class="lead">Bir koku difüzörü seçerken ilk bakılması gereken değer kapsama alanıdır. Üreticiler bu değeri çoğunlukla metreküp (m³) olarak verir, çünkü koku bir zemini değil, bir hava hacmini doldurur. Aynı taban alanına sahip iki mekândan tavanı yüksek olan, daha güçlü bir cihaz gerektirir.</p>

<h2>Hacim nasıl hesaplanır?</h2>
<p>Hesap basittir: <strong>taban alanı (m²) x tavan yüksekliği (m) = hava hacmi (m³)</strong>.</p>
<div class="table-wrap">
<table>
  <caption>Örnek hesaplar</caption>
  <thead><tr><th scope="col">Mekân</th><th scope="col">Taban alanı</th><th scope="col">Tavan</th><th scope="col">Hacim</th></tr></thead>
  <tbody>
    <tr><td>Toplantı odası</td><td>40 m²</td><td>2,8 m</td><td>112 m³</td></tr>
    <tr><td>Butik mağaza</td><td>150 m²</td><td>3,2 m</td><td>480 m³</td></tr>
    <tr><td>Otel lobisi</td><td>400 m²</td><td>6 m</td><td>2.400 m³</td></tr>
    <tr><td>AVM atriyumu</td><td>2.000 m²</td><td>4 m</td><td>8.000 m³</td></tr>
  </tbody>
</table>
</div>
<p>Bu hesabı <a href="cozumler.html#hesaplayici">hacim hesaplayıcı</a> sizin için yapar ve kapsaması bu hacmi karşılayan modelleri, kapsama değeri en yakın olandan başlayarak listeler.</p>

<h2>Katalogdaki kapsama aralıkları</h2>
<p>Üretici verisine göre katalogdaki cihazlar küçük bir koku kutusundan klima sistemine bağlanan çift başlıklı serilere kadar geniş bir aralığı kapsar. Birkaç örnek:</p>
<ul>
  <li><a href="urun-ck628.html">CK-628</a> ultrasonik duvar difüzörü: 300 m³ (toplantı odası, otel odası, ofis).</li>
  <li><a href="urun-ck688.html">CK-688</a> çift akışkanlı duvar difüzörü: 800 m³ (mağaza, showroom).</li>
  <li><a href="urun-ck686.html">CK-686</a> kolon difüzör: 4.000 m³ (lobi, restoran).</li>
  <li><a href="urun-ck621.html">CK-621 / 622 / 623</a> serisi: 8.000 m³, 1000 / 3000 / 5000 ml hazne seçenekleri (büyük alanlar, klima bağlantısı).</li>
</ul>

<h2>Hesabın yetmediği durumlar</h2>
<p>Kapsama değeri, açık ve tek parça bir hacim için verilen bir üst sınırdır. Gerçek mekânlarda şu durumlar daha fazla kapasite ya da birden fazla cihaz gerektirebilir:</p>
<ul>
  <li><strong>Bölmeli alanlar.</strong> Duvarlar ve kapılar hava akışını keser. Koridorlara açılan odalar, ara kat ve galeriler ayrı hacimler gibi düşünülmeli.</li>
  <li><strong>Güçlü havalandırma.</strong> Sık hava değişimi olan mekânlarda (restoran mutfağına yakın alanlar, sık açılan giriş kapıları) koku daha hızlı dağılır.</li>
  <li><strong>Yoğun ziyaretçi trafiği.</strong> Kalabalık, kokunun algılanan yoğunluğunu düşürebilir.</li>
  <li><strong>Çok yüksek tavanlar.</strong> Sıcak hava yukarıda toplandığı için cihazın konumu (yükseklik, hava akışına yakınlık) önem kazanır.</li>
</ul>
<p>Büyük ve bölmeli mekânlarda tek bir güçlü cihaz yerine, binanın havalandırma sistemine bağlanan bir cihaz daha dengeli sonuç verebilir. Bu konuyu <a href="blog-klima-sistemine-koku-difuzoru-baglama.html">klima bağlantısı rehberimizde</a> ayrıntılı anlattık.</p>

<h2>Seçim için kısa kontrol listesi</h2>
<ol>
  <li>Taban alanını ve tavan yüksekliğini ölçün, hacmi hesaplayın.</li>
  <li>Kapsama değeri bu hacmi rahatça karşılayan bir model seçin.</li>
  <li>Mekânın bölmeli olup olmadığını ve klima altyapısını not edin.</li>
  <li>Cihazın ses seviyesini kullanım alanına göre kontrol edin (toplantı odası ile AVM'nin beklentisi farklıdır).</li>
  <li>Esans kapasitesine bakarak dolum sıklığını tahmin edin.</li>
</ol>
<p>Ölçülerinizi <a href="iletisim.html">teklif formuna</a> yazarsanız uygun modelleri birlikte belirleyebiliriz.</p>
`,
    sources: []
  },

  {
    slug: 'ultrasonik-ve-cift-akiskanli-difuzor-farki',
    title: 'Ultrasonik ve çift akışkanlı (nano) difüzör arasındaki fark',
    navTitle: 'Ultrasonik ve çift akışkanlı difüzör',
    description: 'İki yaygın atomizasyon yöntemi nasıl çalışır, hangisi hangi mekâna uygundur? Ses, bakım, esans kullanımı ve kapsama açısından karşılaştırma.',
    date: '2026-10-06',
    minutes: 5,
    image: 'images/general/video-hero-poster.jpg',
    imageAlt: 'Yosunlu taş üzerinde farklı tipte koku difüzörleri',
    tags: ['Teknoloji', 'Cihaz seçimi'],
    related: ['ck628', 'ck688', 'ck689', 'ck631'],
    body: `
<p class="lead">Profesyonel koku difüzörleri esansı havaya iki temel yöntemle verir: ultrasonik titreşim ya da basınçlı hava. İkisi de ısı kullanmaz; fark, parçacığın nasıl oluştuğunda ve bunun sonuçlarındadır.</p>

<h2>Ultrasonik atomizasyon</h2>
<p>Ultrasonik cihazlarda esans, yüksek frekansta titreşen bir plakanın (seramik disk) üzerinde ince bir sise dönüşür. Ev tipi aroma difüzörlerinin çoğu bu prensiple suyu ve esansı birlikte buharlaştırmadan sise çevirir. Katalogdaki ultrasonik duvar modelleri (<a href="urun-ck628.html">CK-628</a>, <a href="urun-ck638.html">CK-638</a>, <a href="urun-ck648.html">CK-648</a>) üretici verisine göre 8 dBA'nın altında ses seviyesiyle çalışır ve değiştirilebilir bir ultrasonik plakaya sahiptir.</p>
<p><strong>Güçlü yanları:</strong> çok sessiz çalışma, düşük güç tüketimi, kompakt gövde. <strong>Sınırları:</strong> kapsama alanı daha küçüktür; katalogdaki ultrasonik duvar modelleri 300 m³ kapsar. Plaka zamanla aşınabilir ve değiştirilmesi gerekir.</p>

<h2>Çift akışkanlı (basınçlı hava) atomizasyon</h2>
<p>Bu cihazlarda küçük bir hava pompası esansın üzerinden yüksek hızla hava geçirir; esans çok ince parçacıklar halinde koparılarak havaya karışır. Su kullanılmaz, esans seyreltilmeden dağıtılır. Sektörde "nebulizer" ya da "kuru sis" olarak da anılır. Üreticinin açıklamasına göre katalogdaki çift akışkanlı sistemlerde parçacıklar iyonize bir hızlandırıcıyla nano ölçeğe indirilir; çok ince parçacıklar yüzeye çarptığında kırılmadan geri sektiği için ıslak kalıntı bırakmaz.</p>
<p><strong>Güçlü yanları:</strong> daha büyük kapsama (katalogda 300 m³'lük prize takılan modellerden 15.000 m³'lük çift başlıklı serilere), yoğun ve homojen dağılım, klima sistemine bağlanabilme. <strong>Sınırları:</strong> pompa nedeniyle ultrasonik modellere göre daha duyulur çalışır; esans seyreltilmediği için yoğunluk ayarı daha önemlidir.</p>

<h2>Karşılaştırma</h2>
<div class="table-wrap">
<table>
  <caption>Genel karşılaştırma (modele göre değişir; kesin değerler ürün sayfalarında)</caption>
  <thead><tr><th scope="col">Ölçüt</th><th scope="col">Ultrasonik</th><th scope="col">Çift akışkanlı</th></tr></thead>
  <tbody>
    <tr><th scope="row">Çalışma prensibi</th><td>Titreşen plaka</td><td>Basınçlı hava</td></tr>
    <tr><th scope="row">Isı</th><td>Kullanılmaz</td><td>Kullanılmaz</td></tr>
    <tr><th scope="row">Ses</th><td>Çok düşük</td><td>Düşük ile orta</td></tr>
    <tr><th scope="row">Kapsama (bu katalogda)</th><td>100 ile 300 m³</td><td>300 ile 15.000 m³</td></tr>
    <tr><th scope="row">Klima bağlantısı</th><td>Yok</td><td>Bazı modellerde var</td></tr>
    <tr><th scope="row">Bakım</th><td>Plaka değişimi</td><td>Nozül temizliği, esans dolumu</td></tr>
  </tbody>
</table>
</div>

<h2>Hangisini seçmeli?</h2>
<ul>
  <li><strong>Toplantı odası, otel odası, muayenehane, küçük ofis:</strong> ses seviyesi öncelikliyse ultrasonik modeller.</li>
  <li><strong>Mağaza, showroom, restoran, lobi:</strong> kapsama ve yoğunluk öncelikliyse çift akışkanlı modeller.</li>
  <li><strong>Çok büyük ya da bölmeli alanlar:</strong> klima sistemine bağlanan çift akışkanlı cihazlar.</li>
</ul>
<p>Yöntemlerin farkını <a href="teknoloji.html">teknoloji sayfasındaki şematik karşılaştırmada</a> da görebilirsiniz.</p>
`,
    sources: [
      { label: 'Ürün teknik verileri: üreticinin 2025 ürün kataloğu (ürün sayfalarında).' }
    ]
  },

  {
    slug: 'klima-sistemine-koku-difuzoru-baglama',
    title: 'Klima (HVAC) sistemine koku difüzörü bağlama rehberi',
    navTitle: 'Klima sistemine difüzör bağlama',
    description: 'Büyük mekânlarda kokuyu havalandırma kanalıyla dağıtmak: bağlantı noktaları, cihazın konumu, bakım ve proje öncesi toplanması gereken bilgiler.',
    date: '2026-10-06',
    minutes: 6,
    image: 'images/products/ck611-g1.jpg',
    imageAlt: 'İki alüminyum hazneli, klima bağlantılı büyük alan difüzörü',
    tags: ['HVAC', 'Büyük alanlar'],
    related: ['ck611', 'ck621', 'ck631', 'ck620'],
    body: `
<p class="lead">Otel lobileri, AVM'ler, havalimanları ve kongre merkezleri gibi büyük ya da bölmeli mekânlarda kokuyu tek tek cihazlarla dağıtmak zordur. Bu yapılarda en dengeli yöntem, kokuyu binanın zaten var olan hava akışına, yani klima (HVAC) sistemine vermektir.</p>

<h2>Nasıl çalışır?</h2>
<p>Klima bağlantılı difüzör, mekânın içinde değil, makine dairesinde, asma tavan üstünde ya da teknik bir odada durur. Cihaz esansı çok ince, kuru parçacıklara ayırır ve bir hortum ya da boru üzerinden havalandırma kanalına verir. Koku, kanaldaki hava akışıyla birlikte tüm menfezlerden mekâna dağılır. Kanalda yoğuşma ve birikim istenmediği için bu tür cihazlarda genellikle su ve ısı kullanmayan, kuru parçacık üreten basınçlı hava teknolojisi kullanılır. Katalogdaki klima bağlantılı modellerin hangi atomizasyon yöntemini kullandığı ürün sayfalarında belirtilmiştir.</p>

<h2>Bağlantı noktası</h2>
<p>Sektörde iki yaygın yaklaşım vardır:</p>
<ul>
  <li><strong>Dönüş havası kanalı:</strong> Koku, klima santraline geri dönen havaya verilir. Santralden geçerek tüm besleme menfezlerine dağılır.</li>
  <li><strong>Santral (AHU) çıkışı:</strong> Cihaz, klima santralinin hemen çıkışındaki besleme havasına doz verir.</li>
</ul>
<p>Hangisinin uygun olduğu santralin tipine, filtrelerin konumuna ve kanal yapısına bağlıdır. Bu karar, binanın mekanik tesisat sorumlusuyla birlikte verilmelidir.</p>

<h2>Katalogdaki klima bağlantılı modeller</h2>
<p>Üretici verisine göre şu modeller klima ya da taze hava sistemine bağlanabilir:</p>
<ul>
  <li><a href="urun-ck631.html">CK-631</a> hava pompalı klima bağlantılı difüzör: 3.500 m³, kızılötesi yağ seviyesi algılama.</li>
  <li><a href="urun-ck620.html">CK-620 / 640 / 670</a> serisi: 2.000, 4.000 ve 7.000 m³.</li>
  <li><a href="urun-ck621.html">CK-621 / 622 / 623</a> serisi: 8.000 m³, 1000 / 3000 / 5000 ml hazne seçenekleri.</li>
  <li><a href="urun-ck611.html">CK-611 / 612 / 613</a> çift başlıklı seri: 5.000 ile 15.000 m³, 2 x 5000 ml'ye kadar hazne.</li>
  <li><a href="urun-ck686.html">CK-686</a> kolon difüzör: taze hava sistemi bağlantısı.</li>
</ul>

<h2>Proje öncesi toplanacak bilgiler</h2>
<ol>
  <li>Kokulandırılacak alanların toplam hacmi ve kat planı.</li>
  <li>Klima santrallerinin sayısı, konumu ve hangi alanları beslediği.</li>
  <li>Dönüş ve besleme kanallarının cihazın konacağı yere uzaklığı.</li>
  <li>Santralin çalışma saatleri (koku, sistem çalışırken dağılır).</li>
  <li>Cihaz için elektrik bağlantısı ve dolum yapılacak erişilebilir bir alan.</li>
</ol>

<h2>Bakım ve işletme</h2>
<ul>
  <li><strong>Zamanlama:</strong> Cihazın çalışma saatleri santralin çalışma saatleriyle eşleşmeli; sistem kapalıyken koku kanalda dağılmaz.</li>
  <li><strong>Dolum:</strong> Büyük hazneli modeller dolum sıklığını azaltır. Esans tüketimi, yoğunluk ayarına ve çalışma süresine bağlıdır.</li>
  <li><strong>Kontrol:</strong> İlk haftalarda menfezlerden farklı noktalarda koku yoğunluğu kontrol edilip ayar yapılmalı.</li>
</ul>
<p>Klima bağlantılı bir proje için teklif formunda konu olarak <a href="iletisim.html?konu=hvac">"Merkezi klima (HVAC) projelendirme"</a> seçebilirsiniz.</p>
`,
    sources: [
      { label: 'Ürün teknik verileri: üreticinin 2025 ürün kataloğu (ürün sayfalarında).' }
    ]
  },

  {
    slug: 'koku-yorgunlugu-ve-dogru-yogunluk',
    title: 'Koku yorgunluğu: mekân kokusunun yoğunluğu nasıl ayarlanır?',
    navTitle: 'Koku yorgunluğu ve doğru yoğunluk',
    description: 'İnsanlar sürekli maruz kaldıkları kokuya neden alışır, bu durum yoğunluk ayarını nasıl etkiler ve iç hava kalitesi için nelere dikkat edilmeli?',
    date: '2026-10-06',
    minutes: 5,
    image: 'images/general/video-living-poster.jpg',
    imageAlt: 'Salonda sehpa üzerindeki bir difüzörü çalıştıran kişi',
    tags: ['Rehber', 'İç hava kalitesi'],
    related: ['ck688', 'ck628', 'ck631'],
    body: `
<p class="lead">Bir mekâna girdiğinizde fark ettiğiniz koku, birkaç dakika sonra neredeyse kaybolmuş gibi gelir. Bu, cihazın durduğu anlamına gelmez; burnunuz alışmıştır. Mekân kokulandırmada en sık yapılan hata, bu alışmayı telafi etmek için yoğunluğu artırmaktır.</p>

<h2>Alışma (habituasyon) nedir?</h2>
<p>Pellegrino, Sinding, de Wijk ve Hummel'in 2017 tarihli derlemesine göre koku alışması, tekrarlı ya da sürekli maruziyetle davranışsal tepkinin azalmasıdır; adaptasyon ise bu azalmayı oluşturan sinirsel süreçleri ifade eder. Derleme, kokuya alışmanın görece hızlı gerçekleştiğini ve beyindeki üst süreçlerde, burundaki reseptörlere göre daha da hızlı olduğunu belirtiyor.</p>
<p>Pratik sonucu şudur: mekânda gün boyu çalışan personel kokuyu çok az algılar, yeni gelen bir misafir ise belirgin biçimde algılar. Yoğunluk ayarı personelin değil, ziyaretçinin algısına göre yapılmalıdır.</p>

<h2>Doğru yoğunluk için öneriler</h2>
<ul>
  <li><strong>Az başlayın.</strong> İlk ayarı düşük tutun, birkaç gün içinde gerekirse kademeli artırın.</li>
  <li><strong>Aralıklı çalıştırın.</strong> Profesyonel difüzörlerde püskürtme ve bekleme süreleri ayrı ayrı ayarlanır. Sürekli püskürtme yerine kısa çalışma, uzun bekleme döngüleri hem alışmayı hem esans tüketimini azaltır.</li>
  <li><strong>Saatlere göre programlayın.</strong> Uygulama ya da zamanlayıcı destekli modellerde cihaz yalnızca açık saatlerde çalışır; kalabalık saatlerde yoğunluk artırılabilir.</li>
  <li><strong>"Taze burun" testi yapın.</strong> Yoğunluğu, mekânda uzun süre bulunmamış birine sorun: girişte fark ediliyor ama rahatsız etmiyorsa doğru seviyedesiniz.</li>
</ul>

<h2>İç hava kalitesi</h2>
<p>Koku ürünleri, oda sıcaklığında kolayca buharlaşan uçucu organik bileşikler (VOC) içerir. ABD Çevre Koruma Ajansı (EPA), oda kokularını iç mekândaki VOC kaynakları arasında sayar ve birçok VOC'nin iç mekânda dış ortama göre sürekli olarak daha yüksek (on kata kadar) konsantrasyonda bulunduğunu belirtir. EPA'nın önerileri basittir: ürünün kullanım talimatına uyun ve VOC yayan ürünler kullanılırken havalandırmayı artırın.</p>
<p>Mekân kokulandırmada bu, şu anlama gelir:</p>
<ul>
  <li>Kokuyu gerektiğinden yoğun kullanmayın; amaç havayı doldurmak değil, fark edilir bir iz bırakmaktır.</li>
  <li>Mekânın havalandırmasının çalıştığından emin olun.</li>
  <li>Küçük, kapalı ve havasız odalarda düşük yoğunluk seçin.</li>
  <li>Esansın güvenlik bilgi formunu (SDS) ve uygunluk belgelerini tedarikçinizden isteyin. Bu konuda <a href="blog-ifra-standartlari-nedir.html">IFRA yazımıza</a> bakabilirsiniz.</li>
</ul>
`,
    sources: [
      { label: 'Pellegrino, R., Sinding, C., de Wijk, R. A. ve Hummel, T. (2017). Habituation and adaptation to odors in humans. Physiology & Behavior, 177, 13-19.', url: 'https://fis.tu-dresden.de/portal/en/publications/habituation-and-adaptation-to-odors-in-humans(0991ecaa-8188-4fbd-8e93-3b00f36f3fe4).html' },
      { label: 'U.S. EPA. Volatile Organic Compounds\' Impact on Indoor Air Quality.', url: 'https://www.epa.gov/indoor-air-quality-iaq/volatile-organic-compounds-impact-indoor-air-quality' }
    ]
  },

  {
    slug: 'ifra-standartlari-nedir',
    title: 'IFRA standartları nedir? Esans tedarikçisinden hangi belgeleri istemelisiniz',
    navTitle: 'IFRA standartları nedir?',
    description: 'Uluslararası Koku Birliği (IFRA) standartları neyi düzenler, bir esansın uygunluğu nasıl belgelenir ve kurumsal alımlarda hangi belgeler istenmeli?',
    date: '2026-10-06',
    minutes: 4,
    image: 'images/general/perfumer.jpg',
    imageAlt: 'Esans şişeleriyle dolu rafların önünde koku değerlendiren parfümör',
    tags: ['Esans güvenliği', 'Satın alma'],
    related: [],
    body: `
<p class="lead">Mekân kokulandırmada cihaz kadar esansın kendisi de önemlidir. Kurumsal alımlarda esans tedarikçisine sorulan ilk sorulardan biri, ürünün IFRA standartlarına uygun olup olmadığıdır. Peki IFRA nedir ve bu uygunluk nasıl belgelenir?</p>

<h2>IFRA nedir?</h2>
<p>IFRA (International Fragrance Association, Uluslararası Koku Birliği), koku sektörünü dünya genelinde temsil eden ve koku maddelerinin güvenli kullanımını teşvik etmeyi amaçlayan sektör kuruluşudur. IFRA'nın iki temel aracı vardır:</p>
<ul>
  <li><strong>IFRA Standartları:</strong> Belirli bir koku maddesinin güvenli kullanımıyla ilgili bir endişe olduğunda yayımlanır. Bir maddeyi yasaklayabilir, kullanım miktarını sınırlayabilir ya da saflık şartı koyabilir. Bu kararlar, bağımsız bir araştırma kuruluşu olan RIFM'in (Research Institute for Fragrance Materials) güvenlik değerlendirmelerine dayanır.</li>
  <li><strong>IFRA Uygulama Kuralları (Code of Practice):</strong> IFRA üyelerinin koku maddelerini ve karışımlarını üretirken ve işlerken uyması gereken iyi uygulama taahhüdüdür. Üyeler, sağladıkları ürünlerin amaçlanan kullanım için güvenli olmasını ve yürürlükteki mevzuata uymasını sağlamakla yükümlüdür.</li>
</ul>
<p>IFRA standartları ürün kategorisine göre farklı sınırlar koyar; bir parfüm, bir mum ve bir oda kokusu için aynı madde farklı oranlarda kullanılabilir.</p>

<h2>Uygunluk nasıl belgelenir?</h2>
<p>Bir esansın IFRA standartlarına uygunluğu genellikle üreticinin düzenlediği bir <strong>IFRA uygunluk sertifikası</strong> ile gösterilir. Bu belge, karışımın hangi ürün kategorileri için hangi en yüksek oranda kullanılabileceğini belirtir. Belgenin standartların hangi sürümüne (amendment) göre hazırlandığına dikkat edin; standartlar zaman içinde güncellenir.</p>

<h2>Kurumsal alımlarda istenmesi gereken belgeler</h2>
<ol>
  <li><strong>Güvenlik bilgi formu (SDS):</strong> Esansın tehlike sınıfı, depolama, taşıma ve ilk yardım bilgileri.</li>
  <li><strong>IFRA uygunluk sertifikası:</strong> Oda kokusu ve difüzör kullanımına uygun kategori ve oranlar.</li>
  <li><strong>Alerjen bildirimi:</strong> Karışımdaki bildirimi zorunlu alerjen koku maddelerinin listesi.</li>
  <li><strong>Test raporları:</strong> Varsa bağımsız laboratuvar test raporları ve raporun hangi ürüne ait olduğu.</li>
</ol>

<h2>Katalogdaki esanslar hakkında</h2>
<p>Üretici, esanslarının IFRA standartlarına uygunluğunun SGS tarafından test edildiğini belirtmektedir. Bu bir üretici beyanıdır; test ve uygunluk belgelerini teklif sürecinde talep edebilirsiniz. Koku seçenekleri için <a href="esanslar.html">koku koleksiyonuna</a> bakabilirsiniz.</p>
<!-- [DOĞRULANACAK] IFRA / SGS ifadesi üretici beyanıdır; belge görülmeden kesin ifade kullanılmamalı. -->
`,
    sources: [
      { label: 'IFRA. IFRA Code of Practice.', url: 'https://ifrafragrance.org/safe-use/code-of-practice-new' },
      { label: 'IFRA. IFRA Standards Library.', url: 'https://ifrafragrance.org/publications/guidanceReferenceDocument/ifra-code-of-practice' }
    ]
  },

  {
    slug: 'otel-icin-koku-secimi',
    title: 'Otel için koku seçimi: lobi, koridor ve odalarda koku aileleri',
    navTitle: 'Otel için koku seçimi',
    description: 'Bir otelin farklı alanları için koku ailesi ve cihaz seçimi: lobi, koridor, oda, spa ve restoran için pratik öneriler.',
    date: '2026-10-06',
    minutes: 5,
    image: 'images/products/ck687-g1.jpg',
    imageAlt: 'Otel lobisinde merdiven önünde konumlandırılmış difüzör',
    tags: ['Otel', 'Koku seçimi'],
    related: ['ck686', 'ck631', 'ck638', 'ck687'],
    body: `
<p class="lead">Otellerde koku, misafirin ilk karşılaştığı ayrıntılardan biridir. İyi kurgulanmış bir koku planı, otelin farklı alanlarını aynı kimlik altında birleştirirken her alanın kendi kullanımına uygun yoğunlukta kalmasını sağlar.</p>

<h2>Tek imza koku mu, alanlara göre farklı kokular mı?</h2>
<p>Pek çok otel, lobide kullanılan bir "imza koku" ile tanınır. Bu kokunun koridor ve asansörlerde daha düşük yoğunlukta devam etmesi, misafirin oteli tek bir deneyim olarak algılamasına yardımcı olur. Spa ve restoran gibi alanlar ise kendi işlevlerine göre ayrı ele alınır: restoranda yemeğin kokusuyla yarışmayan, çok hafif bir koku ya da hiç koku tercih edilir.</p>

<h2>Alanlara göre öneriler</h2>
<div class="table-wrap">
<table>
  <caption>Alan, koku ailesi ve cihaz tipi</caption>
  <thead><tr><th scope="col">Alan</th><th scope="col">Koku ailesi</th><th scope="col">Cihaz tipi</th></tr></thead>
  <tbody>
    <tr><td>Lobi ve resepsiyon</td><td>Ferah çay, beyaz çiçekler, hafif odunsu</td><td>Kolon ya da klima bağlantılı (<a href="urun-ck686.html">CK-686</a>, <a href="urun-ck631.html">CK-631</a>)</td></tr>
    <tr><td>Koridor ve asansör</td><td>Lobi kokusunun düşük yoğunluklu devamı</td><td>Duvar tipi ultrasonik (<a href="urun-ck638.html">CK-638</a>)</td></tr>
    <tr><td>Oda</td><td>Sakin, pudralı ya da lavantalı</td><td>Masaüstü ya da çubuklu koku</td></tr>
    <tr><td>Spa</td><td>Lavanta, adaçayı, odunsu</td><td>Duvar tipi, düşük ses</td></tr>
    <tr><td>Restoran</td><td>Çok hafif ya da kokusuz</td><td>Gerekirse yalnızca giriş alanında</td></tr>
  </tbody>
</table>
</div>

<h2>Koleksiyondan örnek eşleşmeler</h2>
<ul>
  <li><strong>Lobi:</strong> Encountering White Tea (yeşil çay, beyaz çay, beyaz amber) ya da Gardenya Beyaz Çay. Ferah ve tanıdık; geniş kitleler tarafından rahatsız edici bulunma ihtimali düşük.</li>
  <li><strong>Akşam saatleri ve bar:</strong> Bergamot &amp; Sandal Ağacı ya da Gül &amp; Sedir gibi odunsu dipli kokular.</li>
  <li><strong>Spa ve oda:</strong> Fougère No. 2 (lavanta, papatya, beyaz misk) ya da Misket Limonu &amp; Adaçayı.</li>
</ul>
<p>Tüm kokuların üst, kalp ve dip notalarını <a href="esanslar.html">koku koleksiyonu</a> sayfasında bulabilirsiniz.</p>

<h2>Uygulama ipuçları</h2>
<ol>
  <li><strong>Önce numune deneyin.</strong> Kokuyu kâğıt şeritte değil, gerçek alanda ve cihazla deneyin; aynı koku farklı hacimlerde farklı algılanır.</li>
  <li><strong>Personelin görüşünü alın.</strong> Gün boyu aynı ortamda çalışan ekip, yoğunluk konusunda değerli geri bildirim verir.</li>
  <li><strong>Cihazı göz hizasının üstüne yerleştirin.</strong> Duvar tipi cihazlar hava akışına yakın ve erişilebilir bir yüksekliğe konmalı.</li>
  <li><strong>Saatlere göre ayarlayın.</strong> Giriş ve çıkış yoğun saatlerinde yoğunluk artırılabilir, gece azaltılabilir.</li>
</ol>
<p>Otelinizin alanları için birlikte bir koku planı hazırlamak isterseniz <a href="iletisim.html?konu=numune">numune talebinde</a> bulunabilirsiniz.</p>
`,
    sources: []
  }
];
