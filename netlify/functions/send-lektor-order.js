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

    // Odkaz pro odpověď zákazníkovi (Krok 1) - otevírá webový formulář pro admina
    const baseUrl = process.env.URL || 'https://sunrise-la.cz'; // Netlify automaticky doplňuje process.env.URL
    const paymentInfoUrl = `${baseUrl}/api/send-payment-info?customerEmail=${encodeURIComponent(customerEmail || '')}&customerName=${encodeURIComponent(customerName || '')}&serviceName=${encodeURIComponent(serviceName || '')}&tutorName=${encodeURIComponent(lektorName || '')}&date=${encodeURIComponent(date || '')}&time=${encodeURIComponent(time || '')}`;

    // Odkaz pro tlačítko "Potvrdit termín lektorovi" volající novou funkci (Krok 2)
    const confirmUrl = `${baseUrl}/api/confirm-lektor-order?tutorEmail=${encodeURIComponent(lektorEmail || '')}&tutorName=${encodeURIComponent(lektorName || '')}&customerName=${encodeURIComponent(customerName || '')}&customerEmail=${encodeURIComponent(customerEmail || '')}&customerPhone=${encodeURIComponent(customerPhone || '')}&serviceName=${encodeURIComponent(serviceName || '')}&date=${encodeURIComponent(date || '')}&time=${encodeURIComponent(time || '')}&message=${encodeURIComponent(message || '')}`;

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
          <p><strong>Jméno:</strong> ${customerName}</p>
          <p><strong>E-mail:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
          <p><strong>Telefon:</strong> ${customerPhone || 'Neuveden'}</p>
          <p><strong>Zpráva od zákazníka:</strong><br /> ${message || 'Žádná zpráva'}</p>
          
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin-top: 30px;">
            <p style="margin: 0 0 15px 0;"><strong>⚠️ Krok 1: Odeslat platební údaje zákazníkovi</strong><br/>
            Kliknutím na modré tlačítko se vám otevře předepsaný e-mail pro zákazníka. Nezapomeňte do něj vložit částku a QR kód!</p>
            
            <a href="${paymentInfoUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">📧 Odeslat pokyny k platbě zákazníkovi</a>

            <p style="margin: 0 0 15px 0; border-top: 1px solid #ffe69c; padding-top: 15px;"><strong>⚠️ Krok 2: Potvrdit rezervaci</strong><br/>
            Až peníze dorazí, klikněte na zelené tlačítko. Systém <strong>automaticky odešle finální potvrzení lektorovi i zákazníkovi!</strong></p>
            
            ${lektorEmail ? `<a href="${confirmUrl}" style="display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">✅ Potvrdit platbu a termín</a>` : '<p><em>E-mail lektora není v systému zadán. Funkce automatického potvrzení vyžaduje e-mail lektora.</em></p>'}
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
              Prosím, s tímto termínem zatím předběžně počítej. Nyní se zákazníkem řeším platbu. Jakmile bude rezervace úspěšně uhrazena, obdržíš finální potvrzení a termín se stane plně závazným.</p>
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
