import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, ...rest] = line.split('=');
    env[key.trim()] = rest.join('=').trim();
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'] || env['REACT_APP_SUPABASE_URL'] || env['SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'] || env['REACT_APP_SUPABASE_ANON_KEY'] || env['SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('courses_config').select('*');
  console.log(JSON.stringify(data, null, 2));
}
run();
