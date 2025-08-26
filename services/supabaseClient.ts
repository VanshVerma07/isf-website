import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// IMPORTANT: These are placeholders.
// You must create a .env.local file in the root of your project with:
// VITE_SUPABASE_URL=https://your-project-ref.supabase.co
// VITE_SUPABASE_ANON_KEY=your-public-anon-key

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // This warning is helpful for development. In a deployed app, these will be set in the hosting environment.
    console.warn("Supabase credentials not found. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env.local file or hosting provider's environment variables.");
}

export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!);