import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { COMMUNITY_BENEFITS } from '../data/resultProfiles';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <section className="assessment-layout" style={{ paddingTop: 0 }}>
        <div className="community-cta-box">
          <p className="community-cta-eyebrow">After your assessment</p>
          <h3 className="community-cta-title" style={{ fontSize: '1.25rem' }}>
            Join the GIYA community — free
          </h3>
          <ul className="community-benefits" style={{ textAlign: 'left', margin: '0 auto 1rem', maxWidth: '320px' }}>
            {COMMUNITY_BENEFITS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <Link to="/assessment" className="btn btn-primary">
            Start assessment
          </Link>
        </div>
        <div className="secondary-interest-box" style={{ marginTop: '1rem' }}>
          <p className="secondary-interest-label">Later — advanced track</p>
          <p className="secondary-interest-title" style={{ fontSize: '1rem' }}>
            Business Insurance Master Class
          </p>
          <p className="secondary-interest-copy">Priority waitlist · launching soon</p>
          <a href="/#waitlist" className="btn btn-secondary result-cta-waitlist" style={{ fontSize: '0.85rem' }}>
            Learn about the waitlist
          </a>
        </div>
      </section>
    </>
  );
}
