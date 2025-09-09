import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseAnonKey) {
    // The URL constructor will throw an error if the URL is invalid.
    new URL(supabaseUrl);
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.error("Error initializing Supabase client:", error instanceof Error ? error.message : "An unknown error occurred. Make sure NEXT_PUBLIC_SUPABASE_URL is a valid URL.");
  supabase = null;
}

export { supabase };
