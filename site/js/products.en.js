/* İngilizce ürün metinleri. Yalnızca /en/ sayfalarında, products.js'ten sonra yüklenir ve aynı kayıtların
 * Türkçe metin alanlarının üzerine yazar (görsel, galeri, bayraklar ve kimlikler products.js'te kalır).
 * products.js'te bir ürünün özellik, varyant ya da teknik verisi değişirse burayı da aynı sırayla güncelleyin.
 * Teknik veri etiketleri betiklerde iki dilli kalıplarla aranır (coverage, capacity, noise, power supply,
 * voltage); bu sözcükleri etiketlerde koruyun. Sayılar İngilizce biçimde yazılır (2,000-5,000 m³). */
(function () {
  const USE_COMMERCIAL = 'Entertainment venues, hotel lobbies, bars, meeting rooms, showrooms, beauty salons, restaurants, galleries, hotel corridors, chain stores, cinemas';
  const USE_SMALL = 'Hotel rooms, bathrooms, beauty salons, living rooms, offices, lifts, corridors and stairwells, pet areas';

  const CATEGORIES_EN = {
    all: 'All products',
    wall: 'Wall-mounted diffusers',
    pro: 'Professional & HVAC-connected',
    plug: 'Plug-in & passive',
    home: 'Tabletop & portable'
  };

  const EN = {
    ck628: {
      badge: 'Smart remote',
      title: 'Ultrasonic Smart Wall Diffuser',
      short: 'Ultrasonic diffuser with optional LED light sensor, LCD display and smart remote; 300 m³ coverage.',
      desc: 'Ultrasonic atomisation spreads the scent quickly and evenly. Runs on 4 AA batteries or Type-C 6V; available with a smart remote, LED light sensing or an LCD display. Made of heat-resistant PP; according to the manufacturer, the material is food-grade, odourless and non-toxic and compliant with international safety standards and FDA. Mounts in 3 seconds with an adhesive pad that leaves no marks.',
      features: ['Ultrasonic atomisation', 'Remote / manual control', 'Low noise (<8 dBA)', 'Battery or Type-C power', 'Tabletop and wall use', 'Timed spraying', 'Replaceable ultrasonic plate'],
      variants: ['CK-628A (White)', 'CK-628B (Black)', 'Smart remote: CK-628-YK', 'LED light sensing: CK-628-LED', 'LCD display: CK-628-LCD'],
      specs: [['Size', '66 × 56 × 212 mm'], ['Colour', 'White / Black'], ['Material', 'PP (food grade)'], ['Voltage / Power', 'DC 6V / 2W'], ['Noise level', '< 8 dBA'], ['Fragrance capacity', '168 ml'], ['Coverage', '300 m³'], ['Power supply', '4 × AA batteries / Type-C 6V'], ['Net weight', '223 g'], ['Carton', '50 pcs · 493×395×380 mm · 14.8 kg gross']],
      use: USE_SMALL
    },
    ck629: {
      title: '300 ml Ultrasonic Smart Diffuser',
      short: 'Bluetooth app-controlled ultrasonic diffuser with a 300 ml reservoir; 300-800 m³ coverage.',
      desc: 'Turns fragrance into a fine mist by ultrasonic atomisation and is managed from a Bluetooth mobile app. The PP-bodied unit draws 2 W at DC 6V, runs at ≤35 dB and scents 300-800 m³ from its 300 ml reservoir. Available in white and black.',
      features: ['Ultrasonic atomisation', 'Bluetooth app control', 'Low noise (≤35 dB)', '300 ml fragrance reservoir'],
      variants: ['CK-629A-APP (White)', 'CK-629B-APP (Black)'],
      specs: [['Size', '175 × 65 × 290 mm'], ['Colour', 'White / Black'], ['Material', 'PP'], ['Voltage / Power', 'DC 6V / 2W'], ['Noise level', '≤ 35 dB'], ['Fragrance capacity', '300 ml'], ['Coverage', '300-800 m³'], ['Control', 'Bluetooth app'], ['Installation', 'Tabletop']],
      use: USE_SMALL
    },
    ck638: {
      title: 'Ultrasonic Wall Diffuser - LED / LCD',
      short: 'Corrosion-resistant PP body with LED sensor and LCD control panel; 300 m³ coverage.',
      desc: 'CK-638 spreads scent quickly by ultrasonic atomisation and comes with a smart remote, LED light sensing and an LCD control panel. According to the manufacturer, its food-grade, corrosion-resistant PP is FDA compliant. Installs in 3 seconds with an adhesive pad that leaves no marks.',
      features: ['Ultrasonic atomisation', 'Remote / manual control', 'Low noise', 'Battery or Type-C power', 'Tabletop and wall use', 'Timed spraying', 'Replaceable ultrasonic plate'],
      variants: ['CK-638A', 'CK-638B', 'Smart remote: CK-638-YK', 'LED: CK-638-LED', 'LCD: CK-638-LCD'],
      specs: [['Size', '85 × 65 × 180 mm'], ['Colour', 'White / Black'], ['Material', 'PP (food grade)'], ['Voltage / Power', 'DC 6V / 2W'], ['Noise level', '< 8 dBA'], ['Fragrance capacity', '168 ml'], ['Coverage', '300 m³'], ['Power supply', '4 × AA batteries / Type-C 6V'], ['Net weight', '255 g'], ['Carton', '50 pcs · 493×395×380 mm · 14.8 kg gross']],
      use: USE_SMALL
    },
    ck648: {
      title: 'Ultrasonic Wall Diffuser - 3 Colours',
      short: 'Compact diffuser in white, black and a third colour; also suited to entertainment venues.',
      desc: 'Portable design for easy use. Available with a smart remote, LED light sensing or an LCD display. The body is heat-resistant PP; according to the manufacturer, it is food-grade, odourless, non-toxic and FDA compliant.',
      features: ['Ultrasonic atomisation', 'Remote / manual control', 'Low noise', 'Battery or Type-C power', 'Tabletop and wall use', 'Timed spraying'],
      variants: ['CK-648A', 'CK-648B', 'CK-648C', 'Smart remote: CK-648-YK', 'LED: CK-648-LED', 'LCD: CK-648-LCD'],
      specs: [['Size', '85 × 65 × 180 mm'], ['Colour', 'White / Black / Black (alternative)'], ['Material', 'PP (food grade)'], ['Voltage / Power', 'DC 6V / 2W'], ['Noise level', '< 8 dBA'], ['Fragrance capacity', '168 ml'], ['Coverage', '300 m³'], ['Power supply', '4 × AA batteries / Type-C 6V'], ['Net weight', '255 g'], ['Carton', '50 pcs · 493×395×380 mm · 14.4 kg gross']],
      use: 'Entertainment venues, hotel rooms, bathrooms, beauty salons, living rooms, offices, lifts, corridors and stairwells, pet areas'
    },
    ck688: {
      badge: 'Ultra slim',
      title: 'Dual-Fluid Large Area Diffuser',
      short: '500 ml capacity, ultra-slim 5.3 cm body and app control; 800 m³ coverage.',
      desc: 'Dual-fluid atomisation for fast, even scent distribution. Runs on 4 AA batteries (Type-C 6V) and is managed by smart remote and mobile app. According to the manufacturer, its food-grade, heat- and corrosion-resistant PP is FDA compliant. Mounts in 3 seconds without residue.',
      features: ['Dual-fluid atomisation', 'Remote / mobile app', 'Low noise', 'Battery or mains power', 'Seamless wall mounting', 'Timed spraying', 'Only 5.3 cm deep'],
      variants: ['CK-688A (White)', 'CK-688B (Black)'],
      specs: [['Size', '168 × 53 × 240 mm'], ['Colour', 'White / Black'], ['Material', 'PP (food grade)'], ['Voltage / Power', 'DC 6V / 2W'], ['Noise level', '< 36 dB'], ['Fragrance capacity', '500 ml'], ['Coverage', '800 m³'], ['Power supply', '4 × AA batteries / Type-C 6V'], ['Net weight', '618 g'], ['Carton', '32 pcs · 480×360×600 mm · 24.5 kg gross']],
      use: USE_COMMERCIAL
    },
    ck689: {
      title: 'Dual-Fluid Ultra-Slim Diffuser',
      short: 'Quiet (≤35 dB) slim diffuser with 500 ml capacity and 600-800 m³ coverage, managed by Bluetooth app or wireless remote.',
      desc: 'Dual-fluid atomisation spreads scent quickly and evenly. Two versions are available: Bluetooth app (ADS-689B) and wireless remote (ADS-689-YK). The ABS and PP body is heat resistant; according to the manufacturer, it is odourless, non-toxic and FDA compliant. Suitable for spaces of 600-800 m³.',
      features: ['Dual-fluid atomisation', 'Bluetooth app or wireless remote', 'Low noise (≤35 dB)', 'Battery or mains power', 'Timed spraying', 'Custom design'],
      variants: ['ADS-689B · Bluetooth app (White / Black)', 'ADS-689-YK · Wireless remote (White / Black)'],
      specs: [['Size', '168 × 53.8 × 240 mm'], ['Colour', 'White / Black (optional)'], ['Material', 'ABS + PP'], ['Voltage / Power', 'DC 6V / 2W'], ['Noise level', '≤ 35 dB'], ['Fragrance capacity', '500 ml'], ['Coverage', '600-800 m³'], ['Control', 'Bluetooth app (ADS-689B) / wireless remote (ADS-689-YK)'], ['Installation', 'Tabletop'], ['Power supply', '4 × AA batteries / Type-C 6V'], ['Net weight', '536 g'], ['Carton', '32 pcs · 480×360×600 mm · 21.6 kg gross']],
      use: USE_COMMERCIAL
    },
    ck687: {
      title: 'Compact Dual-Fluid Diffuser',
      short: 'Compact diffuser with 150 ml capacity, renewed display panel and Bluetooth app control; 300-600 m³ coverage.',
      desc: 'Dual-fluid atomisation for fast, even scent distribution. Easy to use with a Bluetooth mobile app and a renewed display panel. Food-grade, heat-resistant PP body; compliant with international standards including FDA, according to the manufacturer.',
      videos: [{ title: 'From set-up to a weekly schedule', teaser: 'Watch step by step how the unit is prepared and how to set a weekly schedule in the app.', summary: 'The batteries and the fragrance bottle are fitted. The display buttons and how to create a weekly schedule in the phone app are explained step by step. The last part shows the unit plugged in on a table.' }],
      features: ['Dual-fluid atomisation', 'Bluetooth app control', 'Renewed display panel', 'Low noise (≤35 dB)', 'Timed spraying'],
      variants: ['ADS-686A (White)', 'ADS-686B (Black)'],
      specs: [['Size', '148 × 67 × 185 mm'], ['Colour', 'White / Black'], ['Material', 'PP'], ['Voltage / Power', 'DC 6V / 2W'], ['Noise level', '≤ 35 dB'], ['Fragrance capacity', '150 ml'], ['Coverage', '300-600 m³'], ['Control', 'Bluetooth app, renewed display panel'], ['Installation', 'Tabletop'], ['Net weight', '512 g'], ['Carton', '30 pcs · 465×385×490 mm · 19 kg gross']],
      use: USE_COMMERCIAL
    },
    ck631: {
      badge: 'Professional',
      title: 'Air-Pump HVAC-Connected Diffuser',
      short: 'Built-in air pump, 800 ml capacity and 3,500 m³ coverage; Bluetooth / WiFi control.',
      desc: 'An innovative diffuser with a built-in air pump that can be integrated into HVAC systems. Operating hours and scent intensity are set precisely from a phone. Offers infrared oil-level sensing and cold-air diffusion. Food-grade PP; FDA compliant according to the manufacturer.',
      features: ['Bluetooth / WiFi remote control', 'Very strong atomisation', 'Built-in air pump', '24-hour smart timer', 'HVAC connection', 'Infrared oil-level sensing', 'Cold-air diffusion'],
      variants: ['CK-631A (White)', 'CK-631B (Black)'],
      specs: [['Size', '265 × 115 × 252 mm'], ['Colour', 'White / Black'], ['Material', 'PP (food grade)'], ['Voltage / Power', 'DC 12V / 12W'], ['Noise level', '< 42 dBA'], ['Fragrance capacity', '800 ml'], ['Coverage', '3,500 m³'], ['Power input', 'Type-C'], ['Carton', '36 pcs · 480×360×600 mm']],
      use: USE_COMMERCIAL
    },
    ck620: {
      badge: 'Series',
      title: 'High-Output Mist Diffuser Series',
      short: '1000 ml capacity, 2,000-12,000 m³ coverage; floor-standing metal body that connects to the HVAC system.',
      desc: 'High mist-volume technology that works within seconds. Stands on the floor and can be connected to the central air-conditioning (HVAC) system. Very quiet operation (≤35 dB); plug-in atomiser head and magnetic lock for easy maintenance.',
      features: ['Super atomisation', 'Low noise (≤35 dB)', 'Floor standing', '1000 ml reservoir', 'HVAC connection', 'Metal body'],
      variants: ['ADS-620B · 328×128×372 mm · 12W · 2,000-5,000 m³ · 25,000 TL (incl. VAT)', 'ADS-640B · 428×128×372 mm · 15W · 4,000-8,000 m³ · 30,000 TL (incl. VAT)', 'ADS-670B · 428×128×372 mm · 18W · 7,000-12,000 m³ · 50,000 TL (incl. VAT)'],
      specs: [['Size', '328 / 428 / 428 × 128 × 372 mm'], ['Colour', 'Black'], ['Material', 'Metal'], ['Voltage', 'DC 12V'], ['Power', '12W / 15W / 18W'], ['Noise level', '≤ 35 dB'], ['Fragrance capacity', '1000 ml'], ['Coverage', '2,000-5,000 / 4,000-8,000 / 7,000-12,000 m³'], ['Installation', 'Floor; connects to the HVAC system'], ['Carton', '1 pc']],
      use: USE_COMMERCIAL
    },
    ck686: {
      badge: 'Column',
      title: 'Nano Atomisation Column Diffuser',
      short: 'Free-standing aluminium column; 1000 ml capacity and 4,000 m³ coverage.',
      desc: 'A free-standing commercial column diffuser that makes a design statement with its stone-textured atomiser head. Plug-in atomiser for easy oil changes and a magnetic lock. A 1000 ml reservoir and nano mist technology for 4,000 m³; connects to fresh-air systems.',
      videos: [{ title: 'Design details and mist output', teaser: 'See the aluminium body, the fragrance change and the dense mist output up close.', summary: 'The details of the aluminium body, the removable atomiser head and changing the fragrance bottle are shown up close. Then the dense and steady mist output of the unit is shown.' }],
      features: ['Nano atomisation', 'Low noise (≤35 dB)', 'Mains power (DC 12V)', 'Connects to fresh-air systems', '1000 ml reservoir'],
      variants: ['ADS-687A (White)', 'ADS-687B (Black)'],
      specs: [['Size', '575 × 115 × 160 mm'], ['Colour', 'White / Black'], ['Material', 'Aluminium alloy'], ['Voltage / Power', 'DC 12V / 12W'], ['Noise level', '≤ 35 dB'], ['Fragrance capacity', '1000 ml'], ['Coverage', '4,000 m³'], ['Installation', 'Floor (free standing)']],
      use: USE_COMMERCIAL + ', sales floors'
    },
    ck683: {
      badge: 'Battery',
      title: 'Compact Aluminium Dual-Fluid Diffuser',
      short: '5000 mAh built-in battery, Bluetooth control and 300 m³ coverage.',
      desc: 'Its ultra-compact design lowers shipping costs. Uninterrupted operation from a 5000 mAh battery and 300 m³ coverage. Settings are managed easily via built-in Bluetooth; Type-C input and waterproof touch control.',
      banners: [
        'Black diffuser and phone app on a coffee table in a modern living room; hotel atmosphere at home',
        'Diffuser in a study with bookshelves; uses at home, hotels, malls, cafés, canteens and offices',
        'Black diffuser and its features: 5000 mAh battery, aluminium body, timed spraying, app and remote control',
        'Diffuser running in a living room; three control methods: Bluetooth app, remote and button',
        'Diffuser on a coffee table; seven-colour base light, timer and three intensity levels',
        'Diffuser on a desk; 5000 mAh built-in battery and Type-C charging port',
        'Diffuser running in the middle of a flat cross-section; coverage illustration',
        'Diffuser running on a café counter',
        'Diffuser running on a bedside table in a bedroom',
        'Diffuser running on a coffee table in a living room with a family and a dog',
        'Diffuser on a bedside table and the manufacturer\'s product parameter table'
      ],
      videos: [{ title: 'Unplugged, anywhere', teaser: 'See the cordless use, the fragrance change in seconds and the tilt sensor up close.', summary: 'The unit, which runs without a cable thanks to its built-in battery, is taken out of the box. Changing the fragrance bottle in a few seconds, the safety sensor that stops it when tipped over, and the settings made with the remote and the phone app are shown.' }],
      features: ['Dual-fluid atomisation', 'Bluetooth app control', 'Low noise', 'Built-in battery', 'Type-C port', 'Waterproof touch control'],
      variants: ['Bronze', 'Black', 'Brown', 'Green'],
      specs: [['Size', 'Ø92 × 305 mm'], ['Colour', 'Bronze / Black / Brown / Green'], ['Material', 'Aluminium alloy'], ['Voltage / Power', 'DC5V-2A (Type-C) / 8W'], ['Battery', '5000 mAh'], ['Noise level', '≤ 38 dB'], ['Fragrance capacity', '110 ml'], ['Coverage', '300 m³'], ['Net weight', '0.82 kg']],
      use: USE_COMMERCIAL + ', sales floors'
    },
    ck644: {
      badge: 'Plug-in',
      title: 'Smart Bluetooth Plug-in Diffuser',
      short: 'Bluetooth diffuser that plugs into the socket on the wall; 100 ml capacity, 100-300 m³ coverage.',
      desc: 'Lightweight PP body and plug-and-play design for instant use. It plugs into a wall socket and offers 3 plug options to fit different sockets without drilling. Managed from a Bluetooth mobile app.',
      videos: [
        { label: 'Black', title: 'Plug it in, manage it from the app', teaser: 'Watch the app settings and night mode of a unit that starts working as soon as it is plugged in.', summary: 'Changing the fragrance bottle, plugging the unit in and setting operating hours in the phone app are shown. Up to five different schedules can be defined in the app. The video ends with the night mode for dark rooms.' },
        { label: 'White', title: 'Plug it in, manage it from the app', teaser: 'Watch the app settings and night mode of a unit that starts working as soon as it is plugged in.', summary: 'Changing the fragrance bottle, plugging the unit in and setting operating hours in the phone app are shown. Up to five different schedules can be defined in the app. The video ends with the night mode for dark rooms.' }
      ],
      features: ['Dual-fluid atomisation', 'Bluetooth app control', 'Low noise (≤35 dB)', 'Plug and play', 'Does not mark the wall'],
      variants: ['CK-644A (White)', 'CK-644B (Black)', 'Two-pin / European two round-pin / three-pin plug'],
      specs: [['Size', '150 × 73 × 235 mm'], ['Colour', 'White / Black'], ['Material', 'PP'], ['Voltage / Power', 'DC 6V / 5W'], ['Noise level', '≤ 35 dB'], ['Fragrance capacity', '100 ml'], ['Coverage', '100-300 m³'], ['Control', 'Bluetooth app'], ['Installation', 'Wall (plugs into the socket)']],
      use: 'Homes, bathrooms, lifts, corridors'
    },
    ck645: {
      badge: 'Plug-in',
      title: 'Slim Smart Plug-in Diffuser',
      short: '100 ml capacity, Bluetooth or smart mode, 3 plug options.',
      desc: 'A lightweight, well-designed Bluetooth diffuser with a PP body. Plugs into various sockets without drilling. Two options: Bluetooth version and smart version (24-hour mode or light sensing).',
      features: ['Dual-fluid atomisation', 'Bluetooth / manual control', 'Low noise', 'Plug and play', 'Does not mark the wall', '24-hour mode'],
      variants: ['CK-645A (White)', 'CK-645B (Black)'],
      specs: [['Size', '70 × 61 × 270 mm'], ['Colour', 'White / Black'], ['Material', 'PP'], ['Voltage / Power', '100-240V / 2.5W'], ['Noise level', '< 38 dB'], ['Capacity', '100 ml'], ['Coverage', '300 m³'], ['Carton', '6 pcs']],
      use: 'Homes, bathrooms, lifts, corridors'
    },
    ck608d: {
      badge: 'Car & home',
      title: 'Portable Car and Home Diffuser - Rose Gold',
      short: 'Beige or rose gold diffuser with a 2000 mAh battery and 5-20 ml fragrance capacity.',
      desc: 'Compact and stylish, for use at home and in the car. Its 2000 mAh battery allows long use.',
      features: ['Ultrasonic atomisation', 'One-touch control', 'Low noise'],
      variants: ['Beige', 'Rose Gold'],
      specs: [['Size', '71 × 138 mm'], ['Colour', 'Beige / Rose Gold'], ['Material', 'ABS'], ['Power', 'DC5V-0.5A / 2.5W'], ['Battery', '2000 mAh'], ['Fragrance capacity', '5 - 20 ml'], ['Coverage', '100 m³'], ['Carton', '60 pcs']],
      use: 'Bedrooms, studies, living rooms, cars'
    },
    ads622: {
      badge: 'Decorative',
      title: 'Solid Wood Base Aroma Diffuser',
      short: 'Glass body, solid wood base and 7-colour night light; Type-C charging.',
      desc: 'Low-noise design with a timer; Type-C charging, safe materials, a solid wood base and a colourful night light. Can be powered from a phone charger, a power bank or a laptop.',
      features: ['Low noise, timer', 'Type-C charging', 'Safe materials', 'Solid wood base', 'Colourful night light'],
      specs: [['Size', '105 × 105 × 150 mm'], ['Material', 'Solid wood + glass'], ['Light', '7-colour cycle + steady light'], ['Power / Voltage', '5W / DC5V-1A'], ['Battery', '2000 mAh'], ['Weight', '375 g'], ['Coverage', '50 m²']],
      use: 'Bedrooms, studies, living rooms'
    },
    ads611: {
      badge: 'Decorative',
      title: 'Hourglass Aroma Diffuser',
      short: 'Glass and solid wood, 7-colour light, 3 colour options (A/B/C).',
      desc: 'A compact decorative aroma diffuser with a solid wood base, colourful night light and Type-C charging. Low noise, with a timer.',
      features: ['Low noise, timer', 'Type-C charging', 'Safe materials', 'Solid wood base', 'Colourful night light'],
      specs: [['Size', '78 × 78 × 150 mm'], ['Material', 'Solid wood + glass'], ['Light', '7-colour cycle + steady light'], ['Power / Voltage', '5W / DC5V-1A'], ['Battery', '2000 mAh'], ['Weight', '300 g'], ['Coverage', '50 m²']],
      use: 'Bedrooms, studies, living rooms'
    },
  };

  // Esanslar: koku aileleri ve esans metinleri (kimlik, kod, renk, hareket ve görsel products.js'te kalır).
  // Notalar Türkçe piramit görsellerinden çevrilmiştir; esans adları (çeviri gerekenler dışında) aynı kalır.
  const FAMILIES_EN = {
    non: { label: 'Non-allergen', text: 'Fragrances formulated, according to the manufacturer, without allergens. They leave a clean, soft and balanced scent in busy indoor spaces where sensitive people spend time.', spaces: ['Hotel rooms and lobbies', 'Clinics and waiting areas', 'Offices', 'Spas'] },
    ntr: { label: 'Neutraliser', text: 'Fragrances designed to neutralise bad odours rather than simply mask them. They leave the air feeling freshly cleaned where odour is a problem.', spaces: ['Toilets and washrooms', 'Car parks and lifts', 'Kitchens and waste areas', 'Smoking areas'] },
    prf: { label: 'Perfume', text: 'Layered, signature scents with the character of a fine perfume. They leave a memorable trace in spaces where a brand tells its story.', spaces: ['Shops and showrooms', 'Hotel lobbies', 'Boutiques'] },
    cic: { label: 'Floral', text: 'The elegant world of white flowers and green leaves: bright, soft and inviting.', spaces: ['Boutiques', 'Spas', 'Reception areas'] },
    ory: { label: 'Oriental', text: 'Deep, enveloping scents built on amber, vanilla and warm woods; made for evenings and places to unwind.', spaces: ['Lounges and bars', 'Restaurants', 'Hotel lobbies'] }
  };
  const SHARED_14 = { top: ['Fresh', 'Green', 'Citrusy', 'Lightly fruity'], heart: ['Rich', 'Natural feel', 'White-floral'], base: ['Clean musk', 'Creamy woods'] };
  const SHARED_08 = { top: ['Bergamot', 'Lemon', 'Grapefruit'], heart: ['Jasmine', 'Rose', 'Violet'], base: ['Powdery', 'Green', 'Soft'] };
  const ESSENCES_EN = {
    non001: { top: ['Fresh soapy', 'Clean aldehydic touch', 'Green'], heart: ['White flowers', 'Rose', 'Violet', 'Lightly fruity'], base: ['Clean musk', 'Soft amber', 'Sandalwood'], mood: ['Clean', 'Soapy', 'Powdery'], story: ["A [fresh soapy] opening like clean linen, with a [clean aldehydic touch] and a [green] freshness.", "A soft bouquet of [white flowers], [rose] and [violet], with a [lightly fruity] touch.", "[Clean musk], [soft amber] and [sandalwood]: a calm, powdery depth."] },
    non007: { top: ['Green apple', 'Pineapple', 'Banana'], heart: ['Peach', 'Raspberry', 'Tropical fruit'], base: ['Vanilla', 'Cream', 'Musk', 'Coconut'], mood: ['Fruity', 'Tropical', 'Cheerful'], story: ["A juicy, tropical start of [green apple], [pineapple] and [banana].", "[Peach], [raspberry] and [tropical fruit] add sweetness.", "[Vanilla], [cream], [musk] and [coconut] close it warm and creamy."] },
    non008: { ...SHARED_08, mood: ['Calm', 'Bright', 'Soft'], story: ["A bright start of [bergamot], [lemon] and [grapefruit].", "[Jasmine], [rose] and [violet] weave a soft floral heart.", "A [powdery], [green] and [soft] trace: calm and balanced, true to its name."] },
    non009: { top: ['Fresh', 'Green', 'Lightly ozonic'], heart: ['Jasmine', 'White flowers', 'Rose'], base: ['White musk', 'Amber', 'Sandalwood'], mood: ['Fresh', 'Ozonic', 'Warm'], story: ["A [fresh], [green] and [lightly ozonic] opening, like clean air from the sea.", "[Jasmine], [white flowers] and [rose] brighten the heart.", "[White musk], [amber] and [sandalwood] leave a warm, lasting trace."] },
    non013: { top: ['Bergamot', 'Grapefruit', 'Aromatic'], heart: ['Aromatic spice', 'Clove', 'Cinnamon', 'Spicy flowers'], base: ['Cedar', 'Sandalwood', 'Vetiver', 'Patchouli', 'Amber'], mood: ['Spicy', 'Woody', 'Characterful'], story: ["A lively, [aromatic] opening of [bergamot] and [grapefruit].", "A warm heart of [aromatic spice], [clove], [cinnamon] and [spicy flowers].", "[Cedar], [sandalwood], [vetiver], [patchouli] and [amber]: a strong, characterful signature."] },
    non014: { ...SHARED_14, mood: ['Sparkling', 'Fresh', 'Elegant'], story: ["A sparkling opening: [fresh], [green], [citrusy] and [lightly fruity].", "An elegant heart, [rich] and [white-floral], with a [natural feel].", "[Clean musk] and [creamy woods] for a soft finish."] },
    non015: { top: ['White musk', 'Sandalwood', 'Powdery woods'], heart: ['White flowers', 'Fruit', 'Rose'], base: ['White musk', 'Sandalwood', 'Powdery woods'], mood: ['Calm', 'Powdery', 'Floral'], story: ["A velvety opening of [white musk], [sandalwood] and [powdery woods].", "[White flowers], [fruit] and [rose]: the calm, clean elegance of the lotus.", "[White musk], [sandalwood] and [powdery woods] keep it soft to the end."] },
    non016: { top: ['Light citrus', 'Raspberry'], heart: ['Jasmine', 'Rose', 'Creamy fruit'], base: ['Rich vanilla', 'White musk', 'Amber'], mood: ['Powdery', 'Vanilla', 'Enveloping'], story: ["A sweet, bright opening of [light citrus] and [raspberry].", "[Jasmine], [rose] and [creamy fruit] soften the scent.", "[Rich vanilla], [white musk] and [amber]: a powdery, enveloping warmth."] },
    non018: { ...SHARED_14, mood: ['Fresh', 'Clean', 'Open air'], story: ["[Fresh], [green], [citrusy] and [lightly fruity]: the cleanness of open air.", "A full heart, [rich] and [white-floral], with a [natural feel].", "[Clean musk] and [creamy woods] carry the freshness for a long time."] },
    non020: { top: ['Aromatic', 'Lightly floral'], heart: ['White flowers', 'Lily of the valley', 'Rose'], base: ['White musk', 'Sandalwood', 'Patchouli', 'Amber'], mood: ['Woody', 'Deep', 'Balanced'], story: ["A clean, [aromatic] and [lightly floral] opening.", "A bright heart of [white flowers], [lily of the valley] and [rose].", "[White musk], [sandalwood], [patchouli] and [amber]: deep, woody and reassuring."] },
    non021: { top: ['Lemon', 'Grapefruit', 'Melon', 'Green apple'], heart: ['Rose', 'Neroli', 'Violet'], base: ['Powdery', 'Green', 'Soft'], mood: ['Bright', 'Juicy', 'Floral'], story: ["A juicy, fresh opening of [lemon], [grapefruit], [melon] and [green apple].", "[Rose], [neroli] and [violet]: the brightness of a white-flower garden.", "A [powdery], [green] and [soft] trace that lingers."] },
    non023: { top: ['Green', 'Fresh', 'Fruity'], heart: ['Jasmine', 'Rose', 'Lily of the valley'], base: ['Powdery', 'Woody', 'Vanilla'], mood: ['Light', 'Fresh', 'Soft'], story: ["A [green], [fresh] and [fruity] opening, like a light breeze by the sea.", "A soft floral texture of [jasmine], [rose] and [lily of the valley].", "A warm, comfortable close: [powdery], [woody] and [vanilla]."] },
    non024: { name: 'Rainforest', ...SHARED_08, mood: ['Green', 'Cool', 'Refreshing'], story: ["[Bergamot], [lemon] and [grapefruit]: fresh air after the rain.", "[Jasmine], [rose] and [violet] add a floral fullness.", "[Powdery], [green] and [soft]: the cool, calm air of the forest."] },
    non025: { top: ['Green', 'Lemony', 'Juicy'], heart: ['Mango', 'Peach', 'Melon'], base: ['Clean musk', 'Sweet', 'Soft'], mood: ['Sunny', 'Fruity', 'Cheerful'], story: ["A lively opening: [green], [lemony] and [juicy].", "A ripe, sunny fruit heart of [mango], [peach] and [melon].", "[Clean musk] with a [sweet], [soft] finish: cheerful but never heavy."] },
    non026: { name: 'Japanese Cherry', top: ['Fresh', 'Clean', 'Light citrus'], heart: ['Jasmine', 'Lily of the valley', 'Powdery flowers'], base: ['White musk', 'Amber', 'Woody'], mood: ['Elegant', 'Powdery', 'Spring'], story: ["A spring morning: [fresh], [clean], with [light citrus].", "[Jasmine], [lily of the valley] and [powdery flowers]: the elegance of cherry blossom season.", "A soft warmth of [white musk], [amber] and [woody] notes."] },
    non027: { top: ['Spice', 'Citrus', 'Aromatic'], heart: ['Resin', 'Dry wood', 'Spice'], base: ['Oud', 'Amber', 'Cedar', 'Sandalwood', 'Musk'], mood: ['Intense', 'Smoky', 'Lasting'], story: ["An intense opening of [spice], [citrus] and [aromatic] herbs.", "At its heart, [resin], [dry wood] and [spice].", "[Oud], [amber], [cedar], [sandalwood] and [musk]: a deep, smoky trace that lingers."] },
    ntr001: { ...SHARED_14, mood: ['Lively', 'Fruity', 'Clean'], story: ["[Fresh], [green], [citrusy] and [lightly fruity]: a lively, appetising start.", "A [rich], [white-floral] heart with a [natural feel] softens it.", "[Clean musk] and [creamy woods] leave a clean trace that never intrudes."] },
    ntr002: { top: ['Sea breeze', 'Bergamot', 'Lemon', 'Mint'], heart: ['Jasmine', 'Lily of the valley', 'Rose', 'Watery flowers'], base: ['Cedar', 'Amber', 'Sandalwood', 'White musk'], mood: ['Cool', 'Invigorating', 'Clean'], story: ["[Sea breeze], [bergamot], [lemon] and [mint]: a cool, invigorating opening.", "[Jasmine], [lily of the valley], [rose] and [watery flowers] brighten the heart.", "[Cedar], [amber], [sandalwood] and [white musk] make the cleanness last."] },
    ntr003: { top: ['Sea breeze', 'Bergamot', 'Lemon'], heart: ['Jasmine', 'Lily of the valley', 'Lavender-like freshness'], base: ['White musk', 'Amber', 'Cedar'], mood: ['Fresh', 'Citrus', 'Light'], story: ["A fresh opening of [sea breeze], [bergamot] and [lemon].", "A clean heart of [jasmine], [lily of the valley] and a [lavender-like freshness].", "[White musk], [amber] and [cedar]: a light but lasting base."] },
    ntr004: { top: ['Fresh', 'Citrus and green opening'], heart: ['Jasmine', 'Rose', 'White flowers', 'Violet'], base: ['Creamy', 'Musk', 'Woody', 'Powdery'], mood: ['Lively', 'Floral', 'Soft'], story: ["A [fresh] [citrus and green opening].", "A rich heart of [jasmine], [rose], [white flowers] and [violet].", "[Musk] and [woody] notes with a [creamy], [powdery] texture round off the clean feeling."] },
    ntr005: { ...SHARED_14, mood: ['Fresh', 'Green', 'Clean'], story: ["A [fresh], [green], [citrusy], [lightly fruity] opening that clears the air.", "A soft fullness: [rich], [white-floral], with a [natural feel].", "[Clean musk] and [creamy woods] keep the freshness in the room."] },
    prf005: { top: ['Bergamot', 'Lavender', 'Citrus'], heart: ['Jasmine', 'Rose', 'White flowers', 'Violet'], base: ['Cedar', 'Sandalwood', 'Musk'], mood: ['Elegant', 'Aromatic', 'Floral'], story: ["A fresh, aromatic opening of [bergamot], [lavender] and [citrus].", "[Jasmine], [rose], [white flowers] and [violet]: a rich heart with a perfume character.", "[Cedar], [sandalwood] and [musk] leave an elegant, lasting signature."] },
    prf006: { top: ['Grapefruit', 'Ozone', 'Green aromatics'], heart: ['Jasmine', 'Rose', 'Fruity flowers'], base: ['Cedar', 'Leather', 'Amber', 'Musk'], mood: ['Radiant', 'Bold', 'Warm'], story: ["An energetic opening of [grapefruit], [ozone] and [green aromatics].", "A bright heart of [jasmine], [rose] and [fruity flowers].", "[Cedar], [leather], [amber] and [musk]: a radiant, bold depth."] },
    cic006: { top: ['Bergamot', 'Orange', 'Green leaf'], heart: ['Gardenia', 'Jasmine', 'Narcissus', 'Violet'], base: ['White musk', 'Sandalwood', 'Moss'], mood: ['Elegant', 'Green', 'White floral'], story: ["A bright opening of [bergamot], [orange] and [green leaf].", "The creamy white flowers of [gardenia] and [jasmine], deepened by [narcissus] and [violet].", "[White musk], [sandalwood] and [moss]: the coolness of a garden after rain."] },
    ory006: { top: ['Fresh', 'Aromatic', 'Floral'], heart: ['Jasmine', 'Lily of the valley', 'Rose', 'Violet'], base: ['Sandalwood', 'White musk', 'Amber', 'Vanilla'], mood: ['Mysterious', 'Enveloping', 'Warm'], story: ["A [fresh], [aromatic] and [floral] opening, cool as the night.", "An elegant bouquet of [jasmine], [lily of the valley], [rose] and [violet].", "[Sandalwood], [white musk], [amber] and [vanilla]: a warm, enveloping trace in the moonlight."] }
  };
  ESSENCE_FAMILIES.forEach(f => Object.assign(f, FAMILIES_EN[f.id] || {}));
  ESSENCES.forEach(e => Object.assign(e, ESSENCES_EN[e.id] || {}));

  // Renk adları ve İngilizce aile adı (kodlar ve renk tonları products.js'te kalır)
  const COLOURS_EN = { Beyaz: 'White', Siyah: 'Black', 'Gümüş': 'Silver', Bej: 'Beige', 'Rose Gold': 'Rose gold', Bronz: 'Bronze', Kahverengi: 'Brown', 'Yeşil': 'Green' };
  const FAMILY_EN = { ck686: 'ADS-687 column' };
  PRODUCTS.forEach(p => {
    (p.colors || []).forEach(c => { c.name = COLOURS_EN[c.name] || c.name; });
    if (FAMILY_EN[p.id]) p.family = FAMILY_EN[p.id];
  });

  CATEGORIES.forEach(c => { if (CATEGORIES_EN[c.id]) c.label = CATEGORIES_EN[c.id]; });
  PRODUCTS.forEach(p => {
    const t = EN[p.id];
    if (!t) return;
    const { videos, ...rest } = t;
    Object.assign(p, rest);
    // Videolar: dosya ve süre products.js'ten, metinler buradan
    if (videos && p.videos) p.videos = p.videos.map((v, i) => Object.assign({}, v, videos[i] || {}));
  });
})();
