import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

interface TrainingJob {
  id: string;
  userId: string;
  status: 'pending' | 'training' | 'completed' | 'failed';
  progress: number;
  modelPath?: string;
  error?: string;
}

class AIProcessingService {
  private jobs: Map<string, TrainingJob> = new Map();

  async startTraining(userId: string, audioFiles: string[]) {
    const jobId = `train_${Date.now()}_${userId}`;
    const job: TrainingJob = {
      id: jobId,
      userId,
      status: 'pending',
      progress: 0
    };

    this.jobs.set(jobId, job);

    try {
      // Start RVC training process
      const pythonProcess = spawn('python', [
        'train_rvc.py',
        '--user_id', userId,
        '--audio_files', ...audioFiles,
        '--job_id', jobId
      ]);

      pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Progress:')) {
          const progress = parseInt(output.split(':')[1]);
          this.updateJobProgress(jobId, progress);
        }
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          this.completeJob(jobId);
        } else {
          this.failJob(jobId, 'Training process failed');
        }
      });

      return job;
    } catch (error) {
      this.failJob(jobId, error.message);
      throw error;
    }
  }

  private updateJobProgress(jobId: string, progress: number) {
    const job = this.jobs.get(jobId);
    if (job) {
      job.progress = progress;
      job.status = 'training';
      this.jobs.set(jobId, job);
    }
  }

  private completeJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (job) {
      job.status = 'completed';
      job.progress = 100;
      this.jobs.set(jobId, job);
    }
  }

  private failJob(jobId: string, error: string) {
    const job = this.jobs.get(jobId);
    if (job) {
      job.status = 'failed';
      job.error = error;
      this.jobs.set(jobId, job);
    }
  }

  getJobStatus(jobId: string): TrainingJob | undefined {
    return this.jobs.get(jobId);
  }
}

export const aiProcessingService = new AIProcessingService(); 