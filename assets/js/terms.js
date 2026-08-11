/* ============================================================
   СЛОВАРЬ — фильтр по разделу и живой поиск
   ============================================================ */
(function () {
  'use strict';
  const host = document.querySelector('#terms');
  if (!host || !window.TERMS) return;

  const CAT = {
    'био':       { ru: 'Биология',   color: '#b0121a' },
    'оружие':    { ru: 'Оружие',     color: '#d1a02b' },
    'структура': { ru: 'Структура',  color: '#6fa8d6' },
    'место':     { ru: 'Места',      color: '#7d9a4e' },
    'событие':   { ru: 'События',    color: '#8e2bd1' },
    'жаргон':    { ru: 'Жаргон',     color: '#c8342f' }
  };

  let cat = 'all', q = '';

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mark = (text, needle) => {
    if (!needle) return esc(text);
    const i = text.toLowerCase().indexOf(needle);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + needle.length)) + '</mark>' + esc(text.slice(i + needle.length));
  };

  function draw() {
    const list = TERMS.filter(t => {
      if (cat !== 'all' && t.c !== cat) return false;
      if (q && !(t.t + ' ' + t.jp + ' ' + t.d).toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => a.t.localeCompare(b.t, 'ru'));

    host.innerHTML = list.length ? list.map(t => {
      const c = CAT[t.c] || CAT['био'];
      return `<article class="tcard" style="--tc:${c.color}">
        <div class="thead">
          <h3>${mark(t.t, q)}</h3>
          <span class="tjp jp">${t.jp}</span>
        </div>
        <span class="tcat mono">${c.ru.toUpperCase()}</span>
        <p>${mark(t.d, q)}</p>
      </article>`;
    }).join('') : `<p class="empty">В СЛОВАРЕ ТАКОГО НЕТ</p>`;

    document.querySelector('#tcount').textContent =
      `СТАТЕЙ: ${String(list.length).padStart(2, '0')} ИЗ ${TERMS.length}`;
  }

  /* фильтры собираем из самих данных */
  const bar = document.querySelector('#tfilters');
  const cats = ['all', ...Object.keys(CAT).filter(k => TERMS.some(t => t.c === k))];
  bar.insertAdjacentHTML('afterbegin', cats.map(k =>
    `<button class="chip" data-c="${k}" aria-pressed="${k === 'all'}">${k === 'all' ? 'Все' : CAT[k].ru}</button>`).join(''));

  bar.addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    bar.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', 'true');
    cat = b.dataset.c;
    draw();
  });

  const input = document.querySelector('#tq');
  let deb;
  input.addEventListener('input', () => {
    clearTimeout(deb);
    deb = setTimeout(() => { q = input.value.trim().toLowerCase(); draw(); }, 130);
  });

  draw();
})();
