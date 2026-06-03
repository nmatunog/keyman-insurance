import { getSessionUser, json, publicUser } from '../../lib/auth.js';
import { getAllFoundingStatus } from '../../lib/founding.js';
import {
  COURSES,
  ELITE_PLANNED,
  MEMBERSHIP,
  PAYMENT_CHANNELS,
  publicCoursePricing,
  publicMembershipPricing,
} from '../../lib/pricing.js';

export async function onRequestGet(context) {
  const user = await getSessionUser(context.request, context.env);
  const foundingAll = await getAllFoundingStatus(context.env);

  const membership = Object.fromEntries(
    Object.entries(MEMBERSHIP).map(([k, v]) => [
      k,
      { ...publicMembershipPricing(v), founding: foundingAll.membership[k] || null },
    ])
  );

  const courses = Object.fromEntries(
    Object.entries(COURSES).map(([k, v]) => [
      k,
      { ...publicCoursePricing(v), founding: foundingAll.courses[k] || null },
    ])
  );

  const payload = {
    ok: true,
    membershipNote:
      'Two SKUs: (1) BI Series — one-time 4–6 day cohort. (2) GIYA Academy membership — 12-month digital access. Professional & Complete include a BI Series seat; Core does not.',
    elite: ELITE_PLANNED,
    membership,
    courses,
    /** @deprecated use membership */
    pricing: membership,
    paymentChannels: PAYMENT_CHANNELS,
  };

  if (!user) {
    return json({
      ...payload,
      authenticated: false,
      user: null,
    });
  }

  return json({
    ...payload,
    authenticated: true,
    user: publicUser(user),
  });
}
