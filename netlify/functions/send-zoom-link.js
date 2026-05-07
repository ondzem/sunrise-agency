import nodemailer from 'nodemailer';

export default async (req, context) => {
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const customerEmail = url.searchParams.get('customerEmail');
    const customerName = url.searchParams.get('customerName');
    const serviceName = url.searchParams.get('serviceName');
    const tutorName = url.searchParams.get('tutorName');
    const tutorEmail = url.searchParams.get('tutorEmail');
    const date = url.searchParams.get('date');
    const time = url.searchParams.get('time');

    if (!customerEmail) {
      return new Response('Chybí e-mail zákazníka.', { status: 400 });
    }

    const htmlForm = `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Odeslat odkaz na schůzku</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); max-width: 500px; width: 100%; box-sizing: border-box; }
            h2 { color: #1C9C73; margin-top: 0; margin-bottom: 20px; font-size: 24px; }
            p { color: #555; line-height: 1.5; margin-bottom: 20px; font-size: 15px; }
            .info-box { background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #1C9C73; }
            .info-box p { margin: 5px 0; font-size: 14px; }
            label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; }
            input[type="url"], input[type="text"] { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; font-size: 15px; box-sizing: border-box; transition: border-color 0.2s; }
            input[type="url"]:focus, input[type="text"]:focus { border-color: #EF67A5; outline: none; }
            button { background-color: #EF67A5; color: white; border: none; padding: 14px 24px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; transition: background 0.2s; }
            button:hover { background-color: #d85a92; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>🔗 Odeslat odkaz na schůzku</h2>
            <p>Vygenerujte odkaz na videohovor (např. v aplikaci Zoom nebo Google Meet) a vložte jej níže. Zákazníkovi automaticky odešleme krásně zformátovaný e-mail s potvrzením termínu a tímto odkazem.</p>
            
            <div class="info-box">
              <p><strong>Zákazník:</strong> ${customerName}</p>
              <p><strong>Termín:</strong> ${date} v ${time}</p>
              <p><strong>Služba:</strong> ${serviceName}</p>
            </div>

            <form method="POST" action="/api/send-zoom-link">
              <input type="hidden" name="customerEmail" value="${customerEmail}">
              <input type="hidden" name="customerName" value="${customerName}">
              <input type="hidden" name="serviceName" value="${serviceName}">
              <input type="hidden" name="tutorName" value="${tutorName}">
              <input type="hidden" name="tutorEmail" value="${tutorEmail}">
              <input type="hidden" name="date" value="${date}">
              <input type="hidden" name="time" value="${time}">
              
              <label for="zoomLink">Odkaz na videohovor (Zoom / Meet):</label>
              <input type="url" id="zoomLink" name="zoomLink" placeholder="https://zoom.us/j/123456789" required>
              
              <button type="submit">Odeslat finální potvrzení zákazníkovi</button>
            </form>
          </div>
        </body>
      </html>
    `;
    return new Response(htmlForm, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  if (req.method === 'POST') {
    try {
      const formData = await req.formData();
      const customerEmail = formData.get('customerEmail');
      const customerName = formData.get('customerName');
      const serviceName = formData.get('serviceName');
      const tutorName = formData.get('tutorName');
      const tutorEmail = formData.get('tutorEmail');
      const date = formData.get('date');
      const time = formData.get('time');
      const zoomLink = formData.get('zoomLink');

      const transporter = nodemailer.createTransport({
        host: 'wes1-smtp2.wedos.net',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Jazyková škola SUNRISE" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        replyTo: tutorEmail,
        subject: `Potvrzení rezervace a odkaz na připojení: ${serviceName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; line-height: 1.6;">
            <h2 style="color: #1C9C73;">Dobrý den, ${customerName},</h2>
            <p>dáváme Vám vědět, že Vaše platba za kurz <strong>${serviceName}</strong> úspěšně dorazila. Vaše rezervace u lektora (${tutorName}) je tímto plně závazná!</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
              <h3 style="margin-top: 0; color: #EF67A5;">Detaily Vaší lekce:</h3>
              <p style="margin: 0 0 8px 0;"><strong>Datum:</strong> ${date}</p>
              <p style="margin: 0 0 8px 0;"><strong>Čas:</strong> ${time}</p>
              <p style="margin: 0;"><strong>Lektor:</strong> ${tutorName} (<a href="mailto:${tutorEmail}" style="color: #1C9C73; text-decoration: none;">${tutorEmail}</a>)</p>
            </div>
            
            <div style="background-color: #e6fcf5; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; border: 2px dashed #1C9C73;">
              <h3 style="margin-top: 0; color: #107a51;">Odkaz na videohovor</h3>
              <p style="margin-bottom: 20px; color: #333;">Lektor pro Vás připravil odkaz na spojení. Až přijde čas lekce, jednoduše klikněte na tlačítko níže:</p>
              <a href="${zoomLink}" style="background-color: #1C9C73; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Připojit se ke schůzce</a>
              <p style="margin-top: 20px; font-size: 12px; color: #666;">nebo zkopírujte tento odkaz:<br><a href="${zoomLink}" style="color: #1C9C73;">${zoomLink}</a></p>
            </div>
            
            <p>Pokud budete potřebovat termín změnit nebo se před lekcí na cokoliv zeptat, napište přímo lektorovi na e-mail uvedený výše.</p>
            
            <p style="margin-top: 30px;">Budeme se na Vás těšit!<br/>S pozdravem,<br/><strong>${tutorName}</strong> & SUNRISE Agency</p>
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
              h1 { color: #1C9C73; margin-bottom: 10px; }
              p { color: #555; line-height: 1.5; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>✅ Odesláno zákazníkovi!</h1>
              <p>Zákazník <strong>${customerName}</strong> právě obdržel e-mail se všemi detaily, odkazem na Zoom a Vaším kontaktem.</p>
              <p style="font-size: 0.9em; margin-top: 20px; color: #999;">Tuto záložku můžete nyní zavřít a začít se připravovat na lekci.</p>
            </div>
          </body>
        </html>
      `, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

    } catch (error) {
      console.error('Chyba při odesílání Zoom linku:', error);
      return new Response('Nastala chyba při odesílání e-mailu: ' + error.message, { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};

export const config = {
  path: "/api/send-zoom-link"
};
