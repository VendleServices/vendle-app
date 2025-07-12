"use client"

import { createClient } from "@/auth/client";

export const loginAction = async (email: string, password: string) => {
    try {
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // After successful login, ensure user metadata is set
        const { data: { user } } = await supabase.auth.getUser();
        if (user && (!user.user_metadata?.name || !user.user_metadata?.user_type)) {
            await supabase.auth.updateUser({
                data: {
                    name: user.user_metadata?.name || user.email?.split('@')[0] || "User",
                    user_type: user.user_metadata?.user_type || "homeowner"
                }
            });
        }

        return { errorMessage: null };
    } catch (error) {
        console.error(error)
        return { errorMessage: error instanceof Error ? error.message : 'An error occurred' }
    }
}

export const signUpAction = async (email: string, password: string) => {
    try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: email.split('@')[0], // Use email prefix as default name
                    user_type: "homeowner"
                }
            }
        });

        if (error) throw error;

        return { errorMessage: null };
    } catch (error) {
        console.error(error)
        return { errorMessage: error instanceof Error ? error.message : 'An error occurred' }
    }
}

export const updateUserProfile = async (name: string, user_type: string) => {
    try {
        const supabase = createClient()
        const { error } = await supabase.auth.updateUser({
            data: {
                name,
                user_type
            }
        });

        if (error) throw error;

        return { errorMessage: null };
    } catch (error) {
        console.error(error)
        return { errorMessage: error instanceof Error ? error.message : 'An error occurred' }
    }
}

export const logOutAction = async () => {
    try {
        const supabase = createClient()
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        return { errorMessage: null };
    } catch (error) {
        console.error(error)
        return { errorMessage: error instanceof Error ? error.message : 'An error occurred' }
    }
} 