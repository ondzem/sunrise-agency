import React, { useState, useEffect } from 'react';
import './CookieBanner.css';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: true
  });

  useEffect(() => {
    // Zkontrolujeme, jestli už uživatel klikl v minulosti
    const consent = localStorage.getItem('sunrise_cookie_consent');
    if (!consent) {
      // Zpoždění 5 vteřin, aby si uživatel stihl prohlédnout web, než na něj lišta vyskočí
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (choice) => {
    localStorage.setItem('sunrise_cookie_consent', JSON.stringify(choice));
    // Zde bychom v budoucnu spustili Google Analytics (dataLayer.push atd.) podle voleb
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => saveConsent({ necessary: true, analytics: true, marketing: true });
  const handleDecline = () => saveConsent({ necessary: true, analytics: false, marketing: false });
  const handleSaveSettings = () => saveConsent({ necessary: true, ...preferences });

  if (!isVisible) return null;

  return (
    <>
      {/* Hlavní lišta */}
      <div className={`cookie-banner-overlay ${showSettings ? 'hidden' : ''}`}>
        <div className="cookie-banner">
          <div className="cookie-content">
            <div className="cookie-icon">
              <span className="material-symbols-outlined">cookie</span>
            </div>
            <div className="cookie-text">
              <h4>Respektujeme Vaše soukromí</h4>
              <p>
                Pro správné fungování webu, analýzu návštěvnosti a případnou personalizaci obsahu potřebujeme Váš souhlas s využitím cookies.
              </p>
            </div>
          </div>
          <div className="cookie-actions">
            <button onClick={() => setShowSettings(true)} className="cookie-btn-text">
              Nastavení
            </button>
            <button onClick={handleDecline} className="cookie-btn-outline">
              Pouze nezbytné
            </button>
            <button onClick={handleAcceptAll} className="btn btn-primary cookie-btn-primary">
              Přijmout vše
            </button>
          </div>
        </div>
      </div>

      {/* Modal pro detailní nastavení */}
      {showSettings && (
        <div className="cookie-modal-overlay fade-in">
          <div className="cookie-modal">
            <div className="cookie-modal-header">
              <h3>Nastavení cookies</h3>
              <button onClick={() => setShowSettings(false)} className="cookie-modal-close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="cookie-modal-body">
              <p className="cookie-modal-desc">
                Zde si můžete vybrat, jaké typy souborů cookie nám povolíte používat. Vaše volba nám pomůže vylepšovat web.
              </p>
              
              <div className="cookie-option">
                <div className="cookie-option-info">
                  <label>Nezbytné cookies</label>
                  <span>Tyto cookies jsou nutné pro samotné fungování webu a nelze je vypnout. Bez nich by stránka nepracovala správně.</span>
                </div>
                <div className="cookie-toggle">
                  <input type="checkbox" checked disabled />
                  <span className="toggle-slider"></span>
                </div>
              </div>

              <div className="cookie-option">
                <div className="cookie-option-info">
                  <label>Analytické cookies</label>
                  <span>Pomáhají nám pochopit, co Vás na webu zajímá nejvíce, abychom ho mohli neustále zlepšovat (např. Google Analytics).</span>
                </div>
                <label className="cookie-toggle" style={{ cursor: 'pointer' }}>
                  <input type="checkbox" checked={preferences.analytics} onChange={e => setPreferences({...preferences, analytics: e.target.checked})} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="cookie-option">
                <div className="cookie-option-info">
                  <label>Marketingové cookies</label>
                  <span>Slouží k zobrazení relevantních reklam a měření jejich účinnosti, abychom Vás neobtěžovali nesmysly (např. Facebook Pixel).</span>
                </div>
                <label className="cookie-toggle" style={{ cursor: 'pointer' }}>
                  <input type="checkbox" checked={preferences.marketing} onChange={e => setPreferences({...preferences, marketing: e.target.checked})} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

            </div>
            <div className="cookie-modal-footer">
              <button onClick={handleSaveSettings} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
                Uložit moje preference
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
