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
    isLoading: boolean,
    login: (email: string, password: string) => Promise<string | null>,
    signup: (email: string, password: string) => Promise<string | null>,
    logout: () => Promise<void>
}

const AuthContext = createContext<UserAuth | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user: supabaseUser } } = await supabase.auth.getUser()
                console.log('Supabase user:', supabaseUser); // Debug log
                
                if (supabaseUser) {
                    const userData = { 
                        email: supabaseUser.email!, 
                        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || "User", 
                        user_type: supabaseUser.user_metadata?.user_type || "homeowner",
                        user_id: supabaseUser.user_metadata?.user_id,
                        picture: supabaseUser.user_metadata?.picture
                    };
                    console.log('Setting user data:', userData); // Debug log
                    setUser(userData);
                    setIsLoggedIn(true);
                } else {
                    console.log('No user found'); // Debug log
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error getting user:', error);
                setUser(null);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        }

        getUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('Auth state change:', event, session?.user?.email); // Debug log
                
                try {
                    if (session?.user) {
                        const userData = { 
                            email: session.user.email!, 
                            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || "User", 
                            user_type: session.user.user_metadata?.user_type || "homeowner",
                            user_id: session.user.user_metadata?.user_id,
                            picture: session.user.user_metadata?.picture
                        };
                        setUser(userData);
                        setIsLoggedIn(true);
                    } else {
                        setUser(null);
                        setIsLoggedIn(false);
                    }
                } catch (error) {
                    console.error('Error in auth state change:', error);
                    setUser(null);
                    setIsLoggedIn(false);
                }
                setIsLoading(false);
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase]);

    const login = async (email: string, password: string) => {
        const errorMessage = (await loginAction(email, password)).errorMessage;
        return errorMessage;
    };

    const signup = async (email: string, password: string) => {
        const errorMessage = (await signUpAction(email, password)).errorMessage;
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
        isLoading,
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