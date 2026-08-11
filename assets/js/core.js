/* ============================================================
   ОБЩИЙ СКРИПТ: ворота, курсор, меню, появление, портреты
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- ВОРОТА ---------------- */
  const gate = $('#gate');
  if (gate) {
    const seen = sessionStorage.getItem('kk_gate') === '1';
    const bar  = $('.gate-bar i', gate);
    const eye  = $('.eye-wrap', gate);

    const close = () => {
      gate.classList.add('gone');
      document.body.style.overflow = '';
      sessionStorage.setItem('kk_gate', '1');
      setTimeout(() => gate.remove(), 900);
    };

    if (seen || reduced) {
      gate.remove();
    } else {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        eye.classList.add('eye-open');
        if (bar) { bar.style.transition = 'width 2.6s cubic-bezier(.3,0,.2,1)'; bar.style.width = '100%'; }
      });
      const t = setTimeout(close, 3200);
      $('#gate-skip').addEventListener('click', () => { clearTimeout(t); close(); });
    }
  }

  /* ---------------- КУРСОР ---------------- */
  const dot = $('#cur-dot'), ring = $('#cur-ring');
  if (dot && ring && window.matchMedia('(hover:hover)').matches) {
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px)`;
    }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', e => {
      const hot = e.target.closest('a,button,.dcard,.kag-card,.wardcell,input,.redact');
      ring.classList.toggle('hot', !!hot);
    });
  }


  /* ============================================================
     ШАПКА И ПОДВАЛ ИЗ ОДНОГО ИСТОЧНИКА
     Страниц стало восемь — руками их больше не синхронизировать.
     ============================================================ */
  const SITE = [
    { href: 'manga.html',      ru: 'Отрывки',    jp: '断章' },
    { href: 'characters.html', ru: 'Досье',      jp: '人物' },
    { href: 'kagune.html',     ru: 'Кагуне',     jp: '赫子' },
    { href: 'quinque.html',    ru: 'Оружейная',  jp: '武器' },
    { href: 'wards.html',      ru: 'Районы',     jp: '区' },
    { href: 'atelier.html',    ru: 'Ателье',     jp: '仮面' }
  ];
  window.KKSITE = SITE;

  const navHost = document.getElementById('nav');
  if (navHost && !navHost.children.length) {
    navHost.innerHTML =
      `<a href="index.html" data-jp="首頁">Главная</a>` +
      SITE.map(i => `<a href="${i.href}" data-jp="${i.jp}">${i.ru}</a>`).join('') +
      `<a class="nav-cta" href="game.html" data-jp="七夜">Семь ночей</a>`;
  }

  const footHost = document.getElementById('foot-grid');
  if (footHost && !footHost.children.length) {
    footHost.innerHTML = `
      <div>
        <a class="brand" href="index.html" style="margin-bottom:16px">
          <svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
            <rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" stroke-width="2"/>
            <circle cx="20" cy="20" r="10" fill="#b0121a"/><circle cx="20" cy="20" r="4" fill="#0a0908"/>
          </svg>
          <span class="brand-txt"><strong>Kagune-Kai</strong><span>喰 種 会</span></span>
        </a>
        <p class="muted" style="max-width:36ch;font-size:14px">Фанатский архив по манге Суи Исиды.
          Ничего официального, никакой торговли — только конспекты и своя графика.</p>
      </div>
      <div><h4>Разделы</h4><ul>
        ${SITE.map(i => `<li><a href="${i.href}">${i.ru}</a></li>`).join('')}
        <li><a href="game.html">Семь ночей</a></li>
      </ul></div>
      <div><h4>Внутри</h4><ul>
        <li><a href="index.html#about">Биология гуля</a></li>
        <li><a href="index.html#count">1000 − 7</a></li>
        <li><a href="index.html#arcs">Хронология</a></li>
        <li><a href="quinque.html#kakuja">Кагуджа</a></li>
        <li><a href="wards.html#anteiku">Меню «Антейку»</a></li>
      </ul></div>
      <div><h4>Управление</h4>
        <p class="muted" style="font-size:13px">Поиск по архиву — клавиша <b>/</b> или <b>Ctrl+K</b>.
          Тьму и свет переключает глаз слева внизу.</p>
        <button class="state-toggle" id="state-toggle">ВКЛЮЧИТЬ ПРОБУЖДЕНИЕ</button>
      </div>`;
  }

  /* ---------------- ШАПКА + МЕНЮ ---------------- */
  const bar = $('#topbar'), burger = $('#burger'), nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const on = nav.classList.toggle('open');
      burger.classList.toggle('on', on);
      burger.setAttribute('aria-expanded', String(on));
    });
    $$('a', nav).forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); burger.classList.remove('on');
    }));
  }
  if (bar) {
    let last = 0;
    addEventListener('scroll', () => {
      const y = scrollY;
      bar.classList.toggle('tuck', y > last && y > 260 && !nav.classList.contains('open'));
      last = y;
    }, { passive: true });
  }

  /* активный пункт меню по имени файла */
  const here = location.pathname.split('/').pop() || 'index.html';
  $$('#nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  /* ---------------- ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ ---------------- */
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  const watchRise = root => $$('[data-rise]', root || document).forEach(el => io.observe(el));
  watchRise();
  window.KKwatch = watchRise;

  /* ---------------- RC-МЕТР ---------------- */
  const rcFill = document.getElementById('rc-fill'), rcVal = document.getElementById('rc-val');
  if (rcFill && rcVal) {
    const upd = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      const p = h > 0 ? Math.min(1, scrollY / h) : 0;
      rcFill.style.height = (p * 100).toFixed(1) + '%';
      rcVal.textContent = String(Math.round(200 + p * 2300)).padStart(4, '0');
    };
    addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    upd();
  }

  /* ---------------- СЧЁТЧИКИ ---------------- */
  const nums = $$('[data-count]');
  if (nums.length) {
    const nio = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        nio.unobserve(e.target);
        const el = e.target, to = +el.dataset.count, suf = el.dataset.suf || '';
        const t0 = performance.now(), dur = 1300;
        (function step(t) {
          const k = Math.min(1, (t - t0) / dur);
          const ease = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(to * ease) + (k === 1 ? suf : '');
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => nio.observe(n));
  }

  /* ---------------- РЕЖИМ «ПРОБУЖДЕНИЕ» ---------------- */
  const KEY = 'kk_awakened';
  if (localStorage.getItem(KEY) === '1') document.body.classList.add('awakened');
  window.KKawaken = function () {
    if (document.body.classList.contains('awakened')) return;
    let f = document.getElementById('flash');
    if (!f) { f = document.createElement('div'); f.id = 'flash'; document.body.appendChild(f); }
    f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    setTimeout(() => {
      document.body.classList.add('awakened');
      localStorage.setItem(KEY, '1');
    }, 220);
  };
  const st = document.getElementById('state-toggle');
  if (st) {
    const sync = () => {
      st.textContent = document.body.classList.contains('awakened') ? 'СБРОСИТЬ ПРОБУЖДЕНИЕ' : 'ПРОБУЖДЕНИЕ НЕ АКТИВНО';
    };
    sync();
    st.addEventListener('click', () => {
      document.body.classList.remove('awakened');
      localStorage.removeItem(KEY);
      sync();
    });
  }

  /* ============================================================
     ПОРТРЕТ = КРУПНЫЙ ГЛАЗ
     Лицо в архиве не хранят — хранят то, по чему опознают.
     Каждый параметр выводится из id, поэтому карточка
     всегда рисуется одинаково, но ни одна не похожа на другую.
     ============================================================ */
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0);
  }

  const KAG_GLYPH = {
    ukaku:   'M4 26 C 10 14 18 8 30 4 M4 26 C 12 20 20 18 30 14 M4 26 C 10 22 16 24 26 24',
    koukaku: 'M17 3 L30 10 V21 C30 27 24 31 17 33 C10 31 4 27 4 21 V10 Z',
    rinkaku: 'M17 33 C 12 24 16 16 8 8 M17 33 C 22 24 20 14 28 7',
    bikaku:  'M16 33 C 16 24 20 18 26 12 C 30 8 31 6 30 3',
    quinque: 'M8 32 L26 6 M22 4 L30 12 L26 16 L18 8 Z',
    none:    'M8 18 L28 18'
  };

  window.KKportrait = function (p) {
    const id = p.id, h = hash(id);
    /* красный какуган — у всех, у кого есть кагуне, даже если по бумагам он следователь */
    const ghoul = p.side === 'ghoul' ||
      ['ukaku', 'koukaku', 'rinkaku', 'bikaku'].indexOf(p.kagune) >= 0;
    const kag = (window.KAGUNE && KAGUNE[p.kagune]) || { color: '#6f7377' };

    /* детерминированные вариации */
    const cy   = 114 + (h % 17) - 8;           // высота зрачка
    const irisR = 34 + (h >> 3) % 17;           // радиус радужки
    const tilt = ((h >> 7) % 15) - 7;           // наклон глаза
    const veins = 9 + (h >> 11) % 6;
    const lash  = 5 + (h >> 15) % 4;

    const tint = p.side === 'ccg' ? '#5f86a8' : (p.side === 'human' ? '#a8935f' : '#b0121a');
    const sclera = ghoul ? '#0a0605' : '#b4ac9d';
    const irisA  = ghoul ? '#ff2a34' : (p.side === 'ccg' ? '#8fb3cc' : '#c9a15a');
    const irisB  = ghoul ? '#66070d' : (p.side === 'ccg' ? '#3c5a72' : '#6b4f22');
    const kanji  = (p.jp || '喰')[0];

    /* половинчатая радужка для одноглазых */
    const half = p.eye === 'one';

    const veinPaths = Array.from({ length: veins }, (_, i) => {
      const a = (i / veins) * Math.PI * 2 + (h % 100) / 100;
      const x1 = 100 + Math.cos(a) * (irisR - 4), y1 = cy + Math.sin(a) * (irisR - 4) * .78;
      const x2 = 100 + Math.cos(a) * (irisR + 26), y2 = cy + Math.sin(a) * (irisR + 20) * .78;
      const mx = (x1 + x2) / 2 + Math.sin(a * 3) * 9, my = (y1 + y2) / 2 + Math.cos(a * 2) * 7;
      return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"/>`;
    }).join('');

    const lidTop = `M-6 ${cy} C 40 ${cy - 74}, 160 ${cy - 74}, 206 ${cy}`;
    const lidBot = `M-6 ${cy} C 40 ${cy + 66}, 160 ${cy + 66}, 206 ${cy}`;
    const eyeShape = `${lidTop} C 160 ${cy + 66}, 40 ${cy + 66}, -6 ${cy} Z`;

    return `
<svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" class="por" role="img" aria-label="${p.name}">
  <defs>
    <pattern id="ht-${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
      <circle cx="2" cy="2" r="1.4" fill="${tint}"/>
    </pattern>
    <radialGradient id="ir-${id}" cx="44%" cy="40%">
      <stop offset="0%" stop-color="${irisA}"/>
      <stop offset="52%" stop-color="${irisA}"/>
      <stop offset="82%" stop-color="${irisB}"/>
      <stop offset="100%" stop-color="#150203"/>
    </radialGradient>
    <pattern id="ip-${id}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <circle cx="1.5" cy="1.5" r="1.1" fill="#150203"/>
    </pattern>
    <radialGradient id="bl-${id}">
      <stop offset="0%" stop-color="${irisA}" stop-opacity=".55"/>
      <stop offset="100%" stop-color="${irisA}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="eye-${id}"><path d="${eyeShape}"/></clipPath>
    <clipPath id="hf-${id}"><rect x="100" y="0" width="100" height="240"/></clipPath>
    <linearGradient id="vg-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b0a09" stop-opacity=".9"/>
      <stop offset="34%" stop-color="#0b0a09" stop-opacity="0"/>
      <stop offset="70%" stop-color="#0b0a09" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0b0a09" stop-opacity=".95"/>
    </linearGradient>
  </defs>

  <rect width="200" height="240" fill="#0b0a09"/>
  <rect width="200" height="240" fill="url(#ht-${id})" opacity=".2"/>
  <text x="196" y="228" text-anchor="end" font-family="serif" font-size="112"
        fill="#ffffff" opacity=".06">${kanji}</text>
  <circle cx="100" cy="${cy}" r="86" fill="url(#bl-${id})" opacity="${ghoul ? .9 : .35}"/>

  <g transform="rotate(${tilt} 100 ${cy})">
    <g clip-path="url(#eye-${id})">
      <rect x="-10" y="0" width="220" height="240" fill="${sclera}"/>
      <rect x="-10" y="0" width="220" height="240" fill="url(#ht-${id})" opacity="${ghoul ? .18 : .3}"/>
      ${ghoul ? `<g stroke="${irisA}" stroke-width="1.3" fill="none" opacity=".8" stroke-linecap="round">${veinPaths}</g>` : ''}
      ${half
        ? `<circle cx="100" cy="${cy}" r="${irisR}" fill="#1a1614"/>
           <g clip-path="url(#hf-${id})"><circle cx="100" cy="${cy}" r="${irisR}" fill="url(#ir-${id})"/></g>`
        : `<circle cx="100" cy="${cy}" r="${irisR}" fill="url(#ir-${id})"/>`}
      <circle cx="100" cy="${cy}" r="${irisR}" fill="url(#ip-${id})" opacity=".28"/>
      <circle cx="100" cy="${cy}" r="${(irisR * .72).toFixed(1)}" fill="none"
              stroke="${irisB}" stroke-width="1.4" opacity=".7"/>
      <circle cx="100" cy="${cy}" r="${(irisR * .36).toFixed(1)}" fill="#050303"/>
      <ellipse cx="${(100 - irisR * .36).toFixed(1)}" cy="${(cy - irisR * .38).toFixed(1)}"
               rx="${(irisR * .13).toFixed(1)}" ry="${(irisR * .08).toFixed(1)}"
               fill="#fff" opacity=".7" transform="rotate(-30 100 ${cy})"/>
      ${p.eye === 'patch'
        ? `<g fill="#141110"><rect x="-10" y="${cy - 46}" width="220" height="30" transform="rotate(-9 100 ${cy})"/></g>
           <path d="M-10 ${cy - 20} L210 ${cy - 44}" stroke="#241f1c" stroke-width="3"/>` : ''}
    </g>
    <g clip-path="url(#eye-${id})">
      <path d="${lidTop}" fill="none" stroke="#000" stroke-width="26" opacity=".45"
            transform="translate(0,9)"/>
      <path d="${lidBot}" fill="none" stroke="#000" stroke-width="16" opacity=".3"
            transform="translate(0,-5)"/>
    </g>
    <path d="${lidTop}" fill="none" stroke="#0b0a09" stroke-width="${lash}" stroke-linecap="round"/>
    <path d="${lidTop}" fill="none" stroke="${ghoul ? '#2a2422' : '#4a443e'}" stroke-width="1.6"
          transform="translate(0,${lash * .7})"/>
    <path d="${lidBot}" fill="none" stroke="#0b0a09" stroke-width="3"/>
    <path d="M-6 ${cy - 46} C 40 ${cy - 96}, 160 ${cy - 96}, 206 ${cy - 46}"
          fill="none" stroke="#0b0a09" stroke-width="2" opacity=".55"/>
  </g>

  ${p.eye === 'stitch'
    ? `<g stroke="#ff2a34" stroke-width="2.2" fill="none">
         <path d="M52 ${cy + 54} h30 M60 ${cy + 47} v14 M74 ${cy + 47} v14"/>
         <path d="M120 ${cy + 54} h30 M128 ${cy + 47} v14 M142 ${cy + 47} v14"/>
       </g>` : ''}

  <rect width="200" height="240" fill="url(#vg-${id})"/>
  <g transform="translate(12,196)" fill="none" stroke="${kag.color}" stroke-width="2.4"
     stroke-linecap="round" opacity=".9">
    <path d="${KAG_GLYPH[p.kagune] || KAG_GLYPH.none}"/>
  </g>
  <text x="188" y="26" text-anchor="end" font-family="monospace" font-size="9"
        letter-spacing="2" fill="#ffffff" opacity=".35">${String(p.ward).replace('—', 'XX')}</text>
</svg>`;
  };


  /* рейтинг → класс цвета */
  window.KKrateClass = function (r) {
    const s = String(r).toUpperCase();
    if (s.startsWith('SSS')) return 'sss';
    if (s.startsWith('SS')) return 'ss';
    if (s.startsWith('S')) return 's';
    if (s.startsWith('A')) return 'a';
    if (s.startsWith('B')) return 'b';
    return 'c';
  };

  /* ---------------- ПЕРЕТАСКИВАНИЕ ГОРИЗОНТАЛЬНЫХ ЛЕНТ ---------------- */
  $$('.rail-scroll').forEach(rail => {
    let down = false, sx = 0, sl = 0;
    rail.addEventListener('pointerdown', e => {
      down = true; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('drag');
    });
    rail.addEventListener('pointermove', e => {
      if (!down) return;
      rail.scrollLeft = sl - (e.clientX - sx);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev =>
      rail.addEventListener(ev, () => { down = false; rail.classList.remove('drag'); }));
  });

})();
