import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export default async (req, context) => {
  try {
    const url = new URL(req.url);
    const tutorEmail = url.searchParams.get('tutorEmail');
    const tutorName = url.searchParams.get('tutorName') || 'lektore';
    const customerName = url.searchParams.get('customerName') || 'Zákazník';
    const customerEmail = url.searchParams.get('customerEmail') || '';
    const customerPhone = url.searchParams.get('customerPhone') || 'Neuveden';
    const serviceName = url.searchParams.get('serviceName') || 'Lekce';
    const date = url.searchParams.get('date') || 'Neurčeno';
    const time = url.searchParams.get('time') || 'Neurčeno';
    const message = url.searchParams.get('message') || 'Bez zprávy';
    const tutorId = url.searchParams.get('tutorId');

    if (!tutorEmail) {
      return new Response('Chyba: E-mail lektora nebyl nalezen.', { status: 400 });
    }

    // --- BLOKACE TERMÍNU V SUPABASE ---
    let blockMessage = '';
    if (tutorId && date && date !== 'Neurčeno' && time && time !== 'Neurčeno' && time !== 'Dle textu zprávy') {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xzuevidfbeihrunoqhao.supabase.co';
      // Používáme VIP service_role klíč pro obejití RLS (bezpečnostních pravidel)
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dWV2aWRmYmVpaHJ1bm9xaGFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxMTU3MCwiZXhwIjoyMDkxMzg3NTcwfQ.uiAXkuvO-cHHohn0-JAJ3UrdsvE_LI_SCQ66rwqc6Io';
      
      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data: tutor, error: fetchError } = await supabase.from('tutors').select('schedule').eq('id', tutorId).single();
          
          if (fetchError) {
             console.error("Fetch error:", fetchError);
             blockMessage = `<p style="margin-top: 10px; color: red; font-weight: bold;">Chyba při hledání lektora v databázi: ${fetchError.message}</p>`;
          } else if (tutor && tutor.schedule) {
            let updated = false;
            const newSchedule = tutor.schedule.map(dayObj => {
              // Hledáme konkrétní den podle formátu, date může být např. "12. 5. 2026"
              // Ale v databázi je day často "2026-05-12". Uvidíme, musíme porovnat nebo spoléhat na to, že frontend poslal správný formát
              // V TutorProfilePage.jsx je selectedCalendarDate obvykle ve formátu YYYY-MM-DD
              if (dayObj.day === date) {
                const newSlots = dayObj.slots.map(slot => {
                  const slotTime = `${slot.from} - ${slot.to}`;
                  if (slotTime === time) {
                    updated = true;
                    return { ...slot, isBooked: true }; // Zablokování termínu!
                  }
                  return slot;
                });
                return { ...dayObj, slots: newSlots };
              }
              return dayObj;
            });

            if (updated) {
              const { error: updateError } = await supabase.from('tutors').update({ schedule: newSchedule }).eq('id', tutorId);
              if (updateError) {
                 console.error("Update error:", updateError);
                 blockMessage = `<p style="margin-top: 10px; color: red; font-weight: bold;">Termín se nepodařilo zablokovat (Chyba RLS/Práv databáze): ${updateError.message}</p>`;
              } else {
                 blockMessage = `<p style="margin-top: 10px; color: #1C9C73; font-weight: bold;">Vybraný termín (${date} v ${time}) byl v kalendáři úspěšně zablokován!</p>`;
              }
            } else {
              blockMessage = `<p style="margin-top: 10px; color: orange; font-weight: bold;">Termín (${date} v ${time}) se v kalendáři lektora nenašel, takže nebyl zablokován.</p>`;
            }
          } else {
            blockMessage = `<p style="margin-top: 10px; color: orange; font-weight: bold;">Lektor v databázi nemá nastavený žádný kalendář.</p>`;
          }
        } catch (dbError) {
          console.error("Chyba při blokaci termínu v Supabase:", dbError);
          blockMessage = `<p style="margin-top: 10px; color: red; font-weight: bold;">Kritická chyba spojení s databází.</p>`;
        }
      }
    } else {
      blockMessage = `<p style="margin-top: 10px; color: orange; font-weight: bold;">Nebyly dodány údaje pro zablokování termínu (tutorId: ${tutorId}, date: ${date}, time: ${time}).</p>`;
    }
    // -----------------------------------

    const transporter = nodemailer.createTransport({
      host: 'wes1-smtp2.wedos.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Odeslání e-mailu lektorovi
    await transporter.sendMail({
      from: `"Rezervace SUNRISE" <${process.env.SMTP_USER}>`,
      to: tutorEmail,
      subject: `Potvrzení platby a termínu: ${serviceName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; line-height: 1.6;">
          <h2 style="color: #1C9C73;">Ahoj ${tutorName},</h2>
          <p>platba za kurz od zákazníka <strong>${customerName}</strong> právě dorazila na náš účet. Tímto ti <strong>závazně potvrzuji termín!</strong></p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
            <h3 style="margin-top: 0; color: #EF67A5;">Shrnutí termínu:</h3>
            <p style="margin: 0 0 5px 0;"><strong>Služba:</strong> ${serviceName}</p>
            <p style="margin: 0;"><strong>Termín:</strong> ${date} v ${time}</p>
          </div>

          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #cce5ff;">
            <h3 style="margin-top: 0; color: #004085;">Kontaktní údaje zákazníka:</h3>
            <p style="margin: 0 0 5px 0;"><strong>Jméno:</strong> ${customerName}</p>
            <p style="margin: 0 0 5px 0;"><strong>E-mail:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
            <p style="margin: 0;"><strong>Telefon:</strong> ${customerPhone}</p>
          </div>

          <h3 style="border-bottom: 1px solid #eaeaea; padding-bottom: 5px;">Zpráva od zákazníka:</h3>
          <p style="background: #fafafa; padding: 10px; border-radius: 6px;">${message}</p>
          
          <p style="margin-top: 30px; font-weight: bold;">Ať se lekce daří!<br/>Lucie Tomková</p>
        </div>
      `,
    });

    // Odeslání e-mailu zákazníkovi
    if (customerEmail && customerEmail.includes('@')) {
      await transporter.sendMail({
        from: `"Jazyková škola SUNRISE" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: `Potvrzení rezervace: ${serviceName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; line-height: 1.6;">
            <h2 style="color: #1C9C73;">Dobrý den, ${customerName},</h2>
            <p>dáváme Vám vědět, že Vaše platba za kurz <strong>${serviceName}</strong> úspěšně dorazila na náš účet. Vaše rezervace u lektora (${tutorName}) je tímto <strong>plně závazná a potvrzená</strong>!</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
              <h3 style="margin-top: 0; color: #EF67A5;">Shrnutí potvrzeného termínu:</h3>
              <p style="margin: 0 0 5px 0;"><strong>Služba:</strong> ${serviceName}</p>
              <p style="margin: 0 0 5px 0;"><strong>Datum:</strong> ${date}</p>
              <p style="margin: 0;"><strong>Čas:</strong> ${time}</p>
            </div>
            
            <p>Lektor s Vámi pro tento čas plně počítá. Pokud budete potřebovat termín změnit nebo zrušit, ozvěte se nám prosím včas s předstihem.</p>
            
            <p style="margin-top: 30px;">Budeme se na Vás těšit!<br/>S pozdravem,<br/><strong>Lucie Tomková</strong><br/>SUNRISE Agency</p>
          </div>
        `,
      });
    }

    return new Response(`
      <html>
        <head>
          <meta charset="utf-8">
          <title>Úspěch</title>
          <style>
            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5f5; margin: 0; }
            .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
            h1 { color: #1C9C73; margin-bottom: 10px; }
            p { color: #555; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✅ Úspěšně odesláno!</h1>
            <p>Finální potvrzení bylo lektorovi <strong>${tutorName}</strong> úspěšně odesláno na e-mail: <em>${tutorEmail}</em>.</p>
            ${customerEmail ? `<p style="margin-top: 10px; color: #1C9C73; font-weight: bold;">Zároveň bylo odesláno potvrzení i zákazníkovi na: <em>${customerEmail}</em>.</p>` : ''}
            ${blockMessage}
            <p style="font-size: 0.9em; margin-top: 20px; color: #999;">Tuto záložku můžete nyní zavřít.</p>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Chyba při odesílání potvrzení lektorovi:', error);
    return new Response('Nastala chyba při odesílání e-mailu: ' + error.message, { status: 500 });
  }
};

export const config = {
  path: "/api/confirm-lektor-order"
};
