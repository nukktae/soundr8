import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphicContainer } from '../layout/GlassmorphicContainer';
import { HiDownload, HiPlay, HiPause, HiShare } from 'react-icons/hi';

interface ResultsDisplayProps {
  originalAudio: string;
  generatedAudio: string;
  onShare: () => void;
  onPlay: (url: string) => void;
  onPause: () => void;
  isPlaying: boolean;
}

export const ResultsDisplay = ({ 
  originalAudio, 
  generatedAudio, 
  onShare,
  onPlay,
  onPause,
  isPlaying 
}: ResultsDisplayProps) => {
  const [activeAudio, setActiveAudio] = useState<'original' | 'generated'>('generated');
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay(activeAudio === 'original' ? originalAudio : generatedAudio);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(generatedAudio);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-voice-cover.mp3';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <GlassmorphicContainer>
      <div className="p-6 space-y-6">
        <div className="flex justify-center space-x-4">
          <motion.button
            className={`px-4 py-2 rounded-full ${
              activeAudio === 'original' 
                ? 'bg-white/20 text-white' 
                : 'text-white/60'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveAudio('original')}
          >
            Original
          </motion.button>
          <motion.button
            className={`px-4 py-2 rounded-full ${
              activeAudio === 'generated' 
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white' 
                : 'text-white/60'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveAudio('generated')}
          >
            AI Generated
          </motion.button>
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            className="p-4 rounded-full bg-white/10 text-white/80 hover:bg-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlayPause}
          >
            {isPlaying ? <HiPause className="w-6 h-6" /> : <HiPlay className="w-6 h-6" />}
          </motion.button>
          
          <motion.button
            className={`p-4 rounded-full ${
              isDownloading 
                ? 'bg-white/20' 
                : 'bg-gradient-to-r from-purple-400 to-pink-400'
            } text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={async () => {
              setIsDownloading(true);
              await handleDownload();
              setIsDownloading(false);
            }}
            disabled={isDownloading}
          >
            <HiDownload className="w-6 h-6" />
          </motion.button>

          <motion.button
            className="p-4 rounded-full bg-white/10 text-white/80 hover:bg-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onShare}
          >
            <HiShare className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </GlassmorphicContainer>
  );
}; 