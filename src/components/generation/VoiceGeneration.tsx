import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SongInput } from './SongInput';
import { VoiceControls } from './VoiceControls';
import { ProgressVisualization } from './ProgressVisualization';
import { ResultsDisplay } from './ResultsDisplay';
import { GlassmorphicContainer } from '../layout/GlassmorphicContainer';
import { aiService } from '../../services/ai/aiService';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { ErrorMessage } from '../common/ErrorMessage';

export const VoiceGeneration = () => {
  const [selectedSong, setSelectedSong] = useState<File | null>(null);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const { audioRef, play, pause } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (settings: {
    pitch: number;
    formantShift: number;
    reverb: number;
  }) => {
    if (!selectedSong) return;
    
    setStatus('generating');
    setProgress(0);
    
    try {
      const songUrl = URL.createObjectURL(selectedSong);
      const result = await aiService.generateCover('model-id', songUrl, settings);
      setGeneratedAudio(result.audioUrl);
      setStatus('completed');
      setProgress(100);
      
      // Start polling progress
      pollProgress(result.jobId);
    } catch (error) {
      console.error('Error generating cover:', error);
      setStatus('failed');
      setError('Failed to generate cover. Please try again.');
    }
  };

  const handleShare = async () => {
    if (generatedAudio) {
      try {
        await navigator.share({
          title: 'My AI Voice Cover',
          text: 'Check out my AI-generated voice cover!',
          url: generatedAudio
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const pollProgress = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await aiService.getTrainingStatus(jobId);
        setProgress(status.progress);
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          setStatus(status.status);
        }
      } catch (error) {
        console.error('Error polling progress:', error);
        clearInterval(interval);
        setStatus('failed');
      }
    }, 1000);
  };

  const handlePlay = (url: string) => {
    play(url);
    setIsPlaying(true);
  };

  const handlePause = () => {
    pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioRef]);

  useEffect(() => {
    return () => {
      if (selectedSong) {
        URL.revokeObjectURL(URL.createObjectURL(selectedSong));
      }
      if (generatedAudio) {
        URL.revokeObjectURL(generatedAudio);
      }
    };
  }, [selectedSong, generatedAudio]);

  return (
    <div className="space-y-8">
      <motion.h2 
        className="text-3xl font-bold text-center text-white/90"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Generate Your Cover
      </motion.h2>

      <SongInput onSongSelect={setSelectedSong} />
      
      <AnimatePresence mode="wait">
        {selectedSong && status === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <VoiceControls onSettingsChange={handleGenerate} />
          </motion.div>
        )}

        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ProgressVisualization 
              progress={progress} 
              status={status} 
            />
          </motion.div>
        )}

        {status === 'completed' && generatedAudio && selectedSong && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ResultsDisplay
              originalAudio={URL.createObjectURL(selectedSong)}
              generatedAudio={generatedAudio}
              onShare={handleShare}
              onPlay={handlePlay}
              onPause={handlePause}
              isPlaying={isPlaying}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} className="hidden" />

      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => {
            setError(null);
            setStatus('idle');
          }}
        />
      )}
    </div>
  );
}; 