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

  const intendedIndex = useRef(0);
  const isManualScroll = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleUserInteraction = () => {
      isManualScroll.current = true;
    };

    el.addEventListener('touchstart', handleUserInteraction, { passive: true });
    el.addEventListener('wheel', handleUserInteraction, { passive: true });
    el.addEventListener('mousedown', handleUserInteraction, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleUserInteraction);
      el.removeEventListener('wheel', handleUserInteraction);
      el.removeEventListener('mousedown', handleUserInteraction);
    };
  }, []);

  const slide = (direction) => {
    if (scrollRef.current) {
      // Šíře odskoku přizpůsobena velikosti karet
      const scrollAmount = window.innerWidth > 1024 ? 440 : 340;
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      const maxIndex = Math.round(maxScroll / scrollAmount);

      if (isManualScroll.current) {
        intendedIndex.current = Math.round(scrollRef.current.scrollLeft / scrollAmount);
        isManualScroll.current = false;
      }

      if (direction === 'left') {
        intendedIndex.current = Math.max(0, intendedIndex.current - 1);
      } else {
        intendedIndex.current = Math.min(maxIndex, intendedIndex.current + 1);
      }

      scrollRef.current.scrollTo({
        left: intendedIndex.current * scrollAmount,
        behavior: 'smooth'
      });
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
      text: "Sunrise Language Agency je jazyková škola na vysoké úrovni naučí Vás mluvit plynule Jsem rád, že jejich prakticky zaměřené kurzy prinasejí dovednosti, které se dají okamžitě použít v každodenním Zivoté, při cestování i v práci. Učite se mluvit, lektorka Martina Přibylová je v tomto oboru velice zkušená naucí Vás rozvijet věty, mluvit plynule, a taky se nestydět udělat chybu, z mých osobní zkušeností doporučuji všem kdo se chtěj začít učit anglicky na vysoké úrovni",
    },
    {
      author: "Martina Podstavcová",
      role: "English club",
      text: "Holky se k Vám vždy strašně moc těší, díky moc za Vaši péči, skvělý přístup a parádní program pro dětičky",
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
        const { data, error } = await supabase.from(tableName)
          .select('*')
          .eq('approved', true) // Zobrazujeme pouze schválené recenze
          .order('order_index', { ascending: true });
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

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({ author: '', role: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // 1. Uložit do Supabase s approved = false
      const payload = {
        author: reviewFormData.author,
        role: reviewFormData.role,
        text: reviewFormData.text,
        order_index: 999,
        // Pokud sloupec approved zatím neexistuje, Supabase by mohl hodit chybu, 
        // ale my to přidáme přes SQL (viz pokyny)
        approved: false 
      };

      const { data, error } = await supabase
        .from(tableName)
        .insert([payload])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(error.message || 'Nepodařilo se uložit recenzi do databáze.');
      }

      // 2. Odeslat schvalovací e-mail adminovi
      const emailRes = await fetch('/api/send-review-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: data[0].id,
          tableName: tableName,
          author: reviewFormData.author,
          role: reviewFormData.role,
          text: reviewFormData.text
        })
      });

      if (!emailRes.ok) {
        console.warn("E-mail pro admina se nepodařilo odeslat, ale recenze je uložena v DB.");
      }

      setSubmitSuccess(true);
      setReviewFormData({ author: '', role: '', text: '' });
      setTimeout(() => setShowReviewForm(false), 5000);
      
    } catch (err) {
      setSubmitError(err.message || 'Něco se pokazilo. Zkuste to prosím znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="testimonials-nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="nav-buttons-group">
          <button onClick={() => slide('left')} className="testimonial-nav-btn" aria-label="Zpět">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={() => slide('right')} className="testimonial-nav-btn" aria-label="Další">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        
        {/* Tlačítko Napsat recenzi na pravé straně (pouze pro tabulky z domovské stránky / firem, customReviews nevyužívají) */}
        {!customReviews && (
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)} 
            style={{
              background: 'transparent',
              border: '1px solid var(--tp-border-strong)',
              padding: '10px 18px',
              borderRadius: 'var(--tp-radius-md)',
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              color: 'var(--tp-dark)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--tp-bg-warm)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Napsat recenzi
          </button>
        )}
      </div>

      {/* Formulář pro přidání recenze */}
      {showReviewForm && !customReviews && (
        <div className={prefixTitle ? "tp-container" : "testimonials-header-container"} style={{ marginTop: '2rem' }}>
          <div style={{
            background: 'var(--tp-white)',
            border: '1px solid var(--tp-border)',
            borderRadius: 'var(--tp-radius-lg)',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--tp-dark)' }}>Podělte se o svou zkušenost</h3>
            
            {submitSuccess ? (
              <div style={{ padding: '1.5rem', background: 'rgba(28, 156, 115, 0.1)', color: 'var(--tp-green)', borderRadius: '12px', textAlign: 'center', fontWeight: 600 }}>
                Děkujeme! Vaše recenze byla odeslána ke schválení.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {submitError && (
                  <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '14px' }}>
                    {submitError}
                  </div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--tp-light)' }}>Vaše jméno</label>
                    <input 
                      type="text" 
                      required 
                      value={reviewFormData.author}
                      onChange={(e) => setReviewFormData({...reviewFormData, author: e.target.value})}
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--tp-border)', outline: 'none', fontFamily: 'inherit' }}
                      placeholder="Jan Novák"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--tp-light)' }}>Kontext (Role/Firma)</label>
                    <input 
                      type="text" 
                      required 
                      value={reviewFormData.role}
                      onChange={(e) => setReviewFormData({...reviewFormData, role: e.target.value})}
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--tp-border)', outline: 'none', fontFamily: 'inherit' }}
                      placeholder={tableName === 'company_testimonials' ? 'Firma XYZ' : 'Student / English Club'}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--tp-light)' }}>Text recenze</label>
                  <textarea 
                    required 
                    rows={4}
                    value={reviewFormData.text}
                    onChange={(e) => setReviewFormData({...reviewFormData, text: e.target.value})}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--tp-border)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                    placeholder="Napište nám, jak jste byli spokojeni..."
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowReviewForm(false)}
                    style={{ padding: '12px 20px', background: 'transparent', border: 'none', color: 'var(--tp-mid)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Zrušit
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ 
                      padding: '12px 24px', 
                      background: 'var(--tp-pink)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontWeight: 700, 
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.7 : 1,
                      boxShadow: '0 4px 14px rgba(239, 103, 165, 0.4)'
                    }}
                  >
                    {isSubmitting ? 'Odesílám...' : 'Odeslat recenzi'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
