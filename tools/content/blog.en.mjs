// İngilizce blog yazıları (blog.mjs'in karşılığı; aynı slug, tarih, görsel ve ilgili ürünler).
// Gövde HTML'i build.mjs tarafından en/blog-<slug>.html sayfalarına yazılır. blog.mjs değişirse burayı da güncelleyin.
// Kurallar blog.mjs ile aynı: şirket hakkında yeni iddia yok; ürün bilgisi products.js'ten; dış bulgular kaynaklı.

export const POSTS = [
  {
    slug: 'koku-pazarlamasi-nedir',
    title: 'What is scent marketing? What research says about ambient scent',
    navTitle: 'What is scent marketing?',
    description: 'Three key studies on how ambient scent affects customer perception, and how to apply the findings well in hotels, shops and offices.',
    date: '2026-10-06',
    minutes: 6,
    image: 'images/products/ck631.jpg',
    imagePos: '62% 50%',
    imageAlt: 'CK-631 scent diffuser mounted on the wall at a hotel reception',
    tags: ['Scent marketing', 'Research'],
    related: ['ck631', 'ck686', 'ck620'],
    body: `
<p class="lead">Scent marketing (ambient scenting) aims to shape how visitors perceive a space by giving it a deliberately chosen scent. Hotel lobbies, shops, showrooms and offices use it most. So what does scientific research say about the effect, and how should the findings be read?</p>

<h2>Three key studies</h2>

<h3>1. Store evaluations and time perception (1996)</h3>
<p>The study by Spangenberg, Crowley and Henderson in the <em>Journal of Marketing</em> was one of the first thorough experiments on the effect of ambient scent in retail. Where a pleasant ambient scent was present, participants rated the store and its products more favourably and were more likely to say they would return. A widely quoted finding concerns time perception: in the scented setting, participants felt they had spent less time in the store than they actually had.</p>

<h3>2. Brand recall (2003)</h3>
<p>In two experiments reported in the <em>Journal of Marketing Research</em>, Morrin and Ratneshwar found that ambient scent improved recall and recognition of both familiar and unfamiliar brands. Two details stand out: the effect did not depend on whether the scent matched the product category, and participants' self-reported mood did not change. According to the researchers, attention is the most likely explanation: in the scented setting participants looked at the products for longer.</p>

<h3>3. A meta-analysis of thirty years (2017)</h3>
<p>In the <em>Journal of Retailing</em>, Roschk, Loureiro and Breitsohl combined 66 studies (135 effects, 15,621 participants) on the effects of music, scent and colour. Scented settings scored higher than unscented ones on pleasure, satisfaction and behavioural intention. The size of the effect, however, was <strong>small to medium</strong>. The data also suggest that scent tends to have a stronger effect in service settings (such as hotels and restaurants) than in retail.</p>

<h2>Reading the findings correctly</h2>
<p>Taken together, these studies paint a clear picture: a well-chosen ambient scent can measurably improve how a space is perceived. Three points are worth keeping in mind:</p>
<ul>
  <li><strong>The effect is consistent, not large.</strong> The meta-analysis finds a small to medium effect. Be sceptical of firm promises such as "increases sales by X per cent"; any such result varies greatly with the space, the product and how it is measured.</li>
  <li><strong>The scent must be pleasant.</strong> The positive results came from scents participants found pleasant. A scent that bothers people or is too strong can have the opposite effect.</li>
  <li><strong>Intensity matters.</strong> People quickly get used to a scent they are constantly exposed to. The right intensity and timing keep the scent noticeable without being intrusive. See our <a href="blog-koku-yorgunlugu-ve-dogru-yogunluk.html">article on scent fatigue</a> for details.</li>
</ul>

<h2>Four steps in practice</h2>
<ol>
  <li><strong>Start with the identity of the space.</strong> A luxury hotel lobby, a gym and a law firm should not smell the same. The scent family (fresh, floral, woody) should match the tone of the space.</li>
  <li><strong>Choose the device by volume.</strong> The device's coverage should meet the air volume of the space. You can start with the <a href="cozumler.html#hesaplayici">volume calculator</a>.</li>
  <li><strong>Be consistent.</strong> For businesses with several branches, using the same scent at the same intensity everywhere makes it easier to associate the scent with the brand.</li>
  <li><strong>Collect feedback.</strong> In the first weeks, ask staff and guests about the intensity and adjust the device's spray and pause times accordingly.</li>
</ol>

<p>Browse the <a href="urunler.html">product catalogue</a> to choose a device. Our fragrance collection is being prepared and will appear on the site once it is confirmed.</p>
`,
    sources: [
      { label: 'Spangenberg, E. R., Crowley, A. E. and Henderson, P. W. (1996). Improving the store environment: Do olfactory cues affect evaluations and behaviors? Journal of Marketing, 60(2), 67-80.' },
      { label: 'Morrin, M. and Ratneshwar, S. (2003). Does it make sense to use scents to enhance brand memory? Journal of Marketing Research, 40(1), 10-25.', url: 'https://www.researchwithrutgers.com/en/publications/does-it-make-sense-to-use-scents-to-enhance-brand-memory/' },
      { label: 'Roschk, H., Loureiro, S. M. C. and Breitsohl, J. (2017). Calibrating 30 years of experimental research: A meta-analysis of the atmospheric effects of music, scent, and color. Journal of Retailing, 93(2), 228-240.', url: 'https://doi.org/10.1016/j.jretai.2016.10.001' }
    ]
  },

  {
    slug: 'mekan-hacmine-gore-difuzor-secimi',
    title: 'Choosing a scent diffuser by room volume: the m³ calculation step by step',
    navTitle: 'Choosing a diffuser by volume',
    description: 'Why diffuser coverage is given in m³ rather than m², how to calculate volume and when you need more than one device.',
    date: '2026-10-06',
    minutes: 5,
    image: 'images/products/ck686.jpg',
    imagePos: '38% 58%',
    imageAlt: 'ADS-687 column diffuser standing on the floor in a modern living room',
    tags: ['Guide', 'Choosing a device'],
    related: ['ck628', 'ck688', 'ck686', 'ck621'],
    body: `
<p class="lead">The first figure to check when choosing a scent diffuser is its coverage. Manufacturers usually give it in cubic metres (m³), because scent fills a volume of air, not a floor. Of two spaces with the same floor area, the one with the higher ceiling needs a stronger device.</p>

<h2>How to calculate volume</h2>
<p>The calculation is simple: <strong>floor area (m²) x ceiling height (m) = air volume (m³)</strong>.</p>
<div class="table-wrap">
<table>
  <caption>Example calculations</caption>
  <thead><tr><th scope="col">Space</th><th scope="col">Floor area</th><th scope="col">Ceiling</th><th scope="col">Volume</th></tr></thead>
  <tbody>
    <tr><td>Meeting room</td><td>40 m²</td><td>2.8 m</td><td>112 m³</td></tr>
    <tr><td>Boutique shop</td><td>150 m²</td><td>3.2 m</td><td>480 m³</td></tr>
    <tr><td>Hotel lobby</td><td>400 m²</td><td>6 m</td><td>2,400 m³</td></tr>
    <tr><td>Shopping centre atrium</td><td>2,000 m²</td><td>4 m</td><td>8,000 m³</td></tr>
  </tbody>
</table>
</div>
<p>The <a href="cozumler.html#hesaplayici">volume calculator</a> does this for you and lists the models that cover the volume, starting with the closest coverage.</p>

<h2>Coverage ranges in the catalogue</h2>
<p>According to the manufacturer, the devices in the catalogue cover a wide range, from small plug-in models to twin-head series connected to the HVAC system. A few examples:</p>
<ul>
  <li>CK-628 ultrasonic wall diffuser: 300 m³ (meeting rooms, hotel rooms, offices).</li>
  <li>CK-688 dual-fluid wall diffuser: 800 m³ (shops, showrooms).</li>
  <li><a href="urun-ck686.html">ADS-687</a> column diffuser: 1,500-2,000 m³ (lobbies, restaurants).</li>
  <li>CK-621 / 622 / 623 series: 8,000 m³, with 1000 / 3000 / 5000 ml reservoir options (large spaces, HVAC connection).</li>
</ul>

<h2>When the calculation is not enough</h2>
<p>Coverage is an upper limit given for an open, undivided volume. In real spaces, the following may call for more capacity or more than one device:</p>
<ul>
  <li><strong>Partitioned spaces.</strong> Walls and doors interrupt the airflow. Rooms opening onto corridors, mezzanines and galleries should be treated as separate volumes.</li>
  <li><strong>Strong ventilation.</strong> Where the air changes often (areas near a restaurant kitchen, entrance doors that open frequently), scent disperses faster.</li>
  <li><strong>Heavy visitor traffic.</strong> Crowds can lower the perceived intensity of the scent.</li>
  <li><strong>Very high ceilings.</strong> Warm air collects at the top, so the position of the device (height, closeness to the airflow) matters more.</li>
</ul>
<p>In large and partitioned spaces, a device connected to the building's ventilation system can give a more even result than a single powerful unit. We cover this in detail in our <a href="blog-klima-sistemine-koku-difuzoru-baglama.html">HVAC connection guide</a>.</p>

<h2>A short checklist</h2>
<ol>
  <li>Measure the floor area and ceiling height and calculate the volume.</li>
  <li>Choose a model whose coverage comfortably meets that volume.</li>
  <li>Note whether the space is partitioned and what HVAC infrastructure it has.</li>
  <li>Check the device's noise level against the use of the space (a meeting room and a shopping centre have different expectations).</li>
  <li>Estimate how often it needs refilling from the fragrance capacity.</li>
</ol>
<p>If you send your measurements through the <a href="iletisim.html">quote form</a>, we can choose suitable models together.</p>
`,
    sources: []
  },

  {
    slug: 'ultrasonik-ve-cift-akiskanli-difuzor-farki',
    title: 'Ultrasonic versus dual-fluid (nano) diffusers: what is the difference?',
    navTitle: 'Ultrasonic and dual-fluid diffusers',
    description: 'How the two common atomisation methods work and which suits which space. A comparison of noise, maintenance, fragrance use and coverage.',
    date: '2026-10-06',
    minutes: 5,
    image: 'images/general/video-hero-poster.jpg',
    imagePos: '50% 55%',
    imageAlt: 'Different types of scent diffusers on a mossy stone',
    tags: ['Technology', 'Choosing a device'],
    related: ['ck628', 'ck688', 'ck689', 'ck631'],
    body: `
<p class="lead">Professional scent diffusers release fragrance into the air in two main ways: ultrasonic vibration or compressed air. Neither uses heat; the difference lies in how the particles are formed and what follows from that.</p>

<h2>Ultrasonic atomisation</h2>
<p>In ultrasonic devices, fragrance turns into a fine mist on a plate (ceramic disc) vibrating at high frequency. Most home aroma diffusers use this principle to turn water and fragrance into mist without boiling them. According to the manufacturer, the ultrasonic wall models in the catalogue (CK-628, CK-638, CK-648) run below 8 dBA and have a replaceable ultrasonic plate.</p>
<p><strong>Strengths:</strong> very quiet operation, low power use, compact body. <strong>Limits:</strong> smaller coverage; the ultrasonic wall models in the catalogue cover 300 m³. The plate can wear over time and need replacing.</p>

<h2>Dual-fluid (compressed air) atomisation</h2>
<p>In these devices a small air pump blows air at high speed across the fragrance, tearing it into very fine particles that mix with the air. No water is used and the fragrance is spread undiluted. The industry also calls this a "nebuliser" or "dry mist". According to the manufacturer, the dual-fluid systems in the catalogue reduce the particles to nano scale with an ionised accelerator; because very fine particles bounce off surfaces without breaking, they leave no wet residue.</p>
<p><strong>Strengths:</strong> larger coverage (in the catalogue, from 300 m³ plug-in models to 15,000 m³ twin-head series), dense and even distribution, and HVAC connection. <strong>Limits:</strong> because of the pump they are more audible than ultrasonic models; since the fragrance is not diluted, the intensity setting matters more.</p>

<h2>Comparison</h2>
<div class="table-wrap">
<table>
  <caption>General comparison (varies by model; exact values on the product pages)</caption>
  <thead><tr><th scope="col">Criterion</th><th scope="col">Ultrasonic</th><th scope="col">Dual-fluid</th></tr></thead>
  <tbody>
    <tr><th scope="row">Principle</th><td>Vibrating plate</td><td>Compressed air</td></tr>
    <tr><th scope="row">Heat</th><td>None</td><td>None</td></tr>
    <tr><th scope="row">Noise</th><td>Very low</td><td>Low to medium</td></tr>
    <tr><th scope="row">Coverage (this catalogue)</th><td>100 to 300 m³</td><td>300 to 15,000 m³</td></tr>
    <tr><th scope="row">HVAC connection</th><td>No</td><td>On some models</td></tr>
    <tr><th scope="row">Maintenance</th><td>Plate replacement</td><td>Nozzle cleaning, refills</td></tr>
  </tbody>
</table>
</div>

<h2>Which should you choose?</h2>
<ul>
  <li><strong>Meeting rooms, hotel rooms, surgeries, small offices:</strong> ultrasonic models if noise is the priority.</li>
  <li><strong>Shops, showrooms, restaurants, lobbies:</strong> dual-fluid models if coverage and intensity are the priority.</li>
  <li><strong>Very large or partitioned spaces:</strong> dual-fluid devices connected to the HVAC system.</li>
</ul>
<p>You can also see the difference in the <a href="teknoloji.html">schematic comparison on the technology page</a>.</p>
`,
    sources: [
      { label: 'Product technical data: the manufacturer\'s 2025 product catalogue (on the product pages).' }
    ]
  },

  {
    slug: 'klima-sistemine-koku-difuzoru-baglama',
    title: 'Connecting a scent diffuser to the HVAC system: a guide',
    navTitle: 'Connecting a diffuser to HVAC',
    description: 'Spreading scent through the ventilation ducts in large spaces: connection points, device position, maintenance and what to gather before a project.',
    date: '2026-10-06',
    minutes: 6,
    image: 'images/products/ck611.jpg',
    imagePos: '50% 62%',
    imageAlt: 'HVAC-connected CK-611 diffuser with two aluminium reservoirs in a shopping centre atrium',
    tags: ['HVAC', 'Large spaces'],
    related: ['ck611', 'ck621', 'ck631', 'ck620'],
    body: `
<p class="lead">In large or partitioned spaces such as hotel lobbies, shopping centres, airports and convention centres, spreading scent with individual devices is difficult. The most even method in these buildings is to feed the scent into the airflow the building already has: the HVAC system.</p>

<h2>How it works</h2>
<p>An HVAC-connected diffuser does not sit in the space itself but in the plant room, above a suspended ceiling or in a technical room. It breaks the fragrance into very fine, dry particles and feeds them into the ventilation duct through a hose or pipe. The scent then reaches the space through all the vents with the airflow in the duct. Because condensation and build-up in the ducts are undesirable, such devices usually use compressed-air technology that produces dry particles without water or heat. The product pages state which atomisation method each HVAC-connected model in the catalogue uses.</p>

<h2>Connection point</h2>
<p>There are two common approaches in the industry:</p>
<ul>
  <li><strong>Return air duct:</strong> the scent is fed into the air returning to the air handling unit. It passes through the unit and reaches all supply vents.</li>
  <li><strong>Air handling unit (AHU) outlet:</strong> the device doses the supply air just after the air handling unit.</li>
</ul>
<p>Which is suitable depends on the type of unit, the position of the filters and the duct layout. This decision should be made together with the person responsible for the building's mechanical installation.</p>

<h2>HVAC-connected models in the catalogue</h2>
<p>According to the manufacturer, the following models can be connected to an HVAC or fresh-air system:</p>
<ul>
  <li>CK-631 air-pump HVAC-connected diffuser: 3,500 m³, infrared oil-level sensing.</li>
  <li><a href="urun-ck620.html">ADS-620B / 640B / 670B</a> series: 2,000-5,000, 4,000-8,000 and 7,000-12,000 m³.</li>
  <li>CK-621 / 622 / 623 series: 8,000 m³, with 1000 / 3000 / 5000 ml reservoir options.</li>
  <li>CK-611 / 612 / 613 twin-head series: 5,000 to 15,000 m³, reservoirs up to 2 x 5000 ml.</li>
  <li><a href="urun-ck686.html">ADS-687</a> column diffuser: connection to fresh-air systems.</li>
</ul>

<h2>What to gather before a project</h2>
<ol>
  <li>The total volume of the areas to be scented and the floor plan.</li>
  <li>The number and location of air handling units and which areas they serve.</li>
  <li>The distance from the return and supply ducts to where the device will go.</li>
  <li>The operating hours of the air handling unit (scent spreads while the system is running).</li>
  <li>A power supply for the device and an accessible place for refilling.</li>
</ol>

<h2>Maintenance and operation</h2>
<ul>
  <li><strong>Timing:</strong> the device's operating hours should match those of the air handling unit; scent does not spread through the ducts while the system is off.</li>
  <li><strong>Refills:</strong> larger reservoirs reduce how often you refill. Fragrance use depends on the intensity setting and running time.</li>
  <li><strong>Checks:</strong> in the first weeks, check the intensity at different vents and adjust.</li>
</ul>
<p>For an HVAC-connected project, choose <a href="iletisim.html?konu=hvac">"HVAC project"</a> in the quote form.</p>
`,
    sources: [
      { label: 'Product technical data: the manufacturer\'s 2025 product catalogue (on the product pages).' }
    ]
  },

  {
    slug: 'koku-yorgunlugu-ve-dogru-yogunluk',
    title: 'Scent fatigue: how to set the intensity of a space\'s scent',
    navTitle: 'Scent fatigue and the right intensity',
    description: 'Why people get used to a scent they are constantly exposed to, how this affects the intensity setting and what to watch for indoor air quality.',
    date: '2026-10-06',
    minutes: 5,
    image: 'images/general/video-living-poster.jpg',
    imagePos: '45% 50%',
    imageAlt: 'A person switching on a diffuser on a coffee table in a living room',
    tags: ['Guide', 'Indoor air quality'],
    related: ['ck688', 'ck628', 'ck631'],
    body: `
<p class="lead">The scent you notice when you walk into a space seems to have almost disappeared a few minutes later. That does not mean the device has stopped; your nose has got used to it. The most common mistake in space scenting is turning up the intensity to make up for this.</p>

<h2>What is habituation?</h2>
<p>According to the 2017 review by Pellegrino, Sinding, de Wijk and Hummel, olfactory habituation is the decrease in behavioural response with repeated or continuous exposure; adaptation refers to the neural processes behind this decrease. The review notes that habituation to odours happens relatively quickly, and even faster in higher brain processes than in the receptors in the nose.</p>
<p>The practical consequence: staff working in a space all day barely notice the scent, while a newly arrived guest notices it clearly. Intensity should be set for the visitor's perception, not the staff's.</p>

<h2>Tips for the right intensity</h2>
<ul>
  <li><strong>Start low.</strong> Keep the first setting low and increase it gradually over a few days if needed.</li>
  <li><strong>Run it in intervals.</strong> Professional diffusers let you set spray and pause times separately. Short spray, long pause cycles instead of continuous spraying reduce both habituation and fragrance use.</li>
  <li><strong>Schedule it by hours.</strong> With app or timer models the device runs only during opening hours, and intensity can be raised at busy times.</li>
  <li><strong>Do the "fresh nose" test.</strong> Ask someone who has not been in the space for a while: if they notice it at the entrance but it does not bother them, you are at the right level.</li>
</ul>

<h2>Indoor air quality</h2>
<p>Fragrance products contain volatile organic compounds (VOCs) that evaporate easily at room temperature. The US Environmental Protection Agency (EPA) lists air fresheners among indoor VOC sources and notes that concentrations of many VOCs are consistently higher indoors than outdoors (up to ten times higher). The EPA's advice is simple: follow the product's directions for use and increase ventilation when using products that emit VOCs.</p>
<p>In space scenting this means:</p>
<ul>
  <li>Do not use more scent than needed; the aim is to leave a noticeable trace, not to fill the air.</li>
  <li>Make sure the space's ventilation is working.</li>
  <li>Choose a low intensity in small, closed and stuffy rooms.</li>
  <li>Ask your supplier for the fragrance's safety data sheet (SDS) and compliance documents. See our <a href="blog-ifra-standartlari-nedir.html">article on IFRA</a>.</li>
</ul>
`,
    sources: [
      { label: 'Pellegrino, R., Sinding, C., de Wijk, R. A. and Hummel, T. (2017). Habituation and adaptation to odors in humans. Physiology & Behavior, 177, 13-19.', url: 'https://fis.tu-dresden.de/portal/en/publications/habituation-and-adaptation-to-odors-in-humans(0991ecaa-8188-4fbd-8e93-3b00f36f3fe4).html' },
      { label: 'U.S. EPA. Volatile Organic Compounds\' Impact on Indoor Air Quality.', url: 'https://www.epa.gov/indoor-air-quality-iaq/volatile-organic-compounds-impact-indoor-air-quality' }
    ]
  },

  {
    slug: 'ifra-standartlari-nedir',
    title: 'What are IFRA standards? Which documents to ask your fragrance supplier for',
    navTitle: 'What are IFRA standards?',
    description: 'What the International Fragrance Association (IFRA) standards regulate, how a fragrance\'s compliance is documented and which documents to request in business purchasing.',
    date: '2026-10-06',
    minutes: 4,
    image: 'images/general/perfumer.jpg',
    imagePos: '50% 45%',
    imageAlt: 'A perfumer evaluating a scent in front of shelves full of fragrance bottles',
    tags: ['Fragrance safety', 'Purchasing'],
    related: [],
    body: `
<p class="lead">In space scenting the fragrance matters as much as the device. One of the first questions put to a fragrance supplier in business purchasing is whether the product complies with IFRA standards. So what is IFRA, and how is compliance documented?</p>

<h2>What is IFRA?</h2>
<p>IFRA (the International Fragrance Association) is the industry body that represents the fragrance sector worldwide and aims to promote the safe use of fragrance materials. IFRA has two main tools:</p>
<ul>
  <li><strong>IFRA Standards:</strong> published when there is a concern about the safe use of a particular fragrance material. A standard can ban a material, limit how much may be used or set purity requirements. These decisions are based on safety assessments by RIFM (the Research Institute for Fragrance Materials), an independent research body.</li>
  <li><strong>IFRA Code of Practice:</strong> the commitment to good practice that IFRA members follow when making and handling fragrance materials and mixtures. Members must ensure that the products they supply are safe for their intended use and comply with applicable legislation.</li>
</ul>
<p>IFRA standards set different limits by product category; the same material may be used at different levels in a perfume, a candle and an air freshener.</p>

<h2>How is compliance documented?</h2>
<p>A fragrance's compliance with IFRA standards is usually shown with an <strong>IFRA certificate of conformity</strong> issued by the manufacturer. It states the maximum level at which the mixture may be used in each product category. Check which version (amendment) of the standards the certificate refers to; the standards are updated over time.</p>

<h2>Documents to request in business purchasing</h2>
<ol>
  <li><strong>Safety data sheet (SDS):</strong> the fragrance's hazard classification and storage, transport and first-aid information.</li>
  <li><strong>IFRA certificate of conformity:</strong> the categories and levels suitable for air fresheners and diffusers.</li>
  <li><strong>Allergen declaration:</strong> the list of allergenic fragrance materials in the mixture that must be declared.</li>
  <li><strong>Test reports:</strong> independent laboratory test reports, if any, and which product each report covers.</li>
</ol>

<h2>About the fragrances in our range</h2>
<p>The manufacturer states that its fragrances have been tested by SGS for compliance with IFRA standards. This is a manufacturer statement; you can request the test and compliance documents during the quote process. Our fragrance collection is being prepared; the scent range will appear on the site once it is confirmed.</p>
`,
    sources: [
      { label: 'IFRA. IFRA Code of Practice.', url: 'https://ifrafragrance.org/safe-use/code-of-practice-new' },
      { label: 'IFRA. IFRA Standards Library.', url: 'https://ifrafragrance.org/publications/guidanceReferenceDocument/ifra-code-of-practice' }
    ]
  },

  {
    slug: 'otel-icin-koku-secimi',
    title: 'Choosing scent for a hotel: scent families for the lobby, corridors and rooms',
    navTitle: 'Choosing scent for a hotel',
    description: 'Choosing scent families and devices for different areas of a hotel: practical advice for the lobby, corridors, rooms, spa and restaurant.',
    date: '2026-10-06',
    minutes: 5,
    image: 'images/general/video-hotel-poster.jpg',
    imagePos: '70% 50%',
    imageAlt: 'A glass-domed diffuser on a bedside table in a hotel room',
    tags: ['Hotels', 'Choosing a scent'],
    related: ['ck686', 'ck631', 'ck638', 'ck687'],
    body: `
<p class="lead">In hotels, scent is one of the first details a guest encounters. A well-planned scent strategy brings the different areas of a hotel together under one identity while keeping each area at an intensity suited to its use.</p>

<h2>One signature scent or different scents by area?</h2>
<p>Many hotels are known for a "signature scent" used in the lobby. Continuing it at a lower intensity in corridors and lifts helps guests experience the hotel as a whole. Areas such as the spa and restaurant are treated separately according to their function: in the restaurant, a very light scent that does not compete with the food, or none at all, is preferred.</p>

<h2>Recommendations by area</h2>
<div class="table-wrap">
<table>
  <caption>Area, scent family and device type</caption>
  <thead><tr><th scope="col">Area</th><th scope="col">Scent family</th><th scope="col">Device type</th></tr></thead>
  <tbody>
    <tr><td>Lobby and reception</td><td>Fresh tea, white flowers, light woods</td><td>Column or HVAC-connected (<a href="urun-ck686.html">ADS-687 column</a>, CK-631)</td></tr>
    <tr><td>Corridors and lifts</td><td>A lower-intensity continuation of the lobby scent</td><td>Ultrasonic wall model (CK-638)</td></tr>
    <tr><td>Rooms</td><td>Calm, powdery or lavender</td><td>Tabletop or reed diffuser</td></tr>
    <tr><td>Spa</td><td>Lavender, sage, woods</td><td>Wall model, low noise</td></tr>
    <tr><td>Restaurant</td><td>Very light or unscented</td><td>Only at the entrance if needed</td></tr>
  </tbody>
</table>
</div>

<h2>Choosing a scent family</h2>
<ul>
  <li><strong>Lobby:</strong> fresh, familiar notes such as green tea, white tea and white amber; they are unlikely to bother a wide audience.</li>
  <li><strong>Evenings and the bar:</strong> scents with a woody base such as bergamot, sandalwood or cedar.</li>
  <li><strong>Spa and rooms:</strong> calm notes such as lavender, chamomile, white musk or sage.</li>
</ul>
<p>Our fragrance collection is being prepared; the scent range will appear on the site once it is confirmed.</p>

<h2>Tips for putting it into practice</h2>
<ol>
  <li><strong>Try samples first.</strong> Test the scent in the real space with the device, not on a paper strip; the same scent is perceived differently in different volumes.</li>
  <li><strong>Ask the staff.</strong> The team who work in the same setting all day give valuable feedback on intensity.</li>
  <li><strong>Mount the device above eye level.</strong> Wall devices should be placed close to the airflow and at an accessible height.</li>
  <li><strong>Adjust by the hour.</strong> Intensity can be raised at busy check-in and check-out times and lowered at night.</li>
</ol>
<p>If you would like to prepare a scent plan for your hotel's areas together, you can <a href="iletisim.html?konu=numune">request a sample</a>.</p>
`,
    sources: []
  }
];
