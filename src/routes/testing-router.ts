import { Router } from "express";
import { testingController } from "../controllers/testing-controller";

export const testingRouter = Router();

testingRouter.delete('/', testingController.deleteAllData);
