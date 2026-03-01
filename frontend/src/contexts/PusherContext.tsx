"use client"
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { pusherClient } from "@/lib/pusher";

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn && token) {
            // inject the latest token into pusher
            (pusherClient.config as any).auth = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            pusherClient.connect()
        } else {
            pusherClient.disconnect()
        }

        return () => pusherClient.disconnect();
    }, [token, isLoggedIn]);

    return <>{children}</>
};

