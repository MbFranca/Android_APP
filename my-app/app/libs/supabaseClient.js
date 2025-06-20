import { createClient } from '@supabase/supabase-js';
import { secureStoreAdapter } from './secureStoreAdapter';

const url = (process.env.EXPO_PUBLIC_SUPABASE_URL)
const key = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)
export const supabase = createClient(url,key , {
  auth: {
    storage: secureStoreAdapter,
    detectSessionInUrl: false,
  },
});

