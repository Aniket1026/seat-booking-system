import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.DATABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
