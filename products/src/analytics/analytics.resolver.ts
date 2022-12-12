import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { Analytics } from './analytics.schema';
import { AnalyticsService } from './analytics.service';
import { GetAnalyticsInput } from './dto/get-analytics.input';

@Resolver(() => Analytics)
export class AnalyticsResolver {
  constructor(private analyticsService: AnalyticsService) {}

  @Query(() => [Analytics], { nullable: true })
  @Roles('admin')
  @UseGuards(GqlAuthGuard, RolesGuard)
  getProductAnalytics(
    @Args('getAnalyticsInput') getAnalyticsInput: GetAnalyticsInput,
  ) {
    return this.analyticsService.getProductAnalytics(getAnalyticsInput);
  }
}
