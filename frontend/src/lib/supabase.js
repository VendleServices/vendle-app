import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SHARE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: {
            getItem: (key) => {
                if (typeof window !== 'undefined') {
                    return localStorage.getItem(key)
                }
                return null
            },
            setItem: (key, value) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem(key, value)
                }
            },
            removeItem: (key) => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(key)
                }
            }
        },
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
    }
});

// helper function to get current jwt token
export const getAccessToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
}

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}