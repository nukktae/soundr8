import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphicContainer } from '../layout/GlassmorphicContainer';
import { VoiceRecorder } from '../audio/VoiceRecorder';
import { WaveformVisualizer } from '../audio/WaveformVisualizer';
import { useAudioProcessor } from '../../hooks/useAudioProcessor';
import { HiSparkles } from 'react-icons/hi';

export const ModernVoiceTraining = () => {
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const { processAudio, audioContext, isProcessing } = useAudioProcessor();
  const [recordingCount, setRecordingCount] = useState(0);

  useEffect(() => {
    const initStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(mediaStream);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    initStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 p-8">
      <GlassmorphicContainer className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <motion.div className="text-center space-y-4">
            <motion.div
              className="inline-flex items-center space-x-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <HiSparkles className="text-pink-400" />
              <h1>Voice AI Studio</h1>
            </motion.div>
            <p className="text-white/80">
              Transform your voice into an AI-powered singing sensation
            </p>
          </motion.div>

          <div className="relative">
            <WaveformVisualizer
              audioContext={audioContext}
              stream={stream}
              isRecording={isProcessing}
            />
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <VoiceRecorder
                onRecordingComplete={async (blob) => {
                  await processAudio(blob);
                  setRecordingCount(prev => prev + 1);
                }}
              />
            </div>
          </div>

          <AnimatePresence>
            {recordingCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-white/80"
              >
                {recordingCount} recordings captured
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassmorphicContainer>
    </div>
  );
}; 