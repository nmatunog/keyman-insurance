import { STEPS } from '../data/questions';

const MIN_PER_STEP = 0.6;

export default function ProgressBar({ step, total }) {
  const pct = Math.round((step / total) * 100);
  const meta = STEPS[step - 1];
  const minutesLeft = Math.max(1, Math.ceil((total - step + 1) * MIN_PER_STEP));

  return (
    <div className="progress-wrap">
      <div className="progress-header">
        <div className="progress-header-text">
          <span className="progress-section-name">{meta?.title}</span>
          <span className="progress-step-count">
            Step {step} of {total}
          </span>
        </div>
        <span className="progress-time-badge" title="Estimated time remaining">
          ~{minutesLeft} min left
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Assessment progress: ${pct} percent`}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
