import { createClient } from '@supabase/supabase-js';
import { Database } from '../lib/database.types';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY;

export const supabase = createClient<Database>(
  supabaseUrl as string,
  supabaseKey as string
);
