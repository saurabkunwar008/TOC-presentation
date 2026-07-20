/* ══════════════════════════════════════
   UNIT 2 PRESENTATION ENGINE (simple)
   ══════════════════════════════════════ */
(() => {
  'use strict';

  const PART_COLORS = {
    1: '#0e7490', 2: '#c2410c', 3: '#047857',
    4: '#be123c', 5: '#a16207', 6: '#7e22ce'
  };

  const slides  = Array.from(document.querySelectorAll('.slide'));
  const total   = slides.length;
  const bar     = document.getElementById('progressBar');
  const counter = document.getElementById('slideCounter');
  const pName   = document.getElementById('presenterName');
  const ov      = document.getElementById('overview');
  const ovGrid  = document.getElementById('ovGrid');

  let cur = 0;
  const pad = n => String(n).padStart(2, '0');

  function go(n) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === cur) return;

    slides[cur].classList.remove('active');
    cur = n;
    slides[cur].classList.add('active');

    pName.textContent = slides[cur].dataset.presenter || '—';
    counter.textContent = `${pad(cur + 1)} / ${pad(total)}`;
    bar.style.width = ((cur + 1) / total * 100) + '%';
  }

  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);

  /* Overview */
  function buildOverview() {
    slides.forEach((s, i) => {
      const title = s.dataset.title || '';
      const partMatch = title.match(/Part (\d)/);
      const part = partMatch ? +partMatch[1] : 0;
      const b = document.createElement('button');
      b.className = 'ov-card';
      b.style.setProperty('--pc', PART_COLORS[part] || '#1d4ed8');
      b.innerHTML =
        `<span class="ov-num">Slide ${pad(i + 1)}${part ? ' · Part ' + pad(part) : ''}</span>` +
        `<span class="ov-title">${title}</span>` +
        `<span class="ov-pres">${s.dataset.presenter || ''}</span>`;
      b.addEventListener('click', () => { go(i); toggleOverview(false); });
      ovGrid.appendChild(b);
    });
  }
  function toggleOverview(force) {
    ov.hidden = force !== undefined ? !force : !ov.hidden;
  }

  /* Fullscreen */
  function toggleFS() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  /* Keyboard */
  document.addEventListener('keydown', e => {
    if (!ov.hidden && e.key !== 'Escape' && e.key !== 'o' && e.key !== 'O') return;
    switch (e.key) {
      case 'ArrowRight': case ' ': case 'Enter': case 'PageDown':
        e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp':
        e.preventDefault(); prev(); break;
      case 'Home': go(0); break;
      case 'End':  go(total - 1); break;
      case 'o': case 'O': toggleOverview(); break;
      case 'f': case 'F': toggleFS(); break;
      case 'Escape': toggleOverview(false); break;
    }
  });

  /* Touch swipe */
  let tx = 0, ty = 0;
  document.addEventListener('touchstart', e => {
    tx = e.changedTouches[0].clientX;
    ty = e.changedTouches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev();
  }, { passive: true });

  /* Buttons */
  document.getElementById('btnNext').addEventListener('click', next);
  document.getElementById('btnPrev').addEventListener('click', prev);
  document.getElementById('btnOv').addEventListener('click', () => toggleOverview());
  document.getElementById('btnFs').addEventListener('click', toggleFS);
  document.getElementById('ovClose').addEventListener('click', () => toggleOverview(false));

  buildOverview();
  go(0);
})();