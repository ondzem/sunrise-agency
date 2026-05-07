const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xzuevidfbeihrunoqhao.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dWV2aWRmYmVpaHJ1bm9xaGFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxMTU3MCwiZXhwIjoyMDkxMzg3NTcwfQ.uiAXkuvO-cHHohn0-JAJ3UrdsvE_LI_SCQ66rwqc6Io';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('tutors').select('*').limit(3);
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
run();
