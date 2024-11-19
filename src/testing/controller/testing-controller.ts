import { Request, Response } from 'express';
import { testingModel } from '../model';

export const testingController = {
    async deleteAllData(req: Request, res: Response) {
        await testingModel.deleteAllData();
        res.sendStatus(204);
    },
};
