/** Shared pricing display helpers for GIYA */
(function (global) {
  function formatPhp(n) {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);
  }

  function slotBadge(founding, compact) {
    if (!founding?.limit) return '';
    if (founding.full) {
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-g-slate-200 text-g-slate-600">Founding full</span>`;
    }
    const label = compact
      ? `${founding.remaining} left`
      : `${founding.remaining} of ${founding.limit} founding slots left`;
    return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-g-gold/15 text-g-gold border border-g-gold/30">${label}</span>`;
  }

  function priceBlock(p, period, opts = {}) {
    const isAnnual = period === 'annual';
    const founding = p.founding;
    const full = founding?.full;
    const promo = isAnnual ? p.priceAnnual : p.priceMonthly;
    const list = isAnnual ? p.listPriceAnnual : p.listPriceMonthly;
    const suffix = isAnnual ? '/yr' : '/mo';
    const showPromo = !full && list && promo < list;
    const active = showPromo ? promo : full && list ? list : promo;

    let html = `<div class="price-block">`;
    if (showPromo && list) {
      html += `<p class="text-sm text-g-slate-400 line-through">${formatPhp(list)}${suffix}</p>`;
    }
    html += `<p class="text-2xl font-extrabold text-g-black leading-tight">${formatPhp(active)}<span class="text-sm font-semibold text-g-gold">${suffix}</span></p>`;
    if (isAnnual && !full && p.priceMonthly) {
      html += `<p class="text-xs text-g-slate-500 mt-0.5">or ${formatPhp(p.priceMonthly)}/mo</p>`;
    }
    if (!isAnnual && !full && p.priceAnnual) {
      html += `<p class="text-xs text-g-gold mt-0.5">${formatPhp(p.priceAnnual)}/yr founding</p>`;
    }
    if (full && p.rateLabel !== undefined) {
      html += `<p class="text-xs text-g-slate-500 mt-1">Standard rate applies</p>`;
    }
    html += `</div>`;
    return html;
  }

  function tierCtaLabel(p, full) {
    if (full) return 'Subscribe — standard rate';
    return 'Subscribe — founding rate';
  }

  global.GiyaPricing = { formatPhp, slotBadge, priceBlock, tierCtaLabel };
})(typeof window !== 'undefined' ? window : globalThis);
