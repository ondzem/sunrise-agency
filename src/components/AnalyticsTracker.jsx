import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

// ZDE DOPLŇ SVÉ MĚŘICÍ ID Z GOOGLE ANALYTICS
const TRACKING_ID = "G-F082292T4E"; 

// SEM VLOŽ SVÉ ID PRO MICROSOFT CLARITY (např. "n8x9abcde1")
// Jakmile ho sem vložíš, Clarity se začne automaticky spouštět pouze uživatelům, kteří odsouhlasí cookies.
const CLARITY_ID = "wuqxxkf8vf"; 

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const initAndSend = () => {
      const consentRaw = localStorage.getItem('sunrise_cookie_consent');
      if (consentRaw) {
        try {
          const consent = JSON.parse(consentRaw);
          if (consent.analytics && TRACKING_ID !== "G-XXXXXXXXXX") {
            // Inicializace GA4
            if (!ReactGA.isInitialized) {
              ReactGA.initialize(TRACKING_ID);
            }
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });

            // Inicializace Microsoft Clarity (pokud je zadáno ID a ještě neběželo)
            if (CLARITY_ID && !window.clarity) {
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", CLARITY_ID);
              console.log("Microsoft Clarity initialized with ID:", CLARITY_ID);
            }
          }
        } catch (e) {
          console.error("Chyba při parsování cookie consentu / inicializaci analytiky", e);
        }
      }
    };

    // Spustit při změně URL nebo načtení
    initAndSend();

    // Poslouchat na moment, kdy uživatel poprvé odklikne lištu (z CookieBanner.jsx)
    window.addEventListener('cookie_consent_updated', initAndSend);

    // Globální poslech na kliknutí (Event Delegation)
    // Jakýkoliv element s atributem data-track-click se automaticky odešle jako event do GA4
    const handleDocumentClick = (event) => {
      const target = event.target.closest('[data-track-click]');
      if (target) {
        const eventName = target.getAttribute('data-track-click');
        const eventCategory = target.getAttribute('data-track-category') || 'interaction';
        const eventLabel = target.getAttribute('data-track-label') || target.textContent?.trim() || '';

        const consentRaw = localStorage.getItem('sunrise_cookie_consent');
        if (consentRaw) {
          try {
            const consent = JSON.parse(consentRaw);
            if (consent.analytics && ReactGA.isInitialized) {
              ReactGA.event(eventName, {
                event_category: eventCategory,
                event_label: eventLabel
              });
              console.log(`GA4 custom event sent: ${eventName} (${eventCategory} - ${eventLabel})`);
            }
          } catch (e) {
            console.error("Chyba při odesílání custom eventu do GA4", e);
          }
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      window.removeEventListener('cookie_consent_updated', initAndSend);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [location]);

  return null;
};

export default AnalyticsTracker;
