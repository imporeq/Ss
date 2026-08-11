/* ============================================================
   ОРГАНИЗАЦИИ — эмблемы нарисованы здесь же
   ============================================================ */
(function () {
  'use strict';
  const host = document.querySelector('#factions');
  if (!host || !window.FACTIONS) return;

  const EMBLEM = {
    /* CCG — щит и кейс с квинке */
    ccg: c => `
      <path d="M60 8 L108 28 V64 C108 92 88 110 60 118 C32 110 12 92 12 64 V28 Z"
            fill="none" stroke="${c}" stroke-width="4"/>
      <path d="M60 20 L96 35 V64 C96 84 82 98 60 105 C38 98 24 84 24 64 V35 Z"
            fill="${c}" opacity=".12"/>
      <path d="M60 34 v58 M38 58 h44" stroke="${c}" stroke-width="5" stroke-linecap="square"/>
      <path d="M44 42 h32 v10 h-32z" fill="${c}" opacity=".85"/>
      <circle cx="60" cy="58" r="5" fill="#0a0908" stroke="${c}" stroke-width="2"/>`,
    /* Аогири — голое дерево */
    aogiri: c => `
      <path d="M60 118 V62" stroke="${c}" stroke-width="7" stroke-linecap="round"/>
      <g stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round">
        <path d="M60 66 C 46 54 40 40 42 20"/>
        <path d="M60 62 C 74 50 82 38 80 16"/>
        <path d="M60 78 C 44 70 30 62 22 44"/>
        <path d="M60 74 C 78 66 92 58 98 40"/>
      </g>
      <g stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".75">
        <path d="M42 20 l-8 -10 M42 20 l10 -12 M80 16 l9 -9 M80 16 l-10 -10
                 M22 44 l-11 -5 M98 40 l11 -6"/>
      </g>
      <path d="M40 118 h40" stroke="${c}" stroke-width="3" opacity=".6"/>`,
    /* Антейку — чашка */
    anteiku: c => `
      <circle cx="60" cy="62" r="52" fill="none" stroke="${c}" stroke-width="3" opacity=".55"/>
      <path d="M32 52 h50 l-6 34 c-1 7 -7 12 -14 12 h-10 c-7 0 -13 -5 -14 -12z"
            fill="none" stroke="${c}" stroke-width="4"/>
      <ellipse cx="57" cy="52" rx="25" ry="7" fill="${c}" opacity=".3"/>
      <path d="M82 60 c14 -2 16 18 2 22" fill="none" stroke="${c}" stroke-width="4"/>
      <path d="M28 104 h60" stroke="${c}" stroke-width="3"/>
      <g stroke="${c}" stroke-width="2.4" fill="none" opacity=".7">
        <path d="M48 38 c-5 -7 4 -11 -2 -18 M60 34 c-5 -8 5 -12 -1 -20 M72 38 c-5 -7 4 -11 -2 -18"/>
      </g>`,
    /* Клоуны — маска Пьеро: три конца колпака, слеза, растянутая улыбка */
    clowns: c => `
      <path d="M26 44 L12 6 L40 26 M60 34 L60 0 M94 44 L108 6 L80 26"
            fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="12" cy="6" r="5" fill="${c}"/><circle cx="60" cy="2" r="5" fill="${c}"/>
      <circle cx="108" cy="6" r="5" fill="${c}"/>
      <path d="M60 30 C 92 30 100 56 100 74 C 100 100 82 120 60 120 C 38 120 20 100 20 74 C 20 56 28 30 60 30 Z"
            fill="none" stroke="${c}" stroke-width="4"/>
      <path d="M34 66 q12 -14 24 0 q-12 8 -24 0z" fill="${c}"/>
      <path d="M62 66 q12 -14 24 0 q-12 8 -24 0z" fill="${c}"/>
      <path d="M46 74 l-4 18 6 -4 z" fill="${c}" opacity=".9"/>
      <path d="M34 92 C 44 108 76 108 86 92" fill="none" stroke="${c}" stroke-width="4"/>
      <path d="M34 92 l-6 -6 M86 92 l6 -6" stroke="${c}" stroke-width="3"/>`,

    /* Вашу — родовой герб */
    washuu: c => `
      <circle cx="60" cy="62" r="50" fill="none" stroke="${c}" stroke-width="5"/>
      <circle cx="60" cy="62" r="38" fill="none" stroke="${c}" stroke-width="2" opacity=".5"/>
      <path d="M60 26 L74 62 L60 98 L46 62 Z" fill="${c}" opacity=".85"/>
      <path d="M24 62 L60 48 L96 62 L60 76 Z" fill="none" stroke="${c}" stroke-width="3"/>
      <circle cx="60" cy="62" r="8" fill="#0a0908" stroke="${c}" stroke-width="3"/>
      <g stroke="${c}" stroke-width="2" opacity=".55">
        <path d="M60 12 v10 M60 102 v10 M10 62 h10 M100 62 h10"/>
      </g>`,
    /* Quinx — шестигранник и игла */
    quinx: c => `
      <path d="M60 10 L104 36 V88 L60 114 L16 88 V36 Z" fill="none" stroke="${c}" stroke-width="4"/>
      <path d="M60 26 L90 44 V80 L60 98 L30 80 V44 Z" fill="${c}" opacity=".12"/>
      <path d="M60 30 v50" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
      <path d="M54 80 h12 l-6 14 z" fill="${c}"/>
      <circle cx="60" cy="30" r="7" fill="none" stroke="${c}" stroke-width="3"/>
      <path d="M38 62 h-14 M96 62 h-14" stroke="${c}" stroke-width="2.4" opacity=".7"/>`,
    /* V — то, чего нет */
    v: c => `
      <circle cx="60" cy="62" r="50" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="9 7"/>
      <path d="M34 34 L60 92 L86 34" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>
      <path d="M18 100 L102 24" stroke="${c}" stroke-width="2.5" opacity=".5"/>`
  };

  const COLOR = {
    ccg:'#6fa8d6', aogiri:'#b0121a', anteiku:'#c9a227', clowns:'#8e2bd1',
    washuu:'#8a8f94', quinx:'#2b8ad1', v:'#5b544c'
  };

  host.innerHTML = FACTIONS.map((f, i) => `
    <article class="fcard" id="${f.id}" style="--fc:${COLOR[f.id] || '#b0121a'}" data-rise>
      <div class="fmark">
        <svg viewBox="0 0 120 126" aria-hidden="true">${(EMBLEM[f.id] || EMBLEM.v)(COLOR[f.id] || '#b0121a')}</svg>
        <span class="fjp jp" aria-hidden="true">${f.jp}</span>
      </div>
      <div class="fbody">
        <span class="fkind mono">${String(i + 1).padStart(2, '0')} · ${f.kind.toUpperCase()}</span>
        <h2>${f.name}</h2>
        <p class="ffull">${f.full}</p>
        <p class="fgoal jp">「${f.goal}」</p>
        <p class="ftext">${f.text}</p>
        <dl class="ffacts">
          ${Object.entries(f.facts).map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}
          <div><dt>БАЗА</dt><dd>${f.base}</dd></div>
          <div><dt>ВО ГЛАВЕ</dt><dd>${f.head}</dd></div>
        </dl>
        ${f.who.length ? `<p class="fwho mono">В КАРТОТЕКЕ: ${f.who.map(n =>
          `<a href="characters.html#${(PEOPLE.find(p => p.name === n) || {}).id || ''}">${n.toUpperCase()}</a>`).join(' · ')}</p>` : ''}
      </div>
    </article>`).join('');

  if (window.KKwatch) KKwatch(host);
})();
