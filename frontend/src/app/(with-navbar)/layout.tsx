'use client';

import { useState } from "react";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";

export default function NavbarLayout({
   children,
}: {
    children: React.ReactNode
}) {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <>
            <Navbar onProtectedAction={() => setShowLoginModal(true)} />
            <main id ="root">
                {children}
            </main>
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
}