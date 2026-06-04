import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Accordion from '../components/Accordion';
import FunnelLadder from '../components/FunnelLadder';
import {
  BONUS_RESOURCES,
  COMMUNITY_BENEFITS,
  emailDeliveryMessage,
  getGrowthOpportunity,
  getResultProfile,
  loadResultPayload,
  scoreToDisplay,
  SITE_LINKS,
} from '../data/resultProfiles';

function StarRating({ count, max = 5 }) {
  return (
    <div className="star-rating" aria-label={`${count} out of ${max} readiness stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < count ? 'star star-on' : 'star star-off'} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

export default function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromState = location.state?.result;
  const stored = loadResultPayload();
  const result = fromState || stored;

  useEffect(() => {
    if (!result?.scoring) {
      navigate('/', { replace: true });
    }
  }, [result, navigate]);

  if (!result?.scoring) {
    return null;
  }

  const { scoring, firstName, insights, emailSent, emailReason } = result;
  const profile = getResultProfile(scoring.tier);
  const display = scoreToDisplay(scoring.score);
  const growth = getGrowthOpportunity(insights);
  const greet = firstName ? `${firstName}, ` : '';
  const showEmailNote = insights?.resourcePermission !== false;
  const emailNote = emailDeliveryMessage(emailSent, emailReason);

  const nextSteps = [
    {
      id: 'membership',
      icon: '👥',
      title: 'Step 4 — Free GIYA membership',
      subtitle: 'Your next action · no payment',
      content: (
        <>
          <p>Join the founding community for case studies, frameworks, and learning roadmaps.</p>
          <ul className="community-benefits" style={{ maxWidth: 'none', margin: '1rem 0', textAlign: 'left' }}>
            {COMMUNITY_BENEFITS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <a href={SITE_LINKS.joinCommunity} className="btn btn-primary" style={{ width: '100%' }}>
            Join free membership
          </a>
        </>
      ),
    },
    {
      id: 'nurture',
      icon: '📬',
      title: 'Step 5 — Nurture & engagement',
      subtitle: 'Guides + Keyman tools',
      content: (
        <>
          <p>Your complimentary resources (also by email):</p>
          <ul className="bonus-resources-list">
            {BONUS_RESOURCES.map((doc) => (
              <li key={doc.href}>
                <a href={doc.href} target="_blank" rel="noopener noreferrer">
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
          {showEmailNote && (
            <p className={`email-delivery-note email-delivery-${emailNote.tone}`}>{emailNote.text}</p>
          )}
          <a href={SITE_LINKS.keymanResource} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.75rem' }}>
            Keyman Resource Center
          </a>
        </>
      ),
    },
    {
      id: 'professional',
      icon: '◆',
      title: 'Step 6 — GIYA Professional',
      subtitle: 'When you want more depth',
      content: (
        <p>
          Community, monthly master class, and 20% off academies. Explore when nurture feels right —{' '}
          <a href={SITE_LINKS.professionalPlans} style={{ color: 'var(--gold)' }}>
            compare Professional
          </a>
          .
        </p>
      ),
    },
    {
      id: 'academies',
      icon: '🎓',
      title: 'Step 7 — Academy purchases',
      subtitle: 'Standalone programs',
      content: (
        <p>
          Business Insurance and future academies from ₱7,990. Preview the curriculum —{' '}
          <a href={SITE_LINKS.masterClassLearn} style={{ color: 'var(--gold)' }}>
            Business Academy
          </a>
          .
        </p>
      ),
    },
    {
      id: 'elite',
      icon: '★',
      title: 'Step 8 — GIYA Elite',
      subtitle: '₱2,999/mo',
      content: (
        <p>
          Full ecosystem — all academies and coaching when you are ready.{' '}
          <a href={SITE_LINKS.professionalPlans} style={{ color: 'var(--gold)' }}>
            View GIYA Elite
          </a>
          . <strong>GIYA Fellow</strong> is an earned designation — not purchased.
        </p>
      ),
    },
  ];

  return (
    <div className="thank-you assessment-layout">
      <div className="page-intro">
        <img
          src="/assets/giya-logo.png"
          alt="GIYA"
          width={160}
          height={160}
          className="giya-logo giya-logo--on-dark assessment-brand-logo"
          decoding="async"
        />
        <p className="hero-eyebrow">Step 3 · Personalized result</p>
        <h1>Your Advisor Readiness Result</h1>
        <p style={{ color: 'var(--gray)', fontSize: 'var(--text-sm)', marginTop: '0.35rem' }}>
          {greet}here is where you stand today.
        </p>
      </div>

      <div className="result-card">
        <p className="result-profile-title">{profile.profileTitle}</p>
        <StarRating count={display.stars} />
        <p className="result-tier-meta" style={{ marginTop: '0.35rem' }}>
          Readiness index · {display.percent}/100
        </p>
        <div className="result-meter" role="presentation">
          <div className="result-meter-fill" style={{ width: `${display.percent}%` }} />
        </div>
        <p className="result-headline">{profile.headline}</p>
        <p className="result-summary">{profile.summary}</p>
        <div className="growth-opportunity">
          <p className="growth-opportunity-label">Next growth focus</p>
          <p className="growth-opportunity-area">{growth.area}</p>
          <p className="growth-opportunity-detail">{growth.detail}</p>
        </div>
      </div>

      <section className="community-cta-box" style={{ marginTop: 'var(--space-4)' }}>
        <p className="community-cta-eyebrow">Your next step</p>
        <h2 className="community-cta-title">Free GIYA membership</h2>
        <p className="community-cta-free">Step 4 on your journey</p>
        <a href={SITE_LINKS.joinCommunity} className="btn btn-primary result-cta-primary">
          Join free membership
        </a>
      </section>

      <FunnelLadder currentStep={3} compact />

      <Accordion items={nextSteps} defaultOpenId="membership" />

      <p className="legacy">
        Save the Business. Protect the Family. Preserve the Legacy.
      </p>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-3)', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={SITE_LINKS.keymanResource} className="btn btn-secondary">
          Keyman Center
        </a>
        <Link to="/" className="btn btn-secondary">
          Assessment home
        </Link>
      </div>
    </div>
  );
}
