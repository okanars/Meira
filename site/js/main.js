(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const imgSrc = (p, suffix = '') => `images/${p.external ? 'general' : 'products'}/${p.img}${suffix}.jpg`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- State ---------- */
  let activeCat = 'all', query = '';
  let quote = [];
  try { quote = JSON.parse(localStorage.getItem('dc_quote') || '[]'); } catch (e) { quote = []; }
  const saveQuote = () => { try { localStorage.setItem('dc_quote', JSON.stringify(quote)); } catch (e) {} };

  /* ---------- Header ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', e => { if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Products ---------- */
  const chips = $('#chips'), grid = $('#grid'), empty = $('#empty');
  chips.innerHTML = CATEGORIES.map(c => `<button class="chip${c.id === 'all' ? ' active' : ''}" data-cat="${c.id}" role="tab">${c.label}</button>`).join('');
  chips.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    activeCat = b.dataset.cat;
    chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === b));
    renderProducts();
  });
  $('#search').addEventListener('input', e => { query = e.target.value.trim().toLocaleLowerCase('tr'); renderProducts(); });

  function cap(p) { const f = p.specs.find(s => /kapasite/i.test(s[0])); return f ? f[1] : null; }
  function area(p) { const f = p.specs.find(s => /kapsama/i.test(s[0])); return f ? f[1] : null; }

  function renderProducts() {
    const list = PRODUCTS.filter(p => (activeCat === 'all' || p.cat === activeCat) &&
      (!query || (p.model + ' ' + p.title + ' ' + p.short + ' ' + p.features.join(' ')).toLocaleLowerCase('tr').includes(query)));
    grid.innerHTML = list.map((p, i) => `
      <article class="card" data-id="${p.id}" style="animation-delay:${Math.min(i, 8) * 50}ms" tabindex="0">
        <div class="card-img">
          <img src="${imgSrc(p)}" alt="${esc(p.model + ' ' + p.title)}" loading="lazy" style="object-position:${p.pos || 'center'}">
          ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}
        </div>
        <div class="card-body">
          <span class="card-model">${esc(p.model)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.short)}</p>
          <div class="card-meta">${[cap(p), area(p)].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join('')}</div>
          <div class="card-foot">
            <button class="detail" data-act="detail">İncele</button>
            <button class="add${quote.includes(p.id) ? ' added' : ''}" data-act="add">${quote.includes(p.id) ? '✓ Listede' : '+ Teklif'}</button>
          </div>
        </div>
      </article>`).join('');
    empty.hidden = list.length > 0;
  }
  grid.addEventListener('click', e => {
    const card = e.target.closest('.card'); if (!card) return;
    const id = card.dataset.id;
    if (e.target.closest('[data-act=add]')) { toggleQuote(id); return; }
    openModal(id);
  });
  grid.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList.contains('card')) openModal(e.target.dataset.id); });

  /* ---------- Modal ---------- */
  const modal = $('#modal'); let current = null;
  function openModal(id) {
    const p = PRODUCTS.find(x => x.id === id); if (!p) return; current = p;
    $('#mModel').textContent = p.model; $('#mTitle').textContent = p.title; $('#mDesc').textContent = p.desc;
    const main = $('#mImg'); main.src = imgSrc(p); main.alt = p.model + ' ' + p.title; main.style.objectPosition = p.pos || 'center';
    const imgs = [imgSrc(p)]; for (let i = 1; i <= p.gallery; i++) imgs.push(imgSrc(p, '-g' + i));
    $('#mThumbs').innerHTML = imgs.length > 1 ? imgs.map((s, i) => `<button class="${i ? '' : 'on'}" data-src="${s}" data-i="${i}" aria-label="Görsel ${i + 1}"><img src="${s}" alt="" style="object-position:${i ? 'center' : (p.pos || 'center')}"></button>`).join('') : '';
    $('#mFeatures').innerHTML = p.features.map(f => `<li>${esc(f)}</li>`).join('');
    $('#mVariants').innerHTML = p.variants.map(f => `<li>${esc(f)}</li>`).join('');
    $('#mVarH').hidden = $('#mVariants').hidden = !p.variants.length;
    $('#mSpecs').innerHTML = p.specs.map(s => `<tr><td>${esc(s[0])}</td><td>${esc(s[1])}</td></tr>`).join('');
    $('#mUse').textContent = p.use;
    refreshModalBtn();
    modal.hidden = false; document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-box').scrollTop = 0;
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
  function refreshModalBtn() { if (current) $('#mAdd').textContent = quote.includes(current.id) ? '✓ Listede – Kaldır' : 'Teklif Listesine Ekle'; }
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) closeModal();
    const t = e.target.closest('.m-thumbs button');
    if (t) { $('#mImg').src = t.dataset.src; $('#mImg').style.objectPosition = t.dataset.i === '0' ? (current.pos || 'center') : 'center'; modal.querySelectorAll('.m-thumbs button').forEach(b => b.classList.toggle('on', b === t)); }
  });
  $('#mAdd').addEventListener('click', () => { toggleQuote(current.id); refreshModalBtn(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeDrawer(); } });

  /* ---------- Quote list ---------- */
  const drawer = $('#drawer');
  function toggleQuote(id) {
    quote = quote.includes(id) ? quote.filter(x => x !== id) : [...quote, id];
    saveQuote(); updateQuote(); renderProducts();
  }
  function updateQuote() {
    $('#quoteCount').textContent = quote.length;
    const items = quote.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
    $('#drawerList').innerHTML = items.map(p => `<li><img src="${imgSrc(p)}" alt="" style="object-position:${p.pos || 'center'}"><div><b>${esc(p.model)}</b>${esc(p.title)}</div><button data-rm="${p.id}" aria-label="Kaldır">×</button></li>`).join('');
    $('#drawerEmpty').hidden = items.length > 0;
    const fq = $('#formQuote');
    fq.hidden = !items.length;
    fq.innerHTML = items.length ? '<b>Teklif istenen ürünler:</b> ' + items.map(p => esc(p.model)).join(', ') : '';
  }
  const openDrawer = () => { drawer.hidden = false; };
  function closeDrawer() { drawer.hidden = true; }
  $('#quoteToggle').addEventListener('click', openDrawer);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-dclose]')) closeDrawer();
    const rm = e.target.closest('[data-rm]'); if (rm) toggleQuote(rm.dataset.rm);
  });
  $('#clearQuote').addEventListener('click', () => { quote = []; saveQuote(); updateQuote(); renderProducts(); refreshModalBtn(); });

  /* ---------- Scents & oils ---------- */
  $('#scentGrid').innerHTML = SCENTS.map(s => `
    <article class="scent reveal"><h3>${esc(s.name)}</h3><span class="fam">${esc(s.family)}</span>
    <dl><div><dt>Üst nota: </dt><dd>${esc(s.top)}</dd></div><div><dt>Kalp notası: </dt><dd>${esc(s.mid)}</dd></div><div><dt>Alt nota: </dt><dd>${esc(s.base)}</dd></div></dl></article>`).join('');
  $('#oilList').innerHTML = OILS.map(o => `<div class="oil"><b>${esc(o.code)}</b>${esc(o.name)}<small>${esc(o.note)}</small></div>`).join('');

  /* ---------- Contact form (mailto fallback) ---------- */
  const form = $('#contactForm'), note = $('#formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(f => { const v = f.value.trim() && (f.type !== 'email' || /^\S+@\S+\.\S+$/.test(f.value)); f.classList.toggle('invalid', !v); if (!v) ok = false; });
    if (!ok) { note.textContent = 'Lütfen zorunlu alanları doldurun.'; return; }
    const d = Object.fromEntries(new FormData(form));
    const items = quote.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean).map(p => p.model).join(', ');
    const body = `Ad Soyad: ${d.name}\nFirma: ${d.company}\nE-posta: ${d.email}\nTelefon: ${d.phone}\n\n${d.message}${items ? '\n\nİlgilenilen ürünler: ' + items : ''}`;
    window.location.href = `mailto:info@dummycosmetics.com.tr?subject=${encodeURIComponent('[Web] ' + d.subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'E-posta uygulamanız açılıyor. Teşekkür ederiz!';
  });

  /* ---------- Reveal & counters ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const co = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; co.unobserve(en.target);
    const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    (function tick(t) { const k = Math.min((t - t0) / 1400, 1), v = Math.round(end * (1 - Math.pow(1 - k, 3))); el.textContent = v.toLocaleString('tr-TR') + suf; if (k < 1) requestAnimationFrame(tick); })(t0);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

  renderProducts(); updateQuote();
})();
