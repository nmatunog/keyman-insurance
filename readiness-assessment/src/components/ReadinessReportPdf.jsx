/**
 * Printable 5-page readiness report (browser Save as PDF).
 */
export default function ReadinessReportPdf({ report, firstName, generatedAt }) {
  if (!report) return null;

  const greet = firstName ? `${firstName}` : 'Advisor';
  const { recommendedMarket, growthFocus, fastestWin, actionPlan30, recommendedPath } = report;

  return (
    <div id="readiness-report-print" className="readiness-report-print" aria-hidden="true">
      <section className="report-print-page">
        <header className="report-print-header">
          <img src="/assets/giya-logo.png" alt="" width={80} height={80} />
          <div>
            <p className="report-print-brand">GIYA Institute</p>
            <h1>Advisor Readiness Report</h1>
            <p className="report-print-meta">
              Prepared for {greet} · {generatedAt}
            </p>
          </div>
        </header>
        <div className="report-print-hero">
          <p className="report-print-label">Readiness score</p>
          <p className="report-print-score">{report.score}/100</p>
          <p className="report-print-type">{report.profileTitle}</p>
          <p className="report-print-focus">
            Growth focus: <strong>{growthFocus.area}</strong>
          </p>
        </div>
      </section>

      <section className="report-print-page">
        <h2>Your strengths</h2>
        <ul>
          {report.strengths.map((s) => (
            <li key={s}>✓ {s}</li>
          ))}
        </ul>
        <p className="report-print-note">{report.headline}</p>
      </section>

      <section className="report-print-page">
        <h2>Development areas</h2>
        <ul>
          {report.gaps.map((g) => (
            <li key={g}>⚠ {g}</li>
          ))}
        </ul>
        <p className="report-print-note">{report.summary}</p>
      </section>

      <section className="report-print-page">
        <h2>30-day action plan</h2>
        <ol>
          {actionPlan30.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <div className="report-print-callout">
          <p>
            <strong>{fastestWin.title}:</strong> {fastestWin.action} {fastestWin.timeframe}.
          </p>
          <p>{fastestWin.detail}</p>
        </div>
        <p>
          Recommended market: <strong>{recommendedMarket.market}</strong> — {recommendedMarket.reason}
        </p>
      </section>

      <section className="report-print-page">
        <h2>Recommended GIYA path</h2>
        <ol className="report-print-path">
          {recommendedPath.map((step, i) => (
            <li key={step}>
              <span className="report-print-path-num">{i + 1}</span> {step}
            </li>
          ))}
        </ol>
        <p>
          Flagship academy: <strong>{report.recommendedAcademy}</strong>
        </p>
        <p className="report-print-footer">
          Save the Business. Protect the Family. Preserve the Legacy. · joingiya.com
        </p>
      </section>
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
