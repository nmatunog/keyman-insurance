export function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="option-group" role="radiogroup" aria-label={name}>
      {options.map((opt) => (
        <label key={opt} className="option">
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export function CheckboxGroup({ options, values, onChange }) {
  const toggle = (opt) => {
    const next = values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt];
    onChange(next);
  };
  return (
    <div className="check-grid">
      {options.map((opt) => (
        <label key={opt} className="option">
          <input type="checkbox" checked={values.includes(opt)} onChange={() => toggle(opt)} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}
