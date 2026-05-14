import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

// ZDE DOPLNÍŠ SVÉ MĚŘICÍ ID Z GOOGLE ANALYTICS
const TRACKING_ID = "G-XXXXXXXXXX"; 

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const initAndSend = () => {
      const consentRaw = localStorage.getItem('sunrise_cookie_consent');
      if (consentRaw) {
        try {
          const consent = JSON.parse(consentRaw);
          if (consent.analytics && TRACKING_ID !== "G-XXXXXXXXXX") {
            if (!ReactGA.isInitialized) {
              ReactGA.initialize(TRACKING_ID);
            }
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
          }
        } catch (e) {
          console.error("Chyba při parsování cookie consentu", e);
        }
      }
    };

    // Spustit při změně URL
    initAndSend();

    // Poslouchat na moment, kdy uživatel poprvé odklikne lištu (z CookieBanner.jsx)
    window.addEventListener('cookie_consent_updated', initAndSend);
    
    return () => {
      window.removeEventListener('cookie_consent_updated', initAndSend);
    };
  }, [location]);

  return null;
};

export default AnalyticsTracker;
