// İngilizce belge sayfaları: Sürdürülebilirlik, SSS, Gizlilik (pages.mjs'in karşılığı; aynı bölüm kimlikleri).
// pages.mjs'te bir bölüm değişirse burayı da güncelleyin. Uzun tire kullanılmaz.

export const SUSTAINABILITY = {
  title: 'Sustainable Space Scenting | Meira',
  h1: 'Sustainable space scenting',
  crumb: 'Sustainability',
  description: 'Less fragrance, longer device life, the right refills and waste handling: product features and practical advice for reducing the environmental impact of scenting.',
  lead: 'The environmental impact of scenting depends largely on three things: how much fragrance is used, how long packaging and devices stay in use, and how batteries and devices are collected at the end of their life. This page brings together what the products offer on these points and what to watch for in practice.',
  sections: [
    {
      id: 'dogru-boyut',
      title: 'The right size, less fragrance',
      html: `<p>A device that is too powerful for the volume of a space uses more fragrance than needed; one that is too weak ends up running at its highest setting with the same result. The first step towards sustainable scenting is choosing a device whose coverage suits the air volume of the space.</p>
<p>The <a href="cozumler.html#hesaplayici" class="text-link">volume calculator</a> works out the volume from the floor area and ceiling height and lists the models that cover it, starting with the closest coverage.</p>`
    },
    {
      id: 'zamanlama',
      title: 'Run it only when needed',
      html: `<p>Most diffusers in the catalogue offer timed spraying; on app-enabled models the operating hours and spray and pause times are set from a phone. Running the device only while the space is open, and spraying in intervals rather than continuously, directly cuts fragrance use.</p>
<p>Intermittent operation also helps perception: people quickly get used to a scent they are constantly exposed to. More fragrance does not always mean more perception. More on this: <a href="blog-koku-yorgunlugu-ve-dogru-yogunluk.html" class="text-link">Scent fatigue and the right intensity</a>.</p>`
    },
    {
      id: 'dolum',
      title: 'Refills and packaging',
      html: `<p>Refill fragrances are supplied in bottles and larger containers, and as cartridges for the ultrasonic models. In large spaces and businesses with many devices, larger refill volumes usually mean less packaging for the same amount of fragrance. The devices are refillable; they are not a single-use cartridge system thrown away with the reservoir.</p>
<p>The list of refill fragrances will appear on the site once the fragrance collection is confirmed.</p>`
    },
    {
      id: 'omur',
      title: 'Long device life and maintenance',
      html: `<p>The most sustainable device is one that stays in use for a long time. On the ultrasonic wall models (CK-628, CK-638) the atomisation plate can be replaced; when it wears, only this part is renewed rather than the whole device. Regular cleaning and the right fragrance extend the life of nozzles and plates.</p>
<ul>
  <li>Use the device with the fragrance type recommended by the manufacturer.</li>
  <li>Empty the reservoir if the device will not be used for a long time.</li>
  <li>If it breaks down, ask for technical support before throwing it away: <a href="iletisim.html?konu=destek" class="text-link">technical support request</a>.</li>
</ul>`
    },
    {
      id: 'enerji',
      title: 'Energy and power supply',
      html: `<p>Professional diffusers run on little power. According to the manufacturer, the ultrasonic wall models (CK-628, CK-638, CK-648) draw 2 W. They can run on 4 AA batteries or a Type-C 6V supply; for continuous use a mains supply creates less waste than frequent battery changes. Some tabletop models (for example ADS-622) charge via Type-C.</p>`
    },
    {
      id: 'atik',
      title: 'Batteries and electronic waste',
      html: `<p>Batteries and electronic devices at the end of their life must not be thrown away with household waste.</p>
<ul>
  <li><strong>Waste batteries:</strong> in Türkiye, portable waste batteries are collected through the Portable Battery Manufacturers and Importers Association (TAP), authorised by the Ministry of Environment, Urbanisation and Climate Change. Used batteries can be left in TAP collection boxes at municipalities, schools and shops.</li>
  <li><strong>Electronic devices:</strong> waste electrical and electronic equipment falls under the Regulation on the Management of Waste Electrical and Electronic Equipment, published in the Official Gazette on 26 December 2022 and in force since 1 February 2023. Take these devices to municipal waste collection centres or authorised collection points.</li>
</ul>`
    },
    {
      id: 'ic-hava',
      title: 'Indoor air quality',
      html: `<p>Fragrance products contain volatile organic compounds (VOCs) that evaporate at room temperature. The US Environmental Protection Agency (EPA) lists air fresheners among indoor VOC sources and recommends increasing ventilation and following the directions for use when using products that emit VOCs. In space scenting this means not using more scent than needed and making sure the ventilation of the space is working.</p>`
    },
    {
      id: 'esans',
      title: 'Fragrance content',
      html: `<p>According to the manufacturer, its fragrances are made from natural plant extracts free of allergens, toxins and carcinogens; raw materials are sourced from the USA and France and compliance with IFRA standards has been tested by SGS. These are manufacturer statements; you can request the safety data sheet (SDS) and compliance documents during the quote process. We explain what IFRA is in <a href="blog-ifra-standartlari-nedir.html" class="text-link">this article</a>.</p>`
    },
    {
      id: 'olculmeyen',
      title: 'What this page does not cover',
      html: `<p>This page gives no figures for the carbon footprint of the products, their recycled material content or the recyclability of their packaging. This information will be added once it is received from the manufacturer as verified data.</p>`
    }
  ],
  sources: [
    { label: 'U.S. EPA. Volatile Organic Compounds\' Impact on Indoor Air Quality.', url: 'https://www.epa.gov/indoor-air-quality-iaq/volatile-organic-compounds-impact-indoor-air-quality' },
    { label: 'Regulation on the Management of Waste Electrical and Electronic Equipment, Official Gazette of Türkiye, 26.12.2022, No. 32055.' },
    { label: 'TAP: Portable Battery Manufacturers and Importers Association, waste battery collection.' },
    { label: 'Product technical data: the manufacturer\'s 2025 product catalogue.' }
  ]
};

export const FAQ = {
  title: 'Frequently Asked Questions: Scent Diffusers and Quotes | Meira',
  h1: 'Frequently asked questions',
  description: 'Frequently asked questions about the quote process, choosing a device, coverage, HVAC connection, noise, samples, OEM and fragrance safety.',
  lead: 'Here are the most common questions about choosing a product, the quote process and everyday use. If you don\'t find your answer, write to us through the quote form.',
  groups: [
    {
      title: 'Quotes and purchasing',
      items: [
        ['Can I buy online?', 'No. Products are sold through business quotes; there are no prices, payments or accounts on the site. Add the products you are interested in to the quote list and request a quote with a single form.'],
        ['How do I request a quote?', 'Build your quote list with the "Add to list" button next to products in the catalogue. Open the list with the "Quote list" button at the top right and choose "Transfer to quote form"; products and quantities are added to the message automatically. If you also describe the size and use of the space, the quote is prepared accordingly.'],
        ['Can I get samples?', 'Our fragrance collection is being prepared. For a scent sample, choose "Price and samples" in the quote form and describe your space and the character of scent you are looking for; sample terms are given with the quote.'],
        ['Can I have products made with my own brand\'s logo?', 'The manufacturer states that it offers private-label production (OEM) and joint product development (ODM): logo printing on the device body, colour choice, custom packaging and a fragrance formula made for your brand. We pass your request to the manufacturer and follow the process on your behalf. Minimum order and lead times are given per request.']
      ]
    },
    {
      title: 'Choosing a device',
      items: [
        ['Which device suits my space?', 'The first criterion is volume: floor area x ceiling height. Choose a model whose coverage meets that volume. The volume calculator (Solutions page) does this calculation and lists suitable models. Partitioned spaces, strong ventilation and heavy visitor traffic may need more than one unit.'],
        ['Why is coverage given in m³ rather than m²?', 'Scent fills a volume of air, not a floor. Of two spaces with the same floor area, the one with the higher ceiling has a larger volume and needs a stronger device. For a few tabletop models the manufacturer gives coverage in m²; this is stated on their product pages.'],
        ['What is the difference between ultrasonic and dual-fluid devices?', 'Ultrasonic devices turn fragrance into mist with a vibrating plate; they are very quiet and suit small spaces. Dual-fluid (compressed air) devices break the fragrance into very fine particles with an air stream; they cover larger spaces and some models connect to the HVAC system.'],
        ['How loud are the devices?', 'According to the manufacturer, the ultrasonic wall models (CK-628, CK-638, CK-648) run below 8 dBA. Dual-fluid and professional models range from about 35 to 42 dB depending on the model. Each model\'s value is on its own product page.'],
        ['Which models can be connected to the HVAC system?', 'According to the manufacturer, CK-631, ADS-620B / 640B / 670B, CK-611 / 612 / 613 and CK-621 / 622 / 623 support HVAC connection, and the ADS-687 column diffuser supports connection to fresh-air systems. The connection point depends on the building\'s mechanical installation.']
      ]
    },
    {
      title: 'Use and fragrances',
      items: [
        ['How often do I need to refill?', 'Refill frequency depends on the reservoir capacity, operating hours, spray and pause times and the chosen intensity. Larger reservoirs and timed operation reduce how often you refill. We can estimate consumption together for your usage plan during the quote.'],
        ['Why does the scent seem to fade during the day?', 'People quickly get used to a scent they are constantly exposed to. Those who spend a long time in the space notice it less, while someone arriving notices it clearly. Before increasing the intensity, ask someone who has just come in.'],
        ['Are the fragrances safe?', 'According to the manufacturer, its fragrances have been tested by SGS for compliance with IFRA standards. You can request the safety data sheet (SDS) and compliance documents during the quote process. We recommend not setting the intensity higher than needed and making sure the space is ventilated.'],
        ['How are wall-mounted devices installed?', 'According to the manufacturer, the CK-628, CK-638 and CK-688 wall models mount with adhesive in about 3 seconds, without drilling. The plug-in CK-644 and CK-645 need no drilling. The mounting method of other models is confirmed during the quote.']
      ]
    },
    {
      title: 'Company',
      items: [
        ['Who makes the products?', 'The products are developed and made by Andusic (Dongguan Andusic Technology Co. Ltd.), founded in Dongguan, China, in 2018. Meira is the Turkish distributor of Dongguan Andusic Technology Co. Ltd. products and handles product selection, quotes and supply for projects in Türkiye.'],
        ['Where does the technical data come from?', 'The technical data on the product pages comes from the manufacturer\'s 2025 product catalogue. Values may vary by model and variant; exact details are confirmed during the quote.']
      ]
    }
  ]
};

// Gizlilik metninin İngilizce çevirisi (bilgilendirme amaçlıdır; KVKK kapsamında esas metin Türkçedir).
export const PRIVACY = {
  title: 'Privacy Notice | Meira',
  h1: 'Privacy notice',
  crumb: 'Privacy',
  description: 'How data from the quote and contact form is processed, who it may be shared with, how long it is kept and your rights under Turkish law (KVKK).',
  updated: '2026-10-15',
  lead: 'This notice explains how the personal data you share through the quote and contact form on our website is processed under Turkish Personal Data Protection Law No. 6698 (KVKK), and what the site stores in your browser. The Turkish version of this notice is the governing text.',
  sections: [
    {
      id: 'veri-sorumlusu',
      title: 'Data controller',
      html: `<p>Your personal data is processed by the company below as data controller.</p>
<dl class="legal-facts">
  <div><dt>Trade name</dt><dd>To be added before launch</dd></div>
  <div><dt>MERSIS number</dt><dd>To be added before launch</dd></div>
  <div><dt>Address</dt><dd><span data-site="city">Istanbul, Türkiye</span> (full address to be added before launch)</dd></div>
  <div><dt>Email</dt><dd><a href="mailto:info@meirascent.com" data-site-href="email"><span data-site="email">info@meirascent.com</span></a></dd></div>
  <div><dt>Registered electronic mail (KEP)</dt><dd>To be added before launch</dd></div>
</dl>`
    },
    {
      id: 'islenen-veriler',
      title: 'Personal data processed',
      html: `<p>When you fill in the quote and contact form, only the information you share in the form is processed:</p>
<ul>
  <li><strong>Identity:</strong> first and last name.</li>
  <li><strong>Contact:</strong> email address, phone number (optional).</li>
  <li><strong>Customer transaction:</strong> organisation or company name, subject, message, the products and quantities in your quote list and, if you share them, project details (type of space, floor area, ceiling height, additional requests).</li>
  <li><strong>Transaction security:</strong> the IP address and time the request was sent (to prevent misuse).</li>
</ul>
<p>The form does not ask for special categories of personal data (health, beliefs and so on); please do not share such information in the message field.</p>
<p>If you only browse the site, no personal data is requested from you and your visit is not tracked. As on any website, the hosting provider's servers may keep technical connection logs such as IP address and access time for security and under obligations arising from Law No. 5651.</p>`
    },
    {
      id: 'amaclar',
      title: 'Purposes and legal grounds',
      html: `<p>Your personal data is processed to:</p>
<ul>
  <li>assess your quote request and prepare a quote with price and delivery details,</li>
  <li>contact you about your request, sample, OEM / ODM or technical support enquiry,</li>
  <li>prevent misuse of the form and unwanted submissions.</li>
</ul>
<p>Your personal data is collected electronically when you fill in the quote and contact form. This processing is based on Article 5(2) of KVKK: under point (c), it is directly related to the conclusion of a contract (the quote process), and under point (f), the legitimate interest of the data controller (information security).</p>
<p>The “I have read and understood the Privacy Notice” box in the form only confirms that you have read this notice; it is not a declaration of explicit consent. Your data is not processed on the basis of explicit consent.</p>
<p>Your contact details are used only for correspondence about your request. We do not send you commercial electronic messages (advertising or campaigns) without your consent (Law No. 6563).</p>`
    },
    {
      id: 'aktarim',
      title: 'Transfers',
      html: `<p>Your personal data may be shared only for the purposes above and only as far as necessary:</p>
<ul>
  <li><strong>Service providers:</strong> companies that provide the website's hosting and email services (so that your request reaches us and is stored).</li>
  <li><strong>Manufacturer:</strong> for private-label (OEM / ODM) or product-specific technical requests, as a rule only the technical details of the request are shared with the manufacturer. If your personal data needs to be passed to the manufacturer abroad (China), the transfer is made occasionally and only as far as it is necessary to take pre-contractual steps at your request, under Article 9(6)(b) of KVKK.</li>
  <li><strong>Authorities:</strong> competent public institutions where there is a legal obligation.</li>
</ul>
<p>Your personal data is not sold and is not shared with third parties for marketing.</p>`
    },
    {
      id: 'saklama',
      title: 'Retention',
      html: `<p>Your personal data is kept for as long as the purpose of processing requires and for the periods set by the relevant legislation:</p>
<ul>
  <li><strong>Quote and contact correspondence:</strong> until your request is concluded; at most 2 years if no business relationship follows.</li>
  <li><strong>If a business relationship follows:</strong> correspondence supporting quotes, orders and invoices, for 10 years under Article 82 of the Turkish Commercial Code.</li>
  <li><strong>Form log file:</strong> a summary of each submission (name, email, phone, company, subject and time) for at most 2 years.</li>
  <li><strong>Rate-limit record:</strong> to prevent many submissions in a short time, an irreversible hash of your IP address (not the address itself) is kept for 10 minutes.</li>
</ul>
<p>At the end of these periods your data is deleted, destroyed or anonymised.</p>`
    },
    {
      id: 'haklar',
      title: 'Your rights',
      html: `<p>Under Article 11 of KVKK you have the right to apply to the data controller to:</p>
<ul>
  <li>learn whether your personal data is processed and, if so, request information about it,</li>
  <li>learn the purpose of processing and whether it is used for that purpose,</li>
  <li>know the third parties in Türkiye or abroad to whom it is transferred,</li>
  <li>request correction if it is incomplete or inaccurate, request deletion or destruction under the conditions in Article 7 of KVKK, and request that these actions be notified to third parties to whom it was transferred,</li>
  <li>object to a result against you arising from analysis exclusively by automated systems,</li>
  <li>claim compensation if you suffer damage because of unlawful processing.</li>
</ul>`
    },
    {
      id: 'basvuru',
      title: 'How to apply',
      html: `<p>You can send requests about your rights by email to <a href="mailto:info@meirascent.com" data-site-href="email"><span data-site="email">info@meirascent.com</span></a> or in writing, together with information that verifies your identity, in line with the Communiqué on the Procedures and Principles of Application to the Data Controller. Applications are concluded within 30 days at the latest.</p>`
    },
    {
      id: 'cerezler',
      title: 'Cookies and browser storage',
      html: `<p>This site does not use cookies. It contains no visitor tracking, advertising or analytics tools and no third-party content (external fonts, maps, videos or social media plugins); all of the site's files are served from our own server.</p>
<p>So that the site works, only the following is kept in your browser's local storage. Apart from the quote list, none of it is sent to our server, and the quote list is sent only as part of the message when you submit the form:</p>
<ul>
  <li><strong><code>dc_quote_cart_v2</code></strong> (<code>localStorage</code>): the products and quantities you add to the quote list; until you clear the list or send your request.</li>
  <li><strong><code>meira-theme</code></strong> (<code>localStorage</code>): your light or dark theme choice; until you delete it.</li>
  <li><strong><code>meira-notice</code></strong> (<code>localStorage</code>): that you closed the cookie notice, so it is not shown again; until you delete it.</li>
  <li><strong><code>meira-visited</code></strong> (<code>sessionStorage</code>): that the home page opening animation has been shown in this session; deleted when the browser tab is closed.</li>
</ul>
<p>This information is not used to identify or track you. It is strictly necessary for a feature you use (the quote list, the theme choice) and therefore does not require your consent. You can delete it at any time by clearing your browser's site data.</p>`
    }
  ]
};
