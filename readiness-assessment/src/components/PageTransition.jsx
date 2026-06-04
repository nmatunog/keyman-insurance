import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
