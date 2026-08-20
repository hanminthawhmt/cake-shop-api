import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { hash } from 'bcrypt';
import {
  UserFactory,
  CategoryFactory,
  CakeFactory,
  OrderFactory,
  RoomFactory,
  ReservationFactory,
} from './factories';
import { User, Role, AuthProvider } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Cake } from '../../cakes/entities/cake.entity';
import { Order } from '../../orders/entities/order.entity';
import { Room } from '../../rooms/entities/room.entity';
import { RoomReservation } from '../../rooms/entities/room-reservation.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    // Delete in order of dependencies
    await dataSource.query('DELETE FROM order_item_selected_values');
    await dataSource.query('DELETE FROM order_items');
    await dataSource.query('DELETE FROM orders');
    await dataSource.query('DELETE FROM cart_item_selected_values');
    await dataSource.query('DELETE FROM cart_items');
    await dataSource.query('DELETE FROM carts');
    await dataSource.query('DELETE FROM room_reservations');
    await dataSource.query('DELETE FROM room_images');
    await dataSource.query('DELETE FROM rooms');
    await dataSource.query('DELETE FROM cake_option_values');
    await dataSource.query('DELETE FROM cake_options');
    await dataSource.query('DELETE FROM cake_images');
    await dataSource.query('DELETE FROM cakes');
    await dataSource.query('DELETE FROM categories');
    await dataSource.query('DELETE FROM user_profiles');
    await dataSource.query('DELETE FROM users');

    // 1. Seed Users (50 customers)
    console.log('👥 Seeding users...');
    const userRepo = dataSource.getRepository(User);
    const userCount = 50;
    const userSeeds = [
      UserFactory.createOwner(),
      ...UserFactory.createCustomers(userCount),
    ];
    
    // Hash passwords for all users
    const usersWithHashedPasswords = await Promise.all(
      userSeeds.map(async (user) => ({
        ...user,
        password: await hash('password123', 10), // Default password for all test users
      })),
    );

    const savedUsers = await userRepo.save(usersWithHashedPasswords as any);
    console.log(`✅ Created ${savedUsers.length} users\n`);

    // 2. Seed Categories (10 categories)
    console.log('🏷️  Seeding categories...');
    const categoryRepo = dataSource.getRepository(Category);
    const categorySeeds = CategoryFactory.createCategories();
    const savedCategories = await categoryRepo.save(categorySeeds);
    console.log(`✅ Created ${savedCategories.length} categories\n`);

    // 3. Seed Cakes (80 cakes - 8 per category)
    console.log('🍰 Seeding cakes...');
    const cakeRepo = dataSource.getRepository(Cake);
    const categoryIds = savedCategories.map((c) => c.id);
    const cakeSeeds = CakeFactory.createCakes(categoryIds, 80);
    const savedCakes = await cakeRepo.save(cakeSeeds);
    console.log(`✅ Created ${savedCakes.length} cakes\n`);

    // 4. Seed Orders (200 orders over 6 months)
    console.log('📦 Seeding orders...');
    const orderRepo = dataSource.getRepository(Order);
    const userIds = savedUsers.map((u) => u.id).filter((id) => id !== undefined) as number[];
    const orderSeeds = OrderFactory.createOrders(userIds, 200);
    const savedOrders = await orderRepo.save(orderSeeds);
    console.log(`✅ Created ${savedOrders.length} orders\n`);

    // 5. Seed Order Items (2-4 items per order)
    console.log('📝 Seeding order items...');
    const orderItemRepo = dataSource.getRepository(OrderItem);
    const orderItems: any[] = [];
    
    for (const order of savedOrders) {
      const itemCount = Math.floor(Math.random() * 3) + 2; // 2-4 items per order
      for (let i = 0; i < itemCount; i++) {
        const cake = savedCakes[Math.floor(Math.random() * savedCakes.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 cakes
        const unitPrice = parseFloat(cake.basePrice.toString());
        const lineTotal = parseFloat((unitPrice * quantity).toFixed(2));
        
        orderItems.push({
          orderId: order.id,
          cakeId: cake.id,
          cakeName: cake.name,
          quantity,
          notes: Math.random() > 0.7 ? 'Make it extra chocolate!' : null,
          unitPrice,
          lineTotal,
        });
      }
    }

    await orderItemRepo.save(orderItems);
    console.log(`✅ Created ${orderItems.length} order items\n`);

    // 6. Seed Rooms (8 rooms)
    console.log('🏨 Seeding rooms...');
    const roomRepo = dataSource.getRepository(Room);
    const roomSeeds = RoomFactory.createRooms(8);
    const savedRooms = await roomRepo.save(roomSeeds);
    console.log(`✅ Created ${savedRooms.length} rooms\n`);

    // 7. Seed Room Reservations (100 reservations over 6 months)
    console.log('🎉 Seeding room reservations...');
    const reservationRepo = dataSource.getRepository(RoomReservation);
    const roomIds = savedRooms.map((r) => r.id).filter((id) => id !== undefined) as number[];
    
    // Generate reservations with uniqueness check
    const reservationSeeds: any[] = [];
    const uniqueReservations = new Set<string>();
    let attempts = 0;
    const maxAttempts = 500;
    
    while (reservationSeeds.length < 100 && attempts < maxAttempts) {
      const reservation = ReservationFactory.createReservation(
        roomIds[Math.floor(Math.random() * roomIds.length)],
        userIds[Math.floor(Math.random() * userIds.length)],
      );
      
      const uniqueKey = `${reservation.roomId}-${reservation.date}-${reservation.timeSlot}`;
      if (!uniqueReservations.has(uniqueKey)) {
        uniqueReservations.add(uniqueKey);
        reservationSeeds.push(reservation);
      }
      attempts++;
    }
    
    const savedReservations = await reservationRepo.save(reservationSeeds);
    console.log(`✅ Created ${savedReservations.length} room reservations\n`);

    console.log('✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${savedUsers.length}`);
    console.log(`   - Categories: ${savedCategories.length}`);
    console.log(`   - Cakes: ${savedCakes.length}`);
    console.log(`   - Orders: ${savedOrders.length}`);
    console.log(`   - Order Items: ${orderItems.length}`);
    console.log(`   - Rooms: ${savedRooms.length}`);
    console.log(`   - Room Reservations: ${savedReservations.length}`);
    console.log('\n💡 Test User: Any email with password "password123"\n');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
