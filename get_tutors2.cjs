const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xzuevidfbeihrunoqhao.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dWV2aWRmYmVpaHJ1bm9xaGFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxMTU3MCwiZXhwIjoyMDkxMzg3NTcwfQ.uiAXkuvO-cHHohn0-JAJ3UrdsvE_LI_SCQ66rwqc6Io';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('tutors').select('*');
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
run();
