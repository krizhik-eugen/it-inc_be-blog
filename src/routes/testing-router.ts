import { Router } from 'express';
import { testingController } from '../controllers';

export const testingRouter = Router();

testingRouter.delete('/', testingController.deleteAllData);
