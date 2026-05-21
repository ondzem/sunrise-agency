import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import './CheckoutPage.css'; // Můžeme využít stejné styly pro layout

const sendPurchaseEvent = (orderData) => {
  const consentRaw = localStorage.getItem('sunrise_cookie_consent');
  if (consentRaw) {
    try {
      const consent = JSON.parse(consentRaw);
      if (consent.analytics) {
        const priceText = orderData.orderInfo?.priceText || '0';
        const numericPrice = parseInt(priceText.replace(/\D/g, ''), 10) || 0;
        const TRACKING_ID = "G-F082292T4E";

        if (!ReactGA.isInitialized) {
          ReactGA.initialize(TRACKING_ID);
        }

        ReactGA.event("purchase", {
          transaction_id: orderData.orderId || `ORD-${Date.now()}`,
          value: numericPrice,
          currency: "CZK",
          items: [
            {
              item_id: orderData.orderInfo?.source || "course",
              item_name: orderData.orderInfo?.title || "Jazykový kurz",
              price: numericPrice,
              quantity: 1
            }
          ]
        });
        console.log('GA4 purchase event sent:', numericPrice);
      }
    } catch (e) {
      console.error('Chyba při odesílání GA4 purchase události:', e);
    }
  }
};

const SuccessPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Zkusíme najít rozpracovanou objednávku v localStorage
    const pendingOrderStr = localStorage.getItem('pendingOrder');
    
    if (pendingOrderStr) {
      try {
        const orderData = JSON.parse(pendingOrderStr);
        
        // Sestavení dat pro odeslání e-mailu
        const emailPayload = {
          customerEmail: (orderData.orderInfo?.source === 'summer_kids' || orderData.orderInfo?.source === 'english_club') 
                         ? orderData.formData?.parentEmail 
                         : orderData.formData?.email,
          customerName: `${orderData.formData?.firstName || ''} ${orderData.formData?.lastName || ''}`.trim(),
          serviceName: orderData.orderInfo?.title || 'Jazykový kurz',
          price: orderData.orderInfo?.priceText || '',
          term: orderData.orderInfo?.term || '',
          details: orderData.orderInfo?.details || '',
          isKidsProgram: (orderData.orderInfo?.source === 'summer_kids' || orderData.orderInfo?.source === 'english_club')
        };

        // Odeslání e-mailu přes náš existující backend
        fetch('/api/send-order-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailPayload)
        })
        .then(res => res.json())
        .then(data => {
          console.log('E-mail odeslán:', data);
          sendPurchaseEvent(orderData);
          setStatus('success');
          // Vyčistíme localStorage, aby se e-mail neposlal znovu při refreši
          localStorage.removeItem('pendingOrder');
        })
        .catch(err => {
          console.error('Chyba odesílání e-mailu:', err);
          sendPurchaseEvent(orderData);
          setStatus('success'); // Přesto ukážeme úspěch platby
          localStorage.removeItem('pendingOrder');
        });

      } catch (err) {
        console.error('Chyba při zpracování dat objednávky:', err);
        setStatus('success');
      }
    } else {
      // Pokud tu uživatel je, ale v localStorage nic není (např. refreš stránky)
      setStatus('success');
    }
  }, [navigate]);

  return (
    <main className="checkout-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="checkout-container" style={{ textAlign: 'center', maxWidth: '600px', padding: '40px 20px' }}>
        
        {status === 'processing' ? (
          <div>
            <h1 style={{ color: '#2D3748', marginBottom: '20px' }}>Zpracováváme vaši platbu...</h1>
            <p>Prosím čekejte, ověřujeme platbu a připravujeme potvrzovací e-mail.</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
            <h1 style={{ color: '#EF67A5', fontSize: '2.5rem', marginBottom: '20px' }}>Děkujeme za vaši platbu!</h1>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '30px' }}>
              Vaše platba a rezervace kurzu proběhla úspěšně. Do několika minut vám na e-mail dorazí <strong>potvrzení s dalšími informacemi a instrukcemi</strong>.
            </p>
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                Pokud e-mail nenajdete v doručené poště, zkontrolujte prosím i složku Hromadné nebo Spam.
              </p>
            </div>
            <Link to="/" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', display: 'inline-block' }}>
              Zpět na hlavní stránku
            </Link>
          </div>
        )}

      </div>
    </main>
  );
};

export default SuccessPage;
