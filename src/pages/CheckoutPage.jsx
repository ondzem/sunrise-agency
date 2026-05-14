import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  
  // State from previous page
  const { source, title, priceText, details, term, siblingPriceText } = state;

  const [formData, setFormData] = useState({
    // Společné
    email: '',
    phone: '',
    note: '',
    gdpr: false,
    
    // Fakturační adresa (nové - společné)
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    zipCode: '',
    
    // Pro dospělé (kurzy, online, dospělí letní program)
    // jméno a příjmení už máme z fakturační adresy, ale necháme to tam sjednocené
    
    // Pro děti (english club, letní tábor)
    childName: '',
    childAge: '',
    nickname: '',
    parentPhone: '',
    parentEmail: '',
    hasSibling: false,
    siblingName: '',
    siblingAge: '',
    photoConsent: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect back to home if accessed directly without state
    if (!source || !title) {
      navigate('/');
    }
    window.scrollTo(0, 0);
  }, [source, title, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Základní validace vždy
    if (!formData.firstName.trim()) newErrors.firstName = 'Zadejte jméno.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Zadejte příjmení.';
    if (!formData.street.trim()) newErrors.street = 'Zadejte ulici a číslo popisné.';
    if (!formData.city.trim()) newErrors.city = 'Zadejte město.';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zadejte PSČ.';
    if (!formData.gdpr) newErrors.gdpr = 'Musíte souhlasit s obchodními podmínkami a GDPR.';

    // Validace podle zdroje
    if (source === 'summer_kids' || source === 'english_club') {
      if (!formData.childName.trim()) newErrors.childName = 'Zadejte jméno dítěte.';
      if (!formData.childAge) newErrors.childAge = 'Zadejte věk dítěte.';
      if (!formData.parentEmail.trim()) newErrors.parentEmail = 'Zadejte e-mail.';
      if (formData.hasSibling) {
        if (!formData.siblingName.trim()) newErrors.siblingName = 'Zadejte jméno sourozence.';
        if (!formData.siblingAge) newErrors.siblingAge = 'Zadejte věk sourozence.';
      }
    } else {
      // Dospělí a klasické kurzy
      if (!formData.email.trim()) newErrors.email = 'Zadejte e-mail.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Extrakce číselné hodnoty z textu ceny (např. "4 500 Kč" -> 4500)
      let numericPrice = parseInt(priceText.replace(/\D/g, ''), 10);
      if (formData.hasSibling && siblingPriceText) {
        numericPrice += parseInt(siblingPriceText.replace(/\D/g, ''), 10);
      }
      const userEmail = (source === 'summer_kids' || source === 'english_club') ? formData.parentEmail : formData.email;

      const response = await fetch('/.netlify/functions/create-comgate-payment', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          price: numericPrice,
          email: userEmail,
          firstName: formData.firstName,
          lastName: formData.lastName
        }) 
      });
      
      let data;
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        console.error("Odpověď ze serveru nebyla ve formátu JSON:", textResponse);
        throw new Error('Chyba serveru: ' + (textResponse || 'Prázdná odpověď'));
      }

      if (response.ok && data.redirectUrl) {
        // Uložíme data do localStorage pro případné odeslání potvrzovacího e-mailu po úspěšném návratu
        localStorage.setItem('pendingOrder', JSON.stringify({
          orderId: data.orderId,
          formData: formData,
          orderInfo: state
        }));

        // Přesměrování na platební bránu Comgate
        window.location.href = data.redirectUrl;
      } else {
        throw new Error(data.error || 'Nepodařilo se spojit s platební bránou.');
      }
      
    } catch (err) {
      console.error('Chyba při vytvoření platby:', err);
      alert('Omlouváme se, při vytváření platby došlo k chybě. Zkuste to prosím znovu.\\nDetail: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!source || !title) return null;

  const isKidsProgram = source === 'summer_kids' || source === 'english_club';

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        
        <div className="checkout-header">
          <h1>Dokončení objednávky</h1>
          <p>Vyplňte potřebné údaje a přejděte k bezpečné online platbě.</p>
        </div>

        <form className="checkout-content" onSubmit={handleCheckout} noValidate>
          
          {/* LEVÁ STRANA - FORMULÁŘ */}
          <div className="checkout-left">
            
            {/* Osobní údaje nebo Údaje o dítěti */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                {isKidsProgram ? 'Údaje o dítěti a rodičích' : 'Kontaktní údaje'}
              </h2>
              
              {isKidsProgram ? (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Jméno dítěte *</label>
                      <input type="text" name="childName" value={formData.childName} onChange={handleChange} className={errors.childName ? 'input-error' : ''} />
                      {errors.childName && <div className="custom-form-error">{errors.childName}</div>}
                    </div>
                    <div className="form-group">
                      <label>Věk dítěte *</label>
                      <input type="number" name="childAge" value={formData.childAge} onChange={handleChange} className={errors.childAge ? 'input-error' : ''} />
                      {errors.childAge && <div className="custom-form-error">{errors.childAge}</div>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Oblíbené oslovení dítěte (volitelné)</label>
                    <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="Např. Kubík, Terezka" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>E-mail rodiče *</label>
                      <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className={errors.parentEmail ? 'input-error' : ''} />
                      {errors.parentEmail && <div className="custom-form-error">{errors.parentEmail}</div>}
                    </div>
                    <div className="form-group">
                      <label>Telefon na rodiče (volitelné)</label>
                      <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} className={errors.parentPhone ? 'input-error' : ''} />
                      {errors.parentPhone && <div className="custom-form-error">{errors.parentPhone}</div>}
                    </div>
                  </div>

                  <div className="form-group-checkbox" style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <label>
                      <input type="checkbox" name="hasSibling" checked={formData.hasSibling} onChange={handleChange} />
                      Chci přihlásit i sourozence
                    </label>
                  </div>

                  {formData.hasSibling && (
                    <div className="form-row" style={{ background: '#f1f5f9', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                      <div className="form-group">
                        <label>Jméno sourozence *</label>
                        <input type="text" name="siblingName" value={formData.siblingName} onChange={handleChange} className={errors.siblingName ? 'input-error' : ''} />
                        {errors.siblingName && <div className="custom-form-error">{errors.siblingName}</div>}
                      </div>
                      <div className="form-group">
                        <label>Věk sourozence *</label>
                        <input type="number" name="siblingAge" value={formData.siblingAge} onChange={handleChange} className={errors.siblingAge ? 'input-error' : ''} />
                        {errors.siblingAge && <div className="custom-form-error">{errors.siblingAge}</div>}
                      </div>
                    </div>
                  )}
                  
                  {source === 'summer_kids' && (
                    <div className="form-group-checkbox">
                      <label>
                        <input type="checkbox" name="photoConsent" checked={formData.photoConsent} onChange={handleChange} />
                        Souhlasím s pořizováním a zveřejňováním fotografií z tábora
                      </label>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>E-mail *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'input-error' : ''} />
                      {errors.email && <div className="custom-form-error">{errors.email}</div>}
                    </div>
                    <div className="form-group">
                      <label>Telefon (volitelné)</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={errors.phone ? 'input-error' : ''} />
                      {errors.phone && <div className="custom-form-error">{errors.phone}</div>}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Fakturační údaje */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">Fakturační údaje</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Jméno *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'input-error' : ''} />
                  {errors.firstName && <div className="custom-form-error">{errors.firstName}</div>}
                </div>
                <div className="form-group">
                  <label>Příjmení *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'input-error' : ''} />
                  {errors.lastName && <div className="custom-form-error">{errors.lastName}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Ulice a číslo popisné *</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} className={errors.street ? 'input-error' : ''} />
                {errors.street && <div className="custom-form-error">{errors.street}</div>}
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Město *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'input-error' : ''} />
                  {errors.city && <div className="custom-form-error">{errors.city}</div>}
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>PSČ *</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className={errors.zipCode ? 'input-error' : ''} />
                  {errors.zipCode && <div className="custom-form-error">{errors.zipCode}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Poznámka k objednávce (volitelné)</label>
                <textarea name="note" value={formData.note} onChange={handleChange} rows="3"></textarea>
              </div>
            </div>

          </div>

          {/* PRAVÁ STRANA - SHRNUTÍ */}
          <div className="checkout-right">
            <div className="checkout-summary-box">
              <h3 className="summary-title">Shrnutí objednávky</h3>
              
              <div className="summary-item main-item">
                <div className="summary-item-name">{title}</div>
                <div className="summary-item-price">{priceText}</div>
              </div>

              {formData.hasSibling && siblingPriceText && (
                <div className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.95rem', color: '#555' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>person_add</span>
                    Sourozenec
                  </div>
                  <div style={{ fontWeight: 600, color: '#333' }}>+ {siblingPriceText}</div>
                </div>
              )}
              
              {term && (
                <div className="summary-item-detail">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_month</span>
                  {term}
                </div>
              )}
              
              {details && (
                <div className="summary-item-detail">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
                  {details}
                </div>
              )}

              {isKidsProgram && (
                <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(239, 103, 165, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 103, 165, 0.1)', fontSize: '0.85rem', color: '#555', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '18px', marginTop: '2px' }}>health_and_safety</span>
                  <p style={{ margin: 0, lineHeight: 1.4 }}>
                    <strong>Onemocnělo vám dítě?</strong><br />
                    Nic se neděje. Stačí nám napsat a domluvíme se na náhradním termínu.
                  </p>
                </div>
              )}

              {/* Cena celkem */}
              <div className="summary-total">
                <span>Celkem k úhradě</span>
                <span>
                  {formData.hasSibling && siblingPriceText ? 
                    `${(parseInt(priceText.replace(/\D/g, ''), 10) + parseInt(siblingPriceText.replace(/\D/g, ''), 10)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Kč`
                    : priceText}
                </span>
              </div>

              <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(16, 143, 102, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 143, 102, 0.1)', fontSize: '0.85rem', color: '#555', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span className="material-symbols-outlined" style={{ color: '#108F66', fontSize: '18px', marginTop: '2px' }}>mark_email_read</span>
                <p style={{ margin: 0, lineHeight: 1.4 }}>
                  <strong>Shrnutí do e-mailu</strong><br />
                  Po úspěšné platbě vám obratem zašleme potvrzení objednávky včetně veškerých instrukcí na váš e-mail.
                </p>
              </div>

              {/* Způsob platby (odstraněn podle přání klienta, protože je pouze 1 možnost) */}

              <div className="form-group checkbox-group" style={{ marginTop: '30px', marginBottom: '24px' }}>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', margin: 0 }}>
                  <input type="checkbox" name="gdpr" checked={formData.gdpr} onChange={handleChange} className="custom-checkbox" />
                  <span style={{ flex: 1, fontSize: '0.9rem', lineHeight: '1.4', color: '#666', textTransform: 'none', fontWeight: 400 }}>
                    Souhlasím s <Link to="/obchodni-podminky" target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>obchodními podmínkami</Link> a <Link to="/ochrana-osobnich-udaju" target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>zpracováním osobních údajů</Link> *
                  </span>
                </label>
              </div>
              {errors.gdpr && <div className="custom-form-error" style={{ marginTop: '-15px', marginBottom: '15px', marginLeft: '28px' }}>{errors.gdpr}</div>}

              <button type="submit" className="btn btn-primary btn-pay-now" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined spinner" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span>
                    Zpracovávám...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Zaplatit a dokončit
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </span>
                )}
              </button>
              
              <div className="secure-payment-badge">
                <span className="material-symbols-outlined" style={{ color: '#108F66', fontSize: '16px' }}>lock</span>
                Bezpečná platba zaručena
              </div>
            </div>
          </div>
          
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
