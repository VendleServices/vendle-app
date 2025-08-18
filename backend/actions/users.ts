"use server"
import { createClient } from "../auth/server";
import { handleError } from "../lib/utils";
import { prisma } from "../db/prisma";

export const loginAction = async (email: string, password: string) => {
    try {
        const supabase = await createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // After successful login, ensure user metadata is set
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const metadata = {
                name: user.user_metadata?.name || user.email?.split('@')[0] || "User",
                user_type: user.user_metadata?.user_type || "homeowner",
                user_id: user.user_metadata?.user_id || user.id
            };

            await supabase.auth.updateUser({
                data: metadata
            });
        }

        // Refresh the session to ensure server-side cookies are updated
        await supabase.auth.refreshSession();

        return { errorMessage: null };
    } catch (error) {
        console.error(error)
        return handleError(error)
    }
}

export const signUpAction = async (email: string, password: string) => {
    try {
        const supabase = await createClient()
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

        const userId = data.user?.id;

        if (!userId) throw new Error("An error occured");

        // add user to database
        await prisma.user.create({
            data: {
                id: userId,
                email,
            }
        });

        // Update user metadata to include the user_id
        await supabase.auth.updateUser({
            data: {
                user_id: userId
            }
        });

        return { errorMessage: null };
    } catch (error) {
        console.error(error)
        return handleError(error)
    }
}

export const updateUserProfile = async (name: string, user_type: string) => {
    try {
        const supabase = await createClient()
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
        return handleError(error)
    }
}

export const logOutAction = async () => {
    try {
        const supabase = await createClient()
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        return { errorMessage: null };
    } catch (error) {
        console.error(error)
        return handleError(error)
    }
}