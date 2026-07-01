import nodemailer from 'nodemailer';

export default async (req, context) => {
  // Povolíme pouze POST požadavky
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { 
      customerEmail, 
      customerName, 
      serviceName, 
      price, 
      term, 
      details, 
      isKidsProgram 
    } = body;

    if (!customerEmail || !customerName || !serviceName) {
      return new Response(JSON.stringify({ message: 'Chybí povinné údaje pro odeslání potvrzení.' }), { status: 400 });
    }

    // Vytvoření transportéru pro připojení na WEDOS SMTP
    const transporter = nodemailer.createTransport({
      host: 'wes1-smtp2.wedos.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Detekce a formátování intenzivních letních kurzů pro dospělé
    let formattedServiceName = serviceName;
    const isIntensive = serviceName.toLowerCase().includes('intenziv') || serviceName.toLowerCase().includes('letní program') || serviceName.toLowerCase().includes('letni program');
    const isDay = serviceName.toLowerCase().includes('denní') || serviceName.toLowerCase().includes('denni');
    const isEvening = serviceName.toLowerCase().includes('večerní') || serviceName.toLowerCase().includes('vecerni');

    if (isIntensive) {
      if (isDay) {
        formattedServiceName = 'Letní intenzivní kurz angličtiny (Denní)';
      } else if (isEvening) {
        formattedServiceName = 'Letní intenzivní kurz angličtiny (Večerní)';
      } else {
        formattedServiceName = `Letní intenzivní kurz angličtiny (${serviceName})`;
      }
    }

    // Vždy připojit termín do názvu služby pro maximální přehlednost v předmětu a shrnutí
    if (term && !formattedServiceName.includes(term)) {
      formattedServiceName = `${formattedServiceName} (${term})`;
    }

    let kidsInfoHtml = '';
    if (isKidsProgram) {
      kidsInfoHtml = `
        <div style="background-color: #fdf2f8; border-left: 4px solid #EF67A5; padding: 15px; margin: 25px 0; border-radius: 4px;">
          <h3 style="color: #EF67A5; margin-top: 0; margin-bottom: 10px; font-size: 16px;">Onemocnělo vám dítě?</h3>
          <p style="margin: 0; color: #555; line-height: 1.5;">
            Nic se neděje. Stačí nám odepsat na tento e-mail a domluvíme se na náhradním termínu. 
          </p>
          <h3 style="color: #EF67A5; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">Co s sebou?</h3>
          <p style="margin: 0; color: #555; line-height: 1.5;">
            Prosíme, dejte dětem pohodlné oblečení, přezůvky a láhev na pití (zdravá svačinka/oběd bývá v ceně programu, případně dle konkrétních pokynů u daného kurzu). Těšíme se na ně!
          </p>
        </div>
      `;
    }

    let intensiveInfoHtml = '';
    if (isIntensive) {
      const scheduleTime = isDay ? 'pondělí až pátek, 9:00–12:00 a 13:00–15:00 hod. (celkem 25 lekcí)' : 'pondělí až pátek, 17:00–20:00 hod. (celkem 15 lekcí)';
      intensiveInfoHtml = `
        <div style="background-color: #f0f4f8; border-left: 4px solid #1e3a8a; padding: 15px; margin: 25px 0; border-radius: 4px;">
          <h3 style="color: #1e3a8a; margin-top: 0; margin-bottom: 10px; font-size: 16px;">Důležité informace ke kurzu</h3>
          <p style="margin: 0 0 10px 0; color: #555; line-height: 1.5;">
            <strong>Místo konání:</strong> Jana Palacha 1638, Pardubice (SUNRISE Place)
          </p>
          <p style="margin: 0 0 10px 0; color: #555; line-height: 1.5;">
            <strong>Čas výuky:</strong> ${scheduleTime}
          </p>
          <p style="margin: 0; color: #555; line-height: 1.5;">
            S sebou si prosím přineste přezůvky a psací potřeby. Výukové materiály (případně učebnice) jsou kompletně v ceně. Těšíme se na Vás!
          </p>
        </div>
      `;
    }

    // Bezpečné sloučení a unikátní bcc seznam (proti duplicitě)
    const bccList = Array.from(new Set([process.env.SMTP_USER, 'info@sunrise-la.cz'])).filter(Boolean);

    // Odeslání e-mailu zákazníkovi (s kopií do školy)
    await transporter.sendMail({
      from: `"Jazyková škola SUNRISE" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      bcc: bccList, // Kopie pro majitelku a školu
      replyTo: process.env.SMTP_USER,
      subject: `Potvrzení platby a rezervace: ${formattedServiceName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; color: #333; line-height: 1.6;">
          <h2 style="color: #1e293b;">Dobrý den, ${customerName},</h2>
          <p>velice Vám děkujeme za Vaši objednávku a platbu. Vaše rezervace je tímto plně <strong>potvrzena</strong> a těšíme se na Vás!</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Shrnutí Vaší objednávky:</h3>
            <p style="margin: 10px 0 5px 0;"><strong>Služba/Kurz:</strong> ${formattedServiceName}</p>
            ${term ? `<p style="margin: 0 0 5px 0;"><strong>Termín:</strong> ${term}</p>` : ''}
            ${details ? `<p style="margin: 0 0 5px 0;"><strong>Detaily:</strong> ${details}</p>` : ''}
            <p style="margin: 15px 0 0 0; font-size: 16px; border-top: 1px dashed #cbd5e1; padding-top: 10px;"><strong>Uhrazená částka:</strong> ${price}</p>
          </div>

          ${kidsInfoHtml}
          ${intensiveInfoHtml}

          <p>Pokud budete mít jakékoliv dotazy, neváhejte se na nás kdykoliv obrátit prostým odpovězením na tento e-mail.</p>
          
          <p style="margin-top: 30px;">
            S pozdravem,<br><br>
            <strong>Mgr. Lucie Tomková</strong><br>
            SUNRISE Language Agency, s.r.o.
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true, message: 'Potvrzovací e-mail byl úspěšně odeslán.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chyba při odesílání potvrzovacího e-mailu:', error);
    return new Response(JSON.stringify({ success: false, message: 'Nastala chyba při odesílání e-mailu.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  path: "/api/send-order-confirmation"
};
