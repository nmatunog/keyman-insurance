export function Field({ label, hint, children, error }) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label className="field-label">{label}</label>
      {hint && <p className="field-hint">{hint}</p>}
      {children}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function RadioGroup({ name, options, value, onChange, legend }) {
  return (
    <div className="option-group" role="radiogroup" aria-label={legend || name}>
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <label key={opt} className={`option option--radio${selected ? ' is-selected' : ''}`}>
            <input
              type="radio"
              name={name}
              value={opt}
              checked={selected}
              onChange={() => onChange(opt)}
            />
            <span className="option-marker" aria-hidden="true" />
            <span className="option-text">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

export function CheckboxGroup({ options, values, onChange, legend, minSelected = 0 }) {
  const toggle = (opt) => {
    const next = values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt];
    onChange(next);
  };

  return (
    <div className="check-grid" role="group" aria-label={legend}>
      {minSelected > 0 && (
        <p className="check-grid-hint" aria-live="polite">
          {values.length === 0
            ? `Select at least ${minSelected}`
            : `${values.length} selected`}
        </p>
      )}
      {options.map((opt) => {
        const selected = values.includes(opt);
        return (
          <label key={opt} className={`option option--check${selected ? ' is-selected' : ''}`}>
            <input type="checkbox" checked={selected} onChange={() => toggle(opt)} />
            <span className="option-marker option-marker--check" aria-hidden="true" />
            <span className="option-text">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}
