/* ============================================================
   ОТРЫВКИ — кадры рисуются здесь же, из примитивов.
   Ни одного заимствованного изображения: только линии и заливки.
   ============================================================ */
(function () {
  'use strict';
  const host = document.querySelector('#manga');
  if (!host || !window.MANGA) return;

  /* штриховка дождя / скорости */
  const hatch = (n, x0, y0, dx, len, op) => {
    let s = `<g stroke="#e6e0d4" stroke-width="1" opacity="${op}">`;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * dx;
      s += `<path d="M${x} ${y0} L${x - len * .35} ${y0 + len}"/>`;
    }
    return s + '</g>';
  };
  /* «взрыв» скоростных линий из точки */
  const burst = (cx, cy, n, r1, r2, op) => {
    let s = `<g stroke="#e6e0d4" stroke-width="1.4" opacity="${op}">`;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      s += `<path d="M${(cx + Math.cos(a) * r1).toFixed(1)} ${(cy + Math.sin(a) * r1).toFixed(1)}
                    L${(cx + Math.cos(a) * r2).toFixed(1)} ${(cy + Math.sin(a) * r2).toFixed(1)}"/>`;
    }
    return s + '</g>';
  };

  const ART = {
    /* ночная улица, две фигуры вдалеке */
    street: `
      <rect width="400" height="300" fill="#100e0d"/>
      <path d="M0 300 L165 150 L235 150 L400 300 Z" fill="#1b1817"/>
      <g stroke="#4a443e" stroke-width="2" stroke-dasharray="14 18">
        <path d="M200 300 L200 152"/>
      </g>
      <path d="M40 300 L40 60 L96 60" stroke="#3a3531" stroke-width="4" fill="none"/>
      <circle cx="104" cy="62" r="13" fill="#e8dfc9" opacity=".9"/>
      <path d="M104 62 L44 300 L176 300 Z" fill="#e8dfc9" opacity=".07"/>
      <g fill="#0a0908">
        <path d="M196 152 c5 0 8 3 8 8 l-2 22 3 24 -4 0 -4 -20 -4 20 -4 0 3 -24 -2 -22 c0 -5 3 -8 6 -8z"/>
        <path d="M214 150 c5 0 8 3 8 8 l-2 24 3 24 -4 0 -4 -20 -4 20 -4 0 3 -24 -2 -24 c0 -5 3 -8 6 -8z"/>
      </g>
      ${hatch(22, 10, 0, 19, 60, .12)}`,

    /* фигура склоняется над лежащим */
    lean: `
      <rect width="400" height="300" fill="#0d0b0a"/>
      ${burst(150, 150, 34, 92, 260, .13)}
      <path d="M20 262 C 90 250 150 252 210 262 L210 274 L20 274 Z" fill="#171413"/>
      <path d="M36 258 c40 -12 96 -12 140 2 l0 10 c-50 -10 -100 -10 -140 2z" fill="#0a0908"/>
      <g fill="#0a0908">
        <path d="M262 60 c22 0 34 16 34 38 c0 20 -10 34 -18 40 l14 96 -18 44 -8 0 4 -46 -10 -40 -12 42 6 44 -9 0 -16 -46 12 -94 c-9 -7 -17 -20 -17 -40 c0 -22 12 -38 38 -38z"/>
      </g>
      <path d="M244 96 q18 10 36 0" stroke="#b0121a" stroke-width="3" fill="none"/>
      <circle cx="252" cy="88" r="5" fill="#ff2634"/>
      <g fill="#b0121a" opacity=".9">
        <path d="M196 250 c14 -6 26 -2 34 8 c-14 6 -26 4 -34 -8z"/>
        <circle cx="180" cy="266" r="4"/><circle cx="166" cy="258" r="2.5"/>
      </g>`,

    /* падающие балки */
    beams: `
      <rect width="400" height="300" fill="#100e0d"/>
      ${hatch(30, -20, -10, 15, 330, .1)}
      <g fill="#2b2724" stroke="#6d665e" stroke-width="2">
        <path d="M40 -20 L96 -20 L286 210 L230 210 Z"/>
        <path d="M186 -20 L232 -20 L392 176 L346 176 Z"/>
      </g>
      <g stroke="#0a0908" stroke-width="2" opacity=".7">
        <path d="M60 10 L246 236 M76 -6 L262 220"/>
      </g>
      ${burst(230, 214, 26, 30, 150, .5)}
      <path d="M230 214 m-46 0 a46 34 0 1 0 92 0 a46 34 0 1 0 -92 0" fill="#e8e2d6" opacity=".9"/>
      <path d="M230 214 m-26 0 a26 19 0 1 0 52 0 a26 19 0 1 0 -52 0" fill="#b0121a"/>`,

    /* больничная палата */
    ward: `
      <rect width="400" height="300" fill="#141210"/>
      <g stroke="#e8dfc9" stroke-width="9" opacity=".14">
        <path d="M250 20 L390 20 M250 44 L390 44 M250 68 L390 68 M250 92 L390 92 M250 116 L390 116"/>
      </g>
      <rect x="246" y="10" width="146" height="120" fill="none" stroke="#3c3733" stroke-width="3"/>
      <rect x="30" y="180" width="230" height="18" fill="#2a2725"/>
      <rect x="30" y="198" width="16" height="70" fill="#22201e"/>
      <rect x="244" y="198" width="16" height="70" fill="#22201e"/>
      <path d="M40 180 c40 -22 120 -26 180 -6 l0 6 z" fill="#d8d2c6" opacity=".85"/>
      <ellipse cx="72" cy="164" rx="26" ry="18" fill="#e6e0d4" opacity=".9"/>
      <circle cx="70" cy="160" r="13" fill="#1b1817"/>
      <path d="M320 150 L320 268" stroke="#4a443e" stroke-width="3"/>
      <path d="M306 146 h28 v34 h-28z" fill="#2c2926" stroke="#5b544c" stroke-width="2"/>
      <path d="M320 180 C 300 210 286 200 262 186" stroke="#5b544c" stroke-width="2" fill="none"/>`,

    /* тарелка, которую больше нельзя */
    plate: `
      <rect width="400" height="300" fill="#0f0d0c"/>
      ${burst(200, 160, 30, 70, 240, .12)}
      <ellipse cx="200" cy="176" rx="112" ry="42" fill="#1d1a18"/>
      <ellipse cx="200" cy="170" rx="112" ry="42" fill="#2a2622" stroke="#6d665e" stroke-width="2"/>
      <ellipse cx="200" cy="168" rx="70" ry="24" fill="#191614"/>
      <path d="M172 160 c18 -12 42 -10 58 4 c-20 10 -44 8 -58 -4z" fill="#7d0d13"/>
      <g stroke="#6d665e" stroke-width="3" fill="none">
        <path d="M92 116 L92 168 M84 116 L84 140 M100 116 L100 140"/>
        <path d="M306 116 c10 8 10 30 -2 34 l0 18"/>
      </g>
      <g fill="#b0121a" opacity=".85">
        <circle cx="150" cy="214" r="4"/><circle cx="166" cy="226" r="2.6"/><circle cx="136" cy="228" r="2"/>
      </g>`,

    /* зеркало и один красный глаз */
    mirror: `
      <rect width="400" height="300" fill="#0c0b0a"/>
      <rect x="86" y="20" width="228" height="260" fill="#141211" stroke="#4a443e" stroke-width="4"/>
      <path d="M200 66 c46 0 70 34 70 80 c0 54 -32 96 -70 96 s-70 -42 -70 -96 c0 -46 24 -80 70 -80z" fill="#1e1b19"/>
      <path d="M130 132 c0 -56 28 -78 70 -78 s70 22 70 78 c-12 -30 -30 -42 -70 -42 s-58 12 -70 42z" fill="#0a0908"/>
      <ellipse cx="168" cy="150" rx="17" ry="9" fill="#d8d2c6" opacity=".55"/>
      <circle cx="168" cy="150" r="6" fill="#141211"/>
      <ellipse cx="232" cy="150" rx="17" ry="9" fill="#0a0605"/>
      <circle cx="232" cy="150" r="7" fill="#ff2634"/>
      <circle cx="232" cy="150" r="2.6" fill="#2a0407"/>
      <g stroke="#ff2634" stroke-width="1.2" fill="none" opacity=".8">
        <path d="M250 146 q16 -8 30 -2 M250 158 q18 8 28 22 M214 142 q-12 -10 -10 -24"/>
      </g>
      <g stroke="#e8e2d6" stroke-width="1.6" opacity=".5">
        <path d="M300 40 L262 96 L286 120 L248 190"/>
      </g>`,

    /* дверь кофейни */
    door: `
      <rect width="400" height="300" fill="#0e0c0b"/>
      <rect x="118" y="24" width="164" height="276" fill="#1a1614" stroke="#5b4a38" stroke-width="4"/>
      <rect x="138" y="52" width="124" height="120" fill="#e8c98a" opacity=".16" stroke="#5b4a38" stroke-width="3"/>
      <path d="M138 172 L100 300 L300 300 L262 172 Z" fill="#e8c98a" opacity=".07"/>
      <circle cx="256" cy="196" r="7" fill="#8a7550"/>
      <rect x="150" y="196" width="100" height="34" fill="#12100f" stroke="#5b4a38" stroke-width="2"/>
      <text x="200" y="219" text-anchor="middle" font-family="serif" font-size="17" fill="#d8c9a8">あんていく</text>
      <g stroke="#8a7550" stroke-width="2" fill="none">
        <path d="M288 40 c0 -12 10 -18 18 -12 c8 6 6 20 -4 24"/>
        <circle cx="304" cy="60" r="9" fill="#8a7550"/>
      </g>
      ${hatch(10, 300, 70, 12, 40, .18)}`,

    /* чашка крупно */
    cup: `
      <rect width="400" height="300" fill="#100e0d"/>
      ${burst(200, 190, 24, 96, 210, .1)}
      <path d="M118 138 h164 l-16 118 c-2 14 -14 24 -28 24 h-76 c-14 0 -26 -10 -28 -24z"
            fill="#1e1b19" stroke="#cfc7b8" stroke-width="4"/>
      <ellipse cx="200" cy="138" rx="82" ry="22" fill="#0a0807" stroke="#cfc7b8" stroke-width="4"/>
      <ellipse cx="200" cy="140" rx="66" ry="16" fill="#3a2214"/>
      <path d="M284 162 c34 -6 42 44 6 56" fill="none" stroke="#cfc7b8" stroke-width="6"/>
      <path d="M96 284 h208" stroke="#cfc7b8" stroke-width="3" opacity=".5"/>
      <g stroke="#cfc7b8" stroke-width="2.4" fill="none" opacity=".65">
        <path d="M172 108 c-12 -16 8 -26 -4 -44 M200 100 c-12 -18 10 -28 -2 -48 M230 108 c-12 -16 8 -26 -4 -44"/>
      </g>`,

    /* стойка и силуэт управляющего */
    counter: `
      <rect width="400" height="300" fill="#100e0d"/>
      <g fill="#1b1817">
        <rect x="0" y="40" width="400" height="10"/>
        <rect x="0" y="96" width="400" height="10"/>
        <rect x="0" y="152" width="400" height="10"/>
      </g>
      <g fill="#2c2724">
        ${[20, 56, 92, 300, 336].map(x => `<rect x="${x}" y="10" width="20" height="30" rx="3"/>`).join('')}
        ${[24, 60, 320, 356].map(x => `<rect x="${x}" y="64" width="18" height="32" rx="3"/>`).join('')}
      </g>
      <path d="M0 236 h400 v10 h-400z" fill="#4a3524"/>
      <path d="M0 246 h400 v54 h-400z" fill="#241d17"/>
      <g fill="#0a0908">
        <path d="M188 116 c20 0 30 14 30 32 c0 14 -8 24 -14 28 l10 60 -52 0 10 -60 c-8 -6 -14 -14 -14 -28 c0 -18 10 -32 30 -32z"/>
      </g>
      <path d="M170 148 q18 8 36 0" stroke="#6d665e" stroke-width="2" fill="none"/>
      <ellipse cx="286" cy="230" rx="22" ry="7" fill="#2c2724"/>
      <path d="M270 214 h32 l-4 16 h-24z" fill="#cfc7b8"/>
      <g stroke="#cfc7b8" stroke-width="1.8" fill="none" opacity=".55">
        <path d="M280 206 c-8 -10 6 -16 -2 -28 M294 206 c-8 -10 6 -16 -2 -28"/>
      </g>`,

    /* стул под лампой */
    chair: `
      <rect width="400" height="300" fill="#0b0a09"/>
      <path d="M200 0 L200 44" stroke="#4a443e" stroke-width="3"/>
      <path d="M182 44 h36 l10 20 h-56z" fill="#2c2926"/>
      <circle cx="200" cy="72" r="11" fill="#fff6dc"/>
      <path d="M200 72 L84 300 L316 300 Z" fill="#fff6dc" opacity=".08"/>
      <path d="M150 176 h100 l10 14 h-120z" fill="#3c3733" stroke="#6d665e" stroke-width="3"/>
      <g stroke="#6d665e" stroke-width="6" fill="none" stroke-linecap="round">
        <path d="M168 176 v-70 M232 176 v-70"/>
        <path d="M168 112 h64 M168 134 h64 M168 156 h64"/>
        <path d="M158 192 L148 262 M242 192 L252 262 M176 192 L172 258 M224 192 L228 258"/>
      </g>
      <ellipse cx="200" cy="272" rx="86" ry="16" fill="#000" opacity=".6"/>
      <g stroke="#2a2724" stroke-width="2" opacity=".8">
        <path d="M0 258 h400 M0 282 h400 M60 250 v50 M140 250 v50 M260 250 v50 M340 250 v50"/>
      </g>
      <circle cx="200" cy="290" r="12" fill="#0a0908" stroke="#2a2724" stroke-width="2"/>`,

    /* ухо и сороконожка */
    ear: `
      <rect width="400" height="300" fill="#0d0b0a"/>
      ${burst(150, 150, 28, 84, 240, .12)}
      <path d="M150 40 c56 0 88 44 88 104 c0 62 -34 116 -84 116 c-24 0 -34 -18 -30 -36 c4 -18 18 -26 18 -44
               c0 -18 -14 -22 -14 -44 c0 -22 22 -22 22 -46 c0 -18 -20 -26 -34 -18 c6 -22 18 -32 34 -32z"
            fill="#d8cabc" stroke="#5b544c" stroke-width="3"/>
      <path d="M150 96 c26 0 38 22 38 48 c0 30 -16 58 -38 62 c14 -22 20 -40 20 -60 c0 -20 -8 -36 -20 -50z"
            fill="#1b1614"/>
      <g stroke="#7d0d13" stroke-width="3" fill="none">
        <path d="M162 150 C 210 140 250 168 296 150 C 330 138 356 152 380 140"/>
      </g>
      <g fill="#25090c" stroke="#ff2634" stroke-width=".8">
        ${Array.from({ length: 16 }, (_, i) => {
          const x = 170 + i * 14, y = 150 + Math.sin(i * .8) * 12;
          return `<ellipse cx="${x}" cy="${y.toFixed(1)}" rx="8" ry="6"/>`;
        }).join('')}
      </g>
      <g stroke="#8a0e16" stroke-width="1.6">
        ${Array.from({ length: 16 }, (_, i) => {
          const x = 170 + i * 14, y = 150 + Math.sin(i * .8) * 12;
          return `<path d="M${x} ${(y - 6).toFixed(1)} l-4 -9 M${x} ${(y + 6).toFixed(1)} l-4 9"/>`;
        }).join('')}
      </g>`,

    /* белые волосы */
    white: `
      <rect width="400" height="300" fill="#0a0908"/>
      ${burst(200, 130, 40, 60, 280, .22)}
      <g stroke="#3c3733" stroke-width="4" fill="none">
        <path d="M84 40 c30 30 30 60 0 90 M316 40 c-30 30 -30 60 0 90"/>
      </g>
      <g fill="#12100f">
        <path d="M200 92 c30 0 46 22 46 50 c0 22 -12 38 -22 44 l16 114 -80 0 16 -114 c-10 -6 -22 -22 -22 -44
                 c0 -28 16 -50 46 -50z"/>
      </g>
      <path d="M156 128 c-4 -44 20 -64 44 -64 s48 20 44 64 c-6 -16 -10 -26 -18 -30 c-14 10 -42 12 -54 0
               c-8 6 -12 16 -16 30z" fill="#f2ede2"/>
      <g stroke="#f2ede2" stroke-width="3" stroke-linecap="round">
        <path d="M164 92 L148 58 M180 82 L172 44 M200 78 L204 38 M220 82 L232 46 M238 94 L256 62"/>
      </g>
      <path d="M170 142 q12 -6 24 -1 l0 5 q-12 -3 -24 2z" fill="#5b544c"/>
      <path d="M206 141 q12 -5 24 1 l0 6 q-12 -5 -24 -2z" fill="#0a0605"/>
      <circle cx="219" cy="145" r="5" fill="#ff2634"/>
      <circle cx="219" cy="145" r="10" fill="#ff2634" opacity=".22"/>
      <path d="M186 176 q14 5 28 0" stroke="#3c3733" stroke-width="2.4" fill="none"/>`
  };

  /* ---------------- сборка страниц ---------------- */
  host.innerHTML = MANGA.map(sc => `
    <article class="mscene" id="${sc.id}">
      <header class="mscene-head">
        <span class="mscene-n mono">ОТРЫВОК ${sc.n} · ${sc.arc.toUpperCase()}</span>
        <h2>${sc.title}</h2>
        <p class="mscene-jp jp">${sc.jp}</p>
        <p class="lead">${sc.lead}</p>
      </header>
      <div class="mpage">
        ${sc.panels.map((pn, i) => `
          <figure class="mpanel${pn.wide ? ' wide' : ''}" data-rise data-d="${i}">
            <div class="mart">
              <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                ${ART[pn.art] || ''}
              </svg>
              <span class="mtone" aria-hidden="true"></span>
              ${pn.bubble ? `<span class="mbubble ${pn.bubble.tail}"
                    style="left:${pn.bubble.x}%;top:${pn.bubble.y}%">${pn.bubble.t}</span>` : ''}
              ${pn.sfx ? `<span class="msfx jp" style="left:${pn.sfx.x}%;top:${pn.sfx.y}%;
                    transform:rotate(${pn.sfx.rot}deg)">${pn.sfx.t}</span>` : ''}
            </div>
            ${pn.cap ? `<figcaption>${pn.cap}</figcaption>` : ''}
          </figure>`).join('')}
      </div>
    </article>`).join('');

  if (window.KKwatch) KKwatch(host);
})();
