import { Request, Response } from 'express';
import { testingRepository } from '../repository';

export const testingController = {
    async deleteAllData(req: Request, res: Response) {
        await testingRepository.deleteAllData();
        res.sendStatus(204);
    },
};
