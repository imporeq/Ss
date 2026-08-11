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
      <div class="bars">
        ${Object.entries(p.stats).map(([n, v]) => `
          <div class="b"><span>${n}</span><span class="track"><i data-v="${v}"></i></span><span>${v}</span></div>`).join('')}
      </div>`;

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
