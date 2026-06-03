import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <section className="assessment-layout" style={{ paddingTop: 0 }}>
        <div className="waitlist-box">
          <h3>Join the Business Insurance Master Class Waiting List</h3>
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>
            Learn advanced strategies in:
          </p>
          <ul>
            <li>Keyman Planning</li>
            <li>Buy-Sell Funding</li>
            <li>Succession Planning</li>
            <li>Executive Benefits</li>
            <li>MDRT-Level Case Design</li>
          </ul>
          <Link to="/assessment" className="btn btn-primary">
            Reserve my spot
          </Link>
        </div>
      </section>
    </>
  );
}
