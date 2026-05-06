import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/SLG bez textu logo.webp" alt="Sunrise Logo" className="logo-img" />
          </Link>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        <div className={`navbar-right ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/online" className={isActive('/online')} onClick={() => setIsMobileMenuOpen(false)}>SUNRISE Online</Link></li>
            <li><Link to="/kurzy" className={isActive('/kurzy')} onClick={() => setIsMobileMenuOpen(false)}>Kurzy</Link></li>
            <li><Link to="/firemni-kurzy" className={isActive('/firemni-kurzy')} onClick={() => setIsMobileMenuOpen(false)}>Firemní Kurzy</Link></li>
            <li><Link to="/english-club" className={isActive('/english-club')} onClick={() => setIsMobileMenuOpen(false)}>English Club</Link></li>
            <li><Link to="/letni-program" className={isActive('/letni-program')} onClick={() => setIsMobileMenuOpen(false)}>Letní Program</Link></li>
            <li><Link to="/kontakt" className={isActive('/kontakt')} onClick={() => setIsMobileMenuOpen(false)}>Kontakt</Link></li>
          </ul>
          <div className="navbar-actions">
            <Link to="/kurzy" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Nabídka kurzů</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
