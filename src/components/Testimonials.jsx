import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { supabase } from '../supabaseClient';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = ({ 
  title = "Co říkají naši klienti", 
  subtitle = null,
  showOrganicBg = true,
  prefixTitle = null,
  invertColors = false,
  customReviews = null,
  disableAnimations = false,
  tableName = "homepage_testimonials"
}) => {
  const container = useRef(null);
  const scrollRef = useRef(null);

  useGSAP(() => {
    if (disableAnimations) return;
    let mm = gsap.matchMedia();

    mm.add("(max-width: 768px)", () => {
      // Mobil: aktivace celé sekce najednou, jakmile sekce přijede do viewportu
      const allEls = gsap.utils.toArray('.testimonials-title, .testimonials-subtitle, .section-num, .section-title, .section-line, .testimonial-card-item, .testimonials-nav-container');
      
      gsap.fromTo(allEls,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.05, ease: 'back.out(1)',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    mm.add("(min-width: 769px)", () => {
      // 1. Oživení hlavičky "Co říkají naši klienti"
      const headers = gsap.utils.toArray('.testimonials-title, .testimonials-subtitle, .section-num, .section-title, .section-line');
      headers.forEach((el, index) => {
        gsap.fromTo(el, 
          { y: 50, opacity: 0 }, 
          { 
            y: 0, opacity: 1, duration: 1.2, delay: index * 0.1, ease: 'back.out(1)', 
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              end: 'bottom 5%',
              once: true
            }
          }
        );
      });

      // 2. Jemný horizontální nástup samotných referenčních karet
      const cards = gsap.utils.toArray('.testimonial-card-item');
      cards.forEach((el, index) => {
        // Staggering karet, které jsou vidět jako první
        const delay = (index % 3) * 0.15;
        gsap.fromTo(el, 
          { x: 50, opacity: 0, scale: 0.95 },
          { 
            x: 0, opacity: 1, scale: 1, duration: 1.2, delay: delay, ease: 'back.out(1.2)', 
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              end: 'bottom 5%',
              once: true
            }
          }
        );
      });

      // 3. Probuzení navigačních šipek
      gsap.fromTo('.testimonials-nav-container',
        { y: 30, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1, delay: 0.4, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.testimonials-nav-container',
            start: 'top 95%',
            end: 'bottom 5%',
            once: true
          }
        }
      );
    });
  }, { scope: container });

  const slide = (direction) => {
    if (scrollRef.current) {
      // Šíře odskoku přizpůsobena velikosti karet
      const scrollAmount = window.innerWidth > 1024 ? 440 : 340;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const [dbReviews, setDbReviews] = useState([
    {
      author: "Kristina Kapucino",
      role: "Game night",
      text: "Večer plný her byl skvělý, hodně jsme se nasmáli. Stihli jsme 2 hry a moc jsme si to užili. Byla jsem s dcerou a neteri a vsemu rozumely. Moc se mi líbila hra Imposter, kterou jsem neznala, ale užili jsme si to moc.",
    },
    {
      author: "Jakub",
      role: "Mise naděje",
      text: "Sunrise Language Agency je jazyková škola na vysoké úrovni naučí vás mluvit plynule Jsem rád, že jejich prakticky zaměřené kurzy prinasejí dovednosti, které se dají okamžitě použít v každodenním Zivoté, při cestování i v práci. Učite se mluvit, lektorka Martina Přibylová je v tomto oboru velice zkušená naucí vás rozvijet věty, mluvit plynule, a taky se nestydět udělat chybu, z mých osobní zkušeností doporučuji všem kdo se chtěj začít učit anglicky na vysoké úrovni",
    },
    {
      author: "Martina Podstavcová",
      role: "English club",
      text: "Holky se k vám vždy strašně moc těší, díky moc za vaši péči, skvělý přístup a parádní program pro dětičky",
    },
    {
      author: "Eva Em Urbanová",
      role: "Letní program",
      text: "Velmi doporučuji Vaši školu. Dcera chodila do letního příměstského tábora. Výborná organizace, program a i dárek nakonec. Příští rok se budeme rádi opět účastnit.",
    },
    {
      author: "Kristina Kapucino",
      role: "Christmas presentation",
      text: "Moc se mi to líbilo. Marek je charismatický vypravěč a hodně jsme se zasmáli. Všemu bylo krásně rozumět. Rozuměla i moje Illetá dcera i moje 14letá neteř. Líbilo se mi, že Marek zapojil i obecenstvo a že jsme na závěr vyprávění kreslili, co jsme siz přednášky odnesli za zajímavé informace. Líbilo se mi ještě víc, že to pak Marek C komentoval. A u toho jsme se taky hodně zasmáli. Určitě se znovu zúčastníme. Doporučuji všem!",
    },
    {
      author: "Zuzana Bihary",
      role: "English club",
      text: "Po první hodině English Clubu jsme nadšení! Naše tříleťačka si celé dopoledne moc užila a hned po návratu domů byl poznat její zájem o angličtinu - ptala se, jak se řeknou anglicky různé barvičky. Prostě skvělý přístup a skvělý koncept English Clubu pro malé děti Vřele doporučuji.",
    },
    {
      author: "Mirka Maierová",
      role: "English club",
      text: "Oceňuji profesionální osobní přístup Sunrise Language Agency je skvěle vedená jazykovka, která děti opravdu rozmluví hravou formou.",
    }
  ]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase.from(tableName).select('*').order('order_index', { ascending: true });
        if (data && data.length > 0) {
          setDbReviews(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTestimonials();
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const reviewsToRender = customReviews !== null ? customReviews : dbReviews;

  const sectionClassName = `testimonials-section ${prefixTitle ? "tp-section" : ""} ${invertColors ? "inverted-colors" : ""}`;

  return (
    <section className={sectionClassName.trim()} ref={container} id={prefixTitle ? "recenze" : undefined} style={prefixTitle ? {paddingTop: '80px', paddingBottom: '80px'} : {}}>
      {/* Organický Pebble / Blob tvar na pozadí, identický jako vrstva Služeb, avšak přelomený na druhou osu */}
      {showOrganicBg && <div className="testimonials-organic-bg"></div>}

      <div className={prefixTitle ? "tp-container" : "testimonials-header-container"}>
        {prefixTitle ? (
           <div className="section-header">
             <span className="section-num">{prefixTitle}</span>
             <h2 className="section-title">{title}</h2>
             <span className="section-line"></span>
           </div>
        ) : (
          <>
            <h2 className="testimonials-title">{title}</h2>
            {subtitle && <p className="testimonials-subtitle">{subtitle}</p>}
          </>
        )}

        <div className="testimonials-carousel-wrapper" ref={scrollRef}>
          {reviewsToRender && reviewsToRender.length > 0 ? (
            reviewsToRender.map((review, index) => (
              <div key={index} className={`testimonial-card-item ${invertColors ? "inverted" : ""}`}>
                {/* Uvozovky jsou nyní součástí hrubého textu vlevo nahoře tak jako na předloze */}
                <p className="testimonial-text">"{review.text}"</p>
                
                <div className="testimonial-author-block">
                  {/* Profilová fotka zastoupena iniciálami (dle předlohy malé kolečko dole) */}
                  <div className="testimonial-avatar">{review.initials || getInitials(review.author)}</div>
                  <div className="testimonial-info">
                    <span className="testimonial-author-name">{review.author}</span>
                    <span className="testimonial-author-role">{review.role}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{width: '100%', textAlign: 'center', padding: '3rem', color: '#888'}}>Zatím žádné recenze.</div>
          )}
        </div>
      </div>

      {/* Navigace levá a pravá pod karouselem podle vzoru */}
      <div className="testimonials-nav-container">
        <div className="nav-buttons-group">
          <button onClick={() => slide('left')} className="testimonial-nav-btn" aria-label="Zpět">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={() => slide('right')} className="testimonial-nav-btn" aria-label="Další">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
