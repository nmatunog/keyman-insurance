import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { Field, RadioGroup, CheckboxGroup } from '../components/QuestionCard';
import {
  STEPS,
  INITIAL_FORM,
  YEARS_OPTIONS,
  KEYMAN_CASES,
  CONFIDENCE,
  CHALLENGES,
  NETWORK_SIZE,
  DISCUSSED,
  MARKETS,
  ADVANCED_TOPICS,
  MASTERCLASS_INTEREST,
  FORMATS,
  YES_NO,
  COMMITMENT,
} from '../data/questions';
import { saveResultPayload } from '../data/resultProfiles';
import { submitAssessment } from '../services/assessmentService';

function validateStep(step, form) {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  switch (step) {
    case 1:
      if (!form.full_name.trim()) return 'Please enter your full name.';
      if (!form.mobile.trim()) return 'Please enter your mobile number.';
      if (!emailOk) return 'Please enter a valid email address.';
      if (!form.years_in_service) return 'Please select years in financial services.';
      return null;
    case 2:
      if (!form.keyman_cases) return 'Please select your Keyman case experience.';
      if (!form.confidence_level) return 'Please select your confidence level.';
      if (!form.challenge_areas.length) return 'Select at least one challenging area.';
      return null;
    case 3:
      if (!form.business_owner_network) return 'Please select your business owner network size.';
      if (!form.discussed_last_12_months) return 'Please select how many owners you discussed Keyman with.';
      if (!form.markets.length) return 'Select at least one market of interest.';
      return null;
    case 4:
      if (!form.advanced_topics.length) return 'Select at least one advanced topic.';
      if (!form.masterclass_interest) return 'Please indicate your Master Class interest.';
      if (!form.preferred_format) return 'Please select a preferred format.';
      if (!form.resource_permission) return 'Please indicate if you want future resources.';
      return null;
    case 5:
      if (!form.conversation_commitment) return 'Please select your 30-day conversation commitment.';
      return null;
    default:
      return null;
  }
}

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const meta = STEPS[step - 1];
  const patch = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const goNext = () => {
    const msg = validateStep(step, form);
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    const msg = validateStep(5, form);
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const outcome = await submitAssessment(form);
      const firstName = form.full_name.trim().split(/\s+/)[0] || '';
      const payload = {
        scoring: outcome.scoring,
        firstName,
        insights: {
          confidence: form.confidence_level,
          cases: form.keyman_cases,
          masterclassInterest: form.masterclass_interest,
        },
      };
      saveResultPayload(payload);
      navigate('/thank-you', { state: { result: payload } });
    } catch (e) {
      setError(e.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="assessment-layout">
      <ProgressBar step={step} total={STEPS.length} />
      <div className="card">
        <h2>{meta.title}</h2>
        <p className="card-sub">{meta.subtitle}</p>
        {error && <div className="error-banner" role="alert">{error}</div>}

        {step === 1 && (
          <>
            <Field label="Full Name">
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => patch('full_name', e.target.value)}
                autoComplete="name"
                placeholder="Juan Dela Cruz"
              />
            </Field>
            <Field label="Mobile Number">
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => patch('mobile', e.target.value)}
                autoComplete="tel"
                placeholder="+63 9XX XXX XXXX"
              />
            </Field>
            <Field label="Email Address">
              <input
                type="email"
                value={form.email}
                onChange={(e) => patch('email', e.target.value)}
                autoComplete="email"
                placeholder="you@agency.com"
              />
            </Field>
            <Field label="Years in Financial Services">
              <RadioGroup
                name="years_in_service"
                options={YEARS_OPTIONS}
                value={form.years_in_service}
                onChange={(v) => patch('years_in_service', v)}
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="How many Keyman Insurance cases have you personally closed?">
              <RadioGroup
                name="keyman_cases"
                options={KEYMAN_CASES}
                value={form.keyman_cases}
                onChange={(v) => patch('keyman_cases', v)}
              />
            </Field>
            <Field label="Which best describes your confidence level in discussing Keyman Insurance?">
              <RadioGroup
                name="confidence_level"
                options={CONFIDENCE}
                value={form.confidence_level}
                onChange={(v) => patch('confidence_level', v)}
              />
            </Field>
            <Field label="Which area do you find most challenging?">
              <CheckboxGroup
                options={CHALLENGES}
                values={form.challenge_areas}
                onChange={(v) => patch('challenge_areas', v)}
              />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <Field label="How many business owner clients are currently in your network?">
              <RadioGroup
                name="business_owner_network"
                options={NETWORK_SIZE}
                value={form.business_owner_network}
                onChange={(v) => patch('business_owner_network', v)}
              />
            </Field>
            <Field label="Approximately how many business owners have you discussed Keyman Insurance with in the last 12 months?">
              <RadioGroup
                name="discussed_last_12_months"
                options={DISCUSSED}
                value={form.discussed_last_12_months}
                onChange={(v) => patch('discussed_last_12_months', v)}
              />
            </Field>
            <Field label="Which business markets interest you most?">
              <CheckboxGroup
                options={MARKETS}
                values={form.markets}
                onChange={(v) => patch('markets', v)}
              />
            </Field>
          </>
        )}

        {step === 4 && (
          <>
            <Field label="If offered, which advanced topic would you most want to learn?">
              <CheckboxGroup
                options={ADVANCED_TOPICS}
                values={form.advanced_topics}
                onChange={(v) => patch('advanced_topics', v)}
              />
            </Field>
            <Field label="Would you be interested in joining a small-group Master Class focused on Business Insurance and Advanced Case Design?">
              <RadioGroup
                name="masterclass_interest"
                options={MASTERCLASS_INTEREST}
                value={form.masterclass_interest}
                onChange={(v) => patch('masterclass_interest', v)}
              />
            </Field>
            <Field label="Which format would you prefer?">
              <RadioGroup
                name="preferred_format"
                options={FORMATS}
                value={form.preferred_format}
                onChange={(v) => patch('preferred_format', v)}
              />
            </Field>
            <Field label="Would you like to receive future resources, case studies, and invitations?">
              <RadioGroup
                name="resource_permission"
                options={YES_NO}
                value={form.resource_permission}
                onChange={(v) => patch('resource_permission', v)}
              />
            </Field>
          </>
        )}

        {step === 5 && (
          <>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              In the next 30 days, how many business owner conversations do you commit to having?
            </p>
            <Field label="Your commitment">
              <RadioGroup
                name="conversation_commitment"
                options={COMMITMENT}
                value={form.conversation_commitment}
                onChange={(v) => patch('conversation_commitment', v)}
              />
            </Field>
          </>
        )}

        <div className="nav-row">
          {step > 1 ? (
            <button type="button" className="btn btn-secondary" onClick={goBack} disabled={submitting}>
              Back
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length ? (
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Continue
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit assessment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
