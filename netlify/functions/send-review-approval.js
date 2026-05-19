const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { reviewId, tableName, author, role, text } = data;

    // Pro účely testování a bezpečí vytvoříme odkazy na druhou funkci pro schválení/zamítnutí
    // Využijeme dynamickou doménu z hlavičky (např. localhost nebo sunrise-la.cz)
    const host = event.headers.host || 'sunrise-la.cz';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}/.netlify/functions/review-action`;

    const approveUrl = `${baseUrl}?id=${reviewId}&table=${tableName}&action=approve`;
    const rejectUrl = `${baseUrl}?id=${reviewId}&table=${tableName}&action=reject`;

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.wedos.net',
      port: process.env.SMTP_PORT || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'info@sunrise-la.cz',
        pass: process.env.SMTP_PASS
      }
    });

    const pageName = tableName === 'company_testimonials' ? 'Firemní kurzy' : 'Úvodní stránka';

    let htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background: #EF67A5; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Nová recenze ke schválení</h2>
        </div>
        <div style="padding: 20px; background: #fafafa;">
          <p>Někdo právě přidal novou recenzi na web a čeká na vaše schválení, než se zobrazí návštěvníkům.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p><strong>Stránka:</strong> ${pageName}</p>
          <p><strong>Jméno:</strong> ${author}</p>
          <p><strong>Kontext/Role:</strong> ${role}</p>
          <div style="background: white; padding: 15px; border-left: 4px solid #1C9C73; margin: 15px 0; font-style: italic;">
            "${text}"
          </div>
          
          <div style="margin-top: 30px; display: flex; gap: 15px;">
            <a href="${approveUrl}" style="background: #1C9C73; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">✅ Potvrdit a Zobrazit na webu</a>
            <a href="${rejectUrl}" style="background: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">❌ Zamítnout a Smazat</a>
          </div>
          
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            Pokud kliknete na "Potvrdit", recenze se okamžitě objeví na webu. Pokud kliknete na "Zamítnout", recenze se trvale vymaže.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"Sunrise Web" <info@sunrise-la.cz>',
      to: 'info@sunrise-la.cz',
      subject: `Nová recenze ke schválení od ${author} (${pageName})`,
      html: htmlBody
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'E-mail odeslán' })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email', error: error.message })
    };
  }
};
