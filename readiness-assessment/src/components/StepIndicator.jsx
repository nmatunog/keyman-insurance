import { STEPS } from '../data/questions';

export default function StepIndicator({ step, onGoToStep }) {
  return (
    <nav className="step-indicator" aria-label="Assessment sections">
      <ol className="step-indicator-list">
        {STEPS.map((s) => {
          const done = s.id < step;
          const current = s.id === step;
          const upcoming = s.id > step;
          const canJump = done && onGoToStep;

          return (
            <li
              key={s.id}
              className={[
                'step-indicator-item',
                done && 'is-done',
                current && 'is-current',
                upcoming && 'is-upcoming',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {canJump ? (
                <button
                  type="button"
                  className="step-indicator-btn"
                  onClick={() => onGoToStep(s.id)}
                  aria-current={current ? 'step' : undefined}
                >
                  <span className="step-indicator-num" aria-hidden="true">
                    {done ? '✓' : s.id}
                  </span>
                  <span className="step-indicator-label">{s.title}</span>
                </button>
              ) : (
                <span className="step-indicator-btn step-indicator-btn--static" aria-current={current ? 'step' : undefined}>
                  <span className="step-indicator-num" aria-hidden="true">
                    {done ? '✓' : s.id}
                  </span>
                  <span className="step-indicator-label">{s.title}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
