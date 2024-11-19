import { Router } from 'express';
import { testingController } from '../controller';

export const testingRouter = Router();

testingRouter.delete('/', testingController.deleteAllData);
