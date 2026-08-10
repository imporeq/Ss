/* ============================================================
   КАГУНЕ: разделы типов, круг преимуществ, опросник
   ============================================================ */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);

  /* ---------------- рисунки типов ---------------- */
  const ART = {
    ukaku: c => `
      <svg viewBox="0 0 300 300" aria-hidden="true">
        <g stroke="${c}" fill="none" stroke-linecap="round">
          <path d="M60 250 C 90 170 130 110 210 60" stroke-width="9"/>
          <path d="M60 250 C 100 190 150 150 245 120" stroke-width="6" opacity=".85"/>
          <path d="M60 250 C 110 210 170 190 260 185" stroke-width="4" opacity=".7"/>
          <path d="M60 250 C 95 160 110 95 150 40" stroke-width="4" opacity=".6"/>
        </g>
        <g fill="${c}">
          <path d="M214 44 l12 22 -12 22 -12 -22z" opacity=".95"/>
          <path d="M252 104 l9 17 -9 17 -9 -17z" opacity=".8"/>
          <path d="M268 170 l7 14 -7 14 -7 -14z" opacity=".7"/>
          <path d="M152 24 l8 16 -8 16 -8 -16z" opacity=".6"/>
          <circle cx="60" cy="250" r="10"/>
        </g>
        <g fill="${c}" opacity=".45">
          <circle cx="230" cy="140" r="3"/><circle cx="200" cy="90" r="2.4"/>
          <circle cx="255" cy="210" r="2.6"/><circle cx="180" cy="160" r="2"/>
        </g>
      </svg>`,
    koukaku: c => `
      <svg viewBox="0 0 300 300" aria-hidden="true">
        <path d="M150 30 L245 82 V170 C245 220 200 258 150 275 C100 258 55 220 55 170 V82 Z"
              fill="none" stroke="${c}" stroke-width="9"/>
        <path d="M150 56 L222 96 V168 C222 205 188 236 150 250 C112 236 78 205 78 168 V96 Z"
              fill="${c}" opacity=".14"/>
        <path d="M150 70 L150 250" stroke="${c}" stroke-width="5"/>
        <path d="M150 96 L196 124 M150 96 L104 124 M150 150 L196 178 M150 150 L104 178"
              stroke="${c}" stroke-width="3.4" opacity=".8" fill="none"/>
        <path d="M150 20 L166 44 L150 62 L134 44 Z" fill="${c}"/>
      </svg>`,
    rinkaku: c => `
      <svg viewBox="0 0 300 300" aria-hidden="true">
        <g fill="none" stroke="${c}" stroke-linecap="round">
          <path d="M150 275 C 120 210 140 150 100 100 C 80 76 76 52 96 34" stroke-width="12"/>
          <path d="M150 275 C 170 200 210 176 232 118 C 242 92 236 66 214 52" stroke-width="10" opacity=".85"/>
          <path d="M150 275 C 132 214 84 200 60 156 C 46 130 52 106 76 96" stroke-width="8" opacity=".7"/>
          <path d="M150 275 C 186 216 232 216 258 178" stroke-width="6" opacity=".55"/>
        </g>
        <g fill="${c}">
          <path d="M96 34 l14 -20 -4 26z" opacity=".9"/>
          <path d="M214 52 l20 -14 -12 24z" opacity=".8"/>
          <circle cx="150" cy="278" r="12"/>
        </g>
        <g fill="none" stroke="${c}" stroke-width="2" opacity=".4">
          <path d="M118 200 q14 -8 26 4 M186 208 q14 -10 26 2 M96 150 q14 -8 26 4"/>
        </g>
      </svg>`,
    bikaku: c => `
      <svg viewBox="0 0 300 300" aria-hidden="true">
        <path d="M150 278 C 150 220 160 180 200 150 C 240 120 254 84 240 46"
              fill="none" stroke="${c}" stroke-width="20" stroke-linecap="round" opacity=".22"/>
        <path d="M150 278 C 150 220 160 180 200 150 C 240 120 254 84 240 46"
              fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>
        <path d="M240 46 l22 -26 -6 36 z" fill="${c}"/>
        <g stroke="${c}" stroke-width="3" opacity=".65" fill="none">
          <path d="M158 240 l30 -8 M166 208 l32 -10 M186 176 l30 -14 M212 140 l26 -18 M230 100 l24 -14"/>
        </g>
        <circle cx="150" cy="280" r="11" fill="${c}"/>
      </svg>`
  };

  /* ---------------- разделы типов ---------------- */
  const host = $('#ktypes');
  if (host && window.KAG_PAGE) {
    host.innerHTML = KAG_PAGE.map(k => `
      <section class="ktype" id="${k.id}" style="--kc:${k.color}">
        <div class="wrap ktype-in">
          <div>
            <p class="kicker" style="color:${k.color}"><span class="jp">${k.jp}</span></p>
            <h2>${k.ru}</h2>
            <p class="kjp jp">${k.jp}<span class="kwhere mono">· ${k.where}</span></p>
            <p class="lead">${k.lead}</p>
            <p class="muted" style="font-size:14.5px">${k.text}</p>
            <dl class="kfacts">
              ${Object.entries(k.facts).map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}
            </dl>
            <div class="bars kbars">
              ${Object.entries(k.bars).map(([n, v]) => `
                <div class="b"><span>${n}</span><span class="track"><i data-v="${v}"></i></span><span>${v}</span></div>`).join('')}
            </div>
            <p class="mono" style="margin-top:22px;font-size:10px;letter-spacing:.2em;opacity:.6">
              НОСИТЕЛИ: ${k.who.join(' · ')}
            </p>
          </div>
          <div class="ktype-art" data-jp="${k.jp}">${ART[k.id](k.color)}</div>
        </div>
      </section>`).join('');

    /* полоски заполняются при появлении */
    const bio = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        bio.unobserve(e.target);
        e.target.querySelectorAll('.bars i').forEach((el, i) =>
          setTimeout(() => { el.style.width = el.dataset.v + '%'; }, i * 90));
      });
    }, { threshold: .3 });
    host.querySelectorAll('.ktype').forEach(s => bio.observe(s));
  }

  /* ---------------- круг преимуществ ---------------- */
  const svg = $('#cycle-svg'), note = $('#cycle-note');
  if (svg) {
    const N = {
      ukaku:   { x: 260, y: 70 },
      koukaku: { x: 430, y: 210 },
      rinkaku: { x: 260, y: 350 },
      bikaku:  { x: 90,  y: 210 }
    };
    const meta = id => KAG_PAGE.find(k => k.id === id);
    const arcs = [
      ['ukaku', 'koukaku', 'M297 101 Q400 92 396 179'],
      ['koukaku', 'rinkaku', 'M396 241 Q404 330 297 319'],
      ['rinkaku', 'bikaku', 'M223 319 Q116 330 124 241'],
      ['bikaku', 'ukaku', 'M124 179 Q116 92 223 101']
    ];

    svg.innerHTML = `
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor"/>
        </marker>
      </defs>
      <g stroke="currentColor" fill="none" stroke-width="1.6" opacity=".45" color="#8a837c">
        ${arcs.map(a => `<path d="${a[2]}" marker-end="url(#ah)"/>`).join('')}
      </g>
      ${Object.entries(N).map(([id, p]) => {
        const m = meta(id);
        return `<g class="node" data-id="${id}">
          <circle cx="${p.x}" cy="${p.y}" r="48" fill="none" stroke="${m.color}" stroke-width="2"/>
          <circle cx="${p.x}" cy="${p.y}" r="48" fill="${m.color}" opacity=".10"/>
          <text x="${p.x}" y="${p.y + 4}" text-anchor="middle" font-family="serif" font-size="30" fill="${m.color}">${m.jp}</text>
          <text x="${p.x}" y="${p.y + 70}" text-anchor="middle" fill="currentColor" opacity=".8">${m.ru}</text>
        </g>`;
      }).join('')}`;

    svg.querySelectorAll('.node').forEach(n => {
      const id = n.dataset.id, m = meta(id);
      const say = () => {
        note.style.color = m.color;
        note.textContent = `${m.ru.toUpperCase()} → СИЛЬНЕЕ: ${m.facts['СИЛЬНЕЕ ЧЕМ'].toUpperCase()} · СЛАБЕЕ: ${m.facts['СЛАБЕЕ ПРОТИВ'].toUpperCase()}`;
      };
      n.addEventListener('mouseenter', say);
      n.addEventListener('focus', say);
      n.addEventListener('click', () => { location.hash = '#' + id; });
      n.setAttribute('tabindex', '0');
    });
  }

  /* ---------------- опросник ---------------- */
  const box = $('#quiz-box');
  if (box && window.QUIZ) {
    let step = 0;
    const score = { ukaku: 0, koukaku: 0, rinkaku: 0, bikaku: 0 };

    function drawQ() {
      const q = QUIZ[step];
      box.innerHTML = `
        <p class="quiz-step">ВОПРОС ${String(step + 1).padStart(2, '0')} / ${String(QUIZ.length).padStart(2, '0')}</p>
        <p class="quiz-q">${q.q}</p>
        <div class="quiz-opts">
          ${q.a.map((o, i) => `<button class="quiz-opt" data-k="${o.k}"><b>${String.fromCharCode(65 + i)}</b><span>${o.t}</span></button>`).join('')}
        </div>
        <div class="quiz-prog"><i style="width:${step / QUIZ.length * 100}%"></i></div>`;
      box.querySelectorAll('.quiz-opt').forEach(b => b.addEventListener('click', () => {
        score[b.dataset.k]++;
        step++;
        step < QUIZ.length ? drawQ() : drawRes();
      }));
    }

    function drawRes() {
      const win = Object.keys(score).reduce((a, b) => score[a] >= score[b] ? a : b);
      const m = KAG_PAGE.find(k => k.id === win);
      const owners = m.who.slice(0, 3).join(', ');
      box.style.setProperty('--kc', m.color);
      box.innerHTML = `
        <div class="quiz-res">
          <p class="quiz-step">РЕЗУЛЬТАТ АНАЛИЗА RC-КЛЕТОК</p>
          <p class="rjp jp" style="color:${m.color}">${m.jp}</p>
          <h3 style="color:${m.color}">${m.ru}</h3>
          <p class="lead" style="margin-inline:auto">${QUIZ_RESULT[win].t}</p>
          <p class="mono" style="font-size:10px;letter-spacing:.2em;opacity:.6;margin-top:20px">
            В ОДНОЙ КОМПАНИИ С: ${owners.toUpperCase()}
          </p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:28px">
            <a class="btn solid" href="#${win}"><span>Читать про ${m.ru.toLowerCase()}</span></a>
            <button class="btn" id="quiz-again"><span>Пройти заново</span></button>
          </div>
        </div>`;
      box.querySelector('#quiz-again').addEventListener('click', () => {
        step = 0; Object.keys(score).forEach(k => score[k] = 0); drawQ();
      });
    }

    drawQ();
  }
})();
