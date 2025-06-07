"use client";

import { motion } from "framer-motion";

export default function StartClaimLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center py-8 px-4"
        >
            {children}
        </motion.div>
    );
} 