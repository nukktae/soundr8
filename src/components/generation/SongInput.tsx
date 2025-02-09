import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMusicNote } from 'react-icons/hi';
import { GlassmorphicContainer } from '../layout/GlassmorphicContainer';

interface SongInputProps {
  onSongSelect: (file: File) => void;
}

export const SongInput = ({ onSongSelect }: SongInputProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onSongSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <GlassmorphicContainer className="w-full">
      <motion.div
        className={`
          relative p-8 rounded-2xl border-2 border-dashed
          ${dragActive ? 'border-pink-400' : 'border-white/20'}
          transition-colors duration-200
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex flex-col items-center space-y-4 text-white/80">
          <HiMusicNote className="w-12 h-12" />
          <p className="text-lg font-medium">
            Drop your song file here or
            <label className="ml-1 text-pink-400 cursor-pointer hover:text-pink-300">
              browse
              <input
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onSongSelect(e.target.files[0]);
                  }
                }}
              />
            </label>
          </p>
          <p className="text-sm text-white/60">
            Supports MP3, WAV (Max 10MB)
          </p>
        </div>
      </motion.div>
    </GlassmorphicContainer>
  );
}; 