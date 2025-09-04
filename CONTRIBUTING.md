# Contributing to CultureKerala

Thank you for your interest in contributing to CultureKerala! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Domain-Driven Development](#domain-driven-development)

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **PostgreSQL** database (local or cloud)
- **Firebase** account for authentication

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JioBaba369/CultureKerala.git
   cd CultureKerala
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Project Structure

CultureKerala follows a **Domain-Driven Design** architecture:

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

## Coding Standards

### TypeScript

- **Strict mode enabled** - All code must be type-safe
- **Interface over type** - Use interfaces for object shapes
- **Explicit return types** - For public functions and methods
- **No `any` types** - Use proper typing or `unknown`

```typescript
// ✅ Good
interface CreateEventData {
  title: string
  startsAt: Date
}

export class EventsService {
  async create(data: CreateEventData): Promise<Event> {
    // implementation
  }
}

// ❌ Bad
function createEvent(data: any): any {
  // implementation
}
```

### Code Style

- **Prettier** - Automatic code formatting
- **ESLint** - Code quality and consistency
- **2 spaces** - Indentation
- **Single quotes** - For strings
- **No semicolons** - Prettier handles this

### Naming Conventions

- **PascalCase** - Components, classes, interfaces, types
- **camelCase** - Variables, functions, methods
- **kebab-case** - File names, directories
- **UPPER_CASE** - Constants

```typescript
// ✅ Good
interface UserProfile { }
class EventsService { }
const getUserById = () => { }
const API_BASE_URL = 'https://api.example.com'

// File names
events-service.ts
user-profile.tsx
```

## Domain-Driven Development

### Adding a New Domain

1. **Create domain structure**
   ```bash
   mkdir -p src/domains/new-domain/{components,services,types,hooks,utils}
   ```

2. **Define types**
   ```typescript
   // src/domains/new-domain/types/index.ts
   export interface DomainEntity {
     id: string
     // other properties
   }
   ```

3. **Create service**
   ```typescript
   // src/domains/new-domain/services/DomainService.ts
   export class DomainService {
     async findMany(): Promise<DomainEntity[]> {
       // implementation
     }
   }
   ```

4. **Add API routes**
   ```typescript
   // src/app/api/domain/route.ts
   import { DomainService } from '@/domains/new-domain/services/DomainService'
   ```

### Service Layer Guidelines

- **Single responsibility** - Each service handles one domain
- **Dependency injection** - Services receive dependencies
- **Error handling** - Consistent error patterns
- **Type safety** - Full TypeScript coverage

```typescript
export class EventsService {
  constructor(private db: PrismaClient) {}

  async create(data: CreateEventData): Promise<Result<Event, Error>> {
    try {
      const event = await this.db.event.create({ data })
      return { success: true, data: event }
    } catch (error) {
      return { success: false, error }
    }
  }
}
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation changes
- **style** - Code style changes (formatting, etc.)
- **refactor** - Code refactoring
- **test** - Adding or updating tests
- **chore** - Maintenance tasks

### Examples

```bash
feat(events): add event creation API endpoint

Implement POST /api/events with validation and error handling.
Includes Zod schema validation and proper TypeScript types.

Closes #123

fix(auth): resolve login redirect issue

Users were not being redirected after successful login.
Fixed by updating the AuthService callback handling.

docs(readme): update setup instructions

Added missing environment variable setup steps.
```

## Pull Request Process

### Before Submitting

1. **Test your changes**
   ```bash
   npm run test
   npm run build
   npm run lint
   ```

2. **Update documentation** if needed

3. **Follow commit guidelines**

### PR Template

- **Description** - What does this PR do?
- **Type of change** - Feature, bug fix, etc.
- **Testing** - How was this tested?
- **Screenshots** - For UI changes
- **Breaking changes** - Any backwards incompatible changes?

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in staging environment
4. **Approval** and merge

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test auth.test.ts
```

### Test Structure

```typescript
// events.test.ts
import { EventsService } from '@/domains/events/services/EventsService'

describe('EventsService', () => {
  let service: EventsService

  beforeEach(() => {
    service = new EventsService(mockPrisma)
  })

  it('should create an event', async () => {
    const data = {
      title: 'Test Event',
      startsAt: new Date(),
      // ...
    }
    
    const result = await service.create(data)
    
    expect(result.success).toBe(true)
    expect(result.data?.title).toBe('Test Event')
  })
})
```

### Test Guidelines

- **Unit tests** - For service methods and utilities
- **Integration tests** - For API endpoints
- **Component tests** - For React components
- **Mock external dependencies** - Database, APIs, etc.

## Database Changes

### Schema Migrations

1. **Update Prisma schema**
   ```prisma
   // prisma/schema.prisma
   model NewModel {
     id        String   @id @default(cuid())
     createdAt DateTime @default(now())
   }
   ```

2. **Generate migration**
   ```bash
   npx prisma migrate dev --name add-new-model
   ```

3. **Update types**
   ```bash
   npx prisma generate
   ```

## Questions or Help?

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and ideas
- **Discord** - For real-time chat (if available)

## License

By contributing to CultureKerala, you agree that your contributions will be licensed under the same license as the project.

---

**Happy Contributing! 🎉**