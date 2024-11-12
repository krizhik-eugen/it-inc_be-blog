import { Request, Response } from "express";
import { testingModel } from "../models/testing-model";

export const testingController = {
    deleteAllData(req: Request, res: Response) {
        testingModel.deleteAllData();
        res.sendStatus(204);
    },
};
