export default function ProgressBar({ step, total }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span>
          Step {step} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
