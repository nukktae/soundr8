import axios from 'axios';

interface TrainingConfig {
  modelType: 'RVC' | 'SO_VITS_SVC';
  epochs: number;
  learningRate: number;
}

export class AIService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  async startTraining(userId: string, audioFiles: string[], config: TrainingConfig) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/train`, {
        userId,
        audioFiles,
        config
      });
      return response.data;
    } catch (error) {
      console.error('Error starting model training:', error);
      throw error;
    }
  }

  async getTrainingStatus(jobId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/train/status/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting training status:', error);
      throw error;
    }
  }

  async generateCover(modelId: string, songUrl: string, config: {
    pitch: number;
    formantShift: number;
    reverb: number;
  }) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        modelId,
        songUrl,
        config
      });
      return response.data;
    } catch (error) {
      console.error('Error generating cover:', error);
      throw error;
    }
  }
}

export const aiService = new AIService(); 