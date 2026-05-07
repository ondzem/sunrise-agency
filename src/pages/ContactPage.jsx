import React, { useRef, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ContactPage.css';

gsap.registerPlugin(ScrollTrigger);

const ContactPage = () => {
  const container = useRef(null);
  const location = useLocation();

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' nebo 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (location.hash === '#formular') {
      setTimeout(() => {
        const element = document.getElementById('formular');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500); // Wait for GSAP animations to complete
    }
  }, [location]);

  useGSAP(() => {
    // FOUC prevence
    gsap.set('.contact-hero-content > *', { opacity: 0, y: 30 });
    gsap.set('.contact-banner', { opacity: 0, y: 40 });
    gsap.set('.contact-info-card, .contact-map-card', { opacity: 0, x: -30 });
    gsap.set('.contact-form-card', { opacity: 0, x: 30 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
    
    tl.to('.contact-hero-content > *', {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      delay: 0.1
    })
    .to('.contact-banner', {
      opacity: 1,
      y: 0,
    }, "-=0.8")
    .to(['.contact-info-card', '.contact-map-card'], {
      opacity: 1,
      x: 0,
      stagger: 0.2,
    }, "-=1.0")
    .to('.contact-form-card', {
      opacity: 1,
      x: 0,
    }, "-=1.2");

  }, { scope: container });

  return (
    <main className="contact-page" ref={container}>
      <div className="contact-organic-bg"></div>
      
      <div className="contact-container">
        {/* HERO SECTION */}
        <section className="contact-hero">
          <div className="contact-hero-content">
            <h1 className="contact-title">Spojte se s námi</h1>
            <p className="contact-subtitle">
              Máte dotaz ohledně kurzů nebo byste rádi domluvili výuku?<br/>
              Napište nám — odpovíme co nejdříve.
            </p>
          </div>
        </section>

        {/* IMAGE BANNER */}
        <section className="contact-banner">
          <img src="/Pohled z venku.webp" alt="Vstup do jazykové školy SUNRISE" className="contact-banner-img" fetchpriority="high" loading="eager" />
          <div className="contact-banner-overlay"></div>
          <div className="contact-banner-pill">
            <span className="material-symbols-outlined">school</span>
            Naše škola
          </div>
        </section>

        {/* MAIN CONTENT GRID */}
        <section className="contact-grid">
          
          {/* LEFT COLUMN: INFO & MAP */}
          <div className="contact-left-col">
            
            {/* INFO CARD */}
            <div className="contact-info-card card-shadow">
              <h3 className="card-section-title">KONTAKTNÍ ÚDAJE</h3>
              
              <div className="info-list">
                <div className="info-item">
                  <div className="info-icon">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div className="info-content">
                    <span className="info-label">Adresa</span>
                    <strong className="info-value">Jana Palacha 1638, Pardubice</strong>
                    <span className="info-subvalue">530 02 Pardubice - Zelené Předměstí</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div className="info-content">
                    <span className="info-label">E-mail</span>
                    <strong className="info-value"><a href="mailto:info@sunrise-la.cz">info@sunrise-la.cz</a></strong>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div className="info-content">
                    <span className="info-label">Telefon</span>
                    <strong className="info-value"><a href="tel:+420608221625">+420 608 22 16 25</a></strong>
                  </div>
                </div>
              </div>

              <div className="social-section">
                <h3 className="card-section-title">SLEDUJTE NÁS</h3>
                <div className="social-icons">
                  <a href="https://www.instagram.com/sunriselanguageagency" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="#1a1a2e" strokeWidth="1.8"/>
                      <circle cx="12" cy="12" r="4" stroke="#1a1a2e" strokeWidth="1.8"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="#1a1a2e"/>
                    </svg>
                  </a>
                  <a href="https://www.facebook.com/SunriseLanguageAgency/?ref=embed_page#" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/lucie-tomková-38b94851" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6Z" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="2" y="9" width="4" height="12" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="4" cy="4" r="2" stroke="#1a1a2e" strokeWidth="1.8"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* MAP CARD */}
            <div className="contact-map-card card-shadow">
              <iframe 
                src="https://maps.google.com/maps?q=Jana%20Palacha%201638,%20Pardubice&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa školy"
              ></iframe>
              <div className="map-overlay-content">
                <div className="map-info">
                  <strong>Jana Palacha 1638</strong>
                  <span>Pardubice</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="contact-right-col">
            <div id="formular" className="contact-form-card card-shadow">
              <h2 className="form-card-title">Napište nám zprávu</h2>
              <p className="form-card-subtitle">Odpovíme do 24 hodin.</p>
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group full-width">
                  <label>JMÉNO A PŘÍJMENÍ *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Jan Novák" required onInvalid={(e) => e.target.setCustomValidity('Vyplňte prosím toto pole.')} onInput={(e) => e.target.setCustomValidity('')} />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>E-MAIL *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="jan@email.cz" required onInvalid={(e) => e.target.setCustomValidity('Vyplňte prosím platný e-mail.')} onInput={(e) => e.target.setCustomValidity('')} />
                  </div>
                  <div className="form-group">
                    <label>TELEFON</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+420 123 456 789" />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>VAŠE ZPRÁVA *</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} rows="6" placeholder="Jak vám můžeme pomoci?" required onInvalid={(e) => e.target.setCustomValidity('Vyplňte prosím toto pole.')} onInput={(e) => e.target.setCustomValidity('')}></textarea>
                </div>

                <div className="form-group checkbox-group full-width" style={{ marginTop: '-8px', marginBottom: '24px' }}>
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <input type="checkbox" required className="custom-checkbox" onInvalid={(e) => e.target.setCustomValidity('Zaškrtněte prosím toto pole, abyste mohli pokračovat.')} onInput={(e) => e.target.setCustomValidity('')} />
                    <span style={{ flex: 1 }}>Souhlasím s <Link to="/obchodni-podminky" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Obchodními podmínkami</Link> a <Link to="/ochrana-osobnich-udaju" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Zásadami ochrany osobních údajů</Link> *</span>
                  </label>
                </div>

                {submitStatus === 'success' && (
                  <div style={{ padding: '15px', backgroundColor: '#e6f4ea', color: '#1C9C73', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
                    Zpráva byla úspěšně odeslána. Brzy se vám ozveme!
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div style={{ padding: '15px', backgroundColor: '#fce8e6', color: '#d32f2f', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
                    Něco se pokazilo. Zkuste to prosím znovu nebo nám napište e-mail přímo.
                  </div>
                )}

                <button type="submit" className="btn btn-primary form-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Odesílání...' : 'Odeslat zprávu →'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactPage;
