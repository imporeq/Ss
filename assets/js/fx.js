/* ============================================================
   ЭФФЕКТЫ И ПАСХАЛКИ
   Прогресс, скоростные линии, шторки секций, моргание при
   переходе, переключатель темы, всплывашки и мелкие секреты.
   ============================================================ */
(function () {
  'use strict';
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- всплывашка ---------------- */
  let toastEl, toastT;
  window.KKtoast = function (text, ms) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('on'), ms || 3200);
  };

  /* ---------------- полоса прогресса ---------------- */
  const bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);

  /* ---------------- скоростные линии ---------------- */
  const cv = document.createElement('canvas');
  cv.className = 'speedlines';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1);
  const ANG = Array.from({ length: 64 }, (_, i) => ({
    a: (i / 64) * Math.PI * 2 + Math.random() * 0.05,
    o: 0.35 + Math.random() * 0.65,
    w: 0.8 + Math.random() * 2.6
  }));
  function fit() {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  fit();
  addEventListener('resize', fit);

  let power = 0, target = 0, lastY = scrollY, lastT = performance.now(), dirDown = true;

  function drawLines() {
    power += (target - power) * 0.12;
    if (power < 0.01) {
      cv.classList.remove('on');
      ctx.clearRect(0, 0, W, H);
    } else {
      cv.classList.add('on');
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, R = Math.hypot(W, H) / 2;
      const inner = R * (0.16 + (1 - power) * 0.34);
      ANG.forEach(l => {
        const a = l.a;
        const x1 = cx + Math.cos(a) * inner, y1 = cy + Math.sin(a) * inner * (dirDown ? 1 : 1);
        const x2 = cx + Math.cos(a) * R * 1.05, y2 = cy + Math.sin(a) * R * 1.05;
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(1, `rgba(${dirDown ? '255,70,80' : '240,234,222'},${(l.o * power * 1.15).toFixed(3)})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = l.w * (0.7 + power);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      });
    }
    requestAnimationFrame(drawLines);
  }
  if (!reduced) requestAnimationFrame(drawLines);

  addEventListener('scroll', () => {
    const now = performance.now();
    const dy = scrollY - lastY;
    const dt = Math.max(16, now - lastT);
    const v = Math.abs(dy) / dt;                       // px/мс
    if (dy !== 0) dirDown = dy > 0;
    target = Math.min(1, Math.max(0, (v - 0.55) / 2.1)); // линии только на быстрой прокрутке
    lastY = scrollY; lastT = now;

    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
  }, { passive: true });
  setInterval(() => { target *= 0.55; }, 120);

  /* ---------------- шторки секций ---------------- */
  if (!reduced) {
    const targets = $$('main section, main .mscene, main .ktype')
      .filter(s => s.offsetHeight > 220 && !s.classList.contains('hero'));
    targets.forEach(s => {
      s.setAttribute('data-wipe', '');
      const w = document.createElement('i');
      w.className = 'wipe';
      s.appendChild(w);
    });
    const wio = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        wio.unobserve(e.target);
        const w = e.target.querySelector(':scope > .wipe');
        if (w) requestAnimationFrame(() => w.classList.add('go'));
      });
    }, { threshold: 0.06 });
    targets.forEach(s => wio.observe(s));
  }

  /* ---------------- моргание какугана при переходе ---------------- */
  const blink = document.createElement('div');
  blink.className = 'blink';
  blink.innerHTML = '<i></i><i></i>';
  document.body.appendChild(blink);

  /* открыть глаза при заходе на страницу (кроме той, где есть ворота) */
  if (!$('#gate') && sessionStorage.getItem('kk_blink') === '1') {
    blink.classList.add('shut');
    requestAnimationFrame(() => setTimeout(() => blink.classList.remove('shut'), 40));
  }
  sessionStorage.removeItem('kk_blink');

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || reduced) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')
        || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    blink.classList.add('shut');
    sessionStorage.setItem('kk_blink', '1');
    setTimeout(() => { location.href = href; }, 430);
  });

  /* ---------------- переключатель темы ---------------- */
  const sw = document.createElement('button');
  sw.className = 'eyeswitch';
  sw.type = 'button';
  sw.innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M2 20 C 9 7, 31 7, 38 20 C 31 33, 9 33, 2 20 Z" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle class="ball" cx="20" cy="20" r="8"/>
      <circle cx="20" cy="20" r="3" fill="var(--bg)"/>
    </svg>`;
  document.body.appendChild(sw);

  const syncSwitch = () => {
    const on = document.body.classList.contains('awakened');
    sw.setAttribute('aria-pressed', String(on));
    sw.dataset.tip = on ? 'ВЕРНУТЬ ТЬМУ' : 'ПРОБУЖДЕНИЕ';
    sw.setAttribute('aria-label', on ? 'Вернуть тёмную тему' : 'Включить светлую тему');
  };
  syncSwitch();

  window.KKtheme = function (on, quiet) {
    if (on) {
      if (window.KKawaken) KKawaken(); else document.body.classList.add('awakened');
      localStorage.setItem('kk_awakened', '1');
      if (!quiet) KKtoast('пробуждение — мир побелел');
    } else {
      document.body.classList.remove('awakened');
      localStorage.removeItem('kk_awakened');
      if (!quiet) KKtoast('тьма вернулась');
    }
    syncSwitch();
  };

  sw.addEventListener('click', () => KKtheme(!document.body.classList.contains('awakened')));

  /* кнопка в подвале теперь тоже переключает в обе стороны */
  const foot = $('#state-toggle');
  if (foot) {
    const btn = foot.cloneNode(true);        // клон снимает старый обработчик из core.js
    foot.replaceWith(btn);
    const label = () => {
      btn.textContent = document.body.classList.contains('awakened')
        ? 'ВЕРНУТЬ ТЁМНУЮ ТЕМУ' : 'ВКЛЮЧИТЬ ПРОБУЖДЕНИЕ';
    };
    label();
    btn.addEventListener('click', () => {
      KKtheme(!document.body.classList.contains('awakened'));
      label();
    });
  }


  /* ---------------- кнопка «наверх» ---------------- */
  const top = document.createElement('button');
  top.className = 'totop';
  top.type = 'button';
  top.setAttribute('aria-label', 'Наверх');
  top.innerHTML = '↑';
  document.body.appendChild(top);
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  addEventListener('scroll', () => top.classList.toggle('on', scrollY > innerHeight * 0.9), { passive: true });

  /* ---------------- оглавление длинных страниц ---------------- */
  const marks = $$('main [id]').filter(el => {
    if (!/^(SECTION|ARTICLE|DIV)$/.test(el.tagName)) return false;
    if (el.offsetHeight < 260) return false;
    return el.matches('section, .mscene, .ktype');
  });
  if (marks.length >= 3) {
    const toc = document.createElement('nav');
    toc.className = 'toc';
    toc.setAttribute('aria-label', 'Разделы страницы');
    toc.innerHTML = marks.map(m => {
      const h = m.querySelector('h2, h3');
      /* innerText, а не textContent: иначе <br> в заголовке склеивает слова */
      let name = (h ? (h.innerText || h.textContent) : m.id).trim().replace(/\s+/g, ' ');
      if (name.length > 24) name = name.slice(0, 23).trim() + '…';
      return `<a href="#${m.id}"><i></i><span>${name}</span></a>`;
    }).join('');
    document.body.appendChild(toc);
    const links = $$('a', toc);
    const tio = new IntersectionObserver(es => {
      es.forEach(e => {
        const n = marks.indexOf(e.target);
        if (n < 0) return;
        if (e.isIntersecting) links.forEach((l, i) => l.classList.toggle('on', i === n));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    marks.forEach(m => tio.observe(m));
  }

  /* ---------------- ссылка «к содержимому» для клавиатуры ---------------- */
  const main = document.querySelector('main');
  if (main) {
    if (!main.id) main.id = 'main';
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#' + main.id;
    skip.textContent = 'К СОДЕРЖИМОМУ';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  /* ============================================================
     ПАСХАЛКИ
     ============================================================ */

  /* 1. набери «гуль» или «ghoul» где угодно — побежит сороконожка */
  let typed = '';
  addEventListener('keydown', e => {
    const t = e.target;                       // при фокусе на документе .matches нет
    if (t && t.nodeType === 1 && t.closest('input,textarea,[contenteditable]')) return;
    if (!e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-24);

    if (/(гуль|ghoul)$/.test(typed)) {
      typed = '';
      if (window.KKcentipede) KKcentipede();
      KKtoast('она услышала своё имя');
    }
    if (/(кофе|coffee)$/.test(typed)) {
      typed = '';
      KKtoast('в «антейку» всегда наливают · 20-й район');
    }
  });

  /* 2. код Конами — отдельным слушателем: там стрелки, а не символы */
  let konami = '';
  const KONAMI = 'arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a';
  addEventListener('keydown', e => {
    konami = (konami + ',' + e.key.toLowerCase()).split(',').slice(-10).join(',');
    if (konami === KONAMI) {
      konami = '';
      KKtheme(true, true);
      if (window.KKcentipede) KKcentipede();
      KKtoast('древо аогири приветствует тебя');
    }
  });

  /* 3. пять кликов по логотипу — какуган на эмблеме навсегда */
  const mark = $('.topbar .brand-mark');
  if (localStorage.getItem('kk_marked') === '1') document.body.classList.add('marked');
  if (mark) {
    let hits = 0, timer = null;
    mark.style.cursor = 'pointer';
    mark.parentElement.setAttribute('title', 'по эмблеме можно постучать');
    /* клик по самой эмблеме никуда не ведёт — считаем нажатия;
       надпись рядом остаётся обычной ссылкой на главную */
    mark.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      hits++;
      clearTimeout(timer);
      timer = setTimeout(() => { hits = 0; }, 1200);
      if (hits >= 5) {
        hits = 0;
        const on = document.body.classList.toggle('marked');
        on ? localStorage.setItem('kk_marked', '1') : localStorage.removeItem('kk_marked');
        KKtoast(on ? 'глаз открылся на эмблеме' : 'эмблема закрыла глаз');
      } else if (hits === 3) {
        KKtoast('…ещё немного');
      }
    }, true);
  }

  /* 4. счётчик визитов — на пятый заход архив здоровается */
  const v = (+localStorage.getItem('kk_visits') || 0) + 1;
  localStorage.setItem('kk_visits', String(v));
  if (v === 5) setTimeout(() => KKtoast('пятый визит. тебя тут уже узнают'), 2600);
  if (v === 20) setTimeout(() => KKtoast('двадцатый визит. ты точно ещё человек?'), 2600);
})();
