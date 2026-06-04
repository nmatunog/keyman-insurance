import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AssessmentPage from './pages/AssessmentPage';
import ThankYouPage from './pages/ThankYouPage';
import PageTransition from './components/PageTransition';
import './styles/theme.css';

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          GIYA
          <span className="brand-sub">Keyman Readiness</span>
        </Link>
        <nav className="header-nav" aria-label="Assessment">
          <a href="/keyman/" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
            Keyman
          </a>
          <NavLink
            to="/assessment"
            className={({ isActive }) =>
              `btn btn-secondary${isActive ? ' nav-active' : ''}`
            }
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
          >
            Assessment
          </NavLink>
          <a href="/" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
            Main site
          </a>
        </nav>
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
        <PageTransition>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Routes>
        </PageTransition>
      </AppShell>
    </BrowserRouter>
  );
}
