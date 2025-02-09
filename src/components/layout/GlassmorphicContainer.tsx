import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassmorphicContainerProps {
  children: ReactNode;
  className?: string;
}

export const GlassmorphicContainer = ({ children, className = '' }: GlassmorphicContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative backdrop-blur-xl bg-white/10 
        rounded-3xl border border-white/20 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        p-6 ${className}
      `}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}; 