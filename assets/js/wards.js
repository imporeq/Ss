/* ============================================================
   РАЙОНЫ: карта-сетка, карточка района, меню «Антейку»
   ============================================================ */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const map = $('#map'), info = $('#ward-info');
  if (!map || !window.WARDS) return;

  const W = 88, H = 84, GX = 96, GY = 92, X0 = 14, Y0 = 14;

  /* сетка 5×5 для районов 1–23, 24-й — отдельно под картой */
  const cells = WARDS.filter(w => w.n <= 23).map((w, i) => {
    const col = i % 5, row = Math.floor(i / 5);
    return { w, x: X0 + col * GX, y: Y0 + row * GY };
  });
  const w24 = WARDS.find(w => w.n === 24);

  map.innerHTML = `
    <g id="grid-cells">
      ${cells.map(c => `
        <g class="wardcell${c.w.hot ? ' hot' : ''}" data-n="${c.w.n}" tabindex="0" role="button"
           aria-label="${c.w.name}">
          <rect x="${c.x}" y="${c.y}" width="${W}" height="${H}"/>
          <text x="${c.x + 9}" y="${c.y + 20}">${String(c.w.n).padStart(2, '0')}</text>
          <text x="${c.x + 9}" y="${c.y + H - 10}" font-family="serif" font-size="12">${c.w.jp}</text>
          ${c.w.home ? `<circle cx="${c.x + W - 14}" cy="${c.y + 14}" r="4" fill="#ff1f2e"/>` : ''}
        </g>`).join('')}
    </g>
    <g class="wardcell hot" data-n="24" tabindex="0" role="button" aria-label="24-й район" id="c24">
      <rect x="${X0 + GX}" y="${Y0 + 5 * GY + 10}" width="${W * 3 + 16}" height="${H - 18}"
            stroke-dasharray="6 5"/>
      <text x="${X0 + GX + 14}" y="${Y0 + 5 * GY + 34}">24 — 二十四区 · НИЖНИЙ ЯРУС</text>
    </g>
    <text x="14" y="588" font-family="monospace" font-size="9" fill="currentColor" opacity=".35"
          letter-spacing="2">СХЕМА УСЛОВНАЯ · НЕ ДЛЯ ОПЕРАТИВНОГО ИСПОЛЬЗОВАНИЯ</text>`;

  function show(n) {
    const w = WARDS.find(x => x.n === +n);
    if (!w) return;
    map.querySelectorAll('.wardcell').forEach(c => c.classList.toggle('on', c.dataset.n === String(n)));
    const who = PEOPLE.filter(p => String(p.ward) === String(w.n)).map(p => p.name);
    info.innerHTML = `
      <p class="mono" style="font-size:9px;letter-spacing:.3em;color:var(--accent)">СЕКТОР ${String(w.n).padStart(2, '0')}</p>
      <h2 class="wn">${w.name}</h2>
      <p class="wj jp">${w.jp}</p>
      <dl>
        <div class="r"><span>СТАТУС</span><span>${w.st}</span></div>
        <div class="r"><span>КОНТРОЛЬ</span><span>${w.gov}</span></div>
        <div class="r"><span>ПЛОТНОСТЬ ГУЛЕЙ</span><span>${w.pop}</span></div>
        <div class="r"><span>В КАРТОТЕКЕ</span><span>${who.length ? who.length + ' дел' : '—'}</span></div>
      </dl>
      <p>${w.note}</p>
      ${who.length ? `<p class="mono" style="font-size:10px;letter-spacing:.16em;opacity:.7">${who.join(' · ').toUpperCase()}</p>
        <a class="btn" style="margin-top:8px" href="characters.html"><span>Открыть дела</span></a>` : ''}
      ${w.n === 20 ? `<a class="btn solid" style="margin-top:10px" href="#anteiku"><span>Кофейня «Антейку»</span></a>` : ''}`;
  }

  map.querySelectorAll('.wardcell').forEach(c => {
    c.addEventListener('click', () => show(c.dataset.n));
    c.addEventListener('mouseenter', () => show(c.dataset.n));
    c.addEventListener('focus', () => show(c.dataset.n));
    c.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(c.dataset.n); }
    });
  });

  show(20);

  /* ---------------- меню ---------------- */
  const menu = $('#menu');
  if (menu && window.MENU) {
    menu.innerHTML = MENU.map(m => `
      <div class="mrow">
        <span class="nm">${m.nm}<small>${m.d}</small></span>
        <span class="dot"></span>
        <span class="pr">${m.p}</span>
      </div>`).join('');
  }
})();
