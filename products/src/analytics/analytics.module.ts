import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AnalyticsListener } from './analytics.listener';
import { AnalyticsResolver } from './analytics.resolver';
import { Analytics, AnalyticsSchema } from './analytics.schema';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analytics.name, schema: AnalyticsSchema },
    ]),
  ],
  providers: [AnalyticsListener, AnalyticsService, AnalyticsResolver],
})
export class AnalyticsModule {}
