const https = require('https');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { title, price, email, firstName, lastName } = data;

    // Generování unikátního čísla objednávky
    const orderId = 'ORD-' + Date.now();

    const merchantId = process.env.COMGATE_MERCHANT_ID;
    const secret = process.env.COMGATE_SECRET;
    const isTest = process.env.COMGATE_TEST || 'true';

    if (!merchantId || !secret) {
      console.error("Chybí Comgate klíče v prostředí");
      return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error" }) };
    }

    // Comgate vyžaduje formát application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('merchant', merchantId);
    params.append('secret', secret);
    params.append('test', isTest);
    params.append('country', 'CZ');
    params.append('price', Math.round(price * 100).toString()); // Cena musí být v haléřích
    params.append('curr', 'CZK');
    params.append('label', title.substring(0, 50)); // Popis platby (max 50 znaků)
    params.append('refId', orderId); // Naše referenční číslo
    params.append('email', email);
    params.append('prepareOnly', 'true'); // Jen založí platbu a vrátí URL pro přesměrování
    
    // Můžeme poslat i jméno
    if (firstName) params.append('firstName', firstName);
    if (lastName) params.append('lastName', lastName);

    console.log("Zakládám platbu u Comgate:", title, price, email);

    const postData = params.toString();

    const resultText = await new Promise((resolve, reject) => {
      const req = https.request('https://payments.comgate.cz/v1.0/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk.toString());
        res.on('end', () => resolve(body));
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    console.log("Comgate odpověď:", resultText);

    const resultParams = new URLSearchParams(resultText);

    if (resultParams.get('code') === '0') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          transId: resultParams.get('transId'),
          redirectUrl: decodeURIComponent(resultParams.get('redirectUrl')),
          orderId: orderId
        })
      };
    } else {
      console.error("Chyba od Comgate:", resultText);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: resultParams.get('message') || 'Platbu se nepodařilo založit',
          details: resultText 
        })
      };
    }

  } catch (error) {
    console.error("Kritická chyba backendu:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
