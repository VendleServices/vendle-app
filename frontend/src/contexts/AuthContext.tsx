"use client"
import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { signUpAction, logOutAction, loginAction } from "@/actions/users";
import { createClient } from "@/auth/client";

type User = {
    id: string; // Supabase UUID
    email: string;
    user_type: string;
    user_id?: number;
    name: string;
    picture?: string;
    companyName?: string;
    companyWebsite?: string;
    phoneNumber?: string;
}

type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    isLoading: boolean;
    token: string | null; // JWT token for API calls
    login: (email: string, password: string) => Promise<string | null>;
    signup: (email: string, password: string, userType?: string, companyName?: string, phoneNumber?: string, companyWebsite?: string) => Promise<string | null>;
    logout: () => Promise<void>;
    // Helper function to get current token
    getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(null);
    const supabase = createClient();

    // Helper function to get current access token
    const getAccessToken = async (): Promise<string | null> => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return session?.access_token || null;
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const { data: { user: supabaseUser } } = await supabase.auth.getUser();

                console.log('Supabase user:', supabaseUser);

                if (supabaseUser && session) {
                    const userData: User = {
                        id: supabaseUser.id, // Supabase UUID
                        email: supabaseUser.email!,
                        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || "User",
                        user_type: supabaseUser.user_metadata?.user_type || "homeowner",
                        user_id: supabaseUser.user_metadata?.user_id, // keep for compatibility
                        picture: supabaseUser.user_metadata?.picture,
                        companyName: supabaseUser.user_metadata?.companyName,
                        phoneNumber: supabaseUser.user_metadata?.phoneNumber,
                        companyWebsite: supabaseUser.user_metadata?.companyWebsite,
                    };
                    console.log('Setting user data:', userData); // Debug log
                    setUser(userData);
                    setToken(session.access_token);
                    setIsLoggedIn(true);
                } else {
                    console.log('No user found'); // Debug log
                    setUser(null);
                    setToken(null);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error getting user:', error);
                setUser(null);
                setToken(null);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        }

        getUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state change:', event, session?.user?.email); // Debug log

                try {
                    if (session?.user) {
                        if (event === "SIGNED_IN") {
                            await fetch('http://localhost:3001/api/signup', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    id: session?.user?.id,
                                    email: session?.user?.email,
                                    userType: session?.user?.user_metadata?.user_type,
                                    companyName: session?.user?.user_metadata?.companyName,
                                    phoneNumber: session?.user?.user_metadata?.phoneNumber,
                                    companyWebsite: session?.user?.user_metadata?.companyWebsite,
                                })
                            });
                        }
                        const userData: User = {
                            id: session.user.id, // Supabase UUID
                            email: session.user.email!,
                            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || "User",
                            user_type: session.user.user_metadata?.user_type || "homeowner",
                            user_id: session.user.user_metadata?.user_id, // keep for compatibility
                            picture: session.user.user_metadata?.picture,
                            companyName: session?.user?.user_metadata?.companyName,
                            phoneNumber: session?.user?.user_metadata?.phoneNumber,
                            companyWebsite: session?.user?.user_metadata?.companyWebsite,
                        };
                        setUser(userData);
                        setToken(session.access_token);
                        setIsLoggedIn(true);
                    } else {
                        setUser(null);
                        setToken(null);
                        setIsLoggedIn(false);
                    }
                } catch (error) {
                    console.error('Error in auth state change:', error);
                    setUser(null);
                    setToken(null);
                    setIsLoggedIn(false);
                }
                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    const login = async (email: string, password: string): Promise<string | null> => {
        const result = await loginAction(email, password);
        return result.errorMessage;
    };

    const signup = async (email: string, password: string, userType: string | undefined, companyName: string | undefined, phoneNumber: string | undefined, companyWebsite: string | undefined): Promise<string | null> => {
        const { id, errorMessage } = await signUpAction(email, password, userType, companyName, phoneNumber, companyWebsite);
        return errorMessage;
    };

    const logout = async (): Promise<void> => {
        try {
            // Clear the session using the client-side supabase instance
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error signing out:', error);
            }

            // Also call the server action to ensure server-side cleanup
            await logOutAction();

            // The onAuthStateChange listener should handle updating the state
            // But let's also manually update it to ensure immediate UI updates
            setUser(null);
            setToken(null);
            setIsLoggedIn(false);

            // Navigate to home page
            window.location.href = '/';
        } catch (error) {
            console.error('Error during logout:', error);
            // Fallback: manually clear state if logout action fails
            setUser(null);
            setToken(null);
            setIsLoggedIn(false);
            window.location.href = '/';
        }
    };

    const value: UserAuth = {
        user,
        isLoggedIn,
        isLoading,
        token,
        login,
        signup,
        logout,
        getAccessToken
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