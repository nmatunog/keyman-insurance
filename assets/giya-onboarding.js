/**
 * GIYA homepage onboarding — explore first, subtle upgrade later.
 */
(function () {
  const EXPLORE_KEY = 'giya_explore_sections';
  const ONBOARD_KEY = 'giya_onboarding';
  const SOFT_CTA_KEY = 'giya_soft_cta_dismissed';
  const SECTIONS = [
    { id: 'keyman', label: 'Keyman Resource Center', href: '/keyman/' },
    { id: 'assessment', label: 'Readiness assessment', href: '/readiness/' },
    { id: 'certification', label: 'Certification path' },
    { id: 'fellows', label: 'GIYA Fellows', href: '/fellows/' },
    { id: 'platform', label: 'Learn · disciplines' },
    { id: 'business-academy', label: 'Academies' },
  ];
  const MIN_EXPLORE_FOR_SOFT_CTA = 3;

  function getExplored() {
    try {
      const raw = localStorage.getItem(EXPLORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function markExplored(id) {
    const set = new Set(getExplored());
    if (set.has(id)) return;
    set.add(id);
    localStorage.setItem(EXPLORE_KEY, JSON.stringify([...set]));
    updateWelcomeBanner();
    maybeShowSoftCta();
  }

  function getOnboarding() {
    try {
      return JSON.parse(localStorage.getItem(ONBOARD_KEY) || sessionStorage.getItem(ONBOARD_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function injectWelcomeBanner() {
    if (document.getElementById('giya-welcome-banner')) return;

    const ob = getOnboarding();
    const params = new URLSearchParams(location.search);
    const showWelcome = params.get('welcome') === '1' || ob;
    if (!showWelcome) return;

    const isWaitlist = ob?.type === 'masterclass';
    const explored = getExplored();
    const remaining = SECTIONS.filter((s) => !explored.includes(s.id));

    const banner = document.createElement('div');
    banner.id = 'giya-welcome-banner';
    banner.className = 'bg-g-black text-g-pearl border-b border-g-gold/30';
    banner.innerHTML = `
      <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold uppercase tracking-widest text-g-gold">Welcome to GIYA</p>
            <p class="font-bold text-base mt-1">${isWaitlist ? 'Waitlist confirmed — explore while you wait' : 'Community confirmed — start exploring'}</p>
            <p class="text-sm text-g-slate-200 mt-1">No payment required. Visit the highlights below (${explored.length}/${SECTIONS.length} started).</p>
          </div>
          <button type="button" id="giya-welcome-dismiss" class="text-sm font-semibold text-g-gold hover:text-white shrink-0">Dismiss</button>
        </div>
        <div class="flex flex-wrap gap-2 mt-3" id="giya-explore-chips"></div>
      </div>`;

    const header = document.querySelector('header');
    if (header) header.after(banner);
    else document.body.prepend(banner);

    const chips = banner.querySelector('#giya-explore-chips');
    const targets = remaining.length ? remaining : SECTIONS;
    targets.forEach((s) => {
      const a = document.createElement('a');
      a.href = s.href || `#${s.id}`;
      a.className =
        'inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-g-gold hover:text-g-black transition-colors touch-target min-h-[40px]';
      a.innerHTML = `<i class="fa-solid fa-arrow-right text-sm"></i> ${s.label}`;
      a.addEventListener('click', () => markExplored(s.id));
      chips.appendChild(a);
    });

    banner.querySelector('#giya-welcome-dismiss')?.addEventListener('click', () => {
      banner.remove();
      if (params.get('welcome')) {
        history.replaceState(null, '', location.pathname + location.hash);
      }
    });
  }

  function updateWelcomeBanner() {
    const banner = document.getElementById('giya-welcome-banner');
    if (!banner) return;
    const sub = banner.querySelector('.text-sm.text-g-slate-200');
    const explored = getExplored();
    if (sub) {
      sub.textContent = `No payment required. Visit the highlights below (${explored.length}/${SECTIONS.length} started).`;
    }
  }

  function maybeShowSoftCta() {
    if (localStorage.getItem(SOFT_CTA_KEY)) return;
    if (getExplored().length < MIN_EXPLORE_FOR_SOFT_CTA) return;
    if (document.getElementById('giya-soft-cta')) return;

    const el = document.createElement('aside');
    el.id = 'giya-soft-cta';
    el.className =
      'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[90] bg-white border border-g-slate-200 rounded-2xl shadow-lg p-4 text-sm';
    el.innerHTML = `
      <p class="font-bold text-g-black">Enjoying GIYA?</p>
      <p class="text-g-slate-600 mt-1">When you are ready — Professional adds community depth and 20% off academies. No pressure today.</p>
      <div class="flex gap-2 mt-3">
        <a href="#giya-plans" class="flex-1 text-center bg-g-black text-white font-semibold py-2.5 rounded-lg text-xs touch-target min-h-[40px] flex items-center justify-center">Compare plans</a>
        <button type="button" id="giya-soft-dismiss" class="px-3 py-2.5 rounded-lg border font-semibold text-xs text-g-slate-600 touch-target min-h-[40px]">Later</button>
      </div>`;
    document.body.appendChild(el);
    el.querySelector('#giya-soft-dismiss')?.addEventListener('click', () => {
      localStorage.setItem(SOFT_CTA_KEY, '1');
      el.remove();
    });
  }

  function observeSections() {
    SECTIONS.filter((s) => !s.href).forEach((s) => {
      const node = document.getElementById(s.id);
      if (!node) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && e.intersectionRatio >= 0.2) markExplored(s.id);
          });
        },
        { threshold: [0.2] }
      );
      io.observe(node);
    });
  }

  function init() {
    injectWelcomeBanner();
    observeSections();
    maybeShowSoftCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
