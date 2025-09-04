# Project Tree Structure

This document outlines the complete file and directory structure of CultureKerala after implementing the domain-driven architecture.

## Root Directory

```
CultureKerala/
├── .env.example                    # Environment variables template
├── .eslintrc.json                  # ESLint configuration
├── .firebaserc                     # Firebase project configuration
├── .gitignore                      # Git ignore rules
├── .prettierignore                 # Prettier ignore rules
├── .prettierrc                     # Prettier configuration
├── ARCHITECTURE.md                 # Architecture documentation
├── CONTRIBUTING.md                 # Contribution guidelines
├── README.md                       # Project README
├── next.config.mjs                 # Next.js configuration
├── package.json                    # NPM dependencies and scripts
├── package-lock.json               # Lock file for dependencies
├── postcss.config.mjs             # PostCSS configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── firebase.json                  # Firebase configuration
├── firestore.indexes.json         # Firestore database indexes
├── firestore.rules               # Firestore security rules
├── storage.rules                 # Firebase Storage rules
├── apphosting.yaml               # Firebase App Hosting configuration
└── docs/                         # Documentation files
    └── blueprint.md              # Product blueprint
```

## Prisma Database

```
prisma/
└── schema.prisma                 # Database schema definition
```

## Source Code Structure

### Main Application (`src/`)

```
src/
├── app/                          # Next.js App Router
│   ├── (app)/                   # App routes group
│   │   ├── page.tsx             # Home page
│   │   ├── about/               # About page
│   │   ├── businesses/          # Business directory
│   │   │   ├── page.tsx         # Business listing page
│   │   │   └── [slug]/          # Individual business pages
│   │   ├── communities/         # Communities directory
│   │   │   ├── page.tsx         # Communities listing
│   │   │   └── [slug]/          # Individual community pages
│   │   ├── events/              # Events directory
│   │   │   ├── page.tsx         # Events listing
│   │   │   └── [slug]/          # Individual event pages
│   │   ├── deals/               # Deals and offers
│   │   ├── movies/              # Movie listings
│   │   ├── classifieds/         # Classified ads
│   │   ├── perks/               # Member perks
│   │   ├── explore/             # Discovery page
│   │   ├── kerala/              # About Kerala
│   │   ├── learn/               # Learn Malayalam
│   │   ├── contact/             # Contact page
│   │   ├── emergency-contacts/  # Emergency contacts
│   │   ├── privacy/             # Privacy policy
│   │   ├── terms/               # Terms of service
│   │   └── profile/             # User profiles
│   │       └── [username]/      # Individual user profiles
│   ├── admin/                   # Admin dashboard
│   │   ├── page.tsx             # Admin home
│   │   ├── layout.tsx           # Admin layout
│   │   ├── businesses/          # Business management
│   │   ├── communities/         # Community management
│   │   ├── events/              # Event management
│   │   ├── deals/               # Deal management
│   │   ├── movies/              # Movie management
│   │   ├── perks/               # Perk management
│   │   ├── rewards/             # Reward management
│   │   └── PlatformAdmin/       # Platform-level admin
│   │       ├── ads/             # Advertisement management
│   │       ├── classifieds/     # Classified management
│   │       ├── emergency-contacts/
│   │       ├── moderation/      # Content moderation
│   │       ├── movies/          # Platform movie management
│   │       ├── perks/           # Platform perk management
│   │       ├── rewards/         # Platform reward management
│   │       ├── sales/           # Sales management
│   │       ├── settings/        # Platform settings
│   │       └── users/           # User management
│   ├── auth/                    # Authentication pages
│   │   ├── login/               # Login page
│   │   ├── signup/              # Registration page
│   │   ├── forgot-password/     # Password reset
│   │   └── verify-email/        # Email verification
│   ├── user/                    # User dashboard
│   │   ├── account/             # Account settings
│   │   ├── dashboard/           # User dashboard
│   │   ├── interests/           # Interest preferences
│   │   ├── saved/               # Saved items
│   │   └── layout.tsx           # User layout
│   ├── onboarding/              # User onboarding flow
│   │   ├── welcome/             # Welcome page
│   │   ├── profile/             # Profile setup
│   │   ├── interests/           # Interest selection
│   │   └── layout.tsx           # Onboarding layout
│   ├── my/                      # Personal pages
│   │   ├── account/             # Account management
│   │   └── dashboard/           # Personal dashboard
│   ├── api/                     # API routes
│   │   └── events/              # Events API
│   │       └── route.ts         # Events CRUD operations
│   ├── components/              # Page-level components
│   │   └── theme-provider.tsx   # Theme provider
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── favicon.ico              # Favicon
│   ├── robots.txt               # SEO robots file
│   └── sitemap.ts               # Sitemap generation
```

### Domain-Driven Architecture (`src/domains/`)

```
src/domains/
├── events/                      # Events domain
│   ├── components/              # Event-specific components
│   ├── services/                # Event business logic
│   │   └── EventsService.ts     # Event CRUD operations
│   ├── types/                   # Event TypeScript types
│   │   └── index.ts             # Event interfaces
│   ├── hooks/                   # Event-specific React hooks
│   └── utils/                   # Event utility functions
├── groups/                      # Communities/Groups domain
│   ├── components/              # Group-specific components
│   ├── services/                # Group business logic
│   │   └── GroupsService.ts     # Community operations
│   ├── types/                   # Group TypeScript types
│   │   └── index.ts             # Community interfaces
│   ├── hooks/                   # Group-specific hooks
│   └── utils/                   # Group utilities
├── businesses/                  # Business listings domain
│   ├── components/              # Business-specific components
│   ├── services/                # Business logic
│   │   └── BusinessesService.ts # Business operations
│   ├── types/                   # Business TypeScript types
│   │   └── index.ts             # Business interfaces
│   ├── hooks/                   # Business-specific hooks
│   └── utils/                   # Business utilities
├── auth/                        # Authentication domain
│   ├── components/              # Auth-specific components
│   ├── services/                # Authentication logic
│   │   └── AuthService.ts       # Auth operations
│   ├── types/                   # Auth TypeScript types
│   │   └── index.ts             # Auth interfaces
│   ├── hooks/                   # Auth-specific hooks
│   └── utils/                   # Auth utilities
└── users/                       # User management domain
    ├── components/              # User-specific components
    ├── services/                # User business logic
    │   └── UsersService.ts      # User operations
    ├── types/                   # User TypeScript types
    │   └── index.ts             # User interfaces
    ├── hooks/                   # User-specific hooks
    └── utils/                   # User utilities
```

### Infrastructure Layer (`src/infrastructure/`)

```
src/infrastructure/
├── database/                    # Database configuration
│   └── prisma.ts               # Prisma client setup
├── external-apis/              # Third-party integrations
│   └── firebase/               # Firebase configuration
│       ├── config.ts           # Firebase config
│       └── auth.tsx            # Firebase auth setup
└── storage/                    # File storage utilities
```

### Shared Resources (`src/shared/`)

```
src/shared/
├── components/                 # Reusable components (placeholder)
├── config/                     # Shared configuration (placeholder)
├── hooks/                      # Shared React hooks (placeholder)
├── services/                   # Shared services (placeholder)
├── types/                      # Shared TypeScript types (placeholder)
└── utils/                      # Shared utilities (placeholder)
```

### Legacy Structure (Being Migrated)

```
src/
├── components/                 # UI components (legacy structure)
│   ├── auth/                   # Authentication components
│   ├── cards/                  # Card components
│   ├── features/               # Feature components
│   ├── layout/                 # Layout components
│   ├── onboarding/             # Onboarding components
│   ├── skeletons/              # Loading skeletons
│   ├── tickets/                # Ticketing components
│   └── ui/                     # Base UI components
├── config/                     # Configuration files
│   ├── navigation.ts           # Navigation configuration
│   ├── site.ts                 # Site configuration
│   └── theme.ts                # Theme configuration
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries
│   ├── data/                   # Static data files
│   ├── firebase/               # Firebase utilities (legacy)
│   ├── schemas/                # Validation schemas
│   ├── utils.ts                # Utility functions
│   └── utils.tsx               # React utilities
├── types/                      # Global TypeScript types
│   └── index.d.ts              # Type definitions
└── actions/                    # Server actions (legacy)
```

## Key Features of the New Structure

### Domain Organization
- **Events**: Event creation, management, and discovery
- **Groups**: Community management and membership
- **Businesses**: Business directory and verification
- **Auth**: Authentication and authorization
- **Users**: User profiles and preferences

### Infrastructure Separation
- **Database**: Prisma client and configuration
- **External APIs**: Firebase, email services, etc.
- **Storage**: File upload and management

### Shared Resources
- **Components**: Reusable UI components
- **Hooks**: Shared React hooks
- **Utils**: Common utility functions
- **Types**: Global TypeScript interfaces

### Benefits
1. **Domain-driven design** - Code organized by business logic
2. **Scalability** - Easy to add new domains
3. **Maintainability** - Clear separation of concerns
4. **Type safety** - Full TypeScript coverage
5. **Testing** - Easy to test individual domains
6. **Team collaboration** - Clear ownership boundaries

This structure supports the gradual migration from Firebase to Prisma while maintaining existing functionality and enabling new features.