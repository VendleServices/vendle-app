"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function InformSitePage() {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-start min-h-screen p-4 pt-32"
        >
            <div className="text-center space-y-12">
                <h1 className="text-5xl font-bold text-vendle-navy leading-tight">
                    The site must be cleared before inspection can begin
                </h1>
                <Button
                    onClick={() => router.push("/start-claim/create-restor")}
                    className="bg-vendle-navy text-white hover:bg-vendle-navy/90 px-12 py-8 text-xl"
                >
                    I understand
                </Button>
            </div>
        </motion.div>
    );
} 