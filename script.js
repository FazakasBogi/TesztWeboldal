/* ===========================================================
   PERLA HARGHITEI — App logic
   =========================================================== */
(function(){
  'use strict';

  const body = document.body;
  const views = {
    landing: document.getElementById('view-landing'),
    b2b: document.getElementById('view-b2b'),
    b2c: document.getElementById('view-b2c')
  };

  /* ---------- View routing ---------- */
  function showView(name){
    Object.entries(views).forEach(([key, el]) => {
      if(!el) return;
      if(key === name){
        el.classList.add('is-active');
      } else {
        el.classList.remove('is-active');
      }
    });
    body.setAttribute('data-view', name);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    if(name !== 'landing'){
      initRevealsFor(views[name]);
      if(name === 'b2b') animateStats();
    }
  }

  document.querySelectorAll('.chooser-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-target');
      // brief ripple feedback before transition
      card.style.transform = 'scale(0.98)';
      setTimeout(() => { showView(target); }, 160);
    });
  });

  document.querySelectorAll('[data-action="go-landing"]').forEach(btn => {
    btn.addEventListener('click', () => showView('landing'));
  });

  /* ---------- Mobile nav toggle ---------- */
  document.querySelectorAll('[data-action="toggle-nav"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = btn.closest('.nav');
      nav.classList.toggle('is-open');
    });
  });

  // Close mobile nav after clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      const nav = link.closest('.nav');
      if(nav) nav.classList.remove('is-open');
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  function initRevealsFor(root){
    if(!root) return;
    root.querySelectorAll('.reveal').forEach(el => {
      if(!el.classList.contains('in-view')) revealObserver.observe(el);
    });
  }

  // Reveal anything already inside the active (landing) view at load,
  // and pre-register B2B/B2C reveals so they trigger once those views show.
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters (B2B hero) ---------- */
  let statsAnimated = false;
  function animateStats(){
    if(statsAnimated) return;
    statsAnimated = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseFloat(el.getAttribute('data-count'));
      const duration = 1400;
      const start = performance.now();
      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = value;
        if(progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- Forms ---------- */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successEl = form.querySelector('[data-success]');
      const submitBtn = form.querySelector('button[type="submit"]');
      if(submitBtn){
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
      }
      setTimeout(() => {
        if(successEl) successEl.hidden = false;
        if(submitBtn){
          submitBtn.textContent = 'Request sent ✓';
        }
      }, 600);
    });
  });

  /* ---------- Subscription frequency toggle (B2C) ---------- */
  document.querySelectorAll('.freq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  /* ---------- Add-to-cart micro-interaction (B2C) ---------- */
  document.querySelectorAll('.product-card .btn-outline-coral').forEach(btn => {
    const original = btn.textContent;
    btn.addEventListener('click', () => {
      btn.textContent = 'Added ✓';
      btn.classList.add('is-added');
      setTimeout(() => { btn.textContent = original; }, 1600);
    });
  });

  /* ---------- Smooth in-page anchor scrolling accounting for sticky nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if(id.length > 1){
        const targetEl = document.querySelector(id);
        if(targetEl){
          e.preventDefault();
          const navEl = link.closest('.view')?.querySelector('.nav');
          const offset = navEl ? navEl.offsetHeight + 10 : 0;
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

})();
