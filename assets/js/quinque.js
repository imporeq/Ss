/* ============================================================
   ОРУЖЕЙНАЯ CCG — каталог квинке, доспехи, кагуджа
   ============================================================ */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);

  /* ---------------- силуэты оружия ---------------- */
  const FORM = {
    ixa: c => `<path d="M60 12 L68 26 L68 128 L60 140 L52 128 L52 26 Z" fill="${c}" opacity=".9"/>
               <path d="M40 138 h40 v10 h-40z" fill="${c}"/>
               <path d="M56 148 h8 v34 h-8z" fill="${c}" opacity=".7"/>
               <path d="M68 60 L96 78 L68 96" fill="none" stroke="${c}" stroke-width="3"/>`,
    narukami: c => `<path d="M60 8 L66 30 L60 46 L54 30 Z" fill="${c}"/>
               <path d="M57 40 h6 v146 h-6z" fill="${c}" opacity=".85"/>
               <g stroke="${c}" stroke-width="2.6" fill="none">
                 <path d="M60 60 L86 76 L64 84 L92 104"/>
                 <path d="M60 60 L34 76 L56 84 L28 104"/>
               </g>`,
    hammer: c => `<path d="M28 26 h64 v42 h-64z" fill="${c}" opacity=".9"/>
               <path d="M20 34 h8 v26 h-8z M92 34 h8 v26 h-8z" fill="${c}"/>
               <path d="M55 68 h10 v112 h-10z" fill="${c}" opacity=".8"/>
               <path d="M46 178 h28 v10 h-28z" fill="${c}"/>`,
    blade: c => `<path d="M60 10 L70 34 L66 132 L54 132 L50 34 Z" fill="${c}" opacity=".9"/>
               <path d="M38 132 h44 v9 h-44z" fill="${c}"/>
               <path d="M55 141 h10 v44 h-10z" fill="${c}" opacity=".75"/>`,
    twin: c => `<path d="M34 16 L44 36 L40 124 L28 124 L26 36 Z" fill="${c}" opacity=".85"/>
               <path d="M86 16 L94 36 L92 124 L80 124 L76 36 Z" fill="${c}" opacity=".85"/>
               <path d="M16 124 h38 v8 h-38z M66 124 h38 v8 h-38z" fill="${c}"/>
               <path d="M30 132 h8 v46 h-8z M82 132 h8 v46 h-8z" fill="${c}" opacity=".7"/>`,
    knives: c => `<g fill="${c}">
                 ${[0, 1, 2, 3, 4].map(i => {
                   const x = 16 + i * 22, y = 30 + (i % 2) * 26;
                   return `<path d="M${x} ${y} l7 12 l-3 62 l-8 0 l-3 -62 z" opacity="${0.6 + i * 0.08}"/>`;
                 }).join('')}
               </g>
               <g stroke="${c}" stroke-width="1.4" opacity=".5" fill="none">
                 <path d="M10 168 h100 M10 176 h100"/>
               </g>`,
    tentacle: c => `<g fill="none" stroke="${c}" stroke-linecap="round">
                 <path d="M60 188 C 40 140 66 110 40 62 C 30 44 34 26 52 18" stroke-width="11"/>
                 <path d="M60 188 C 78 146 62 116 88 74 C 98 56 96 36 78 26" stroke-width="8" opacity=".8"/>
                 <path d="M60 188 C 46 150 24 136 20 100" stroke-width="6" opacity=".6"/>
               </g>
               <circle cx="60" cy="190" r="9" fill="${c}"/>`,
    shield: c => `<path d="M60 12 L104 32 V96 C104 138 86 168 60 184 C34 168 16 138 16 96 V32 Z"
                 fill="none" stroke="${c}" stroke-width="6"/>
               <path d="M60 34 L88 46 V96 C88 126 76 148 60 160 C44 148 32 126 32 96 V46 Z"
                 fill="${c}" opacity=".18"/>
               <path d="M60 46 L60 160 M36 74 L84 74 M36 108 L84 108" stroke="${c}" stroke-width="3"/>`,
    fan: c => `<g fill="${c}">
                 ${[-52, -30, -8, 14, 36].map((a, i) =>
                   `<path transform="rotate(${a} 60 176)" d="M56 176 L64 176 L${62 - i * 0} 40 L58 40 Z" opacity="${0.55 + i * 0.09}"/>`).join('')}
               </g>
               <circle cx="60" cy="176" r="10" fill="${c}"/>`,
    armor: c => `<path d="M60 10 c13 0 20 9 20 21 c0 9 -4 15 -8 19 l0 8 -24 0 0 -8 c-4 -4 -8 -10 -8 -19 c0 -12 7 -21 20 -21z"
                 fill="none" stroke="${c}" stroke-width="4"/>
               <path d="M48 58 h24 l16 8 4 30 -10 4 -2 -22 -4 44 h-28 l-4 -44 -2 22 -10 -4 4 -30z"
                 fill="none" stroke="${c}" stroke-width="4"/>
               <path d="M16 66 c-6 12 -4 24 4 32 l8 -6z M104 66 c6 12 4 24 -4 32 l-8 -6z"
                 fill="${c}" opacity=".55"/>
               <path d="M46 122 l-4 62 12 0 6 -44 6 44 12 0 -4 -62z" fill="none" stroke="${c}" stroke-width="4"/>
               <path d="M52 74 h16 M50 86 h20 M50 98 h20" stroke="${c}" stroke-width="2.2" opacity=".65"/>
               <circle cx="53" cy="30" r="3.2" fill="${c}"/><circle cx="67" cy="30" r="3.2" fill="${c}"/>
               <path d="M53 40 l14 0" stroke="${c}" stroke-width="2" opacity=".6"/>`,
    mace: c => `<circle cx="60" cy="46" r="30" fill="none" stroke="${c}" stroke-width="5"/>
               <g stroke="${c}" stroke-width="5">
                 ${Array.from({ length: 8 }, (_, i) => {
                   const a = i * Math.PI / 4;
                   return `<path d="M${60 + Math.cos(a) * 30} ${46 + Math.sin(a) * 30}
                                  L${60 + Math.cos(a) * 44} ${46 + Math.sin(a) * 44}"/>`;
                 }).join('')}
               </g>
               <path d="M55 76 h10 v108 h-10z" fill="${c}" opacity=".8"/>`
  };

  const SHAPE = {
    ixa: 'ixa', narukami: 'narukami', kura: 'hammer', yukimura: 'blade', doujima: 'twin',
    scorpion: 'knives', jason: 'tentacle', fueguchi1: 'shield', fueguchi2: 'fan',
    arata: 'armor', tsunagi: 'blade', kuroiwa: 'mace'
  };

  /* ---------------- каталог ---------------- */
  const grid = $('#qgrid');
  if (grid && window.QUINQUE) {
    let filter = 'all';

    const draw = () => {
      const list = QUINQUE.filter(q => filter === 'all' || q.type === filter);
      grid.innerHTML = list.map(q => {
        const k = KAGUNE[q.type] || KAGUNE.none;
        return `<article class="qcard" style="--qc:${k.color}" data-rise>
          <div class="qart">
            <svg viewBox="0 0 120 200" aria-hidden="true">${(FORM[SHAPE[q.id]] || FORM.blade)(k.color)}</svg>
            <span class="qjp jp" aria-hidden="true">${q.jp}</span>
          </div>
          <div class="qbody">
            <span class="qtype mono">${k.ru}${k.jp !== '—' ? ' · ' + k.jp : ''}</span>
            <h3>${q.name}</h3>
            <p class="qform mono">${q.form}</p>
            <p>${q.note}</p>
            <div class="qfoot">
              <span class="mono">${q.owner}</span>
              <span class="mono qrank">${q.rank}</span>
            </div>
          </div>
        </article>`;
      }).join('');
      $('#qcount').textContent = `В ОРУЖЕЙНОЙ: ${String(list.length).padStart(2, '0')} ИЗ ${QUINQUE.length}`;
      if (window.KKwatch) KKwatch(grid);
    };

    document.querySelectorAll('#qfilters .chip').forEach(c => {
      c.addEventListener('click', () => {
        document.querySelectorAll('#qfilters .chip').forEach(x => x.setAttribute('aria-pressed', 'false'));
        c.setAttribute('aria-pressed', 'true');
        filter = c.dataset.f;
        draw();
      });
    });
    draw();
  }

  /* ---------------- кагуджа ---------------- */
  const kk = $('#kakuja');
  if (kk && window.KAKUJA) {
    kk.innerHTML = `
      <p class="lead">${KAKUJA.lead}</p>
      <ol class="kstages">
        ${KAKUJA.stages.map(s => `
          <li data-rise>
            <span class="kn mono">${s.n}</span>
            <h3>${s.t}</h3>
            <p>${s.d}</p>
          </li>`).join('')}
      </ol>
      <p class="mono kknown">ИЗВЕСТНЫЕ СЛУЧАИ: ${KAKUJA.known.join(' · ').toUpperCase()}</p>`;
    if (window.KKwatch) KKwatch(kk);
  }
})();
