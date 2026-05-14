import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TermsPage.css';

const PaymentMethodsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-page">
      <div className="terms-container">
        <div className="terms-header">
          <h1>Doprava a platba</h1>
          <p className="terms-intro">
            Informace o způsobech platby a poskytovateli platební brány.
          </p>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2>Poskytovatel platební brány</h2>
            <p>
              Online platby pro nás zajišťuje platební brána <strong>Comgate, a.s.</strong><br />
              <a href="https://www.comgate.eu/cs/platebni-brana" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>https://www.comgate.eu/cs/platebni-brana</a>
            </p>
            <p>
              Poskytovatel služby, společnost Comgate, a.s., je licencovaná Platební instituce působící pod dohledem České národní banky. Platby probíhající skrze platební bránu jsou plně zabezpečeny a veškeré informace jsou šifrovány.
            </p>
          </section>

          <section className="terms-section">
            <h2>Dostupné platební metody</h2>
            
            <h3>Platba kartou</h3>
            <p>Nejrychlejší způsob zaplacení online. Do rozhraní platební brány Comgate zadáte číslo karty, datum platnosti a CVC kód – tři čísla, která najdete v podpisovém proužku na zadní straně karty. Vše je zabezpečeno standardem 3D Secure, a tak budete nejspíš požádáni o zadání číselného kódu, který obdržíte SMSkou od své banky.</p>
            <p>
              <a href="https://help.comgate.cz/v1/docs/cs/platby-kartou" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>Více informací o platbě kartou</a>
            </p>

            <h3>Platba bankovním převodem</h3>
            <p>Okamžitá platba prostřednictvím internetového bankovnictví. Platební brána Comgate vás přesměruje do vašeho internetového bankovnictví, kam se přihlásíte jako obvykle a zde potvrdíte už připravený platební příkaz.</p>
            <p>
              Po dokončení platby budete přesměrováni zpět na náš web. Platba je potvrzena okamžitě, budeme bez odkladu pokračovat v realizaci rezervace či objednávky.
            </p>
            <p>
              <a href="https://help.comgate.cz/docs/bankovni-prevody" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>Více informací o bankovních převodech</a>
            </p>
          </section>

          <section className="terms-section">
            <h2>Kontaktní údaje pro případné reklamace nebo dotazy k platbám</h2>
            <p>
              <strong>Comgate, a.s.</strong><br />
              Gočárova třída 1754 / 48b, Hradec Králové<br />
              E-mail: <a href="mailto:podpora@comgate.cz" style={{ color: 'var(--color-primary)' }}>podpora@comgate.cz</a><br />
              Tel: <a href="tel:+420228224267" style={{ color: 'inherit', textDecoration: 'none' }}>+420 228 224 267</a>
            </p>
          </section>

          <section className="terms-section">
            <h2>Doprava</h2>
            <p>
              Vzhledem k charakteru poskytovaných služeb (výuka jazyků prezenčně nebo online) není fyzická doprava zboží účtována ani aplikována.
            </p>
          </section>
        </div>

        <div className="terms-footer">
          <Link to="/" className="btn btn-primary terms-back-btn">
            <span className="material-symbols-outlined">arrow_back</span>
            Zpět na úvodní stránku
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
