import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { supabase } from '../supabaseClient';
import './Team.css';

gsap.registerPlugin(ScrollTrigger);

const Team = () => {
  const container = useRef(null);
  const scrollRef = useRef(null);

  const slide = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 1024 ? 360 : 320;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const [teachers, setTeachers] = useState([
    {
      id: "fallback-1",
      name: "Lucie Tomková",
      qualifications: "Mgr. Anglická Filologie — Univerzita Pardubice",
      image_url: "/tomkova portret.jpeg",
      description: "Zakladatelka SUNRISE a duše celé školy. Specializuje se na gramatiku a Business English, ale s radostí se věnuje i věčným začátečníkům. Tady se každý cítí vítaný.",
      teaching_focus: "Angličtina"
    },
    {
      id: "fallback-2",
      name: "Martina Pešková",
      qualifications: "Pedagogická fakulta — Univerzita Hradec Králové",
      image_url: "/martina portret.jpeg",
      description: "S úsměvem dokáže z každé gramatiky udělat srozumitelný příběh. Připraví Vás k maturitě i na nejvyšší jazykovou úroveň — trpělivě a bez zbytečného stresu.",
      teaching_focus: "Angličtina, Francouzština"
    },
    {
      id: "fallback-3",
      name: "Marek Thompson",
      qualifications: "John F. Kennedy High School, Los Angeles",
      image_url: "/marek portret.jpeg",
      description: "Rodilý mluvčí který mluví plynně česky. Odbourá Vaše bloky při mluvení rychleji než kdokoliv jiný — a ještě Vás u toho pobaví.",
      teaching_focus: "Angličtina"
    },
    {
      id: "fallback-4",
      name: "Martina Přibylová",
      qualifications: "Gymnázium Mozartova · Univerzita Palackého, Olomouc",
      image_url: "/Martina pribylova.webp",
      description: "Přátelská a empatická lektorka, která dokáže srozumitelně vysvětlit angličtinu na jakékoliv úrovni. Od prvních slovíček až po plynulou konverzaci.",
      teaching_focus: "Angličtina",
      objectPosition: "center 20%"
    }
  ]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data, error } = await supabase.from('homepage_team').select('*').order('order_index', { ascending: true });
        if (data && data.length > 0) {
          setTeachers(data);
        } else if (data && data.length === 0) {
          // If explicitly empty from DB, we clear it (so admin can delete all)
          // setTeachers([]); 
          // Actually, let's keep it safe. If they want 0, they can have 0. But for now fallback is safer before they add data.
        }
      } catch(e) {
        console.error(e);
      }
    };
    fetchTeam();
  }, []);

  useGSAP(() => {
    // 1. Společná animace všech karet lektorů se soft staggeringem
    const cards = gsap.utils.toArray('.team-card');
    cards.forEach((card, index) => {
      const delay = index * 0.15;
      gsap.fromTo(card,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.1, delay: delay, ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%', // Zahájí, když karta trochu "vykoukne" zespodu
            once: true
          }
        }
      );
    });

    // 2. Samostatná animace hlavičky sekce
    gsap.fromTo('.team-header',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.team-header',
          start: 'top 85%',
          once: true
        }
      }
    );
  }, { scope: container });

  return (
    <section className="team-section" id="tym" ref={container}>
      {/* Decorative blured blobs */}
      <div className="team-blob-1"></div>
      <div className="team-blob-2"></div>

      <div className="team-container">
        
        {/* Section Header */}
        <div className="team-header">
          <h2 className="team-header-title">Naši lektoři</h2>
        </div>

        {/* Teachers Grid */}
        <div className="team-grid" ref={scrollRef}>
          {teachers.map((teacher) => (
            <div className="team-card" key={teacher.id}>
              
              {/* Hlavní Info Lektora s Blob-fotkou */}
              <div className="team-card-header">
                <div className="team-photo-wrapper">
                  <img 
                    src={teacher.image_url} 
                    alt={teacher.name} 
                    className="team-photo" 
                    style={{ 
                      '--base-zoom': teacher.zoom || 1,
                      objectPosition: teacher.objectPosition || 'center top'
                    }} 
                  />
                </div>
                <div className="team-name-box">
                  <h3 className="team-name">{teacher.name}</h3>
                  <span className="team-education">{teacher.qualifications}</span>
                </div>
              </div>

              {/* Textový Popis */}
              <p className="team-bio">{teacher.description}</p>

              {/* Vyučované Jazyky/Předměty */}
              <div className="team-subjects">
                {teacher.teaching_focus ? teacher.teaching_focus.split(',').map((subject, idx) => (
                  <span className="subject-tag" key={idx}>{subject.trim()}</span>
                )) : null}
              </div>

            </div>
          ))}
        </div>

        {/* Navigace levá a pravá pod kartami */}
        <div className="team-nav-container">
          <button onClick={() => slide('left')} className="team-nav-btn" aria-label="Zpět">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={() => slide('right')} className="team-nav-btn" aria-label="Další">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Team;
