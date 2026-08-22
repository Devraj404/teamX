# GlobeTrotter

GlobeTrotter is a multi-city travel planning application. Users can discover destinations and activities, create trips, build itineraries, and review estimated costs.

## Project Structure

```text
teamX/
├── backend/    Express API, Prisma ORM, PostgreSQL
└── frontend/   Frontend application
```

## Backend Stack

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcryptjs password hashing
- express-validator request validation

## Backend Setup

From the backend directory:

```bash
cd backend
npm install
```

Create `backend/.env` from the example file:

```bash
cp .env.example .env
```

On Windows, copy `.env.example` to `.env` manually if `cp` is unavailable.

The default local environment expects:

```env
DATABASE_URL=
PORT=
JWT_SECRET="change-me-in-production"
```

## Database Commands

From `backend/`:

```bash
npm run db:up
npm run db:migrate
npm run db:generate
npm run db:seed
npm run db:seed:cities
npm run db:studio
```

`db:up` starts the local PostgreSQL container. `db:migrate` applies Prisma migrations. `db:seed` adds repeatable sample cities and activities. Prisma Studio opens a browser database viewer, normally at `http://localhost:5555`.

`db:seed:cities` adds ten repeatable Indian cities and their city-linked famous places/experiences as catalog activities. It does not create or modify trips, itinerary sections, or section activities.

The Ahmedabad catalog is based on landmark listings from [Gujarat Tourism](https://www.gujarattourism.com/central-zone/ahmedabad.html), including Sabarmati Ashram, Sabarmati Riverfront, the Heritage Walk, Hutheesing Jain Temple, Kankaria Lake, Manek Chowk, and Adalaj Ni Vav. Prices in seed data are planning estimates, not live ticket prices.

To stop the local database:

```bash
npm run db:down
```

## Start the API

Always run this command from `backend/`:

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

Health check:

```bash
curl http://localhost:3000/
```

Expected response:

```text
GlobeTrotter API
```

## Authentication

Protected endpoints use a JWT bearer token:

```text
Authorization: Bearer <token>
```

Authentication endpoints:

```text
POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me
PATCH /api/auth/me
DELETE /api/auth/me
```

Login accepts either `email` or `username`. Passwords are hashed and are never returned in API responses.

## API Routes

### Cities

```text
GET /api/cities
GET /api/cities/:cityId
```

Supported filters include `q`, `country`, and `region`.

### Activities

```text
GET /api/activities
GET /api/activities/:activityId
```

Supported filters include `q`, `cityId`, `type`, `minCost`, `maxCost`, `minDuration`, and `maxDuration`.

### Trips

All trip routes require authentication:

```text
GET    /api/trips
POST   /api/trips
GET    /api/trips/:tripId
PATCH  /api/trips/:tripId
DELETE /api/trips/:tripId
GET    /api/trips/:tripId/budget
GET    /api/public/trips/:tripId
```

Trip status is calculated from dates as `upcoming`, `ongoing`, or `completed`. Users can only access and modify their own trips.

### Itinerary Sections

```text
GET    /api/trips/:tripId/sections
POST   /api/trips/:tripId/sections
PATCH  /api/trips/:tripId/sections/:sectionId
DELETE /api/trips/:tripId/sections/:sectionId
```

A section represents a city stop in a trip. Section dates, city ownership, and ordering are validated.

### Section Activities

```text
GET    /api/trips/:tripId/sections/:sectionId/activities
POST   /api/trips/:tripId/sections/:sectionId/activities
PATCH  /api/trips/:tripId/sections/:sectionId/activities/:sectionActivityId
DELETE /api/trips/:tripId/sections/:sectionId/activities/:sectionActivityId
```

Catalog activities must belong to the section city. Expense and activity name values are stored on the itinerary record as a snapshot.

### Budget

```text
GET /api/trips/:tripId/budget
```

The budget is calculated from itinerary activity expenses and includes totals by activity type and section. No summary values are stored separately.

Expense categories are `transport`, `accommodation`, `activities`, `meals`, and `other`. The budget response also includes category totals and average cost per trip day. Public trip reads are read-only and available only when the trip has `isPublic` set to `true`.

## Data Model

The Prisma schema contains these relational entities:

- `User`
- `City`
- `Activity`
- `Trip`
- `TripSection`
- `SectionActivity`
- `CommunityPost`

Community post and admin analytics routes are not currently implemented because they are optional MVP features.

## Validation and Security

- Protected routes require a valid JWT.
- Resource access is scoped to the authenticated user.
- Passwords use bcrypt hashing.
- Password fields are excluded from API responses.
- Required fields and IDs are validated before database operations.
- Trip and itinerary dates are checked for valid ordering.

## Current Testing

The backend currently uses live API smoke checks and Prisma validation. Run syntax checks from `backend/` with commands such as:

```bash
node --check index.js
npm exec prisma validate
```

The `npm test` script is currently a placeholder and should be replaced with an automated test suite as the project grows.
