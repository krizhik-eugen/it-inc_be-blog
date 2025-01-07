import { Request, Response } from 'express';
import { TestingService } from '../service';

export class TestingController {
    constructor(protected testingService: TestingService) {}

    async deleteAllData(req: Request, res: Response) {
        await this.testingService.deleteAllData();
        res.sendStatus(204);
    }
}
