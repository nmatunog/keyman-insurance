import { GROWTH_ROADMAP_BENEFITS, scoreToDisplay } from '../data/resultProfiles';

const CATEGORY_ROWS = [
  { key: 'experience', label: 'Experience', weight: '25%' },
  { key: 'opportunity', label: 'Opportunity', weight: '25%' },
  { key: 'confidence', label: 'Confidence', weight: '20%' },
  { key: 'interest', label: 'Interest', weight: '15%' },
  { key: 'commitment', label: 'Commitment', weight: '15%' },
];

function PrintStars({ count, max = 5 }) {
  return (
    <div className="rp-stars" aria-hidden="true">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < count ? 'rp-star rp-star--on' : 'rp-star'}>
          ★
        </span>
      ))}
    </div>
  );
}

/**
 * Compact 2-page printable report — mirrors thank-you page layout (ink-friendly light + gold).
 */
export default function ReadinessReportPdf({ report, firstName, generatedAt }) {
  if (!report) return null;

  const greet = firstName ? firstName : 'Advisor';
  const display = scoreToDisplay(report.score);
  const { recommendedMarket, growthFocus, fastestWin, actionPlan30, recommendedPath } = report;

  return (
    <div id="readiness-report-print" className="readiness-report-print">
      {/* Page 1 — score, insights, fastest win */}
      <article className="rp-sheet rp-sheet--break">
        <header className="rp-header">
          <img src="/assets/giya-logo.png" alt="" width={56} height={56} className="rp-logo" />
          <div className="rp-header-text">
            <p className="rp-eyebrow">GIYA Institute · Advisor Readiness</p>
            <h1 className="rp-title">Your Readiness Report</h1>
            <p className="rp-meta">
              Prepared for {greet} · {generatedAt}
            </p>
          </div>
        </header>

        <div className="rp-card rp-card--score">
          <div className="rp-score-row">
            <div>
              <p className="rp-profile-type">{report.profileTitle}</p>
              <PrintStars count={display.stars} />
              <p className="rp-index-label">Readiness index · {display.percent}/100</p>
            </div>
            <div className="rp-score-badge">
              <span className="rp-score-num">{display.percent}</span>
              <span className="rp-score-of">/ 100</span>
            </div>
          </div>
          <div className="rp-meter">
            <div className="rp-meter-fill" style={{ width: `${display.percent}%` }} />
          </div>
          <p className="rp-headline">{report.headline}</p>
          <p className="rp-summary">{report.summary}</p>
          <div className="rp-categories">
            {CATEGORY_ROWS.map(({ key, label, weight }) => (
              <div key={key} className="rp-cat-row">
                <span className="rp-cat-label">
                  {label} <em>{weight}</em>
                </span>
                <div className="rp-cat-track">
                  <div className="rp-cat-fill" style={{ width: `${report.categories[key]}%` }} />
                </div>
                <span className="rp-cat-pct">{report.categories[key]}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rp-two-col">
          <div className="rp-card rp-card--strengths">
            <h2 className="rp-card-title">Your strengths</h2>
            <ul className="rp-list">
              {report.strengths.map((s) => (
                <li key={s}>
                  <span className="rp-marker rp-marker--ok">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rp-card rp-card--gaps">
            <h2 className="rp-card-title">Your gaps</h2>
            <ul className="rp-list">
              {report.gaps.map((g) => (
                <li key={g}>
                  <span className="rp-marker rp-marker--warn">⚠</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rp-card rp-card--win">
          <p className="rp-win-label">{fastestWin.title}</p>
          <p className="rp-win-action">
            {fastestWin.action} <span>{fastestWin.timeframe}.</span>
          </p>
          <p className="rp-win-detail">{fastestWin.detail}</p>
        </div>
      </article>

      {/* Page 2 — market, plan, path, next step */}
      <article className="rp-sheet">
        <div className="rp-card rp-card--market">
          <p className="rp-section-eyebrow">Recommended market</p>
          <p className="rp-market-name">{recommendedMarket.market}</p>
          <p className="rp-market-reason">
            <strong>Reason:</strong> {recommendedMarket.reason}
          </p>
          <div className="rp-growth">
            <p className="rp-section-eyebrow">Growth focus</p>
            <p className="rp-growth-area">{growthFocus.area}</p>
            <p className="rp-growth-detail">{growthFocus.detail}</p>
          </div>
        </div>

        <div className="rp-two-col rp-two-col--plan">
          <div className="rp-card">
            <h2 className="rp-card-title">30-day action plan</h2>
            <ol className="rp-plan-list">
              {actionPlan30.map((step, i) => (
                <li key={i}>
                  <span className="rp-plan-num">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rp-card">
            <h2 className="rp-card-title">Recommended GIYA path</h2>
            <ol className="rp-path-list">
              {recommendedPath.map((step, i) => (
                <li key={step}>
                  <span className="rp-path-num">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="rp-academy">
              Flagship: <strong>{report.recommendedAcademy}</strong>
            </p>
          </div>
        </div>

        <div className="rp-card rp-card--cta">
          <p className="rp-section-eyebrow">Your next step</p>
          <h2 className="rp-cta-title">Unlock Your Advisor Growth Roadmap</h2>
          <ul className="rp-benefits">
            {GROWTH_ROADMAP_BENEFITS.map((b) => (
              <li key={b}>✓ {b}</li>
            ))}
          </ul>
          <p className="rp-cta-url">joingiya.com · Free membership</p>
        </div>

        <footer className="rp-footer">
          Save the Business. Protect the Family. Preserve the Legacy.
        </footer>
      </article>
    </div>
  );
}

export function printReadinessReport() {
  const root = document.getElementById('readiness-report-print');
  if (!root) return;
  document.body.classList.add('printing-readiness-report');
  const cleanup = () => {
    document.body.classList.remove('printing-readiness-report');
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.print();
}
