import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CustomModal from '../components/CustomModal';
import CalendarPicker from '../components/CalendarPicker';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/canvasUtils';
import './LektorEditor.css';

const LektorEditorPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ isOpen: false });
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Crop image states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const getNearestSlots = (schedule) => {
    if (!schedule || schedule.length === 0) return [];
    const daysMap = { 'Neděle':0, 'Pondělí':1, 'Úterý':2, 'Středa':3, 'Čtvrtek':4, 'Pátek':5, 'Sobota':6 };
    const currentDay = new Date().getDay();
    const currentHour = new Date().getHours();
    const currentMin = new Date().getMinutes();

    let allSlots = [];
    schedule.forEach(dayItem => {
      const dayIdx = daysMap[dayItem.day];
      if (dayIdx !== undefined && dayItem.slots) {
        dayItem.slots.forEach(slot => {
          let diff = dayIdx - currentDay;
          const [slotH, slotM] = slot.from.split(':').map(Number);
          if (diff < 0 || (diff === 0 && (slotH < currentHour || (slotH === currentHour && slotM < currentMin)))) {
            diff += 7;
          }
          allSlots.push({ day: dayItem.day, from: slot.from, diffDays: diff, h: slotH, m: slotM });
        });
      }
    });

    allSlots.sort((a, b) => {
      if (a.diffDays !== b.diffDays) return a.diffDays - b.diffDays;
      if (a.h !== b.h) return a.h - b.h;
      return a.m - b.m;
    });

    return allSlots.slice(0, 2);
  };

  const [formData, setFormData] = useState({
    name: '',
    photoUrl: '',
    subject: '',
    location: '',
    is_visible: true,
    accepting_students: true,
    target_group: '',
    level: '',
    specializations: '',
    price: '',
    times: '',
    reason: '',
    services: [], // Pole objektů { id, title, price, desc }
    reviews: [], // Pole objektů { id, author, text }
    philosophy_sections: [], // Pole { id, categoryName, heading, body }
    schedule: [] // Pole { id, day, slots: [{ id, from, to }] }
  });

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  const checkUserAndFetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/portal');
      return;
    }
    setUser(session.user);
    
    // Zjisti jestli editujeme cizi kartu jako Master Admin
    const queryParams = new URLSearchParams(window.location.search);
    const editId = queryParams.get('editId');
    const targetId = (session.user.email === 'info@sunrise-la.cz' && editId) ? editId : session.user.id;

    const { data: profile } = await supabase
      .from('tutors')
      .select('*')
      .eq('id', targetId)
      .single();

    if (profile) {
      setFormData({
        name: profile.name || '',
        photoUrl: profile.photo_url || '',
        subject: profile.subject || '',
        location: profile.location || '',
        is_visible: (profile.is_visible !== false && profile.is_visible !== 'false' && profile.is_visible !== 'FALSE'),
        accepting_students: profile.accepting_students !== null && profile.accepting_students !== undefined ? profile.accepting_students : true,
        target_group: profile.target_group || '',
        level: profile.level || '',
        specializations: profile.specializations || '',
        price: profile.price || '',
        times: profile.times || '',
        reason: profile.short_reason || '',
        services: profile.services || [],
        reviews: profile.reviews || [],
        philosophy_sections: profile.philosophy_sections || [],
        schedule: profile.schedule || []
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // --- OVLÁDÁNÍ FOTKY A OŘEZU ---
  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setIsCropModalOpen(true);
    }
  };

  const showCroppedImage = async () => {
    try {
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      // Ukládám to do formData jako base64 data string (rychle a bezpečné doručení)
      setFormData({...formData, photoUrl: croppedImageBase64});
      setIsCropModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  // --- OVLÁDÁNÍ DYNAMICKÝCH POLÍ (PROČ SE MNOU?) ---
  const addPhilosophySection = () => {
    setFormData({
      ...formData,
      philosophy_sections: [...formData.philosophy_sections, { id: Date.now(), categoryName: '', heading: '', body: '' }]
    });
  };
  const handlePhilosophyChange = (id, field, value) => {
    const updated = formData.philosophy_sections.map(s => s.id === id ? { ...s, [field]: value } : s);
    setFormData({ ...formData, philosophy_sections: updated });
  };
  const removePhilosophySection = (id) => {
    setFormData({ ...formData, philosophy_sections: formData.philosophy_sections.filter(s => s.id !== id) });
  };

  // --- OVLÁDÁNÍ DYNAMICKÝCH POLÍ (VOLNÉ TERMÍNY) ---
  const addScheduleDay = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { id: Date.now(), day: '', slots: [{ id: Date.now()+1, from: '10:00', to: '11:00', isBooked: false }] }]
    });
  };

  const handleDateSelectFromCalendar = (dateStr) => {
    const exists = formData.schedule.find(d => d.day === dateStr);
    if (!exists) {
      setFormData({
        ...formData,
        schedule: [...formData.schedule, { id: Date.now(), day: dateStr, slots: [] }]
      });
    }
    setShowCalendar(false);
  };

  const addScheduleSlot = (dayId) => {
    const updated = formData.schedule.map(d => 
      d.id === dayId ? { ...d, slots: [...d.slots, { id: Date.now(), from: '', to: '' }] } : d
    );
    setFormData({ ...formData, schedule: updated });
  };
  const handleScheduleDayChange = (dayId, value) => {
    const updated = formData.schedule.map(d => d.id === dayId ? { ...d, day: value } : d);
    setFormData({ ...formData, schedule: updated });
  };
  const handleScheduleSlotChange = (dayId, slotId, field, value) => {
    const updated = formData.schedule.map(d => {
      if (d.id === dayId) {
        const upSlots = d.slots.map(s => s.id === slotId ? { ...s, [field]: value } : s);
        return { ...d, slots: upSlots };
      }
      return d;
    });
    setFormData({ ...formData, schedule: updated });
  };
  const removeScheduleDay = (dayId) => {
    setFormData({ ...formData, schedule: formData.schedule.filter(d => d.id !== dayId) });
  };
  const removeScheduleSlot = (dayId, slotId) => {
    const updated = formData.schedule.map(d => {
      if (d.id === dayId) {
        return { ...d, slots: d.slots.filter(s => s.id !== slotId) };
      }
      return d;
    });
    setFormData({ ...formData, schedule: updated });
  };

  // --- OVLÁDÁNÍ DYNAMICKÝCH POLÍ (SLUŽBY) ---
  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { id: Date.now(), title: '', price: '', minutes: '', desc: '', lessons_count: '1' }]
    });
  };
  const handleServiceChange = (id, field, value) => {
    const updated = formData.services.map(s => s.id === id ? { ...s, [field]: value } : s);
    setFormData({ ...formData, services: updated });
  };
  const removeService = (id) => {
    setFormData({ ...formData, services: formData.services.filter(s => s.id !== id) });
  };
  const handleMoveService = (index, direction) => {
    if (index + direction < 0 || index + direction >= formData.services.length) return;
    const newServices = [...formData.services];
    const temp = newServices[index];
    newServices[index] = newServices[index + direction];
    newServices[index + direction] = temp;
    setFormData({ ...formData, services: newServices });
  };

  // --- OVLÁDÁNÍ DYNAMICKÝCH POLÍ (RECENZE) ---
  const removeReview = (id) => {
    setFormData({ ...formData, reviews: formData.reviews.filter(r => r.id !== id) });
  };
  // --- AKCE ODESÍLÁNÍ A MAZÁNÍ ---
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const queryParams = new URLSearchParams(window.location.search);
    const editId = queryParams.get('editId');
    const targetId = (user.email === 'info@sunrise-la.cz' && editId) ? editId : user.id;

    const { error } = await supabase
      .from('tutors')
      .update({
        name: formData.name,
        photo_url: formData.photoUrl,
        is_visible: formData.is_visible,
        subject: formData.subject,
        location: formData.location,
        accepting_students: formData.accepting_students,
        target_group: formData.target_group,
        level: formData.level,
        specializations: formData.specializations,
        price: formData.price,
        times: formData.times,
        short_reason: formData.reason,
        services: formData.services,
        reviews: formData.reviews,
        philosophy_sections: formData.philosophy_sections,
        schedule: formData.schedule
      })
      .eq('id', targetId);

    setSaving(false);
    if (error) {
      setModal({ isOpen: true, title: 'Chyba při ukládání', message: error.message, type: 'danger' });
    } else {
      setModal({ 
        isOpen: true, 
        title: formData.is_visible ? 'Úspěšně publikováno' : 'Uloženo (zatím skryto)', 
        message: formData.is_visible 
          ? 'Všechny úpravy byly nahrány a Vaše karta je nyní veřejně viditelná pro všechny návštěvníky webu.'
          : 'Vaše úpravy byly uloženy, ale karta zůstává před veřejností skrytá. Kdykoliv ji můžete zapnout, až budete chtít být vidět.', 
        type: 'success' 
      });
    }
  };

  const handleResetProfile = () => {
    setModal({
      isOpen: true,
      title: 'Zamaskovat a smazat profil?',
      message: 'FATÁLNÍ KROK! Jste si jistí? Tohle úplně vymaže Vaši kartu z databáze lektorů a klienti Vás nenajdou. Zítra si tu popřípadě můžete založit novou.',
      type: 'danger',
      confirmText: 'Ano, smazat kartu',
      onConfirm: executeResetProfile
    });
  };

  const executeResetProfile = async () => {
    setSaving(true);
    
    const queryParams = new URLSearchParams(window.location.search);
    const editId = queryParams.get('editId');
    const targetId = (user.email === 'info@sunrise-la.cz' && editId) ? editId : user.id;

    // Kompletní výmaz karty i autentizačního profilu
    const { error } = await supabase.rpc('delete_user_safe', { target_uuid: targetId });
    
    setSaving(false);
    
    if (error) {
      setModal({ isOpen: true, title: 'Chyba při mazání', message: error.message, type: 'danger' });
    } else {
      setModal({ 
        isOpen: true, 
        title: 'Vymazáno', 
        message: 'Veškerá administrátorská a veřejná data této vizitky byla vyhlazena, a to včetně přihlašovacího jména (e-mailu) a osobní složky. Účet již v systému neexistuje.', 
        type: 'info',
        onClose: () => navigate('/online') 
      });
    }
  };

  const handleGoBack = () => {
    navigate('/online');
  };

  if (loading) return <div style={{padding: '5rem', textAlign: 'center'}}>Načítám Váš profil...</div>;

  return (
    <div className="editor-wrapper">
      <header className="editor-header">
        <div className="editor-title">
          <h1>Upravit můj profil lektora</h1>
          <p>Tento panel vidíte pouze Vy. Vše co zde napíšete buduje Vaši osobní stránku.</p>
        </div>
        <button onClick={handleGoBack} className="logout-btn" style={{border: 'none', cursor: 'pointer'}}>
          <span className="material-symbols-outlined">arrow_back</span> Zpět do režimu prohlížení
        </button>
      </header>

      <div className="editor-container">
        
        {/* LEVÁ ČÁST - Formuláře k vyplnění (Templaty) */}
        <div className="editor-form-col">
          <form onSubmit={handleSave}>
            
            <h3 className="editor-section-title">1. Základní identifikace</h3>

            <div className="form-group" style={{ background: 'var(--color-primary, #000)', padding: '1.5rem', borderRadius: '12px', color: 'white', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <label style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1rem', display: 'block' }}>Viditelnost Vaší karty na webu</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={formData.is_visible} 
                      onChange={e => setFormData({...formData, is_visible: e.target.checked})} 
                    />
                    <span className="toggle-slider"></span>
                  </div>
                  {formData.is_visible ? 'Karta je ZAPNUTÁ (Viditelná všem)' : 'Karta je SKRYTÁ (Vidíte ji jen Vy)'}
                </label>
              </div>
              <p style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: '0.8rem', marginBottom: 0, lineHeight: 1.4 }}>
                Pokud kartu skryjete, úplně zmizí ze sekce Online výuka pro všechny návštěvníky. Můžete si tak v klidu editovat údaje, aniž by to někdo viděl.
              </p>
            </div>

            <div className="form-group">
              <label>Profilová fotka obličeje</label>
              <div style={{display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap'}}>
                {!formData.photoUrl ? (
                  <input type="file" accept="image/*" onChange={onFileChange} style={{border:'1px dashed #ccc', padding:'1rem', borderRadius:'8px', cursor:'pointer'}}/>
                ) : (
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <img src={formData.photoUrl} alt="Náhled" style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--tp-pink)'}} />
                    <button type="button" onClick={() => { setImageSrc(formData.photoUrl); setIsCropModalOpen(true); }} style={{background: 'var(--tp-pink)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold'}}>
                      <span className="material-symbols-outlined" style={{fontSize: '1.2rem'}}>crop</span> Upravit ořez
                    </button>
                    <button type="button" onClick={() => setFormData({...formData, photoUrl: ''})} style={{background: 'red', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold'}}>
                      <span className="material-symbols-outlined" style={{fontSize: '1.2rem'}}>delete</span> Smazat
                    </button>
                  </div>
                )}
              </div>
              <p style={{fontSize:'0.7rem', color:'#888', marginTop:'0.5rem'}}>Vyberte fotku ze složky počítače. Otevře se Vám ořezávačka ve stylu Instagramu.</p>
            </div>

            <div className="form-group">
              <label>Zobrazované jméno</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Místo, kde učím</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Např. Online výuka, Výuka v jazykovce..." />
              </div>
              <div className="form-group">
                <label>Nábor nových studentů</label>
                <select 
                  name="accepting_students" 
                  value={formData.accepting_students != null ? formData.accepting_students.toString() : 'true'} 
                  onChange={e => setFormData({...formData, accepting_students: e.target.value === 'true'})} 
                  style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid #ccc', fontSize:'1rem'}}
                >
                  <option value={'true'}>Přijímá nové studenty</option>
                  <option value={'false'}>Nepřijímá nové studenty</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Krátký citát (1 věta pod jméno)</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} style={{minHeight: '80px'}} placeholder="Jedna stručná věta, která Vás vystihuje..." />
            </div>

            <h3 className="editor-section-title" style={{marginTop:'3rem'}}>2. Detailní specifikace</h3>
            <div className="form-group">
              <label>Jaké jazyky učím</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Např. Angličtina, Němčina" />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Pro koho (Cílová skupina)</label>
                <input type="text" name="target_group" value={formData.target_group} onChange={handleChange} placeholder="Např. Dospělí, teenageři" />
              </div>
              <div className="form-group">
                <label>Úroveň studentů</label>
                <input type="text" name="level" value={formData.level} onChange={handleChange} placeholder="Např. Začátečníci, B1, C2" />
              </div>
            </div>
            <div className="form-group">
              <label>Specializace (Oddělené čárkou, klíčová slova)</label>
              <input type="text" name="specializations" value={formData.specializations} onChange={handleChange} placeholder="Např. Gramatika, Odborná angličtina, Konverzace..." />
            </div>

            <h3 className="editor-section-title" style={{marginTop:'3rem'}}>3. Tělo profilu (Sekce "Proč si vybrat mě?" apod.)</h3>
            <p style={{fontSize:'0.8rem', color:'#666', marginBottom:'1rem'}}>Přidejte vlastní bloky textu (např. "Moje filozofie", "Jak probíhá lekce", "Zkušenosti"). Můžete si přidat libovolný počet.</p>
            {formData.philosophy_sections.map((sect) => (
              <div key={sect.id} style={{padding:'1rem', background:'#fdfdfd', border:'1px solid #eee', borderRadius:'12px', marginBottom:'1rem'}}>
                <div style={{display:'flex', gap:'1rem', marginBottom:'0.5rem', flexWrap:'wrap', alignItems:'center'}}>
                  <input type="text" placeholder="Podnadpis (např. VZDĚLÁNÍ)" value={sect.categoryName} onChange={e => handlePhilosophyChange(sect.id, 'categoryName', e.target.value)} style={{flex:'1 1 120px', padding:'0.5rem', borderRadius:'6px', border:'1px solid #ccc'}} />
                  <input type="text" placeholder="Nadpis (např. Vystudoval jsem v USA)" value={sect.heading} onChange={e => handlePhilosophyChange(sect.id, 'heading', e.target.value)} style={{flex:'2 1 200px', padding:'0.5rem', borderRadius:'6px', border:'1px solid #ccc'}} />
                  <button type="button" onClick={() => removePhilosophySection(sect.id)} style={{background:'red', color:'white', padding:'0.5rem', borderRadius:'6px', border:'none', cursor:'pointer', flexShrink:0}} title="Smazat blok">X</button>
                </div>
                <textarea placeholder="Hlavní popis sekce..." value={sect.body} onChange={e => handlePhilosophyChange(sect.id, 'body', e.target.value)} style={{width:'100%', minHeight:'80px', padding:'0.5rem', borderRadius:'6px', border:'1px solid #ccc'}} />
              </div>
            ))}
            <button type="button" onClick={addPhilosophySection} style={{background:'none', border:'1px dashed var(--color-primary)', color:'var(--color-primary)', padding:'0.5rem 1rem', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
              + Přidat nový blok textu
            </button>

            {/* NOVÉ - DYNAMICKÉ SLUŽBY Lektora */}
            <h3 className="editor-section-title" style={{marginTop:'3rem'}}>4. Konkrétní Nabízené Služby</h3>
            <p style={{fontSize:'0.8rem', color:'#666', marginBottom:'1rem'}}>Přidejte konkrétní balíčky. PRVNÍ balíček ze seznamu se vždy použije pro zobrazení úvodní cenovky v katalogu! Pořadí služeb si můžete posouvat pomocí šipek u každé služby.</p>
            {formData.services.map((svc, index) => (
              <div key={svc.id} style={{padding:'1rem', background:'#fdfdfd', border:'1px solid #eee', borderRadius:'12px', marginBottom:'1rem'}}>
                <div style={{display:'flex', gap:'1rem', marginBottom:'0.5rem', flexWrap:'wrap', alignItems:'center'}}>
                  <input type="text" placeholder="Název kurzu/služby" value={svc.title} onChange={e => handleServiceChange(svc.id, 'title', e.target.value)} style={{flex:'2 1 200px', padding:'0.5rem', borderRadius:'6px', border:'1px solid #ccc'}} />
                  <input 
                    type="number" 
                    min="1" 
                    placeholder="Počet lekcí (např. 1 nebo 10)" 
                    value={svc.price.toLowerCase().includes('zdarma') ? '1' : (svc.lessons_count || '1')} 
                    onChange={e => handleServiceChange(svc.id, 'lessons_count', e.target.value)} 
                    disabled={svc.price.toLowerCase().includes('zdarma')}
                    style={{
                      flex:'1 1 100px', 
                      padding:'0.5rem', 
                      borderRadius:'6px', 
                      border:'1px solid #ccc',
                      opacity: svc.price.toLowerCase().includes('zdarma') ? 0.5 : 1,
                      cursor: svc.price.toLowerCase().includes('zdarma') ? 'not-allowed' : 'text'
                    }} 
                    title={svc.price.toLowerCase().includes('zdarma') ? "Bezplatné úvodní schůzky nelze seskupovat do balíčků" : "Kolik lekcí tento balíček obsahuje (1 pro běžnou službu, více pro výhodný balíček)"} 
                  />
                  <input type="text" placeholder="Cena celkem (např. 700 Kč)" value={svc.price} onChange={e => handleServiceChange(svc.id, 'price', e.target.value)} style={{flex:'1 1 120px', padding:'0.5rem', borderRadius:'6px', border:'1px solid #ccc'}} />
                  <input type="text" placeholder="Minuty jedné lekce (např. 60)" value={svc.minutes || ''} onChange={e => handleServiceChange(svc.id, 'minutes', e.target.value)} style={{flex:'1 1 100px', padding:'0.5rem', borderRadius:'6px', border:'1px solid #ccc'}} />
                </div>
                <div style={{display:'flex', gap:'1rem', alignItems:'flex-start'}}>
                  <textarea placeholder="Popis toho, co služba obsahuje" value={svc.desc} onChange={e => handleServiceChange(svc.id, 'desc', e.target.value)} style={{flexGrow:1, minHeight:'60px', padding:'0.5rem', borderRadius:'6px', border:'1px solid #ccc'}} />
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
                    <div style={{display: 'flex', gap: '0.4rem'}}>
                      <button type="button" onClick={() => handleMoveService(index, -1)} disabled={index === 0} style={{background:'#eee', color:'#333', padding:'0.4rem', borderRadius:'6px', border:'1px solid #ccc', cursor: index === 0 ? 'not-allowed' : 'pointer', flex: 1}} title="Posunout službu výše">▲</button>
                      <button type="button" onClick={() => handleMoveService(index, 1)} disabled={index === formData.services.length - 1} style={{background:'#eee', color:'#333', padding:'0.4rem', borderRadius:'6px', border:'1px solid #ccc', cursor: index === formData.services.length - 1 ? 'not-allowed' : 'pointer', flex: 1}} title="Posunout službu níže">▼</button>
                    </div>
                    <button type="button" onClick={() => removeService(svc.id)} style={{background:'red', color:'white', padding:'0.4rem', borderRadius:'6px', border:'none', cursor:'pointer', display: 'flex', justifyContent: 'center'}} title="Smazat službu"><span className="material-symbols-outlined" style={{fontSize:'1.1rem'}}>delete</span></button>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addService} style={{background:'none', border:'1px dashed var(--color-primary)', color:'var(--color-primary)', padding:'0.5rem 1rem', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
              + Přidat nabídku služby
            </button>

            {/* NOVÉ - RECENZE */}
            <h3 className="editor-section-title" style={{marginTop:'3rem'}}>5. Zákaznické Recenze</h3>
            <p style={{fontSize:'0.8rem', color:'#666', marginBottom:'1rem'}}>Přehled recenzí ze stránky lektora. Máte možnost nevhodné či spamově recenze pouze odstranit.</p>
            {formData.reviews.length === 0 ? <p style={{color: '#999', fontSize: '0.9rem'}}>Zatím žádné recenze.</p> : null}
            {formData.reviews.map((rev) => (
              <div key={rev.id} style={{padding:'1rem', background:'#fdfdfd', border:'1px solid #eee', borderRadius:'12px', marginBottom:'1rem'}}>
                <div style={{display:'flex', gap:'1rem', alignItems:'flex-start'}}>
                  <div style={{flexGrow: 1}}>
                    <strong style={{display: 'block'}}>{rev.author}</strong>
                    <span style={{fontSize: '0.8rem', color: '#666', display: 'block'}}>{rev.role}</span>
                    <p style={{marginTop: '0.5rem', marginBottom: 0, fontStyle: 'italic'}}>"{rev.text}"</p>
                  </div>
                  <button type="button" onClick={() => removeReview(rev.id)} style={{background:'red', color:'white', padding:'0.5rem', borderRadius:'6px', border:'none', cursor:'pointer'}} title="Smazat recenzi"><span className="material-symbols-outlined" style={{fontSize:'1.1rem'}}>delete</span></button>
                </div>
              </div>
            ))}
            {/* NOVÉ - VOLNÉ TERMÍNY */}
            <h3 className="editor-section-title" style={{marginTop:'3rem'}}>6. Volné termíny lekcí (Kalendář)</h3>
            <p style={{fontSize:'0.8rem', color:'#666', marginBottom:'1rem'}}>Přidejte konkrétní data z kalendáře a určete u nich volné bloky (např. od 10:00 do 10:30). Můžete plánovat na měsíce dopředu.</p>
            {formData.schedule.map((dayObj) => {
              let isPast = false;
              if (dayObj.day && dayObj.day.includes('-')) {
                const actualD = new Date();
                const [y, m, d] = dayObj.day.split('-');
                if (parseInt(y) < actualD.getFullYear() || 
                   (parseInt(y) === actualD.getFullYear() && parseInt(m) - 1 < actualD.getMonth()) ||
                   (parseInt(y) === actualD.getFullYear() && parseInt(m) - 1 === actualD.getMonth() && parseInt(d) < actualD.getDate())) {
                  isPast = true;
                }
              }

              return (
              <div key={dayObj.id} style={{padding:'1rem', background: isPast ? '#f0f0f0' : '#fdfdfd', border:'2px solid var(--tp-border)', borderRadius:'12px', marginBottom:'1.5rem', opacity: isPast ? 0.7 : 1}}>
                <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem', flexWrap:'wrap', background: isPast ? '#e0e0e0' : 'var(--tp-pink-light)', padding: '10px 15px', borderRadius: '8px'}}>
                  <span style={{fontSize: '1.2rem', fontWeight: 'bold', color: isPast ? '#666' : 'var(--tp-pink)'}}>
                    {dayObj.day.includes('-') ? (() => {
                      const [y, m, d] = dayObj.day.split('-');
                      return `${parseInt(d)}. ${parseInt(m)}. ${y}`;
                    })() : dayObj.day || 'Nové datum'}
                  </span>
                  <span style={{fontWeight:'bold', color: 'var(--tp-dark)', marginLeft: '1rem'}}>Vypsáno časů: {dayObj.slots.length}</span>
                  {isPast && <span style={{marginLeft: '1rem', color: '#555', fontSize: '0.85rem', fontStyle: 'italic', background: '#ccc', padding: '4px 8px', borderRadius: '4px'}}>Historický den</span>}
                  <button type="button" onClick={() => removeScheduleDay(dayObj.id)} style={{marginLeft:'auto', background:'transparent', color:'red', border:'none', cursor:'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px'}}><span className="material-symbols-outlined" style={{fontSize: '1.2rem'}}>delete</span> Odstranit celý den</button>
                </div>
                
                {dayObj.slots.map(slot => {
                  const isInvalid = !isPast && slot.from && slot.to && slot.to <= slot.from;
                  return (
                    <div key={slot.id} style={{marginBottom:'0.75rem', paddingLeft:'1rem'}}>
                      <div style={{display:'flex', gap:'0.5rem', alignItems:'center', flexWrap:'wrap'}}>
                        <span style={{fontSize:'0.9rem'}}>Od:</span> <input type="time" value={slot.from} onChange={e => handleScheduleSlotChange(dayObj.id, slot.id, 'from', e.target.value)} disabled={isPast} style={{flex:'1 1 90px', padding:'0.25rem', border:'1px solid #ccc', borderRadius:'4px', background: isPast ? '#eaeaea' : 'white', cursor: isPast ? 'not-allowed' : 'text'}}/>
                        <span style={{fontSize:'0.9rem'}}>Do:</span> <input id={`to-${slot.id}`} type="time" value={slot.to} onChange={e => handleScheduleSlotChange(dayObj.id, slot.id, 'to', e.target.value)} disabled={isPast} style={{flex:'1 1 90px', padding:'0.25rem', border: isInvalid ? '1px solid red' : '1px solid #ccc', borderRadius:'4px', background: isPast ? '#eaeaea' : 'white', cursor: isPast ? 'not-allowed' : 'text'}}/>
                        <label style={{display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.5rem', cursor: isPast ? 'not-allowed' : 'pointer', color: slot.isBooked ? 'red' : '#333'}}>
                          <input type="checkbox" checked={slot.isBooked || false} onChange={e => handleScheduleSlotChange(dayObj.id, slot.id, 'isBooked', e.target.checked)} disabled={isPast} />
                          <span style={{fontSize: '0.8rem'}}>Obsazeno</span>
                        </label>
                        {!isPast && <button type="button" onClick={() => removeScheduleSlot(dayObj.id, slot.id)} style={{background:'red', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', padding:'4px 10px', flexShrink:0, marginLeft: 'auto'}}>x</button>}
                      </div>
                      {isInvalid && <div style={{color: 'red', fontSize: '0.75rem', marginTop: '0.3rem'}}>⚠️ Pozor: Čas "Do" nesmí být před časem "Od".</div>}
                    </div>
                  );
                })}
                
                {!isPast && (
                  <button type="button" onClick={() => addScheduleSlot(dayObj.id)} style={{background:'none', border:'1px solid var(--tp-border)', color:'var(--tp-dark)', padding:'0.35rem 0.75rem', borderRadius:'6px', cursor:'pointer', fontSize:'0.85rem', marginTop:'0.5rem'}}>
                    + Přidat nový čas
                  </button>
                )}
              </div>
            )})}
            <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem'}}>
              {showCalendar ? (
                <div style={{background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', width: '100%', maxWidth: '420px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                    <strong style={{fontSize: '1rem', color: 'var(--tp-dark)'}}>Vyberte datum z kalendáře:</strong>
                    <button type="button" onClick={() => setShowCalendar(false)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#888', padding: '0 8px'}}>&times;</button>
                  </div>
                  <CalendarPicker onDateSelect={handleDateSelectFromCalendar} />
                </div>
              ) : (
                <button type="button" onClick={() => setShowCalendar(true)} style={{background:'var(--tp-pink)', border:'none', color:'white', padding:'0.8rem 1.5rem', borderRadius:'12px', cursor:'pointer', fontWeight:'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', boxShadow: '0 4px 10px rgba(239, 103, 165, 0.3)'}}>
                  <span className="material-symbols-outlined" style={{fontSize: '1.4rem'}}>calendar_month</span>
                  Vybrat datum a přidat termíny
                </button>
              )}
            </div>

            <div className="editor-action-bar" style={{marginTop:'4rem'}}>
              <button type="button" onClick={handleResetProfile} className="btn-delete" disabled={saving}>Smazat / Zamaskovat můj profil na webu</button>
              <button type="submit" className="btn btn-primary btn-save" disabled={saving}>
                {saving ? 'Ukládám...' : 'Publikovat Vlastní Úpravy'}
              </button>
            </div>
            
          </form>
        </div>

        {/* PRAVÁ ČÁST - Živý náhled finální karty */}
        <div className="editor-preview-col">
          <div className="preview-label">
            <span className="material-symbols-outlined shrink-0 text-[18px]">visibility</span>
            Vzhled Vaší malé karty
          </div>
          
          <div className="preview-card">
            <div className="preview-card-h">
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Avatar" className="preview-avatar" />
              ) : (
                <div className="preview-avatar" style={{display: 'flex', alignItems: 'center', justifyContent:'center'}}>?</div>
              )}
              
              <div>
                <div style={{fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 'bold'}}>{formData.subject}</div>
                <div className="preview-name">{formData.name}</div>
                <div className="preview-price" style={formData.services && formData.services.length > 0 && formData.services[0].price.toLowerCase().includes('zdarma') ? {background: 'rgba(76, 175, 80, 0.1)', color: 'var(--tp-green, #2e7d32)', padding: '0.4rem 0.8rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'} : {}}>
                  {formData.services && formData.services.length > 0 ? (
                    formData.services[0].price.toLowerCase().includes('zdarma') ? (
                      <>
                        <span className="material-symbols-outlined" style={{fontSize: '1.2rem'}}>volunteer_activism</span>
                        {formData.services[0].price}
                      </>
                    ) : (
                      <>{formData.services[0].price}{!formData.services[0].price.toLowerCase().includes('kč') ? ' Kč' : ''} {formData.services[0].lessons_count && parseInt(formData.services[0].lessons_count, 10) > 1 ? `/ ${formData.services[0].lessons_count} lekcí` : `/ ${formData.services[0].minutes || 60} min.`}</>
                    )
                  ) : (
                    'Cena neuvedena'
                  )}
                </div>
              </div>
            </div>
            
            <div className="preview-body">
              <p>{formData.reason}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem', width: '100%' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', letterSpacing: '0.5rem,' }}>Volné termíny</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {getNearestSlots(formData.schedule).length > 0 ? getNearestSlots(formData.schedule).map((slot, i) => (
                  <div key={i} style={{ background: 'rgba(76, 175, 80, 0.1)', color: 'var(--tp-green, #2e7d32)', border: '1px solid rgba(76, 175, 80, 0.2)', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span className="material-symbols-outlined" style={{fontSize: '1rem'}}>event_available</span>
                    {slot.day} • {slot.from}
                  </div>
                )) : <div style={{ fontSize: '0.8rem', color: '#888' }}>Bez volných termínů</div>}
              </div>
            </div>
          </div>
          
          {user && (
            <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
              <a href={`/lektor/${new URLSearchParams(window.location.search).get('editId') || user.id}`} target="_blank" rel="noreferrer" style={{color: 'var(--color-primary)', fontSize: '0.9rem', textDecoration: 'underline'}}>Otevřít živý náhled Velkého profilu ↗</a>
            </div>
          )}

        </div>

      </div>
      
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
          if(modal.onClose) modal.onClose();
        }}
      />

      {/* CROPPER MODAL (Nahrávání fotky) */}
      {isCropModalOpen && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.85)', zIndex:99999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
          <div style={{position:'relative', width:'90%', maxWidth:'400px', height:'400px', background:'#fff', borderRadius:'8px 8px 0 0', overflow:'hidden'}}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onCropComplete={(cA, cAP) => setCroppedAreaPixels(cAP)}
              onZoomChange={setZoom}
            />
          </div>
          <div style={{padding:'1.5rem', background:'#fff', borderRadius:'0 0 8px 8px', width:'90%', maxWidth:'400px'}}>
            <label style={{fontSize:'0.8rem', fontWeight:'bold', color:'#333'}}>Přiblížení (Zoom)</label>
            <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} style={{width:'100%', margin:'0.5rem 0 1.5rem'}} />
            <button onClick={showCroppedImage} style={{padding:'1rem', width:'100%', background:'var(--tp-pink)', color:'white', border:'none', borderRadius:'8px', fontWeight:'800', cursor:'pointer', textTransform:'uppercase'}}>Vyříznout a uložit</button>
            <button onClick={() => setIsCropModalOpen(false)} style={{padding:'0.5rem 1rem', width:'100%', background:'transparent', color:'#888', border:'none', cursor:'pointer', marginTop:'0.5rem', fontWeight:'bold'}}>Zrušit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LektorEditorPage;
