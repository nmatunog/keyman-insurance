import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import FunnelLadder from '../components/FunnelLadder';
import { SITE_LINKS } from '../data/resultProfiles';

const BENEFITS = [
  'Personalized advisor readiness score',
  'Complimentary Keyman Discovery Framework',
  'Business Insurance Conversation Guide',
  'Clear next step in the GIYA journey',
];

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <section className="assessment-layout landing-path">
        <FunnelLadder currentStep={2} compact />
        <ul className="landing-benefits" aria-label="What you receive">
          {BENEFITS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="path-hint">
          <strong>New to Keyman?</strong> Start at the Resource Center, then take the assessment for your
          personalized result.
        </p>
        <div className="landing-cta-stack">
          <a href={SITE_LINKS.keymanResource} className="btn btn-secondary">
            Keyman Resource Center
          </a>
          <Link to="/assessment" className="btn btn-primary">
            Start the assessment
          </Link>
        </div>
      </section>
    </>
  );
}
