/**
 * GIYA Institute — shared site navigation & footer
 */
(function () {
  const ACADEMIES = {
    disciplines: [
      { name: 'Business Insurance', href: '/#business-academy', live: true, note: 'Master Class · live now' },
      { name: 'Estate Conservation', href: '/academies/#estate-conservation', note: 'Trusts · estate freeze · transfer' },
      { name: 'Health Planning', href: '/academies/#health-planning', note: 'Critical illness · HNW health' },
      { name: 'Wealth Management', href: '/academies/#wealth-management', note: 'Portfolio · preservation' },
      { name: 'Succession Planning', href: '/academies/#succession-planning', note: 'Ownership · continuity' },
      { name: 'Practice Leadership', href: '/academies/#practice-leadership', note: 'Team · culture · growth' },
    ],
    spike: [
      { name: 'SPIKE Advisor Launch', href: '/academies/#spike-advisor-launch', note: 'Enter business insurance segment' },
      { name: 'SPIKE Practice Builder', href: '/academies/#spike-practice-builder', note: 'Agency building & productivity' },
      { name: 'SPIKE Mentor Workshop', href: '/spike/mentor-workshop/', live: true, note: '3-day mentor development · book now' },
      { name: 'SPIKE Mentor Certification', href: '/academies/#spike-mentor', note: 'Coach & develop advisors' },
      { name: 'SPIKE Leadership Accelerator', href: '/academies/#spike-leadership', note: 'Lead teams & organizations' },
    ],
  };

  const CERT_LEVELS = [
    { name: 'GIYA Certified Advisor', href: '/readiness/', note: 'Assessment · community · foundations' },
    { name: 'GIYA Professional Advisor', href: '/certification/#professional', note: 'Membership · master class depth' },
    { name: 'GIYA Certified SPIKE Mentor', href: '/certification/#spike-mentor', note: 'Mentoring track · agency building' },
    { name: 'GIYA Certified SPIKE Facilitator', href: '/certification/#spike-facilitator', note: 'Cohort & workshop delivery' },
    { name: 'GIYA Legacy Consultant', href: '/certification/#legacy', note: 'Advanced academy completion' },
    { name: 'GIYA Fellow', href: '/fellows/', note: 'Earned · discipline leadership' },
  ];

  function academyList(items) {
    return items
      .map(
        (item) =>
          `<li><a href="${item.href}" class="${item.live ? 'is-live' : ''}">${item.name}${
            item.live ? ' <span class="giya-nav__badge">Live</span>' : ''
          }${item.note ? `<small>${item.note}</small>` : ''}</a></li>`
      )
      .join('');
  }

  function certList(items) {
    return items
      .map((item) => `<li><a href="${item.href}">${item.name}<small>${item.note}</small></a></li>`)
      .join('');
  }

  function mobileAcademyLinks(items) {
    return items.map((item) => `<a href="${item.href}">${item.name}</a>`).join('');
  }

  function navHtml(extraActions) {
    return `
<header class="giya-site-header" data-giya-header>
  <nav class="giya-nav" aria-label="Main">
    <a href="/" class="giya-brand-link shrink-0" aria-label="GIYA — home">
      <img src="/assets/giya-logo.png" alt="GIYA" width="196" height="196" class="giya-logo giya-logo--nav" decoding="async">
    </a>
    <div class="giya-nav__links">
      <a href="/institute/" class="giya-nav__link">Institute</a>
      <div class="giya-nav__item" data-nav-dropdown>
        <button type="button" class="giya-nav__trigger" aria-expanded="false">Academies <i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>
        <div class="giya-nav__panel giya-nav__panel--wide" role="menu">
          <div class="giya-nav__panel-grid giya-nav__panel-grid--2">
            <div>
              <p class="giya-nav__panel-title">Discipline academies</p>
              <ul class="giya-nav__panel-list">${academyList(ACADEMIES.disciplines)}</ul>
            </div>
            <div>
              <p class="giya-nav__panel-title">SPIKE programs</p>
              <ul class="giya-nav__panel-list">${academyList(ACADEMIES.spike)}</ul>
            </div>
          </div>
          <div class="giya-nav__panel-footer"><a href="/academies/">View all academies →</a></div>
        </div>
      </div>
      <div class="giya-nav__item" data-nav-dropdown>
        <button type="button" class="giya-nav__trigger" aria-expanded="false">Certification <i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>
        <div class="giya-nav__panel" role="menu">
          <p class="giya-nav__panel-title">Designation ladder</p>
          <ul class="giya-nav__panel-list">${certList(CERT_LEVELS)}</ul>
          <div class="giya-nav__panel-footer"><a href="/certification/">Full certification guide →</a></div>
        </div>
      </div>
      <a href="/solutions/" class="giya-nav__link">Solutions</a>
      <a href="/keyman/" class="giya-nav__link">Keyman</a>
      <a href="/readiness/" class="giya-nav__link">Assessment</a>
    </div>
    <div class="giya-nav__actions">
      ${extraActions || ''}
      <a href="/readiness/" class="hidden sm:inline-flex bg-g-gold hover:bg-g-gold/90 text-g-black px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-gold touch-target items-center min-h-[44px]">Take Assessment</a>
      <button type="button" class="giya-nav__menu-btn lg:hidden" data-nav-mobile-toggle aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>
    </div>
  </nav>
  <div class="giya-nav__mobile lg:hidden" data-nav-mobile hidden>
    <a href="/readiness/" class="text-g-gold font-bold">Take Assessment</a>
    <a href="/institute/">Institute</a>
    <details><summary>Academies</summary><div class="giya-nav__mobile-sub">
      <p class="text-[10px] font-bold uppercase tracking-widest text-g-goldMuted py-2">Disciplines</p>
      ${mobileAcademyLinks(ACADEMIES.disciplines)}
      <p class="text-[10px] font-bold uppercase tracking-widest text-g-goldMuted py-2 mt-2">SPIKE</p>
      ${mobileAcademyLinks(ACADEMIES.spike)}
      <a href="/academies/" class="font-bold text-g-gold">View all →</a>
    </div></details>
    <details><summary>Certification</summary><div class="giya-nav__mobile-sub">
      ${mobileAcademyLinks(CERT_LEVELS)}
      <a href="/certification/" class="font-bold text-g-gold">Full guide →</a>
    </div></details>
    <a href="/solutions/">Organizational Solutions</a>
    <a href="/keyman/">Keyman Resource Center</a>
    <a href="/fellows/">GIYA Fellows</a>
    <a href="/#pathways">Membership</a>
    <a href="/login.html">Sign in</a>
  </div>
</header>`;
  }

  function footerHtml() {
    return `
<footer class="giya-site-footer">
  <div class="giya-site-footer__grid">
    <div>
      <img src="/assets/giya-logo.png" alt="GIYA Institute" width="120" height="120" class="giya-logo giya-logo--footer giya-logo--on-dark mb-3" loading="lazy" decoding="async">
      <p class="text-sm text-g-slate-400 italic">Guiding Advisors. Protecting Legacies.</p>
      <p class="text-xs text-g-slate-500 mt-3">Assessment-first institute for advisor empowerment, agency building, and mentoring.</p>
    </div>
    <div>
      <h4>Institute</h4>
      <ul>
        <li><a href="/institute/">About GIYA</a></li>
        <li><a href="/academies/">Academies</a></li>
        <li><a href="/certification/">Certification</a></li>
        <li><a href="/fellows/">GIYA Fellows</a></li>
        <li><a href="/solutions/">Organizational Solutions</a></li>
        <li><a href="/spike/mentor-workshop/">SPIKE Mentor Workshop</a></li>
      </ul>
    </div>
    <div>
      <h4>Learn</h4>
      <ul>
        <li><a href="/readiness/">Advisor Readiness Assessment</a></li>
        <li><a href="/keyman/">Keyman Resource Center</a></li>
        <li><a href="/#business-academy">Business Insurance Academy</a></li>
        <li><a href="/#community-signup">Free membership</a></li>
      </ul>
    </div>
    <div>
      <h4>Account</h4>
      <ul>
        <li><a href="/login.html">Sign in</a></li>
        <li><a href="/register.html">Register</a></li>
        <li><a href="/account.html">Membership & billing</a></li>
      </ul>
    </div>
  </div>
  <p class="text-center text-xs text-g-slate-500 mt-10 max-w-5xl mx-auto">
    <a href="https://joingiya.com/" class="hover:text-g-pearl">joingiya.com</a>
    <span class="mx-2">·</span>© 2026 Nilo B. Matunog. Educational content — not legal or tax advice.
  </p>
</footer>`;
  }

  function initDropdowns(root) {
    const items = root.querySelectorAll('[data-nav-dropdown]');
    items.forEach((item) => {
      const trigger = item.querySelector('.giya-nav__trigger');
      if (!trigger) return;
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = item.classList.contains('is-open');
        items.forEach((i) => {
          i.classList.remove('is-open');
          i.querySelector('.giya-nav__trigger')?.setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
    document.addEventListener('click', () => {
      items.forEach((item) => {
        item.classList.remove('is-open');
        item.querySelector('.giya-nav__trigger')?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initMobileMenu(root) {
    const toggle = root.querySelector('[data-nav-mobile-toggle]');
    const panel = root.querySelector('[data-nav-mobile]');
    if (!toggle || !panel) return;
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open');
      panel.hidden = !open;
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
  }

  function mountNav(container, extraActions) {
    if (!container) return;
    container.innerHTML = navHtml(extraActions);
    initDropdowns(container);
    initMobileMenu(container);
  }

  function mountFooter(container) {
    if (!container) container = document.querySelector('[data-giya-footer]');
    if (container) container.innerHTML = footerHtml();
  }

  window.GiyaNav = { mountNav, mountFooter, navHtml, footerHtml, initDropdowns, initMobileMenu };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-giya-nav]').forEach((el) => {
      mountNav(el, el.dataset.giyaNavActions || '');
    });
    mountFooter();
  });
})();
