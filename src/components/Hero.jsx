import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Hero.css';

const Hero = () => {
  const container = useRef(null);
  const navigate = useNavigate();

  const calculateNearestCampDate = () => {
    // Termíny začátků letního tábora (odpovídající SummerProgramPage.jsx)
    const campDates = [
      { start: new Date('2026-08-10'), label: '10. Srpna 2026' },
      { start: new Date('2026-08-24'), label: '24. Srpna 2026' }
    ];

    const now = new Date();
    // Vzít jen ty, které ještě nezačaly (odstraníme staré)
    const upcoming = campDates.filter(d => d.start >= now);

    if (upcoming.length > 0) {
      // Seřadit, abychom měli ten nejbližší první
      upcoming.sort((a, b) => a.start - b.start);
      return upcoming[0].label;
    }

    // Pokud už oba tábory v roce 2026 proběhly, vrátíme první jako default
    return campDates[0].label;
  };

  const nearestDate = calculateNearestCampDate();

  useGSAP(() => {
    // Definice Master Timeline pro sekvenční průběh
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Zpomalí celou sekvenci na 65% rychlosti, dodá plynulost a tíhu ("luxusní vibe")
    tl.timeScale(0.65);

    // --- Fáze 1: Vstup textů vlevo (Reveal efekt) ---
    // Badge pill se objeví a sjede na místo
    tl.fromTo('.gsap-badge',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.1 }
    )

      // Maskovaný přílet hlavního nadpisu (každý řádek zvlášť)
      .fromTo('.gsap-reveal-text',
        { yPercent: 120 },
        { yPercent: 0, duration: 1.2, stagger: 0.15 },
        "-=0.7" // Mírné překrytí s předchozí animací
      )

      // Naskočení odstavce a tlačítek s jemným posunem a průhledností
      .fromTo(['.gsap-desc', '.btn-explore', '.link-methods'],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
        "-=0.9"
      );

    // --- Fáze 2: Vizuální wow efekt vpravo (Pebble maska) ---
    // Nástup Pebble masky (jako zmenšená z nitra vyrůstá)
    tl.fromTo('.pebble-mask',
      { scale: 0.8, opacity: 0, rotation: -5 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.5, ease: "elastic.out(1, 0.75)" },
      "-=1.5" // Vybuchuje společně s texty!
    )

      // Do příletu masky pozvolna rotuje dovnitř a padá překrývající obrázek ("Marek")
      .fromTo('.overlapping-photo-container',
        { x: 50, y: 50, scale: 0.5, opacity: 0, rotation: 15 },
        { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: "back.out(1.4)" },
        "-=1.2"
      )

      // Nakonec připluje informativní plovoucí karta
      .fromTo('.floating-accent-card',
        { y: -30, opacity: 0, rotation: 0 },
        { y: 0, opacity: 1, rotation: -6, duration: 1, ease: "power2.out" },
        "-=1"
      );

    // Nekonečná pulzace plynulých prvků v pozadí
    gsap.to('.blob-decorator', {
      duration: 3,
      scale: 1.1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: 1.5
    });

  }, { scope: container });

  return (
    <main className="hero-main-wrapper" ref={container}>
      {/* Decorative Background Accents */}
      <div className="bg-blob bg-blob-top-left"></div>
      <div className="bg-blob bg-blob-bottom-right"></div>

      <section className="hero-grid-section">
        {/* Special decorative element only visible on mobile for depth */}
        <div className="hero-mobile-bg"></div>

        {/* Left Content: Editorial Typography */}
        <div className="hero-left-col">
          <div 
            className="hero-badge-pill gsap-badge" 
            onClick={() => navigate('/portal')}
            style={{ cursor: 'pointer' }}
            title="Master Admin Přihlášení"
          >
            <svg className="pb-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 400Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z" /></svg>
            <span className="pb-text">Jazyková škola Pardubice</span>
          </div>

          <h1 className="hero-heading">
            <span className="reveal-mask"><span className="gsap-reveal-text" style={{ display: 'block' }}>Tady Vás&nbsp;</span></span>
            <span className="reveal-mask"><span className="italic-text gsap-reveal-text" style={{ display: 'block' }}>rozmluvíme</span></span>
          </h1>

          <p className="hero-description-new gsap-desc">
            Jazyková škola v centru Pardubic pro děti, dospělé i firmy. Od roku 2012, 700+ spokojených studentů a tým lektorů, kteří Vás znají jménem — ne jako číslo v seznamu.
          </p>

          <div className="hero-button-group">
            <a href="#servis" onClick={(e) => { e.preventDefault(); document.getElementById('servis')?.scrollIntoView({behavior: 'smooth', block: 'start'}); }} className="btn-explore" style={{ textDecoration: 'none' }}>Co nabízíme</a>
            <Link to="/kontakt" className="link-methods" style={{ textDecoration: 'none' }}>
              Napište nám
              <span className="material-symbols-outlined link-icon">arrow_right_alt</span>
            </Link>
          </div>
        </div>

        {/* Right Content: The Signature Pebble Container */}
        <div className="hero-right-col">
          {/* Decorative Blobs */}
          <div className="blob-decorator top-blob"></div>
          <div className="blob-decorator bottom-blob"></div>

          {/* Main Image Container */}
          <div className="pebble-mask overflow-hidden editorial-shadow group">
            <img
              src="/nnjnin.webp"
              alt="Výuka u stolu"
              className="hero-main-photo group-hover-zoom"
              loading="eager"
              fetchpriority="high"
              decoding="sync"
            />
            <div className="pebble-overlay group-hover-visible"></div>
          </div>

          {/* Overlapping Secondary Asset */}
          <div className="overlapping-photo-container editorial-shadow">
            <img
              src="/hero sekce homepage.webp"
              alt="Výuka"
              className="overlap-img"
              loading="eager"
              fetchpriority="high"
              decoding="sync"
            />
          </div>

          {/* Floating Accents */}
          <Link to="/letni-program" className="floating-accent-card shadow-xl hidden-md-down" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div className="accent-card-content">
              <div className="accent-icon-box">
                <span className="material-symbols-outlined symbol-filled">menu_book</span>
              </div>
              <div className="accent-text-box">
                <p className="accent-label">Letní Program</p>
                <p className="accent-date">{nearestDate}</p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Hero;
