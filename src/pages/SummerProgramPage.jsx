import React, { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SummerProgramPage.css';

gsap.registerPlugin(ScrollTrigger);

const EditableField = ({ value, onChange, isMultiline, style, isAdminMode }) => {
  if (!isAdminMode) {
    if (isMultiline) {
      return <span style={style}>{String(value).split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</span>;
    }
    return style ? <span style={style}>{value}</span> : <>{value}</>;
  }
  if (isMultiline) {
    return <textarea value={value} onChange={e => onChange(e.target.value)} style={{ ...style, width: '100%', border: '1px dashed rgba(255,105,180,0.5)', background: 'rgba(255,255,255,0.9)', padding: '4px', borderRadius: '4px', minHeight: '60px', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', color: '#333' }} />;
  }
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{ ...style, width: '100%', border: '1px dashed rgba(255,105,180,0.5)', background: 'rgba(255,255,255,0.9)', padding: '2px 4px', borderRadius: '4px', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', color: '#333' }} />;
};

const SummerProgramPage = () => {
  const container = useRef(null);
  const childModalRef = useRef(null);
  const adultModalRef = useRef(null);
  const navigate = useNavigate();

  // Admin states
  const [searchParams] = useSearchParams();
  const isAdminUrl = searchParams.get('admin') === 'true';
  const [isAdminMode, setIsAdminMode] = useState(false);

  const defaultKidsConfig = {
    global: {
      modalTitle: "Letní tábor s angličtinou",
      modalSubtitle: "Ideální kombinace zábavy a přirozeného učení jazyka. Děti tráví až 8 hodin denně v anglickém prostředí, díky čemuž si postupně osvojují jazyk bez stresu a zábran – učí se rozumět a především mluvit v běžných situacích.",
      section1Title: "Jak to probíhá",
      section1Text: "Tábor je veden v přátelské a podporující atmosféře, kde děti nejsou do ničeho nuceny. Každé dítě se zapojuje svým tempem a přirozeně se rozmlouvá díky neustálému kontaktu s jazykem – i pouhým poslechem ostatních.",
      section2Title: "Co děti čeká",
      section2Items: [
        { title: 'Celodenní angličtina', desc: 'Program vedený v anglickém jazyce' },
        { title: 'Sport a pohyb', desc: 'Sportovní a pohybové aktivity' },
        { title: 'Kreativita', desc: 'Malování, vyrábění a další tvoření' },
        { title: 'Výlety a hry', desc: 'Společné hry a zábavné výlety' },
        { title: 'Každodenní situace', desc: 'Jídlo, cestování, běžná domluva' }
      ],
      section3Title: "Co je v ceně",
      section3Items: [
        { title: 'Anglická activity book', desc: '50–100 stran plných aktivit na celý týden' },
        { title: 'Zdravé stravování', desc: 'Obědy a svačiny zajištěné kvalitním bistrem' },
        { title: 'Kompletní program', desc: 'Veškeré aktivity, materiály a výlety' }
      ],
      section4Title: "Výsledek tábora",
      section4Text: "Děti si odnášejí nejen nové zážitky, ale také větší jistotu v angličtině, lepší porozumění a praktickou slovní zásobu z běžného života.",
      time: "8:00 – 16:00",
      location: "Jana Palacha 1638, Pardubice",
      groupSize: "Max. 12 dětí",
      includedText: "výuka, 2 svačiny, oběd (Sarrasin), učebnice",
      whatToBring: ["oblečení dovnitř i ven", "psací potřeby", "přezůvky"]
    },
    term1: {
      age: "Pro děti 4–8 let",
      date: "10. – 14. Srpna 2026",
      deadline: "Přihlášky do 31. května 2026",
      price: "5 800 Kč",
      siblingPrice: "4 800 Kč"
    },
    term2: {
      age: "Pro děti 8–14 let",
      date: "24. – 28. Srpna 2026",
      deadline: "Přihlášky do 31. května 2026",
      price: "5 800 Kč",
      siblingPrice: "4 800 Kč"
    }
  };

  const [kidsConfig, setKidsConfig] = useState(defaultKidsConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  useEffect(() => {
    const initAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (isAdminUrl && session?.user?.email === 'info@sunrise-la.cz') {
        setIsAdminMode(true);
      }
      
      const { data, error } = await supabase.from('summer_camps_config').select('*').eq('camp_id', 'kids_camp').single();
      if (data && data.config) {
        setKidsConfig(data.config);
      }
    };
    initAdmin();
  }, [isAdminUrl]);

  const handleConfigChange = (path, value) => {
    setKidsConfig(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = Array.isArray(current[keys[i]]) ? [...current[keys[i]]] : { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('summer_camps_config').upsert({
        camp_id: 'kids_camp',
        config: kidsConfig
      }, { onConflict: 'camp_id' });
      if (error) throw error;
      setSaveMessage('Uloženo!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setSaveMessage('Chyba: ' + err.message);
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };



  // Form states
  const [childForm, setChildForm] = useState({
    term: '',
    childName: '',
    nickname: '',
    age: '',
    phone: '',
    email: '',
    note: '',
    hasSibling: false,
    siblingName: '',
    siblingNickname: '',
    siblingAge: '',
    siblingNote: '',
    photoConsent: false,
    gdpr: false
  });
  const [childFormErrors, setChildFormErrors] = useState({});
  const [isChildSubmitting, setIsChildSubmitting] = useState(false);
  const [childStep, setChildStep] = useState(1);
  const [activeChildModal, setActiveChildModal] = useState(null);

  const [adultForm, setAdultForm] = useState({
    course: '',
    term: '',
    name: '',
    phone: '',
    email: '',
    note: '',
    gdpr: false
  });
  const [adultFormErrors, setAdultFormErrors] = useState({});
  const [isAdultSubmitting, setIsAdultSubmitting] = useState(false);
  const [adultStep, setAdultStep] = useState(1);
  const [activeAdultModal, setActiveAdultModal] = useState(null);

  useGSAP(() => {
    // Hero animations
    gsap.set(['.summer-badge', '.summer-title', '.summer-subtitle', '.summer-hero-actions', '.summer-hero-image-wrapper'], { opacity: 0, y: 40 });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.timeScale(0.65);
    tl.fromTo('.summer-badge', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.1 })
      .fromTo('.summer-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=0.7")
      .fromTo('.summer-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=0.9")
      .fromTo('.summer-hero-actions', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=1.0")
      .fromTo('.summer-hero-image-wrapper', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=1.0");

    // Overview cards animation
    gsap.set('.summer-overview-card', { opacity: 0, y: 50 });
    ScrollTrigger.batch('.summer-overview-card', {
      start: 'top 85%',
      once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: 'power3.out' })
    });

    // Detail cards animation
    gsap.set('.summer-detail-card', { opacity: 0, y: 50 });
    ScrollTrigger.batch('.summer-detail-card', {
      start: 'top 85%',
      once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: 'power3.out' })
    });

    // Info strip animation
    gsap.fromTo('.summer-info-strip',
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.summer-info-strip',
          start: 'top 85%',
          once: true
        }
      }
    );

    // Practical boxes animation
    gsap.set('.summer-practical-box', { opacity: 0, y: 40 });
    ScrollTrigger.batch('.summer-practical-box', {
      start: 'top 85%',
      once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' })
    });
  }, { scope: container });

  const scrollToAnchor = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  const handleChildChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChildForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (childFormErrors[name]) {
      setChildFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAdultChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdultForm(prev => {
      const newState = { ...prev, [name]: type === 'checkbox' ? checked : value };
      // Reset term if course changes
      if (name === 'course') {
        newState.term = '';
      }
      return newState;
    });
    if (adultFormErrors[name]) {
      setAdultFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleChildSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!childForm.term) errors.term = 'Vyberte prosím termín konání.';
    if (!childForm.childName.trim()) errors.childName = 'Zadejte jméno dítěte.';
    if (!childForm.age) errors.age = 'Vyberte věk dítěte.';
    if (!childForm.phone.trim()) errors.phone = 'Zadejte telefonní číslo.';
    if (!childForm.email.trim()) errors.email = 'Zadejte e-mail.';
    
    if (childForm.hasSibling) {
      if (!childForm.siblingName.trim()) errors.siblingName = 'Zadejte jméno sourozence.';
      if (!childForm.siblingAge) errors.siblingAge = 'Vyberte věk sourozence.';
    }

    if (!childForm.gdpr) errors.gdpr = 'Musíte souhlasit se zpracováním údajů.';

    if (Object.keys(errors).length > 0) {
      setChildFormErrors(errors);
      return;
    }

    setIsChildSubmitting(true);
    setTimeout(() => {
      setIsChildSubmitting(false);
      setChildStep(3);
    }, 1500);
  };

  const openChildModal = (term) => {
    setActiveChildModal({ term });
    setChildForm({
      term: term,
      childName: '',
      nickname: '',
      age: '',
      phone: '',
      email: '',
      note: '',
      hasSibling: false,
      siblingName: '',
      siblingNickname: '',
      siblingAge: '',
      siblingNote: '',
      photoConsent: false,
      gdpr: false
    });
    setChildStep(1);
    setChildFormErrors({});
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  };

  const closeChildModal = () => {
    setActiveChildModal(null);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  const handleAdultSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!adultForm.course) errors.course = 'Vyberte prosím kurz.';
    if (!adultForm.name.trim()) errors.name = 'Zadejte Vaše jméno.';
    if (!adultForm.phone.trim()) errors.phone = 'Zadejte telefonní číslo.';
    if (!adultForm.email.trim()) errors.email = 'Zadejte e-mail.';
    if (!adultForm.gdpr) errors.gdpr = 'Musíte souhlasit se zpracováním údajů.';

    if (Object.keys(errors).length > 0) {
      setAdultFormErrors(errors);
      return;
    }

    setIsAdultSubmitting(true);
    setTimeout(() => {
      setIsAdultSubmitting(false);
      setAdultStep(4);
    }, 1500);
  };

  const handleProceedToCheckoutAdult = () => {
    if (!adultForm.term) {
      setAdultFormErrors({ term: 'Vyberte prosím termín konání.' });
      return;
    }
    
    const isDay = adultForm.course === 'Intenzivní kurz denní';
    const isEvening = adultForm.course === 'Intenzivní kurz večerní';
    const priceText = isDay ? '5 800 Kč' : isEvening ? '3 800 Kč' : '1 954 Kč';
    const priceVal = isDay ? 5800 : isEvening ? 3800 : 1954;
    
    closeAdultModal();
    navigate('/pokladna', {
      state: {
        source: 'summer_adults',
        title: `${adultForm.course} (${adultForm.term})`,
        term: adultForm.term,
        priceText: priceText,
        price: priceVal,
        details: isDay || isEvening ? 'Max. 8 studentů' : 'Max. 10 studentů'
      }
    });
  };

  const handleProceedToCheckoutChild = () => {
    const isTerm1 = childForm.term === 'Termín 1';
    const termDate = isTerm1 ? kidsConfig.term1.date : kidsConfig.term2.date;
    const priceText = isTerm1 ? kidsConfig.term1.price : kidsConfig.term2.price;
    const siblingPriceText = isTerm1 ? kidsConfig.term1.siblingPrice : kidsConfig.term2.siblingPrice;
    
    const priceVal = parseInt(priceText?.replace(/\D/g, '') || '0', 10);
    const siblingPriceVal = parseInt(siblingPriceText?.replace(/\D/g, '') || '0', 10);
    
    closeChildModal();
    navigate('/pokladna', {
      state: {
        source: 'summer_kids',
        title: `Letní tábor: ${childForm.term} (${termDate})`,
        term: termDate,
        priceText: priceText,
        siblingPriceText: siblingPriceText,
        price: priceVal,
        siblingPrice: siblingPriceVal,
        details: kidsConfig.global.groupSize
      }
    });
  };

  const openAdultModal = (course) => {
    setActiveAdultModal({ course });
    setAdultForm({
      course: course,
      term: '',
      name: '',
      phone: '',
      email: '',
      note: '',
      gdpr: false
    });
    setAdultStep(1);
    setAdultFormErrors({});
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  };

  const closeAdultModal = () => {
    setActiveAdultModal(null);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  const getAdultDates = () => {
    if (adultForm.course === 'Angličtina na cesty') {
      return ['24. – 27. Května 2026', '21. – 24. Června 2026'];
    }
    if (adultForm.course) {
      return ['3. – 7. Srpna 2026', '17. – 21. Srpna 2026'];
    }
    return [];
  };

  return (
    <main className="summer-page" ref={container}>
      {isAdminMode && (
        <div className="admin-floating-banner">
          <style>{`.navbar { top: var(--navbar-offset, 65px) !important; transition: top 0.4s ease-out !important; }`}</style>
          
          <div className="afb-info">
            <span className="afb-info-role">MASTER ADMIN</span>
            {saveMessage && <span style={{ color: '#1C9C73', fontWeight: 'bold', marginLeft: '10px' }}>{saveMessage}</span>}
          </div>
          
          <div className="afb-actions">
            <Link to="/portal/admin" className="afb-btn-link">
               <span className="material-symbols-outlined" style={{fontSize:'1rem'}}>settings</span> Zpět do Administrace
            </Link>
            <button onClick={handleSaveConfig} className="afb-btn-logout" style={{ background: 'white', color: 'var(--color-primary)' }}>
              {isSaving ? 'Ukládám...' : 'Uložit změny'}
            </button>
            <button onClick={handleAdminLogout} className="afb-btn-logout">
              Odhlásit se a zavřít režim
            </button>
          </div>
        </div>
      )}

      {/* 1. HERO SEKCE */}
      <section className="summer-hero-section" style={{ paddingTop: isAdminMode ? '160px' : '100px' }}>
        <div className="summer-organic-bg"></div>
        <div className="summer-hero-content">
          <div className="summer-hero-text">
            <div className="summer-badge"><Link to="/portal" style={{ color: 'inherit', textDecoration: 'none' }}>Léto {new Date().getFullYear()}</Link></div>
            <h1 className="summer-title">Léto, které nezapomenete.</h1>
            <p className="summer-subtitle">
              Dopřejte dětem angličtinu, která je bude bavit, posuňte se rychle sami — nebo si konečně užijte dovolenou bez jazykového stresu.
            </p>
            <div className="summer-hero-actions">
              <a href="#dospeli" onClick={(e) => scrollToAnchor(e, 'dospeli')} className="btn btn-primary">
                Vybrat program pro sebe
              </a>
              <a href="#deti" onClick={(e) => scrollToAnchor(e, 'deti')} className="btn summer-outline-btn-dark">
                Vybrat program pro dítě
              </a>
            </div>
          </div>
          <div className="summer-hero-image-wrapper">
            <div className="summer-hero-shadow"></div>
            <img src="/Letni program sunrise.webp" alt="Letní program" fetchpriority="high" loading="eager" />
          </div>
        </div>
      </section>



      {/* 3. PROGRAMY PRO DĚTI */}
      <section id="deti" className="summer-programs-section">
        <div className="summer-container">
          <div className="summer-program-header">
            <h2>Letní tábor s angličtinou</h2>
            <p>Celý týden 8 hodin denně v angličtině — sportem, tvořením, výlety i obědem. Děti se rozmluví přirozeně, aniž by to vnímaly jako učení.</p>
          </div>


          <div className="summer-tickets-list">

            {/* TICKET 1 */}
            <div className="summer-term-ticket ticket-accent-mint">
              <div className="summer-ticket-blob"></div>
              <div className="adult-ticket-info">
                <div className="adult-ticket-header">
                  <span className="summer-card-pill pill-mint" style={{ margin: 0, padding: '4px 12px' }}>
                    {kidsConfig.term1.age}
                  </span>
                </div>
                <div className="adult-ticket-body">
                  <h3 className="adult-ticket-title">Termín 1</h3>
                  <div className="summer-highlighted-date" style={{ margin: 0 }}>
                    <span className="material-symbols-outlined">event</span>
                    {kidsConfig.term1.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.95rem', margin: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>info</span> 
                    {kidsConfig.term1.deadline}
                  </div>
                </div>
              </div>
              <div className="ticket-action">
                <div className="ticket-price">
                  <strong>{kidsConfig.term1.price}</strong>
                  <span>(sourozenec {kidsConfig.term1.siblingPrice})</span>
                </div>
                <a href="#kontakt" onClick={(e) => { e.preventDefault(); openChildModal('Termín 1'); }} className="btn btn-accent-mint">
                  Zjistit více
                </a>
              </div>
            </div>

            {/* TICKET 2 */}
            <div className="summer-term-ticket ticket-accent-navy">
              <div className="summer-ticket-blob"></div>
              <div className="adult-ticket-info">
                <div className="adult-ticket-header">
                  <span className="summer-card-pill pill-navy" style={{ margin: 0, padding: '4px 12px' }}>
                    {kidsConfig.term2.age}
                  </span>
                </div>
                <div className="adult-ticket-body">
                  <h3 className="adult-ticket-title">Termín 2</h3>
                  <div className="summer-highlighted-date" style={{ margin: 0 }}>
                    <span className="material-symbols-outlined">event</span>
                    {kidsConfig.term2.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.95rem', margin: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>info</span> 
                    {kidsConfig.term2.deadline}
                  </div>
                </div>
              </div>
              <div className="ticket-action">
                <div className="ticket-price">
                  <strong>{kidsConfig.term2.price}</strong>
                  <span>(sourozenec {kidsConfig.term2.siblingPrice})</span>
                </div>
                <a href="#kontakt" onClick={(e) => { e.preventDefault(); openChildModal('Termín 2'); }} className="btn btn-accent-navy">
                  Zjistit více
                </a>
              </div>
            </div>

          </div>


        </div>
      </section>

      {/* 4. PROGRAMY PRO DOSPĚLÉ */}
      <section id="dospeli" className="summer-adults-section">
        <div className="summer-container">
          <div className="summer-program-header">
            <h2>Intenzivní kurzy pro studenty a dospělé</h2>
            <p>Nejrychlejší způsob, jak se v angličtině skutečně posunout — intenzivní výuka v malé skupině s důrazem na zlepšení za co nejkratší dobu</p>
          </div>

          <div className="summer-tickets-list">

            {/* KARTA DOSPĚLÍ 1 */}
            <div className="summer-term-ticket adult-ticket ticket-accent-mint">
              <div className="summer-ticket-blob"></div>
              <div className="adult-ticket-info">
                <div className="adult-ticket-header">
                  <span className="summer-card-pill pill-mint" style={{ margin: 0 }}>Rychlokurz</span>
                  <span className="adult-ticket-audience">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#1C9C73' }}>flight_takeoff</span>
                    Před dovolenou
                  </span>
                </div>

                <div className="adult-ticket-body">
                  <h3 className="adult-ticket-title">Angličtina na cesty</h3>
                  <div className="adult-ticket-date" style={{ background: 'rgba(28, 156, 115, 0.06)', border: '1px solid rgba(28, 156, 115, 0.1)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: '#1C9C73' }}>calendar_month</span>
                    <span style={{ color: '#1C9C73' }}>Květen a Červen 2026</span>
                  </div>
                </div>
              </div>
              <div className="ticket-action">
                <div className="ticket-price">
                  <strong>1 954 Kč</strong>
                  <span>cena kurzu</span>
                </div>
                <a href="#kontakt" onClick={(e) => { e.preventDefault(); openAdultModal('Angličtina na cesty'); }} className="btn btn-accent-mint">
                  Zjistit více
                </a>
              </div>
            </div>

            {/* KARTA DOSPĚLÍ 2 */}
            <div className="summer-term-ticket adult-ticket ticket-accent-navy">
              <div className="summer-ticket-blob"></div>
              <div className="adult-ticket-info">
                <div className="adult-ticket-header">
                  <span className="summer-card-pill pill-navy" style={{ margin: 0 }}>Denní</span>
                  <span className="adult-ticket-audience">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#1E3A8A' }}>group</span>
                    Vhodné od 15 let
                  </span>
                </div>

                <div className="adult-ticket-body">
                  <h3 className="adult-ticket-title">Intenzivní kurz angličtiny</h3>
                  <div className="adult-ticket-date" style={{ background: 'rgba(30, 58, 138, 0.06)', border: '1px solid rgba(30, 58, 138, 0.1)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: '#1E3A8A' }}>calendar_month</span>
                    <span style={{ color: '#1E3A8A' }}>Srpen 2026</span>
                  </div>
                </div>
              </div>
              <div className="ticket-action">
                <div className="ticket-price">
                  <strong>5 800 Kč</strong>
                  <span>cena kurzu</span>
                </div>
                <a href="#kontakt" onClick={(e) => { e.preventDefault(); openAdultModal('Intenzivní kurz denní'); }} className="btn btn-accent-navy">
                  Zjistit více
                </a>
              </div>
            </div>

            {/* KARTA DOSPĚLÍ 3 */}
            <div className="summer-term-ticket adult-ticket ticket-accent-gray">
              <div className="summer-ticket-blob"></div>
              <div className="adult-ticket-info">
                <div className="adult-ticket-header">
                  <span className="summer-card-pill pill-gray" style={{ margin: 0 }}>Večerní</span>
                  <span className="adult-ticket-audience">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6B7280' }}>group</span>
                    Vhodné od 15 let
                  </span>
                </div>

                <div className="adult-ticket-body">
                  <h3 className="adult-ticket-title">Intenzivní kurz angličtiny</h3>
                  <div className="adult-ticket-date" style={{ background: 'rgba(107, 114, 128, 0.06)', border: '1px solid rgba(107, 114, 128, 0.1)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: '#6B7280' }}>calendar_month</span>
                    <span style={{ color: '#4b5563' }}>Srpen 2026</span>
                  </div>
                </div>
              </div>
              <div className="ticket-action">
                <div className="ticket-price">
                  <strong>3 800 Kč</strong>
                  <span>cena kurzu</span>
                </div>
                <a href="#kontakt" onClick={(e) => { e.preventDefault(); openAdultModal('Intenzivní kurz večerní'); }} className="btn btn-accent-gray">
                  Zjistit více
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FINÁLNÍ CTA */}
      <section className="summer-new-cta">
        <div className="summer-container">
          <div className="summer-cta-inner">
            <div className="summer-cta-left">
              <h2 className="summer-cta-title">Není Vám něco jasné?</h2>
              <p className="summer-cta-text">
                Rádi Vám zodpovíme každý dotaz. Neváhejte nás kontaktovat.
              </p>
            </div>
            <div className="summer-cta-right">
              <div className="summer-cta-simple-text">
                <span>Odpovídáme do 24 hodin</span>
                <span className="dot">&bull;</span>
                <span>Pardubice a okolí</span>
              </div>
              <Link to="/kontakt#formular" className="btn btn-primary summer-cta-btn">Kontaktujte nás &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL PRO DETAIL A ZÁPIS DÍTĚTE */}
      {activeChildModal && (
        <div className="summer-modal-overlay" onClick={closeChildModal}>
          <div className="summer-modal-content" ref={childModalRef} onClick={e => e.stopPropagation()}>
            <button className="summer-modal-close" onClick={closeChildModal}>
              <span className="material-symbols-outlined">close</span>
            </button>

            {childStep >= 1 && childStep <= 2 && (
              <div className="modal-step-wizard">
                <div className={`summer-modal-header ${childForm.term === 'Termín 2' ? 'accent-navy' : 'accent-mint'}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: 'clamp(25px, 5vw, 30px)' }}>
                    <span className="summer-card-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', margin: 0 }}>
                      Letní tábor
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                      Krok {childStep} / 2
                    </span>
                  </div>
                  <h2 style={{ color: 'white', fontSize: 'clamp(1.5rem, 6vw, 2rem)', marginBottom: '5px' }}>
                    {childStep === 1 && 'Informace o táboře'}
                    {childStep === 2 && 'Přihláška na tábor'}
                  </h2>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', margin: 0 }}>
                    <EditableField isAdminMode={isAdminMode} 
                      value={childForm.term === 'Termín 1' ? kidsConfig.term1.deadline : (childForm.term === 'Termín 2' ? kidsConfig.term2.deadline : '')} 
                      onChange={v => handleConfigChange(childForm.term === 'Termín 1' ? 'term1.deadline' : 'term2.deadline', v)} 
                    />
                  </div>
                  <div className="wizard-progress-bar" style={{ background: 'rgba(255,255,255,0.2)', height: '4px', borderRadius: '4px', overflow: 'hidden', marginTop: '15px' }}>
                    <div className="wizard-progress-fill" style={{ width: childStep === 1 ? '50%' : '100%', height: '100%', background: '#fff', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>

                <div className="summer-modal-body" style={{ padding: '0' }}>
                  {childStep === 1 && (
                    <div className="wizard-step-1 fade-in" style={{ padding: '30px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '25px' }}>
                      </div>

                      <div style={{ color: '#444' }}>
                        {(() => {
                          const isTerm1 = childForm.term === 'Termín 1';
                          const colorTheme = isTerm1 ? '#1C9C73' : '#1E3A8A';
                          const bgTheme = isTerm1 ? 'rgba(28, 156, 115, 0.05)' : 'rgba(30, 58, 138, 0.05)';
                          const borderTheme = isTerm1 ? 'rgba(28, 156, 115, 0.1)' : 'rgba(30, 58, 138, 0.1)';

                          return (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ margin: 0, lineHeight: '1.6', fontSize: 'clamp(0.9rem, 3vw, 1.05rem)' }}>
                                  <strong><EditableField isAdminMode={isAdminMode} value={kidsConfig.global.modalTitle} onChange={v => handleConfigChange('global.modalTitle', v)} /></strong><br />
                                  <EditableField isAdminMode={isAdminMode} isMultiline value={kidsConfig.global.modalSubtitle} onChange={v => handleConfigChange('global.modalSubtitle', v)} />
                                </div>

                                <details style={{ background: bgTheme, borderRadius: '8px', border: `1px solid ${borderTheme}`, cursor: 'pointer' }}>
                                  <summary style={{ padding: '12px 16px', fontWeight: '600', color: colorTheme, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                                    Zjistit, co tábor obsahuje a jak probíhá
                                  </summary>

                                  <div style={{ padding: '0 16px 16px 16px', borderTop: `1px solid ${borderTheme}`, marginTop: '4px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px', cursor: 'auto' }}>
                                    
                                    {/* Jak to probíhá */}
                                    <div>
                                      <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                                        <EditableField isAdminMode={isAdminMode} value={kidsConfig.global.section1Title} onChange={v => handleConfigChange('global.section1Title', v)} />
                                      </h4>
                                      <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                                        <EditableField isAdminMode={isAdminMode} isMultiline value={kidsConfig.global.section1Text} onChange={v => handleConfigChange('global.section1Text', v)} />
                                      </div>
                                    </div>

                                  {/* Co děti čeká */}
                                  <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                                      <EditableField isAdminMode={isAdminMode} value={kidsConfig.global.section2Title} onChange={v => handleConfigChange('global.section2Title', v)} />
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                                      {kidsConfig.global.section2Items.map((item, i) => (
                                        <div key={i} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)', position: 'relative' }}>
                                          <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>
                                            <EditableField isAdminMode={isAdminMode} value={item.title} onChange={v => {
                                              const newArr = [...kidsConfig.global.section2Items];
                                              newArr[i].title = v;
                                              handleConfigChange('global.section2Items', newArr);
                                            }} />
                                          </div>
                                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>
                                            <EditableField isAdminMode={isAdminMode} value={item.desc} onChange={v => {
                                              const newArr = [...kidsConfig.global.section2Items];
                                              newArr[i].desc = v;
                                              handleConfigChange('global.section2Items', newArr);
                                            }} />
                                          </div>
                                          {isAdminMode && (
                                            <button onClick={() => {
                                              const newArr = [...kidsConfig.global.section2Items];
                                              newArr.splice(i, 1);
                                              handleConfigChange('global.section2Items', newArr);
                                            }} style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                                          )}
                                        </div>
                                      ))}
                                      {isAdminMode && (
                                        <button onClick={() => {
                                          const newArr = [...kidsConfig.global.section2Items, { title: 'Nový bod', desc: 'Popis' }];
                                          handleConfigChange('global.section2Items', newArr);
                                        }} style={{ background: 'rgba(0,0,0,0.05)', border: '1px dashed #ccc', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>+ Přidat</button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Co je v ceně */}
                                  <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                                      <EditableField isAdminMode={isAdminMode} value={kidsConfig.global.section3Title} onChange={v => handleConfigChange('global.section3Title', v)} />
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                                      {kidsConfig.global.section3Items.map((item, i) => (
                                        <div key={i} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)', position: 'relative' }}>
                                          <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>
                                            <EditableField isAdminMode={isAdminMode} value={item.title} onChange={v => {
                                              const newArr = [...kidsConfig.global.section3Items];
                                              newArr[i].title = v;
                                              handleConfigChange('global.section3Items', newArr);
                                            }} />
                                          </div>
                                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>
                                            <EditableField isAdminMode={isAdminMode} value={item.desc} onChange={v => {
                                              const newArr = [...kidsConfig.global.section3Items];
                                              newArr[i].desc = v;
                                              handleConfigChange('global.section3Items', newArr);
                                            }} />
                                          </div>
                                          {isAdminMode && (
                                            <button onClick={() => {
                                              const newArr = [...kidsConfig.global.section3Items];
                                              newArr.splice(i, 1);
                                              handleConfigChange('global.section3Items', newArr);
                                            }} style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                                          )}
                                        </div>
                                      ))}
                                      {isAdminMode && (
                                        <button onClick={() => {
                                          const newArr = [...kidsConfig.global.section3Items, { title: 'Nová položka', desc: 'Popis' }];
                                          handleConfigChange('global.section3Items', newArr);
                                        }} style={{ background: 'rgba(0,0,0,0.05)', border: '1px dashed #ccc', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>+ Přidat</button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Výsledek */}
                                  <div style={{ background: bgTheme, padding: '16px', borderRadius: '10px', borderLeft: `4px solid ${colorTheme}`, marginTop: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                      <span className="material-symbols-outlined" style={{ color: colorTheme, fontSize: '20px' }}>emoji_events</span>
                                      <strong style={{ color: '#222' }}>
                                        <EditableField isAdminMode={isAdminMode} value={kidsConfig.global.section4Title} onChange={v => handleConfigChange('global.section4Title', v)} />
                                      </strong>
                                    </div>
                                    <div style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                      <EditableField isAdminMode={isAdminMode} isMultiline value={kidsConfig.global.section4Text} onChange={v => handleConfigChange('global.section4Text', v)} />
                                    </div>
                                  </div>
                                </div>
                              </details>
                            </div>
                          );
                        })()}

                        <hr style={{ borderTop: '1px solid #eaeaea', borderBottom: 'none', margin: '0 0 20px 0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span className="material-symbols-outlined" style={{ color: '#1e3a8a', fontSize: '20px' }}>event</span>
                            </div>
                            <div>
                              <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '2px' }}>Vybraný termín</div>
                              <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
                                <EditableField isAdminMode={isAdminMode} 
                                  value={childForm.term === 'Termín 1' ? kidsConfig.term1.date : (childForm.term === 'Termín 2' ? kidsConfig.term2.date : '')} 
                                  onChange={v => handleConfigChange(childForm.term === 'Termín 1' ? 'term1.date' : 'term2.date', v)} 
                                />
                              </div>
                              <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginTop: '2px' }}>
                                <EditableField isAdminMode={isAdminMode} 
                                  value={childForm.term === 'Termín 1' ? kidsConfig.term1.age : (childForm.term === 'Termín 2' ? kidsConfig.term2.age : '')} 
                                  onChange={v => handleConfigChange(childForm.term === 'Termín 1' ? 'term1.age' : 'term2.age', v)} 
                                />
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span className="material-symbols-outlined" style={{ color: '#1e3a8a', fontSize: '20px' }}>schedule</span>
                            </div>
                            <div>
                              <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '2px' }}>Čas konání</div>
                              <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
                                <EditableField isAdminMode={isAdminMode} value={kidsConfig.global.time} onChange={v => handleConfigChange('global.time', v)} />
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span className="material-symbols-outlined" style={{ color: '#1e3a8a', fontSize: '20px' }}>location_on</span>
                            </div>
                            <div>
                              <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '2px' }}>Místo konání</div>
                              <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
                                <EditableField isAdminMode={isAdminMode} value={kidsConfig.global.location} onChange={v => handleConfigChange('global.location', v)} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr style={{ borderTop: '1px solid #eaeaea', borderBottom: 'none', margin: '0 0 20px 0' }} />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                            <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '4px' }}>Skupina</div>
                            <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)' }}>
                              <EditableField isAdminMode={isAdminMode} value={kidsConfig.global.groupSize} onChange={v => handleConfigChange('global.groupSize', v)} />
                            </div>
                          </div>
                          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                            <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '4px' }}>Cena za tábor</div>
                            <div style={{ color: '#1e3a8a', fontWeight: '600', fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)' }}>
                              <EditableField isAdminMode={isAdminMode} 
                                value={childForm.term === 'Termín 1' ? kidsConfig.term1.price : (childForm.term === 'Termín 2' ? kidsConfig.term2.price : '')} 
                                onChange={v => handleConfigChange(childForm.term === 'Termín 1' ? 'term1.price' : 'term2.price', v)} 
                              />
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                              (Sourozenec <EditableField isAdminMode={isAdminMode} 
                                value={childForm.term === 'Termín 1' ? kidsConfig.term1.siblingPrice : (childForm.term === 'Termín 2' ? kidsConfig.term2.siblingPrice : '')} 
                                onChange={v => handleConfigChange(childForm.term === 'Termín 1' ? 'term1.siblingPrice' : 'term2.siblingPrice', v)} 
                              />)
                            </div>
                          </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '25px' }}>
                          <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '4px' }}>V ceně</div>
                          <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)' }}>
                            <EditableField isAdminMode={isAdminMode} value={kidsConfig.global.includedText} onChange={v => handleConfigChange('global.includedText', v)} />
                          </div>
                        </div>

                        <hr style={{ borderTop: '1px solid #eaeaea', borderBottom: 'none', margin: '0 0 20px 0' }} />

                        <div>
                          <h4 style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px' }}>Co s sebou</h4>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {kidsConfig.global.whatToBring.map((item, i) => (
                              <span key={i} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#334155', borderRadius: '12px', fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <EditableField isAdminMode={isAdminMode} value={item} onChange={v => {
                                  const newArr = [...kidsConfig.global.whatToBring];
                                  newArr[i] = v;
                                  handleConfigChange('global.whatToBring', newArr);
                                }} />
                                {isAdminMode && (
                                  <button onClick={() => {
                                    const newArr = [...kidsConfig.global.whatToBring];
                                    newArr.splice(i, 1);
                                    handleConfigChange('global.whatToBring', newArr);
                                  }} style={{ background: 'transparent', color: '#d32f2f', border: 'none', cursor: 'pointer', padding: 0, fontSize: '1rem', fontWeight: 'bold' }}>&times;</button>
                                )}
                              </span>
                            ))}
                            {isAdminMode && (
                              <button onClick={() => {
                                const newArr = [...kidsConfig.global.whatToBring, 'Nová položka'];
                                handleConfigChange('global.whatToBring', newArr);
                              }} style={{ background: 'rgba(0,0,0,0.05)', border: '1px dashed #ccc', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', fontSize: 'clamp(0.85rem, 3vw, 0.95rem)' }}>+ Přidat</button>
                            )}
                          </div>
                        </div>
                      </div>

                      <button type="button" onClick={handleProceedToCheckoutChild} className={`btn btn-accent-${childForm.term === 'Termín 1' ? 'mint' : 'navy'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', marginTop: '45px' }}>
                        Přejít k objednávce a platbě
                        <span className="material-symbols-outlined">shopping_cart_checkout</span>
                      </button>
                    </div>
                  )}

                  {childStep === 2 && (
                    <div className="wizard-step-2 fade-in" style={{ padding: '30px' }}>
                      <form className="summer-form" onSubmit={handleChildSubmit} noValidate>
                        <div className="summer-fieldset">
                          <div className="form-row">
                            <div className="form-group">
                              <label>Jméno dítěte *</label>
                              <input type="text" name="childName" className={childFormErrors.childName ? 'input-error' : ''} value={childForm.childName} onChange={handleChildChange} placeholder="Např. Jan Novák" />
                              {childFormErrors.childName && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{childFormErrors.childName}</div>}
                            </div>
                            <div className="form-group">
                              <label>Věk dítěte *</label>
                              <select name="age" className={childFormErrors.age ? 'input-error' : ''} value={childForm.age} onChange={handleChildChange}>
                                <option value="">Vyberte věk</option>
                                <option value="4">4 roky</option>
                                <option value="5">5 let</option>
                                <option value="6">6 let</option>
                                <option value="7">7 let</option>
                                <option value="8">8 let</option>
                                <option value="9">9 let</option>
                                <option value="10">10 let</option>
                                <option value="11">11 let</option>
                                <option value="12">12 let</option>
                                <option value="13">13 let</option>
                                <option value="14">14 let</option>
                              </select>
                              {childFormErrors.age && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{childFormErrors.age}</div>}
                            </div>
                          </div>
                        </div>

                        <div className="summer-fieldset">
                          <div className="form-group">
                            <label>Oslovení, které má dítě rádo</label>
                            <input type="text" name="nickname" value={childForm.nickname} onChange={handleChildChange} placeholder="Např. Kubík, Terezka..." />
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Telefon na rodiče *</label>
                              <input type="tel" name="phone" className={childFormErrors.phone ? 'input-error' : ''} value={childForm.phone} onChange={handleChildChange} placeholder="+420 123 456 789" />
                              {childFormErrors.phone && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{childFormErrors.phone}</div>}
                            </div>
                            <div className="form-group">
                              <label>E-mail rodiče *</label>
                              <input type="email" name="email" className={childFormErrors.email ? 'input-error' : ''} value={childForm.email} onChange={handleChildChange} placeholder="vas@email.cz" />
                              {childFormErrors.email && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{childFormErrors.email}</div>}
                            </div>
                          </div>
                        </div>

                        <div className="summer-fieldset">
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Poznámka (volitelné)</label>
                            <textarea name="note" value={childForm.note} onChange={handleChildChange} rows="3" placeholder="Volitelná poznámka..." style={{ marginBottom: 0 }}></textarea>
                          </div>
                          
                          <div className="form-group checkbox-group" style={{ marginTop: '-22px', marginBottom: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontWeight: '600', color: '#334155', cursor: 'pointer', padding: '14px 16px', border: childForm.hasSibling ? '2px solid var(--tp-pink)' : '1px solid #e2e8f0', borderRadius: '12px', background: childForm.hasSibling ? 'rgba(239, 103, 165, 0.05)' : '#f8fafc', transition: 'all 0.2s' }}>
                              <input type="checkbox" name="hasSibling" checked={childForm.hasSibling} onChange={handleChildChange} style={{ width: '22px', height: '22px', accentColor: 'var(--tp-pink)', cursor: 'pointer' }} />
                              <span style={{flex: 1, lineHeight: '1.3'}}>Chci přihlásit i sourozence <span style={{color: 'var(--tp-pink)', fontWeight: '700', whiteSpace: 'nowrap'}}>(zvýhodněná cena)</span></span>
                            </label>
                          </div>
                        </div>

                        {childForm.hasSibling && (
                          <div className="summer-fieldset fade-in" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Údaje o sourozenci</h4>
                            <div className="form-row">
                              <div className="form-group">
                                <label>Jméno sourozence *</label>
                                <input type="text" name="siblingName" className={childFormErrors.siblingName ? 'input-error' : ''} value={childForm.siblingName} onChange={handleChildChange} placeholder="Např. Anička Nováková" />
                                {childFormErrors.siblingName && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{childFormErrors.siblingName}</div>}
                              </div>
                              <div className="form-group">
                                <label>Věk sourozence *</label>
                                <select name="siblingAge" className={childFormErrors.siblingAge ? 'input-error' : ''} value={childForm.siblingAge} onChange={handleChildChange}>
                                  <option value="">Vyberte věk</option>
                                  <option value="4">4 roky</option>
                                  <option value="5">5 let</option>
                                  <option value="6">6 let</option>
                                  <option value="7">7 let</option>
                                  <option value="8">8 let</option>
                                  <option value="9">9 let</option>
                                  <option value="10">10 let</option>
                                  <option value="11">11 let</option>
                                  <option value="12">12 let</option>
                                  <option value="13">13 let</option>
                                  <option value="14">14 let</option>
                                </select>
                                {childFormErrors.siblingAge && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{childFormErrors.siblingAge}</div>}
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Oslovení, které má sourozenec rád</label>
                              <input type="text" name="siblingNickname" value={childForm.siblingNickname} onChange={handleChildChange} placeholder="Např. Anička" />
                            </div>
                            <div className="form-group">
                              <label>Poznámka pro sourozence</label>
                              <textarea name="siblingNote" value={childForm.siblingNote} onChange={handleChildChange} rows="2" placeholder="Volitelná poznámka..."></textarea>
                            </div>
                          </div>
                        )}

                        <div className="form-group checkbox-group" style={{ marginTop: '-32px' }}>
                          <div style={{ marginBottom: '16px' }}>
                            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start' }}>
                              <input type="checkbox" name="photoConsent" className="summer-gdpr-checkbox" checked={childForm.photoConsent} onChange={handleChildChange} />
                              <span style={{ textTransform: 'none' }}>Souhlasím se zveřejněním fotek dítěte na stránkách a sociálních sítích SUNRISE Language Agency, s.r.o.</span>
                            </label>
                          </div>
                          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <input type="checkbox" name="gdpr" className="summer-gdpr-checkbox" checked={childForm.gdpr} onChange={handleChildChange} />
                            <span style={{ textTransform: 'none' }}>Souhlasím s <Link to="/obchodni-podminky" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Obchodními podmínkami</Link> a <Link to="/ochrana-osobnich-udaju" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Zásadami ochrany osobních údajů</Link> *</span>
                          </label>
                          {childFormErrors.gdpr && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{childFormErrors.gdpr}</div>}
                        </div>

                        <div className="summer-modal-price-box" style={{ marginTop: '45px', padding: '16px', background: '#FAFAFA', borderRadius: '12px', border: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div className="summer-modal-price-left" style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.95rem', color: '#444', fontWeight: '600' }}>Celková cena za tábor</span>
                            <span style={{ fontSize: '0.85rem', color: childForm.hasSibling ? 'var(--tp-pink)' : '#888', fontWeight: '600' }}>
                              {childForm.hasSibling 
                                ? `+ Sourozenec - ${childForm.term === 'Termín 1' ? kidsConfig.term1.siblingPrice : kidsConfig.term2.siblingPrice}`
                                : `(sourozenec ${childForm.term === 'Termín 1' ? kidsConfig.term1.siblingPrice : kidsConfig.term2.siblingPrice})`
                              }
                            </span>
                          </div>
                          <div className="summer-modal-price-right" style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--tp-dark)' }}>
                            {(() => {
                              const basePriceStr = childForm.term === 'Termín 1' ? kidsConfig.term1.price : kidsConfig.term2.price;
                              const siblingPriceStr = childForm.term === 'Termín 1' ? kidsConfig.term1.siblingPrice : kidsConfig.term2.siblingPrice;
                              const parsePrice = (str) => parseInt((str || '').replace(/[^\d]/g, ''), 10) || 0;
                              const total = parsePrice(basePriceStr) + (childForm.hasSibling ? parsePrice(siblingPriceStr) : 0);
                              return total.toLocaleString('cs-CZ') + ' Kč';
                            })()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <button type="button" onClick={() => { setChildStep(1); childModalRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn" style={{ background: '#f1f1f1', color: '#333', padding: '14px', flex: '0 0 auto' }}>
                            <span className="material-symbols-outlined" style={{ margin: 0 }}>arrow_back</span>
                          </button>
                          <button type="submit" className="btn summer-submit-btn" disabled={isChildSubmitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1 }}>
                            {isChildSubmitting ? 'Zpracovávám...' : (
                              <>
                                Přejít k platbě
                                <span className="material-symbols-outlined">credit_card</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
            {childStep === 3 && (
              <div className="modal-step-2" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(239, 103, 165, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--tp-pink)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--tp-pink)' }}>check_circle</span>
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Téměř hotovo!</h2>
                <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '30px' }}>
                  Vaše přihláška byla zaznamenána. Nyní budete přesměrováni na platební bránu pro dokončení zápisu.
                </p>
                <button className="btn btn-primary" onClick={closeChildModal} style={{ width: '100%', backgroundColor: 'var(--tp-pink)', border: 'none' }}>Dokončit a zavřít</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADULT MODAL */}
      {activeAdultModal && (
        <div className="summer-modal-overlay" onClick={closeAdultModal}>
          <div className="summer-modal-content" ref={adultModalRef} onClick={e => e.stopPropagation()}>
            <button className="summer-modal-close" onClick={closeAdultModal}>
              <span className="material-symbols-outlined">close</span>
            </button>

            {adultStep >= 1 && adultStep <= 3 && (() => {
              const c = activeAdultModal.course;
              const isDay = c === 'Intenzivní kurz denní';
              const isEvening = c === 'Intenzivní kurz večerní';

              const colorTheme = isDay ? '#1E3A8A' : isEvening ? '#475569' : '#1C9C73';
              const bgTheme = isDay ? 'rgba(30, 58, 138, 0.05)' : isEvening ? 'rgba(71, 85, 105, 0.05)' : 'rgba(28, 156, 115, 0.05)';
              const borderTheme = isDay ? 'rgba(30, 58, 138, 0.1)' : isEvening ? 'rgba(71, 85, 105, 0.1)' : 'rgba(28, 156, 115, 0.1)';

              const intensiveDesc = (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ margin: 0 }}>
                    <strong>Intenzivní letní program (1 týden)</strong><br />
                    Letní intenzivní program je krátkodobý, ale velmi intenzivní jazykový kurz zaměřený na rychlé zlepšení praktických dovedností během jednoho týdne.
                  </p>

                  <details style={{ background: bgTheme, borderRadius: '12px', border: `1px solid ${borderTheme}`, cursor: 'pointer', overflow: 'hidden' }}>
                    <summary style={{ padding: '16px', fontWeight: '600', color: colorTheme, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                      Zjistit, co program obsahuje
                    </summary>

                    <div style={{ padding: '0 16px 20px 16px', borderTop: `1px solid ${borderTheme}`, display: 'flex', flexDirection: 'column', gap: '24px', cursor: 'auto', background: '#fff' }}>
                      
                      {/* Varianty programu */}
                      <div style={{ paddingTop: '16px' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Dostupné varianty</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                          <div style={{ background: bgTheme, padding: '16px', borderRadius: '10px', border: `1px solid ${borderTheme}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span className="material-symbols-outlined" style={{ color: colorTheme, fontSize: '20px' }}>light_mode</span>
                              <strong style={{ color: colorTheme }}>Denní varianta</strong>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#555' }}>5 hodin výuky denně<br/>(celkem 25 hodin)</div>
                          </div>
                          <div style={{ background: bgTheme, padding: '16px', borderRadius: '10px', border: `1px solid ${borderTheme}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span className="material-symbols-outlined" style={{ color: colorTheme, fontSize: '20px' }}>dark_mode</span>
                              <strong style={{ color: colorTheme }}>Večerní varianta</strong>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#555' }}>3 hodiny výuky denně<br/>(celkem 15 hodin)</div>
                          </div>
                        </div>
                      </div>

                      {/* Co program obsahuje */}
                      <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Obsah programu</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                          {[
                            { title: 'Studijní materiály zdarma', desc: 'Účastníci obdrží gramatickou učebnici' },
                            { title: 'Komplexní přehled gramatiky', desc: 'Systematické projití základních i klíčových struktur' },
                            { title: 'Praktické využití jazyka', desc: 'Důraz na aktivní používání gramatiky v komunikaci' },
                            { title: 'Rozvoj slovní zásoby', desc: 'Osvojení základní a prakticky využitelné slovní zásoby' },
                            { title: 'Procvičování poslechu', desc: 'Zlepšení porozumění mluvenému jazyku' },
                            { title: 'Důraz na mluvení', desc: 'Intenzivní konverzační trénink pro odbourání bariéry' }
                          ].map((item, i) => (
                            <div key={i} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                              <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>{item.title}</div>
                              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>{item.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Výsledek */}
                      <div style={{ background: bgTheme, padding: '16px', borderRadius: '10px', borderLeft: `4px solid ${colorTheme}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span className="material-symbols-outlined" style={{ color: colorTheme, fontSize: '20px' }}>emoji_events</span>
                          <strong style={{ color: '#222' }}>Výsledek</strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: '1.5' }}>
                          Účastníci si během krátké doby osvojí základy gramatiky a získají větší jistotu v komunikaci v reálných situacích.
                        </p>
                      </div>

                    </div>
                  </details>
                </div>
              );
              const travelDesc = (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ margin: 0 }}>
                    <strong>Angličtina na cesty</strong><br />
                    Praktický kurz zaměřený na situace, které Vás čekají při cestování do zahraničí. Během tří večerů získáte jistotu v komunikaci a zvládnete se domluvit v běžných situacích bez stresu.
                  </p>

                  <details style={{ background: bgTheme, borderRadius: '8px', border: `1px solid ${borderTheme}`, cursor: 'pointer' }}>
                    <summary style={{ padding: '12px 16px', fontWeight: '600', color: colorTheme, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                      Zjistit, co kurz obsahuje
                    </summary>

                    <div style={{ padding: '0 16px 16px 16px', borderTop: `1px solid ${borderTheme}`, marginTop: '4px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px', cursor: 'auto' }}>
                      
                      {/* Jak kurz probíhá */}
                      <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Jak kurz probíhá</h4>
                        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                          Kurz je rozdělený do tematických bloků podle reálných situací na cestách. Každé téma si nejdříve vysvětlíme a následně procvičíme v modelových situacích.
                        </div>
                      </div>

                      {/* Na jaké situace se připravíte */}
                      <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Témata na cestách</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                          {[
                            { title: 'Doprava a orientace', desc: 'Letiště, MHD, práce s mapou' },
                            { title: 'Jízdenky a letenky', desc: 'Rezervace a nákup' },
                            { title: 'Ubytování', desc: 'Hotel, check-in, řešení problémů' },
                            { title: 'Restaurace', desc: 'Objednávání jídla a placení' },
                            { title: 'Nakupování', desc: 'Oblečení, suvenýry, smlouvání' },
                            { title: 'Volný čas', desc: 'Pláž, památky, aktivity' }
                          ].map((item, i) => (
                            <div key={i} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                              <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>{item.title}</div>
                              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>{item.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Metodika výuky */}
                      <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Metodika výuky</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                          {[
                            { title: 'Modelové situace', desc: 'Simulace reálných situací, které Vás na cestách potkají' },
                            { title: 'Okamžitá praxe', desc: 'Minimum teorie, důraz na okamžité použití jazyka' },
                            { title: 'Užitečné fráze', desc: 'Základní fráze a otázky pro cestování' },
                            { title: 'Komunikační jistota', desc: 'Naučíte se vést dialog a reagovat na otázky' }
                          ].map((item, i) => (
                            <div key={i} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                              <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>{item.title}</div>
                              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>{item.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Výsledek */}
                      <div style={{ background: bgTheme, padding: '16px', borderRadius: '10px', borderLeft: `4px solid ${colorTheme}`, marginTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span className="material-symbols-outlined" style={{ color: colorTheme, fontSize: '20px' }}>emoji_events</span>
                          <strong style={{ color: '#222' }}>Výsledek kurzu</strong>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '24px', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                          <li>Samostatně se domluvíte při cestování</li>
                          <li>Zvládnete běžné situace bez stresu</li>
                          <li>Budete reagovat přirozeně a s jistotou</li>
                        </ul>
                      </div>
                    </div>
                  </details>
                </div>
              );

              const desc = (isDay || isEvening) ? intensiveDesc : travelDesc;

              const scheduleMain = isDay ? 'po – pá, 9–12 a 13–15 hod' :
                isEvening ? 'po – pá, 17–20 hod' :
                  '3 večery (ne, út, st), 19–21 hod';

              const scheduleSub = isDay ? 'celkem 25 lekcí' :
                isEvening ? 'celkem 15 lekcí' :
                  '';

              const group = isDay || isEvening ? 'Max. 8 studentů' : 'Max. 10 studentů';
              const price = isDay ? '5 800 Kč' : isEvening ? '3 800 Kč' : '1 954 Kč';
              const includes = isDay ? 'výuka kvalifikovanými lektory + učebnice' : 'výuka kvalifikovanými lektory + materiály';
              const items = isDay || isEvening ? ['psací potřeby', 'přezůvky'] : ['psací potřeby'];
              const groupMax = isDay || isEvening ? 8 : 10;
              const groupOccupancy = isDay ? 5 : isEvening ? 7 : 9;
              const groupPercentage = (groupOccupancy / groupMax) * 100;

              return (
                <div className="modal-step-wizard">
                  <div className={`summer-modal-header ${isDay ? 'accent-navy' : isEvening ? 'accent-gray' : 'accent-mint'}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: 'clamp(25px, 5vw, 30px)' }}>
                      <span className="summer-card-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', margin: 0 }}>
                        {isDay ? 'Denní' : isEvening ? 'Večerní' : 'Rychlokurz'}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Krok {adultStep} / 3
                      </span>
                    </div>
                    <h2 style={{ color: 'white', fontSize: 'clamp(1.5rem, 6vw, 2rem)', marginBottom: '5px' }}>{activeAdultModal.course}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', margin: 0 }}>
                      Přihlášky přijímáme do 31. 7. 2026
                    </p>
                  </div>

                  <div className="summer-modal-body">
                    {adultStep === 1 && (
                      <div className="wizard-step-1 fade-in">
                        <div style={{ color: '#444' }}>

                          <div style={{ marginBottom: '20px', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 3vw, 1.05rem)' }}>
                            {desc}
                          </div>

                          <hr style={{ borderTop: '1px solid #eaeaea', borderBottom: 'none', margin: '0 0 20px 0' }} />

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: '#1e3a8a', fontSize: '20px' }}>location_on</span>
                              </div>
                              <div>
                                <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '2px' }}>Místo konání</div>
                                <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>Jana Palacha 1638, Pardubice</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: '#1e3a8a', fontSize: '20px' }}>schedule</span>
                              </div>
                              <div>
                                <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '2px' }}>Čas výuky</div>
                                <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>{scheduleMain}</div>
                                {scheduleSub && <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginTop: '2px' }}>{scheduleSub}</div>}
                              </div>
                            </div>
                          </div>

                          <hr style={{ borderTop: '1px solid #eaeaea', borderBottom: 'none', margin: '0 0 20px 0' }} />

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                              <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '4px' }}>Skupina</div>
                              <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)' }}>{group}</div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                              <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '4px' }}>Cena kurzu</div>
                              <div style={{ color: '#1e3a8a', fontWeight: '600', fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)' }}>{price}</div>
                            </div>
                          </div>
                          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '25px' }}>
                            <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '4px' }}>V ceně</div>
                            <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)' }}>{includes}</div>
                          </div>

                          <hr style={{ borderTop: '1px solid #eaeaea', borderBottom: 'none', margin: '0 0 20px 0' }} />

                          <div>
                            <h4 style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px' }}>Co s sebou</h4>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              {items.map((item, idx) => (
                                <span key={idx} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#334155', borderRadius: '12px', fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', fontWeight: '500' }}>
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button type="button" onClick={() => { setAdultStep(2); adultModalRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`btn btn-accent-${activeAdultModal.course === 'Intenzivní kurz denní' ? 'navy' : activeAdultModal.course === 'Intenzivní kurz večerní' ? 'gray' : 'mint'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', marginTop: '45px' }}>
                          Chci se přihlásit
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      </div>
                    )}

                    {adultStep === 2 && (
                      <div className="wizard-step-2 fade-in">
                        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                          <label style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'block', textTransform: 'none' }}>Vyberte termín konání *</label>
                          <div className="form-group-radio">
                            {getAdultDates().map((date, idx) => (
                              <label key={idx} className={`radio-label ${adultForm.term === date ? 'selected' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: '16px', padding: '16px', fontSize: '1.05rem', textTransform: 'none', width: '100%', boxSizing: 'border-box' }}>
                                <input type="radio" name="term" value={date} checked={adultForm.term === date} onChange={handleAdultChange} style={{ margin: 0, justifySelf: 'center' }} />
                                
                                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, justifySelf: 'start', textAlign: 'left', wordBreak: 'break-word' }}>
                                  <span style={{ fontWeight: '600', lineHeight: '1.3' }}>{date}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                          {adultFormErrors.term && <div className="custom-form-error" style={{ marginTop: '10px' }}><span className="material-symbols-outlined">error</span>{adultFormErrors.term}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="button" onClick={() => { setAdultStep(1); adultModalRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn" style={{ background: '#f1f1f1', color: '#333', padding: '14px', flex: '0 0 auto' }}>
                            <span className="material-symbols-outlined" style={{ margin: 0 }}>arrow_back</span>
                          </button>
                          <button type="button" onClick={handleProceedToCheckoutAdult} className={`btn btn-accent-${activeAdultModal.course === 'Intenzivní kurz denní' ? 'navy' : activeAdultModal.course === 'Intenzivní kurz večerní' ? 'gray' : 'mint'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1 }}>
                            Přejít k objednávce a platbě
                            <span className="material-symbols-outlined">shopping_cart_checkout</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {adultStep === 3 && (
                      <form className="wizard-step-3 summer-form fade-in" onSubmit={handleAdultSubmit} noValidate>
                        <div className="summer-fieldset">
                          <div className="form-group">
                            <label>Jméno a příjmení *</label>
                            <input type="text" name="name" value={adultForm.name} onChange={handleAdultChange} placeholder="Např. Jan Novák" />
                            {adultFormErrors.name && <div className="custom-form-error"><span className="material-symbols-outlined">error</span>{adultFormErrors.name}</div>}
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Telefon *</label>
                              <input type="tel" name="phone" value={adultForm.phone} onChange={handleAdultChange} placeholder="+420 123 456 789" />
                              {adultFormErrors.phone && <div className="custom-form-error"><span className="material-symbols-outlined">error</span>{adultFormErrors.phone}</div>}
                            </div>
                            <div className="form-group">
                              <label>E-mail *</label>
                              <input type="email" name="email" value={adultForm.email} onChange={handleAdultChange} placeholder="vas@email.cz" />
                              {adultFormErrors.email && <div className="custom-form-error"><span className="material-symbols-outlined">error</span>{adultFormErrors.email}</div>}
                            </div>
                          </div>
                        </div>

                        <div className="summer-fieldset">
                          <div className="form-group">
                            <label>Poznámka</label>
                            <textarea name="note" value={adultForm.note} onChange={handleAdultChange} rows="3" placeholder="Máte nějaký dotaz nebo specifický požadavek?"></textarea>
                          </div>
                        </div>

                        <div className="form-group checkbox-group" style={{ marginTop: '-15px' }}>
                          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <input type="checkbox" name="gdpr" className="summer-gdpr-checkbox" checked={adultForm.gdpr} onChange={handleAdultChange} />
                            <span style={{ textTransform: 'none' }}>Souhlasím s <Link to="/obchodni-podminky" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Obchodními podmínkami</Link> a <Link to="/ochrana-osobnich-udaju" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Zásadami ochrany osobních údajů</Link> *</span>
                          </label>
                          {adultFormErrors.gdpr && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{adultFormErrors.gdpr}</div>}
                        </div>

                        <div className="summer-modal-price-box" style={{ marginTop: '45px', padding: '16px', background: '#FAFAFA', borderRadius: '12px', border: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div className="summer-modal-price-left" style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.95rem', color: '#444', fontWeight: '600' }}>Celková cena za kurz</span>
                          </div>
                          <div className="summer-modal-price-right" style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--tp-dark)' }}>
                            {activeAdultModal.course === 'Intenzivní kurz denní' ? '5 800 Kč' : activeAdultModal.course === 'Intenzivní kurz večerní' ? '3 800 Kč' : '1 954 Kč'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <button type="button" onClick={() => setAdultStep(2)} className="btn" style={{ background: '#f1f1f1', color: '#333', padding: '14px 24px', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ margin: 0 }}>arrow_back</span>
                          </button>
                          <button type="submit" className="btn summer-submit-btn" disabled={isAdultSubmitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1, margin: 0 }}>
                            {isAdultSubmitting ? 'Zpracovávám...' : (
                              <>
                                Přejít na platbu
                                <span className="material-symbols-outlined">credit_card</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              );
            })()}

            {adultStep === 4 && (
              <div className="modal-step-2" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(239, 103, 165, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--tp-pink)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--tp-pink)' }}>check_circle</span>
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Přihláška odeslána!</h2>
                <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '30px' }}>
                  Děkujeme za přihlášení. Během několika minut Vám zašleme potvrzovací e-mail s platebními údaji.
                </p>
                <button className="btn btn-primary" onClick={closeAdultModal} style={{ width: '100%', backgroundColor: 'var(--tp-pink)', border: 'none' }}>Zavřít</button>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
};

export default SummerProgramPage;
