/* ============================================================
   ГЛАВНАЯ: RC-фон, лента, лица, цитаты, счёт 1000−7
   ============================================================ */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- RC-КЛЕТКИ НА CANVAS ---------------- */
  const cv = $('#rc-canvas');
  if (cv && !reduced) {
    const ctx = cv.getContext('2d');
    let W, H, cells = [], dpr = Math.min(2, devicePixelRatio || 1);
    const mouse = { x: -999, y: -999 };

    function size() {
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(140, (W * H) / 11000));
      cells = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
        r: 1 + Math.random() * 2.6, p: Math.random() * Math.PI * 2
      }));
    }

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      // связи
      for (let i = 0; i < cells.length; i++) {
        const a = cells[i];
        for (let j = i + 1; j < cells.length; j++) {
          const b = cells[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < 108) {
            ctx.strokeStyle = `rgba(176,18,26,${(1 - d / 108) * 0.32})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // клетки
      cells.forEach(c => {
        c.x += c.vx; c.y += c.vy; c.p += 0.02;
        if (c.x < -20) c.x = W + 20; if (c.x > W + 20) c.x = -20;
        if (c.y < -20) c.y = H + 20; if (c.y > H + 20) c.y = -20;
        const dx = c.x - mouse.x, dy = c.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 150) { c.x += dx / d * 1.1; c.y += dy / d * 1.1; }
        const rr = c.r * (1 + Math.sin(c.p) * 0.22);
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, rr * 4);
        g.addColorStop(0, 'rgba(255,40,52,.55)');
        g.addColorStop(1, 'rgba(255,40,52,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(c.x, c.y, rr * 4, 0, 6.2832); ctx.fill();
        ctx.fillStyle = 'rgba(255,150,150,.95)';
        ctx.beginPath(); ctx.arc(c.x, c.y, rr * .55, 0, 6.2832); ctx.fill();
      });
      requestAnimationFrame(frame);
    }

    addEventListener('resize', size);
    addEventListener('mousemove', e => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    }, { passive: true });
    size(); requestAnimationFrame(frame);
  }

  /* ---------------- ЛЕНТА: дублируем для бесшовности ---------------- */
  const tk = $('#ticker');
  if (tk) tk.innerHTML += tk.innerHTML;

  /* ---------------- ЛИЦА ---------------- */
  const strip = $('#faces-strip');
  if (strip && window.PEOPLE) {
    const ids = ['kaneki', 'touka', 'rize', 'yoshimura', 'arima'];
    strip.innerHTML = ids.map(id => {
      const p = PEOPLE.find(x => x.id === id);
      if (!p) return '';
      const k = KAGUNE[p.kagune] || KAGUNE.none;
      return `<a class="face" href="characters.html#${p.id}">
        ${KKportrait(p)}
        <h3>${p.name}</h3>
        <p class="rn jp">${p.jp}</p>
        <div class="row">
          <span class="rate ${KKrateClass(p.rate)}">${p.rate}</span>
          <span class="muted">${k.ru}</span>
        </div>
        <i class="bar"></i>
      </a>`;
    }).join('');
  }

  /* ---------------- ЦИТАТЫ: печатная машинка ---------------- */
  const qt = $('#q-text'), qw = $('#q-who'), qd = $('#q-dots');
  if (qt && window.QUOTES) {
    let idx = 0, timer = null, typing = null;

    qd.innerHTML = QUOTES.map((_, i) =>
      `<button type="button" role="tab" aria-selected="${i === 0}" aria-label="Цитата ${i + 1}"></button>`).join('');
    const dots = Array.from(qd.children);

    function show(i) {
      clearTimeout(timer); clearInterval(typing);
      idx = (i + QUOTES.length) % QUOTES.length;
      dots.forEach((d, k) => d.setAttribute('aria-selected', String(k === idx)));
      const full = QUOTES[idx].t;
      qw.textContent = '— ' + QUOTES[idx].w;
      if (reduced) { qt.textContent = full; timer = setTimeout(() => show(idx + 1), 7000); return; }
      let n = 0;
      qt.textContent = '';
      typing = setInterval(() => {
        n++;
        qt.innerHTML = full.slice(0, n) + '<span class="cur">▍</span>';
        if (n >= full.length) {
          clearInterval(typing);
          qt.innerHTML = full;
          timer = setTimeout(() => show(idx + 1), 5200);
        }
      }, 34);
    }
    dots.forEach((d, i) => d.addEventListener('click', () => show(i)));

    const qio = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { show(0); qio.disconnect(); } });
    }, { threshold: .35 });
    qio.observe(qt);
  }

  /* ---------------- 1000 − 7 ---------------- */
  const cval = $('#count-val'), cbtn = $('#count-btn'), cfill = $('#count-fill'),
        clog = $('#count-log'), csay = $('#count-say'), csec = $('#count');
  if (cval && cbtn) {
    const TOTAL = 20;
    let v = 1000, step = 0, done = false;

    const SAY = [
      '数えろ', 'まだ足りない', 'いい声だ', '止まるな',
      'あと少し', '……', 'そのまま', '壊れるなよ'
    ];

    cbtn.addEventListener('click', () => {
      if (done) { location.hash = '#top'; return; }
      step++; v -= 7;
      cval.textContent = v;
      cval.classList.remove('tilt'); void cval.offsetWidth; cval.classList.add('tilt');
      cfill.style.width = (step / TOTAL * 100) + '%';
      clog.textContent = `ШАГОВ: ${step} / ${TOTAL}`;
      csay.textContent = SAY[Math.min(SAY.length - 1, Math.floor(step / 3))];

      if (step >= 10) csec.style.setProperty('--shake', '1');
      if (step >= TOTAL) finish();
    });

    function finish() {
      done = true;
      csec.classList.add('done');
      cval.textContent = v;
      csay.textContent = 'よく数えた';
      clog.textContent = 'СЧЁТ ЗАВЕРШЁН — ТЫ УЖЕ НЕ ТОТ, КТО НАЧИНАЛ';
      cbtn.querySelector('span').textContent = 'вернуться наверх';
      if (window.KKawaken) KKawaken();
    }
  }
})();
