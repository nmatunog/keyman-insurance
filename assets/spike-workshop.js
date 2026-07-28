/**
 * SPIKE Mentor Development Workshop — interactive UI + inquiry form
 */

const fecDetails = {
  1: 'Financial Value Proposition: Mentors learn to coach rookies on articulating their specialized financial outcome.',
  2: 'Who We Serve: Guidance on market segmentation and evaluating candidate\'s natural market vs target personas.',
  3: 'Client Problem: Validating real financial vulnerabilities and gap identification techniques in field interviews.',
  4: 'Client Experience: Defining advisory service touchpoints, ethics, and relationship commitments.',
  5: 'Winning Strategy: Positioning advisors to stand out in competitive advisory scenarios.',
  6: 'Business Engine: Operational workflow and coaching the 10-5-3-1-3 Revenue Engine rhythm.',
  7: 'Leadership Engine: The Master → Multiply → Scale development pathway for agency expansion.',
  8: 'Key Partners: Unit managers, practice mentors, product specialists, and agency peer networks.',
  9: '3-Year Direction: Setting strategic growth benchmarks and long-term agency career targets.',
  10: 'Dashboard & Monitoring: Establishing KPIs, weekly activity logs, and coaching review rubrics.',
};

let spikeToastTimer = null;

function showFecDetail(id) {
  const box = document.getElementById('fecDetailBox');
  const text = document.getElementById('fecText');
  if (!box || !text || !fecDetails[id]) return;
  text.innerHTML = `<strong class="text-giya-800">FEC Block #${id}:</strong> ${fecDetails[id]}`;
  box.classList.add('border-giya-600');
}

function updateRevenueEngine(cases) {
  const display = document.getElementById('targetCaseDisplay');
  if (display) {
    display.innerText = `${cases} ${cases == 1 ? 'Case' : 'Cases'} / Month`;
  }
  const multiplier = parseInt(cases, 10) || 1;
  const map = {
    projProspects: multiplier * 10,
    projDiscovery: multiplier * 5,
    projSolutions: multiplier * 3,
    projClosed: multiplier * 1,
    projReferrals: multiplier * 3,
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('mobileMenuBtn');
  if (!menu || !btn) return;
  const isHidden = menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !isHidden);
  btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
}

function openCurriculumModal() {
  const modal = document.getElementById('curriculumModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCurriculumModal() {
  const modal = document.getElementById('curriculumModal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function openInquiryModal() {
  const modal = document.getElementById('inquiryModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeInquiryModal() {
  const modal = document.getElementById('inquiryModal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function showToast(message, isError = false) {
  const toast = document.getElementById('spike-toast');
  if (!toast) return;
  if (spikeToastTimer) clearTimeout(spikeToastTimer);

  const iconClass = isError ? 'fa-circle-xmark spike-toast-icon-err' : 'fa-circle-check spike-toast-icon-ok';
  toast.innerHTML = `<i class="fa-solid ${iconClass} text-xl flex-shrink-0"></i><span>${message}</span>`;
  toast.classList.remove('spike-toast-ok', 'spike-toast-err', 'spike-toast-show');
  toast.classList.add(isError ? 'spike-toast-err' : 'spike-toast-ok', 'spike-toast-show');

  spikeToastTimer = setTimeout(() => {
    toast.classList.remove('spike-toast-show');
  }, 5500);
}

async function handleInquirySubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

  const payload = {
    full_name: document.getElementById('fullName')?.value.trim() || '',
    designation: document.getElementById('designation')?.value || '',
    agency_name: document.getElementById('agencyName')?.value.trim() || '',
    mobile: document.getElementById('mobileNo')?.value.trim() || '',
    email: document.getElementById('workEmail')?.value.trim() || '',
    city: document.getElementById('cityLocation')?.value.trim() || '',
    est_rookies: document.getElementById('estRookies')?.value || '',
    est_mentors: document.getElementById('estMentors')?.value || '',
    impl_timeline: document.getElementById('implPeriod')?.value || 'asap',
    notes: document.getElementById('onboardingChallenge')?.value.trim() || '',
    source: 'spike_mentor_workshop',
  };

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-spike-400"></i><span>Submitting…</span>';
  }

  try {
    const res = await fetch('/api/spike/workshop-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      throw new Error(data.error || data.message || 'Unable to submit your request. Please try again.');
    }

    closeInquiryModal();
    form.reset();
    showToast(data.message || 'Thank you. Your implementation request was received.', false);
  } catch (err) {
    showToast(err.message || 'Something went wrong. Please try again.', true);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCurriculumModal();
    closeInquiryModal();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('monthlyCaseSlider');
  if (slider) {
    slider.addEventListener('input', (e) => updateRevenueEngine(e.target.value));
    updateRevenueEngine(slider.value);
  }

  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', handleInquirySubmit);
  }
});
