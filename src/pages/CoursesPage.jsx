import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomModal from '../components/CustomModal';
import './CoursesPage.css';

gsap.registerPlugin(ScrollTrigger);
const createKidsDesc = (perex, jakVyukaProbiha, coSeNauci, vysledek) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <p style={{ margin: 0 }}>{perex}</p>
    <details style={{ background: 'rgba(28, 156, 115, 0.03)', borderRadius: '8px', border: '1px solid rgba(28, 156, 115, 0.1)', cursor: 'pointer' }}>
      <summary style={{ padding: '12px 16px', fontWeight: '600', color: '#1C9C73', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
        Zjistit, co kurz obsahuje
      </summary>
      <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid rgba(28, 156, 115, 0.1)', marginTop: '4px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px', cursor: 'auto' }}>
        {jakVyukaProbiha && (
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Jak výuka probíhá</h4>
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
              {jakVyukaProbiha}
            </div>
          </div>
        )}
        {coSeNauci && (
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Co se děti naučí</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              {coSeNauci.map((item, idx) => (
                <div key={idx} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#1C9C73', marginTop: '2px', flexShrink: 0 }}>check_circle</span>
                  <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.4' }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {vysledek && (
          <div style={{ background: 'rgba(28, 156, 115, 0.05)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #1C9C73', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#1C9C73', fontSize: '20px' }}>emoji_events</span>
              <strong style={{ color: '#222' }}>Výsledek</strong>
            </div>
            <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>{vysledek}</p>
          </div>
        )}
      </div>
    </details>
  </div>
);

const createAdultsDesc = (perex, jakVyukaProbiha, coSeNauci, vysledek) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <p style={{ margin: 0 }}>{perex}</p>
    <details style={{ background: 'rgba(30, 58, 138, 0.03)', borderRadius: '8px', border: '1px solid rgba(30, 58, 138, 0.1)', cursor: 'pointer' }}>
      <summary style={{ padding: '12px 16px', fontWeight: '600', color: '#1E3A8A', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
        Zjistit, co kurz obsahuje
      </summary>
      <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid rgba(30, 58, 138, 0.1)', marginTop: '4px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px', cursor: 'auto' }}>
        {jakVyukaProbiha && (
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Jak výuka probíhá</h4>
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
              {jakVyukaProbiha}
            </div>
          </div>
        )}
        {coSeNauci && (
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Co Vás čeká</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              {coSeNauci.map((item, idx) => (
                <div key={idx} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#1E3A8A', marginTop: '2px', flexShrink: 0 }}>check_circle</span>
                  <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.4' }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {vysledek && (
          <div style={{ background: 'rgba(30, 58, 138, 0.05)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #1E3A8A', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#1E3A8A', fontSize: '20px' }}>emoji_events</span>
              <strong style={{ color: '#222' }}>Výsledek</strong>
            </div>
            <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>{vysledek}</p>
          </div>
        )}
      </div>
    </details>
  </div>
);

const coursesData = [
  // PRO DĚTI A TEENS
  {
    id: 'c_kids_1',
    category: 'Pro děti a teens',
    title: 'English club',
    price: '700 Kč',
    isOnline: false,
    desc: 'Hravá angličtina pro ty nejmenší i starší děti formou her a zábavy.',
    options: [
      { id: 'opt_1', title: 'for Children (2-6 let)', time: 'Pá 8:00 - 12:00 hod', price: '700 Kč', isOnline: false },
      { id: 'opt_2', title: 'for Little pupils (7-10 let)', time: 'St 14:00 - 16:00 hod', price: '700 Kč', isOnline: false },
      { id: 'opt_3', title: 'For older pupils (11-14 let)', time: 'Čt a Pá 14:00 - 16:00 hod', price: '700 Kč', isOnline: false }
    ]
  },
  {
    id: 'c_kids_2',
    category: 'Pro děti a teens',
    title: 'Angličtina',
    price: 'Od 3 650 Kč',
    isOnline: null,
    desc: 'Strukturovaná výuka i konverzační kurzy pro děti a mládež.',
    options: [
      { id: 'opt_4', title: 'Angličtina s učebnicí (děti 7–10 let) (SUNRISE Place)', time: 'St 17:00–18:00', price: '3 650 Kč', isOnline: false, desc: createKidsDesc(
        <><span style={{fontWeight:'700'}}>Tento kurz je zaměřený na systematické a dlouhodobé budování angličtiny</span>, aby děti jazyku opravdu rozuměly a dokázaly ho používat ve všech situacích.</>,
        'Lekce jsou vedené podle moderní učebnice, která je doplněná o interaktivní aktivity, hry, videa a poslechy. Děti se postupně seznamují s gramatikou, kterou si ihned procvičují v praxi – nejen v psané formě, ale i při mluvení.',
        ['porozumět základním i pokročilejším gramatickým strukturám', 'aktivně používat novou slovní zásobu', 'rozumět mluvenému slovu (poslechy, videa)', 'vyjadřovat se v jednoduchých i složitějších větách', 'číst a psát přiměřeně své úrovni'],
        'Děti získají pevný základ jazyka, na kterém mohou dál stavět – ve škole i v reálném životě.'
      ) },
      { id: 'opt_5', title: 'Angličtina konverzace (teens 11–14 let) (SUNRISE Place)', time: 'St 16:00–17:00', price: '3 650 Kč', isOnline: false, desc: createKidsDesc(
        <><span style={{fontWeight:'700'}}>Kurz zaměřený na mluvení, pohotovou reakci a odbourání strachu z angličtiny.</span></>,
        'Lekce probíhají interaktivně, často formou her, diskuzí a modelových situací. Děti mluví většinu času a učí se reagovat přirozeně, bez překládání v hlavě.',
        ['reagovat na běžné otázky a situace', 'vyjádřit svůj názor a zapojit se do rozhovoru', 'používat jazyk v každodenních situacích (škola, kamarádi, cestování)', 'rozšířit si aktivní slovní zásobu'],
        'Děti se rozmluví, získají jistotu a přestanou se bát mluvit anglicky.'
      ) },
      { id: 'opt_6', title: 'Angličtina konverzace (teens 11–14 let) (Online)', time: 'Po 17:00–18:00', price: '3 650 Kč', isOnline: true, desc: createKidsDesc(
        <><span style={{fontWeight:'700'}}>Kurz zaměřený na mluvení, pohotovou reakci a odbourání strachu z angličtiny.</span></>,
        'Lekce probíhají interaktivně, často formou her, diskuzí a modelových situací. Děti mluví většinu času a učí se reagovat přirozeně, bez překládání v hlavě.',
        ['reagovat na běžné otázky a situace', 'vyjádřit svůj názor a zapojit se do rozhovoru', 'používat jazyk v každodenních situacích (škola, kamarádi, cestování)', 'rozšířit si aktivní slovní zásobu'],
        'Děti se rozmluví, získají jistotu a přestanou se bát mluvit anglicky.'
      ) },
      { id: 'opt_7', title: 'Angličtina konverzace (teens 15–18 let) (SUNRISE Place)', time: 'Út 18:00–19:00', price: '3 650 Kč', isOnline: false, desc: createKidsDesc(
        <><span style={{fontWeight:'700'}}>Kurz zaměřený na mluvení, pohotovou reakci a odbourání strachu z angličtiny.</span></>,
        'Lekce probíhají interaktivně, často formou her, diskuzí a modelových situací. Děti mluví většinu času a učí se reagovat přirozeně, bez překládání v hlavě.',
        ['reagovat na běžné otázky a situace', 'vyjádřit svůj názor a zapojit se do rozhovoru', 'používat jazyk v každodenních situacích (škola, kamarádi, cestování)', 'rozšířit si aktivní slovní zásobu'],
        'Děti se rozmluví, získají jistotu a přestanou se bát mluvit anglicky.'
      ) },
      { id: 'opt_8', title: 'Angličtina konverzace (teens 15–18 let) (Online)', time: 'Po 18:00–19:00', price: '3 650 Kč', isOnline: true, desc: createKidsDesc(
        <><span style={{fontWeight:'700'}}>Kurz zaměřený na mluvení, pohotovou reakci a odbourání strachu z angličtiny.</span></>,
        'Lekce probíhají interaktivně, často formou her, diskuzí a modelových situací. Děti mluví většinu času a učí se reagovat přirozeně, bez překládání v hlavě.',
        ['reagovat na běžné otázky a situace', 'vyjádřit svůj názor a zapojit se do rozhovoru', 'používat jazyk v každodenních situacích (škola, kamarádi, cestování)', 'rozšířit si aktivní slovní zásobu'],
        'Děti se rozmluví, získají jistotu a přestanou se bát mluvit anglicky.'
      ) }
    ]
  },
  {
    id: 'c_kids_5',
    category: 'Pro děti a teens',
    title: 'Francouzština',
    price: '3 650 Kč',
    isOnline: false,
    desc: 'Základy francouzštiny hravou a přirozenou formou pro děti a dospívající.',
    modalDesc: createKidsDesc(
      <><span style={{fontWeight:'700'}}>Tento jazykový kurz je zaměřený na postupné a přirozené osvojení cizího jazyka</span> tak, aby mu děti nejen rozuměly, ale dokázaly ho i aktivně používat.</>,
      'Výuka kombinuje vysvětlení nových témat s praktickým procvičováním. Děti se učí novou slovní zásobu, základní gramatiku a zároveň ji ihned používají v jednoduchých větách a konverzacích. Lekce jsou doplněné o hry, aktivity a další interaktivní prvky, které pomáhají udržet pozornost a motivaci.',
      ['základní slovní zásobu a každodenní fráze', 'správnou výslovnost a porozumění mluvenému slovu', 'jednoduchou gramatiku v praxi', 'tvořit věty a zapojit se do základní komunikace'],
      'Dítě si osvojí pevné základy jazyka, získá jistotu v jeho používání a pozitivní vztah k dalšímu učení.'
    ),
    options: [
      { id: 'opt_11', title: 'Francouzština (teens 11–14 let)', time: 'Út 17:00–18:00', price: '3 650 Kč', isOnline: false }
    ]
  },
  {
    id: 'c_kids_4',
    category: 'Pro děti a teens',
    title: 'Němčina',
    price: '3 650 Kč',
    isOnline: false,
    desc: 'Zábavná a interaktivní výuka němčiny pro děti školního věku.',
    modalDesc: createKidsDesc(
      <><span style={{fontWeight:'700'}}>Tento jazykový kurz je zaměřený na postupné a přirozené osvojení cizího jazyka</span> tak, aby mu děti nejen rozuměly, ale dokázaly ho i aktivně používat.</>,
      'Výuka kombinuje vysvětlení nových témat s praktickým procvičováním. Děti se učí novou slovní zásobu, základní gramatiku a zároveň ji ihned používají v jednoduchých větách a konverzacích. Lekce jsou doplněné o hry, aktivity a další interaktivní prvky, které pomáhají udržet pozornost a motivaci.',
      ['základní slovní zásobu a každodenní fráze', 'správnou výslovnost a porozumění mluvenému slovu', 'jednoduchou gramatiku v praxi', 'tvořit věty a zapojit se do základní komunikace'],
      'Dítě si osvojí pevné základy jazyka, získá jistotu v jeho používání a pozitivní vztah k dalšímu učení.'
    ),
    options: [
      { id: 'opt_9', title: 'Němčina (teens 11–14 let)', time: 'Po 16:00–17:00', price: '3 650 Kč', isOnline: false }
    ]
  },
  {
    id: 'c_kids_7',
    category: 'Pro děti a teens',
    title: 'Ruština',
    price: '3 650 Kč',
    isOnline: false,
    desc: 'Postupné osvojování ruštiny a azbuky pro děti přirozenou cestou.',
    modalDesc: createKidsDesc(
      <><span style={{fontWeight:'700'}}>Tento jazykový kurz je zaměřený na postupné a přirozené osvojení cizího jazyka</span> tak, aby mu děti nejen rozuměly, ale dokázaly ho i aktivně používat.</>,
      'Výuka kombinuje vysvětlení nových témat s praktickým procvičováním. Děti se učí novou slovní zásobu, základní gramatiku a zároveň ji ihned používají v jednoduchých větách a konverzacích. Lekce jsou doplněné o hry, aktivity a další interaktivní prvky, které pomáhají udržet pozornost a motivaci.',
      ['základní slovní zásobu a každodenní fráze', 'správnou výslovnost a porozumění mluvenému slovu', 'jednoduchou gramatiku v praxi', 'tvořit věty a zapojit se do základní komunikace'],
      'Dítě si osvojí pevné základy jazyka, získá jistotu v jeho používání a pozitivní vztah k dalšímu učení.'
    ),
    options: [
      { id: 'opt_15', title: 'Ruština (teens 11–14 let)', time: 'Po 16:00–17:00', price: '3 650 Kč', isOnline: false }
    ]
  },
  {
    id: 'c_kids_6',
    category: 'Pro děti a teens',
    title: 'Španělština',
    price: '3 650 Kč',
    isOnline: false,
    desc: 'Základy španělštiny pro děti zaměřené na aktivní používání jazyka.',
    modalDesc: createKidsDesc(
      <><span style={{fontWeight:'700'}}>Tento jazykový kurz je zaměřený na postupné a přirozené osvojení cizího jazyka</span> tak, aby mu děti nejen rozuměly, ale dokázaly ho i aktivně používat.</>,
      'Výuka kombinuje vysvětlení nových témat s praktickým procvičováním. Děti se učí novou slovní zásobu, základní gramatiku a zároveň ji ihned používají v jednoduchých větách a konverzacích. Lekce jsou doplněné o hry, aktivity a další interaktivní prvky, které pomáhají udržet pozornost a motivaci.',
      ['základní slovní zásobu a každodenní fráze', 'správnou výslovnost a porozumění mluvenému slovu', 'jednoduchou gramatiku v praxi', 'tvořit věty a zapojit se do základní komunikace'],
      'Dítě si osvojí pevné základy jazyka, získá jistotu v jeho používání a pozitivní vztah k dalšímu učení.'
    ),
    options: [
      { id: 'opt_13', title: 'Španělština (teens 11–14 let)', time: 'Čt 17:00–18:00', price: '3 650 Kč', isOnline: false }
    ]
  },
  
  // DOSPĚLÍ
  {
    id: 'c_adults_1',
    category: 'Pro dospělé',
    title: 'Angličtina',
    price: 'Od 3 750 Kč',
    isOnline: null,
    desc: 'Komplexní výuka gramatiky a slovní zásoby i konverzace pro všechny úrovně.',
    options: [
      { id: 'opt_18', title: 'Angličtina s učebnicí (mírně pokročilí) (SUNRISE Place)', time: 'St 18:00–19:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Komplexní kurz</span>, který Vás provede angličtinou od základů až po pokročilejší úroveň.</>,
        'Lekce mají jasnou strukturu – kombinují gramatiku, poslech, čtení i konverzaci. Vše si postupně vysvětlíme a ihned procvičíme v praxi.',
        ['přehledná a srozumitelná gramatika', 'poslechy a práce s reálnými situacemi', 'rozšiřování slovní zásoby', 'mluvení v bezpečném prostředí'],
        'Budete rozumět, mluvit i psát s větší jistotou a bez zbytečných chyb.'
      ) },
      { id: 'opt_19', title: 'Angličtina konverzace (SUNRISE Place)', time: 'St 19:00–20:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz pro všechny</span>, kteří chtějí konečně začít mluvit.</>,
        'Každá lekce je postavená na komunikaci – řeší se konkrétní situace, témata a scénáře z běžného života.',
        ['konverzace na aktuální i praktická témata', 'nácvik rychlých reakcí', 'rozšiřování slovní zásoby přirozenou cestou', 'minimum teorie, maximum mluvení'],
        'Získáte plynulost, jistotu a schopnost reagovat bez dlouhého přemýšlení.'
      ) },
      { id: 'opt_20', title: 'Angličtina konverzace (Online)', time: 'Po 19:00–20:00', price: '3 750 Kč', isOnline: true, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz pro všechny</span>, kteří chtějí konečně začít mluvit.</>,
        'Každá lekce je postavená na komunikaci – řeší se konkrétní situace, témata a scénáře z běžného života.',
        ['konverzace na aktuální i praktická témata', 'nácvik rychlých reakcí', 'rozšiřování slovní zásoby přirozenou cestou', 'minimum teorie, maximum mluvení'],
        'Získáte plynulost, jistotu a schopnost reagovat bez dlouhého přemýšlení.'
      ) },
      { id: 'opt_21', title: 'Angličtina intenzivní', time: 'St+Pá 8:00-12:00', price: '34 540 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz pro ty</span>, kteří chtějí rychlý a viditelný posun.</>,
        'Výuka probíhá častěji a ve vyšší intenzitě. Kombinuje všechny aspekty jazyka – gramatiku, konverzaci, poslech i praktická cvičení.',
        ['rychlejší tempo výuky', 'aktivní zapojení v každé lekci', 'důraz na okamžité použití jazyka', 'kombinace teorie a praxe'],
        'Za krátkou dobu se výrazně zlepšíte a posunete se o úroveň výš.'
      ) }
    ]
  },
  {
    id: 'c_adults_8',
    category: 'Pro dospělé',
    title: 'Čeština pro cizince',
    price: '3 750 Kč',
    isOnline: false,
    desc: 'Kurzy českého jazyka pro cizince zaměřené na plynulou komunikaci a každodenní situace.',
    options: [
      { id: 'opt_31', title: 'Začátečníci', time: 'Po 19:00–20:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz pro ty</span>, kteří s češtinou začínají od nuly.</>,
        'Výuka je systematická a opírá se o kvalitní materiály a učebnice. Krok za krokem si osvojíte základy – učíte se mluvit, poslouchat, číst i psát, s důrazem na budování nové slovní zásoby a pochopení gramatiky.',
        ['představit se a komunikovat v základních situacích', 'orientovat se v běžném životě (obchod, doprava, práce)', 'porozumět jednoduché mluvené češtině', 'číst a psát na základní úrovni'],
        'Získáte pevné základy jazyka, domluvíte se v každodenních situacích a získáte sebevědomí pro další studium.'
      ) },
      { id: 'opt_32', title: 'Pokročilí', time: 'Po 20:00–21:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz pro studenty</span>, kteří už mají základ a chtějí se posunout dál.</>,
        'Lekce mají jasnou strukturu podloženou moderní učebnicí. Výuka plynule kombinuje pokročilejší gramatiku s poslechem, čtením, psaním a především rozšiřováním slovní zásoby a aktivním mluvením.',
        ['složitější gramatika a její praktické využití', 'plynulejší vyjadřování a bohatší slovní zásoba', 'delší konverzace a diskuse na zajímavá témata', 'práce s komplexními texty a poslechy'],
        'Budete komunikovat přirozeněji, s větší jistotou a dokážete reagovat ve složitějších situacích bez zbytečných chyb.'
      ) }
    ]
  },
  {
    id: 'c_adults_5',
    category: 'Pro dospělé',
    title: 'Francouzština',
    price: '3 750 Kč',
    isOnline: false,
    desc: 'Kurzy francouzštiny pro mírně pokročilé i čistě konverzační lekce zaměřené na praxi.',
    options: [
      { id: 'opt_25', title: 'Mírně pokročilí', time: 'Út 18:00–19:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz pro studenty</span>, kteří už znají základy a chtějí jazyk rozvíjet komplexně.</>,
        'Lekce probíhají na bázi učebnice, která udává jasnou strukturu a směr. Komplexně rozvíjíme všechny dovednosti – učíte se správně mluvit, poslouchat, číst i psát. Důraz je kladen na rozšiřování slovní zásoby a gramatiku v souvislostech.',
        ['gramatika vysvětlená v reálných souvislostech', 'systematické rozšiřování slovní zásoby', 'poslech, čtení, psaní a konverzace', 'samostatné vyjádření vlastních myšlenek'],
        'Jazyk začnete lépe chápat, aktivně používat ve všech formách a výrazně se posunete v plynulosti.'
      ) },
      { id: 'opt_26', title: 'Konverzace', time: 'Út 19:00–20:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz zaměřený čistě na praxi.</span></>,
        'Odkládáme učebnice s tvrdou gramatikou a soustředíme se výhradně na komunikaci. Výuka je interaktivní a zaměřuje se na to hlavní – schopnost mluvit, pohotově reagovat na otázky, diskutovat a aktivně si rozšiřovat slovní zásobu.',
        ['mluvení a diskuse na různá aktuální témata', 'pohotové reakce na běžné i nečekané situace', 'spontánní komunikace a odbourání strachu', 'rychlé a efektivní rozšiřování aktivní slovní zásoby'],
        'Zlepšíte se hlavně v tom, co potřebujete nejvíc – získáte sebejistotu při mluvení a přestanete v hlavě překládat.'
      ) }
    ]
  },
  {
    id: 'c_adults_4',
    category: 'Pro dospělé',
    title: 'Němčina',
    price: '3 750 Kč',
    isOnline: false,
    desc: 'Kurzy němčiny pro mírně pokročilé i konverzační lekce pro jistotu v mluvení.',
    options: [
      { id: 'opt_23', title: 'Mírně pokročilí', time: 'Po 17:00–18:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz pro studenty</span>, kteří už znají základy a chtějí jazyk rozvíjet komplexně.</>,
        'Lekce probíhají na bázi učebnice, která udává jasnou strukturu a směr. Komplexně rozvíjíme všechny dovednosti – učíte se správně mluvit, poslouchat, číst i psát. Důraz je kladen na rozšiřování slovní zásoby a gramatiku v souvislostech.',
        ['gramatika vysvětlená v reálných souvislostech', 'systematické rozšiřování slovní zásoby', 'poslech, čtení, psaní a konverzace', 'samostatné vyjádření vlastních myšlenek'],
        'Jazyk začnete lépe chápat, aktivně používat ve všech formách a výrazně se posunete v plynulosti.'
      ) },
      { id: 'opt_24', title: 'Konverzace', time: 'Po 18:00–19:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz zaměřený čistě na praxi.</span></>,
        'Odkládáme učebnice s tvrdou gramatikou a soustředíme se výhradně na komunikaci. Výuka je interaktivní a zaměřuje se na to hlavní – schopnost mluvit, pohotově reagovat na otázky, diskutovat a aktivně si rozšiřovat slovní zásobu.',
        ['mluvení a diskuse na různá aktuální témata', 'pohotové reakce na běžné i nečekané situace', 'spontánní komunikace a odbourání strachu', 'rychlé a efektivní rozšiřování aktivní slovní zásoby'],
        'Zlepšíte se hlavně v tom, co potřebujete nejvíc – získáte sebejistotu při mluvení a přestanete v hlavě překládat.'
      ) }
    ]
  },
  {
    id: 'c_adults_7',
    category: 'Pro dospělé',
    title: 'Ruština',
    price: '3 750 Kč',
    isOnline: false,
    desc: 'Kurzy ruštiny pro mírně pokročilé i konverzace pro aktivní rozvoj jazyka.',
    options: [
      { id: 'opt_29', title: 'Mírně pokročilí', time: 'Po 17:00–18:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz pro studenty</span>, kteří už znají základy a chtějí jazyk rozvíjet komplexně.</>,
        'Lekce probíhají na bázi učebnice, která udává jasnou strukturu a směr. Komplexně rozvíjíme všechny dovednosti – učíte se správně mluvit, poslouchat, číst i psát. Důraz je kladen na rozšiřování slovní zásoby a gramatiku v souvislostech.',
        ['gramatika vysvětlená v reálných souvislostech', 'systematické rozšiřování slovní zásoby', 'poslech, čtení, psaní a konverzace', 'samostatné vyjádření vlastních myšlenek'],
        'Jazyk začnete lépe chápat, aktivně používat ve všech formách a výrazně se posunete v plynulosti.'
      ) },
      { id: 'opt_30', title: 'Konverzace', time: 'Po 18:00–19:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz zaměřený čistě na praxi.</span></>,
        'Odkládáme učebnice s tvrdou gramatikou a soustředíme se výhradně na komunikaci. Výuka je interaktivní a zaměřuje se na to hlavní – schopnost mluvit, pohotově reagovat na otázky, diskutovat a aktivně si rozšiřovat slovní zásobu.',
        ['mluvení a diskuse na různá aktuální témata', 'pohotové reakce na běžné i nečekané situace', 'spontánní komunikace a odbourání strachu', 'rychlé a efektivní rozšiřování aktivní slovní zásoby'],
        'Zlepšíte se hlavně v tom, co potřebujete nejvíc – získáte sebejistotu při mluvení a přestanete v hlavě překládat.'
      ) }
    ]
  },
  {
    id: 'c_adults_6',
    category: 'Pro dospělé',
    title: 'Španělština',
    price: '3 750 Kč',
    isOnline: false,
    desc: 'Kurzy španělštiny od úplných začátečníků až po pokročilé konverzace.',
    options: [
      { id: 'opt_28', title: 'Pokročilí', time: 'Čt 18:00–19:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz pro ty, kteří už španělštinu znají.</span></>,
        'Lekce mají jasnou strukturu podloženou moderní učebnicí. Výuka plynule kombinuje pokročilejší gramatiku s poslechem, čtením, psaním a především rozšiřováním slovní zásoby a aktivním mluvením.',
        ['složitější gramatika a její praktické využití', 'plynulejší vyjadřování a bohatší slovní zásoba', 'delší konverzace a diskuse na zajímavá témata', 'práce s komplexními texty a poslechy'],
        'Budete komunikovat přirozeněji, s větší jistotou a dokážete reagovat ve složitějších situacích bez zbytečných chyb.'
      ) },
      { id: 'opt_27', title: 'Začátečníci', time: 'Čt 19:00–20:00', price: '3 750 Kč', isOnline: false, desc: createAdultsDesc(
        <><span style={{fontWeight:'700'}}>Kurz pro úplné začátečníky.</span></>,
        'Výuka je systematická a opírá se o kvalitní materiály a učebnice. Krok za krokem si osvojíte základy – učíte se mluvit, poslouchat, číst i psát, s důrazem na budování nové slovní zásoby a pochopení gramatiky.',
        ['představit se a komunikovat v základních situacích', 'orientovat se v běžném životě', 'porozumět jednoduché mluvené španělštině', 'číst a psát na základní úrovni'],
        'Získáte pevné základy jazyka, domluvíte se v každodenních situacích a získáte sebevědomí pro další studium.'
      ) }
    ]
  }
];

const CourseModal = ({ course, onClose, isAdminMode, configOverrides, onConfigChange }) => {
  const courseModalRef = useRef(null);
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Výběr kurzu (Termínu), 2 = Informace o kurzu, 3 = Formulář, 4 = Success
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', note: '', gdpr: false });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studyForm, setStudyForm] = useState('prezencne');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => { 
      document.body.style.overflow = '';
      document.documentElement.style.overflow = ''; 
    };
  }, []);

  const isEnglish = course.title === 'Angličtina';
  const isAdultCategory = course.category === 'Pro dospělé';
  const isTermFirst = isEnglish || isAdultCategory;
  
  const stepTermin = isTermFirst ? 1 : 2;
  const stepInfo = isTermFirst ? 2 : 1;

  const handleProceedToCheckout = () => {
    const activeIsOnline = selectedOpt?.isOnline !== undefined ? selectedOpt.isOnline : course.isOnline;

    onClose();
    navigate('/pokladna', {
      state: {
        source: 'courses',
        title: `${course.title} - ${selectedOpt.title}`,
        term: getOptTime(selectedOpt),
        priceText: getOptPrice(selectedOpt),
        price: getOptPriceNum(selectedOpt),
        details: activeIsOnline ? 'Online výuka' : 'Prezenční výuka'
      }
    });
  };

  const handleNextTermin = () => {
    if (selectedOpt) {
      setFormErrors({});
      if (isTermFirst) {
        setStep(2);
        courseModalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleProceedToCheckout();
      }
    } else {
      setFormErrors({ term: 'Vyberte si prosím jednu z možností.' });
    }
  };

  const handleNextInfo = () => {
    if (isTermFirst) {
      handleProceedToCheckout();
    } else {
      setStep(2);
      courseModalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Prosím vyplňte jméno a příjmení.';
    if (!formData.phone.trim()) errors.phone = 'Prosím vyplňte telefon.';
    if (!formData.email.trim()) {
      errors.email = 'Prosím vyplňte svůj e-mail.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Prosím zadejte platný e-mail.';
    }
    if (!formData.gdpr) {
      errors.gdpr = 'Musíte souhlasit s obchodními podmínkami.';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 1500);
  };

  const isKids = course.category === 'Pro děti a teens';
  const themeClass = isKids ? 'accent-mint' : 'accent-navy';
  const colorTheme = isKids ? '#1C9C73' : '#1E3A8A';
  const bgTheme = isKids ? 'rgba(28, 156, 115, 0.05)' : 'rgba(30, 58, 138, 0.05)';
  const borderTheme = isKids ? 'rgba(28, 156, 115, 0.1)' : 'rgba(30, 58, 138, 0.1)';

  const activeIsOnline = selectedOpt?.isOnline !== undefined ? selectedOpt.isOnline : course.isOnline;
  const activeDesc = selectedOpt?.desc || course.modalDesc || course.desc;
  
  const getOptTime = (opt) => configOverrides[opt.id]?.time ? configOverrides[opt.id].time : opt.time;
  const getBasePrice = (opt) => configOverrides[opt.id]?.price ? configOverrides[opt.id].price : opt.price;
  const getOptLocked = (opt) => configOverrides[opt.id]?.is_locked || false;

  const getOptPrice = (opt) => {
    const basePriceStr = getBasePrice(opt);
    const discountKey = course.category === 'Pro děti a teens' ? 'discount_kids' : 'discount_adults';
    const discountStr = configOverrides[discountKey]?.price || '0';
    const discount = parseInt(discountStr, 10) || 0;
    
    if (discount > 0) {
      const numPrice = parseInt(basePriceStr.replace(/\D/g, ''), 10);
      if (!isNaN(numPrice) && numPrice > 0) {
        const newPrice = Math.round(numPrice * (1 - discount / 100));
        return `${newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Kč`;
      }
    }
    return basePriceStr;
  };

  const getOptPriceNum = (opt) => {
    const basePriceStr = getBasePrice(opt);
    const discountKey = course.category === 'Pro děti a teens' ? 'discount_kids' : 'discount_adults';
    const discountStr = configOverrides[discountKey]?.price || '0';
    const discount = parseInt(discountStr, 10) || 0;
    const numPrice = parseInt(basePriceStr?.replace(/\D/g, '') || '0', 10);
    
    if (discount > 0 && numPrice > 0) {
      return Math.round(numPrice * (1 - discount / 100));
    }
    return numPrice;
  };

  const getCourseBasePrice = () => {
    if (selectedOpt) return getOptPrice(selectedOpt);
    
    // Pokud má kurz jen jednu možnost a je to první krok (info), chceme zobrazit její cenu
    if (course.options.length === 1) {
      return getOptPrice(course.options[0]);
    }
    
    // Jinak najdeme nejmenší cenu ze všech možností (s ohledem na admin overrides)
    const prices = course.options.map(opt => {
      const priceText = getOptPrice(opt);
      const numPrice = parseInt(priceText.replace(/\D/g, ''), 10);
      return { text: priceText, num: isNaN(numPrice) ? 0 : numPrice };
    });
    
    // Pokud jsou všechny ceny stejné, vrátíme rovnou tu cenu
    const allSame = prices.every(p => p.text === prices[0].text);
    if (allSame) return prices[0].text;
    
    // Jinak vrátíme "Od nejnižší ceny"
    const minPrice = Math.min(...prices.map(p => p.num).filter(n => n > 0));
    if (minPrice && minPrice !== Infinity) {
      return `Od ${minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Kč`;
    }
    
    return course.price; // Fallback
  };

  const activePrice = getCourseBasePrice();
  
  let locationText = 'Kombinovaná výuka';
  if (activeIsOnline === true) locationText = 'Online výuka';
  if (activeIsOnline === false) locationText = 'Jana Palacha 1638, Pardubice';

  const items = activeIsOnline === true 
    ? ['počítač / tablet', 'připojení k internetu'] 
    : ['psací potřeby', 'přezůvky'];

  const occupancyStr = selectedOpt?.occupancy || "2 z 8 obsazeno";
  const match = occupancyStr.match(/(\d+)\s*z\s*(\d+)/);
  let groupOccupancy = 2;
  let groupMax = 8;
  if (match) {
    groupOccupancy = parseInt(match[1]);
    groupMax = parseInt(match[2]);
  }
  const groupPercentage = (groupOccupancy / groupMax) * 100;

  const hasOnlineOptions = course.options.some(o => o.isOnline === true);
  const hasInPersonOptions = course.options.some(o => o.isOnline === false);
  const showToggle = isEnglish && hasOnlineOptions && hasInPersonOptions;
  
  const displayedOptions = showToggle 
    ? course.options.filter(o => studyForm === 'online' ? o.isOnline === true : o.isOnline === false)
    : course.options;

  return (
    <div className="course-modal-overlay" onClick={onClose}>
      <div className="course-modal-content" ref={courseModalRef} onClick={e => e.stopPropagation()}>
        <button className="course-modal-close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>

        {step >= 1 && step <= 3 && (
          <div className="modal-step-wizard">
            <div className={`course-modal-header ${themeClass}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: 'clamp(25px, 5vw, 30px)' }}>
                <span className="course-card-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', margin: 0, padding: '6px 14px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '600' }}>
                  {course.category}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Krok {step} / 3
                </span>
              </div>
              <h2 style={{ color: 'white', fontSize: 'clamp(1.5rem, 6vw, 2rem)', marginBottom: '5px' }}>{course.title}</h2>
              {isAdminMode ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)' }}>Datum začátku:</span>
                  <input 
                    type="text" 
                    value={configOverrides[course.id]?.start_date !== undefined ? configOverrides[course.id].start_date : 'Začínáme v týdnu od 2. 2. 2026'}
                    onChange={(e) => onConfigChange(course.id, 'start_date', e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', margin: 0 }}>
                  {configOverrides[course.id]?.start_date !== undefined && configOverrides[course.id].start_date !== '' ? configOverrides[course.id].start_date : 'Začínáme v týdnu od 2. 2. 2026'}
                </p>
              )}
            </div>

            <div className="course-modal-body">
              
              {/* KROK TERMÍN */}
              {step === stepTermin && (
                <div className={`wizard-step-${stepTermin} fade-in`}>
                  <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                    <label style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'block', textTransform: 'none' }}>Vyberte typ kurzu a termín</label>
                    
                    {showToggle && (
                      <div className="study-form-toggle" style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
                        <button 
                          type="button"
                          onClick={() => { setStudyForm('prezencne'); setSelectedOpt(null); }}
                          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: studyForm === 'prezencne' ? 'white' : 'transparent', boxShadow: studyForm === 'prezencne' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', fontWeight: studyForm === 'prezencne' ? '600' : '500', color: studyForm === 'prezencne' ? colorTheme : '#64748b', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>location_on</span>
                          Prezenčně
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setStudyForm('online'); setSelectedOpt(null); }}
                          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: studyForm === 'online' ? 'white' : 'transparent', boxShadow: studyForm === 'online' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', fontWeight: studyForm === 'online' ? '600' : '500', color: studyForm === 'online' ? colorTheme : '#64748b', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>monitor</span>
                          Online
                        </button>
                      </div>
                    )}

                    <div className="form-group-radio">
                      {displayedOptions.map((opt) => {
                        let originalTitle = opt.title;
                        let badgeText = null;
                        let displayTitle = originalTitle;

                        // Parse parentheses
                        const parenMatches = [...originalTitle.matchAll(/\(([^)]+)\)/g)];
                        for (const match of parenMatches) {
                          const content = match[1];
                          if (content.toLowerCase().includes('sunrise') || content.toLowerCase().includes('online')) {
                            displayTitle = displayTitle.replace(match[0], '').trim();
                            continue;
                          }
                          badgeText = content;
                          displayTitle = displayTitle.replace(match[0], '').trim();
                        }
                        
                        displayTitle = displayTitle.replace(/\s{2,}/g, ' ').trim();
                        
                        const isLocked = getOptLocked(opt);
                        const isSelected = selectedOpt?.id === opt.id;
                        
                        return (
                        <div key={opt.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label className={`radio-label ${isSelected ? 'selected' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '16px', padding: '12px 16px', fontSize: '1.05rem', textTransform: 'none', width: '100%', boxSizing: 'border-box', opacity: (!isAdminMode && isLocked) ? 0.5 : 1, pointerEvents: (!isAdminMode && isLocked) ? 'none' : 'auto' }}>
                            <input type="radio" name="term" value={opt.id} checked={isSelected} onChange={() => setSelectedOpt(opt)} style={{ margin: 0, justifySelf: 'center' }} disabled={!isAdminMode && isLocked} />
                            
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, justifySelf: 'start', textAlign: 'left', wordBreak: 'break-word' }}>
                              {badgeText && (
                                <span style={{ 
                                  display: 'inline-block', 
                                  background: 'rgba(28, 156, 115, 0.1)', 
                                  color: '#1C9C73', 
                                  padding: '4px 10px', 
                                  borderRadius: '20px', 
                                  fontSize: '0.75rem', 
                                  fontWeight: '700', 
                                  marginBottom: '10px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  {badgeText}
                                </span>
                              )}
                              <span style={{fontWeight: '600', lineHeight: '1.3', textDecoration: (!isAdminMode && isLocked) ? 'line-through' : 'none'}}>{displayTitle} {(!isAdminMode && isLocked) && <span style={{color: '#d32f2f', fontSize: '0.8rem', marginLeft: '5px'}}>(Obsazeno)</span>}</span>
                              <span style={{fontSize: '0.9rem', color: '#666', marginTop: '4px'}}>{getOptTime(opt)}</span>
                            </div>
                            
                            {isAdminMode && (
                              <button type="button" onClick={(e) => { e.preventDefault(); onConfigChange(opt.id, 'is_locked', !isLocked); }} style={{ background: 'none', border: 'none', color: isLocked ? '#d32f2f' : '#ccc', cursor: 'pointer', padding: '5px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{isLocked ? 'lock' : 'lock_open'}</span>
                              </button>
                            )}
                          </label>
                          
                          {isAdminMode && isSelected && (
                            <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid var(--color-primary)', borderLeft: '4px solid var(--color-primary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>Admin Úpravy Termínu</strong>
                              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                  <label style={{ fontSize: '0.8rem', color: '#666' }}>Čas výuky (např. Po 17:00–18:00)</label>
                                  <input type="text" value={getOptTime(opt)} onChange={(e) => onConfigChange(opt.id, 'time', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                  <label style={{ fontSize: '0.8rem', color: '#666' }}>Základní cena (např. 3 650 Kč)</label>
                                  <input type="text" value={getBasePrice(opt)} onChange={(e) => onConfigChange(opt.id, 'price', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )})}
                    </div>
                    {formErrors.term && <div className="custom-form-error" style={{marginTop: '10px'}}><span className="material-symbols-outlined">error</span>{formErrors.term}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {!isTermFirst && (
                      <button type="button" onClick={() => { setStep(1); courseModalRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn" style={{ background: '#f1f1f1', color: '#333', padding: '14px', flex: '0 0 auto' }}>
                        <span className="material-symbols-outlined" style={{ margin: 0 }}>arrow_back</span>
                      </button>
                    )}
                    <button type="button" onClick={handleNextTermin} className={`btn btn-${themeClass}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1 }}>
                      {isTermFirst ? 'Pokračovat' : 'Přejít k objednávce a platbě'}
                      <span className="material-symbols-outlined">{isTermFirst ? 'arrow_forward' : 'shopping_cart_checkout'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* KROK INFO */}
              {step === stepInfo && (
                <div className={`wizard-step-${stepInfo} fade-in`}>
                  <div style={{ color: '#444' }}>
                    <div style={{ marginBottom: '20px', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 3vw, 1.05rem)' }}>
                      {activeDesc}
                    </div>
                    
                    <hr style={{ borderTop: '1px solid #eaeaea', borderBottom: 'none', margin: '0 0 20px 0' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span className="material-symbols-outlined" style={{ color: colorTheme, fontSize: '20px' }}>{activeIsOnline === true ? 'monitor' : 'location_on'}</span>
                        </div>
                        <div>
                          <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '2px' }}>Místo konání</div>
                          <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>{locationText}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span className="material-symbols-outlined" style={{ color: colorTheme, fontSize: '20px' }}>schedule</span>
                        </div>
                        <div>
                          <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '2px' }}>Čas výuky</div>
                          <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>{selectedOpt?.time || "Zvolíte v dalším kroku"}</div>
                        </div>
                      </div>
                    </div>
                    
                    <hr style={{ borderTop: '1px solid #eaeaea', borderBottom: 'none', margin: '0 0 20px 0' }} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                        <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '4px' }}>Skupina</div>
                        <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)' }}>Max. 8 studentů</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                        <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '4px' }}>Cena kurzu</div>
                        <div style={{ color: colorTheme, fontWeight: '600', fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)' }}>{activePrice}</div>
                      </div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '25px' }}>
                      <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '4px' }}>V ceně</div>
                      <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)' }}>15 × 60 minut výuky</div>
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
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '45px' }}>
                    {isTermFirst && (
                      <button type="button" onClick={() => { setStep(1); courseModalRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn" style={{ background: '#f1f1f1', color: '#333', padding: '14px', flex: '0 0 auto' }}>
                        <span className="material-symbols-outlined" style={{ margin: 0 }}>arrow_back</span>
                      </button>
                    )}
                    <button type="button" onClick={handleNextInfo} className={`btn btn-${themeClass}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1 }}>
                      {isTermFirst ? 'Přejít k objednávce a platbě' : 'Pokračovat k výběru termínu'}
                      <span className="material-symbols-outlined">{isTermFirst ? 'shopping_cart_checkout' : 'arrow_forward'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* KROK 3: Formulář */}
              {step === 3 && (
                <form className="wizard-step-3 course-form fade-in" onSubmit={handleSubmit} noValidate>
                  <div className="course-fieldset">
                    <div className="form-group">
                      <label>Jméno a příjmení *</label>
                      <input type="text" name="name" className={formErrors.name ? 'input-error' : ''} value={formData.name} onChange={handleFormChange} placeholder="Např. Jan Novák" />
                      {formErrors.name && <div className="custom-form-error"><span className="material-symbols-outlined">error</span>{formErrors.name}</div>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Telefon *</label>
                        <input type="tel" name="phone" className={formErrors.phone ? 'input-error' : ''} value={formData.phone} onChange={handleFormChange} placeholder="+420 123 456 789" />
                        {formErrors.phone && <div className="custom-form-error"><span className="material-symbols-outlined">error</span>{formErrors.phone}</div>}
                      </div>
                      <div className="form-group">
                        <label>E-mail *</label>
                        <input type="email" name="email" className={formErrors.email ? 'input-error' : ''} value={formData.email} onChange={handleFormChange} placeholder="vas@email.cz" />
                        {formErrors.email && <div className="custom-form-error"><span className="material-symbols-outlined">error</span>{formErrors.email}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="course-fieldset">
                    <div className="form-group">
                      <label>Poznámka</label>
                      <textarea name="note" value={formData.note} onChange={handleFormChange} rows="3" placeholder="Máte nějaký dotaz nebo specifický požadavek?"></textarea>
                    </div>
                  </div>

                  <div className="form-group checkbox-group" style={{ marginTop: '-5px' }}>
                    <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <input type="checkbox" name="gdpr" className="course-gdpr-checkbox" checked={formData.gdpr} onChange={handleFormChange} />
                      <span style={{ textTransform: 'none' }}>Souhlasím s <Link to="/obchodni-podminky" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Obchodními podmínkami</Link> a <Link to="/ochrana-osobnich-udaju" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Zásadami ochrany osobních údajů</Link> *</span>
                    </label>
                    {formErrors.gdpr && <div className="custom-form-error" style={{color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px'}}>{formErrors.gdpr}</div>}
                  </div>

                  <div className="course-modal-price-box" style={{ marginTop: '45px', padding: '16px', background: '#FAFAFA', borderRadius: '12px', border: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="course-modal-price-left" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.95rem', color: '#444', fontWeight: '600' }}>Celková cena za kurz</span>
                      <span style={{ fontSize: '0.85rem', color: '#888' }}>{selectedOpt?.title}</span>
                    </div>
                    <div className="course-modal-price-right" style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--tp-dark)' }}>
                      {activePrice}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button type="button" onClick={() => { setStep(2); courseModalRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn" style={{ background: '#f1f1f1', color: '#333', padding: '14px 24px', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ margin: 0 }}>arrow_back</span>
                    </button>
                    <button type="submit" className="btn course-submit-btn" disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1, margin: 0 }}>
                      {isSubmitting ? 'Zpracovávám...' : (
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
        )}

        {step === 4 && (
          <div className="modal-step-success" style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '24px' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(239, 103, 165, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--tp-pink)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--tp-pink)' }}>check_circle</span>
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Přihláška odeslána!</h2>
            <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '30px' }}>
              Váš zájem o kurz <strong>{course.title}</strong> jsme zaznamenali. Budete přesměrováni na platební bránu.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', backgroundColor: 'var(--tp-pink)', border: 'none' }}>Zavřít a vrátit se</button>
          </div>
        )}
      </div>
    </div>
  );
};

const CoursesPage = () => {
  const [activeModal, setActiveModal] = useState(null);
  const container = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isAdminUrl = searchParams.get('admin') === 'true';
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [configOverrides, setConfigOverrides] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [bulkStartDate, setBulkStartDate] = useState('');
  const [kidsDiscount, setKidsDiscount] = useState('');
  const [adultsDiscount, setAdultsDiscount] = useState('');

  useEffect(() => {
    const initAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (isAdminUrl && session?.user?.email === 'info@sunrise-la.cz') {
        setIsAdminMode(true);
      }
      
      const { data } = await supabase.from('courses_config').select('*');
      if (data) {
        const map = {};
        data.forEach(item => {
          map[item.option_id] = { time: item.time, price: item.price, is_locked: item.is_locked, start_date: item.start_date };
        });
        setConfigOverrides(map);
        
        if (map['discount_kids']?.price) setKidsDiscount(map['discount_kids'].price);
        if (map['discount_adults']?.price) setAdultsDiscount(map['discount_adults'].price);
      }
    };
    initAdmin();
  }, [isAdminUrl]);

  const handleConfigChange = (optId, field, value) => {
    setConfigOverrides(prev => ({
      ...prev,
      [optId]: {
        ...(prev[optId] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const updates = Object.keys(configOverrides).map(key => ({
        option_id: key,
        time: configOverrides[key].time || '',
        price: configOverrides[key].price || '',
        is_locked: configOverrides[key].is_locked || false,
        start_date: configOverrides[key].start_date || ''
      }));
      
      for (const item of updates) {
        const { error } = await supabase.from('courses_config').upsert(item);
        if (error) throw error;
      }
      setModal({ isOpen: true, title: 'Úspěch', message: 'Úpravy kurzů byly úspěšně uloženy!', type: 'success' });
    } catch (err) {
      console.error(err);
      setModal({ isOpen: true, title: 'Chyba', message: 'Chyba při ukládání: ' + err.message, type: 'danger' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Opravdu chcete vymazat všechny vlastní úpravy z databáze a obnovit původní výchozí ceny a časy u všech kurzů?')) {
      setIsSaving(true);
      try {
        const { error } = await supabase.from('courses_config').delete().neq('option_id', 'dummy_value_to_delete_all');
        if (error) throw error;
        setConfigOverrides({});
        setModal({ isOpen: true, title: 'Úspěch', message: 'Všechny kurzy byly úspěšně obnoveny do původního stavu!', type: 'success' });
      } catch (err) {
        console.error(err);
        setModal({ isOpen: true, title: 'Chyba', message: 'Chyba při obnově: ' + err.message, type: 'danger' });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBulkApplyStartDate = () => {
    if (!bulkStartDate) return;
    coursesData.forEach(c => {
      handleConfigChange(c.id, 'start_date', bulkStartDate);
    });
    setModal({ isOpen: true, title: 'Hromadná úprava', message: 'Datum bylo lokálně nastaveno u všech kurzů. Pro propsání na web nezapomeňte Uložit změny.', type: 'success' });
  };

  const handleApplyDiscount = (category, discountStr) => {
    const isKids = category === 'kids';
    const discountKey = isKids ? 'discount_kids' : 'discount_adults';
    const discountPercent = parseInt(discountStr, 10) || 0;
    
    handleConfigChange(discountKey, 'price', discountPercent.toString());
    
    setModal({ isOpen: true, title: 'Úspěch', message: `Sleva ${discountPercent}% pro kategorii ${isKids ? 'Děti a teens' : 'Dospělí'} je připravena. Nezapomeňte kliknout na Uložit změny!`, type: 'success' });
  };

  const kidsCourses = coursesData.filter(c => c.category === 'Pro děti a teens');
  const adultCourses = coursesData.filter(c => c.category === 'Pro dospělé');

  useGSAP(() => {
    const heroElements = ['.courses-hero-badge', '.courses-title', '.courses-subtitle', '.courses-scroll-indicator', '.courses-hero-image-wrapper'];
    gsap.set(heroElements, { opacity: 0, y: 40 });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.timeScale(0.65);

    tl.fromTo('.courses-hero-badge', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, delay: 0.1 }
    )
    .fromTo('.courses-title', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2 },
      "-=0.7"
    )
    .fromTo('.courses-subtitle', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2 },
      "-=0.9"
    )
    .fromTo('.courses-scroll-indicator', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.0, clearProps: "transform" },
      "-=0.8" 
    )
    .fromTo('.courses-hero-image-wrapper', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2 },
      "-=1.0"
    );

  }, { scope: container });

  return (
    <div className="courses-page" ref={container}>
      <section className="courses-hero-section" style={{ paddingTop: '100px' }}>
        <div className="courses-organic-bg"></div>
        <div className="courses-hero-content">
          <div className="courses-hero-text">
            <div className="courses-hero-badge">
              <Link to="/portal" style={{ color: 'inherit', textDecoration: 'none' }}>Nabídka kurzů</Link>
            </div>
            <h1 className="courses-title">Vaše cesta<br />k plynulé řeči.</h1>
            <p className="courses-subtitle">Vyberte si z naší široké nabídky prezenčních a online kurzů pro děti i dospělé. Překonejte jazykovou bariéru a začněte mluvit s jistotou.</p>
            <div className="btn btn-primary courses-scroll-indicator" onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' })}>
              <span>Prohlédnout kurzy</span>
              <span className="material-symbols-outlined scroll-arrow" style={{ fontSize: '1.2rem' }}>arrow_downward</span>
            </div>
          </div>
          <div className="courses-hero-image-wrapper">
            <div className="courses-hero-shadow"></div>
            <img src="/kurzy sunrise.webp" alt="Kurzy Sunrise" fetchpriority="high" loading="eager" />
          </div>
        </div>
      </section>

      <div className="courses-container">
        
        {/* SEKCE DĚTI A TEENS */}
        <section className="course-category-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(20px, 4vw, 30px)', flexWrap: 'wrap', gap: '15px' }}>
            <h2 className="category-title" style={{ margin: 0 }}>Pro děti a teens</h2>
            {isAdminMode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>sell</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Hromadná sleva:</span>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '4px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                  <input 
                    type="number" min="0" max="100" 
                    value={kidsDiscount} onChange={e => setKidsDiscount(e.target.value)} 
                    placeholder="Např. 10" 
                    style={{ width: '60px', border: 'none', padding: '4px 8px', fontSize: '0.85rem', outline: 'none' }} 
                  />
                  <span style={{ padding: '4px 8px 4px 0', fontSize: '0.85rem', color: '#64748b', background: 'white' }}>%</span>
                </div>
                <button onClick={() => handleApplyDiscount('kids', kidsDiscount)} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                  Aplikovat
                </button>
              </div>
            )}
          </div>
          <div className="courses-list-container">
            {kidsCourses.map((course, index) => (
              <div key={course.id} className="course-list-row" onClick={() => {
                if (course.id === 'c_kids_1') {
                  navigate('/english-club');
                } else {
                  setActiveModal(course);
                }
              }}>
                <div className="course-list-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="course-list-content">
                  <h3 className="course-list-title">{course.title}</h3>
                  <div className="course-list-desc-wrapper">
                    <p className="course-list-desc">{course.desc}</p>
                  </div>
                </div>
                <div className="course-list-action">
                  <span className="action-text-default">Zobrazit více</span>
                  <span className="action-text-hover">Zobrazit detaily</span>
                  <span className="material-symbols-outlined action-icon">arrow_outward</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEKCE DOSPĚLÍ */}
        <section className="course-category-section">
          <div className="courses-organic-bg-adults"></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(20px, 4vw, 30px)', flexWrap: 'wrap', gap: '15px' }}>
            <h2 className="category-title" style={{ margin: 0 }}>Pro dospělé</h2>
            {isAdminMode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', zIndex: 1, position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>sell</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Hromadná sleva:</span>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '4px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                  <input 
                    type="number" min="0" max="100" 
                    value={adultsDiscount} onChange={e => setAdultsDiscount(e.target.value)} 
                    placeholder="Např. 10" 
                    style={{ width: '60px', border: 'none', padding: '4px 8px', fontSize: '0.85rem', outline: 'none' }} 
                  />
                  <span style={{ padding: '4px 8px 4px 0', fontSize: '0.85rem', color: '#64748b', background: 'white' }}>%</span>
                </div>
                <button onClick={() => handleApplyDiscount('adults', adultsDiscount)} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                  Aplikovat
                </button>
              </div>
            )}
          </div>
          <div className="courses-list-container">
            {adultCourses.map((course, index) => (
              <div key={course.id} className="course-list-row" onClick={() => setActiveModal(course)}>
                <div className="course-list-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="course-list-content">
                  <h3 className="course-list-title">{course.title}</h3>
                  <div className="course-list-desc-wrapper">
                    <p className="course-list-desc">{course.desc}</p>
                  </div>
                </div>
                <div className="course-list-action">
                  <span className="action-text-default">Zobrazit více</span>
                  <span className="action-text-hover">Zobrazit detaily</span>
                  <span className="material-symbols-outlined action-icon">arrow_outward</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="course-cta-section">
          <div className="container">
            <div className="course-cta-inner">
              <div className="course-cta-left">
                <h2 className="course-cta-title">Nenašli jste kurz?</h2>
                <p className="course-cta-text">
                  Jsme tu pro Vás. Napište nám své požadavky a společně vymyslíme individuální plán výuky na míru.
                </p>
              </div>
              <div className="course-cta-right">
                <div className="course-cta-simple-text">
                  <span>Odpovídáme do 24 hodin</span>
                </div>
                <Link to="/kontakt#formular" className="btn btn-primary course-cta-btn">Nezávazně poptat →</Link>
              </div>
            </div>
          </div>
        </section>

      </div>

      {activeModal && (
        <CourseModal 
          course={activeModal} 
          onClose={() => setActiveModal(null)} 
          isAdminMode={isAdminMode} 
          configOverrides={configOverrides} 
          onConfigChange={handleConfigChange} 
        />
      )}

      {isAdminMode && (
        <div className="admin-floating-banner">
          <style>{`.navbar { top: var(--navbar-offset, 65px) !important; transition: top 0.4s ease-out !important; }`}</style>
          
          <div className="afb-info">
            <span className="afb-info-role">MASTER ADMIN</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '6px' }}>
              <input 
                type="text" 
                placeholder="Hromadné datum začátku..." 
                value={bulkStartDate} 
                onChange={(e) => setBulkStartDate(e.target.value)}
                style={{ border: 'none', background: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', width: '200px' }}
              />
              <button onClick={handleBulkApplyStartDate} style={{ background: '#1C9C73', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>
                Aplikovat všem
              </button>
            </div>
          </div>
          
          <div className="afb-actions">
            <Link to="/portal/admin" className="afb-btn-link">
               <span className="material-symbols-outlined" style={{fontSize:'1rem'}}>settings</span> Zpět do Administrace
            </Link>
            <button onClick={handleResetDefaults} disabled={isSaving} className="afb-btn-logout" style={{ background: '#d32f2f', color: 'white', border: 'none', marginLeft: 'auto' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>restart_alt</span>
              Obnovit původní data
            </button>
            <button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} className="afb-btn-logout" style={{ border: '1px solid rgba(255,255,255,0.5)', background: 'transparent' }}>
              Odhlásit se a zavřít režim
            </button>
            <button onClick={handleSaveConfig} disabled={isSaving} className="afb-btn-logout" style={{ background: 'white', color: 'var(--color-primary)', border: 'none' }}>
              {isSaving ? 'Ukládám...' : 'Uložit změny'}
              {!isSaving && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>}
            </button>
          </div>
        </div>
      )}

      <CustomModal 
        isOpen={modal.isOpen} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
        onClose={() => setModal({ ...modal, isOpen: false })} 
      />
    </div>
  );
};

export default CoursesPage;
