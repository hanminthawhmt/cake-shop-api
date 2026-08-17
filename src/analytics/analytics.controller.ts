import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../users/decorators/roles.decorator';

@Roles('owner')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('/dashboard')
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('/sales')
  getSales(@Query('period') period: 'daily' | 'weekly' | 'monthly' | 'annual') {
    return this.analyticsService.getSales(period);
  }

  @Get('/best-sellers')
  getBestSellers(@Query('limit') limit?: number) {
    return this.analyticsService.getBestSellers(
      limit ? Number(limit) : undefined,
    );
  }

  @Get('/reservations')
  getReservationStats() {
    return this.analyticsService.getReservationStats();
  }

  @Get('/export/orders')
  async exportOrders(@Res() res: Response) {
    const csv = await this.analyticsService.exportOrdersCsv();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="orders-export.csv"',
    );
    res.send(csv);
  }

  @Get('/export/sales')
  async exportSales(
    @Query('period') period: 'daily' | 'weekly' | 'monthly' | 'annual',
    @Res() res: Response,
  ) {
    const csv = await this.analyticsService.exportSalesCsv(period);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="sales-export.csv"',
    );
    res.send(csv);
  }

}
