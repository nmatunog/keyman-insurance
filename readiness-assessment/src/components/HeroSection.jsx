import { Link } from 'react-router-dom';
import { SITE_LINKS } from '../data/resultProfiles';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-skyline" aria-hidden="true" />
      <div className="hero-inner">
        <p className="hero-eyebrow">Step 2 · GIYA Advisor Readiness</p>
        <h1>Keyman Readiness Assessment</h1>
        <p className="hero-tagline">How prepared are you to protect a business, a family, and a legacy?</p>
        <p className="hero-copy">
          New here? Visit the <strong style={{ color: 'var(--gold-light)' }}>Keyman Resource Center</strong>{' '}
          first. Then complete this 3-minute assessment for your personalized advisor result.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'center', maxWidth: '320px', margin: '0 auto' }}>
          <a href={SITE_LINKS.keymanResource} className="btn btn-secondary" style={{ width: '100%' }}>
            Keyman Resource Center
          </a>
          <Link to="/assessment" className="btn btn-primary" style={{ width: '100%' }}>
            Start assessment
          </Link>
        </div>
        <p className="hero-meta">~3 min · Free · No purchase required</p>
      </div>
    </section>
  );
}
