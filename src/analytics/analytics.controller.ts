import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../users/decorators/roles.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@Roles('owner')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @ApiOperation({
    summary:
      'Owner dashboard overview — today/monthly revenue, order counts, average order value',
  })
  @Get('/dashboard')
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @ApiOperation({ summary: 'Revenue and order count grouped by time period' })
  @ApiQuery({
    name: 'period',
    enum: ['daily', 'weekly', 'monthly', 'annual'],
    description: 'Grouping period for the sales breakdown',
  })
  @Get('/sales')
  getSales(@Query('period') period: 'daily' | 'weekly' | 'monthly' | 'annual') {
    return this.analyticsService.getSales(period);
  }

  @ApiOperation({ summary: 'Best-selling cakes by quantity sold' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'How many top cakes to return (default 5)',
  })
  @Get('/best-sellers')
  getBestSellers(@Query('limit') limit?: number) {
    return this.analyticsService.getBestSellers(
      limit ? Number(limit) : undefined,
    );
  }

  @ApiOperation({
    summary: 'Room reservation statistics — totals by status and by room',
  })
  @Get('/reservations')
  getReservationStats() {
    return this.analyticsService.getReservationStats();
  }

  @ApiOperation({ summary: 'Download all orders as a CSV file' })
  @ApiResponse({
    status: 200,
    description: 'CSV file stream',
    content: { 'text/csv': {} },
  })
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

  @ApiOperation({ summary: 'Download sales-by-period as a CSV file' })
  @ApiQuery({
    name: 'period',
    enum: ['daily', 'weekly', 'monthly', 'annual'],
  })
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
