/* ============================================================
   КАРТОТЕКА: фильтры, поиск, карточки, модалка
   ============================================================ */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const grid = $('#grid'), empty = $('#empty'), cnt = $('#cnt'), qin = $('#q');
  if (!grid) return;

  const SIDE = { ghoul: 'ГУЛЬ', ccg: 'CCG', human: 'ЧЕЛОВЕК' };
  let filter = 'all', query = '';

  const caseNo = (p, i) => 'ДЕЛО № ' + String(i + 1).padStart(3, '0') + '-' + (String(p.ward).replace(/\D/g, '') || 'XX');

  function match(p, i) {
    if (filter === 'ghoul' && p.side !== 'ghoul') return false;
    if (filter === 'ccg' && p.side !== 'ccg') return false;
    if (filter === 'human' && p.side !== 'human') return false;
    if (filter === 'ward20' && String(p.ward) !== '20') return false;
    if (filter === 'high' && !/^S/i.test(String(p.rate))) return false;
    if (query) {
      const hay = [p.name, p.jp, p.alias, p.role, (KAGUNE[p.kagune] || {}).ru, p.rate, 'район ' + p.ward]
        .join(' ').toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  }

  function render() {
    const items = PEOPLE.map((p, i) => ({ p, i })).filter(o => match(o.p, o.i));
    grid.innerHTML = items.map(({ p, i }) => {
      const k = KAGUNE[p.kagune] || KAGUNE.none;
      return `<article class="dcard" data-id="${p.id}" id="${p.id}" tabindex="0" role="button"
                       aria-label="Открыть досье: ${p.name}">
        <div class="top">
          <span class="id">${caseNo(p, i)}</span>
          <span class="badge ${p.side === 'ccg' ? 'ccg' : 'ghoul'}">${SIDE[p.side]}</span>
        </div>
        ${KKportrait(p)}
        <span class="stamp">${p.side === 'ccg' ? 'ШТАТ' : 'РОЗЫСК'}</span>
        <div class="body">
          <h3>${p.name}</h3>
          <p class="rn jp">${p.jp}</p>
          <div class="meta">
            <span class="rate ${KKrateClass(p.rate)}">${p.rate}</span>
            <span>${k.ru} · ${p.ward === '—' ? 'БЕЗ РАЙОНА' : (isNaN(+p.ward) ? p.ward : p.ward + '-Й Р-Н')}</span>
          </div>
        </div>
      </article>`;
    }).join('');
    empty.classList.toggle('hidden', items.length > 0);
    cnt.textContent = `НАЙДЕНО ДЕЛ: ${String(items.length).padStart(2, '0')} ИЗ ${PEOPLE.length}`;
  }

  /* ---------- фильтры ---------- */
  document.querySelectorAll('#filters .chip').forEach(c => {
    c.addEventListener('click', () => {
      document.querySelectorAll('#filters .chip').forEach(x => x.setAttribute('aria-pressed', 'false'));
      c.setAttribute('aria-pressed', 'true');
      filter = c.dataset.f;
      render();
    });
  });
  let deb;
  qin.addEventListener('input', () => {
    clearTimeout(deb);
    deb = setTimeout(() => { query = qin.value.trim().toLowerCase(); render(); }, 140);
  });


  /* ---------- пятиугольник характеристик ---------- */
  function radar(stats, size, color) {
    const keys = Object.keys(stats), n = keys.length;
    const cx = size / 2, cy = size / 2 + size * 0.02, R = size * 0.34;
    const pt = (i, r) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    };
    const ring = k => keys.map((_, i) => pt(i, R * k).map(v => v.toFixed(1)).join(',')).join(' ');
    const shape = keys.map((key, i) => pt(i, R * (stats[key] / 100)).map(v => v.toFixed(1)).join(',')).join(' ');
    const labels = keys.map((key, i) => {
      const [x, y] = pt(i, R * 1.3);
      const anchor = Math.abs(x - cx) < 4 ? 'middle' : (x > cx ? 'start' : 'end');
      return `<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="${anchor}"
                font-family="monospace" font-size="${(size * 0.032).toFixed(1)}"
                fill="currentColor" opacity=".55" letter-spacing="1">${key}</text>`;
    }).join('');
    return `<svg viewBox="0 0 ${size} ${size}" class="radar" role="img" aria-label="Характеристики">
      <g fill="none" stroke="currentColor" opacity=".18" stroke-width="1">
        ${[0.25, 0.5, 0.75, 1].map(k => `<polygon points="${ring(k)}"/>`).join('')}
        ${keys.map((_, i) => {
          const [x, y] = pt(i, R);
          return `<path d="M${cx} ${cy} L${x.toFixed(1)} ${y.toFixed(1)}"/>`;
        }).join('')}
      </g>
      <polygon points="${shape}" fill="${color}" fill-opacity=".22" stroke="${color}" stroke-width="2"/>
      ${keys.map((key, i) => {
        const [x, y] = pt(i, R * (stats[key] / 100));
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(size * 0.012).toFixed(1)}" fill="${color}"/>`;
      }).join('')}
      ${labels}
    </svg>`;
  }

  /* ---------- досье карточкой: самостоятельный SVG ---------- */
  function cardSVG(p, i) {
    const k = KAGUNE[p.kagune] || KAGUNE.none;
    const accent = p.side === 'ccg' ? '#6fa8d6' : '#ff2634';
    const por = KKportrait(p)
      .replace('<svg ', '<svg x="52" y="150" width="300" height="360" ')
      .replace(' class="por"', '');
    const stats = Object.entries(p.stats);
    const bars = stats.map(([n, v], j) => `
      <text x="404" y="${196 + j * 52}" font-family="monospace" font-size="13"
            fill="#8b857c" letter-spacing="1.6">${n}</text>
      <rect x="404" y="${206 + j * 52}" width="244" height="8" fill="#211d1b"/>
      <rect x="404" y="${206 + j * 52}" width="${(244 * v / 100).toFixed(1)}" height="8" fill="${accent}"/>
      <text x="648" y="${200 + j * 52}" text-anchor="end" font-family="monospace" font-size="13"
            fill="${accent}">${v}</text>`).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="1000" viewBox="0 0 700 1000">
  <defs>
    <pattern id="cg" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
      <circle cx="2" cy="2" r="1.4" fill="${accent}" opacity=".2"/>
    </pattern>
  </defs>
  <rect width="700" height="1000" fill="#0a0908"/>
  <rect width="700" height="1000" fill="url(#cg)"/>
  <rect x="18" y="18" width="664" height="964" fill="none" stroke="#e9e4da" stroke-width="3"/>
  <rect x="26" y="26" width="648" height="948" fill="none" stroke="#e9e4da" stroke-width="1" opacity=".2"/>

  <text x="52" y="76" font-family="monospace" font-size="13" fill="#8b857c" letter-spacing="3">
    ДЕЛО № ${String(i + 1).padStart(3, '0')} · КАРТОТЕКА CCG</text>
  <text x="648" y="76" text-anchor="end" font-family="monospace" font-size="13"
        fill="${accent}" letter-spacing="3">${SIDE[p.side]}</text>
  <path d="M52 92 H648" stroke="#e9e4da" stroke-width="1" opacity=".25"/>

  <text x="52" y="130" font-family="'Arial Narrow',Impact,sans-serif" font-size="15"
        fill="#8b857c" letter-spacing="4">${p.jp}</text>

  ${por}

  <text x="404" y="176" font-family="monospace" font-size="12" fill="#8b857c" letter-spacing="2.6">
    ХАРАКТЕРИСТИКИ</text>
  ${bars}

  <text x="52" y="576" font-family="Impact,'Arial Narrow',sans-serif" font-size="54"
        fill="#e9e4da" letter-spacing="1">${p.name.toUpperCase()}</text>
  ${p.alias && p.alias !== '—' ? `<text x="52" y="606" font-family="serif" font-size="19"
        fill="${accent}">«${p.alias}»</text>` : ''}

  <path d="M52 634 H648" stroke="#e9e4da" stroke-width="1" opacity=".25"/>
  ${[['РЕЙТИНГ', p.rate], ['КАГУНЕ', k.ru], ['РАЙОН', p.ward === '—' ? 'не закреплён' : p.ward],
     ['СТАТУС', SIDE[p.side]]].map(([a, b], j) => `
    <text x="${52 + j * 150}" y="666" font-family="monospace" font-size="11"
          fill="#8b857c" letter-spacing="2">${a}</text>
    <text x="${52 + j * 150}" y="694" font-family="Impact,'Arial Narrow',sans-serif" font-size="24"
          fill="${j === 0 ? accent : '#e9e4da'}">${b}</text>`).join('')}

  <path d="M52 726 H648" stroke="#e9e4da" stroke-width="1" opacity=".25"/>
  <foreignObject x="52" y="746" width="596" height="120">
    <div xmlns="http://www.w3.org/1999/xhtml"
         style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#b6afa4">
      ${p.role}
    </div>
  </foreignObject>

  <path d="M52 878 V934" stroke="${accent}" stroke-width="3"/>
  <foreignObject x="70" y="866" width="578" height="80">
    <div xmlns="http://www.w3.org/1999/xhtml"
         style="font-family:Georgia,serif;font-size:19px;line-height:1.45;color:${accent}">
      「${p.quote}」
    </div>
  </foreignObject>

  <text x="52" y="962" font-family="monospace" font-size="10" fill="#4d4744" letter-spacing="2.4">
    KAGUNE-KAI · НЕКОММЕРЧЕСКИЙ ФАН-АРХИВ</text>
  <text x="648" y="962" text-anchor="end" font-family="monospace" font-size="10"
        fill="#4d4744" letter-spacing="2.4">喰種</text>
</svg>`;
  }

  function download(p, i) {
    const blob = new Blob([cardSVG(p, i)], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'kagune-kai-' + p.id + '.svg';
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    if (window.KKtoast) KKtoast('досье выгружено файлом');
  }

  /* ---------- модалка ---------- */
  const modal = $('#modal'), mLeft = $('#m-left'), mRight = $('#m-right'), mId = $('#m-id');
  let lastFocus = null, openIdx = -1;

  /* соседнее дело: ← и → листают картотеку, не закрывая карточку */
  function step(d) {
    if (openIdx < 0) return;
    const n = (openIdx + d + PEOPLE.length) % PEOPLE.length;
    reveal(PEOPLE[n].id);
  }

  /* дело 001: сороконожка идёт поверх экрана, дело открывается следом */
  function open(id) {
    if (id === 'kaneki' && window.KKcentipede) {
      KKcentipede();
      setTimeout(() => reveal(id), 620);
      return;
    }
    reveal(id);
  }

  function reveal(id) {
    const i = PEOPLE.findIndex(x => x.id === id);
    if (i < 0) return;
    const p = PEOPLE[i], k = KAGUNE[p.kagune] || KAGUNE.none;
    lastFocus = document.activeElement;
    mId.textContent = caseNo(p, i) + ' · ДОСТУП: УРОВЕНЬ 3';
    openIdx = i;

    mLeft.innerHTML = `
      ${KKportrait(p)}
      <div class="spec" style="margin-top:18px;grid-template-columns:1fr">
        <div><dt>СТАТУС</dt><dd>${SIDE[p.side]}</dd></div>
        <div><dt>РЕЙТИНГ УГРОЗЫ</dt><dd class="rate ${KKrateClass(p.rate)}" style="font-size:20px">${p.rate}</dd></div>
        <div><dt>РАЙОН</dt><dd>${p.ward === '—' ? 'не закреплён' : (isNaN(+p.ward) ? p.ward : p.ward + '-й')}</dd></div>
        <div><dt>КАГУНЕ</dt><dd style="color:${k.color}">${k.ru} <span class="jp" style="letter-spacing:.2em">${k.jp}</span></dd></div>
      </div>`;

    mRight.innerHTML = `
      <h2 id="m-name">${p.name}</h2>
      <p class="rn jp">${p.jp}${p.alias && p.alias !== '—' ? ' · «' + p.alias + '»' : ''}</p>
      <p class="lead" style="font-size:15px">${p.role}</p>
      <p>${p.bio}</p>
      <p class="mono" style="font-size:11px;letter-spacing:.14em;line-height:2;border-left:2px solid var(--accent);padding-left:14px">
        ${p.redact.replace(/\[ВЫМАРАНО[^\]]*\]/g, m => `<span class="redact" tabindex="0" role="button" title="показать">${m.replace(/[\[\]]/g, '')}</span>`)}
      </p>
      <p class="jp" style="font-family:var(--serif);font-size:17px;color:var(--accent);margin-top:22px">「${p.quote}」</p>
      <div class="statwrap">
        ${radar(p.stats, 260, p.side === 'ccg' ? '#6fa8d6' : '#ff2634')}
        <div class="bars">
          ${Object.entries(p.stats).map(([n, v]) => `
            <div class="b"><span>${n}</span><span class="track"><i data-v="${v}"></i></span><span>${v}</span></div>`).join('')}
        </div>
      </div>
      <button class="btn m-dl" id="m-dl"><span>Скачать досье карточкой</span></button>`;

    mRight.querySelector('#m-dl').addEventListener('click', () => download(p, i));

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      mRight.querySelectorAll('.bars i').forEach(el => { el.style.width = el.dataset.v + '%'; });
    });
    $('#m-close').focus();
    history.replaceState(null, '', '#' + p.id);
  }

  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    history.replaceState(null, '', location.pathname);
    if (lastFocus) lastFocus.focus();
  }

  grid.addEventListener('click', e => {
    const card = e.target.closest('.dcard');
    if (card) open(card.dataset.id);
  });
  grid.addEventListener('keydown', e => {
    const card = e.target.closest('.dcard');
    if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(card.dataset.id); }
  });
  const navBar = document.createElement('div');
  navBar.className = 'm-nav';
  navBar.innerHTML = '<button type="button" data-d="-1" aria-label="Предыдущее дело">←</button>' +
                     '<button type="button" data-d="1" aria-label="Следующее дело">→</button>';
  $('#m-close').parentElement.insertBefore(navBar, $('#m-close'));
  navBar.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) step(+b.dataset.d);
  });

  $('#m-close').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });

  /* вымаранные строки — открываются по клику */
  modal.addEventListener('click', e => {
    const r = e.target.closest('.redact');
    if (r) r.classList.toggle('shown');
  });
  modal.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('redact')) {
      e.preventDefault(); e.target.classList.toggle('shown');
    }
  });

  render();
  if (location.hash.length > 1) open(location.hash.slice(1));
})();
