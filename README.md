# 🌍 GlobeTrotter

**GlobeTrotter** is a modern, full-stack multi-city travel planning platform designed to streamline journey creation, destination discovery, itinerary budgeting, interactive calendar scheduling, and community trip sharing.

---

## 📸 Screenshots

### Login Page
<img width="1600" height="807" alt="image" src="https://github.com/user-attachments/assets/7aa6dc07-48ec-49b5-a26e-0458684a8fad" />

### Home Page
<img width="1600" height="812" alt="image" src="https://github.com/user-attachments/assets/c5705729-1fff-437d-8af7-c228b1713973" />


### Trips Page
<img width="1600" height="809" alt="image" src="https://github.com/user-attachments/assets/ffe118a6-a0c0-473d-98dd-25b72fa895bf" />


### Community Page
<img width="1600" height="813" alt="image" src="https://github.com/user-attachments/assets/b1ca3a95-3169-4390-9db1-b0207291cd9c" />


### Calendar Page
<img width="1600" height="807" alt="image" src="https://github.com/user-attachments/assets/3acd102b-2100-461a-941b-913f4111b2af" />


### Profile Page
<img width="1600" height="812" alt="image" src="https://github.com/user-attachments/assets/a0d23fad-c655-48bf-9543-dd281eb87e34" />
---

## 🚀 Tech Stack

### **Backend**
- **Runtime**: Node.js & Express.js
- **Database**: PostgreSQL (Dockerized local instance)
- **ORM**: Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with `Authorization: Bearer <token>`
- **Security**: `bcryptjs` password hashing, `express-validator` input sanitization
- **Port**: `5000`

### **Frontend**
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Vanilla CSS custom design system + Tailwind CSS utilities
- **Animations**: Framer Motion 3D page transitions (`Page3D`, `TiltCard`)
- **Icons**: Lucide React
- **Port**: `5173`

---

## 📁 Project Architecture

```text
teamX/
├── backend/
│   ├── config/             Prisma client instance
│   ├── controllers/        Auth, City, Activity, Trip, Section, Budget, & Community controllers
│   ├── middleware/         JWT Auth & Validation middlewares
│   ├── prisma/             Schema definition & comprehensive seed scripts
│   └── routes/             REST API endpoint routing
└── frontend/
    ├── src/
    │   ├── components/     Navigation, Layout Shell, 3D Motion wrappers
    │   ├── pages/          Dashboard, Search, CreateTrip, BuildItinerary, Calendar, Community, MyTrips, Profile, Share
    │   ├── utils/          Curated high-res travel imagery helpers
    │   ├── api.ts          Typed API client for backend communication
    │   └── db.ts           Local storage & utility helpers
    └── index.html
```

---

## 🛠️ Getting Started & Local Setup

### 1. Prerequisites
- **Node.js**: `v18+`
- **Docker**: (for local PostgreSQL container) or an existing PostgreSQL database instance

---

### 2. Backend Setup

From the `teamX/backend` directory:

```bash
cd backend
npm install
```

Create environment file `.env`:

```env
DATABASE_URL=""
PORT=3000
JWT_SECRET=""
```

#### Database Initialization & Seeding:

```bash
# 1. Start local PostgreSQL database container (Docker required)
npm run db:up

# 2. Run Prisma database migrations
npm run db:migrate

# 3. Generate Prisma client types
npm run db:generate

# 4. Seed database (16 Indian Cities, 48 Activities, Demo Users, Multi-City Trips, & Community Posts)
npm run db:seed:cities
```

#### Launch Backend Server:
```bash
npm run dev
```
The API server will run at `http://localhost:3000`.

---

### 3. Frontend Setup

From the `teamX/frontend` directory:

```bash
cd frontend
npm install
```

#### Launch Development Server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

#### Production Build Verification:
```bash
npm run build
```

---

## ⚡ API Endpoints Summary

### 🔑 Auth (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new traveler account |
| `POST` | `/api/auth/login` | Login with email or username |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `PATCH` | `/api/auth/me` | Update user profile details |
| `DELETE` | `/api/auth/me` | Delete account |

### 🏙️ Cities (`/api/cities`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cities` | List cities (Filters: `q` search, `region` state, `country`) |
| `GET` | `/api/cities/:cityId` | Get detailed city profile |

### 🧭 Activities (`/api/activities`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/activities` | Catalog activities (Filters: `q`, `cityId`, `type`, `maxCost`, `maxDuration`) |
| `GET` | `/api/activities/:activityId` | Get single activity details |

### ✈️ Trips & Itineraries (`/api/trips`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/trips` | List current user's trips |
| `POST` | `/api/trips` | Create a new trip |
| `GET` | `/api/trips/:tripId` | Fetch trip with stops and section activities |
| `PATCH` | `/api/trips/:tripId` | Update trip details / dates |
| `DELETE` | `/api/trips/:tripId` | Delete trip |
| `GET` | `/api/trips/:tripId/budget` | Calculate trip budget breakdown |
| `GET` | `/api/public/trips/:tripId` | Fetch public itinerary share link |

### 📍 Trip Sections / Stops (`/api/trips/:tripId/sections`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/trips/:tripId/sections` | Add a city stop to trip |
| `PATCH` | `/api/trips/:tripId/sections/:sectionId` | Update stop dates / order |
| `DELETE` | `/api/trips/:tripId/sections/:sectionId` | Remove city stop |

### 💬 Community Posts (`/api/posts`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts` | List all community travel posts with author info |
| `POST` | `/api/posts` | Create a new community post |
| `DELETE` | `/api/posts/:postId` | Delete community post (Owner authorization) |

---

## 🗄️ Database Schema Overview

Prisma ORM models defined in `prisma/schema.prisma`:
- **`User`**: User accounts, passwords, avatars, and bios.
- **`Trip`**: Master trip details, dates, and cover photos.
- **`City`**: Catalog cities with `region` (state), `costIndex`, and `popularity`.
- **`TripSection`**: City stops within a multi-city trip.
- **`Activity`**: Catalog suggested activities linked to cities.
- **`SectionActivity`**: User-selected activities assigned to specific trip stops.
- **`CommunityPost`**: Community travel updates, tips, and itinerary discussions.

---

## 💡 Key Features Implemented

1. **Vibrant & High-Resolution Travel Imagery**: Curated image resolution helper (`images.ts`) mapping cities, activity types, and trips to high-res photography.
2. **Search Engine**: Search cities and activities by city name, state (`region`), activity type, or keyword.
3. **Trip Status Intelligence**: Timezone-safe date evaluation (`YYYY-MM-DD`) classifying trips accurately as `Ongoing`, `Upcoming`, or `Completed`.
4. **Calendar View**: Interactive multi-month calendar visualizing trip section date bars across dates.
5. **Community Feed**: Live community posts endpoint with post publishing and deletion.
6. **INR Currency Standardization**: Standardized currency formatting to **INR (₹)** throughout the platform.
