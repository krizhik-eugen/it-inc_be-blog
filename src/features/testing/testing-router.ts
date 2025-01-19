import { Router } from 'express';
import { container } from '../../app-composition-root';
import { TestingController } from './testing-controller';

export const testingRouter = Router();

const testingController = container.get(TestingController);

testingRouter.delete(
    '/',
    testingController.deleteAllData.bind(testingController)
);
