import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TermsPage.css'; // Sdílené styly s obchodními podmínkami

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-page">
      <div className="terms-container">
        <div className="terms-header">
          <h1>Zásady ochrany osobních údajů (GDPR)</h1>
          <p className="terms-intro">
            Společnost SUNRISE Language Agency, s.r.o. věnuje ochraně osobních údajů maximální pozornost. Tyto zásady vysvětlují, jaké osobní údaje zpracováváme, za jakým účelem a jaká máte v souvislosti se zpracováním svých údajů práva.
          </p>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2>1. Správce osobních údajů</h2>
            <p>
              <strong>SUNRISE Language Agency, s.r.o.</strong><br />
              IČ: 07035314<br />
              Sídlo: Dubany 106, 530 02 Dubany<br />
              E-mail: <a href="mailto:sunriselanguageagency@gmail.com">sunriselanguageagency@gmail.com</a>
            </p>
            <p>(dále jen „Správce“)</p>
          </section>

          <section className="terms-section">
            <h2>2. Jaké údaje zpracováváme</h2>
            <p>Zpracováváme pouze údaje nezbytné pro poskytování našich služeb a plnění zákonných povinností.</p>
            <p>Jedná se zejména o:</p>
            <ul>
              <li>jméno a příjmení,</li>
              <li>e-mailovou adresu,</li>
              <li>telefonní číslo,</li>
              <li>fakturační údaje,</li>
              <li>informace o objednaných službách,</li>
              <li>komunikaci mezi zákazníkem a Správcem.</li>
            </ul>
            <p>V případě dětských kurzů mohou být zpracovávány také:</p>
            <ul>
              <li>věk dítěte,</li>
              <li>preferované oslovení dítěte,</li>
              <li>kontaktní údaje zákonného zástupce.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. Účely a právní základy zpracování</h2>
            <p>Osobní údaje zpracováváme za následujícími účely:</p>

            <h3>Plnění smlouvy</h3>
            <ul>
              <li>organizace a realizace jazykové výuky,</li>
              <li>komunikace se zákazníkem,</li>
              <li>rezervace termínů,</li>
              <li>zajištění online lekcí.</li>
            </ul>
            <p>Právním základem je plnění smlouvy dle čl. 6 odst. 1 písm. b) GDPR.</p>

            <h3>Plnění zákonných povinností</h3>
            <ul>
              <li>vedení účetnictví,</li>
              <li>vystavování faktur,</li>
              <li>plnění daňových povinností.</li>
            </ul>
            <p>Právním základem je plnění zákonných povinností dle čl. 6 odst. 1 písm. c) GDPR.</p>

            <h3>Oprávněný zájem</h3>
            <ul>
              <li>ochrana práv a právních nároků,</li>
              <li>evidence komunikace,</li>
              <li>základní analytika návštěvnosti webu.</li>
            </ul>
            <p>Právním základem je oprávněný zájem Správce dle čl. 6 odst. 1 písm. f) GDPR.</p>

            <h3>Marketingová komunikace</h3>
            <p>Pokud k tomu zákazník udělí souhlas nebo pokud to umožňují právní předpisy, může Správce zasílat obchodní sdělení týkající se svých služeb.</p>
            <p>Souhlas lze kdykoliv odvolat.</p>
          </section>

          <section className="terms-section">
            <h2>4. Komu mohou být údaje zpřístupněny</h2>
            <p>Osobní údaje mohou být zpřístupněny pouze osobám nezbytným pro zajištění provozu služeb.</p>
            <p>Jedná se zejména o:</p>
            <ul>
              <li>ComGate Payments, a.s. – zpracování plateb,</li>
              <li>externí lektoři spolupracující se Správcem,</li>
              <li>externí účetní nebo účetní kancelář,</li>
              <li>poskytovatelé hostingu a databázových služeb,</li>
              <li>technologičtí partneři zajišťující provoz webu a online výuky.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Přenos údajů mimo Evropskou unii</h2>
            <p>Některé používané služby (například Google nebo Zoom) mohou ukládat nebo zpracovávat data mimo Evropskou unii.</p>
            <p>V takových případech jsou osobní údaje chráněny prostřednictvím standardních smluvních doložek nebo jiných mechanismů ochrany v souladu s GDPR.</p>
          </section>

          <section className="terms-section">
            <h2>6. Doba uchování údajů</h2>
            <p>Osobní údaje uchováváme pouze po dobu nezbytně nutnou.</p>
            <p>Účetní a daňové doklady uchováváme po dobu stanovenou právními předpisy, zpravidla po dobu 10 let.</p>
            <p>Údaje související s marketingovou komunikací uchováváme do odvolání souhlasu nebo vznesení námitky.</p>
          </section>

          <section className="terms-section">
            <h2>7. Vaše práva</h2>
            <p>Máte právo:</p>
            <ul>
              <li>požadovat přístup ke svým osobním údajům,</li>
              <li>požadovat opravu nepřesných údajů,</li>
              <li>požadovat výmaz osobních údajů,</li>
              <li>požadovat omezení zpracování,</li>
              <li>vznést námitku proti zpracování,</li>
              <li>získat kopii svých údajů,</li>
              <li>podat stížnost u Úřadu pro ochranu osobních údajů.</li>
            </ul>
            <p>Své požadavky můžete zaslat na e-mail správce uvedený výše.</p>
          </section>

          <section className="terms-section">
            <h2>8. Cookies</h2>
            <p>Webové stránky používají technické cookies nezbytné pro správné fungování webu.</p>
            <p>Dále mohou být používány analytické nástroje, například Google Analytics, za účelem měření návštěvnosti a zlepšování služeb.</p>
            <p>V případě používání analytických nebo marketingových cookies může být uživatel požádán o udělení souhlasu prostřednictvím cookie lišty.</p>
          </section>

          <section className="terms-section">
            <h2>9. Zabezpečení osobních údajů</h2>
            <p>Správce přijal přiměřená technická a organizační opatření k zabezpečení osobních údajů proti ztrátě, zneužití nebo neoprávněnému přístupu.</p>
          </section>

          <section className="terms-section">
            <h2>10. Závěrečná ustanovení</h2>
            <p>Tyto zásady ochrany osobních údajů jsou účinné od 1. 5. 2026.</p>
            <p>Správce si vyhrazuje právo tyto zásady aktualizovat nebo měnit. Aktuální verze bude vždy zveřejněna na webových stránkách.</p>
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

export default PrivacyPage;
