import { GIYA_FUNNEL } from '../data/giyaFunnel';

/** Compact vertical funnel — highlights current step. */
export default function FunnelLadder({ currentStep = null, compact = false }) {
  return (
    <nav className={`funnel-ladder ${compact ? 'funnel-ladder--compact' : ''}`} aria-label="GIYA advisor journey">
      <p className="funnel-ladder-title">Your GIYA journey</p>
      <ol className="funnel-ladder-list">
        {GIYA_FUNNEL.map((item) => {
          const isCurrent = currentStep === item.step;
          const isPast = currentStep != null && item.step < currentStep;
          const href = item.internal ? undefined : item.href;
          const inner = (
            <>
              <span className="funnel-step-num" aria-hidden="true">
                {isPast ? '✓' : item.step}
              </span>
              <span className="funnel-step-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="funnel-step-label">
                {item.label}
                {item.note && <span className="funnel-step-note"> · {item.note}</span>}
              </span>
            </>
          );
          return (
            <li
              key={item.step}
              className={`funnel-step ${isCurrent ? 'funnel-step--current' : ''} ${isPast ? 'funnel-step--done' : ''}`}
            >
              {href ? (
                <a href={href} className="funnel-step-link">
                  {inner}
                </a>
              ) : (
                <span className="funnel-step-link">{inner}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
