# Architecture Documentation

## Overview

CultureKerala is built using a **Domain-Driven Design (DDD)** architecture pattern with Next.js 14, TypeScript, and Prisma. This approach organizes code around business domains rather than technical layers, making the codebase more maintainable and scalable.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend & Database
- **Prisma** - Type-safe database client and ORM
- **PostgreSQL** - Primary database
- **Firebase Auth** - Authentication provider
- **Firebase Firestore** - Real-time features (legacy, being migrated)

### Infrastructure
- **Vercel** - Deployment and hosting
- **Cloudinary** - Image and media management
- **SendGrid** - Email services

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
├── domains/               # Domain-driven modules
│   ├── events/           # Events domain
│   ├── groups/           # Communities/Groups domain
│   ├── businesses/       # Business listings domain
│   ├── auth/             # Authentication domain
│   └── users/            # User management domain
├── shared/               # Shared utilities and components
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── types/           # Global TypeScript types
│   ├── utils/           # Utility functions
│   └── config/          # Configuration files
└── infrastructure/      # External integrations
    ├── database/        # Database connection and config
    ├── external-apis/   # Third-party API integrations
    └── storage/         # File storage utilities
```

## Domain Architecture

Each domain follows a consistent structure:

```
domains/{domain}/
├── components/          # Domain-specific UI components
├── services/           # Business logic and data access
├── types/              # Domain-specific TypeScript interfaces
├── hooks/              # Domain-specific React hooks
└── utils/              # Domain-specific utilities
```

### Domain Separation

1. **Events Domain** - Event management, creation, discovery
2. **Groups Domain** - Community management and membership
3. **Businesses Domain** - Business listings and verification
4. **Auth Domain** - Authentication and authorization
5. **Users Domain** - User profiles and preferences

## Data Layer

### Database Design

- **Users** - Core user profiles and authentication
- **Events** - Event listings with organizer relationships
- **Communities** - Group/community management
- **Businesses** - Business directory with verification
- **Deals** - Special offers and promotions
- **SavedItems** - User bookmarks and favorites
- **Reports** - Content moderation system

### Data Access Pattern

All database operations are centralized in service classes within each domain:

```typescript
// Example: EventsService
export class EventsService {
  async create(data: CreateEventData): Promise<EventWithRelations>
  async findMany(params: SearchParams): Promise<PaginatedResult>
  async findBySlug(slug: string): Promise<EventWithRelations | null>
  // ... other methods
}
```

## API Design

### RESTful Routes

- `GET /api/events` - List events with filtering and pagination
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get specific event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Response Format

```typescript
{
  success: boolean
  data?: T
  error?: string
  details?: ValidationError[]
}
```

## Authentication Flow

1. **Firebase Auth** handles authentication
2. **User creation** triggers database record creation
3. **JWT tokens** passed to API routes for authorization
4. **Role-based access** control implemented in services

## Security Considerations

- Input validation using Zod schemas
- Role-based access control
- Rate limiting on API endpoints
- Content moderation system
- Firebase security rules
- Environment variable protection

## Performance Optimizations

- **Static Site Generation (SSG)** for public pages
- **Incremental Static Regeneration (ISR)** for dynamic content
- **Database indexing** on frequently queried fields
- **Image optimization** through Cloudinary
- **Caching strategies** for API responses

## Development Workflow

1. Domain-first development approach
2. Type-safe data operations with Prisma
3. Component-driven UI development
4. Test-driven development for services
5. Code review and automated testing

## Migration Strategy

The project is currently migrating from Firebase Firestore to PostgreSQL with Prisma:

- **Phase 1**: Set up Prisma schema and services
- **Phase 2**: Implement new API routes with Prisma
- **Phase 3**: Migrate existing pages to use new services
- **Phase 4**: Deprecate Firebase dependencies (except Auth)

## Deployment

- **Environment**: Vercel with automatic deployments
- **Database**: PostgreSQL on Vercel or external provider
- **CDN**: Vercel Edge Network for static assets
- **Monitoring**: Vercel Analytics and error tracking

## Future Considerations

- **Microservices**: Potential split into smaller services as the platform grows
- **Event Sourcing**: For audit trails and complex state management
- **GraphQL**: Consider GraphQL federation for complex data queries
- **Caching Layer**: Redis for high-performance caching
- **Search Engine**: Elasticsearch or Algolia for advanced search features