/* ============================================================
   СЕМЬ НОЧЕЙ 20-го РАЙОНА — текстовая выживалка
   Три шкалы, семь ночей, шесть исходов. Всё локально.
   ============================================================ */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const host = $('#game');
  if (!host || !window.NIGHTS) return;

  const START = { h: 30, s: 10, l: 70 };
  const clamp = v => Math.max(0, Math.min(100, v));

  let st, night, picked, over;

  /* ---------------- толпа для экрана поражения ---------------- */
  function crowd() {
    const rows = 9, cols = 16;
    let f = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = 22 + c * 36 + (r % 2 ? 18 : 0) + ((r * c) % 5) - 2;
        const y = 34 + r * 34 + ((c * r) % 4);
        const sc = 0.7 + ((r * 7 + c * 3) % 5) / 10;
        const o = 0.18 + ((r + c) % 6) / 22;
        f += `<g transform="translate(${x} ${y}) scale(${sc.toFixed(2)})" opacity="${o.toFixed(2)}">
                <ellipse cx="0" cy="0" rx="5" ry="6" fill="#0a0908"/>
                <path d="M-6 8 C -6 22 -4 30 -2 38 L2 38 C 4 30 6 22 6 8 Z" fill="#0a0908"/>
              </g>`;
      }
    }
    return f;
  }

  const GAMEOVER_ART = `
    <svg viewBox="0 0 600 340" class="go-art" aria-hidden="true">
      <defs>
        <radialGradient id="gospot" cx="50%" cy="46%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity=".85"/>
          <stop offset="60%" stop-color="#ffffff" stop-opacity=".08"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <pattern id="gotone" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
          <circle cx="2" cy="2" r="1.6" fill="#0a0908" opacity=".5"/>
        </pattern>
      </defs>
      <rect width="600" height="340" fill="#d9d4c8"/>
      <rect width="600" height="340" fill="url(#gotone)"/>
      <ellipse cx="300" cy="160" rx="230" ry="150" fill="url(#gospot)"/>
      ${crowd()}
      <g transform="translate(300 168)">
        <ellipse cx="0" cy="-6" rx="9" ry="11" fill="#0a0908"/>
        <path d="M-11 8 C -11 34 -7 48 -4 62 L4 62 C 7 48 11 34 11 8 Z" fill="#0a0908"/>
      </g>
      <g stroke="#0a0908" stroke-width="1" opacity=".25">
        ${Array.from({ length: 26 }, (_, i) =>
          `<path d="M300 168 L${300 + Math.cos(i / 26 * 6.283) * 460} ${168 + Math.sin(i / 26 * 6.283) * 460}"/>`).join('')}
      </g>
    </svg>`;

  /* ---------------- шкалы ---------------- */
  function meters() {
    const rows = [
      ['ГОЛОД', st.h, '#b0121a', 'дойдёт до 100 — ты перестанешь себя контролировать'],
      ['ВНИМАНИЕ CCG', st.s, '#5f86a8', 'дойдёт до 100 — за тобой придут'],
      ['ЧЕЛОВЕЧНОСТЬ', st.l, '#c9a227', 'упадёт до нуля — возвращаться будет некому']
    ];
    return `<div class="gmeters">${rows.map(([n, v, c, tip]) => `
      <div class="gm" title="${tip}">
        <span class="gm-n mono">${n}</span>
        <span class="gm-track"><i style="width:${v}%;background:${c}"></i></span>
        <span class="gm-v mono" style="color:${c}">${String(v).padStart(3, '0')}</span>
      </div>`).join('')}</div>`;
  }

  /* ---------------- экраны ---------------- */
  function intro() {
    const best = localStorage.getItem('kk_game_best');
    host.innerHTML = `
      <div class="gcard gintro">
        <p class="quiz-step">ПОЛЕВОЙ СИМУЛЯТОР · 20-Й РАЙОН</p>
        <h2 class="gtitle">Семь ночей</h2>
        <p class="gjp jp">七つの夜</p>
        <p class="lead">Ты гуль, живёшь в самом спокойном районе Токио и очень хочешь остаться в нём человеком —
          хотя бы по привычкам. Семь ночей, каждую ночь один выбор. Следи за тремя шкалами: любая,
          дошедшая до края, заканчивает историю.</p>
        <ul class="grules">
          <li><b>Голод</b> растёт сам по себе. Сбить его можно только одним способом, и он тебе не понравится.</li>
          <li><b>Внимание CCG</b> копится от всего заметного. Обнуляется только осторожностью.</li>
          <li><b>Человечность</b> — то, ради чего всё затевалось. Тратится быстрее, чем набирается.</li>
        </ul>
        ${best ? `<p class="mono gbest">ЛУЧШИЙ ИСХОД: ${best}</p>` : ''}
        <button class="btn solid gbtn" id="g-start"><span>Начать первую ночь</span></button>
      </div>`;
    $('#g-start').addEventListener('click', () => { st = { ...START }; night = 0; start(); });
  }

  function start() {
    picked = null; over = false;
    const N = NIGHTS[night];
    host.innerHTML = `
      <div class="gcard">
        <div class="ghead">
          <span class="quiz-step">НОЧЬ ${String(N.n).padStart(2, '0')} / 07</span>
          <span class="gjp-min jp">${N.jp}</span>
        </div>
        ${meters()}
        <h2 class="gnight">${N.title}</h2>
        <p class="gtext">${N.text}</p>
        <div class="gopts">
          ${N.opts.map((o, i) => `<button class="quiz-opt gopt" data-i="${i}"><b>${'ABC'[i]}</b><span>${o.t}</span></button>`).join('')}
        </div>
        <div class="quiz-prog"><i style="width:${night / NIGHTS.length * 100}%"></i></div>
      </div>`;
    host.querySelectorAll('.gopt').forEach(b => b.addEventListener('click', () => choose(+b.dataset.i)));
  }

  function choose(i) {
    const N = NIGHTS[night], o = N.opts[i];
    const before = { ...st };
    st.h = clamp(st.h + o.h);
    st.s = clamp(st.s + o.s);
    st.l = clamp(st.l + o.l);
    picked = o;

    const dead = st.h >= 100 ? 'hunger' : st.s >= 100 ? 'ccg' : st.l <= 0 ? 'beast' : null;
    const delta = (v, k) => v === 0 ? '' :
      `<span class="gd ${v > 0 ? 'up' : 'dn'}">${k} ${v > 0 ? '+' : ''}${v}</span>`;

    host.innerHTML = `
      <div class="gcard">
        <div class="ghead">
          <span class="quiz-step">ИТОГ НОЧИ ${String(N.n).padStart(2, '0')}</span>
          <span class="gjp-min jp">${N.jp}</span>
        </div>
        ${meters()}
        <p class="glog jp">${o.log}</p>
        <p class="gdeltas">${delta(o.h, 'голод')}${delta(o.s, 'внимание')}${delta(o.l, 'человечность')}</p>
        <button class="btn solid gbtn" id="g-next">
          <span>${dead ? 'посмотреть, чем это кончилось' : (night + 1 >= NIGHTS.length ? 'дожить до утра' : 'следующая ночь')}</span>
        </button>
      </div>`;
    void before;
    $('#g-next').addEventListener('click', () => {
      if (dead) return finish(dead);
      night++;
      if (night >= NIGHTS.length) return finish(survivedKey());
      start();
    });
  }

  function survivedKey() {
    if (st.l >= 70 && st.s <= 40) return 'human';
    if (st.l <= 35) return 'cold';
    return 'grey';
  }

  function finish(key) {
    over = true;
    const e = ENDINGS[key];
    const bad = key === 'hunger' || key === 'ccg' || key === 'beast';
    const rank = { human: 3, cold: 2, grey: 2, hunger: 1, ccg: 1, beast: 0 }[key] || 0;
    const prev = +localStorage.getItem('kk_game_rank') || -1;
    if (rank > prev) {
      localStorage.setItem('kk_game_rank', String(rank));
      localStorage.setItem('kk_game_best', e.t);
    }

    host.innerHTML = `
      <div class="gcard gend ${bad ? 'bad' : 'good'}">
        ${bad ? `<div class="gover">${GAMEOVER_ART}<span class="gover-t">GAME OVER</span></div>` : ''}
        <p class="quiz-step">${bad ? 'ЗАПИСЬ ОБРЫВАЕТСЯ' : 'ЗАПИСЬ ЗАКРЫТА'} · НОЧЬ ${String(NIGHTS[Math.min(night, NIGHTS.length - 1)].n).padStart(2, '0')}</p>
        <p class="gend-jp jp">${e.jp}</p>
        <h2 class="gend-t">${e.t}</h2>
        <p class="lead">${e.d}</p>
        ${meters()}
        <div class="gend-btns">
          <button class="btn solid gbtn" id="g-again"><span>Ещё раз</span></button>
          <a class="btn gbtn" href="characters.html"><span>Открыть картотеку</span></a>
        </div>
      </div>`;
    $('#g-again').addEventListener('click', () => { st = { ...START }; night = 0; start(); });
    if (bad && window.KKtoast) KKtoast('архив принял ещё одну запись');
    void over; void picked;
  }

  intro();
})();
