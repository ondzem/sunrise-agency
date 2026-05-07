import nodemailer from 'nodemailer';

export default async (req, context) => {
  try {
    const url = new URL(req.url);

    // Pokud je to GET požadavek, zobrazíme HTML formulář pro kontrolu a odeslání
    if (req.method === 'GET') {
      const customerEmail = url.searchParams.get('customerEmail') || '';
      const customerName = url.searchParams.get('customerName') || '';
      const serviceName = url.searchParams.get('serviceName') || '';
      const tutorName = url.searchParams.get('tutorName') || '';
      const date = url.searchParams.get('date') || '';
      const time = url.searchParams.get('time') || '';

      return new Response(`
        <html>
          <head>
            <meta charset="utf-8">
            <title>Odeslat pokyny k platbě</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: 'Inter', sans-serif; background-color: #f5f7fa; color: #333; margin: 0; padding: 20px; display: flex; justify-content: center; }
              .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); width: 100%; max-width: 600px; }
              h1 { color: #007bff; margin-top: 0; font-size: 24px; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; }
              label { display: block; font-weight: bold; margin-bottom: 5px; margin-top: 15px; color: #555; }
              input[type="text"], input[type="email"], textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-family: inherit; font-size: 15px; }
              textarea { min-height: 250px; resize: vertical; line-height: 1.5; }
              button { background-color: #007bff; color: white; border: none; padding: 14px 20px; font-size: 16px; font-weight: bold; border-radius: 6px; cursor: pointer; width: 100%; margin-top: 25px; transition: background 0.2s; }
              button:hover { background-color: #0056b3; }
              .info { background: #e9f5ff; padding: 15px; border-radius: 6px; font-size: 14px; color: #0056b3; margin-bottom: 20px; border-left: 4px solid #007bff; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>📧 Odeslat pokyny k platbě</h1>
              <div class="info">Zkontrolujte údaje níže, doplňte částku nebo upravte text podle potřeby a klikněte na Odeslat. E-mail se odešle z adresy info@sunrise-la.cz zákazníkovi.</div>
              
              <form method="POST" action="/api/send-payment-info">
                <label>E-mail zákazníka:</label>
                <input type="email" name="customerEmail" value="${customerEmail}" required readonly style="background: #f9f9f9;">
                
                <label>Předmět e-mailu:</label>
                <input type="text" name="subject" value="Platební údaje k rezervaci: ${serviceName}" required>
                
                <label>Zpráva pro zákazníka (můžete upravit):</label>
                <textarea name="message" required>Dobrý den, ${customerName},

děkujeme za Váš zájem o službu "${serviceName}".

Váš preferovaný termín (${date} v ${time}) jsme předběžně rezervovali u lektora (${tutorName}).

Pro závazné potvrzení rezervace prosím proveďte platbu na náš bankovní účet:
Číslo účtu: [DOPLŇTE ČÍSLO ÚČTU]
Částka: [DOPLŇTE ČÁSTKU] Kč
Do poznámky prosím uveďte své jméno.

Jakmile platba dorazí, zašleme Vám finální potvrzení.

S pozdravem,
Lucie Tomková
SUNRISE Agency</textarea>

                <button type="submit">Odeslat e-mail s pokyny</button>
              </form>
            </div>
          </body>
        </html>
      `, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Pokud je to POST požadavek, znamená to, že admin klikl na "Odeslat" ve formuláři nahoře
    if (req.method === 'POST') {
      const formData = await req.formData();
      const customerEmail = formData.get('customerEmail');
      const subject = formData.get('subject');
      const message = formData.get('message');

      if (!customerEmail || !message) {
        return new Response('Chyba: Chybí e-mail nebo zpráva.', { status: 400 });
      }

      const transporter = nodemailer.createTransport({
        host: 'wes1-smtp2.wedos.net',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Zpráva se pošle jako čistý text, který jsme zadali do textarea, ale obalíme ho do HTML, aby vypadal hezky
      const htmlMessage = message.replace(/\n/g, '<br/>');

      await transporter.sendMail({
        from: `"Jazyková škola SUNRISE" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: subject,
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; line-height: 1.6; color: #333;">
            ${htmlMessage}
          </div>
        `,
      });

      return new Response(`
        <html>
          <head>
            <meta charset="utf-8">
            <title>Úspěch</title>
            <style>
              body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5f5; margin: 0; }
              .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
              h1 { color: #007bff; margin-bottom: 10px; }
              p { color: #555; line-height: 1.5; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>✅ Pokyny úspěšně odeslány!</h1>
              <p>Zákazníkovi byl odeslán e-mail s pokyny k platbě na adresu: <em>${customerEmail}</em>.</p>
              <p style="font-size: 0.9em; margin-top: 20px; color: #999;">Tuto záložku můžete nyní zavřít a vrátit se k původnímu e-mailu.</p>
            </div>
          </body>
        </html>
      `, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

  } catch (error) {
    console.error('Chyba při odesílání pokynů zákazníkovi:', error);
    return new Response('Nastala chyba při odesílání e-mailu: ' + error.message, { status: 500 });
  }
};

export const config = {
  path: "/api/send-payment-info"
};
