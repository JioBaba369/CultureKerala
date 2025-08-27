
# Culture Kerala - Your Community, Connected

Welcome to Culture Kerala, a platform designed to be the central hub for the global Malayalee community. This application is built with a modern, scalable, and professional tech stack, providing a seamless experience for both users and administrators.

## Core Features

- **Global Directory**: Discover events, communities, businesses, deals, and movies relevant to the Malayalee community.
- **Advanced Search**: An intuitive search engine to find content using location, category, and keywords.
- **User Engagement**: Save items of interest, share content via QR codes, and report inappropriate content.
- **Content Creation**: Verified communities and businesses can create and manage their own events and deals.
- **Comprehensive Admin Console**: A secure backend for managing users, content, moderation, sales, and platform-wide settings.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)

## Project Structure

The repository is organized to maintain a clean and scalable architecture.

```
.
├── src
│   ├── app                 # Main application routes (Next.js App Router)
│   │   ├── (app)           # Public-facing routes (e.g., home, explore, details)
│   │   ├── admin           # Secure admin dashboard routes
│   │   ├── auth            # Authentication routes (login, signup)
│   │   ├── components      # Global theme provider
│   │   ├── globals.css     # Global styles and theme variables
│   │   └── layout.tsx      # Root layout
│   ├── actions             # Server Actions for database mutations
│   ├── ai                  # Genkit flows and AI-related schemas
│   ├── components          # Reusable UI components
│   │   ├── auth            # Auth-related components (e.g., withAuth HOC)
│   │   ├── cards           # Custom card components
│   │   ├── layout          # Header, Footer, etc.
│   │   ├── skeletetons     # Loading state skeletons
│   │   └── ui              # ShadCN UI components
│   ├── config              # Site-wide configuration (navigation, theme, identity)
│   ├── hooks               # Custom React hooks
│   ├── lib                 # Core libraries and utilities
│   │   ├── data            # Static data (e.g., countries, locations)
│   │   ├── firebase        # Firebase configuration and auth provider
│   │   └── utils.ts        # Utility functions
│   └── types               # TypeScript type definitions
├── firestore.indexes.json  # Firestore index definitions
├── firestore.rules         # Firestore security rules
└── next.config.ts          # Next.js configuration
```

## Getting Started

To get the application up and running locally, follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

3.  **Run the Genkit Emulator** (in a separate terminal):
    ```bash
    npm run genkit:watch
    ```

The application will be available at `http://localhost:9002`, and the Genkit emulator UI will be at `http://localhost:4000`.

## Key Architectural Decisions

- **Server Components by Default**: We leverage Next.js Server Components to reduce client-side JavaScript and improve initial page load times.
- **Server Actions**: Form submissions and data mutations are handled via Server Actions, eliminating the need for traditional API endpoints for many operations.
- **Firebase Integration**: Firebase is used for authentication, database (Firestore), and file storage. The integration is encapsulated in the `src/lib/firebase` directory.
- **Role-Based Access Control (RBAC)**: Firestore security rules and frontend logic work together to enforce a robust permission model, separating abilities for users, organizers, moderators, and admins.
- **Component-Driven UI**: The interface is built from a library of reusable components, ensuring consistency and speeding up development.
- **AI-Powered Features**: Genkit is used to integrate generative AI for features like automated content creation, with a clear separation of AI logic in the `src/ai` directory.
