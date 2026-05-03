/* main.js — Concrète [Lab] Ensemble */

// Shared language state — updated by lang toggle, read by modal
var _lang = localStorage.getItem('cclab-lang') || 'en';

// ── MOBILE NAV TOGGLE ───────────────────────────────
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.querySelectorAll('.nav-menu .has-dropdown').forEach(d => d.classList.remove('open'));
    });
  });

  // Dropdown toggle — click on all viewports
  document.querySelectorAll('.nav-menu .has-dropdown').forEach(li => {
    const btn = li.querySelector(':scope > button');
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !li.classList.contains('open');
      document.querySelectorAll('.nav-menu .has-dropdown').forEach(d => d.classList.remove('open'));
      if (willOpen) li.classList.add('open');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-menu .has-dropdown.open').forEach(li => li.classList.remove('open'));
  });
})();

// ── ACTIVE NAV LINK ─────────────────────────────────
(function () {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // Resolve relative href against current location
    const abs = new URL(href, window.location.href).pathname.replace(/\/$/, '') || '/';
    if (abs === path) a.classList.add('active');
  });
})();

// ── MEMBER MODAL ────────────────────────────────────
(function () {
  const overlay = document.getElementById('memberModal');
  if (!overlay) return;

  const modalImg  = overlay.querySelector('.modal-img img');
  const modalName = overlay.querySelector('.modal-name');
  const modalRole = overlay.querySelector('.modal-role');
  const modalBio  = overlay.querySelector('.modal-bio');
  const closeBtn  = overlay.querySelector('.modal-close');

  function openModal(card) {
    modalImg.src       = card.dataset.img  || '';
    modalImg.alt       = card.dataset.name || '';
    modalName.textContent = card.dataset.name || '';
    modalRole.textContent = (_lang === 'pt' && card.dataset.rolePt)
      ? card.dataset.rolePt
      : (card.dataset.role || '');
    modalBio.innerHTML = (_lang === 'pt' && card.dataset.bioPt)
      ? card.dataset.bioPt
      : (card.dataset.bio || '');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.member-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
})();

// ── PHOTO LIGHTBOX ──────────────────────────────────
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const lbImg   = lb.querySelector('.lightbox-img-wrap img');
  const lbClose = lb.querySelector('.lightbox-close');
  const lbPrev  = lb.querySelector('.lightbox-prev');
  const lbNext  = lb.querySelector('.lightbox-next');
  const items   = Array.from(document.querySelectorAll('.photo-item img'));
  let current   = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    lbImg.src = items[current].src;
    lbImg.alt = items[current].alt || '';
  }

  function open(i) {
    show(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((img, i) => {
    img.closest('.photo-item').addEventListener('click', () => open(i));
  });

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lbPrev.addEventListener('click', e => { e.stopPropagation(); show(current - 1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); show(current + 1); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   show(current - 1);
    if (e.key === 'ArrowRight')  show(current + 1);
  });
})();

// ── LANGUAGE TOGGLE ─────────────────────────────────
(function () {
  function applyLang(lang) {
    _lang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
  }

  const saved = localStorage.getItem('cclab-lang') || 'en';
  applyLang(saved);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      applyLang(lang);
      localStorage.setItem('cclab-lang', lang);
    });
  });
})();
