const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xzuevidfbeihrunoqhao.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dWV2aWRmYmVpaHJ1bm9xaGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTE1NzAsImV4cCI6MjA5MTM4NzU3MH0.ZhT7-Z4J0_YMCnINQkSaTxRYmFjReMbh-Dm0MR5lRSA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('tutors').select('id, schedule').limit(1);
  if (error) {
    console.error('Select error:', error);
    return;
  }
  const tutor = data[0];
  console.log('Got tutor:', tutor.id);
  
  const { error: updateError } = await supabase.from('tutors').update({ schedule: tutor.schedule }).eq('id', tutor.id);
  if (updateError) {
    console.error('Update error:', updateError);
  } else {
    console.log('Update success with anon key!');
  }
}
run();
