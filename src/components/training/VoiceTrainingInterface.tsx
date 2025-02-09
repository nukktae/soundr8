import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { VoiceRecorder } from '../audio/VoiceRecorder';
import { WaveformVisualizer } from '../audio/WaveformVisualizer';
import { useAudioProcessor } from '../../hooks/useAudioProcessor';
import { addRecording, setModelStatus } from '../../store/slices/audioSlice';
import { HiMicrophone, HiPlay, HiStop } from 'react-icons/hi';

export const VoiceTrainingInterface = () => {
  const dispatch = useDispatch();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { processAudio, audioContext, isProcessing } = useAudioProcessor();
  const modelStatus = useSelector((state: any) => state.audio.modelStatus);

  const handleRecordingComplete = async (blob: Blob) => {
    try {
      const audioBuffer = await processAudio(blob);
      const url = URL.createObjectURL(blob);
      
      dispatch(addRecording({
        id: Date.now().toString(),
        url,
        duration: audioBuffer.duration
      }));

      if (modelStatus === 'idle') {
        dispatch(setModelStatus('training'));
        // Here we'll add the API call to start model training
      }
    } catch (error) {
      console.error('Error processing recording:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-2">Voice Training</h2>
        <p className="text-gray-600">
          Record at least 30 seconds of your voice to train the AI model
        </p>
      </motion.div>

      <div className="w-full max-w-2xl">
        <WaveformVisualizer
          audioContext={audioContext}
          stream={stream || undefined}
          isRecording={isProcessing}
        />
      </div>

      <VoiceRecorder onRecordingComplete={handleRecordingComplete} />

      <motion.div
        className="text-sm text-gray-500"
        animate={{
          color: modelStatus === 'training' ? '#EF4444' : '#6B7280'
        }}
      >
        Status: {modelStatus.charAt(0).toUpperCase() + modelStatus.slice(1)}
      </motion.div>
    </div>
  );
}; 