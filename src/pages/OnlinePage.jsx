import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../supabaseClient';
import CustomModal from '../components/CustomModal';
import './OnlinePage.css';

gsap.registerPlugin(ScrollTrigger);

const getNearestSlots = (schedule) => {
  if (!schedule || schedule.length === 0) return [];

  const now = new Date();
  let allSlots = [];

  schedule.forEach(dayItem => {
    if (dayItem.day && dayItem.slots) {
      dayItem.slots.forEach(slot => {
        if (slot.isBooked) return;

        const parts = dayItem.day.split('-');
        if (parts.length === 3) {
          const [year, month, day] = parts.map(Number);
          const [hour, minute] = slot.from.split(':').map(Number);

          if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hour) && !isNaN(minute)) {
            const slotDate = new Date(year, month - 1, day, hour, minute);

            if (slotDate >= now) {
              allSlots.push({
                dateObj: slotDate,
                from: slot.from
              });
            }
          }
        }
      });
    }
  });

  allSlots.sort((a, b) => a.dateObj - b.dateObj);

  return allSlots.slice(0, 2).map(slot => {
    const d = slot.dateObj;
    return {
      day: `${d.getDate()}. ${d.getMonth() + 1}.`,
      from: slot.from
    };
  });
};

const OnlinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const container = useRef(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState(null);
  const [modal, setModal] = useState({ isOpen: false });

  useEffect(() => {
    checkSessionAndFetch();
  }, []);

  const checkSessionAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setSessionUser(session.user);
    }

    const { data } = await supabase
      .from('tutors')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true });
    if (data) {
      // Filtrace: Admin vidí vše. Běžný uživatel/lektor vidí jen ZAPNUTÉ karty, 
      // ale lektor zároveň vždycky vidí svoji VLASTNÍ kartu (i když je skrytá).
      const isAdmin = session?.user?.email === 'ondra.zeman05@gmail.com';
      const myId = session?.user?.id;

      const filteredData = data.filter(t => {
        if (isAdmin) return true;
        if (t.id === myId) return true;

        const vis = t.is_visible;
        // Pokud je hodnota jakákoliv variace pro "vypnuto/skryto", bezpečně schováme
        if (vis === false || vis === "false" || vis === "FALSE" || vis === 0 || vis === "0" || vis === "f") {
          return false;
        }
        return true;
      });

      setTeachers(filteredData);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSessionUser(null);
    setModal({
      isOpen: true,
      title: 'Odhlášení úspěšné',
      message: 'Byli jste úspěšně odhlášeni z lektorského režimu. Celý portál nyní poběží ve standardním módu bez administračních vlivů.',
      type: 'success',
      confirmText: 'Rozumím',
      onClose: () => window.location.reload()
    });
  };

  const handleCreateNewCard = async () => {
    // 1. Založit řádek v DB, pokud neexistuje. (Nová karta je vždy ve výchozím stavu SKRYTÁ, než ji uživatel dopíše)
    const { error } = await supabase.from('tutors').insert([
      {
        id: sessionUser.id,
        email: sessionUser.email,
        name: '',
        price: 'Nezadáno',
        short_reason: 'Lektor zatím nevyplnil biokartu.',
        is_visible: false // Karta bude skrytá, dokud si ji lektor ručně nepublikuje v editoru
      }
    ]);

    // 2. Přesunout se rovnou na editor, popřípadě ignorovat chybu (už existuje ale je skrytý) a přesunout se
    navigate('/portal/editor');
  };

  const handleMoveTutor = async (index, direction) => {
    // direction je -1 (posunout zpět/nahoru) nebo 1 (posunout dopředu/dolů)
    if (index + direction < 0 || index + direction >= teachers.length) return;

    // Vytvoříme novou lokální kopii pole
    const newTeachers = [...teachers];

    // Provedeme prohození (Swap) v poli
    const temp = newTeachers[index];
    newTeachers[index] = newTeachers[index + direction];
    newTeachers[index + direction] = temp;

    // Nyní všem přiřadíme nový sort_order podle aktuálního pořadí zleva doprava
    newTeachers.forEach((t, i) => {
      t.sort_order = i;
    });

    // Vizuálně okamžitě aktualizujeme web (aby to nedělalo latenci)
    setTeachers(newTeachers);

    // Na pozadí pošleme sérii updatů do databáze
    try {
      await Promise.all(newTeachers.map(t =>
        supabase.from('tutors').update({ sort_order: t.sort_order }).eq('id', t.id)
      ));
    } catch (err) {
      console.error("Chyba při přesouvání karet:", err);
      setModal({ isOpen: true, title: 'Chyba serveru', message: 'Nepodařilo se trvale uložit nové pořadí.', type: 'danger' });
    }
  };

  // 1. NEZÁVISLÁ ANIMACE HERO SEKCE (Spustí se okamžitě, nečeká na databázi)
  useGSAP(() => {
    // 0. Okamžité skrytí prvků
    gsap.set(['.online-hero-badge', '.online-hero-title', '.online-hero-desc', '.online-hero-image-wrapper', '.online-scroll-indicator'], { opacity: 0, y: 40 });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.timeScale(0.65); // Globálně zpomalí animaci hero sekce na 65% rychlost

    tl.fromTo('.online-hero-badge',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.1 }
    )
      .fromTo('.online-hero-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=0.7" // Překryv
      )
      .fromTo('.online-hero-desc',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=0.9" // Ještě větší překryv, aby to na sebe hezky navazovalo
      )
      .fromTo('.online-hero-image-wrapper',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=1.0" // Obrázek vyjede elegantně společně s textem
      )
      .fromTo('.online-scroll-indicator',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, clearProps: "transform" },
        "-=0.8"
      );
  }, { scope: container });

  // 2. AKTUALIZACE SCROLLTRIGGERU PO NAČTENÍ DAT (BEZ ANIMACE KARET)
  useGSAP(() => {
    if (loading) return;

    setTimeout(() => {
      // GENIÁLNÍ OPRAVA CHYBY FOOTERU - Refresh rozložení stránky po vyrenderování karet
      ScrollTrigger.refresh();
    }, 100);
  }, { scope: container, dependencies: [loading, teachers] });

  // 3. Spolehlivé scrollování po načtení dat
  useEffect(() => {
    if (loading) return;

    setTimeout(() => {
      if (location.hash === '#lektori') {
        const el = document.getElementById('lektori');
        if (el) {
          // Posun o 50px místo původních -120px zajistí, že to sjede "víc dolů" přesně jak chceš.
          const y = el.getBoundingClientRect().top + window.scrollY - 50;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      } else {
        window.scrollTo(0, 0);
      }
    }, 300); // 300ms čekání na vykreslení a inicializaci DOMu
  }, [loading, location.hash]);

  // Ověření, zdali už lektor má viditelnou/existující kartu
  const myCardExists = sessionUser ? teachers.some(t => t.id === sessionUser.id) : false;

  return (
    <div className="online-page-wrapper" ref={container}>

      {/* Plovoucí Lektorský Panel nahoře - viditelný pouze pro přihlášeného lektora */}
      {sessionUser && (
        <div className="admin-floating-banner">
          {/* Hack pro plynulé posunutí Navbaru dolů ANIMOVANĚ (bude podchycen i v CSS pro mobily) */}
          <style>{`.navbar { top: var(--navbar-offset, 65px) !important; transition: top 0.4s ease-out !important; }`}</style>

          <div className="afb-info">
            <span className="afb-info-role">{sessionUser.email === 'ondra.zeman05@gmail.com' ? 'MASTER ADMIN' : 'Lektorský režim zapnut'}</span>
          </div>

          <div className="afb-actions">
            {sessionUser.email === 'ondra.zeman05@gmail.com' && (
              <Link to="/portal/admin" className="afb-btn-link">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>settings</span> Zpět do Administrace
              </Link>
            )}
            <button onClick={handleLogout} className="afb-btn-logout">
              Odhlásit se a zavřít režim
            </button>
          </div>
        </div>
      )}

      {/* Mini Hero pro Online Stránku (s masivnějším posunutím od Navbaru) */}
      <section className="online-hero-section" style={{ paddingTop: sessionUser ? '200px' : '100px' }}>
        <div className="online-organic-bg"></div>
        <div className="online-hero-content">
          <div className="online-hero-text">
            <Link to="/portal" className="online-hero-badge" style={{ textDecoration: 'none', cursor: 'pointer', color: 'var(--tp-green)' }} title="Vstup pro lektory">Online výuka</Link>
            <h1 className="online-hero-title">Učte se kdykoliv,<br />odkudkoliv.</h1>
            <p className="online-hero-desc">
              Vyberte si lektora, který vám sedí, domluvte hodinu podle svého rozvrhu — a učte se odkudkoliv, bez zbytečného dojíždění.
            </p>
            <div className="btn btn-primary online-scroll-indicator" onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' })}>
              <span>Prohlédnout lektory</span>
              <span className="material-symbols-outlined scroll-arrow" style={{ fontSize: '1.2rem' }}>arrow_downward</span>
            </div>
          </div>
          <div className="online-hero-image-wrapper">
            <div className="online-hero-shadow"></div>
            <img src="/online sunrise.webp" alt="Online výuka" fetchpriority="high" loading="eager" />
          </div>
        </div>
      </section>

      {/* Seznam Lektorů načítaných z Databáze */}
      <section className="online-teachers-section" id="lektori">
        <div className="online-teachers-grid">

          {/* Obrovské tlačítko na vytvoření pro Lektora, který ještě NÁMÁ kartu */}
          {sessionUser && sessionUser.email !== 'ondra.zeman05@gmail.com' && !myCardExists && !loading && (
            <div style={{
              gridColumn: '1 / -1',
              background: 'rgba(239, 103, 165, 0.05)',
              border: '2px dashed var(--color-magenta)',
              borderRadius: '16px',
              padding: '4rem 2rem',
              textAlign: 'center'
            }}>
              <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Zatím tu nemáte svou osobní stránku.</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>Vytvořte si svou prezentační vizitku, vyplňte údaje a začněte se nabízet našim klientům.</p>
              <button onClick={handleCreateNewCard} className="btn-primary" style={{ cursor: 'pointer', fontSize: '1.2rem' }}>
                + Vytvořit novou stránku a začít
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#888' }}>Načítání lektorů ze systému...</div>
          ) : teachers.length === 0 && !sessionUser ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#888' }}>Zatím zde nejsou publikováni žádní lektoři.</div>
          ) : (
            teachers.map((teacher, index) => (
              <div className="online-teacher-card" key={teacher.id} style={
                sessionUser && sessionUser.id === teacher.id
                  ? { border: '2px solid var(--color-magenta)', transform: 'scale(1.02)' }
                  : {}
              }>

                {/* OVLÁDÁNÍ POŘADÍ PRO ADMINA */}
                {sessionUser?.email === 'ondra.zeman05@gmail.com' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#222', padding: '0.5rem 1rem', borderTopLeftRadius: '14px', borderTopRightRadius: '14px' }}>
                    <span style={{ color: '#bbb', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', margin: 'auto 0' }}>Pořadí karet</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleMoveTutor(index, -1)}
                        disabled={index === 0}
                        style={{ background: '#444', color: 'white', border: 'none', borderRadius: '4px', cursor: index === 0 ? 'not-allowed' : 'pointer', padding: '2px 8px' }}
                        title="Posunout více doleva (výš v seznamu)"
                      >▲</button>
                      <button
                        onClick={() => handleMoveTutor(index, 1)}
                        disabled={index === teachers.length - 1}
                        style={{ background: '#444', color: 'white', border: 'none', borderRadius: '4px', cursor: index === teachers.length - 1 ? 'not-allowed' : 'pointer', padding: '2px 8px' }}
                        title="Posunout více doprava (níž v seznamu)"
                      >▼</button>
                    </div>
                  </div>
                )}

                {/* Označení "Moje Karta" */}
                {sessionUser && sessionUser.id === teacher.id && (
                  <div style={{ background: 'var(--color-magenta)', color: 'white', textAlign: 'center', padding: '0.4rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderTopLeftRadius: sessionUser?.email === 'ondra.zeman05@gmail.com' ? '0' : '14px', borderTopRightRadius: sessionUser?.email === 'ondra.zeman05@gmail.com' ? '0' : '14px' }}>
                    Vaše vizitka
                  </div>
                )}

                <div className="otc-header" style={{ paddingTop: sessionUser && sessionUser.id === teacher.id ? '1rem' : '2rem' }}>
                  <div className="otc-photo-wrapper">
                    {teacher.photo_url ? (
                      <img src={teacher.photo_url} alt={teacher.name} className="otc-photo" loading="lazy" />
                    ) : (
                      <div className="otc-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', width: '100%', height: '100%', borderRadius: 'inherit' }}>
                        <span style={{ fontSize: '2rem', color: '#aaa' }}>?</span>
                      </div>
                    )}
                  </div>
                  <div className="otc-header-text">
                    {teacher.subject && <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{teacher.subject}</div>}
                    <h3 className="otc-name">{teacher.name || 'Jméno neuvedeno'}</h3>
                    <div className="otc-price-badge" style={teacher.services && teacher.services.length > 0 && teacher.services[0].price.toLowerCase().includes('zdarma') ? { background: 'rgba(76, 175, 80, 0.1)', color: 'var(--tp-green, #2e7d32)' } : {}}>
                      {teacher.services && teacher.services.length > 0 ? (
                        teacher.services[0].price.toLowerCase().includes('zdarma') ? (
                          <>
                            <span className="material-symbols-outlined otc-badge-icon">volunteer_activism</span>
                            První lekce je zdarma
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined otc-badge-icon">payments</span>
                            {teacher.services[0].price} / {teacher.services[0].minutes || 60} min.
                          </>
                        )
                      ) : (
                        <>
                          <span className="material-symbols-outlined otc-badge-icon">payments</span>
                          Cena neuvedena
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="otc-body">
                  <h4 className="otc-why-title">Krátké představení</h4>
                  <p className="otc-reason">{teacher.short_reason}</p>
                </div>

                <div className="otc-footer">
                  <div className="otc-times-dynamic" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', letterSpacing: '0.5rem, ' }}>Volné termíny</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {getNearestSlots(teacher.schedule).length > 0 ? getNearestSlots(teacher.schedule).map((slot, i) => (
                        <div key={i} style={{ background: 'rgba(76, 175, 80, 0.1)', color: 'var(--tp-green, #2e7d32)', border: '1px solid rgba(76, 175, 80, 0.2)', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>event_available</span>
                          {slot.day} • {slot.from}
                        </div>
                      )) : <div style={{ fontSize: '0.8rem', color: '#888' }}>Bez volných termínů</div>}
                    </div>
                  </div>

                  {/* Tlačítka se mění podle toho, jestli je to moje karta nebo cizí (Nebo Master Admin) */}
                  {sessionUser && (sessionUser.id === teacher.id || sessionUser.email === 'ondra.zeman05@gmail.com') ? (
                    <Link to={`/portal/editor${sessionUser.email === 'ondra.zeman05@gmail.com' ? `?editId=${teacher.id}` : ''}`} className="btn-primary otc-profile-btn" style={{ textDecoration: 'none', textAlign: 'center', background: sessionUser.email === 'ondra.zeman05@gmail.com' ? 'var(--color-primary)' : '' }}>
                      {sessionUser.email === 'ondra.zeman05@gmail.com' ? 'Upravit profil (Admin)' : 'Upravit profil'}
                    </Link>
                  ) : (
                    <Link to={`/lektor/${teacher.id}`} className="btn-primary otc-profile-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
                      Zobrazit profil
                    </Link>
                  )}

                </div>

              </div>
            ))
          )}

        </div>
      </section>

      <CustomModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={modal.onConfirm}
        onClose={() => {
          setModal({ ...modal, isOpen: false });
          if (modal.onClose) modal.onClose();
        }}
      />
    </div>
  );
};

export default OnlinePage;
