import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TermsPage.css';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-page">
      <div className="terms-container">
        <div className="terms-header">
          <h1>Všeobecné obchodní podmínky</h1>
          <p className="terms-intro">
            Tyto všeobecné obchodní podmínky (dále jen „VOP“) upravují práva a povinnosti smluvních stran při poskytování lektorských služeb společností SUNRISE Language Agency, s.r.o.
          </p>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2>1. Poskytovatel služeb</h2>
            <p>
              <strong>SUNRISE Language Agency, s.r.o.</strong><br />
              IČ: 07035314<br />
              Sídlo: Dubany 106, 530 02 Dubany<br />
              E-mail: <a href="mailto:sunriselanguageagency@gmail.com">sunriselanguageagency@gmail.com</a>
            </p>
            <p>(dále jen „Poskytovatel“)</p>
          </section>

          <section className="terms-section">
            <h2>2. Charakter poskytovaných služeb</h2>
            <p>Poskytovatel zajišťuje individuální i skupinovou výuku cizích jazyků formou online nebo offline lekcí.</p>
            <p>Online výuka probíhá zejména prostřednictvím platformy Zoom nebo jiné obdobné komunikační platformy. Offline výuka probíhá na předem domluveném místě.</p>
            <p>Termíny jednotlivých lekcí jsou sjednávány individuálně po dohodě mezi Poskytovatelem a zákazníkem.</p>
            <p>Služby jsou poskytovány jako neformální vzdělávání a nepředstavují akreditovaný vzdělávací program dle zvláštních právních předpisů.</p>
          </section>

          <section className="terms-section">
            <h2>3. Objednávka a uzavření smlouvy</h2>
            <p>Objednávku služeb lze provést prostřednictvím webových stránek, e-mailové komunikace, sociálních sítí nebo jiným dohodnutým způsobem.</p>
            <p>Odesláním objednávky zákazník potvrzuje, že se seznámil s těmito VOP a souhlasí s nimi.</p>
            <p>Smluvní vztah vzniká potvrzením objednávky ze strany Poskytovatele nebo přijetím platby za objednané služby.</p>
          </section>

          <section className="terms-section">
            <h2>4. Cena služeb a platební podmínky</h2>
            <p>Cena služeb je stanovena dle aktuální nabídky, ceníku nebo individuální dohody mezi Poskytovatelem a zákazníkem.</p>
            <p>Veškeré ceny jsou uvedeny v českých korunách (CZK).</p>
            <p>Platba probíhá předem, není-li sjednáno jinak.</p>
            <p>Poskytovatel umožňuje následující způsoby platby:</p>
            <ul>
              <li>platební kartou (Visa, Mastercard),</li>
              <li>online bankovním převodem,</li>
              <li>Apple Pay,</li>
              <li>Google Pay,</li>
              <li>klasickým bankovním převodem.</li>
            </ul>
            <p>Online platby jsou zajišťovány prostřednictvím platební brány ComGate Payments, a.s.</p>
            <p>Poskytovatel vystaví zákazníkovi daňový doklad – fakturu.</p>
            <p>Náklady vzniklé zákazníkovi v souvislosti s použitím internetového připojení nebo komunikačních prostředků si zákazník hradí samostatně.</p>
          </section>

          <section className="terms-section">
            <h2>5. Organizace výuky</h2>
            <p>Zákazník odpovídá za to, že má pro online výuku k dispozici:</p>
            <ul>
              <li>funkční internetové připojení,</li>
              <li>vhodné technické zařízení,</li>
              <li>funkční mikrofon a případně kameru.</li>
            </ul>
            <p>V případě technických problémů na straně zákazníka nevzniká automaticky nárok na náhradní lekci.</p>
            <p>Pokud dojde k technickému problému na straně Poskytovatele, bude zákazníkovi nabídnut náhradní termín lekce.</p>
          </section>

          <section className="terms-section">
            <h2>6. Storno podmínky a omluvy</h2>
            
            <h3>Individuální výuka</h3>
            <p>Zákazník se může z lekce omluvit nejpozději 24 hodin před jejím začátkem. V takovém případě bude sjednán náhradní termín.</p>
            <p>Při pozdější omluvě lekce propadá bez nároku na náhradu, pokud se smluvní strany nedohodnou jinak.</p>
            <p>Ve výjimečných případech, zejména při doložené nemoci nebo jiné závažné překážce, může Poskytovatel rozhodnout individuálně.</p>
            
            <h3>English Club</h3>
            <p>Účast na English Clubu lze zrušit i v den konání akce. Zákazník si následně může vybrat jiný termín dle aktuální nabídky.</p>
            
            <h3>Platnost balíčků</h3>
            <p>Balíček „10 lekcí SUNRISE online“ je platný po dobu 3 měsíců od absolvování první lekce, není-li uvedeno jinak.</p>
          </section>

          <section className="terms-section">
            <h2>7. Odstoupení od smlouvy</h2>
            <p>Zákazník, který je spotřebitelem, má právo odstoupit od smlouvy uzavřené distančním způsobem do 14 dnů ode dne uzavření smlouvy.</p>
            <p>Pokud však zákazník výslovně souhlasí se zahájením poskytování služby před uplynutím této lhůty, bere na vědomí, že po úplném poskytnutí služby ztrácí právo na odstoupení od smlouvy dle § 1837 občanského zákoníku.</p>
            <p>Nad rámec zákonných povinností poskytuje Poskytovatel garanci spokojenosti. Zákazník může požádat o vrácení poměrné části ceny až do okamžiku ukončení druhé odučené lekce.</p>
          </section>

          <section className="terms-section">
            <h2>8. Reklamace</h2>
            <p>Pokud služba neproběhne z důvodů na straně Poskytovatele, má zákazník nárok na náhradní lekci nebo jinou přiměřenou kompenzaci.</p>
            <p>Reklamaci lze uplatnit prostřednictvím e-mailu uvedeného v těchto VOP.</p>
            <p>Poskytovatel se zavazuje vyřídit reklamaci bez zbytečného odkladu.</p>
          </section>

          <section className="terms-section">
            <h2>9. Autorská práva a výukové materiály</h2>
            <p>Veškeré výukové materiály, dokumenty, prezentace a další obsah poskytnutý zákazníkovi jsou chráněny autorským právem.</p>
            <p>Zákazník není oprávněn tyto materiály bez souhlasu Poskytovatele dále šířit, prodávat, zveřejňovat nebo poskytovat třetím osobám.</p>
          </section>

          <section className="terms-section">
            <h2>10. Ochrana osobních údajů</h2>
            <p>Ochrana osobních údajů zákazníků je upravena samostatným dokumentem „Zásady ochrany osobních údajů“.</p>
          </section>

          <section className="terms-section">
            <h2>11. Závěrečná ustanovení</h2>
            <p>Tyto VOP nabývají účinnosti dne 1. 5. 2026.</p>
            <p>Poskytovatel si vyhrazuje právo tyto VOP jednostranně měnit nebo doplňovat. Nové znění bude vždy zveřejněno na webových stránkách Poskytovatele.</p>
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

export default TermsPage;
