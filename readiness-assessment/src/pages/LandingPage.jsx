import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import FunnelLadder from '../components/FunnelLadder';
import { SITE_LINKS } from '../data/resultProfiles';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <section className="assessment-layout landing-path">
        <FunnelLadder currentStep={2} compact />
        <p className="path-hint">
          <strong>Start at the Keyman Resource Center</strong> if you are new — then take the assessment for
          your personalized result.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
          <a href={SITE_LINKS.keymanResource} className="btn btn-secondary" style={{ width: '100%' }}>
            Keyman Resource Center
          </a>
          <Link to="/assessment" className="btn btn-primary" style={{ width: '100%' }}>
            GIYA Advisor Readiness Assessment
          </Link>
        </div>
      </section>
    </>
  );
}
