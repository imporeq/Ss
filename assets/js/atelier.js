/* ============================================================
   АТЕЛЬЕ HySy — конструктор маски (чистый SVG)
   ============================================================ */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const stage = $('#stage');
  if (!stage) return;

  const COLORS = [
    { id: 'bone',  c: '#ddd6c8', s: '#2a2724', n: 'кость' },
    { id: 'ink',   c: '#1c1a18', s: '#c9c2b6', n: 'смоль' },
    { id: 'blood', c: '#7d0d13', s: '#e6ded0', n: 'кровь' },
    { id: 'steel', c: '#4d5459', s: '#cdd3d6', n: 'сталь' },
    { id: 'gold',  c: '#8a6a20', s: '#f0e2bd', n: 'латунь' },
    { id: 'plum',  c: '#3c2246', s: '#d9c7e4', n: 'слива' },
    { id: 'moss',  c: '#2f3f2c', s: '#cbd8c2', n: 'мох' },
    { id: 'rust',  c: '#7a3a1c', s: '#eccdb4', n: 'ржавь' }
  ];

  const state = { base: 'jaw', eyes: 'one', pattern: 'halftone', extra: 'zipper', color: 'bone', name: 'БЕЗЫМЯННЫЙ' };

  const OUT = 'M150 24 C 212 24 246 66 246 134 C 246 236 206 334 150 364 C 94 334 54 236 54 134 C 54 66 88 24 150 24 Z';

  /* ---------------- сборка ---------------- */
  function build(forExport) {
    const col = COLORS.find(c => c.id === state.color);
    const base = col.c, line = col.s;
    const uid = forExport ? 'x' : 'm';

    const patterns = {
      none: '',
      halftone: `<rect x="0" y="0" width="300" height="380" fill="url(#dots-${uid})" clip-path="url(#clip-${uid})" opacity=".5"/>`,
      stripes: `<rect x="0" y="0" width="300" height="380" fill="url(#str-${uid})" clip-path="url(#clip-${uid})" opacity=".45"/>`,
      crack: `<g clip-path="url(#clip-${uid})" stroke="${line}" stroke-width="1.6" fill="none" opacity=".7">
                <path d="M150 26 L136 92 L158 130 L128 190 L148 236 L120 300"/>
                <path d="M136 92 L96 104 M158 130 L206 118 M128 190 L84 206 M148 236 L200 254"/>
                <path d="M246 140 L214 168 L226 214"/>
              </g>`
    };

    const eyes = {
      round: `<circle cx="106" cy="150" r="21" fill="#080606"/><circle cx="194" cy="150" r="21" fill="#080606"/>
              <circle cx="106" cy="150" r="21" fill="none" stroke="${line}" stroke-width="2.5"/>
              <circle cx="194" cy="150" r="21" fill="none" stroke="${line}" stroke-width="2.5"/>`,
      slit: `<path d="M78 152 L134 138 L134 160 L78 166 Z" fill="#080606" stroke="${line}" stroke-width="2"/>
             <path d="M222 152 L166 138 L166 160 L222 166 Z" fill="#080606" stroke="${line}" stroke-width="2"/>`,
      one: `<path d="M76 150 L136 134 L136 168 L76 172 Z" fill="#080606" stroke="${line}" stroke-width="2"/>
            <path d="M166 128 L228 146 L226 176 L166 172 Z" fill="${base}" stroke="${line}" stroke-width="2"/>
            <path d="M170 134 L222 152 M170 148 L222 166" stroke="${line}" stroke-width="1.4" opacity=".7"/>`,
      mesh: `<g fill="none" stroke="${line}" stroke-width="1.4">
               <circle cx="106" cy="150" r="22"/><circle cx="194" cy="150" r="22"/>
             </g>
             <circle cx="106" cy="150" r="22" fill="url(#mesh-${uid})"/>
             <circle cx="194" cy="150" r="22" fill="url(#mesh-${uid})"/>`
    };

    const bases = {
      plate: `<path d="M60 214 C 100 226 200 226 240 214" fill="none" stroke="${line}" stroke-width="2" opacity=".6"/>`,
      beak: `<path d="M150 176 L214 262 L150 316 L86 262 Z" fill="${base}" stroke="${line}" stroke-width="3"/>
             <path d="M150 176 L150 316" stroke="${line}" stroke-width="2" opacity=".7"/>
             <path d="M108 262 L192 262" stroke="${line}" stroke-width="1.6" opacity=".5"/>`,
      jaw: `<path d="M74 244 C 110 232 190 232 226 244 L226 262 C 190 250 110 250 74 262 Z" fill="${line}" opacity=".9"/>
            <g fill="${base}">
              ${Array.from({ length: 9 }, (_, i) => {
                const x = 82 + i * 17;
                return `<path d="M${x} 250 L${x + 8} 250 L${x + 4} 268 Z"/>`;
              }).join('')}
            </g>
            <path d="M74 300 C 110 312 190 312 226 300" fill="none" stroke="${line}" stroke-width="2.4"/>
            <g fill="${line}">
              ${Array.from({ length: 8 }, (_, i) => {
                const x = 90 + i * 17;
                return `<path d="M${x} 300 L${x + 8} 300 L${x + 4} 286 Z"/>`;
              }).join('')}
            </g>`,
      half: `<path d="M56 196 C 100 210 200 210 244 196" fill="none" stroke="${line}" stroke-width="3"/>
             <path d="M150 214 L150 250 M120 232 L180 232" stroke="${line}" stroke-width="2" opacity=".6"/>
             <path d="M92 280 C 120 296 180 296 208 280" fill="none" stroke="${line}" stroke-width="2.4"/>`
    };

    const extras = {
      none: '',
      zipper: `<g stroke="${line}" stroke-width="2.6">
                 <path d="M78 330 L222 330"/>
                 ${Array.from({ length: 13 }, (_, i) => `<path d="M${82 + i * 11} 324 L${82 + i * 11} 336"/>`).join('')}
               </g>
               <rect x="141" y="321" width="18" height="18" fill="${line}"/>`,
      stitch: `<g stroke="${line}" stroke-width="2.2" fill="none">
                 <path d="M96 200 L120 200 M100 194 L100 206 M110 194 L110 206"/>
                 <path d="M180 200 L204 200 M188 194 L188 206 M198 194 L198 206"/>
                 <path d="M120 322 L180 322 M132 316 L132 328 M150 316 L150 328 M168 316 L168 328"/>
               </g>`,
      horn: `<path d="M84 60 C 60 30 44 22 30 20 C 48 34 62 54 72 82 Z" fill="${base}" stroke="${line}" stroke-width="2.5"/>
             <path d="M216 60 C 240 30 256 22 270 20 C 252 34 238 54 228 82 Z" fill="${base}" stroke="${line}" stroke-width="2.5"/>`
    };

    const clipShape = state.base === 'half'
      ? '<path d="M54 190 L246 190 C 246 250 206 334 150 364 C 94 334 54 250 54 190 Z"/>'
      : `<path d="${OUT}"/>`;

    const body = state.base === 'half'
      ? `<path d="M54 190 C 54 176 60 172 78 176 C 120 190 180 190 222 176 C 240 172 246 176 246 190 C 246 250 206 334 150 364 C 94 334 54 250 54 190 Z"
                fill="${base}" stroke="${line}" stroke-width="3.4"/>`
      : `<path d="${OUT}" fill="${base}" stroke="${line}" stroke-width="3.4"/>`;

    const showEyes = state.base !== 'half';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" role="img" aria-label="Маска ${state.name}">
  <defs>
    <clipPath id="clip-${uid}">${clipShape}</clipPath>
    <pattern id="dots-${uid}" width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="${line}"/>
    </pattern>
    <pattern id="str-${uid}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <rect width="6" height="14" fill="${line}"/>
    </pattern>
    <pattern id="mesh-${uid}" width="5" height="5" patternUnits="userSpaceOnUse">
      <path d="M0 0 L5 0 M0 0 L0 5" stroke="${line}" stroke-width="1"/>
      <rect width="5" height="5" fill="#080606" opacity=".75"/>
    </pattern>
  </defs>
  ${extras.horn && state.extra === 'horn' ? extras.horn : ''}
  ${body}
  ${patterns[state.pattern]}
  ${bases[state.base]}
  ${showEyes ? eyes[state.eyes] : ''}
  ${state.extra !== 'horn' ? extras[state.extra] : ''}
  <g clip-path="url(#clip-${uid})" opacity=".3">
    <path d="${OUT}" fill="none" stroke="#000" stroke-width="16"/>
  </g>
  <text x="150" y="390" text-anchor="middle" font-family="monospace" font-size="11"
        letter-spacing="3" fill="${forExport ? line : 'currentColor'}" opacity=".7">${state.name}</text>
</svg>`;
  }

  /* ---------------- бирка ---------------- */
  function serial() {
    const s = [state.base, state.eyes, state.pattern, state.extra, state.color].join('');
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return 'HY-' + String(h % 9000 + 1000) + '-' + state.color.slice(0, 2).toUpperCase();
  }
  const READ = {
    beak: 'держит дистанцию', jaw: 'предупреждает заранее', plate: 'не отдаёт ничего', half: 'оставляет путь назад',
    round: 'смотрит прямо', slit: 'смотрит искоса', one: 'показывает половину', mesh: 'не даёт себя прочесть'
  };

  function render() {
    stage.innerHTML = build(false);
    const col = COLORS.find(c => c.id === state.color);
    $('#plate').innerHTML =
      `АТЕЛЬЕ <b>HySy ARTMASK STUDIO</b> · 4-Й РАЙОН<br>
       СЕРИЯ <b>${serial()}</b><br>
       МАТЕРИАЛ: <b>${col.n}</b><br>
       ЗАКЛЮЧЕНИЕ МАСТЕРА: <b>${READ[state.base]}, ${READ[state.eyes]}</b>`;
    document.querySelectorAll('.opts').forEach(g => {
      g.querySelectorAll('.opt').forEach(b =>
        b.setAttribute('aria-pressed', String(state[g.dataset.group] === b.dataset.v)));
    });
    document.querySelectorAll('.sw').forEach(b =>
      b.setAttribute('aria-pressed', String(state.color === b.dataset.v)));
  }

  /* ---------------- управление ---------------- */
  const swHost = document.querySelector('[data-group="color"]');
  swHost.innerHTML = COLORS.map(c =>
    `<button class="sw" data-v="${c.id}" title="${c.n}" aria-label="Материал: ${c.n}"
             style="background:${c.c};box-shadow:inset 0 0 0 1px ${c.s}"></button>`).join('');

  document.querySelectorAll('.opts .opt').forEach(b => b.addEventListener('click', () => {
    state[b.closest('.opts').dataset.group] = b.dataset.v; render();
  }));
  swHost.addEventListener('click', e => {
    const b = e.target.closest('.sw');
    if (b) { state.color = b.dataset.v; render(); }
  });

  const nameIn = $('#mname');
  nameIn.addEventListener('input', () => {
    state.name = (nameIn.value || 'БЕЗЫМЯННЫЙ').toUpperCase().replace(/[<>&"]/g, '');
    render();
  });

  $('#rnd').addEventListener('click', () => {
    const pick = a => a[Math.floor(Math.random() * a.length)];
    state.base = pick(['beak', 'jaw', 'plate', 'half']);
    state.eyes = pick(['round', 'slit', 'one', 'mesh']);
    state.pattern = pick(['none', 'halftone', 'stripes', 'crack']);
    state.extra = pick(['none', 'zipper', 'stitch', 'horn']);
    state.color = pick(COLORS).id;
    render();
  });

  $('#dl').addEventListener('click', () => {
    const blob = new Blob([build(true)], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hysy-mask-' + serial().toLowerCase() + '.svg';
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  });

  render();
})();
