import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../supabaseClient';

gsap.registerPlugin(ScrollTrigger);
import './TutorProfile.css';
import Testimonials from '../components/Testimonials';
import CustomModal from '../components/CustomModal';
import CalendarPicker from '../components/CalendarPicker';

const TutorProfilePage = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhilosophyId, setActivePhilosophyId] = useState(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactConsent, setContactConsent] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactErrors, setContactErrors] = useState({});

  const [reviewName, setReviewName] = useState('');
  const [reviewSummary, setReviewSummary] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewErrors, setReviewErrors] = useState({});
  const [modal, setModal] = useState({ isOpen: false });
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const container = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('tutors')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setProfileData(data);
      if (data.philosophy_sections && data.philosophy_sections.length > 0) {
        setActivePhilosophyId(data.philosophy_sections[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('tpScrollY', window.scrollY.toString());
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (loading || !profileData) return;

    const savedScroll = sessionStorage.getItem('tpScrollY');
    if (savedScroll) {
      // Dáme malý timeout, aby se DOM stihl plně vyrenderovat
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
      }, 50);
      sessionStorage.removeItem('tpScrollY');
    }
  }, [loading, profileData]);

  // Luxusní GSAP animace spojená se scrollováním
  useGSAP(() => {
    if (loading || !profileData) return;

    // Okamžité skrytí všech elementů proti problikávání
    gsap.set('.tp-profile-card', { opacity: 0, y: 50 });
    gsap.set('.tp-section', { opacity: 0, y: 80 });

    // Animace horní profilové karty po načtení
    gsap.to('.tp-profile-card', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.1
    });

    // Plynulá ScrollTrigger animace všech podsekcí při scrollování dolů
    ScrollTrigger.batch('.tp-section', {
      start: 'top 70%', // Aktivuje se později, až když je sekce výš na obrazovce
      once: true,
      onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1.8, // Zpomaleno
        stagger: 0.2,
        ease: 'power3.out',
        overwrite: true
      })
    });

    ScrollTrigger.refresh();
  }, { scope: container, dependencies: [loading, profileData] });

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', color: '#666', fontSize: '1.2rem' }}>Načítám osobní profil lektora...</div>;
  }

  if (!profileData || profileData.name === 'Skrytý lektor') {
    return <div style={{ minHeight: '100vh', display: 'flex', flexCol: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', color: '#888', fontSize: '1.2rem' }}>
      Profil tohoto lektora není aktuálně veřejně k dispozici.
    </div>;
  }

  const scrollToId = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  const handleSlotClick = (e, day, from, to) => {
    e.preventDefault();

    if (!selectedService) {
      setModal({ isOpen: true, title: 'Vyberte si službu', message: 'Pro rezervaci konkrétního termínu si prosím nejdříve vyberte jednu z nabízených služeb (výše nad kalendářem).', type: 'warning' });
      return;
    }

    let prefill = '';
    const isPackage = parseInt(selectedService.lessons_count || '1', 10) > 1;

    if (isPackage) {
      prefill = `Dobrý den,\nobjednávám si výhodný balíček ${selectedService.lessons_count} lekcí ("${selectedService.title}") v ceně ${selectedService.price}.\n\nNíže uvádím mnou vybraný termín pro naši PRVNÍ lekci:\n🕒 ${day} od ${from} do ${to}\n\nBeru na vědomí, že na zbylých termínech se společně domluvíme v rámci naší první hodiny a že pro závazné potvrzení této první lekce je nutné vyčkat na e-mail s platebními údaji a provést platbu. Děkuji a těším se na spolupráci.`;
    } else {
      prefill = `Dobrý den,\nměl(a) bych zájem o nabízenou službu "${selectedService.title}" v ceně ${selectedService.price}.\n\nJako termín jsem si vybral(a):\n🕒 ${day} od ${from} do ${to}\n\nBeru na vědomí, že pro závazné potvrzení termínu je nutné vyčkat na e-mail s platebními údaji a provést platbu. Děkuji a těším se na odpověď.`;
    }

    setContactMessage(prefill);
    setSelectedTimeSlot(`${from} - ${to}`);
    scrollToId(e, 'kontakt');
  };

  const handleServiceClick = (e, svc) => {
    e.preventDefault();
    if (svc.price.toLowerCase().includes('zdarma')) {
      setSelectedService(null);
      const minuty = svc.minutes ? svc.minutes : '30';
      setContactMessage(`Dobrý den,\nměl(a) bych zájem o úvodní ${minuty}minutovou lekci a případné následné lekce. Rád(a) bych se s Vámi domluvil(a) na termínu a dalším postupu.\n\nDěkuji a těším se na odpověď.`);
      scrollToId(e, 'kontakt');
    } else {
      setSelectedService(svc);
      scrollToId(e, 'terminy');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!contactName.trim()) errors.contactName = 'Prosím vyplňte své jméno.';
    if (!contactEmail.trim()) {
      errors.contactEmail = 'Prosím vyplňte svůj e-mail.';
    } else if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      errors.contactEmail = 'Prosím zadejte platný e-mail.';
    }
    if (!contactMessage.trim()) errors.contactMessage = 'Prosím napište nám zprávu.';
    if (!contactConsent) errors.contactConsent = 'Je nutné souhlasit s podmínkami.';

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }
    setContactErrors({});
    setIsSubmittingContact(true);
    // Standardní zápis do nové supabse tabulky contact_leads
    const { error } = await supabase.from('contact_leads').insert([
      { tutor_id: profileData.id, name: contactName, email: contactEmail, phone: contactPhone, message: contactMessage }
    ]);

    if (!error) {
      try {
        const response = await fetch('/api/send-lektor-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lektorId: profileData.id,
            lektorEmail: profileData.email || null,
            lektorName: profileData.name || 'Lektor',
            serviceName: selectedService ? selectedService.title : 'Individuální domluva',
            date: selectedCalendarDate || 'Neurčeno',
            time: selectedTimeSlot || 'Dle textu zprávy',
            customerName: contactName,
            customerEmail: contactEmail,
            customerPhone: contactPhone,
            message: contactMessage
          })
        });

        if (!response.ok) {
          throw new Error('E-mailový server vrátil chybu.');
        }

        setModal({ isOpen: true, title: 'Úspěšně odesláno', message: 'Váš vzkaz byl úspěšně odeslán! Brzy se Vám ozveme.', type: 'success' });
        setContactMessage(''); setContactName(''); setContactEmail(''); setContactPhone('');
      } catch (err) {
        console.error("Failed to send email", err);
        setModal({ isOpen: true, title: 'Úspěšně uloženo, ale...', message: 'Zpráva byla uložena do systému, ale odeslání e-mailového upozornění selhalo. Pravděpodobně je problém se spojením na WEDOS e-mailový server.', type: 'warning' });
        setContactMessage(''); setContactName(''); setContactEmail(''); setContactPhone('');
      }
    } else {
      // Pokud tabulka ještě neexistuje
      setModal({ isOpen: true, title: 'Chyba odeslání', message: `Databáze (tabulka contact_leads) zřejmě ještě není v Supabase připravena.\n\nVáš vzkaz:\n${contactMessage}`, type: 'danger' });
    }
    setIsSubmittingContact(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!reviewName.trim()) errors.reviewName = 'Prosím vyplňte své jméno.';
    if (!reviewSummary.trim()) errors.reviewSummary = 'Prosím zadejte rychlé shrnutí.';
    if (!reviewText.trim()) errors.reviewText = 'Prosím vyplňte text recenze.';

    if (Object.keys(errors).length > 0) {
      setReviewErrors(errors);
      return;
    }
    setReviewErrors({});
    setIsSubmittingReview(true);

    const initials = reviewName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const newReview = { id: Date.now(), author: reviewName, role: reviewSummary, text: reviewText, initials: initials };

    // Novou recenzi dáme na ZAČÁTEK pole, aby byla v karuselu hned vidět jako první
    const updatedReviews = [newReview, ...(profileData.reviews || [])];

    const { data, error } = await supabase
      .from('tutors')
      .update({ reviews: updatedReviews })
      .eq('id', profileData.id)
      .select();

    setIsSubmittingReview(false);
    // Pokud update prošel (není error) a vrátila se nám aktualizovaná data (byla povolená práva RLS)
    if (!error && data && data.length > 0) {
      setProfileData({ ...profileData, reviews: updatedReviews });
      setModal({ isOpen: true, title: 'Hodnocení přidáno', message: 'Děkujeme! Vaše recenze byla úspěšně přidána a je viditelná hned jako první.', type: 'success' });
      setReviewName(''); setReviewSummary(''); setReviewText('');
    } else {
      setModal({ isOpen: true, title: 'Nepodařilo se uložit', message: 'Databáze zamítla uložení. Pravděpodobně nemáte oprávnění (nastavení RLS na Supabase) upravovat profil tohoto lektora bez přihlášení.', type: 'danger' });
    }
  };

  const StarPicker = () => {
    const [selected, setSelected] = useState(0);
    const [hovered, setHovered] = useState(0);
    return (
      <div className="star-picker">
        {[1, 2, 3, 4, 5].map(v => (
          <span key={v}
            className={`star-pick ${(v <= selected || v <= hovered) ? 'active' : ''}`}
            onMouseEnter={() => setHovered(v)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(v)}
          >★</span>
        ))}
      </div>
    );
  };

  const nameParts = profileData.name ? profileData.name.split(' ') : ['Lektor', 'Neznámý'];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <>
      <div className="tpprofile-wrapper-new" ref={container}>

        {/* PROFILE COVER BANNER */}
        <div className="tp-container">
          <div className="tp-cover-banner">
            <Link to="/online" className="back-link cover-back-link">Zpět na přehled</Link>
          </div>
        </div>

        <div className="tp-container">
          {/* PROFILE HEADER CARD (LinkedIn Style) */}
          <div className="tp-profile-card">

            <div className="tp-top-row">
              <div className="tp-avatar-wrapper">
                <img
                  src={profileData.photo_url || 'https://placehold.co/200x200/FAFAFA/9898A8?text=Foto'}
                  alt={profileData.name}
                  className="tp-avatar"
                />
              </div>

              <div className="tp-actions desktop-only">
                <button className="tp-btn primary" onClick={(e) => scrollToId(e, 'kontakt')}>
                  Kontaktovat lektora
                </button>
                <a href="#sluzby" className="tp-btn secondary" onClick={(e) => scrollToId(e, 'sluzby')}>
                  Služby a Ceník
                </a>
                <a href="#pridat-recenzi" className="tp-btn secondary" onClick={(e) => scrollToId(e, 'pridat-recenzi')} style={{ gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>rate_review</span>
                  Napsat recenzi
                </a>
              </div>
            </div>

            <div className="tp-info-area">
              <h1 className="tp-name">{profileData.name || 'Neznámé jméno'}</h1>
              <p className="tp-headline">
                {profileData.location || 'Online výuka'}
                &nbsp;&bull;&nbsp; {profileData.accepting_students !== false
                  ? <span style={{ color: 'var(--tp-green)' }}>Přijímá nové studenty</span>
                  : <span style={{ color: '#e74c3c' }}>Nepřijímá nové studenty</span>
                }
              </p>
              <p className="tp-motto">"{profileData.short_reason || 'Ráda s Vámi najdu tu správnou cestu'}"</p>
            </div>

            {/* INTEGRATED SPECS GRID */}
            <div className="tp-specs-grid">
              <div className="tp-spec-item">
                <span className="tp-spec-label">Pro koho</span>
                <span className="tp-spec-val">{profileData.target_group || 'Dospělí, teenageři'}</span>
              </div>
              <div className="tp-spec-item">
                <span className="tp-spec-label">Úroveň</span>
                <span className="tp-spec-val">{profileData.level || 'Začátečníci, středně pokročilí, pokročilí'}</span>
              </div>
              <div className="tp-spec-item">
                <span className="tp-spec-label">Jazyk</span>
                <span className="tp-spec-val">{profileData.subject || 'Business Angličtina'}</span>
              </div>
              <div className="tp-spec-item tp-spec-full">
                <span className="tp-spec-label">Specializace</span>
                <div className="tp-spec-chips">
                  {(profileData.specializations ? profileData.specializations.split(',') : ["Do práce", "Příprava na zkoušky", "Výslovnost", "Gramatika", "Konverzace", "Obecné lekce"]).map((chip, idx) => (
                    <span key={idx} className="tp-spec-chip">{chip.trim()}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* MOBILE ACTIONS BOTTOM ROW */}
            <div className="tp-actions mobile-only">
              <button className="tp-btn primary" onClick={(e) => scrollToId(e, 'kontakt')}>
                Kontaktovat lektora
              </button>
              <a href="#sluzby" className="tp-btn secondary" onClick={(e) => scrollToId(e, 'sluzby')}>
                Služby a Ceník
              </a>
              <a href="#pridat-recenzi" className="tp-btn secondary" onClick={(e) => scrollToId(e, 'pridat-recenzi')} style={{ gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>rate_review</span>
                Napsat recenzi
              </a>
            </div>

          </div>
        </div>

        {/* O MNĚ / JAK UČÍM EXPERIENCE */}
        <section id="jak-ucim" className="tp-section tp-container">
          <div className="section-header">
            <span className="section-num">01</span>
            <h2 className="section-title">Proč se mnou?</h2>
            <span className="section-line"></span>
          </div>

          <div className="tp-experience-tabs">
            <div className="tp-exp-sidebar">
              {profileData.philosophy_sections && profileData.philosophy_sections.length > 0 ? (
                profileData.philosophy_sections.map(sect => (
                  <button
                    key={sect.id}
                    className={`tp-exp-btn ${activePhilosophyId === sect.id ? 'active' : ''}`}
                    onClick={() => setActivePhilosophyId(sect.id)}
                  >
                    <div className="tp-exp-label">
                      <span className="tp-exp-title" dangerouslySetInnerHTML={{ __html: sect.heading }} />
                      <span className="tp-exp-sub">{sect.categoryName.substring(0, 30)}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div style={{ color: '#888' }}>Zatím nebyly přidány žádné bloky textu.</div>
              )}
            </div>

            <div className="tp-exp-content-wrapper">
              <div key={activePhilosophyId} className="tp-exp-content">
                {profileData.philosophy_sections && profileData.philosophy_sections.length > 0 ? (
                  profileData.philosophy_sections.map(sect => {
                    if (sect.id === activePhilosophyId) {
                      return (
                        <div key={sect.id}>
                          <span className="tp-kicker">• {sect.categoryName.toUpperCase()}</span>
                          <h3 className="tp-exp-content-title" dangerouslySetInnerHTML={{ __html: sect.heading }} />
                          <div className="tp-exp-text">
                            {sect.body.split('\n').map((para, i) => <p key={i}>{para}</p>)}
                          </div>
                        </div>
                      )
                    }
                    return null;
                  })
                ) : (
                  <div>Nahrávám data lektora...</div>
                )}
              </div>

              <div className="tp-exp-footer">
                <span className="tp-exp-footer-note">1. lekce je zdarma a bez závazků</span>
                <button className="tp-btn primary small" onClick={(e) => scrollToId(e, 'sluzby')}>NABÍZENÉ SLUŽBY →</button>
              </div>
            </div>
          </div>
        </section>

        {/* NABÍZENÉ SLUŽBY */}
        <section id="sluzby" className="tp-section tp-container">
          <div className="section-header">
            <span className="section-num">02</span>
            <h2 className="section-title">Nabízené služby</h2>
            <span className="section-line"></span>
          </div>
          <div className="services-grid">
            {profileData.services && profileData.services.length > 0 ? (
              profileData.services.map(svc => (
                <div 
                  key={svc.id} 
                  className={`service-card ${svc.price.toLowerCase().includes('zdarma') ? 'free' : ''}`}
                  onClick={(e) => handleServiceClick(e, svc)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <span className={`service-badge ${svc.price.toLowerCase().includes('zdarma') ? 'badge-free' : 'badge-individual'}`}>
                      {svc.price.toLowerCase().includes('zdarma')
                        ? 'Setkání zdarma'
                        : (parseInt(svc.lessons_count || '1', 10) > 1 ? `Výhodný balíček (${svc.lessons_count} lekcí)` : 'Individuální lekce')
                      }
                    </span>
                    <h3 className="service-title">{svc.title}</h3>
                    <p className="service-desc">{svc.desc}</p>
                  </div>
                  <div className="service-right">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} className="service-right-inner">
                      <style>{`
                        @media(min-width: 768px) {
                          .service-right-inner { align-items: flex-end !important; }
                        }
                      `}</style>
                      <p className="service-price">
                        {svc.price}{!svc.price.toLowerCase().includes('kč') && !svc.price.toLowerCase().includes('zdarma') ? ' Kč' : ''} {svc.minutes ? <span style={{ fontSize: '0.65em', color: '#888', fontWeight: '500' }}>/ {svc.minutes} min.</span> : ''}
                      </p>

                      {parseInt(svc.lessons_count || '1', 10) > 1 && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--tp-mid)', marginTop: '4px', marginBottom: '8px' }}>
                          Celková cena za {svc.lessons_count} lekcí<br />(1 lekce trvá {svc.minutes || '60'} minut)
                        </div>
                      )}

                      <button 
                        className={`service-reserve-btn ${svc.price.toLowerCase().includes('zdarma') ? 'green-btn' : ''}`} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceClick(e, svc);
                        }}
                      >
                        Vybrat termín
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#888' }}>Zatím nebyly přidány žádné služby.</div>
            )}
          </div>

          <div 
            className="service-custom-request-card"
            onClick={(e) => {
              e.preventDefault();
              setContactMessage('Dobrý den, nevybral/a jsem si z aktuální nabídky balíčků, ale měl/a bych zájem o individuální domluvu ohledně formátu a počtu lekcí. Můžeme společně probrat možnosti?');
              scrollToId(e, 'kontakt');
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--tp-dark)', marginBottom: '12px' }}>Nevybrali jste si z nabídky?</h3>
            <p style={{ fontSize: '15px', color: 'var(--tp-mid)', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
              Máte zájem o jiný počet lekcí, specifický formát výuky nebo individuální domluvu? Neváhejte mi napsat, rádi Vám vyjdeme vstříc.
            </p>
            <button
              className="tp-btn secondary"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setContactMessage('Dobrý den, nevybral/a jsem si z aktuální nabídky balíčků, ale měl/a bych zájem o individuální domluvu ohledně formátu a počtu lekcí. Můžeme společně probrat možnosti?');
                scrollToId(e, 'kontakt');
              }}
              style={{ background: 'white', color: 'var(--tp-dark)', padding: '12px 28px', fontSize: '14px', margin: '0 auto', display: 'inline-block' }}
            >
              Domluvit se individuálně
            </button>
          </div>
        </section>

        {/* VOLNÉ TERMÍNY */}
        <section id="terminy" className="tp-section tp-container">
          <div className="section-header">
            <span className="section-num">03</span>
            <h2 className="section-title">Volné termíny</h2>
            <span className="section-line"></span>
          </div>

          {selectedService ? (
            <div style={{ background: 'var(--tp-green-light)', color: 'var(--tp-green)', padding: '16px 24px', borderRadius: 'var(--tp-radius-md)', marginBottom: '32px', fontWeight: '700', fontSize: '15px', border: '1px solid #b7e4d5', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>✓</span>
              {parseInt(selectedService.lessons_count || '1', 10) > 1 ? (
                <span>Vybrali jste výhodný balíček ({selectedService.lessons_count} lekcí): <strong>{selectedService.title}</strong>.<br /><span style={{ display: 'inline-block', marginTop: '6px', color: '#107a51' }}>Nyní si prosím z kalendáře vyberte datum a čas <strong>POUZE pro naši první lekci</strong>. Na termínech pro zbývající lekce se domluvíme osobně na našem prvním setkání.</span></span>
              ) : (
                <span>Vybrali jste službu: <strong>{selectedService.title}</strong>. Nyní prosím klikněte na termín, který se Vám hodí nejvíce.</span>
              )}
            </div>
          ) : (
            <div style={{ background: '#fff3cd', color: '#856404', padding: '16px 24px', borderRadius: 'var(--tp-radius-md)', marginBottom: '32px', fontWeight: '700', fontSize: '15px', border: '1px solid #ffe69c', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>info</span>
              <span>Pro zobrazení a výběr volných termínů si prosím <strong>nejdříve vyberte jednu z nabízených služeb</strong> výše.</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 400px', maxWidth: '450px' }}>
              <CalendarPicker
                selectedDate={selectedCalendarDate}
                onDateSelect={setSelectedCalendarDate}
                highlightedDates={(profileData.schedule || []).filter(d => d.slots && d.slots.length > 0).map(d => d.day)}
                disablePastDates={true}
                disablePastMonths={true}
                fullWidth={true}
              />
            </div>

            <div style={{ flex: '1 1 350px' }}>
              {selectedCalendarDate ? (() => {
                const selectedScheduleDay = profileData.schedule?.find(s => s.day === selectedCalendarDate);
                const [y, m, d] = selectedCalendarDate.split('-');
                const displayDateStr = `${parseInt(d)}. ${parseInt(m)}. ${y}`;
                return (
                  <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--tp-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                      Termíny pro: <strong style={{ color: 'var(--tp-pink)' }}>{displayDateStr}</strong>
                    </h3>

                    {selectedScheduleDay && selectedScheduleDay.slots && selectedScheduleDay.slots.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[...selectedScheduleDay.slots].sort((a, b) => {
                          const parseTime = (timeStr) => {
                            if (!timeStr) return 0;
                            const parts = timeStr.split(':');
                            return parseInt(parts[0], 10) * 60 + parseInt(parts[1] || '0', 10);
                          };
                          return parseTime(a.from) - parseTime(b.from);
                        }).map((slot, i) => {
                          if (slot.isBooked) {
                            return (
                              <div key={slot.id || i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f5f5f5', borderRadius: '8px', opacity: 0.5, cursor: 'not-allowed' }} title="Tento termín je již obsazen">
                                <span style={{ textDecoration: 'line-through' }}>{slot.from} - {slot.to}</span>
                                <span style={{ color: 'red', fontWeight: 'bold' }}>Obsazeno</span>
                              </div>
                            );
                          }
                          return (
                            <div key={slot.id || i} onClick={(e) => handleSlotClick(e, displayDateStr, slot.from, slot.to)} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--tp-bg-warm)', borderRadius: '8px', cursor: selectedService ? 'pointer' : 'not-allowed', border: '1px solid var(--tp-border-strong)', transition: 'all 0.2s ease', opacity: selectedService ? 1 : 0.6 }} onMouseEnter={e => { if(selectedService){ e.currentTarget.style.background = 'var(--tp-pink)'; e.currentTarget.style.color = 'white'; e.currentTarget.querySelector('.ts-action').style.color = 'white'; } }} onMouseLeave={e => { if(selectedService){ e.currentTarget.style.background = 'var(--tp-bg-warm)'; e.currentTarget.style.color = 'var(--tp-dark)'; e.currentTarget.querySelector('.ts-action').style.color = 'var(--tp-pink)'; } }}>
                              <span style={{ fontWeight: 'bold' }}>{slot.from} - {slot.to}</span>
                              <span className="ts-action" style={{ color: 'var(--tp-pink)', fontWeight: 'bold' }}>Vybrat termín</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>
                        Pro tento den nejsou vypsány žádné volné termíny. Zkuste vybrat jiný den (dny s růžovou/zelenou tečkou).
                      </div>
                    )}
                  </div>
                );
              })() : (
                <div style={{ height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', border: '2px dashed #ddd', borderRadius: '16px', color: '#888', textAlign: 'center' }}>
                  Klikněte na jakékoliv datum v kalendáři pro zobrazení dostupných časů.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* KONTAKT */}
        <section id="kontakt" className="tp-section tp-container">
          <div className="section-header">
            <span className="section-num">04</span>
            <h2 className="section-title">Kontaktovat lektora</h2>
            <span className="section-line"></span>
          </div>
          <div className="contact-wrapper">
            <div className="contact-form-card">
              <form onSubmit={handleContactSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Jméno *</label>
                    <input className={`form-input ${contactErrors.contactName ? 'input-error' : ''}`} type="text" placeholder="Vaše jméno" value={contactName} onChange={e => { setContactName(e.target.value); if (contactErrors.contactName) setContactErrors({ ...contactErrors, contactName: null }); }} />
                    {contactErrors.contactName && <div className="custom-form-error"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>{contactErrors.contactName}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">E-mail *</label>
                    <input className={`form-input ${contactErrors.contactEmail ? 'input-error' : ''}`} type="email" placeholder="vas.email@gmail.com" value={contactEmail} onChange={e => { setContactEmail(e.target.value); if (contactErrors.contactEmail) setContactErrors({ ...contactErrors, contactEmail: null }); }} />
                    {contactErrors.contactEmail && <div className="custom-form-error"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>{contactErrors.contactEmail}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Telefon (Nepovinné)</label>
                    <input className="form-input" type="tel" placeholder="např. 777 888 999" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Zpráva *</label>
                  <textarea
                    className={`form-textarea ${contactErrors.contactMessage ? 'input-error' : ''}`}
                    placeholder="Např. kdy se Vám hodí lekce nebo co se chcete naučit..."
                    value={contactMessage}
                    onChange={(e) => { setContactMessage(e.target.value); if (contactErrors.contactMessage) setContactErrors({ ...contactErrors, contactMessage: null }); }}
                  ></textarea>
                  {contactErrors.contactMessage && <div className="custom-form-error"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>{contactErrors.contactMessage}</div>}
                </div>
                <div className="form-consent">
                  <label className="consent-label" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" checked={contactConsent} onChange={e => { setContactConsent(e.target.checked); if (contactErrors.contactConsent) setContactErrors({ ...contactErrors, contactConsent: null }); }} />
                      <span>Souhlasím s <Link to="/obchodni-podminky" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Obchodními podmínkami</Link> a <Link to="/ochrana-osobnich-udaju" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Zásadami ochrany osobních údajů</Link> *</span>
                    </div>
                    {contactErrors.contactConsent && <div className="custom-form-error"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>{contactErrors.contactConsent}</div>}
                  </label>
                </div>
                <button type="submit" className="form-submit" disabled={isSubmittingContact}>
                  {isSubmittingContact ? 'Odesílám...' : 'Kontaktovat lektora'}
                </button>
                <p className="form-trust-note">Odpověď do 24 hodin • Nezávazně a zdarma</p>
              </form>
            </div>
          </div>
        </section>

      </div>

      {/* RECENZE (Vynětí ven z ochranného tpprofile-wrapperu aby nebyl dotčen padding resetem) */}
      <Testimonials
        title="Recenze"
        subtitle={null}
        prefixTitle="05"
        showOrganicBg={false}
        invertColors={true}
        customReviews={profileData.reviews}
      />

      <div className="tpprofile-wrapper-new" style={{ paddingTop: 0 }}>
        {/* PŘIDAT RECENZI */}
        <section id="pridat-recenzi" className="tp-section tp-container" style={{ paddingBottom: 0, paddingTop: '32px', marginTop: '-20px' }}>
          <div className="section-header">
            <span className="section-num">06</span>
            <h2 className="section-title">Přidat recenzi</h2>
            <span className="section-line"></span>
          </div>
          <div className="contact-wrapper">
            <div className="contact-form-card">
              <form onSubmit={handleReviewSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Jméno a příjmení *</label>
                    <input className={`form-input ${reviewErrors.reviewName ? 'input-error' : ''}`} type="text" placeholder="Např. Pavel Dvořák" value={reviewName} onChange={e => { setReviewName(e.target.value); if (reviewErrors.reviewName) setReviewErrors({ ...reviewErrors, reviewName: null }); }} />
                    {reviewErrors.reviewName && <div className="custom-form-error"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>{reviewErrors.reviewName}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Rychlé shrnutí (Podtext) *</label>
                    <input className={`form-input ${reviewErrors.reviewSummary ? 'input-error' : ''}`} type="text" placeholder="Např. Příprava k maturitě" value={reviewSummary} onChange={e => { setReviewSummary(e.target.value); if (reviewErrors.reviewSummary) setReviewErrors({ ...reviewErrors, reviewSummary: null }); }} />
                    {reviewErrors.reviewSummary && <div className="custom-form-error"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>{reviewErrors.reviewSummary}</div>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Vaše recenze *</label>
                  <textarea className={`form-textarea ${reviewErrors.reviewText ? 'input-error' : ''}`} placeholder="Napište, jak se Vám se mnou spolupracovalo..." value={reviewText} onChange={e => { setReviewText(e.target.value); if (reviewErrors.reviewText) setReviewErrors({ ...reviewErrors, reviewText: null }); }} ></textarea>
                  {reviewErrors.reviewText && <div className="custom-form-error"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>{reviewErrors.reviewText}</div>}
                </div>
                <button type="submit" className="form-submit" disabled={isSubmittingReview}>
                  {isSubmittingReview ? 'Odesílám recenzi...' : 'Odeslat recenzi →'}
                </button>
              </form>
            </div>
          </div>
        </section>

        <div className="page-end"></div>
      </div>

      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </>
  );
};

export default TutorProfilePage;
