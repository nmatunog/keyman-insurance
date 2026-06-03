/**
 * GIYA client auth — syncs server session with academy tier gating.
 */
(function () {
  const STORAGE_KEY = 'giya_academy_tier';
  const API = '/api';

  let currentUser = null;
  let pricing = null;

  async function api(path, options = {}) {
    const res = await fetch(`${API}${path}`, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }

  function syncTierToLocal(tier) {
    if (tier) localStorage.setItem(STORAGE_KEY, tier);
  }

  async function refreshSession() {
    const { ok, data } = await api('/auth/me');
    if (!ok || !data.ok) return null;
    currentUser = data.authenticated ? data.user : null;
    pricing = data.pricing;
    if (currentUser?.status === 'active' && currentUser.tier) {
      syncTierToLocal(currentUser.tier);
    } else if (!currentUser) {
      if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, 'preview');
    }
    document.dispatchEvent(new CustomEvent('giya:auth', { detail: { user: currentUser, pricing } }));
    return currentUser;
  }

  async function login(email, password) {
    const { ok, data } = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!ok) throw new Error(data.error || 'Login failed');
    currentUser = data.user;
    syncTierToLocal(data.user.tier);
    document.dispatchEvent(new CustomEvent('giya:auth', { detail: { user: currentUser } }));
    return data.user;
  }

  async function register(payload) {
    const { ok, data } = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!ok) throw new Error(data.error || 'Registration failed');
    return data;
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    currentUser = null;
    localStorage.setItem(STORAGE_KEY, 'preview');
    document.dispatchEvent(new CustomEvent('giya:auth', { detail: { user: null } }));
  }

  async function checkout(tierOrOpts, billingPeriod, provider) {
    const body =
      typeof tierOrOpts === 'object' && tierOrOpts !== null
        ? tierOrOpts
        : { skuType: 'membership', tier: tierOrOpts, billingPeriod, provider };
    if (!body.skuType) body.skuType = 'membership';
    const { ok, data } = await api('/checkout/create', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!ok) throw new Error(data.error || 'Checkout failed');
    return data;
  }

  async function changePassword(currentPassword, newPassword) {
    const { ok, data } = await api('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!ok) throw new Error(data.error || 'Password change failed');
    return data;
  }

  function getUser() {
    return currentUser;
  }

  function formatPhp(n) {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);
  }

  window.GiyaAuth = {
    refreshSession,
    login,
    register,
    logout,
    checkout,
    changePassword,
    getUser,
    formatPhp,
    api,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => refreshSession());
  } else {
    refreshSession();
  }
})();
