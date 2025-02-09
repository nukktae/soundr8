import { motion } from 'framer-motion';
import { GlassmorphicContainer } from '../layout/GlassmorphicContainer';

interface ProgressVisualizationProps {
  progress: number;
  status: 'training' | 'generating' | 'completed' | 'failed';
}

export const ProgressVisualization = ({ progress, status }: ProgressVisualizationProps) => {
  const statusColors = {
    training: 'from-blue-400 to-purple-400',
    generating: 'from-purple-400 to-pink-400',
    completed: 'from-green-400 to-emerald-400',
    failed: 'from-red-400 to-pink-400'
  };

  return (
    <GlassmorphicContainer>
      <div className="p-6 space-y-4">
        <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`absolute h-full rounded-full bg-gradient-to-r ${statusColors[status]}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm capitalize">{status}</span>
          <motion.span 
            className="text-white/80 font-medium"
            key={progress}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {progress}%
          </motion.span>
        </div>

        <motion.div
          className="flex justify-center"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {status === 'training' && <span className="text-blue-400">Training your voice model...</span>}
          {status === 'generating' && <span className="text-purple-400">Generating your cover...</span>}
          {status === 'completed' && <span className="text-green-400">Ready to download!</span>}
          {status === 'failed' && <span className="text-red-400">Something went wrong</span>}
        </motion.div>
      </div>
    </GlassmorphicContainer>
  );
}; 