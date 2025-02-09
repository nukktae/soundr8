import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AudioState {
  recordings: {
    id: string;
    url: string;
    duration: number;
    createdAt: string;
  }[];
  isTraining: boolean;
  modelStatus: 'idle' | 'training' | 'ready' | 'error';
}

const initialState: AudioState = {
  recordings: [],
  isTraining: false,
  modelStatus: 'idle'
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    addRecording: (state, action: PayloadAction<{
      id: string;
      url: string;
      duration: number;
    }>) => {
      state.recordings.push({
        ...action.payload,
        createdAt: new Date().toISOString()
      });
    },
    setModelStatus: (state, action: PayloadAction<AudioState['modelStatus']>) => {
      state.modelStatus = action.payload;
      state.isTraining = action.payload === 'training';
    },
    clearRecordings: (state) => {
      state.recordings = [];
    }
  }
});

export const { addRecording, setModelStatus, clearRecordings } = audioSlice.actions;
export default audioSlice.reducer; 