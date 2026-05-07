import nodemailer from 'nodemailer';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { 
      lektorEmail, 
      lektorName, 
      serviceName, 
      date, 
      time, 
      customerName, 
      customerEmail, 
      customerPhone, 
      message 
    } = body;

    const transporter = nodemailer.createTransport({
      host: 'wes1-smtp2.wedos.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 1. E-MAIL PRO MAJITELKU (Kompletní údaje + Výzva k odeslání QR kódu)
    await transporter.sendMail({
      from: `"Nová objednávka Lektora" <${process.env.SMTP_USER}>`,
      to: 'info@sunrise-la.cz', 
      replyTo: customerEmail,
      subject: `Nová objednávka online kurzů`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; line-height: 1.6;">
          <h2 style="color: #EF67A5;">Nová objednávka od: ${customerName}</h2>
          
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 5px 0;"><strong>Lektor:</strong> ${lektorName}</p>
            <p style="margin: 0 0 5px 0;"><strong>Služba:</strong> ${serviceName}</p>
            <p style="margin: 0;"><strong>Vybraný termín:</strong> ${date} v ${time}</p>
          </div>

          <h3 style="border-bottom: 1px solid #eaeaea; padding-bottom: 5px;">Kontaktní údaje zákazníka</h3>
          <p><strong>E-mail:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
          <p><strong>Telefon:</strong> ${customerPhone || 'Neuveden'}</p>
          <p><strong>Zpráva od zákazníka:</strong><br /> ${message || 'Žádná zpráva'}</p>
          
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin-top: 30px;">
            <p style="margin: 0;"><strong>⚠️ Další krok (Manuální platba):</strong><br/>
            Lektor dostal pouze zkrácené info. Nyní je potřeba zákazníkovi zaslat e-mail s QR kódem a platebními údaji. Až peníze dorazí, potvrďte termín lektorovi.</p>
          </div>
        </div>
      `,
    });

    // 2. E-MAIL PRO LEKTORA (Stručné info, čekání na platbu)
    if (lektorEmail) {
      await transporter.sendMail({
        from: `"Rezervace SUNRISE" <${process.env.SMTP_USER}>`,
        to: lektorEmail,
        subject: `Nová objednávka online kurzů`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; line-height: 1.6;">
            <h2 style="color: #1C9C73;">Ahoj ${lektorName},</h2>
            <p>Přes tvůj profil na webu přišla nová předběžná rezervace na službu <strong>${serviceName}</strong>.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 5px 0;"><strong>Zákazník:</strong> ${customerName}</p>
              <p style="margin: 0 0 5px 0;"><strong>E-mail:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
              <p style="margin: 0 0 5px 0;"><strong>Telefon:</strong> ${customerPhone || 'Neuveden'}</p>
              <p style="margin: 0;"><strong>Preferovaný termín:</strong> ${date} v ${time}</p>
            </div>

            <h3 style="border-bottom: 1px solid #eaeaea; padding-bottom: 5px;">Zpráva od zákazníka:</h3>
            <p>${message || 'Žádná zpráva'}</p>
            
            <div style="border-left: 4px solid #EF67A5; padding-left: 15px; margin-top: 20px;">
              <p style="margin: 0;"><strong>DŮLEŽITÉ:</strong><br/>
              Prosím, s tímto termínem zatím předběžně počítej. Vedení školy nyní se zákazníkem řeší platbu. Jakmile bude rezervace úspěšně uhrazena, obdržíš od nás finální potvrzení a termín se stane plně závazným.</p>
            </div>
          </div>
        `,
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Objednávka úspěšně odeslána na oba e-maily.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chyba při odesílání e-mailu lektorovi:', error);
    return new Response(JSON.stringify({ success: false, message: 'Nastala chyba při odesílání e-mailů.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  path: "/api/send-lektor-order"
};
