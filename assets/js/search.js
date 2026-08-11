/* ============================================================
   ПОИСК ПО АРХИВУ — Ctrl+K или «/»
   Индекс собирается из тех же данных, что и страницы.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- индекс ---------------- */
  const idx = [];
  const add = (kind, t, sub, href, extra) =>
    idx.push({ kind, t, sub, href, hay: (t + ' ' + sub + ' ' + (extra || '')).toLowerCase() });

  if (window.KKSITE) KKSITE.forEach(s => add('РАЗДЕЛ', s.ru, s.jp, s.href));
  add('РАЗДЕЛ', 'Главная', '首頁', 'index.html', 'начало home');
  add('РАЗДЕЛ', 'Семь ночей', 'игра, выживание', 'game.html', 'game игра ночи');
  add('РАЗДЕЛ', '1000 − 7', 'комната без окон', 'index.html#count', 'счёт считай ямори');
  add('РАЗДЕЛ', 'Меню «Антейку»', 'кофейня 20-го района', 'wards.html#anteiku', 'кофе');
  add('РАЗДЕЛ', 'Кагуджа', 'что бывает после каннибализма', 'quinque.html#kakuja', 'kakuja броня');
  add('РАЗДЕЛ', 'Тест на кагуне', 'опросник', 'kagune.html#test', 'quiz какое кагуне');

  if (window.PEOPLE) PEOPLE.forEach(p => {
    const k = (KAGUNE[p.kagune] || {}).ru || '';
    add('ДЕЛО', p.name, `${p.rate} · ${k}${p.alias && p.alias !== '—' ? ' · «' + p.alias + '»' : ''}`,
        'characters.html#' + p.id, `${p.jp} ${p.role} ${p.side} район ${p.ward}`);
  });
  if (window.WARDS) WARDS.forEach(w =>
    add('РАЙОН', w.name, `${w.st} · ${w.gov}`, 'wards.html', `${w.jp} ${w.note}`));
  if (window.KAG_PAGE) KAG_PAGE.forEach(k =>
    add('КАГУНЕ', k.ru, k.where, 'kagune.html#' + k.id, `${k.jp} ${k.lead}`));
  if (window.QUINQUE) QUINQUE.forEach(q =>
    add('КВИНКЕ', q.name, `${q.form} · ${q.owner}`, 'quinque.html', `${q.jp} ${q.note} ${q.type}`));
  if (window.MANGA) MANGA.forEach(m =>
    add('ОТРЫВОК', m.title, m.arc, 'manga.html#' + m.id, `${m.jp} ${m.lead}`));

  /* ---------------- разметка ---------------- */
  const box = document.createElement('div');
  box.className = 'seek';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Поиск по архиву');
  box.innerHTML = `
    <div class="seek-card">
      <div class="seek-top">
        <span class="seek-eye" aria-hidden="true">⌕</span>
        <input id="seek-in" type="text" autocomplete="off" spellcheck="false"
               placeholder="ИМЯ, РАЙОН, КВИНКЕ, РАЗДЕЛ…" aria-label="Поиск по архиву">
        <kbd>ESC</kbd>
      </div>
      <div class="seek-list" id="seek-list" role="listbox"></div>
      <div class="seek-foot mono">
        <span>↑↓ выбор</span><span>ENTER открыть</span><span>ESC закрыть</span>
        <span class="seek-count" id="seek-count"></span>
      </div>
    </div>`;
  document.body.appendChild(box);

  const input = box.querySelector('#seek-in');
  const list  = box.querySelector('#seek-list');
  const count = box.querySelector('#seek-count');
  let cur = 0, rows = [];

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mark = (text, q) => {
    if (!q) return esc(text);
    const i = text.toLowerCase().indexOf(q);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<b>' + esc(text.slice(i, i + q.length)) + '</b>' + esc(text.slice(i + q.length));
  };

  function render(q) {
    q = q.trim().toLowerCase();
    let out;
    if (!q) {
      out = idx.filter(i => i.kind === 'РАЗДЕЛ').slice(0, 8);
    } else {
      out = idx
        .map(i => {
          const at = i.hay.indexOf(q);
          if (at < 0) return null;
          const titleAt = i.t.toLowerCase().indexOf(q);
          return { i, score: (titleAt === 0 ? 0 : titleAt > 0 ? 10 : 40) + at * 0.02 };
        })
        .filter(Boolean)
        .sort((a, b) => a.score - b.score)
        .slice(0, 12)
        .map(r => r.i);
    }
    rows = out;
    cur = 0;
    list.innerHTML = out.length
      ? out.map((r, n) => `
          <a class="seek-row${n === 0 ? ' on' : ''}" href="${r.href}" role="option" data-n="${n}">
            <span class="seek-kind">${r.kind}</span>
            <span class="seek-t">${mark(r.t, q)}</span>
            <span class="seek-sub">${mark(r.sub, q)}</span>
          </a>`).join('')
      : `<p class="seek-empty mono">В АРХИВЕ ТАКОГО НЕТ</p>`;
    count.textContent = out.length ? out.length + ' СОВПАДЕНИЙ' : '';
  }

  function move(d) {
    if (!rows.length) return;
    cur = (cur + d + rows.length) % rows.length;
    list.querySelectorAll('.seek-row').forEach((r, n) => r.classList.toggle('on', n === cur));
    const el = list.querySelector('.seek-row.on');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  function open() {
    box.classList.add('on');
    document.body.style.overflow = 'hidden';
    input.value = '';
    render('');
    setTimeout(() => input.focus(), 30);
  }
  function close() {
    box.classList.remove('on');
    document.body.style.overflow = '';
  }
  window.KKseek = open;

  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') {
      const el = list.querySelector('.seek-row.on');
      if (el) { e.preventDefault(); close(); location.href = el.getAttribute('href'); }
    } else if (e.key === 'Escape') { close(); }
  });
  list.addEventListener('mousemove', e => {
    const r = e.target.closest('.seek-row');
    if (!r) return;
    cur = +r.dataset.n;
    list.querySelectorAll('.seek-row').forEach((x, n) => x.classList.toggle('on', n === cur));
  });
  box.addEventListener('click', e => { if (e.target === box) close(); });

  addEventListener('keydown', e => {
    const t = e.target;
    const typing = t && t.nodeType === 1 && t.closest('input,textarea,[contenteditable]');
    if ((e.key === 'k' || e.key === 'л') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); box.classList.contains('on') ? close() : open(); return; }
    if (e.key === '/' && !typing) { e.preventDefault(); open(); }
    if (e.key === 'Escape' && box.classList.contains('on')) close();
  });

  /* кнопка в шапке — для тех, у кого нет клавиатуры */
  const topbar = document.getElementById('topbar');
  if (topbar) {
    const btn = document.createElement('button');
    btn.className = 'seek-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Поиск по архиву');
    btn.innerHTML = `<span aria-hidden="true">⌕</span><kbd class="seek-kbd">/</kbd>`;
    const burger = document.getElementById('burger');
    topbar.insertBefore(btn, burger || null);
    btn.addEventListener('click', open);
  }
})();
