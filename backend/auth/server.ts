import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Request } from 'express'

export function createClient() {
    const client = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    return client
}

export async function getUser(req: Request) {
    const supabase = createClient();

    // Try to get token from various sources
    const token = req.cookies["sb-pivraqaqqwlrvbtuylvj-auth-token"];

    if (!token) {
        console.log('No auth token found');
        return null;
    }

    try {
        // Use the token to get the user
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) {
            console.error('Auth error:', error);
            return null;
        }

        if (!user) {
            console.log('No user found');
            return null;
        }

        return { ...user, user_type: "homeowner" };
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}