# Culture Kerala — Connecting the Global Malayali Diaspora

**Culture Kerala** is the digital home for Malayalis everywhere—a single place to discover what's happening, who's nearby, and how to stay rooted in Kerala's culture no matter where you live. Our mission is simple: bridge distance, celebrate heritage, and make community effortless.

## 🚀 New Architecture (2024)

This project has been completely restructured using **Domain-Driven Design (DDD)** principles with modern technologies:

- **Domain-Driven Architecture** - Organized by business domains (events, groups, businesses, auth, users)
- **Prisma + PostgreSQL** - Type-safe database layer replacing Firebase Firestore
- **Next.js 14** - App Router with TypeScript
- **Modern Tooling** - ESLint, Prettier, comprehensive testing

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## What You'll Find

* **All-in-One Global Directory**
  A unified, curated hub for **Events**, **Communities**, **Businesses**, **Deals**, and **Malayalam Movies**—local to you and across the world. Explore confidently with clear categories and up-to-date listings.

* **Powerful, Intent-Based Search**
  Find exactly what you need in seconds. Search by **location**, **category**, and **keywords** (e.g., "Sydney + Onam + family"), then refine with smart filters for precision results—whether it's an authentic eatery or this weekend's cultural gathering.

* **Personalized Profiles & Feeds**
  Tell us your interests and we'll surface what matters. **Save** events, communities, deals, and movies to your profile; your **personal feed** highlights new and relevant releases as they appear.

* **Seamless Saving & Sharing**
  Build community with one tap. Save discoveries to revisit later, or share them instantly via a **share modal** that generates a **scannable QR code** and a **direct link** ready for WhatsApp, Instagram, or email.

* **Safety First: Reporting & Moderation**
  We keep the platform respectful and trustworthy. Users can **flag content** in a tap; reports flow into a **moderation queue** for review in a secure **admin console**. Clear policies and approvals protect quality and integrity.

## Why It's Different

* **Unified**: Everything Malayali—events to movies—under one roof.
* **Relevant**: A feed tuned to your interests and location.
* **Effortless**: Save, share, and show up—no chasing links or scattered posts.
* **Trustworthy**: Community reporting and human moderation keep standards high.

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Firebase account (for authentication)

### Development Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/JioBaba369/CultureKerala.git
   cd CultureKerala
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

3. **Database setup**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Using Docker

```bash
docker-compose up
```

## API Documentation

### Events API

```bash
# Get events
GET /api/events?city=Sydney&category=festival&page=1

# Create event
POST /api/events
Content-Type: application/json

{
  "title": "Onam Celebration 2024",
  "slug": "onam-2024-sydney",
  "startsAt": "2024-09-14T10:00:00Z",
  "endsAt": "2024-09-14T18:00:00Z",
  "timezone": "Australia/Sydney",
  "organizer": "Sydney Malayalam Association",
  "venueCity": "Sydney",
  "createdBy": "user-id"
}
```

## Project Structure

```
src/
├── app/                 # Next.js App Router (pages & API routes)
├── domains/            # Business domains
│   ├── events/        # Events management
│   ├── groups/        # Communities/Groups
│   ├── businesses/    # Business listings
│   ├── auth/          # Authentication
│   └── users/         # User management
├── shared/            # Shared utilities
└── infrastructure/    # External integrations
```

See [TREE.md](./TREE.md) for complete project structure documentation.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run typecheck    # TypeScript type checking
npm run test         # Run tests

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

---

* "Kerala, wherever you are."
* "One home for every Malayali."
* "Discover. Connect. Celebrate Kerala."
* "From hometown roots to global streets."
* "Your Malayali world, in one place."