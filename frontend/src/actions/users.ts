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
                    user_type: user.user_metadata?.user_type || "homeowner",
                    companyName: user.user_metadata?.companyName,
                    phoneNumber: user.user_metadata?.phoneNumber,
                    companyWebsite: user.user_metadata?.companyWebsite,
                }
            });
        }

        return { errorMessage: null };
    } catch (error) {
        console.error(error)
        return { errorMessage: error instanceof Error ? error.message : 'An error occurred' }
    }
}

export const signUpAction = async (email: string, password: string, userType: string | undefined, companyName: string | undefined, phoneNumber: string | undefined, companyWebsite: string | undefined) => {
    try {
        const supabase = createClient()

        const user_type = userType || "homeowner";

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: email.split('@')[0], // Use email prefix as default name
                    user_type,
                    companyName,
                    phoneNumber,
                    companyWebsite,
                }
            }
        });

        if (error) throw error;

        const user = data.user;

        return { errorMessage: null, id: user?.id };
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