import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './FooterCTA.css';

const FooterCTA = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const showCTA = location.pathname === '/' || location.pathname === '/online' || location.pathname === '/kontakt' || location.pathname === '/aktuality';

  return (
    <div className={`footer-cta-wrapper ${isHome ? 'is-home' : ''} ${!showCTA ? 'no-cta' : ''}`}>
      <div className="footer-cta-arch"></div>
      <footer className="footer-cta-container">

        <div className="footer-cta-content">
          {/* --- HORNI CTA BLOK --- */}
          {showCTA && (
            <div className="cta-block">
              {/* Masivní Watermark logo na pozadí, rovnou za textem */}
              <div className="footer-watermark-logo">
                <img src="/SLG bez textu logo.webp" alt="" aria-hidden="true" />
              </div>

              <h2 className="cta-title">
                Přidejte se k 700+ studentům,<br />
                kteří se s námi naučili mluvit
              </h2>
              <Link to="/kurzy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cta-button">
                VYBRAT KURZ
              </Link>
            </div>
          )}

          {/* --- SPODNÍ PATIČKA (FOOTER) --- */}
          <div className="footer-main-grid">
            {/* Levý sloupec s logem (pouze pro 1300px+) */}
            <div className="footer-brand-col">
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="footer-logo">
                <img src="/SLG bez textu logo.webp" alt="Sunrise Logo" className="footer-img-logo" />
              </Link>
            </div>

            {/* Informační sloupce (Grid) */}
            <div className="footer-info-grid">
              {/* Sloupec 1: O firmě */}
              <div className="info-col">
                <h4 className="info-title">Vedení a fakturace</h4>
                <p className="info-text">
                  SUNRISE Language Agency, s.r.o.<br />
                  Mgr. Lucie Tomková<br />
                  IČO: 07035314
                </p>
              </div>

              {/* Sloupec 2: Adresa */}
              <div className="info-col">
                <h4 className="info-title">Kde nás najdete</h4>
                <p className="info-text">
                  Jana Palacha 1638<br />
                  530 02 Pardubice<br />
                  Zelené Předměstí<br />
                  Czechia
                </p>
              </div>

              {/* Sloupec 3: Kontakt */}
              <div className="info-col extra-gap">
                <h4 className="info-title">Kontakt a podpora</h4>
                <p className="info-text">
                  tel.: <a href="tel:+420608221625" style={{ color: 'inherit', textDecoration: 'none' }}>+420 608 22 16 25</a><br />
                  <a href="mailto:sunrise@sunrise-la.cz" style={{ color: 'inherit', textDecoration: 'none' }}>sunrise@sunrise-la.cz</a>
                </p>
                <div className="footer-social-icons">
                  <a href="https://www.instagram.com/sunriselanguageagency" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                    </svg>
                  </a>
                  <a href="https://www.facebook.com/SunriseLanguageAgency/?ref=embed_page#" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/lucie-tomková-38b94851" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="LinkedIn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Sloupec 4: Právní informace */}
              <div className="info-col extra-gap">
                <h4 className="info-title">Právní informace</h4>
                <p className="info-text">
                  <Link to="/obchodni-podminky" onClick={() => window.scrollTo(0, 0)} style={{ color: 'inherit', textDecoration: 'none' }} className="legal-link-hover">Obchodní podmínky</Link><br />
                  <Link to="/ochrana-osobnich-udaju" onClick={() => window.scrollTo(0, 0)} style={{ color: 'inherit', textDecoration: 'none' }} className="legal-link-hover">Ochrana osobních údajů</Link><br />
                  <span className="cookie-settings" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="material-symbols-outlined footer-cookie-icon" style={{ fontSize: '1.1rem' }}>cookie</span>
                    Nastavení cookies
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* --- ÚPLNÝ SPODEK (BOTTOM RAIL) --- */}
          <div className="footer-bottom-rail">
            <div className="footer-credits-row">
              <span className="copyright-text">© {new Date().getFullYear()} All Rights Reserved.</span>

              {/* Design By kredit (ozeman.cz) */}
              <div className="credits-right">
                <span className="designed-by">Vytvořil </span>
                <a href="https://ozeman.cz" target="_blank" rel="noopener noreferrer" className="creator-link">
                  OZEMAN.CZ
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterCTA;
