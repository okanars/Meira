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
      variants: ['ADS-687A (White)', 'ADS-687B (Black)'],
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
      variants: ['ADS-620B · 328×128×372 mm · 12W · 2,000-5,000 m³ · 12,000 TL + VAT', 'ADS-640B · 428×128×372 mm · 15W · 4,000-8,000 m³ · 14,000 TL + VAT', 'ADS-670B · 428×128×372 mm · 18W · 7,000-12,000 m³ · 22,000 TL + VAT'],
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
      variants: ['CK-683A (Silver)', 'CK-683B (Black)'],
      specs: [['Size', 'Ø92 × 305 mm'], ['Colour', 'Silver / Black'], ['Material', 'Aluminium alloy'], ['Voltage / Power', 'DC5V-2A (Type-C) / 8W'], ['Battery', '5000 mAh'], ['Noise level', '≤ 38 dB'], ['Fragrance capacity', '110 ml'], ['Coverage', '300 m³'], ['Net weight', '0.82 kg']],
      use: USE_COMMERCIAL + ', sales floors'
    },
    ads685: {
      badge: 'Commercial',
      title: 'Tabletop Commercial Scent Diffuser',
      short: 'Aluminium column body, 200 ml capacity and 400-1,200 m³ coverage; for tabletop use.',
      desc: 'An aluminium-bodied tabletop diffuser designed for commercial spaces. Draws 12 W at DC 12V, runs at ≤35 dB and scents 400-1,200 m³ from its 200 ml reservoir. Available in white and black.',
      features: ['Commercial use', 'Aluminium body', 'Low noise (≤35 dB)', 'Tabletop placement'],
      variants: ['ADS-685C (White)', 'ADS-685B (Black)'],
      specs: [['Size', '324 × 81 × 114 mm'], ['Colour', 'White / Black'], ['Material', 'Aluminium alloy'], ['Voltage / Power', 'DC 12V / 12W'], ['Noise level', '≤ 35 dB'], ['Fragrance capacity', '200 ml'], ['Coverage', '400-1,200 m³'], ['Installation', 'Tabletop']],
      use: USE_COMMERCIAL
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

  // Esanslar: koku aileleri ve esans metinleri (kimlik, ton, renk ve görsel products.js'te kalır)
  const TONES_EN = {
    floral: { label: 'Floral', text: 'Rose, cherry blossom and flower bouquets: soft, bright and inviting.' },
    fresh: { label: 'Fresh', text: 'Sea breeze and cool floral notes: clean, open and light.' },
    woody: { label: 'Woody', text: 'Sandalwood and pine: warm, dry and calm, like forest air.' }
  };
  const ESSENCES_EN = {
    'sehirde-bahar': {
      name: 'Spring in the City',
      desc: 'The light, powdery scent of freshly opened rose and cherry blossom. A bright, inviting air for reception areas and boutiques.',
      notes: ['Rose', 'Cherry blossom', 'Floral'],
      format: 'Reed diffuser · 120 ml'
    },
    'ciceklerin-dansi': {
      name: 'Dance of Flowers',
      desc: 'A rich flower bouquet reminiscent of hotel lobbies. Leaves an elegant, lasting trace in lobbies and waiting areas.',
      notes: ['Flower bouquet'],
      format: 'Reed diffuser · 200 ml'
    },
    'cicek-bollugu': {
      name: 'Flower Abundance',
      desc: 'Fresh notes of bluebell and the seashore. A cool, open feel for spas, gyms and summer venues.',
      notes: ['Bluebell', 'Summer breeze', 'Tropical beach'],
      format: 'Reed diffuser · 100 ml'
    },
    'sandal-agaci': {
      name: 'Sandalwood',
      desc: 'The warm, dry woody scent of sandalwood and pine; the calm of a walk in the forest. For offices, libraries and lounges.',
      notes: ['Sandalwood', 'Oriental woody notes', 'Pine'],
      format: 'Reed diffuser · 100 ml'
    }
  };
  ESSENCE_TONES.forEach(t => Object.assign(t, TONES_EN[t.id] || {}));
  ESSENCES.forEach(e => Object.assign(e, ESSENCES_EN[e.id] || {}));

  // Renk adları ve İngilizce aile adı (kodlar ve renk tonları products.js'te kalır)
  const COLOURS_EN = { Beyaz: 'White', Siyah: 'Black', 'Gümüş': 'Silver', Bej: 'Beige', 'Rose Gold': 'Rose gold' };
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
