import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './SunriseOnline.css';

gsap.registerPlugin(ScrollTrigger);

const SunriseOnline = () => {
  const container = useRef(null);

  useGSAP(() => {
    // 1. Přednastavení prvků obsahu do skryté pozice
    gsap.set('.flecto-badge, .flecto-title, .flecto-desc, .flecto-btn, .flecto-note-block', {
      y: 50, opacity: 0
    });

    let mm = gsap.matchMedia();

    mm.add("(max-width: 768px)", () => {
      // Mobil: aktivace celé sekce najednou, jakmile sekce přijede do viewportu
      gsap.to('.flecto-badge, .flecto-title, .flecto-desc, .flecto-btn, .flecto-note-block', {
        y: 0, opacity: 1, duration: 1, stagger: 0.05, ease: 'back.out(1)',
        scrollTrigger: {
          trigger: container.current,
          start: 'top 85%',
          once: true
        }
      });
    });

    mm.add("(min-width: 769px)", () => {
      // 2. Kaskádová animace prvků uvnitř karty (aplikován stejný luxusní vzor z předchozích sekcí)
      ScrollTrigger.batch('.flecto-badge, .flecto-title, .flecto-desc, .flecto-btn, .flecto-note-block', {
        interval: 0.1,
        start: 'top 85%',
        once: true,
        onEnter: batch => gsap.to(batch, {
          y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'back.out(1)'
        })
      });
    });

    // 3. Oživení Tvaru v pozadí - Jemný Parallax efekt propojený na Scrub (kolečko myši)
    gsap.to('.flecto-organic-blob-subtle', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom', // od objevení sekce zespodu
        end: 'bottom top',   // do chvíle, než zajede nahoru
        scrub: 1.5           // extrémně jemné a pomalé "drhnutí" scrollem (hodnota 1.5 s smoothing)
      },
      y: 200,               // Pohybuje se relativně k pozadí dolů (vytváří dojem hloubky)
      rotation: 45,         // Plynule se pomalu otáčí
      scale: 1.2,           // Lehounce a mysteriózně se zvětšuje
      ease: 'none'
    });

  }, { scope: container });

  return (
    <section className="online-flecto-section px-4 md:px-8" id="online" ref={container}>
      <div className="flecto-card-container">

        {/* Jemná, nenápadná hloubka sekce */}
        <div className="flecto-organic-blob-subtle"></div>

        <div className="flecto-grid">

          {/* LEVÁ STRANA: Title a Desc */}
          <div className="flecto-left">
            <div className="flecto-badge">
              Online
            </div>

            <h2 className="flecto-title">
              Studujete plynule,<br />ať jste <span className="text-magenta-accent">KDEKOLIV.</span>
            </h2>

            <p className="flecto-desc">
              Online kurzy angličtiny a dalších jazyků — odkudkoliv, s lektory, které si sami vyberete. Konec s hodinami, které nesedí do rozvrhu. Učení se přizpůsobí Vašemu životu, ne naopak.
            </p>
          </div>

          {/* PRAVÁ STRANA: CTA a Note */}
          <div className="flecto-right">
            <div className="flecto-action-wrapper">
              <Link to="/online" className="flecto-btn">
                <span className="material-symbols-outlined flecto-btn-icon">calendar_today</span>
                Přejít do online
              </Link>

              <div className="flecto-note-block">
                <span className="material-symbols-outlined flecto-note-icon">chat</span>
                <div className="flecto-note-text">
                  <span className="note-title">Zvolte si lektora i čas!</span>
                  <span className="note-body">
                    Vyberte si lektora podle stylu výuky a domluvte hodinu, kdy Vám to opravdu sedí.
                  </span>
                  <Link to="/online#lektori" className="note-link">Vybrat lektora</Link>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SunriseOnline;
