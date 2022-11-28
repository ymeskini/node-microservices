import { Response } from 'express';
import { Request } from 'express-jwt';
import { AnalyticsService } from './analytics.service';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor(analyticsService: AnalyticsService) {
    this.analyticsService = analyticsService;
  }

  getLogs = async (req: Request, res: Response) => {
    const logs = await this.analyticsService.getUserLogs(req.body.userId);

    res.json(logs);
  };
}
