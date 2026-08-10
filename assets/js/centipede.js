/* ============================================================
   СОРОКОНОЖКА
   Пробегает по экрану, когда открываешь дело Канеки.
   Canvas поверх всего, ничего не ловит мышью, сама убирается.
   ============================================================ */
(function () {
  'use strict';

  const SEG = 54;          // сегментов тела
  const LAG = 0.0052;      // отставание сегмента по пути (в долях трассы)
  const DUR = 3600;        // мс на пробег

  let busy = false;

  window.KKcentipede = function (done) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (busy || reduced) { if (done) done(); return; }
    busy = true;

    const cv = document.createElement('canvas');
    cv.className = 'centipede-layer';
    document.body.appendChild(cv);

    const whisper = document.createElement('div');
    whisper.className = 'centipede-whisper';
    whisper.innerHTML = '<span>1000 − 7 …</span>';
    document.body.appendChild(whisper);

    document.body.classList.add('shudder');
    setTimeout(() => document.body.classList.remove('shudder'), 900);

    const ctx = cv.getContext('2d');
    const dpr = Math.min(2, devicePixelRatio || 1);
    let W, H;
    const size = () => {
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    addEventListener('resize', size);

    const t0 = performance.now();
    const dir = Math.random() < 0.5 ? 1 : -1;   // слева направо или наоборот

    function head(p) {
      const x = dir > 0 ? -140 + (W + 320) * p : W + 140 - (W + 320) * p;
      const y = H * 0.58 + Math.sin(p * Math.PI * 2.6) * H * 0.22
                         + Math.sin(p * Math.PI * 7.3) * 14;
      return { x, y };
    }

    function leg(x, y, a, len, t, i, side) {
      const sw = Math.sin(t * 0.018 + i * 0.75 + (side > 0 ? 0 : Math.PI)) * 0.45;
      const a1 = a + side * (Math.PI / 2) + sw * 0.4;
      const kx = x + Math.cos(a1) * len * 0.58, ky = y + Math.sin(a1) * len * 0.58;
      const a2 = a1 + side * (0.7 + sw);
      const ex = kx + Math.cos(a2) * len * 0.62, ey = ky + Math.sin(a2) * len * 0.62;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(kx, ky); ctx.lineTo(ex, ey); ctx.stroke();
    }

    function frame(now) {
      const t = now - t0;
      const p = t / DUR;
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';

      /* тело строится по самой траектории, а не по истории кадров:
         так расстояние между сегментами не зависит от частоты кадров */
      for (let i = SEG - 1; i >= 0; i--) {
        const q = p - i * LAG;
        if (q < -0.05) continue;
        const a = head(q);
        const b = head(q - 0.004);
        const ang = Math.atan2(a.y - b.y, a.x - b.x);
        const k = 1 - i / SEG;                       // ближе к голове — толще
        const rx = 7 + k * 7, ry = 6 + k * 5;

        /* лапы */
        ctx.strokeStyle = 'rgba(140,14,20,.9)';
        ctx.lineWidth = 1.5 + k * 1.4;
        leg(a.x, a.y, ang, 16 + k * 13, t, i, 1);
        leg(a.x, a.y, ang, 16 + k * 13, t, i, -1);

        /* сегмент */
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(ang);
        const g = ctx.createLinearGradient(0, -ry, 0, ry);
        g.addColorStop(0, '#6b0d13');
        g.addColorStop(0.45, '#25090c');
        g.addColorStop(1, '#0a0405');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = `rgba(255,38,52,${0.22 + k * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        /* голова */
        if (i === 0) {
          ctx.fillStyle = '#1e0608';
          ctx.beginPath(); ctx.ellipse(7, 0, rx * 1.3, ry * 1.2, 0, 0, 6.2832); ctx.fill();
          ctx.strokeStyle = '#ff2634'; ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(15, -5); ctx.quadraticCurveTo(34, -18, 46, -11);
          ctx.moveTo(15, 5);  ctx.quadraticCurveTo(34, 18, 46, 11);
          ctx.stroke();
          ctx.fillStyle = '#ff2634';
          ctx.beginPath(); ctx.arc(10, -4.5, 2.3, 0, 6.2832); ctx.fill();
          ctx.beginPath(); ctx.arc(10, 4.5, 2.3, 0, 6.2832); ctx.fill();
        }
        ctx.restore();
      }

      if (p < 1 + SEG * LAG + 0.05) {
        requestAnimationFrame(frame);
      } else {
        cv.classList.add('out');
        setTimeout(() => {
          removeEventListener('resize', size);
          cv.remove(); whisper.remove();
          busy = false;
          if (done) done();
        }, 420);
      }
    }

    requestAnimationFrame(frame);
    /* шёпот уходит раньше, чем откроется дело — чтобы не лёг на карточку */
    setTimeout(() => whisper.classList.add('on'), 120);
    setTimeout(() => whisper.classList.add('out'), 820);
  };
})();
