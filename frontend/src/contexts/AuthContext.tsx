"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from "@/auth/client";

interface UserMetadata {
    userType: string;
    companyName?: string;
    companyWebsite?: string;
    phoneNumber?: string;
}

interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    isLoggedIn: boolean
    token: string | null
    signup: (email: string, password: string, metadata?: UserMetadata) => Promise<{
        user: User | null
        error: AuthError | null
    }>
    login: (email: string, password: string) => Promise<{
        user: User | null
        error: AuthError | null
    }>
    logout: () => Promise<{ error: AuthError | null }>
    getAccessToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [token, setToken] = useState<string | null>(null)
    const supabase = createClient()

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
        // get the initial session
        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.log(error)
                }

                setSession(session)
                setUser(session?.user ?? null)
                if (session?.access_token && session?.user) {
                    setIsLoggedIn(true)
                    setToken(session.access_token)
                } else {
                    setIsLoggedIn(false)
                    setToken(null)
                    setUser(null)
                }
            } catch (error: any) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        initializeAuth()

        // listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event)
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)

                if (session?.access_token && session?.user) {
                    setToken(session.access_token)
                    setIsLoggedIn(true)
                } else {
                    setIsLoggedIn(false)
                    setToken(null)
                    setUser(null)
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signup = async (email: string, password: string, metadata?: UserMetadata) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata || {}
                }
            });

            if (error) {
                return { user: null, error }
            }

            return { user: data?.user, error: null }
        } catch (error) {
            console.error("Signup error:", error)
            return { user: null, error: error as AuthError }
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                return { user: null, error }
            }

            return { user: data?.user, error: null }
        } catch (error) {
            console.error("Login error:", error)
            return { user: null, error: error as AuthError }
        }
    }

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut()

            if (error) {
                return { error }
            }

            return { error: null }
        } catch (error) {
            console.error("Log out error.", error)
            return { error: error as AuthError }
        }
    }

    const value = {
        user,
        isLoggedIn,
        loading,
        token,
        session,
        login,
        signup,
        logout,
        getAccessToken
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}