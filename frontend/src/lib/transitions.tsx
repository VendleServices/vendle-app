import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

export const FadeTransition = ({ children, ...props }: { children: React.ReactNode }) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

type Props = React.ComponentProps<typeof motion.div>;

export const SlideUpTransition = React.forwardRef<HTMLDivElement, Props>(
  ({ children, ...props }, ref) => (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        // add a key from the parent when you want exit/enter to trigger (e.g., route/path)
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        {...props}   // now className, style, etc. are typed and work
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
);
SlideUpTransition.displayName = 'SlideUpTransition';

type PageTransitionProps = React.ComponentProps<typeof motion.div>;

export const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...props}
    >
      {children}
    </motion.div>
  )
);
PageTransition.displayName = 'PageTransition';