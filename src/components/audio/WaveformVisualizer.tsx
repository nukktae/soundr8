import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
  audioContext: AudioContext;
  stream?: MediaStream;
  isRecording: boolean;
}

export const WaveformVisualizer = ({ audioContext, stream, isRecording }: WaveformVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d')!;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      analyser.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = 'rgb(36, 36, 36)';
      canvasCtx.fillRect(0, 0, width, height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = isRecording ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)';
      canvasCtx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      source.disconnect();
    };
  }, [stream, audioContext, isRecording]);

  return (
    <motion.canvas
      ref={canvasRef}
      width={600}
      height={200}
      className="w-full max-w-2xl rounded-lg bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}; 