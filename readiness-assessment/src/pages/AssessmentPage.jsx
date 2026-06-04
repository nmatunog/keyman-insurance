import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import StepIndicator from '../components/StepIndicator';
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
import { loadFormDraft, clearFormDraft, useFormDraft } from '../hooks/useFormDraft';

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

function getInitialState() {
  const draft = loadFormDraft();
  if (draft) {
    return {
      form: { ...INITIAL_FORM, ...draft.form },
      step: Math.min(Math.max(1, draft.step), STEPS.length),
      restored: true,
    };
  }
  return { form: { ...INITIAL_FORM }, step: 1, restored: false };
}

export default function AssessmentPage() {
  const navigate = useNavigate();
  const initial = getInitialState();
  const [step, setStep] = useState(initial.step);
  const [form, setForm] = useState(initial.form);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState('forward');
  const [draftBanner, setDraftBanner] = useState(initial.restored);
  const errorRef = useRef(null);
  const stepRef = useRef(null);

  useFormDraft(form, step);

  const meta = STEPS[step - 1];
  const patch = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    stepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [error]);

  const goToStep = (target) => {
    if (target >= step) return;
    setDirection('back');
    setError('');
    setStep(target);
  };

  const goNext = () => {
    const msg = validateStep(step, form);
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    setDirection('forward');
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setError('');
    setDirection('back');
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
          resourcePermission: form.resource_permission === 'Yes',
          markets: form.markets,
          advancedTopics: form.advanced_topics,
        },
      };
      saveResultPayload({
        ...payload,
        emailSent: outcome.emailSent,
        emailReason: outcome.emailReason,
      });
      clearFormDraft();
      navigate('/thank-you', {
        state: { result: { ...payload, emailSent: outcome.emailSent, emailReason: outcome.emailReason } },
      });
    } catch (e) {
      setError(e.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const dismissDraftBanner = () => setDraftBanner(false);

  return (
    <div className="assessment-layout">
      <header className="assessment-intro">
        <img
          src="/assets/giya-logo.png"
          alt="GIYA Institute"
          width={160}
          height={160}
          className="giya-logo giya-logo--on-dark assessment-brand-logo"
          decoding="async"
        />
        <p className="assessment-intro-eyebrow">GIYA Advisor Readiness</p>
        <h1 className="assessment-intro-title">Business Insurance readiness</h1>
        <p className="assessment-intro-copy">
          ~3 minutes · Complimentary result · Progress saved automatically
        </p>
      </header>

      {draftBanner && (
        <div className="draft-banner" role="status">
          <span>We restored your in-progress answers.</span>
          <button type="button" className="draft-banner-dismiss" onClick={dismissDraftBanner}>
            Dismiss
          </button>
        </div>
      )}

      <StepIndicator step={step} onGoToStep={goToStep} />
      <ProgressBar step={step} total={STEPS.length} />

      <div
        ref={stepRef}
        className={`card step-surface step-surface--${direction}`}
        key={step}
      >
        <div className="step-card-header">
          <span className="step-card-badge">Section {step}</span>
          <h2>{meta.title}</h2>
          <p className="card-sub">{meta.subtitle}</p>
        </div>

        {error && (
          <div ref={errorRef} className="error-banner" role="alert">
            <span className="error-banner-icon" aria-hidden="true">!</span>
            {error}
          </div>
        )}

        <div className="step-fields">
          {step === 1 && (
            <>
              <Field label="Full Name" hint="As you would like it on your result email.">
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => patch('full_name', e.target.value)}
                  autoComplete="name"
                  placeholder="Juan Dela Cruz"
                />
              </Field>
              <Field label="Mobile Number" hint="Philippines mobile — we may send your guides via SMS.">
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => patch('mobile', e.target.value)}
                  autoComplete="tel"
                  placeholder="+63 9XX XXX XXXX"
                  inputMode="tel"
                />
              </Field>
              <Field label="Email Address" hint="Where we send your readiness result and complimentary guides.">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => patch('email', e.target.value)}
                  autoComplete="email"
                  placeholder="you@agency.com"
                  inputMode="email"
                />
              </Field>
              <Field label="Years in Financial Services">
                <RadioGroup
                  name="years_in_service"
                  legend="Years in financial services"
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
                  legend="Keyman cases closed"
                  options={KEYMAN_CASES}
                  value={form.keyman_cases}
                  onChange={(v) => patch('keyman_cases', v)}
                />
              </Field>
              <Field label="Which best describes your confidence level in discussing Keyman Insurance?">
                <RadioGroup
                  name="confidence_level"
                  legend="Confidence discussing Keyman"
                  options={CONFIDENCE}
                  value={form.confidence_level}
                  onChange={(v) => patch('confidence_level', v)}
                />
              </Field>
              <Field label="Which areas do you find most challenging?">
                <CheckboxGroup
                  legend="Challenging areas"
                  options={CHALLENGES}
                  values={form.challenge_areas}
                  onChange={(v) => patch('challenge_areas', v)}
                  minSelected={1}
                />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="How many business owner clients are in your network today?">
                <RadioGroup
                  name="business_owner_network"
                  legend="Business owner network size"
                  options={NETWORK_SIZE}
                  value={form.business_owner_network}
                  onChange={(v) => patch('business_owner_network', v)}
                />
              </Field>
              <Field
                label="How many business owners have you discussed Keyman Insurance with in the last 12 months?"
                hint="Honest answers help tailor your readiness profile."
              >
                <RadioGroup
                  name="discussed_last_12_months"
                  legend="Keyman conversations last 12 months"
                  options={DISCUSSED}
                  value={form.discussed_last_12_months}
                  onChange={(v) => patch('discussed_last_12_months', v)}
                />
              </Field>
              <Field label="Which business markets interest you most?">
                <CheckboxGroup
                  legend="Markets of interest"
                  options={MARKETS}
                  values={form.markets}
                  onChange={(v) => patch('markets', v)}
                  minSelected={1}
                />
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <Field label="Which advanced topics would you most want to learn?">
                <CheckboxGroup
                  legend="Advanced topics"
                  options={ADVANCED_TOPICS}
                  values={form.advanced_topics}
                  onChange={(v) => patch('advanced_topics', v)}
                  minSelected={1}
                />
              </Field>
              <Field label="Interested in a small-group Master Class on Business Insurance and advanced case design?">
                <RadioGroup
                  name="masterclass_interest"
                  legend="Master Class interest"
                  options={MASTERCLASS_INTEREST}
                  value={form.masterclass_interest}
                  onChange={(v) => patch('masterclass_interest', v)}
                />
              </Field>
              <Field label="Which format would you prefer?">
                <RadioGroup
                  name="preferred_format"
                  legend="Preferred format"
                  options={FORMATS}
                  value={form.preferred_format}
                  onChange={(v) => patch('preferred_format', v)}
                />
              </Field>
              <Field
                label="Send my two complimentary guides by email and keep me updated on case studies and invitations?"
                hint="Keyman Discovery Framework + Business Insurance Conversation Guide."
              >
                <RadioGroup
                  name="resource_permission"
                  legend="Email guides and updates"
                  options={YES_NO}
                  value={form.resource_permission}
                  onChange={(v) => patch('resource_permission', v)}
                />
              </Field>
            </>
          )}

          {step === 5 && (
            <>
              <div className="commitment-callout">
                <p className="commitment-callout-title">Your 30-day practice commitment</p>
                <p className="commitment-callout-copy">
                  Advisors who set a concrete conversation goal move faster from assessment to client impact.
                </p>
              </div>
              <Field label="How many business owner conversations will you commit to in the next 30 days?">
                <RadioGroup
                  name="conversation_commitment"
                  legend="30-day conversation commitment"
                  options={COMMITMENT}
                  value={form.conversation_commitment}
                  onChange={(v) => patch('conversation_commitment', v)}
                />
              </Field>
            </>
          )}
        </div>

        <div className="sticky-form-actions">
          <div className="nav-row">
            {step > 1 ? (
              <button type="button" className="btn btn-secondary" onClick={goBack} disabled={submitting}>
                Back
              </button>
            ) : (
              <span className="nav-spacer" aria-hidden="true" />
            )}
            {step < STEPS.length ? (
              <button type="button" className="btn btn-primary" onClick={goNext}>
                Continue
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-primary--submit"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="btn-spinner" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  'See my result'
                )}
              </button>
            )}
          </div>
          <p className="form-trust-line">
            Your responses are confidential · Used only to personalize your GIYA readiness profile
          </p>
        </div>
      </div>
    </div>
  );
}
