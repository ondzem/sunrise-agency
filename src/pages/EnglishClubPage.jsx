import React, { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CalendarPicker from '../components/CalendarPicker';
import './EnglishClubPage.css';

gsap.registerPlugin(ScrollTrigger);

const clubsData = [
  {
    id: 'club_1',
    accent: 'navy',
    title: 'English Club for Children',
    age: '2–6 let',
    time: 'každý pátek, 8:00–12:00 h',
    price: '700 Kč / den',
    desc: 'Program pro nejmenší děti, kde probíhá učení zcela přirozeně skrze každodenní činnosti.',
    fullDesc: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ margin: 0 }}>
          <strong>English Club for Children</strong><br />
          Program pro nejmenší děti, kde probíhá učení zcela přirozeně skrze každodenní činnosti.
        </p>
        <details style={{ background: 'rgba(30, 58, 138, 0.05)', borderRadius: '8px', border: '1px solid rgba(30, 58, 138, 0.1)', cursor: 'pointer' }}>
          <summary style={{ padding: '12px 16px', fontWeight: '600', color: '#1E3A8A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
            Zjistit, co klub obsahuje a jak probíhá
          </summary>
          <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid rgba(30, 58, 138, 0.1)', marginTop: '4px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px', cursor: 'auto' }}>

            {/* Jak výuka probíhá */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Jak výuka probíhá</h4>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                Děti jsou po celou dobu obklopené angličtinou. Lektor s nimi komunikuje anglicky úplně ve všem – při hraní, oblékání, jídle, tvoření i pohybu.
              </div>
            </div>

            {/* Co děti během lekcí dělají */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Co děti během lekcí dělají</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {[
                  { title: 'Hry a pohyb', desc: 'Hrají si a přirozeně se pohybují' },
                  { title: 'Kreativita', desc: 'Kreslí, stříhají, modelují a tvoří' },
                  { title: 'Běžné situace', desc: 'Učí se při svačině a oblékání' },
                  { title: 'Naslouchání', desc: 'Poslouchají a postupně reagují' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Důležitý princip */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Náš přístup</h4>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                Nikdo děti do ničeho nenutí. Pokud dítě nechce aktivně mluvit, může klidně jen sedět, pozorovat a poslouchat.<br /><br />
                <strong style={{ color: '#1E3A8A' }}>👉 I tímto způsobem se jazyk přirozeně učí a vstřebává.</strong>
              </div>
            </div>

            {/* Proč to funguje */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Proč to funguje</h4>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                Čím dříve dítě začne, tím přirozenější pro něj jazyk je. Nevzniká blok ani strach – angličtina se stává běžnou součástí jeho světa.
              </div>
            </div>

            {/* Výsledek */}
            <div style={{ background: 'rgba(30, 58, 138, 0.05)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #1E3A8A', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#1E3A8A', fontSize: '20px' }}>emoji_events</span>
                <strong style={{ color: '#222' }}>Výsledek klubu</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: '24px', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <li>Přirozené porozumění cizímu jazyku</li>
                <li>První samostatné reakce v angličtině</li>
                <li>Pozitivní vztah k jazyku bez stresu</li>
              </ul>
            </div>

          </div>
        </details>
      </div>
    ),
    bring: ['Pohodlné oblečení', 'Přezůvky', 'Svačinku a pití'],
    dates: ['Pátek 6.10.', 'Pátek 13.10.', 'Pátek 20.10.']
  },
  {
    id: 'club_2',
    accent: 'mint',
    title: 'English Club for Little Pupils',
    age: '6–9 let',
    time: 'každá středa, 14:00–16:00 h',
    price: '700 Kč / den',
    desc: 'Program pro mladší školní děti, kde se propojuje hravost, struktura a první vědomé učení.',
    fullDesc: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ margin: 0 }}>
          <strong>English Club for Little Pupils</strong><br />
          Program pro mladší školní děti, kde se propojuje hravost, struktura a první vědomé učení.
        </p>
        <details style={{ background: 'rgba(28, 156, 115, 0.05)', borderRadius: '8px', border: '1px solid rgba(28, 156, 115, 0.1)', cursor: 'pointer' }}>
          <summary style={{ padding: '12px 16px', fontWeight: '600', color: '#1C9C73', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
            Zjistit, co klub obsahuje a jak probíhá
          </summary>
          <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid rgba(28, 156, 115, 0.1)', marginTop: '4px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px', cursor: 'auto' }}>

            {/* Jak výuka probíhá */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Jak výuka probíhá</h4>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                Každá lekce začíná hravým rituálem – děti musí nejdříve najít svou knížku (např. vyluštit rébus, podle kterého knížku najdou).<br /><br />
                <strong style={{ color: '#1C9C73' }}>👉 Už tímto způsobem se učí jazyk přirozeně a zábavně hned od začátku.</strong>
              </div>
            </div>

            {/* Co děti během lekcí dělají */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Co děti během lekcí dělají</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {[
                  { title: 'Práce s knihou', desc: 'Samolepková či doplňovací kniha' },
                  { title: 'Slovní zásoba', desc: 'Učení v konkrétních situacích' },
                  { title: 'Hry a aktivity', desc: 'Pohybové a stolní hry, konverzace' },
                  { title: 'Kreativita', desc: 'Psaní na tabuli, kreslení a tvoření' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Co se děti učí */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Co se děti učí</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {[
                  { title: 'Základní fráze', desc: 'Běžná komunikace a pokyny' },
                  { title: 'Základy gramatiky', desc: 'Přirozené vstřebávání pravidel' },
                  { title: 'Aktivní mluvení', desc: 'Používání slovní zásoby' },
                  { title: 'Porozumění', desc: 'Reakce na věty a instrukce' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Atmosféra a benefit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <strong style={{ display: 'block', marginBottom: '8px', color: '#222', fontSize: '0.95rem' }}>Atmosféra a přístup</strong>
                Přátelské prostředí bez tlaku na výkon. Dítě může aktivně mluvit, nebo jen poslouchat a „nasávat“ jazyk. Obě varianty jsou naprosto v pořádku.
              </div>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <strong style={{ display: 'block', marginBottom: '8px', color: '#222', fontSize: '0.95rem' }}>Benefit: Vyzvednutí ze družiny</strong>
                Zajišťujeme bezpečný přesun dětí z vybraných škol (ZŠ Waldorfská, ZŠ Staňkova, ZŠ Resslova). Úspora času a žádné stresování s dopravou.
              </div>
            </div>

            {/* Výsledek */}
            <div style={{ background: 'rgba(28, 156, 115, 0.05)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #1C9C73', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#1C9C73', fontSize: '20px' }}>emoji_events</span>
                <strong style={{ color: '#222' }}>Výsledek klubu</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: '24px', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <li>Rozumí angličtině v běžných situacích</li>
                <li>Začínají mluvit bez strachu</li>
                <li>Získávají pevný základ pro další rozvoj</li>
              </ul>
            </div>

          </div>
        </details>
      </div>
    ),
    bring: ['Penál', 'Přezůvky', 'Pití'],
    dates: ['Středa 4.10.', 'Středa 11.10.', 'Středa 18.10.']
  },
  {
    id: 'club_3',
    accent: 'sky',
    title: 'English Club for Older Pupils',
    age: '10–14 let',
    time: 'každý čtvrtek a pátek, 14:00–16:00 h',
    price: '700 Kč / den',
    desc: 'Navazující program pro starší děti, kde se jazyk rozvíjí do větší hloubky, ale stále přirozeně a hravě.',
    fullDesc: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ margin: 0 }}>
          <strong>English Club for Older Pupils</strong><br />
          Navazující program pro starší děti, kde se jazyk rozvíjí do větší hloubky, ale stále přirozeně a hravě.
        </p>
        <details style={{ background: 'rgba(2, 132, 199, 0.05)', borderRadius: '8px', border: '1px solid rgba(2, 132, 199, 0.1)', cursor: 'pointer' }}>
          <summary style={{ padding: '12px 16px', fontWeight: '600', color: '#0284C7', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
            Zjistit, co klub obsahuje a jak probíhá
          </summary>
          <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid rgba(2, 132, 199, 0.1)', marginTop: '4px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px', cursor: 'auto' }}>

            {/* Jak výuka probíhá */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Jak výuka probíhá</h4>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                Stejně jako u mladších dětí, každá lekce začíná hravým rituálem – hledáním knížky (např. musí vyluštit rébus, podle kterého knížku najdou). Následně se ale pracuje s náročnějšími materiály.<br /><br />
                <strong style={{ color: '#0284C7' }}>👉 Už tímto způsobem se učí jazyk přirozeně a zábavně hned od začátku.</strong>
              </div>
            </div>

            {/* Co děti během lekcí dělají */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Co děti během lekcí dělají</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {[
                  { title: 'Rozbor textů', desc: 'Čtou a rozebírají texty' },
                  { title: 'Pokročilá slova', desc: 'Pracují se slovní zásobou' },
                  { title: 'Kreativní psaní', desc: 'Tvoří věty, příběhy a komiksy' },
                  { title: 'Diskuse', desc: 'Reagují a diskutují na témata' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Co se děti učí */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Co se děti učí</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {[
                  { title: 'Hlubší porozumění', desc: 'Porozumění textu do hloubky' },
                  { title: 'Aktivní komunikace', desc: 'Tvoření celých vět' },
                  { title: 'Gramatika v praxi', desc: 'Znalost pravidel sítě v praxi' },
                  { title: 'Vyjádření myšlenek', desc: 'Samostatné vyjadřování myšlenek' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Výsledek */}
            <div style={{ background: 'rgba(2, 132, 199, 0.05)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #0284C7', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#0284C7', fontSize: '20px' }}>emoji_events</span>
                <strong style={{ color: '#222' }}>Výsledek klubu</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: '24px', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <li>Mluví jistěji a samostatněji</li>
                <li>Lépe rozumí textům i mluvené řeči</li>
                <li>Dokážou plynule vyjádřit vlastní myšlenky</li>
              </ul>
            </div>

          </div>
        </details>
      </div>
    ),
    bring: ['Sešit a tužku', 'Přezůvky', 'Pití'],
    dates: ['Čtvrtek 5.10.', 'Pátek 6.10.', 'Čtvrtek 12.10.']
  },
  {
    id: 'club_4',
    accent: 'gray',
    title: 'Saturday English Club',
    age: '4–10 let',
    time: '1× měsíčně, sobota 8:00–12:00 h',
    price: '700 Kč / den',
    desc: 'Víkendová varianta English Clubu pro děti, které nemohou chodit během týdne.',
    fullDesc: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ margin: 0 }}>
          <strong>Saturday English Club</strong><br />
          Víkendová varianta English Clubu pro děti, které nemohou chodit během týdne.
        </p>
        <details style={{ background: 'rgba(71, 85, 105, 0.05)', borderRadius: '8px', border: '1px solid rgba(71, 85, 105, 0.1)', cursor: 'pointer' }}>
          <summary style={{ padding: '12px 16px', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
            Zjistit, co klub obsahuje a jak probíhá
          </summary>
          <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid rgba(71, 85, 105, 0.1)', marginTop: '4px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px', cursor: 'auto' }}>

            {/* Pro koho je */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Pro koho to je</h4>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                Ideální pro zaneprázdněné rodiny, děti s jinými kroužky během týdne nebo pro ty, kteří prostě nechtějí o English Club přijít.
              </div>
            </div>

            {/* Co děti zažijí */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Co děti zažijí</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {[
                  { title: 'Přirozená angličtina', desc: 'Angličtina je součástí programu' },
                  { title: 'Komunikace v praxi', desc: 'Běžné situace, konverzace a hry' },
                  { title: 'Interaktivní hry', desc: 'Pohybové i tvořivé činnosti' },
                  { title: 'Vlastní tempo', desc: 'Mluvit se nenutí, důraz na pohodu' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>



            {/* Výsledek */}
            <div style={{ background: 'rgba(71, 85, 105, 0.05)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #475569', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#475569', fontSize: '20px' }}>emoji_events</span>
                <strong style={{ color: '#222' }}>Výsledek klubu</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: '24px', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <li>Získávají vztah k angličtině</li>
                <li>Zlepšují přirozené porozumění</li>
                <li>Postupně a bez tlaku se rozmlouvají</li>
              </ul>
            </div>

          </div>
        </details>
      </div>
    ),
    bring: ['Pohodlné/sportovní oblečení', 'Svačinu a pití', 'Přezůvky'],
    dates: ['Sobota 14.10.', 'Sobota 11.11.', 'Sobota 9.12.']
  }
];

const EditableField = ({ value, onChange, style, isAdminMode }) => {
  if (!isAdminMode) {
    return style ? <span style={style}>{value}</span> : <>{value}</>;
  }
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{ ...style, width: '80px', border: '1px dashed rgba(255,105,180,0.5)', background: 'rgba(255,255,255,0.8)', padding: '2px 4px', borderRadius: '4px', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit', textAlign: 'center' }} />;
};

const EnglishClubPage = () => {
  const container = useRef(null);
  const [activeModal, setActiveModal] = useState(null);

  // Admin states
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAdminUrl = searchParams.get('admin') === 'true';
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [clubConfig, setClubConfig] = useState({
    club_1: 700, club_2: 700, club_3: 700, club_4: 700,
    lockedDates: [],
    customDates: { club_1: [], club_2: [], club_3: [], club_4: [] }
  });

  useEffect(() => {
    fetchConfig();
    if (isAdminUrl) {
      handleAdminLogin();
    }
  }, [isAdminUrl]);

  const fetchConfig = async () => {
    const { data, error } = await supabase.from('english_club_config').select('config').eq('id', 'prices').single();
    if (data && data.config) {
      setClubConfig(prev => ({ ...prev, ...data.config }));
    }
  };

  const handleAdminLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email === 'info@sunrise-la.cz') {
      setIsAdminMode(true);
    } else {
      alert("Nejste přihlášen jako administrátor nebo nemáte dostatečná oprávnění.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
    navigate('/english-club');
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('english_club_config').upsert({
        id: 'prices',
        config: clubConfig
      }, { onConflict: 'id' });
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

  const getValidDates = (clubId) => {
    const dates = [];
    const today = new Date();
    // 3 roky dopředu (místo původních 6 měsíců)
    const endDate = new Date(today.getFullYear(), today.getMonth() + 36, today.getDate());
    let currentDate = new Date(today);

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // 0 = Leden, 6 = Červenec, 7 = Srpen
      const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 1 is Monday...
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

      // Letní prázdniny v ČR vždy trvají celý červenec a srpen.
      const isSummerHoliday = (month === 6 || month === 7);

      let isValid = false;

      if (clubId === 'club_1' && dayOfWeek === 5) {
        isValid = !isSummerHoliday; // Pátek, ale ne o prázdninách
      } else if (clubId === 'club_2' && dayOfWeek === 3) {
        isValid = !isSummerHoliday; // Středa, ale ne o prázdninách
      } else if (clubId === 'club_3' && (dayOfWeek === 4 || dayOfWeek === 5)) {
        isValid = !isSummerHoliday; // Čtvrtek a Pátek, ale ne o prázdninách
      } else if (clubId === 'club_4' && dayOfWeek === 6) {
        // Zcela zrušeno automatické přidávání první soboty v měsíci.
        // Admin si tyto termíny určuje stoprocentně sám přes "Přidat termín" (+).
        isValid = false;
      }

      if (isValid) dates.push(dateStr);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Přidání vlastních admin termínů
    if (clubConfig.customDates && clubConfig.customDates[clubId]) {
      clubConfig.customDates[clubId].forEach(d => {
        if (!dates.includes(d)) dates.push(d);
      });
    }

    return dates.sort();
  };

  const handleToggleLock = (dateStr) => {
    setClubConfig(prev => {
      const locked = prev.lockedDates || [];
      if (locked.includes(dateStr)) {
        return { ...prev, lockedDates: locked.filter(d => d !== dateStr) };
      } else {
        return { ...prev, lockedDates: [...locked, dateStr] };
      }
    });
  };

  const handleToggleCustomDate = (clubId, dateStr) => {
    setClubConfig(prev => {
      const currentCustom = prev.customDates || { club_1: [], club_2: [], club_3: [], club_4: [] };
      const clubDates = currentCustom[clubId] || [];

      let newClubDates;
      if (clubDates.includes(dateStr)) {
        newClubDates = clubDates.filter(d => d !== dateStr);
      } else {
        newClubDates = [...clubDates, dateStr];
      }

      return {
        ...prev,
        customDates: { ...currentCustom, [clubId]: newClubDates }
      };
    });
  };

  const getAllowedDayOfWeek = (clubId) => {
    switch (clubId) {
      case 'club_1': return 5; // Pátek
      case 'club_2': return 3; // Středa
      case 'club_3': return [4, 5]; // Čtvrtek a Pátek
      case 'club_4': return 6; // Sobota
      default: return null;
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    dates: [],
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
    gdpr: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1 = Termíny a Info, 2 = Údaje, 3 = Success
  const [formErrors, setFormErrors] = useState({});

  useGSAP(() => {
    const heroElements = ['.eclub-badge', '.eclub-title', '.eclub-subtitle', '.eclub-cta', '.eclub-hero-image-wrapper'];
    gsap.set(heroElements, { opacity: 0, y: 40 });
    gsap.set('.eclub-card', { opacity: 0, y: 50 });
    gsap.set('.eclub-info-item', { opacity: 0, y: 30 });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.timeScale(0.8);

    tl.fromTo('.eclub-badge', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.1 })
      .fromTo('.eclub-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=0.7")
      .fromTo('.eclub-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=0.9")
      .fromTo('.eclub-cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, clearProps: "transform" }, "-=0.8")
      .fromTo('.eclub-hero-image-wrapper', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=1.0");

    gsap.to('.eclub-card', {
      scrollTrigger: { trigger: '.eclub-grid', start: 'top 75%' },
      opacity: 1, y: 0, duration: 1.0, stagger: 0.1, ease: 'power4.out'
    });

    gsap.to('.eclub-info-item', {
      scrollTrigger: { trigger: '.eclub-info-section', start: 'top 80%' },
      opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out'
    });

  }, { scope: container });

  const handleDateChange = (date) => {
    setFormData(prev => {
      const dates = [...prev.dates];
      if (dates.includes(date)) return { ...prev, dates: dates.filter(d => d !== date) };
      return { ...prev, dates: [...dates, date] };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (formData.dates.length === 0) errors.dates = 'Prosím vyberte alespoň jeden termín konání.';
    if (!formData.childName.trim()) errors.childName = 'Prosím vyplňte jméno dítěte.';
    if (!formData.age) errors.age = 'Prosím vyberte věk dítěte.';

    if (formData.hasSibling) {
      if (!formData.siblingName.trim()) errors.siblingName = 'Prosím vyplňte jméno sourozence.';
      if (!formData.siblingAge) errors.siblingAge = 'Prosím vyberte věk sourozence.';
    }

    if (!formData.phone.trim()) errors.phone = 'Prosím vyplňte telefonní číslo.';
    if (!formData.email.trim()) errors.email = 'Prosím vyplňte e-mail.';
    if (!formData.gdpr) errors.gdpr = 'Musíte souhlasit se zpracováním osobních údajů.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4); // Přechod na success obrazovku
    }, 1500);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const openModal = (club) => {
    setActiveModal(club);
    setFormData({ dates: [], childName: '', nickname: '', age: '', phone: '', email: '', note: '', hasSibling: false, siblingName: '', siblingNickname: '', siblingAge: '', siblingNote: '', gdpr: false });
    setStep(1);
    setFormErrors({});
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  return (
    <main className="eclub-page" ref={container}>
      {/* Plovoucí admin panel */}
      {isAdminMode && (
        <div className="admin-floating-banner">
          <style>{`.navbar { top: var(--navbar-offset, 65px) !important; transition: top 0.4s ease-out !important; }`}</style>

          <div className="afb-info">
            <span className="afb-info-role">MASTER ADMIN</span>
            {saveMessage && <span style={{ color: '#1C9C73', fontWeight: 'bold', marginLeft: '10px' }}>{saveMessage}</span>}
          </div>

          <div className="afb-actions">
            <Link to="/portal/admin" className="afb-btn-link">
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>settings</span> Zpět do Administrace
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
      <section className="eclub-hero-section" style={{ paddingTop: isAdminMode ? '160px' : '100px' }}>
        <div className="eclub-organic-bg"></div>
        <div className="eclub-hero-content">
          <div className="eclub-hero-text">
            <div className="eclub-badge"><Link to="/portal" style={{ color: 'inherit', textDecoration: 'none' }}>Pro děti 2–14 let</Link></div>
            <h1 className="eclub-title">Angličtina, kterou si Vaše dítě zamiluje</h1>
            <p className="eclub-subtitle">
              Program, kde se děti učí angličtinu přirozeně, bez stresu a nucení. Nejde o klasickou výuku, ale o prostředí, kde je angličtina součástí každé aktivity během lekce.
            </p>
            <div className="btn btn-primary eclub-cta" onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' })}>
              <span>Vybrat klub pro dítě</span>
              <span className="material-symbols-outlined scroll-arrow" style={{ fontSize: '1.2rem', marginLeft: '8px' }}>arrow_downward</span>
            </div>
          </div>
          <div className="eclub-hero-image-wrapper">
            <div className="eclub-hero-shadow"></div>
            <img src="/English Club hero sekce.webp" alt="English Club - Sunrise Language Agency" fetchpriority="high" loading="eager" />
          </div>
        </div>
      </section>

      {/* 2. KATEGORIE KLUBU */}
      <section className="eclub-categories-section" id="kluby">
        <div className="eclub-container">
          <div className="eclub-section-header">
            <h2>Vyberte klub podle věku dítěte</h2>
            <p>Děti angličtinu nejen slyší, ale zažívají – při hrách, tvoření, pohybu i běžných situacích.</p>
          </div>

          <div className="eclub-tickets-list">
            {clubsData.map((club, index) => (
              <div key={club.id} className={`eclub-term-ticket ticket-accent-${club.accent}`}>
                <div className="eclub-ticket-blob"></div>
                <div className="ticket-info">
                  <span className={`pill-${club.accent}`}>{club.age}</span>
                  <h3>{club.title}</h3>
                  <p className="ticket-meta" style={{ marginBottom: '1.5rem' }}><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_today</span> {club.time}</p>
                  <p className="ticket-desc">{club.desc}</p>
                </div>
                <div className="ticket-action">
                  <div className="ticket-price">
                    <strong><EditableField value={clubConfig[club.id] || 700} onChange={v => setClubConfig(prev => ({ ...prev, [club.id]: v }))} isAdminMode={isAdminMode} /> Kč / den</strong>
                    {club.priceSub && <span>{club.priceSub}</span>}
                  </div>
                  <button className={`btn btn-accent-${club.accent}`} onClick={() => openModal(club)}>
                    Zjistit více
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRAKTICKÉ INFORMACE */}
      <section className="eclub-info-section">
        <div className="eclub-container">
          <div className="eclub-info-grid">
            <div className="eclub-info-item">
              <span className="material-symbols-outlined">location_on</span>
              <h4>Místo konání</h4>
              <p>SUNRISE Place,<br />ul. Jana Palacha 1638, Pardubice</p>
            </div>
            <div className="eclub-info-item">
              <span className="material-symbols-outlined">card_giftcard</span>
              <h4>První lekce</h4>
              <p>První lekce Vašeho dítěte u nás je zdarma.</p>
            </div>
            <div className="eclub-info-item">
              <span className="material-symbols-outlined">family_restroom</span>
              <h4>Sourozenecká sleva</h4>
              <p>Druhý a každý další sourozenec má u nás slevu 50 %.</p>
            </div>
            <div className="eclub-info-item">
              <span className="material-symbols-outlined">schedule</span>
              <h4>Rezervace</h4>
              <p>Termíny rezervujte nejpozději 24 hodin před začátkem lekce.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINÁLNÍ CTA */}
      <section className="eclub-final-cta" id="kontakt">
        <div className="eclub-container">
          <div className="eclub-cta-inner">
            <div className="eclub-cta-left">
              <h2 className="eclub-cta-title">Máte nějaký dotaz?</h2>
              <p className="eclub-cta-text">
                Rádi Vám zodpovíme každý dotaz. Neváhejte nás kontaktovat.
              </p>
            </div>
            <div className="eclub-cta-right">
              <div className="eclub-cta-simple-text">
                <span>Odpovídáme do 24 hodin</span>
                <span className="dot">&bull;</span>
                <span>Pardubice a okolí</span>
              </div>
              <Link to="/kontakt#formular" className="btn btn-primary eclub-cta-btn">Mám dotaz &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL PRO DETAIL A ZÁPIS */}
      {activeModal && (
        <div className="eclub-modal-overlay" onClick={closeModal}>
          <div className="eclub-modal-content" onClick={e => e.stopPropagation()}>
            <button className="eclub-modal-close" onClick={closeModal}>
              <span className="material-symbols-outlined">close</span>
            </button>

            {step >= 1 && step <= 3 && (
              <div className="modal-step-wizard">
                <div className={`eclub-modal-header accent-${activeModal.accent}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: 'clamp(25px, 5vw, 30px)' }}>
                    <span className="summer-card-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', margin: 0 }}>
                      {activeModal.age}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                      Krok {step} / 3
                    </span>
                  </div>
                  <h2 style={{ color: 'white', fontSize: 'clamp(1.5rem, 6vw, 2rem)', marginBottom: '5px' }}>
                    {step === 1 && 'Informace o klubu'}
                    {step === 2 && 'Výběr termínů'}
                    {step === 3 && 'Přihláška do klubu'}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', margin: 0 }}>
                    {activeModal.title}
                  </p>
                  <div className="wizard-progress-bar" style={{ background: 'rgba(255,255,255,0.2)', height: '4px', borderRadius: '4px', overflow: 'hidden', marginTop: '15px' }}>
                    <div className="wizard-progress-fill" style={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%', height: '100%', background: '#fff', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>

                <div className="eclub-modal-body" style={{ padding: 0 }}>
                  {step === 1 && (
                    <div className="wizard-step-1 fade-in eclub-step-container">
                      <div style={{ color: '#444' }}>
                        <div style={{ marginBottom: '20px', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 3vw, 1.05rem)' }}>
                          {activeModal.fullDesc}
                        </div>

                        <hr style={{ borderTop: '1px solid #eaeaea', borderBottom: 'none', margin: '0 0 20px 0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span className="material-symbols-outlined" style={{ color: '#1e3a8a', fontSize: '20px' }}>schedule</span>
                            </div>
                            <div>
                              <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '2px' }}>Čas konání</div>
                              <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>{activeModal.time}</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span className="material-symbols-outlined" style={{ color: '#1e3a8a', fontSize: '20px' }}>payments</span>
                            </div>
                            <div>
                              <div style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: '#888', marginBottom: '2px' }}>Cena</div>
                              <div style={{ color: '#222', fontWeight: '600', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}><EditableField value={clubConfig[activeModal.id] || 700} onChange={v => setClubConfig(prev => ({ ...prev, [activeModal.id]: v }))} isAdminMode={isAdminMode} /> Kč / den</div>
                              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>(Sourozenec 50 % sleva)</div>
                            </div>
                          </div>
                        </div>

                        <hr style={{ borderTop: '1px solid #eaeaea', borderBottom: 'none', margin: '0 0 20px 0' }} />

                        <div>
                          <h4 style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', fontWeight: '700', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px' }}>Co s sebou</h4>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {activeModal.bring.map((item, i) => (
                              <span key={i} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#334155', borderRadius: '12px', fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', fontWeight: '500' }}>{item}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button type="button" onClick={() => setStep(2)} className={`btn btn-accent-${activeModal.accent}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', marginTop: '35px' }}>
                        Pokračovat k termínům
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="wizard-step-2 fade-in eclub-step-container">
                      <div className="form-group">
                        <label>Vyberte termíny konání z kalendáře *</label>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                          Vybrat můžete jeden nebo více termínů na půl roku dopředu.
                        </p>
                        <div style={{ marginBottom: '20px', background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                          <CalendarPicker
                            selectedDate={formData.dates}
                            onDateSelect={handleDateChange}
                            highlightedDates={getValidDates(activeModal.id)}
                            disablePastDates={true}
                            disablePastMonths={true}
                            fullWidth={true}
                            onlyAllowHighlighted={true}
                            isAdminMode={isAdminMode}
                            lockedDates={clubConfig.lockedDates || []}
                            customDates={clubConfig.customDates?.[activeModal.id] || []}
                            onToggleLock={handleToggleLock}
                            onAddDate={activeModal.id === 'club_4' ? (dateStr) => handleToggleCustomDate(activeModal.id, dateStr) : null}
                            onRemoveDate={activeModal.id === 'club_4' ? (dateStr) => handleToggleCustomDate(activeModal.id, dateStr) : null}
                            allowedDayOfWeek={getAllowedDayOfWeek(activeModal.id)}
                          />
                        </div>

                        {formData.dates.length > 0 && (
                          <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Vybrané termíny:</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {formData.dates.sort().map(d => {
                                const [y, m, day] = d.split('-');
                                return (
                                  <div key={d} style={{ background: 'rgba(0,0,0,0.04)', color: '#333', padding: '6px 12px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {`${parseInt(day)}. ${parseInt(m)}. ${y}`}
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px', cursor: 'pointer', color: '#888' }} onClick={() => handleDateChange(d)}>close</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {formErrors.dates && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px', marginBottom: '12px' }}>{formErrors.dates}</div>}
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '35px' }}>
                        <button type="button" onClick={() => setStep(1)} className="btn" style={{ background: '#f1f1f1', color: '#333', padding: '14px', flex: '0 0 auto' }}>
                          <span className="material-symbols-outlined" style={{ margin: 0 }}>arrow_back</span>
                        </button>
                        <button type="button" onClick={() => {
                          if (formData.dates.length === 0) {
                            setFormErrors({ dates: 'Prosím vyberte alespoň jeden termín konání.' });
                          } else {
                            setFormErrors({});
                            const baseVal = (parseInt(clubConfig[activeModal.id], 10) || 700) * formData.dates.length;
                            const sibVal = Math.round(baseVal * 0.5);
                            closeModal();
                            navigate('/pokladna', {
                              state: {
                                source: 'english_club',
                                title: activeModal.title,
                                term: formData.dates.join(', '),
                                priceText: `${baseVal.toLocaleString('cs-CZ')} Kč`,
                                siblingPriceText: `${sibVal.toLocaleString('cs-CZ')} Kč`,
                                price: baseVal,
                                siblingPrice: sibVal,
                                details: `${formData.dates.length} vybraných dní`
                              }
                            });
                          }
                        }} className={`btn btn-accent-${activeModal.accent}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1 }}>
                          Přejít k objednávce a platbě
                          <span className="material-symbols-outlined">shopping_cart_checkout</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="wizard-step-3 fade-in eclub-step-3-container">
                      <form className="eclub-form" onSubmit={handleSubmit} noValidate>
                        <div className="eclub-fieldset">
                          <div className="form-row">
                            <div className="form-group">
                              <label>Jméno dítěte *</label>
                              <input type="text" name="childName" className={formErrors.childName ? 'input-error' : ''} value={formData.childName} onChange={e => { handleChange(e); if (formErrors.childName) setFormErrors({ ...formErrors, childName: null }); }} placeholder="Např. Jan Novák" />
                              {formErrors.childName && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{formErrors.childName}</div>}
                            </div>
                            <div className="form-group">
                              <label>Věk dítěte *</label>
                              <select name="age" className={formErrors.age ? 'input-error' : ''} value={formData.age} onChange={e => { handleChange(e); if (formErrors.age) setFormErrors({ ...formErrors, age: null }); }}>
                                <option value="">Vyberte věk</option>
                                <option value="2">2 roky</option>
                                <option value="3">3 roky</option>
                                <option value="4">4 roky</option>
                                <option value="5">5 let</option>
                                <option value="6">6 let</option>
                                <option value="7">7 let</option>
                                <option value="8">8 let</option>
                                <option value="9">9 let</option>
                                <option value="10">10 let</option>
                                <option value="11">11 let</option>
                                <option value="12">12 let</option>
                              </select>
                              {formErrors.age && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{formErrors.age}</div>}
                            </div>
                          </div>
                        </div>

                        <div className="eclub-fieldset">
                          <div className="form-group">
                            <label>Oslovení, které má dítě rádo</label>
                            <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="Např. Honzík" />
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Telefon na rodiče *</label>
                              <input type="tel" name="phone" className={formErrors.phone ? 'input-error' : ''} value={formData.phone} onChange={e => { handleChange(e); if (formErrors.phone) setFormErrors({ ...formErrors, phone: null }); }} placeholder="+420 123 456 789" />
                              {formErrors.phone && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{formErrors.phone}</div>}
                            </div>
                            <div className="form-group">
                              <label>E-mail *</label>
                              <input type="email" name="email" className={formErrors.email ? 'input-error' : ''} value={formData.email} onChange={e => { handleChange(e); if (formErrors.email) setFormErrors({ ...formErrors, email: null }); }} placeholder="vas@email.cz" />
                              {formErrors.email && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{formErrors.email}</div>}
                            </div>
                          </div>
                        </div>

                        <div className="eclub-fieldset">
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Poznámka (např. alergie, specifika)</label>
                            <textarea name="note" value={formData.note} onChange={handleChange} rows="3" placeholder="Volitelná poznámka..." style={{ marginBottom: 0 }}></textarea>
                          </div>

                          <div className="form-group checkbox-group" style={{ marginTop: '-22px', marginBottom: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontWeight: '600', color: '#334155', cursor: 'pointer', padding: '14px 16px', border: formData.hasSibling ? '2px solid var(--tp-pink)' : '1px solid #e2e8f0', borderRadius: '12px', background: formData.hasSibling ? 'rgba(239, 103, 165, 0.05)' : '#f8fafc', transition: 'all 0.2s' }}>
                              <input type="checkbox" name="hasSibling" checked={formData.hasSibling} onChange={handleChange} style={{ width: '22px', height: '22px', accentColor: 'var(--tp-pink)', cursor: 'pointer' }} />
                              <span style={{ flex: 1, lineHeight: '1.3' }}>Chci přihlásit i sourozence <span style={{ color: 'var(--tp-pink)', fontWeight: '700', whiteSpace: 'nowrap' }}>(50% sleva)</span></span>
                            </label>
                          </div>
                        </div>

                        {formData.hasSibling && (
                          <div className="eclub-fieldset fade-in" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Údaje o sourozenci</h4>
                            <div className="form-row">
                              <div className="form-group">
                                <label>Jméno sourozence *</label>
                                <input type="text" name="siblingName" className={formErrors.siblingName ? 'input-error' : ''} value={formData.siblingName} onChange={e => { handleChange(e); if (formErrors.siblingName) setFormErrors({ ...formErrors, siblingName: null }); }} placeholder="Např. Anička Nováková" />
                                {formErrors.siblingName && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{formErrors.siblingName}</div>}
                              </div>
                              <div className="form-group">
                                <label>Věk sourozence *</label>
                                <select name="siblingAge" className={formErrors.siblingAge ? 'input-error' : ''} value={formData.siblingAge} onChange={e => { handleChange(e); if (formErrors.siblingAge) setFormErrors({ ...formErrors, siblingAge: null }); }}>
                                  <option value="">Vyberte věk</option>
                                  <option value="2">2 roky</option>
                                  <option value="3">3 roky</option>
                                  <option value="4">4 roky</option>
                                  <option value="5">5 let</option>
                                  <option value="6">6 let</option>
                                  <option value="7">7 let</option>
                                  <option value="8">8 let</option>
                                  <option value="9">9 let</option>
                                  <option value="10">10 let</option>
                                  <option value="11">11 let</option>
                                  <option value="12">12 let</option>
                                </select>
                                {formErrors.siblingAge && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{formErrors.siblingAge}</div>}
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Oslovení, které má sourozenec rád</label>
                              <input type="text" name="siblingNickname" value={formData.siblingNickname} onChange={handleChange} placeholder="Např. Anička" />
                            </div>
                            <div className="form-group">
                              <label>Poznámka pro sourozence (např. alergie)</label>
                              <textarea name="siblingNote" value={formData.siblingNote} onChange={handleChange} rows="2" placeholder="Volitelná poznámka..."></textarea>
                            </div>
                          </div>
                        )}

                        <div className="form-group checkbox-group eclub-gdpr-group" style={{ marginTop: '5px' }}>
                          <label className="eclub-gdpr-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <input type="checkbox" name="gdpr" className="eclub-gdpr-checkbox" checked={formData.gdpr} onChange={e => { handleChange(e); if (formErrors.gdpr) setFormErrors({ ...formErrors, gdpr: null }); }} />
                            <span style={{ textTransform: 'none', lineHeight: '1.4' }}>
                              Souhlasím s <Link to="/obchodni-podminky" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Obchodními podmínkami</Link> a <Link to="/ochrana-osobnich-udaju" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tp-pink)', textDecoration: 'underline' }}>Zásadami ochrany osobních údajů</Link> *
                            </span>
                          </label>
                          {formErrors.gdpr && <div className="custom-form-error" style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '4px' }}>{formErrors.gdpr}</div>}
                        </div>

                        <div className="eclub-modal-price-box">
                          <div className="eclub-modal-price-left">
                            <span style={{ fontSize: '0.95rem', color: '#444', fontWeight: '600' }}>Celková cena za klub</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--tp-pink)', fontWeight: '600' }}>
                              {formData.dates.length} {formData.dates.length === 1 ? 'termín' : (formData.dates.length >= 2 && formData.dates.length <= 4) ? 'termíny' : 'termínů'} ({clubConfig[activeModal.id] || 700} Kč / den)
                              {formData.hasSibling && ' + Sourozenec (50 %)'}
                            </span>
                          </div>
                          <div className="eclub-modal-price-right" style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--tp-dark)' }}>
                            {(formData.dates.length * (parseInt(clubConfig[activeModal.id]) || 700) * (formData.hasSibling ? 1.5 : 1)).toLocaleString('cs-CZ')} Kč
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <button type="button" onClick={() => setStep(2)} className="btn" style={{ background: '#f1f1f1', color: '#333', padding: '14px', flex: '0 0 auto' }}>
                            <span className="material-symbols-outlined" style={{ margin: 0 }}>arrow_back</span>
                          </button>
                          <button type="submit" className={`btn btn-accent-${activeModal.accent}`} disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1 }}>
                            {isSubmitting ? 'Zpracovávám...' : (
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

            {step === 4 && (
              <div className="modal-step-success" style={{ textAlign: 'center', padding: '50px 20px' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(28, 156, 115, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--color-accent1)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>check_circle</span>
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Téměř hotovo!</h2>
                <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '30px' }}>
                  Vaše přihláška byla zaznamenána. Nyní budete přesměrováni na platební bránu pro dokončení zápisu.
                </p>
                <button className={`btn btn-accent-${activeModal.accent}`} onClick={closeModal} style={{ width: '100%' }}>Dokončit a zavřít</button>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
};

export default EnglishClubPage;
