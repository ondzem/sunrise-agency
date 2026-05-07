import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const container = useRef(null);

  useGSAP(() => {
    // 2. Extrémně precizní a neprůstřelná deklarace: gsap.fromTo řeší exkluzivně jedinkrát při objevení bez vracení zadními vrátky
    const elements = gsap.utils.toArray('.bento-card, .languages-banner, .services-action-footer');
    elements.forEach((el, index) => {
      // Drobné fázování řádků  
      const delay = (index % 3) * 0.15;
      gsap.fromTo(el,
        { y: 100, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1.2, delay: delay, ease: 'back.out(1)',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%', // Spouští spolehlivě zespodu
            end: 'bottom 5%', // Spouští spolehlivě seshora (vyřazeno nepředvídatelné once)
            once: true
          }
        }
      );
    });



  }, { scope: container });

  return (
    <section className="services-section" id="servis" ref={container}>
      <div className="services-container">

        <div className="services-header">
          <h2 className="services-title">Co nabízíme?</h2>
        </div>

        {/* Large green organic background for depth */}
        <div className="services-organic-bg"></div>

        {/* BENTO GRID (Zcela nový layout namísto nudné mřížky) */}
        <div className="bento-grid">

          {/* Bento Card 1: Nabídka kurzů - COL-SPAN-2 */}
          <Link to="/kurzy" className="bento-card bento-col-2 bento-bg-white" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="bento-card-content">
              <h3 className="bento-title">Nabídka <span className="text-secondary">kurzů</span></h3>
              <p className="bento-desc text-gray">Pro děti i dospělé v malých skupinkách, kde máte prostor skutečně mluvit — ne jen opisovat z tabule.</p>
            </div>
            {/* Ava-sada s vlajkami a číslem */}
            <div className="bento-avatars bento-avatars-small">
              <div className="bento-avatar bento-avatar-flag">
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🇬🇧</span>
              </div>
              <div className="bento-avatar bento-avatar-flag">
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🇫🇷</span>
              </div>
              <div className="bento-avatar-badge bento-avatar-badge-small">+6</div>
            </div>
            <span className="bento-link" style={{ marginTop: '1rem', display: 'inline-block', fontWeight: '600', color: 'var(--color-primary)' }}>Zjistit více &rarr;</span>
          </Link>

          {/* Bento Card 2: Online výuka - COL-SPAN-1 */}
          <Link to="/online" className="bento-card bento-col-1 bento-bg-magenta flex-col-between" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="material-symbols-outlined bento-icon-large">rocket_launch</span>
            <div>
              <h3 className="bento-title text-white">Online výuka</h3>
              <p className="bento-desc-small text-white-70">Bydlíte daleko, nebo vás už nebaví zdlouhavé dojíždění? Máme pro vás řešení.</p>
              <span className="bento-link text-white" style={{ marginTop: '0.5rem', display: 'inline-block', fontWeight: '600', opacity: 0.9 }}>Zjistit více &rarr;</span>
            </div>
          </Link>

          {/* Bento Card 3: English Club - COL-SPAN-1 */}
          <Link to="/english-club" className="bento-card bento-col-1 bento-bg-gray flex-col-between" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="bento-label text-secondary">PRO VŠECHNY</span>
            <div>
              <h3 className="bento-title">English Club</h3>
              <p className="bento-desc-small text-gray-bold">Angličtina hraním, tvořením a smíchem. Vaše dítě ani nepozná, že se učí.</p>
              <span className="bento-link" style={{ marginTop: '0.5rem', display: 'inline-block', fontWeight: '600', color: 'var(--color-primary)' }}>Zjistit více &rarr;</span>
            </div>
          </Link>

          {/* Bento Card 4: Firemní kurzy na míru - COL-SPAN-2 */}
          <Link to="/firemni-kurzy" className="bento-card bento-col-2 bento-bg-green relative-overflow" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="bento-overlay-content">
              <h3 className="bento-title text-white">Firemní kurzy na míru</h3>
              <p className="bento-desc text-white-80 max-left">Potřebujete, aby váš tým uměl lépe anglicky? Rádi vás to naučíme. U vás, u nás nebo online.</p>
              <span className="bento-link text-white" style={{ marginTop: '1rem', display: 'inline-block', fontWeight: '600', opacity: 0.9 }}>Zjistit více &rarr;</span>
            </div>
            {/* Obrázek v pozadí vpravo přes vzor HTML */}
            <div className="bento-image-fade right-side">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyZrpCFiXH-rUjgzXb5DAmewzSloaoAsciazowpYLL7PGDK8RjEPx0gqqCN6xmcTfht7dtS6dIKsAZNliILX8skEIRugCJCY2Vla84H0PhgzXMiR7IYQdNvSAf5uEDPMdjdNe64kJABV4BOSMF7cVbqwZG4QexZFhZiBLR8YgpIA98rFNEoTpjBQnbnuZsu9dfubpku-JTfnVSN0NTHIXoksvh4yLRp71UV2HWe-Xr7kbtg7fBPIcvOWQ1FZ8C7MbCwZ885fK63AI" alt="Pardubice Ofis" />
            </div>
          </Link>

          {/* Bento Card 5: Letní Program - COL-SPAN-2 */}
          <Link to="/letni-program" className="bento-card bento-col-2 bento-bg-light-tint relative-overflow" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="bento-overlay-content">
              <h3 className="bento-title text-dark">Letní program</h3>
              <p className="bento-desc text-gray">Prázdniny plné angličtiny, zábavy a nových přátel. Na léto budou vzpomínat celý rok.</p>
              <span className="bento-link" style={{ marginTop: '1rem', display: 'inline-block', fontWeight: '600', color: 'var(--color-primary)' }}>Zjistit více &rarr;</span>
            </div>
          </Link>

          {/* Bento Card 6: Překlady a tlumočení - COL-SPAN-1 */}
          <div className="bento-card bento-col-1 bento-bg-dark flex-col-between">
            <span className="material-symbols-outlined bento-icon-large text-secondary">translate</span>
            <div>
              <h3 className="bento-title text-white">Překlady a<br />tlumočení</h3>
              <p className="bento-desc-small text-white-70" style={{ marginTop: '0.5rem' }}>Dokumenty i živé tlumočení na jednáních. Rychle, spolehlivě a s pochopením vašeho oboru.</p>
            </div>
          </div>

        </div>

        {/* Languages Banner Remains the Same */}
        <div className="languages-banner">
          <p className="languages-label">Vyučujeme jazyky:</p>
          <div className="languages-flex">
            <span className="lang-pill">Angličtina</span>
            <span className="lang-pill">Němčina</span>
            <span className="lang-pill">Ruština</span>
            <span className="lang-pill">Francouzština</span>
            <span className="lang-pill">Španělština</span>
            <span className="lang-pill">Nizozemština</span>
            <span className="lang-pill accent-lang">Čeština pro cizince</span>
          </div>
        </div>



      </div>

      {/* Decorative blobs */}
      <div className="bg-blob bg-blob-mid-right animate-pulse"></div>
      <div className="bg-blob bg-blob-mid-left"></div>
    </section>
  );
};

export default Services;
