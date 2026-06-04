import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Accordion from '../components/Accordion';
import FunnelLadder from '../components/FunnelLadder';
import ReadinessReportPdf, { printReadinessReport } from '../components/ReadinessReportPdf';
import {
  BONUS_RESOURCES,
  emailDeliveryMessage,
  getResultProfile,
  GROWTH_ROADMAP_BENEFITS,
  loadResultPayload,
  scoreToDisplay,
  SITE_LINKS,
} from '../data/resultProfiles';
import { buildReadinessReport } from '../services/readinessEngine';

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

function InsightList({ title, items, variant }) {
  return (
    <div className={`result-insight-block result-insight-block--${variant}`}>
      <h3 className="result-insight-title">{title}</h3>
      <ul className="result-insight-list">
        {items.map((item) => (
          <li key={item}>
            <span className="result-insight-marker" aria-hidden="true">
              {variant === 'strengths' ? '✓' : '⚠'}
            </span>
            {item}
          </li>
        ))}
      </ul>
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

  const report = useMemo(() => {
    if (result?.report) return result.report;
    if (result?.scoring?.report) return result.scoring.report;
    if (result?.formSnapshot) return buildReadinessReport(result.formSnapshot);
    const ins = result?.insights;
    if (ins) {
      return buildReadinessReport({
        confidence_level: ins.confidence,
        keyman_cases: ins.cases,
        years_in_service: ins.yearsInService,
        masterclass_interest: ins.masterclassInterest,
        markets: ins.markets || [],
        advanced_topics: ins.advancedTopics || [],
        challenge_areas: ins.challengeAreas || [],
        business_owner_network: ins.network,
        discussed_last_12_months: ins.discussed,
        conversation_commitment: ins.commitment,
      });
    }
    return null;
  }, [result]);

  if (!result?.scoring || !report) {
    return null;
  }

  const { scoring, firstName, insights, emailSent, emailReason } = result;
  const profile = getResultProfile(scoring.tier, report);
  const display = scoreToDisplay(scoring.score ?? report.score);
  const greet = firstName ? `${firstName}, ` : '';
  const showEmailNote = insights?.resourcePermission !== false;
  const emailNote = emailDeliveryMessage(emailSent, emailReason);
  const generatedAt = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const categoryRows = [
    { key: 'experience', label: 'Experience', weight: '25%' },
    { key: 'opportunity', label: 'Opportunity', weight: '25%' },
    { key: 'confidence', label: 'Confidence', weight: '20%' },
    { key: 'interest', label: 'Interest', weight: '15%' },
    { key: 'commitment', label: 'Commitment', weight: '15%' },
  ];

  const nextSteps = [
    {
      id: 'membership',
      icon: '🗺',
      title: 'Unlock your advisor growth roadmap',
      subtitle: 'Free · outcomes, not just community',
      content: (
        <>
          <p>Get structured support built from your readiness profile:</p>
          <ul className="community-benefits" style={{ maxWidth: 'none', margin: '1rem 0', textAlign: 'left' }}>
            {GROWTH_ROADMAP_BENEFITS.map((b) => (
              <li key={b}>✓ {b}</li>
            ))}
          </ul>
          <a href={SITE_LINKS.joinCommunity} className="btn btn-primary" style={{ width: '100%' }}>
            Unlock my growth roadmap
          </a>
        </>
      ),
    },
    {
      id: 'nurture',
      icon: '📬',
      title: 'Your email sequence',
      subtitle: 'Personalized nurture',
      content: (
        <>
          <p>Based on your advisor type, you will receive:</p>
          <ul className="bonus-resources-list">
            {report.emailSequence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>Plus your complimentary guides:</p>
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
      id: 'academy',
      icon: '🎓',
      title: report.recommendedAcademy,
      subtitle: 'Flagship platform',
      content: (
        <p>
          Your recommended path starts with free membership, then the Business Insurance Academy, Master Class, and
          certification.{' '}
          <a href={SITE_LINKS.masterClassLearn} style={{ color: 'var(--gold)' }}>
            Explore the academy
          </a>
          .
        </p>
      ),
    },
    {
      id: 'professional',
      icon: '◆',
      title: 'GIYA Professional',
      subtitle: 'When you want more depth',
      content: (
        <p>
          Community, monthly master class, and academy discounts.{' '}
          <a href={SITE_LINKS.professionalPlans} style={{ color: 'var(--gold)' }}>
            Compare Professional
          </a>
          .
        </p>
      ),
    },
    {
      id: 'elite',
      icon: '★',
      title: 'GIYA Elite',
      subtitle: '₱2,999/mo',
      content: (
        <p>
          Full ecosystem when you are ready.{' '}
          <a href={SITE_LINKS.professionalPlans} style={{ color: 'var(--gold)' }}>
            View GIYA Elite
          </a>
          . <strong>GIYA Fellow</strong> is earned — not purchased.
        </p>
      ),
    },
  ];

  return (
    <div className="thank-you assessment-layout">
      <ReadinessReportPdf report={report} firstName={firstName} generatedAt={generatedAt} />

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
          {greet}your score is now actionable.
        </p>
      </div>

      <div className="result-card">
        <div className="result-score-row">
          <div>
            <p className="result-profile-title">{profile.profileTitle}</p>
            <StarRating count={display.stars} />
            <p className="result-tier-meta">Readiness index · {display.percent}/100</p>
          </div>
          <div className="result-score-badge">
            <p className="result-score-num">{display.percent}</p>
            <p className="result-score-of">/ 100</p>
          </div>
        </div>
        <div className="result-meter" role="presentation">
          <div className="result-meter-fill" style={{ width: `${display.percent}%` }} />
        </div>
        <p className="result-headline">{profile.headline}</p>
        <p className="result-summary">{profile.summary}</p>

        <div className="result-category-bars" aria-label="Category scores">
          {categoryRows.map(({ key, label, weight }) => (
            <div key={key} className="result-category-row">
              <span className="result-category-label">
                {label} <span className="result-category-weight">{weight}</span>
              </span>
              <div className="result-category-track">
                <div
                  className="result-category-fill"
                  style={{ width: `${report.categories[key]}%` }}
                />
              </div>
              <span className="result-category-pct">{report.categories[key]}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="result-insights-grid">
        <InsightList title="Your strengths" items={report.strengths} variant="strengths" />
        <InsightList title="Your gaps" items={report.gaps} variant="gaps" />
      </div>

      <div className="result-fastest-win">
        <p className="result-fastest-win-label">{report.fastestWin.title}</p>
        <p className="result-fastest-win-action">
          {report.fastestWin.action} <span>{report.fastestWin.timeframe}.</span>
        </p>
        <p className="result-fastest-win-detail">{report.fastestWin.detail}</p>
      </div>

      <div className="result-market-card">
        <p className="result-market-label">Recommended market</p>
        <p className="result-market-name">{report.recommendedMarket.market}</p>
        <p className="result-market-reason">
          <strong>Reason:</strong> {report.recommendedMarket.reason}
        </p>
        <div className="growth-opportunity" style={{ marginTop: '1rem' }}>
          <p className="growth-opportunity-label">Growth focus</p>
          <p className="growth-opportunity-area">{report.growthFocus.area}</p>
          <p className="growth-opportunity-detail">{report.growthFocus.detail}</p>
        </div>
      </div>

      <section id="report" className="result-pdf-cta">
        <h2 className="result-pdf-cta-title">Download My Readiness Report</h2>
        <p className="result-pdf-cta-copy">
          Five-page PDF: score, strengths, development areas, 30-day plan, and your recommended GIYA path.
        </p>
        <button type="button" className="btn btn-primary result-cta-primary" onClick={printReadinessReport}>
          Download my readiness report
        </button>
      </section>

      <section className="community-cta-box" style={{ marginTop: 'var(--space-4)' }}>
        <p className="community-cta-eyebrow">Step 5 · Your next step</p>
        <h2 className="community-cta-title">Unlock Your Advisor Growth Roadmap</h2>
        <ul className="community-benefits" style={{ textAlign: 'left', margin: '1rem auto', maxWidth: '22rem' }}>
          {GROWTH_ROADMAP_BENEFITS.map((b) => (
            <li key={b}>✓ {b}</li>
          ))}
        </ul>
        <a href={SITE_LINKS.joinCommunity} className="btn btn-primary result-cta-primary">
          Unlock my growth roadmap
        </a>
      </section>

      <FunnelLadder currentStep={4} compact />

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
