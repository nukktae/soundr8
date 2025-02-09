import { Router, Request, Response } from 'express';
import multer from 'multer';
import { processAudioFile } from '../services/audioProcessing';
import { aiProcessingService } from '../services/aiProcessing';
import path from 'path';
import { MulterFile, TrainRequestBody } from '../types/multer';
import { ParamsDictionary, RequestHandler } from 'express-serve-static-core';

// Define custom types for multer request
interface TypedRequestBody<T> extends Request {
  body: T;
}

interface JobParams extends ParamsDictionary {
  jobId: string;
}

const router = Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  })
});

// Type-safe route handlers
router.post(
  '/upload',
  upload.single('audio'),
  async (req: Request & { file?: MulterFile }, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No audio file provided' });
        return;
      }

      const processedFile = await processAudioFile(req.file.buffer);
      res.json({ success: true, file: processedFile });
    } catch (error) {
      res.status(500).json({ error: 'Error processing audio file' });
    }
  }
);

const trainHandler: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body as TrainRequestBody;
    const files = req.files as MulterFile[];
    
    if (!files || !files.length) {
      res.status(400).json({ error: 'No audio files provided' });
      return;
    }

    const filePaths = files.map(file => file.path);
    const job = await aiProcessingService.startTraining(userId, filePaths);
    res.json({ success: true, jobId: job.id });
  } catch (error) {
    res.status(500).json({ error: 'Error starting model training' });
  }
};

router.post('/train', upload.array('audioFiles'), trainHandler);

router.get(
  '/train/status/:jobId',
  async (req: Request<JobParams>, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      const status = await aiProcessingService.getJobStatus(jobId);
      
      if (!status) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }
      
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: 'Error getting job status' });
    }
  }
);

export default router; 