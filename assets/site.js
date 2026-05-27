/* Memry · marketing site interactions
   - mobile nav sheet
   - feature tabs (Section 3) — auto-rotate
   - scroll-reveal observer
   - hero word-cycle (Collect what you LOVE/VISIT/TASTE/SAVE/SHARE)
   - draggable + spring stickers
   - tilt + flip example cards
   - count-up stat numbers
   - magnetic CTA buttons
   - scroll progress bar
   - phone screen-state cycling (Home → Map → Passport)
*/
(function() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- scroll progress bar -------------------------------------------------
  const sp = document.createElement('div');
  sp.className = 'scroll-progress';
  sp.innerHTML = '<span></span>';
  document.body.appendChild(sp);
  const spBar = sp.firstElementChild;
  const onScroll = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / Math.max(1, h.scrollHeight - h.clientHeight);
    spBar.style.width = (pct * 100).toFixed(2) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- mobile nav -----------------------------------------------------------
  const sheet = document.querySelector('[data-nav-sheet]');
  const openBtn = document.querySelector('[data-nav-open]');
  const closeBtn = document.querySelector('[data-nav-close]');
  const setSheet = (open) => {
    if (!sheet) return;
    sheet.dataset.open = String(open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  openBtn && openBtn.addEventListener('click', () => setSheet(true));
  closeBtn && closeBtn.addEventListener('click', () => setSheet(false));
  sheet && sheet.addEventListener('click', (e) => { if (e.target === sheet) setSheet(false); });

  // --- feature tabs ---------------------------------------------------------
  const tablist = document.querySelector('[data-feat-tabs]');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('.feat-tab')];
    const dots = [...document.querySelectorAll('[data-feat-dots] .feat-dot')];
    const panels = [...document.querySelectorAll('[data-feat-panel]')];
    const activate = (key) => {
      tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.feat === key)));
      dots.forEach(d => d.setAttribute('aria-selected', String(d.dataset.featDot === key)));
      panels.forEach(p => {
        const on = p.dataset.featPanel === key;
        p.style.display = on ? '' : 'none';
        if (on) { p.style.animation = 'none'; void p.offsetWidth; p.style.animation = ''; }
      });
    };

    let i = 0, paused = false, timer = null;
    const startTimer = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        if (paused || reduce) return;
        i = (i + 1) % tabs.length;
        activate(tabs[i].dataset.feat);
      }, 4500);
    };

    const jumpTo = (key) => {
      const idx = tabs.findIndex(t => t.dataset.feat === key);
      if (idx < 0) return;
      i = idx;
      activate(key);
      startTimer();
    };

    tabs.forEach(t => t.addEventListener('click', () => jumpTo(t.dataset.feat)));
    dots.forEach(d => d.addEventListener('click', () => jumpTo(d.dataset.featDot)));

    activate(tabs[0].dataset.feat);
    tablist.addEventListener('mouseenter', () => paused = true);
    tablist.addEventListener('mouseleave', () => paused = false);
    startTimer();
  }

  // --- scroll reveal --------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in'));
  }

  // --- subtle parallax on hero stickers ------------------------------------
  const stage = document.querySelector('[data-hero-stage]');
  if (stage && window.matchMedia('(min-width: 881px)').matches && !reduce) {
    const floats = stage.querySelectorAll('.float');
    const onMove = (e) => {
      // skip if currently dragging
      if (stage.querySelector('.float.dragging')) return;
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      floats.forEach((el, i) => {
        if (el.classList.contains('dragging') || el.dataset.dragX) return;
        const mag = 6 + i * 3;
        el.style.translate = `${-x * mag}px ${-y * mag}px`;
      });
    };
    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', () => floats.forEach(f => {
      if (!f.classList.contains('dragging') && !f.dataset.dragX) f.style.translate = '';
    }));
  }

  // --- TOC active state on doc pages ---------------------------------------
  const tocLinks = document.querySelectorAll('.doc-toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    tocLinks.forEach(a => {
      const id = a.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (sec) map.set(sec, a);
    });
    const setActive = (a) => {
      tocLinks.forEach(x => { x.style.color = ''; x.style.background = ''; x.style.borderLeftColor = ''; });
      if (a) { a.style.color = '#111'; a.style.background = 'rgba(17,17,17,0.04)'; a.style.borderLeftColor = '#3E2820'; }
    };
    const io2 = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => a.target.offsetTop - b.target.offsetTop);
      if (visible.length) setActive(map.get(visible[0].target));
    }, { rootMargin: '-30% 0px -60% 0px' });
    map.forEach((_, sec) => io2.observe(sec));
  }

  // ========================================================================
  // HERO WORD CYCLE
  // ========================================================================
  const cycle = document.querySelector('[data-cycle]');
  if (cycle && !reduce) {
    const words = ['love', 'visit', 'taste', 'save', 'remember', 'share'];
    let idx = 0;
    const cur = cycle.querySelector('.word-cur');
    const nxt = cycle.querySelector('.word-nxt');
    const tick = () => {
      idx = (idx + 1) % words.length;
      nxt.textContent = words[idx];
      cycle.classList.remove('swap');
      void cycle.offsetWidth;          // force reflow
      cycle.classList.add('swap');
      setTimeout(() => {
        cur.textContent = words[idx];
        cycle.classList.remove('swap');
        nxt.textContent = '';
      }, 560);
    };
    setInterval(tick, 2400);
  }

  // ========================================================================
  // PHONE STATE CYCLING (Home → Map → Passport)
  // ========================================================================
  const phStates = document.querySelector('[data-phone-states]');
  const phDots = document.querySelector('[data-phone-dots]');
  if (phStates && phDots) {
    const states = [...phStates.querySelectorAll('.phone-state')];
    const dots = [...phDots.querySelectorAll('button')];
    const navtabs = document.querySelectorAll('[data-navtab]');
    let s = 0, autoPaused = false;
    const setState = (i) => {
      s = ((i % states.length) + states.length) % states.length;
      const key = states[s].dataset.state;
      states.forEach((el, j) => el.classList.toggle('is-active', j === s));
      dots.forEach((d, j) => d.classList.toggle('is-active', j === s));
      // restart animations on contained pins/stamps
      states[s].style.animation = 'none'; void states[s].offsetWidth; states[s].style.animation = '';
      // highlight the matching bottom-nav tab
      navtabs.forEach(t => {
        const on = t.dataset.navtab === key
                || (key === 'home' && t.dataset.navtab === 'home')
                || (key === 'map' && t.dataset.navtab === 'map')
                || (key === 'passport' && t.dataset.navtab === 'passport');
        t.style.color = on ? '' : 'var(--ink45)';
      });
    };
    dots.forEach((d, i) => d.addEventListener('click', () => { autoPaused = true; setState(i); }));
    navtabs.forEach(t => t.addEventListener('click', () => {
      const key = t.dataset.navtab;
      const i = states.findIndex(st => st.dataset.state === key);
      if (i >= 0) { autoPaused = true; setState(i); }
    }));
    setInterval(() => { if (!autoPaused && !reduce && !document.hidden) setState(s + 1); }, 4200);
  }

  // ========================================================================
  // DRAGGABLE STICKERS (with spring snap-back)
  // ========================================================================
  document.querySelectorAll('.hero-stage .float').forEach(el => {
    let startX = 0, startY = 0, dx = 0, dy = 0, dragging = false;
    const home = () => { el.classList.add('tossed'); el.style.transform = ''; el.dataset.dragX = ''; el.dataset.dragY = ''; setTimeout(() => el.classList.remove('tossed'), 850); };
    const onDown = (e) => {
      const pt = e.touches ? e.touches[0] : e;
      startX = pt.clientX; startY = pt.clientY;
      dx = parseFloat(el.dataset.dragX || 0); dy = parseFloat(el.dataset.dragY || 0);
      dragging = true; el.classList.add('dragging');
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const pt = e.touches ? e.touches[0] : e;
      const ndx = dx + (pt.clientX - startX);
      const ndy = dy + (pt.clientY - startY);
      el.dataset.dragX = ndx; el.dataset.dragY = ndy;
      const r = (parseFloat(el.style.getPropertyValue('--r')) || 0);
      el.style.transform = `translate(${ndx}px, ${ndy}px) rotate(${r + ndx * 0.08}deg)`;
      if (e.cancelable) e.preventDefault();
    };
    const onUp = () => {
      dragging = false; el.classList.remove('dragging');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      home();   // springs back to original position
    };
    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive: false });
  });

  // ========================================================================
  // EXAMPLE CARDS · 3D tilt + tap-to-flip
  // ========================================================================
  document.querySelectorAll('.ex-card').forEach(card => {
    if (!reduce && window.matchMedia('(hover: hover)').matches) {
      card.addEventListener('mousemove', (e) => {
        if (card.classList.contains('flipped')) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('flipped')) card.style.transform = '';
      });
    }
    card.addEventListener('click', (e) => {
      // ignore clicks on links inside the card
      if (e.target.closest('a')) return;
      card.classList.toggle('flipped');
      card.style.transform = '';
    });
  });

  // ========================================================================
  // STAT COUNTER ANIMATION (when phone enters viewport)
  // ========================================================================
  if ('IntersectionObserver' in window) {
    const counters = document.querySelectorAll('[data-count]');
    const io3 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const dur = 1200;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          // easeOutCubic
          const v = Math.round(target * (1 - Math.pow(1 - t, 3)));
          el.textContent = v;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io3.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => { c.textContent = '0'; io3.observe(c); });
  }

  // ========================================================================
  // MAGNETIC CTAs
  // ========================================================================
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-magnet]').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width  / 2));
        const y = (e.clientY - (r.top  + r.height / 2));
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => btn.style.transform = '');
    });
  }

})();
