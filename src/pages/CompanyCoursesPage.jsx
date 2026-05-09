import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Testimonials from '../components/Testimonials';
import Sponsors from '../components/Sponsors';
import './CompanyCoursesPage.css';

gsap.registerPlugin(ScrollTrigger);

const CompanyCoursesPage = () => {
  const [expandedCat, setExpandedCat] = useState(null);
  const container = useRef(null);

  useGSAP(() => {
    // 0. Okamžité skrytí elementů, aby nedošlo k probliknutí (FOUC prevence)
    gsap.set(['.corp-badge', '.corp-title', '.corp-subtitle', '.corp-hero-actions', '.corp-hero-image-wrapper'], { opacity: 0, y: 40 });
    gsap.set('.corp-step', { opacity: 0 });
    gsap.set('.corp-step-connector', { opacity: 0 });
    gsap.set('.corp-premium-card', { opacity: 0 });

    // 1. Luxusní animace hlavičky (Hero sekce) zkopírovaná z ostatních stránek
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.timeScale(0.65); // Globální zpomalení pro profesionální plynulý pocit

    tl.fromTo('.corp-badge',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.1 }
    )
      .fromTo('.corp-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=0.7"
      )
      .fromTo('.corp-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=0.9"
      )
      .fromTo('.corp-hero-actions',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=1.0"
      )
      .fromTo('.corp-hero-image-wrapper',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=1.0"
      );

    // 3. Vlnová animace pro sekci "Co Váš tým naučíme"
    const catSection = document.querySelector('.corp-bg-mint');
    if (catSection) {
      const waveElements = catSection.querySelectorAll('.corp-section-header, .corp-list-row');
      gsap.set(waveElements, { opacity: 0, y: 80 }); // Zvýšený offset pro viditelnější nástup

      gsap.to(waveElements, {
        scrollTrigger: {
          trigger: catSection,
          start: 'top 55%' // Spustí se až když je horní hrana sekce téměř v půlce obrazovky
        },
        opacity: 1,
        y: 0,
        duration: 1.6, // Zpomalená animace
        stagger: 0.15, // Výraznější rozestupy mezi vlnami
        ease: 'power4.out',
        overwrite: true
      });
    }

    // Příprava prvků pro sekci formátů
    const formatSection = document.querySelector('.corp-formats-section');
    if (formatSection) {
      gsap.set(formatSection.querySelector('.corp-section-header'), { opacity: 0, y: 30 });
    }

    // 2. a 4. a 5. Teleskopické vysouvání
    let mm = gsap.matchMedia();
    const steps = gsap.utils.toArray('.corp-step');
    const connectors = gsap.utils.toArray('.corp-step-connector');
    const formatCards = gsap.utils.toArray('.corp-premium-card');

    // Prvky sekce 6 (Měření výsledků)
    const resultCards = gsap.utils.toArray('.corp-result-card');
    const resultTitle = document.querySelector('.corp-results-title');
    gsap.set('.corp-result-card', { opacity: 0 });
    if (resultTitle) gsap.set(resultTitle, { opacity: 0, y: 30 });

    // Prvky sekce 7 (Reference)
    gsap.set('.corp-testimonials-wrapper', { opacity: 0, y: 100, scale: 0.98 });

    mm.add("(min-width: 769px)", () => {
      // DESKTOP: Jak to funguje
      const stepsTl = gsap.timeline({
        scrollTrigger: { trigger: '.corp-steps', start: 'top 75%' }
      });

      stepsTl.fromTo(steps[0],
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }
      );
      if (connectors[0]) {
        stepsTl.fromTo(connectors[0], { opacity: 0, scaleX: 0, transformOrigin: 'left center' }, { opacity: 1, scaleX: 1, duration: 0.4 }, "-=0.2");
      }
      stepsTl.fromTo(steps[1],
        { opacity: 0, x: -150 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        "-=0.2"
      );
      if (connectors[1]) {
        stepsTl.fromTo(connectors[1], { opacity: 0, scaleX: 0, transformOrigin: 'left center' }, { opacity: 1, scaleX: 1, duration: 0.4 }, "-=0.2");
      }
      stepsTl.fromTo(steps[2],
        { opacity: 0, x: -150 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        "-=0.2"
      );

      // DESKTOP: Přizpůsobíme se Vám (Formáty)
      if (formatSection && formatCards.length >= 3) {
        const formatsTl = gsap.timeline({
          scrollTrigger: { trigger: '.corp-premium-formats-grid', start: 'top 75%' }
        });

        formatsTl.fromTo(formatSection.querySelector('.corp-section-header'),
          { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
        )
          .fromTo(formatCards[0],
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
            "-=0.4"
          )
          .fromTo(formatCards[1],
            { opacity: 0, x: -150 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
            "-=0.2"
          )
          .fromTo(formatCards[2],
            { opacity: 0, x: -150 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
            "-=0.2"
          );
      }

      // DESKTOP: Měření výsledků
      if (resultCards.length >= 4) {
        const resultsTl = gsap.timeline({
          scrollTrigger: { trigger: '.corp-results-grid', start: 'top 75%' }
        });

        if (resultTitle) {
          resultsTl.fromTo(resultTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" });
        }

        resultsTl.fromTo(resultCards[0], { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, resultTitle ? "-=0.4" : "0")
          .fromTo(resultCards[1], { opacity: 0, x: -150 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, "-=0.2")
          .fromTo(resultCards[2], { opacity: 0, x: -150 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, "-=0.2")
          .fromTo(resultCards[3], { opacity: 0, x: -150 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, "-=0.2");
      }
    });

    mm.add("(max-width: 768px)", () => {
      // MOBILE: Jak to funguje
      const stepsTl = gsap.timeline({
        scrollTrigger: { trigger: '.corp-steps', start: 'top 80%' }
      });

      stepsTl.fromTo(steps[0],
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.2)" }
      );
      if (connectors[0]) {
        stepsTl.fromTo(connectors[0], { opacity: 0, scaleY: 0, transformOrigin: 'top center' }, { opacity: 1, scaleY: 1, duration: 0.4 }, "-=0.2");
      }
      stepsTl.fromTo(steps[1],
        { opacity: 0, y: -100 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.2"
      );
      if (connectors[1]) {
        stepsTl.fromTo(connectors[1], { opacity: 0, scaleY: 0, transformOrigin: 'top center' }, { opacity: 1, scaleY: 1, duration: 0.4 }, "-=0.2");
      }
      stepsTl.fromTo(steps[2],
        { opacity: 0, y: -100 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.2"
      );

      // MOBILE: Přizpůsobíme se Vám (Formáty)
      if (formatSection && formatCards.length >= 3) {
        const formatsTl = gsap.timeline({
          scrollTrigger: { trigger: '.corp-premium-formats-grid', start: 'top 80%' }
        });

        formatsTl.fromTo(formatSection.querySelector('.corp-section-header'),
          { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power4.out" }
        )
          .fromTo(formatCards[0],
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.2)" },
            "-=0.3"
          )
          .fromTo(formatCards[1],
            { opacity: 0, y: -100 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
            "-=0.2"
          )
          .fromTo(formatCards[2],
            { opacity: 0, y: -100 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
            "-=0.2"
          );
      }

      // MOBILE: Měření výsledků
      if (resultCards.length >= 4) {
        const resultsTl = gsap.timeline({
          scrollTrigger: { trigger: '.corp-results-grid', start: 'top 80%' }
        });

        if (resultTitle) {
          resultsTl.fromTo(resultTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power4.out" });
        }

        resultsTl.fromTo(resultCards[0], { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.2)" }, resultTitle ? "-=0.3" : "0")
          .fromTo(resultCards[1], { opacity: 0, y: -100 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
          .fromTo(resultCards[2], { opacity: 0, y: -100 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
          .fromTo(resultCards[3], { opacity: 0, y: -100 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.2");
      }
    });

    // 6. Luxusní odhalení sekce Reference
    ScrollTrigger.create({
      trigger: '.corp-testimonials-wrapper',
      start: 'top 55%', // Aktivuje se až když je horní část viditelněji v obrazovce
      onEnter: () => {
        gsap.to('.corp-testimonials-wrapper', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 2.0, // Zpomalená a rozvážnější animace
          ease: "power4.out",
          overwrite: true
        });
      }
    });

    return () => mm.revert(); // Ochrana proti paměťovým únikům u matchMedia
  }, { scope: container });

  const categories = [
    {
      id: 'cat1',
      title: 'Obchodní komunikace',
      desc: 'Jak mluvit se zákazníky, partnery a kolegy — sebevědomě a přirozeně.',
      list: ['small talk', 'představení firmy', 'telefonáty', 'jednání s klienty', 'vyjednávání', 'cross-cultural komunikace']
    },
    {
      id: 'cat2',
      title: 'Písemná komunikace',
      desc: 'Profesionální psaní v angličtině — rychle, jasně a bez překladače.',
      list: ['obchodní emaily', 'formální zprávy', 'nabídky', 'LinkedIn komunikace', 'šablony a vzory']
    },
    {
      id: 'cat3',
      title: 'Prezentace a vystupování',
      desc: 'Jak prezentovat produkty a výsledky před zahraničními partnery.',
      list: ['struktura prezentace', 'výslovnost a jistota', 'popis výrobku', 'reakce na otázky', 'online prezentace']
    },
    {
      id: 'cat4',
      title: 'Slovní zásoba a gramatika',
      desc: 'Pevný základ bez mezer — odborná slovní zásoba pro Váš konkrétní obor.',
      list: ['oborová terminologie', 'nejčastější chyby', 'přirozené fráze', 'výslovnost', 'testování']
    },
    {
      id: 'cat5',
      title: 'Porozumění a reakce',
      desc: 'Rozumět rychle mluvenému jazyku a umět reagovat bez váhání.',
      list: ['poslech rodilých mluvčích', 'rychlá reakce', 'práce se zahraničními materiály', 'různé přízvuky']
    },
    {
      id: 'cat6',
      title: 'Interaktivní výuka',
      desc: 'Výuka, která baví — zaměstnanci se víc naučí, když se při lekci pobaví.',
      list: ['jazykové hry a pexeso', 'Kahoot, Quizlet a Wordwall', 'simulace pracovních situací', 'poslech a doplňování textů písní']
    }
  ];

  const toggleCat = (id) => {
    if (expandedCat === id) {
      setExpandedCat(null);
    } else {
      setExpandedCat(id);

      // Auto-scroll k otevřené položce s ohledem na navbar
      setTimeout(() => {
        const el = document.getElementById(`corp-cat-${id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150); // Mírné zpoždění pro plynulou animaci rozbalení
    }
  };

  return (
    <main className="corp-page" ref={container}>
      <div className="corp-hero-steps-wrapper">
        {/* SEKCE 1 — HERO */}
        <section className="corp-hero" style={{ paddingTop: '100px' }}>
          <div className="corp-organic-bg"></div>
          <div className="corp-hero-content">
            <div className="corp-hero-text">
              <div className="corp-badge">
                <Link to="/portal" style={{ color: 'inherit', textDecoration: 'none' }}>Pro firmy a týmy</Link>
              </div>
              <h1 className="corp-title">
                Jazyková bariéra Vás stojí zakázky.<br />
                Vyřešme to spolu.
              </h1>
              <p className="corp-subtitle" style={{ margin: '0 auto 2.5rem', maxWidth: '650px', color: '#666' }}>
                Firemní jazykové kurzy sestavené na míru pro Váš tým — ne podle šablony, ale podle toho, co Vaši lidé skutečně potřebují.
              </p>
              <div className="corp-hero-actions">
                <a href="#jak-to-funguje" className="btn btn-primary corp-primary-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span>Zjistit více</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>arrow_downward</span>
                </a>
              </div>
            </div>
            <div className="corp-hero-image-wrapper">
              <div className="corp-hero-shadow"></div>
              <img src="/firemni kurzy sunrise.webp" alt="Firemní výuka" fetchpriority="high" loading="eager" />
            </div>
          </div>
        </section>

        {/* SEKCE 3 — JAK TO FUNGUJE (3 kroky) */}
        <section id="jak-to-funguje" className="corp-section">
          <div className="corp-container">
            <div className="corp-section-header">
              <h2>Jak spolupráce vypadá</h2>
            </div>
            <div className="corp-steps">
              <div className="corp-step">
                <div className="corp-step-num">01</div>
                <h3 className="corp-step-title">Vstupní konzultace zdarma</h3>
                <p className="corp-step-text">
                  Ozveme se do 48 hodin. Zavoláme si nebo se potkáme online — zjistíme, co Váš tým potřebuje, na jaké úrovni jsou zaměstnanci a kam chcete dojít. Bez závazku, bez papírování.
                </p>
              </div>
              <div className="corp-step-connector"></div>
              <div className="corp-step">
                <div className="corp-step-num">02</div>
                <h3 className="corp-step-title">Kurz sestavený na míru</h3>
                <p className="corp-step-text">
                  Žádná šablona. Na základě vstupního testu sestavíme kurz přesně pro Váš tým — obsah, tempo i termíny. Lektor přijede za Vámi nebo se potkáte online.
                </p>
              </div>
              <div className="corp-step-connector"></div>
              <div className="corp-step">
                <div className="corp-step-num">03</div>
                <h3 className="corp-step-title">Výsledky, které vidíte</h3>
                <p className="corp-step-text">
                  Na konci kurzu každý zaměstnanec absolvuje výstupní test. Přesně uvidíte, o kolik se každý posunul — a certifikát dostane každý účastník.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div style={{ marginTop: '4rem', marginBottom: '0' }}>
        <Sponsors />
      </div>

      {/* SEKCE 4 — 6 KATEGORIÍ VÝUKY */}
      <section className="corp-section corp-bg-mint">
        <div className="corp-container">
          <div className="corp-section-header">
            <h2>Co Váš tým naučíme</h2>
          </div>
          <div className="corp-list-container">
            {categories.map((cat, index) => {
              const isExpanded = expandedCat === cat.id;
              return (
                <div
                  id={`corp-cat-${cat.id}`}
                  key={cat.id}
                  className={`corp-list-row ${isExpanded ? 'is-expanded' : ''}`}
                  onClick={() => toggleCat(cat.id)}
                >
                  <div className="corp-list-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="corp-list-content">
                    <h3 className="corp-list-title">{cat.title}</h3>
                    <div className="corp-list-desc-wrapper">
                      <p className="corp-list-desc">{cat.desc}</p>
                      <div className="corp-list-details">
                        <ul className="corp-cat-list">
                          {cat.list.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="corp-list-action">
                    <span className="action-text-default">Zobrazit více</span>
                    <span className="action-text-hover">{isExpanded ? 'Sbalit' : 'Zobrazit detaily'}</span>
                    <span className="material-symbols-outlined action-icon">
                      {isExpanded ? 'remove' : 'arrow_outward'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEKCE 5 — FORMÁTY VÝUKY */}
      <section className="corp-section corp-bg-light corp-formats-section">
        <div className="corp-container">
          <div className="corp-section-header">
            <h2>Přizpůsobíme se Vám</h2>
          </div>
          <div className="corp-premium-formats-grid">
            {/* KARTA 1 */}
            <div className="corp-premium-card">
              <div className="corp-premium-card-top">
                <span className="corp-premium-number">01</span>
              </div>
              <h3 className="corp-premium-title">Ve Vaší firmě</h3>
              <p className="corp-premium-text">Lektor přijede přímo k Vám. Výuka probíhá bez přerušení pracovního rytmu Vašeho týmu.</p>
            </div>

            {/* KARTA 2 */}
            <div className="corp-premium-card">
              <div className="corp-premium-card-top">
                <span className="corp-premium-number">02</span>
              </div>
              <h3 className="corp-premium-title">V našich učebnách</h3>
              <p className="corp-premium-text">Změna prostředí pomáhá soustředění. Prostory přímo v centru Pardubic.</p>
            </div>

            {/* KARTA 3 */}
            <div className="corp-premium-card">
              <div className="corp-premium-card-top">
                <span className="corp-premium-number">03</span>
              </div>
              <h3 className="corp-premium-title">Online</h3>
              <p className="corp-premium-text">Zoom nebo Teams. Ideální pro rozptýlené týmy a home office.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEKCE 6 — MĚŘENÍ VÝSLEDKŮ */}
      <section className="corp-section corp-bg-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="corp-dark-organic-bg"></div>
        <div className="corp-container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="corp-results-title">
            Nezjistíte jen, jestli se zlepšili.<br />
            Zjistíte přesně, o kolik.
          </h2>
          <div className="corp-results-grid">
            <div className="corp-result-card">
              <div className="corp-result-card-top">
                <span className="corp-result-number">01</span>
              </div>
              <h3 className="corp-result-title">Vstupní test zdarma</h3>
              <p className="corp-result-text">Výsledky do 48 hodin.</p>
            </div>

            <div className="corp-result-card">
              <div className="corp-result-card-top">
                <span className="corp-result-number">02</span>
              </div>
              <h3 className="corp-result-title">Cílová úroveň</h3>
              <p className="corp-result-text">Domluvíme se, kam se chcete dostat a za jak dlouho.</p>
            </div>

            <div className="corp-result-card">
              <div className="corp-result-card-top">
                <span className="corp-result-number">03</span>
              </div>
              <h3 className="corp-result-title">Průběžné hodnocení</h3>
              <p className="corp-result-text">Po každém modulu vidíte reálný posun týmu.</p>
            </div>

            <div className="corp-result-card">
              <div className="corp-result-card-top">
                <span className="corp-result-number">04</span>
              </div>
              <h3 className="corp-result-title">Výstupní certifikát</h3>
              <p className="corp-result-text">Potvrzení výsledku a nové úrovně pro každého zaměstnance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEKCE 7 — REFERENCE FIREM */}
      <div className="corp-testimonials-wrapper">
        <Testimonials
          title="Co o nás říkají firmy?"
          showOrganicBg={true}
          disableAnimations={true}
          tableName="company_testimonials"
        />
      </div>

      {/* SEKCE 8 — FINÁLNÍ CTA */}
      <section className="corp-section corp-cta-section">
        <div className="corp-container">
          <div className="corp-cta-inner">
            <div className="corp-cta-left">
              <h2 className="corp-cta-title">Není Vám něco jasné?</h2>
              <p className="corp-cta-text">
                Napište nám. Můžeme si domluvit schůzku a probrat, co by bylo pro Vaši firmu to nejlepší.
              </p>
            </div>
            <div className="corp-cta-right">
              <div className="corp-cta-simple-text">
                <span>Odpovídáme do 48 hodin</span>
              </div>
              <Link to="/kontakt#formular" className="btn btn-primary corp-cta-btn">Mám dotaz →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CompanyCoursesPage;
