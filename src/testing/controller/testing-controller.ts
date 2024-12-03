import { Request, Response } from 'express';
import { testingService } from '../service';

export const testingController = {
    async deleteAllData(req: Request, res: Response) {
        await testingService.deleteAllData();
        res.sendStatus(204);
    },
};
