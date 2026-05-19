import nodemailer from 'nodemailer';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const data = await req.json();
    const { reviewId, tableName, author, role, text } = data;

    // Pro účely testování a bezpečí vytvoříme odkazy na druhou funkci pro schválení/zamítnutí
    // Využijeme url z requestu
    const url = new URL(req.url);
    const host = url.host || 'sunrise-la.cz';
    const protocol = url.protocol || 'https:';
    const baseUrl = `${protocol}//${host}/api/review-action`;

    const approveUrl = `${baseUrl}?id=${reviewId}&table=${tableName}&action=approve`;
    const rejectUrl = `${baseUrl}?id=${reviewId}&table=${tableName}&action=reject`;

    const transporter = nodemailer.createTransport({
      host: 'wes1-smtp2.wedos.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
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
      from: '"Sunrise Web" <' + process.env.SMTP_USER + '>',
      to: process.env.SMTP_USER,
      subject: `Nová recenze ke schválení od ${author} (${pageName})`,
      html: htmlBody
    });

    return new Response(JSON.stringify({ message: 'E-mail odeslán' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ message: 'Failed to send email', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/send-review-approval"
};
