import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-skyline" aria-hidden="true" />
      <div className="hero-inner">
        <p className="hero-eyebrow">GIYA Discover · Business Insurance</p>
        <h1>Keyman Readiness Assessment</h1>
        <p className="hero-tagline">
          How prepared are you to protect a business, a family, and a legacy?
        </p>
        <p className="hero-copy">
          This short assessment will help you identify your current level of readiness and determine
          the next steps in developing your Business Insurance practice. Takes approximately{' '}
          <strong style={{ color: 'var(--gold-light)' }}>3 minutes</strong>.
        </p>
        <p className="hero-meta">Nilo B. Matunog, PFA · RFP · GIYA</p>
        <Link to="/assessment" className="btn btn-primary">
          Start assessment
        </Link>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--gray-muted)' }}>
          ~3 minutes · Free community access after you complete
        </p>
      </div>
    </section>
  );
}
