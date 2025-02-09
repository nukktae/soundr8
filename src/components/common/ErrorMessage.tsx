import { motion } from 'framer-motion';
import { HiExclamation } from 'react-icons/hi';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <motion.div
      className="bg-red-500/10 rounded-lg p-4 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <HiExclamation className="w-8 h-8 text-red-400 mx-auto mb-2" />
      <p className="text-red-400 mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
}; 