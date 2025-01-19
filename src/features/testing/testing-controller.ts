import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TestingService } from './testing-service';

@injectable()
export class TestingController {
    constructor(
        @inject(TestingService) protected testingService: TestingService
    ) {}

    async deleteAllData(req: Request, res: Response) {
        await this.testingService.deleteAllData();
        res.sendStatus(204);
    }
}
