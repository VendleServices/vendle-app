"use client"

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type TransitionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export const FadeTransition = ({ children, className = "", delay = 0 }: TransitionProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideUpTransition = ({ children, className = "", delay = 0 }: TransitionProps) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideDownTransition = ({ children, className = "", delay = 0 }: TransitionProps) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 20, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleTransition = ({ children, className = "", delay = 0 }: TransitionProps) => (
  <motion.div
    initial={{ scale: 0.97, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.97, opacity: 0 }}
    transition={{ duration: 0.3, ease: "easeOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const PageTransition = ({ children, className = "" }: TransitionProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className={className}
  >
    {children}
  </motion.div>
);
