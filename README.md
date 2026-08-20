# Cake Shop API

Backend API for a full-featured cake shop and event-room booking platform. The service supports customer accounts, cake catalog management, configurable cake options, shopping carts, order checkout, room reservations, image uploads, email notifications, Google OAuth, and owner analytics.

**Live API:** [cake-shop-api-0qpr.onrender.com](https://cake-shop-api-0qpr.onrender.com)

**Interactive API documentation:** [Swagger UI](https://cake-shop-api-0qpr.onrender.com/api)

**OpenAPI JSON:** [docs-json](https://cake-shop-api-0qpr.onrender.com/docs-json)

## Highlights

- Modular NestJS architecture with clear domain boundaries
- PostgreSQL persistence through TypeORM
- JWT authentication with protected routes and owner-only operations
- Google OAuth 2.0 login flow
- DTO validation with `class-validator` and whitelist protection
- Swagger/OpenAPI documentation for frontend and client integration
- Cloudinary-backed cake and room image uploads
- Event-driven email notifications with Mailtrap/Nodemailer support
- Analytics endpoints for dashboards, sales, best sellers, reservations, and exports
- Jest unit tests and end-to-end test setup

## Technology

| Area | Technology |
| --- | --- |
| Runtime | Node.js, TypeScript |
| Framework | NestJS 11 |
| Database | PostgreSQL, TypeORM |
| Authentication | Passport, JWT, bcrypt, Google OAuth 2.0 |
| Media | Cloudinary, Multer |
| Email | Nodemailer, Mailtrap |
| API docs | Swagger / OpenAPI |
| Testing | Jest, Supertest |
| Deployment | Render |

## API Surface

All endpoints are available from the live base URL. Open `/api` for request schemas, response details, authorization controls, and a Try it out workflow.

| Area | Base route | Purpose |
| --- | --- | --- |
| Authentication | `/auth` | Sign up, sign in, password changes, and Google OAuth |
| Users | `/users` | Read and update the authenticated user profile |
| Cakes | `/cakes` | Browse cakes and manage the catalog |
| Cake options | `/cakes/:cakeId/options` | Manage configurable options and values |
| Cake images | `/cakes/:cakeId/images` | Upload and remove cake images |
| Categories | `/categories` | Organize the cake catalog |
| Cart | `/cart` | View, add, update, and remove cart items |
| Orders | `/orders` | Checkout, order history, statuses, payment, cancellation, and baking slips |
| Rooms | `/rooms` | Browse, manage, and check room availability |
| Reservations | `/rooms/:roomId/reservations` and `/reservations` | Book and manage event-room reservations |
| Room images | `/rooms/:roomId/images` | Upload and remove room images |
| Analytics | `/analytics` | Owner dashboard metrics, reports, and CSV exports |

## Authentication

Most routes require a bearer token. Create an account or sign in first:

```bash
curl -X POST https://cake-shop-api-0qpr.onrender.com/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"your-password"}'
```

Use the returned JWT on protected requests:

```bash
curl https://cake-shop-api-0qpr.onrender.com/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Public catalog routes include `GET /cakes`, `GET /cakes/:id`, and `GET /categories`. Catalog administration, order operations, and analytics are restricted according to the authenticated user's role; owner-only routes are marked in Swagger.

## Run Locally

### Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL database, local or hosted
- Cloudinary account if using image uploads
- Mailtrap or another SMTP provider if using email notifications
- Google OAuth credentials if using Google sign-in

### Installation

```bash
git clone https://github.com/hanminthawhmt/cake-shop-api.git
cd cake-shop-api
npm install
```

This repository currently does not include a committed `.env.example`. Create `.env` manually using the variables below, or add an environment template locally without real values.

### Environment variables

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your-mail-user
MAILTRAP_PASS=your-mail-password
MAIL_FROM=noreply@example.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001
```

`ALLOWED_ORIGINS` is a comma-separated list. Never commit `.env` files or real credentials. For production, use the Render environment settings and a strong unique `JWT_SECRET`.

### Start the API

```bash
npm run start:dev
```

The local API runs on `http://localhost:3000` by default. Swagger is available at `http://localhost:3000/api`.

## Database Seeding

The seed command creates a realistic demo dataset for development and analytics demonstrations: users, categories, cakes, orders, order items, rooms, and reservations.

```bash
npm run seed
```

The seed is destructive: it clears existing application data before inserting fresh records. Do not run it against a production database. Seeded customer accounts use the password `password123`; use them only in local/demo environments. See [SEEDING_GUIDE.md](SEEDING_GUIDE.md) for the generated data model and customization details.

## Scripts

```bash
npm run build       # Compile TypeScript
npm run start       # Start the compiled NestJS development server
npm run start:dev   # Start with file watching
npm run start:prod  # Run dist/main.js
npm run lint        # Run ESLint and apply fixes
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run test:cov    # Generate coverage
npm run seed        # Reset and populate the database
```

## Deployment on Render

Create a Render Web Service connected to this repository with:

| Setting | Value |
| --- | --- |
| Build command | `npm install && npm run build` |
| Start command | `npm run start:prod` |
| Environment | Node |

Add the production environment variables from the list above in Render. Render provides the `PORT` variable automatically, and the application listens on it. Set `BACKEND_URL` to the Render service URL and configure `FRONTEND_URL` and `ALLOWED_ORIGINS` with the deployed frontend URLs.

After deployment, verify:

```bash
curl -i https://cake-shop-api-0qpr.onrender.com/
```

The root route may return `401` because authentication is enabled globally; that still confirms the service is responding. Then open the [live Swagger UI](https://cake-shop-api-0qpr.onrender.com/api) to exercise the API.

## Project Structure

```text
src/
├── analytics/     Dashboard metrics and exports
├── cakes/         Cakes, options, and image management
├── cart/          Customer shopping carts
├── categories/    Cake categories
├── cloudinary/    Media storage integration
├── database/      Seed factories and seed runner
├── email/         Email service, listeners, and templates
├── orders/        Checkout and order lifecycle
├── rooms/         Event rooms, images, and reservations
└── users/         Auth, profiles, JWT, roles, and OAuth
```

Each domain owns its controllers, services, DTOs, entities, and tests where applicable. `src/main.ts` configures validation, CORS, Swagger, and the HTTP server.

## Quality Checks

Before opening a pull request, run:

```bash
npm run build
npm run lint
npm run test
npm run test:e2e
```

Keep secrets out of commits, update Swagger decorators when endpoint contracts change, and add focused tests for new business rules.

## License

This project is currently marked `UNLICENSED` in `package.json`. Contact the repository owner before using the code commercially or redistributing it.
