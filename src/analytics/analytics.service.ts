import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { RoomReservation } from '../rooms/entities/room-reservation.entity';
import { OrderStatus } from '../orders/enums/order.enum';
import { ReservationStatus } from '../rooms/enums/room.enum';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(RoomReservation)
    private reservationRepo: Repository<RoomReservation>,
  ) {}

  async getDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const baseQuery = () =>
      this.orderRepo
        .createQueryBuilder('order')
        .where('order.status != :cancelled', {
          cancelled: OrderStatus.CANCELLED,
        });

    const todayRevenue = await baseQuery()
      .select('COALESCE(SUM(order.totalPrice), 0)', 'total')
      .andWhere('order.createdAt >= :today', { today })
      .getRawOne();

    const todayOrderCount = await baseQuery()
      .andWhere('order.createdAt >= :today', { today })
      .getCount();

    const monthlyRevenue = await baseQuery()
      .select('COALESCE(SUM(order.totalPrice), 0)', 'total')
      .andWhere('order.createdAt >= :startOfMonth', { startOfMonth })
      .getRawOne();

    const totalOrders = await this.orderRepo.count();
    const pendingOrders = await this.orderRepo.count({
      where: { status: OrderStatus.CONFIRMED },
    });
    const completedOrders = await this.orderRepo.count({
      where: { status: OrderStatus.COMPLETED },
    });
    const cancelledOrders = await this.orderRepo.count({
      where: { status: OrderStatus.CANCELLED },
    });

    const avgOrderValue = await baseQuery()
      .select('COALESCE(AVG(order.totalPrice), 0)', 'avg')
      .getRawOne();

    return {
      todayRevenue: Number(todayRevenue.total),
      todayOrderCount,
      monthlyRevenue: Number(monthlyRevenue.total),
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      averageOrderValue: Number(avgOrderValue.avg),
    };
  }

  async getSales(period: 'daily' | 'weekly' | 'monthly' | 'annual') {
    const truncMap: Record<string, string> = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month',
      annual: 'year',
    };

    const unit = truncMap[period];
    if (!unit) {
      throw new BadRequestException(
        'Invalid period. Use daily, weekly, monthly, or annual.',
      );
    }

    const results = await this.orderRepo
      .createQueryBuilder('order')
      .select(`DATE_TRUNC('${unit}', order.createdAt)`, 'period')
      .addSelect('COALESCE(SUM(order.totalPrice), 0)', 'revenue')
      .addSelect('COUNT(*)', 'orderCount')
      .where('order.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .groupBy(`DATE_TRUNC('${unit}', order.createdAt)`)
      .orderBy(`DATE_TRUNC('${unit}', order.createdAt)`, 'ASC')
      .getRawMany();

    return results.map((r) => ({
      period: r.period,
      revenue: Number(r.revenue),
      orderCount: Number(r.orderCount),
    }));
  }

  async getBestSellers(limit: number = 5) {
    const results = await this.orderItemRepo
      .createQueryBuilder('item')
      .innerJoin('item.order', 'order')
      .select('item.cakeName', 'cakeName')
      .addSelect('SUM(item.quantity)', 'totalQuantity')
      .addSelect('COALESCE(SUM(item.lineTotal), 0)', 'totalRevenue')
      .where('order.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .groupBy('item.cakeName')
      .orderBy('SUM(item.quantity)', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map((r) => ({
      cakeName: r.cakeName,
      totalQuantity: Number(r.totalQuantity),
      totalRevenue: Number(r.totalRevenue),
    }));
  }

  async getReservationStats() {
    const totalReservations = await this.reservationRepo.count();

    const byStatus = await this.reservationRepo
      .createQueryBuilder('reservation')
      .select('reservation.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('reservation.status')
      .getRawMany();

    const byRoom = await this.reservationRepo
      .createQueryBuilder('reservation')
      .innerJoin('reservation.room', 'room')
      .select('room.name', 'roomName')
      .addSelect('COUNT(*)', 'count')
      .where('reservation.status != :cancelled', {
        cancelled: ReservationStatus.CANCELLED,
      })
      .groupBy('room.name')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany();

    return {
      totalReservations,
      byStatus: byStatus.map((r) => ({
        status: r.status,
        count: Number(r.count),
      })),
      byRoom: byRoom.map((r) => ({
        roomName: r.roomName,
        count: Number(r.count),
      })),
    };
  }

  private escapeCsvField(value: string | number): string {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  async exportOrdersCsv(): Promise<string> {
    const orders = await this.orderRepo.find({
      order: { createdAt: 'DESC' },
    });

    const header = [
      'Order ID',
      'Status',
      'Payment Status',
      'Pickup Date',
      'Pickup Time',
      'Total Price',
      'Created At',
    ];
    const rows = orders.map((o) => [
      String(o.id),
      String(o.status),
      String(o.paymentStatus),
      String(o.pickupDate),
      String(o.pickupTime),
      String(o.totalPrice),
      o.createdAt.toISOString(),
    ]);

    const lines = [header, ...rows].map((row) =>
      row.map((field) => this.escapeCsvField(field)).join(','),
    );

    return lines.join('\n');
  }

  async exportSalesCsv(
    period: 'daily' | 'weekly' | 'monthly' | 'annual',
  ): Promise<string> {
    const salesData = await this.getSales(period);

    const header = ['Period', 'Revenue', 'Order Count'];
    const rows = salesData.map((s) => [s.period, s.revenue, s.orderCount]);

    const lines = [header, ...rows].map((row) =>
      row.map((field) => this.escapeCsvField(field)).join(','),
    );

    return lines.join('\n');
  }
}
