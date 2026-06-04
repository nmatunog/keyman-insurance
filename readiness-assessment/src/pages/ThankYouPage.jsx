import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BONUS_RESOURCES,
  COMMUNITY_BENEFITS,
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

  return (
    <div className="thank-you assessment-layout" style={{ maxWidth: '640px' }}>
      <p className="hero-eyebrow">Assessment complete</p>
      <h1>Your Advisor Readiness Result</h1>
      <p style={{ color: 'var(--gray)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>
        {greet}thank you for completing the Keyman Readiness Assessment.
      </p>

      <div className="result-card">
        <p className="result-profile-title">{profile.profileTitle}</p>
        <div className="result-score-row">
          <div>
            <StarRating count={display.stars} />
            <p className="result-tier-meta" style={{ marginTop: '0.35rem' }}>
              Readiness index · {display.percent}/100
            </p>
          </div>
        </div>
        <div className="result-meter" role="presentation">
          <div className="result-meter-fill" style={{ width: `${display.percent}%` }} />
        </div>
        <p className="result-headline">{profile.headline}</p>
        <p className="result-summary">{profile.summary}</p>

        <div className="growth-opportunity">
          <p className="growth-opportunity-label">Personalized recommendation</p>
          <p className="growth-opportunity-area">Your next growth opportunity: {growth.area}</p>
          <p className="growth-opportunity-detail">{growth.detail}</p>
        </div>
      </div>

      <section className="bonus-resources-box" aria-labelledby="bonus-heading">
        <p id="bonus-heading" className="bonus-resources-eyebrow">
          Your two complimentary guides
        </p>
        <p className="bonus-resources-copy">
          Yours for completing the assessment — open now or use the same links in your email.
        </p>
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
          <p className={`email-delivery-note ${emailSent ? 'email-delivery-ok' : 'email-delivery-warn'}`}>
            {emailSent === true
              ? 'We sent these two guides to your inbox. Check spam or promotions if you do not see them within a few minutes.'
              : emailSent === false
                ? `Email could not be sent${emailReason ? ` (${emailReason})` : ''}. Use the links above — they are always available here.`
                : 'If you opted in to email updates, your two guides are on the way. Check spam if needed.'}
          </p>
        )}
      </section>

      <section className="secondary-interest-box">
        <p className="secondary-interest-label">Interested in advanced learning?</p>
        <h3 className="secondary-interest-title">Business Insurance Master Class</h3>
        <p className="secondary-interest-status">Launching soon · Priority waitlist open</p>
        <p className="secondary-interest-copy">
          Explore what advanced case design covers — no purchase required today.
        </p>
        <div className="secondary-interest-actions">
          <a href={SITE_LINKS.masterClassLearn} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            Learn more
          </a>
          <a
            href={SITE_LINKS.waitlist}
            className="btn btn-secondary result-cta-waitlist"
            style={{ fontSize: '0.85rem' }}
          >
            Reserve my spot
          </a>
        </div>
      </section>

      <section className="free-membership-box" aria-labelledby="free-member-heading">
        <p id="free-member-heading" className="community-cta-eyebrow">
          Explore GIYA
        </p>
        <h2 className="community-cta-title">Free membership</h2>
        <p className="community-cta-free">No cost · Founding community access</p>
        <ul className="community-benefits">
          {COMMUNITY_BENEFITS.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <a href={SITE_LINKS.joinCommunity} className="btn btn-primary result-cta-primary">
          Explore free membership
        </a>
        <p className="community-cta-note">
          After the waitlist, stay on the learning path with case studies and frameworks — before any
          course purchase.
        </p>
      </section>

      <p style={{ color: 'var(--gray)', fontSize: '0.85rem', marginTop: '1.25rem' }}>
        Browse the{' '}
        <a href={SITE_LINKS.keymanResource} style={{ color: 'var(--gold)' }}>
          Keyman Resource Center
        </a>{' '}
        for additional tools and reference materials.
      </p>

      <p className="legacy">
        Save the Business.
        <br />
        Protect the Family.
        <br />
        Preserve the Legacy.
      </p>

      <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
        Back to assessment home
      </Link>
    </div>
  );
}
