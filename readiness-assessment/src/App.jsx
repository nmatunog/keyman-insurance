import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AssessmentPage from './pages/AssessmentPage';
import ThankYouPage from './pages/ThankYouPage';
import './styles/theme.css';

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          GIYA
          <span className="brand-sub">Keyman Readiness</span>
        </Link>
        <a href="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
          Main site
        </a>
      </header>
      <main>{children}</main>
      <footer className="app-footer">
        © {new Date().getFullYear()} GIYA · Nilo B. Matunog, PFA · RFP
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/readiness">
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
