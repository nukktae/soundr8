import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiAdjustments } from 'react-icons/hi';
import { GlassmorphicContainer } from '../layout/GlassmorphicContainer';

interface VoiceControlsProps {
  onSettingsChange: (settings: {
    pitch: number;
    formantShift: number;
    reverb: number;
  }) => void;
}

export const VoiceControls = ({ onSettingsChange }: VoiceControlsProps) => {
  const [settings, setSettings] = useState({
    pitch: 0,
    formantShift: 0,
    reverb: 0
  });

  const handleChange = (key: keyof typeof settings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <GlassmorphicContainer className="w-full">
      <div className="space-y-6 p-4">
        <div className="flex items-center space-x-2 text-white/80">
          <HiAdjustments className="w-5 h-5" />
          <h3 className="text-lg font-medium">Voice Controls</h3>
        </div>

        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-white/60">
              <label className="text-sm capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <span className="text-sm">{value}</span>
            </div>
            <motion.input
              type="range"
              min={-100}
              max={100}
              value={value}
              onChange={(e) => handleChange(key as keyof typeof settings, Number(e.target.value))}
              className="w-full accent-pink-400 bg-white/10 rounded-lg appearance-none h-2"
              whileHover={{ scale: 1.02 }}
            />
          </div>
        ))}
      </div>
    </GlassmorphicContainer>
  );
}; 