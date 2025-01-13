import { Router } from 'express';
import { TestingController } from '../controller';
import { container } from '../../../app-composition-root';

export const testingRouter = Router();

const testingController = container.get(TestingController);

testingRouter.delete(
    '/',
    testingController.deleteAllData.bind(testingController)
);
