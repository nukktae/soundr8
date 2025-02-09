import { useState, useCallback } from 'react';

interface AudioProcessorOptions {
  sampleRate?: number;
  channels?: number;
}

export const useAudioProcessor = (options: AudioProcessorOptions = {}) => {
  const [audioContext] = useState(() => new (window.AudioContext || 
    (window as any).webkitAudioContext)());
  const [isProcessing, setIsProcessing] = useState(false);

  const processAudio = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Here we'll add more processing logic later
      
      return audioBuffer;
    } catch (error) {
      console.error('Error processing audio:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [audioContext]);

  return {
    processAudio,
    isProcessing,
    audioContext
  };
}; 