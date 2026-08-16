/* ============================================================
   ХРОНОЛОГИЯ — вертикальная лента с прогрессом по прокрутке
   ============================================================ */
(function () {
  'use strict';
  const host = document.querySelector('#timeline');
  if (!host || !window.TIMELINE) return;

  const KCOL = {
    'ДЕЛО': '#ff2634', 'ОТРЫВОК': '#c9a227', 'ГРУППА': '#8e2bd1',
    'РАЙОН': '#7d9a4e', 'КВИНКЕ': '#d1a02b', 'ТЕРМИН': '#6fa8d6', 'РАЗДЕЛ': '#8a8f94'
  };

  /* этапы идут группами — рисуем разделитель при смене */
  let lastPhase = null;
  host.innerHTML = `<i class="tl-rail"><b id="tl-fill"></b></i>` + TIMELINE.map((e, i) => {
    const head = e.ph !== lastPhase ? `<p class="tl-phase mono" data-rise>${e.ph}</p>` : '';
    lastPhase = e.ph;
    return head + `
      <article class="tl-item ${i % 2 ? 'tl-right' : 'tl-left'}" id="${e.id}" data-rise data-d="${i % 3}">
        <span class="tl-dot" aria-hidden="true"></span>
        <div class="tl-card">
          <div class="tl-top">
            <span class="tl-n mono">${String(i + 1).padStart(2, '0')}</span>
            <span class="tl-jp jp">${e.jp}</span>
            <span class="tl-where mono">${e.where}</span>
          </div>
          <h2>${e.t}</h2>
          <p>${e.d}</p>
          <div class="tl-refs">
            ${e.refs.map(r => `<a href="${r.h}" style="--rc:${KCOL[r.k] || '#8a8f94'}">
              <span class="tl-k">${r.k}</span>${r.t}</a>`).join('')}
          </div>
        </div>
      </article>`;
  }).join('');

  /* линия заполняется по мере прокрутки — видно, где ты в истории */
  const fill = document.getElementById('tl-fill');
  const items = Array.from(host.querySelectorAll('.tl-item'));
  const upd = () => {
    const r = host.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.55 - r.top) / r.height));
    fill.style.height = (p * 100).toFixed(1) + '%';
    const mid = innerHeight * 0.55;
    items.forEach(it => {
      const b = it.getBoundingClientRect();
      it.classList.toggle('passed', b.top < mid);
    });
  };
  addEventListener('scroll', upd, { passive: true });
  addEventListener('resize', upd);
  upd();

  if (window.KKwatch) KKwatch(host);
})();
