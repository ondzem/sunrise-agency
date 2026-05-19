import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = document.documentElement.clientHeight;
      
      const maxScroll = docHeight - winHeight;
      // Prevent division by zero
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      
      setScrollProgress(progress);

      // Zobrazit tlačítko po odscrollování 300px
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // SVG parametry
  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  // Offset kalkulace (100 = skryto, 0 = plný kruh)
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

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
          className="progress-ring-fill"
          stroke="var(--color-primary, #EF67A5)"
          strokeWidth="3"
          fill="transparent"
          r={radius}
          cx="28"
          cy="28"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset
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
