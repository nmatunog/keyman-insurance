import { getSessionUser, json, publicUser } from '../../lib/auth.js';
import { getAllFoundingStatus, getUserOwnedAcademies } from '../../lib/founding.js';
import {
  ACADEMIES,
  MEMBERSHIP,
  PAYMENT_CHANNELS,
  effectiveAccessTier,
  normalizeMembershipTier,
  publicAcademyPricing,
  publicMembershipPricing,
} from '../../lib/pricing.js';

export async function onRequestGet(context) {
  const user = await getSessionUser(context.request, context.env);
  await getAllFoundingStatus(context.env);

  const memberTier = user ? normalizeMembershipTier(user.tier) : 'preview';
  const ownedAcademies = user ? await getUserOwnedAcademies(context.env, user.id) : [];

  const membership = Object.fromEntries(
    Object.entries(MEMBERSHIP).map(([k, v]) => [k, publicMembershipPricing(v)])
  );

  const academies = Object.fromEntries(
    Object.entries(ACADEMIES).map(([k, v]) => [
      k,
      { ...publicAcademyPricing(v, memberTier), owned: ownedAcademies.includes(k) },
    ])
  );

  const payload = {
    ok: true,
    membershipNote:
      'GIYA Professional (₱999/mo) = learning community + 20% off Academies. GIYA Elite (₱2,999/mo) = everything + all Academies + coaching. Academies are also sold standalone.',
    upsell:
      'Buy one Academy from ₱7,990 — or join Elite for ₱2,999/month and access all Academies plus coaching.',
    membership,
    academies,
    pricing: membership,
    paymentChannels: PAYMENT_CHANNELS,
    accessTier: effectiveAccessTier(memberTier, ownedAcademies),
    ownedAcademies,
  };

  if (!user) {
    return json({ ...payload, authenticated: false, user: null });
  }

  return json({
    ...payload,
    authenticated: true,
    user: {
      ...publicUser(user),
      membershipTier: memberTier,
      accessTier: effectiveAccessTier(memberTier, ownedAcademies),
    },
  });
}
