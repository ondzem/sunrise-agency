const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Podporujeme pouze GET request (kliknutí na odkaz v emailu)
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id, table, action } = event.queryStringParameters;

  if (!id || !table || !action) {
    return { statusCode: 400, body: 'Missing parameters' };
  }

  // Inicializace Supabase (použijeme proměnné prostředí z Netlify)
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return { statusCode: 500, body: 'Supabase konfigurace chybí na serveru.' };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    let resultMessage = '';

    if (action === 'approve') {
      const { error } = await supabase
        .from(table)
        .update({ approved: true })
        .eq('id', id);
        
      if (error) throw error;
      resultMessage = '✅ Recenze byla úspěšně schválena a nyní se zobrazuje na webu.';
    } 
    else if (action === 'reject') {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      resultMessage = '❌ Recenze byla úspěšně zamítnuta a smazána z databáze.';
    } 
    else {
      return { statusCode: 400, body: 'Invalid action' };
    }

    // Vrátíme hezkou HTML odpověď
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Zpracování recenze</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
          h1 { color: #1C9C73; }
          p { color: #555; line-height: 1.6; }
          .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #EF67A5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hotovo!</h1>
          <p>${resultMessage}</p>
          <a href="https://sunrise-la.cz" class="btn">Přejít na web Sunrise</a>
        </div>
      </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      },
      body: htmlResponse
    };

  } catch (error) {
    console.error('Action error:', error);
    return {
      statusCode: 500,
      body: `Chyba při zpracování: ${error.message}`
    };
  }
};
