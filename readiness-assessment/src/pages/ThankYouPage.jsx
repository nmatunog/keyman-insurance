import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BI_READY_TIERS,
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

  const { scoring, firstName, insights } = result;
  const profile = getResultProfile(scoring.tier);
  const display = scoreToDisplay(scoring.score);
  const name = firstName ? `${firstName}, ` : '';

  const highInterest =
    insights?.masterclassInterest === 'Yes, definitely' ||
    insights?.masterclassInterest === 'Possibly';
  const showBiCongrats = BI_READY_TIERS.has(scoring.tier) && profile.congratulatory;

  return (
    <div className="thank-you assessment-layout" style={{ maxWidth: '640px' }}>
      <p className="hero-eyebrow">Your readiness result</p>
      <h1>
        {name ? `${name}here is your ` : 'Here is your '}
        Keyman readiness profile
      </h1>

      {showBiCongrats && (
        <div className="result-congrats" role="status">
          <p className="result-congrats-eyebrow">
            <span aria-hidden="true">✦</span> Congratulations
          </p>
          <p className="result-congrats-body">{profile.congratulatory}</p>
        </div>
      )}

      <div className="result-card">
        <div className="result-score-row">
          <div>
            <p className="result-tier-label">{profile.readinessLabel}</p>
            <p className="result-tier-meta">{scoring.tierLabel}</p>
          </div>
          <div className="result-score-badge">
            <span className="result-score-num">{display.percent}</span>
            <span className="result-score-of">/ 100</span>
          </div>
        </div>

        <StarRating count={display.stars} />

        <div className="result-meter" role="presentation">
          <div className="result-meter-fill" style={{ width: `${display.percent}%` }} />
        </div>

        <h2 className="result-headline">{profile.headline}</h2>
        <p className="result-summary">{profile.summary}</p>

        {insights?.confidence && (
          <ul className="result-insights">
            <li>
              <strong>Confidence:</strong> {insights.confidence}
            </li>
            {insights.cases && (
              <li>
                <strong>Keyman cases closed:</strong> {insights.cases}
              </li>
            )}
            {insights.masterclassInterest && (
              <li>
                <strong>Master Class interest:</strong> {insights.masterclassInterest}
              </li>
            )}
          </ul>
        )}

        <p className="result-next">{profile.nextStep}</p>
      </div>

      <div className="result-cta-stack">
        <a href={profile.primaryCta.href} className="btn btn-primary result-cta-primary">
          {profile.primaryCta.label}
        </a>
        <a href={profile.secondaryCta.href} className="btn btn-primary result-cta-secondary">
          {profile.secondaryCta.label}
        </a>
        {highInterest && (
          <p className="result-cta-note">
            You indicated interest in advanced training — we will use your assessment to prioritize
            invitations.
          </p>
        )}
        <a href={SITE_LINKS.register} className="btn btn-secondary">
          Create a GIYA account
        </a>
        <Link to="/" className="btn btn-secondary">
          Back to assessment home
        </Link>
      </div>

      <p style={{ color: 'var(--gray)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
        {insights?.resourcePermission !== false ? (
          <>
            Your bonus resources (Keyman Discovery Framework &amp; Conversation Guide) are being sent to
            your email. You can also open them now:{' '}
            <a href="/assets/bonus/keyman-discovery-framework.html" style={{ color: 'var(--gold)' }}>
              Discovery Framework
            </a>
            {' · '}
            <a href="/assets/bonus/business-insurance-conversation-guide.html" style={{ color: 'var(--gold)' }}>
              Conversation Guide
            </a>
          </>
        ) : (
          'You opted out of email resources. You can still explore the Academy and waitlist below.'
        )}
      </p>

      <p className="legacy">
        Save the Business.
        <br />
        Protect the Family.
        <br />
        Preserve the Legacy.
      </p>
    </div>
  );
}
