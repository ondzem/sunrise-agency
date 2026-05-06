import nodemailer from 'nodemailer';

export default async (req, context) => {
  // Povolíme pouze POST požadavky
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ message: 'Chybí povinné údaje.' }), { status: 400 });
    }

    // Vytvoření transportéru pro připojení na WEDOS SMTP
    const transporter = nodemailer.createTransport({
      host: 'wes1-smtp2.wedos.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER, // Bude se načítat bezpečně z Netlify nastavení
        pass: process.env.SMTP_PASS, // Bude se načítat bezpečně z Netlify nastavení
      },
    });

    // Odeslání samotného e-mailu
    await transporter.sendMail({
      from: `"Zpráva z webu (Kontakt)" <${process.env.SMTP_USER}>`,
      to: 'info@sunrise-la.cz', // Komu to přijde (majitelka)
      replyTo: email, // Když majitelka klikne na Odpovědět, e-mail se napíše rovnou zákazníkovi
      subject: `Nová zpráva od: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #EF67A5;">Nová zpráva z kontaktního formuláře</h2>
          <p><strong>Jméno a Příjmení:</strong> ${name}</p>
          <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Telefon:</strong> ${phone || 'Neuveden'}</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0;"><strong>Zpráva:</strong></p>
            <p style="white-space: pre-wrap; margin-top: 10px;">${message}</p>
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true, message: 'Zpráva úspěšně odeslána.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chyba při odesílání e-mailu:', error);
    return new Response(JSON.stringify({ success: false, message: 'Nastala chyba při odesílání.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Tohle je obrovská výhoda Netlify Functions v2 – URL pro náš front-end (React) zůstane úplně stejná jako u Vercelu!
export const config = {
  path: "/api/send-contact"
};
