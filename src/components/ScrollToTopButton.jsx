import React, { useState, useEffect, useRef } from 'react';
import './ScrollToTopButton.css';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Refy pro přímý zásah do DOMu mimo React render cycle pro 60fps plynulost
  const circleRef = useRef(null);
  
  // SVG parametry
  const radius = 23;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = document.documentElement.clientHeight;
      
      const maxScroll = docHeight - winHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      
      // Přímá změna CSS vlastnosti (bez záseků)
      if (circleRef.current) {
        const offset = circumference - (progress / 100) * circumference;
        circleRef.current.style.strokeDashoffset = offset;
      }

      // Pro viditelnost stačí React state, mění se jen málokdy
      setIsVisible(scrollTop > 300);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [circumference]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };



  return (
    <div 
      className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`} 
      onClick={scrollToTop}
      title="Zpět nahoru"
    >
      <svg className="progress-ring" width="56" height="56">
        {/* Pozadí kruhu */}
        <circle
          className="progress-ring-bg"
          stroke="rgba(0, 0, 0, 0.08)"
          strokeWidth="3"
          fill="transparent"
          r={radius}
          cx="28"
          cy="28"
        />
        {/* Vyplňující se kruh */}
        <circle
          ref={circleRef}
          className="progress-ring-fill"
          stroke="var(--color-primary, #EF67A5)"
          strokeWidth="3"
          fill="transparent"
          r={radius}
          cx="28"
          cy="28"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference
          }}
        />
      </svg>
      
      {/* Tlačítko uprostřed s šipkou */}
      <div className="scroll-btn-inner">
        <span className="material-symbols-outlined">arrow_upward</span>
      </div>
    </div>
  );
};

export default ScrollToTopButton;
