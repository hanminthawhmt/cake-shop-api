# Database Seeding Guide

## 🌱 Overview

The seeding system populates your database with **realistic, historical data** spanning 6 months, perfect for testing and demonstrating analytics features.

## 📊 What Gets Seeded

| Entity | Count | Details |
|--------|-------|---------|
| **Users (Customers)** | 50 | Random names, emails; password: `password123` (hashed) |
| **Categories** | 10 | Pre-defined cake categories (Chocolate, Vanilla, Cheesecake, etc.) |
| **Cakes** | 80 | 8 per category; realistic prices ($20-$80) |
| **Orders** | 200 | Historical dates (6 months back); mixed statuses (confirmed, preparing, completed, cancelled) |
| **Order Items** | ~600 | 2-4 items per order; includes pricing snapshots and notes |
| **Rooms** | 8 | Event rooms with capacities and pricing ($500-$5000) |
| **Room Reservations** | 100 | Historical dates (6 months back); various time slots |

## 🚀 Running the Seed

### One-Time Full Seed
```bash
npm run seed
```

This will:
1. ✅ Clear all existing data (respecting foreign key constraints)
2. ✅ Generate 50 customer accounts
3. ✅ Create 10 cake categories
4. ✅ Populate 80 cakes across categories
5. ✅ Generate 200 orders with historical dates
6. ✅ Create 602 order items (linked to orders)
7. ✅ Set up 8 event rooms
8. ✅ Add 100 room reservations

### Expected Output
```
🌱 Starting database seed...
🗑️  Clearing existing data...
👥 Seeding users...
✅ Created 50 users

🏷️  Seeding categories...
✅ Created 10 categories

🍰 Seeding cakes...
✅ Created 80 cakes

📦 Seeding orders...
✅ Created 200 orders

📝 Seeding order items...
✅ Created 602 order items

🏨 Seeding rooms...
✅ Created 8 rooms

🎉 Seeding room reservations...
✅ Created 100 room reservations

✨ Database seeding completed successfully!
```

## 🧪 Test Users

After seeding, you can log in with **any of the 50 generated customer accounts**:

```
Email: (any generated email - check database)
Password: password123
```

Example emails that will be generated:
- `john.doe@example.com`
- `jane.smith@example.com`
- etc.

All passwords are hashed with bcrypt and set to: `password123`

## 📁 Seeding Architecture

### Files
```
src/database/seeds/
├── factories/
│   ├── user.factory.ts          # Customer data generation
│   ├── category.factory.ts      # Cake category generation
│   ├── cake.factory.ts          # Cake product generation
│   ├── order.factory.ts         # Order generation (6 months history)
│   ├── room.factory.ts          # Event room generation
│   ├── reservation.factory.ts   # Room reservation generation
│   └── index.ts                 # Factory exports
└── seed.ts                      # Main orchestrator
```

### Factory Pattern

Each factory provides:
- `create[Entity](...)` - Create single instance with random data
- `create[Entity]s(count)` - Create multiple instances

Example:
```typescript
// User factory
UserFactory.createCustomer()           // Single user
UserFactory.createCustomers(50)        // 50 users

// Cake factory
CakeFactory.createCakes(categoryIds, 80)  // 80 cakes across categories
```

## 📊 Data Characteristics

### Orders
- **Date Range**: Last 6 months of historical data
- **Statuses**: CONFIRMED, PREPARING, READY_FOR_PICK_UP, COMPLETED, CANCELLED
- **Payment Status**: UNPAID, PAID (completed orders are typically paid)
- **Pricing**: $50-$300 per order
- **Items per Order**: 2-4 items (avg 3)

### Cakes
- **Categories**: 10 predefined types (Chocolate, Vanilla, etc.)
- **Price Range**: $20-$80 per cake
- **Availability**: ~90% available, 10% marked unavailable

### Rooms
- **Count**: 8 unique rooms
- **Capacity**: 20-200 guests
- **Price Range**: $500-$5,000 per rental
- **Availability**: ~95% available, 5% marked unavailable

### Reservations
- **Date Range**: Last 6 months with future dates
- **Time Slots**: 10:00, 12:00, 14:00
- **Guest Count**: 20-150 per reservation
- **Statuses**: PENDING, CONFIRMED, COMPLETED, CANCELLED
- **Birthday Requests**: ~50% have special requirements

## 🔄 How It Works

### Seeding Process

```
1. Start NestJS Application
   └─> Load AppModule
       └─> Initialize TypeORM DataSource

2. Clear Existing Data
   └─> Delete tables in dependency order:
       └─> order_item_selected_values
       └─> order_items
       └─> orders
       └─> cart_item_selected_values
       └─> cart_items
       └─> carts
       └─> room_reservations
       └─> rooms
       └─> cake_option_values
       └─> cake_options
       └─> cake_images
       └─> cakes
       └─> categories
       └─> user_profiles
       └─> users

3. Generate & Insert Data
   ├─> Users (with bcrypt hashed passwords)
   ├─> Categories
   ├─> Cakes (linked to categories)
   ├─> Orders (with historical dates)
   ├─> Order Items (linked to orders and cakes)
   ├─> Rooms
   └─> Room Reservations (with uniqueness check)

4. Print Summary & Exit
```

### Faker.js Integration

Uses `@faker-js/faker` to generate:
- **Names**: Real-looking customer names
- **Emails**: Valid email addresses
- **Dates**: Historical and future dates (6-month range)
- **Numbers**: Realistic pricing and quantities
- **Text**: Lorem ipsum descriptions and special requests

## ⚠️ Important Notes

### ⚡ Destructive Operation
The seed script **clears all existing data** before seeding. If you want to preserve data:
1. Comment out the deletion queries in `seed.ts` (lines 31-47)
2. Re-run the seed to add more data without clearing

### 🔐 Passwords
All seeded users have the **same password**: `password123` (hashed)

**In production**, never use test data. Generate actual user accounts through your UI.

### 🎯 Analytics Ready
This dataset is specifically designed for testing analytics:
- ✅ Multiple months of order history
- ✅ Variety of order statuses and amounts
- ✅ Room reservation patterns
- ✅ User behavior across time periods

### 🔄 Re-seeding
Run `npm run seed` multiple times to:
- Reset to clean state
- Test analytics consistency
- Start fresh development cycles

## 📈 Analytics Use Cases

With this seed data, you can test:

**Order Analytics:**
- Monthly revenue trends
- Order status distribution
- Average order value
- Top-selling cakes
- Payment status reports

**Room Analytics:**
- Reservation patterns
- Occupancy rates
- Capacity utilization
- Revenue by room
- Booking trends

**Customer Analytics:**
- Repeat customers
- Customer lifetime value
- Order frequency
- Spending patterns

**Time-based Analytics:**
- Daily/weekly/monthly trends
- Seasonal patterns
- Peak booking times
- Revenue forecasting

## 🛠️ Customization

To customize seed data, edit the factories:

```typescript
// src/database/seeds/factories/order.factory.ts
static createOrder(userId: number, overrides = {}) {
  // Modify date ranges, pricing, statuses, etc.
}

// src/database/seeds/factories/cake.factory.ts
static createCakes(categoryIds: number[], count: number) {
  // Change number of cakes or pricing range
}
```

Then rebuild and re-run:
```bash
npm run build
npm run seed
```

## 📝 Troubleshooting

| Issue | Solution |
|-------|----------|
| `QueryFailedError: foreign key constraint` | Seed deletion order is incorrect. Check `seed.ts` line 31. |
| `duplicate key value violates unique constraint` | Room reservation uniqueness issue. Increase max attempts in seed.ts line 123. |
| `Cannot find module '@faker-js/faker'` | Run `npm install --save-dev @faker-js/faker` |
| Database still empty after seed | Check database connection in `.env`. Verify `DATABASE_URL` is correct. |
| Seed takes very long | This is normal with 800+ records. Wait for completion. |

## 🎓 Learning Resources

- **Faker.js Docs**: https://fakerjs.dev/
- **NestJS Data Seeding**: https://docs.nestjs.com/recipes/database#migrations
- **TypeORM Migrations**: https://typeorm.io/migrations
- **Factory Pattern**: https://refactoring.guru/design-patterns/factory-method

---

**Next Steps:**
1. ✅ Run `npm run seed` to populate your database
2. ✅ Test analytics endpoints with real data
3. ✅ Build UI dashboards using aggregated analytics
4. ✅ Run `npm run seed` again anytime you need fresh data
