"use client"
import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { signUpAction, logOutAction, loginAction } from "@/actions/users";
import { createClient } from "@/auth/client";

type User = {
    email: string,
    user_type: string,
    user_id?: number,
    name: string,
    picture?: string,
}

type UserAuth = {
    isLoggedIn: boolean,
    user: User | null,
    login: (email: string, password: string) => Promise<string | null>,
    signup: (email: string, password: string) => Promise<string | null>,
    logout: () => Promise<void>
}

const AuthContext = createContext<UserAuth | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user ? { email: user.email!, name: "User", user_type: "homeowner" } : null)
            setIsLoggedIn(!!user)
        }

        getUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ? { email: session.user.email!, name: "User", user_type: "homeowner" } : null)
                setIsLoggedIn(!!session?.user)
            }
        )

        return () => subscription.unsubscribe()
    }, []);

    const login = async (email: string, password: string) => {
        const errorMessage = (await loginAction(email, password)).errorMessage;
        if (!errorMessage) {
            setUser({ email, name: "User", user_type: "homeowner" });
            setIsLoggedIn(true);
        }
        return errorMessage;
    };

    const signup = async (email: string, password: string) => {
        const errorMessage = (await signUpAction(email, password)).errorMessage;
        if (!errorMessage) {
            setUser({ email, name: "User", user_type: "homeowner" });
            setIsLoggedIn(true);
        }
        return errorMessage;
    };

    const logout = async () => {
        await logOutAction();
        setUser(null);
        setIsLoggedIn(false);
        window.location.reload();
    };

    const value = {
        user,
        isLoggedIn,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// create context that should be used by the children, above is just the provider
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};