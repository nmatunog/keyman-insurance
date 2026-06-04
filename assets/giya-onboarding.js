/**
 * GIYA homepage onboarding — explore chips in hero only (no banner under header).
 */
(function () {
  const EXPLORE_KEY = 'giya_explore_sections';
  const ONBOARD_KEY = 'giya_onboarding';
  const SOFT_CTA_KEY = 'giya_soft_cta_dismissed';
  const WELCOME_DISMISS_KEY = 'giya_welcome_chips_dismissed';
  const SECTIONS = [
    { id: 'keyman', label: 'Keyman', href: '/keyman/' },
    { id: 'assessment', label: 'Assessment', href: '/readiness/' },
    { id: 'certification', label: 'Certification', href: '#certification' },
    { id: 'fellows', label: 'Fellows', href: '/fellows/' },
    { id: 'platform', label: 'Learn', href: '#platform' },
    { id: 'business-academy', label: 'Academies', href: '#business-academy' },
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
    renderExploreChips();
    maybeShowSoftCta();
  }

  function getOnboarding() {
    try {
      return JSON.parse(localStorage.getItem(ONBOARD_KEY) || sessionStorage.getItem(ONBOARD_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function shouldShowWelcome() {
    if (sessionStorage.getItem(WELCOME_DISMISS_KEY)) return false;
    const params = new URLSearchParams(location.search);
    return params.get('welcome') === '1' || Boolean(getOnboarding());
  }

  function cleanWelcomeQuery() {
    const params = new URLSearchParams(location.search);
    if (!params.has('welcome') && !params.has('account')) return;
    params.delete('account');
    params.delete('welcome');
    const qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '') + location.hash);
  }

  function renderExploreChips() {
    const wrap = document.getElementById('giya-hero-explore');
    const chips = document.getElementById('giya-explore-chips');
    if (!wrap || !chips) return;

    const explored = getExplored();
    const remaining = SECTIONS.filter((s) => !explored.includes(s.id));
    const targets = remaining.length ? remaining : SECTIONS;

    chips.innerHTML = '';
    targets.forEach((s) => {
      const a = document.createElement('a');
      a.href = s.href || `#${s.id}`;
      a.className =
        'giya-explore-chip inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border border-g-slate-200 bg-white text-g-slate-700 hover:border-g-gold hover:text-g-black transition-colors touch-target min-h-[40px]';
      a.textContent = s.label;
      a.addEventListener('click', () => markExplored(s.id));
      chips.appendChild(a);
    });

    const dismiss = document.getElementById('giya-explore-dismiss');
    if (dismiss && !dismiss.dataset.bound) {
      dismiss.dataset.bound = '1';
      dismiss.addEventListener('click', () => {
        sessionStorage.setItem(WELCOME_DISMISS_KEY, '1');
        wrap.classList.add('hidden');
        cleanWelcomeQuery();
      });
    }
  }

  function initHeroExplore() {
    const wrap = document.getElementById('giya-hero-explore');
    if (!wrap || !shouldShowWelcome()) return;
    wrap.classList.remove('hidden');
    renderExploreChips();
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
    initHeroExplore();
    observeSections();
    maybeShowSoftCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
