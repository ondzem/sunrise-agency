import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './SummerCamps.css';

gsap.registerPlugin(ScrollTrigger);

const SummerCamps = () => {
  const container = useRef(null);

  // Pole fotek obsahující Vaši zadanou reálnou fotografii a pak sérii velkých lifestylových placeholders na vyplnění řádků
  const galleryImages = [
    "/Upraveny klucina se smoulou.webp",      // Původní 3. nyní 1.
    "/Tabor zabavne uceni.webp",           // Původní 10. nyní 2.
    "/Tabor prezentace na pocitaci.webp",  // Původní 5. nyní 3.
    "/Tabor prezentace pred tabuli.webp",  // Původní 6. nyní 4.
    "/Letni program sunrise.webp",         // Původní 7. nyní 5.
    "/Tabor Anicka vysvetlujici hrave.webp",// Původní 1. nyní 6.
    "/Tabor zabavne rovnani.webp",         // Původní 9. nyní 7.
    "/Tabor meditace.webp",                // Původní 4. nyní 8.
    "/Tabor venkovni hrani.webp",          // Původní 8. nyní 9.
    "/Tabor fotka chobotnice.webp"      // Původní 2. nyní 10.
  ];

  useGSAP(() => {
    // 2. Extrémně precizní a neprůstřelná deklarace obousměrných animací
    const headers = gsap.utils.toArray('.camps-gallery-header h2, .camps-gallery-header p, .btn-camps-action-center');
    headers.forEach((el, index) => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, delay: index * 0.1, ease: 'back.out(1)',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%', // Začíná bezpečně blízko spodního okraje
            end: 'bottom 5%', // Končí bezpečně blízko horního okraje
            once: true
          }
        }
      );
    });

    const items = gsap.utils.toArray('.gallery-item');
    items.forEach((el, index) => {
      const delay = (index % 5) * 0.1;
      gsap.fromTo(el,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1.2, delay: delay, ease: 'back.out(1)',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            end: 'bottom 5%',
            once: true
          }
        }
      );
    });





  }, { scope: container });

  return (
    <section className="camps-gallery-section" id="tabory" ref={container}>
      <div className="camps-gallery-container">

        {/* Centrální Hlavička */}
        <div className="camps-gallery-header">
          <h2>Letní Programy</h2>
          <p>
            Letní tábory s angličtinou v Pardubicích a intenzivní kurzy pro studenty i dospělé.
          </p>
          <Link to="/letni-program" className="btn-camps-action-center">
            Zjistit termíny
          </Link>
        </div>

        {/* Mřížka (2x5 Grid) překrývající offscreen obrazovku jako v referenci */}
        <div className="camps-gallery-grid-wrapper">
          <div className="camps-gallery-grid">
            {galleryImages.map((src, index) => (
              <div key={index} className="gallery-item">
                <img src={src} alt={`Momentka z letního programu Sunrise ${index + 1}`} decoding="async" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SummerCamps;
