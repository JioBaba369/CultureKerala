
# Culture Kerala - Your Community, Connected

Welcome to Culture Kerala, a platform designed to be the central hub for the global Malayalee community. This application is built with a modern, scalable, and professional tech stack, providing a seamless experience for both users and administrators.

## Core Features

- **Global Directory**: Discover events, communities, businesses, deals, and movies relevant to the Malayalee community.
- **Learn Malayalam**: Bite-sized lessons and cultural content to help you connect with your heritage.
- **Advanced Search**: An intuitive search engine to find content using location, category, and keywords.
- **User Engagement**: Save items of interest, share content via QR codes, and report inappropriate content.
- **Creator Tools**: Verified organizations can create and manage their own events and listings.
- **Comprehensive Admin Console**: A secure backend for managing users, content, moderation, and platform-wide settings.

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
│   │   ├── (app)           # Public-facing routes (home, events, learn, etc.)
│   │   ├── admin           # Secure admin dashboard routes
│   │   ├── auth            # Authentication routes (login, signup)
│   │   ├── api             # API routes for server-side logic
│   │   ├── globals.css     # Global styles and theme variables
│   │   └── layout.tsx      # Root layout
│   ├── components          # Reusable UI components
│   │   ├── auth            # Auth-related components
│   │   ├── cards           # Custom card components for different entities
│   │   ├── layout          # Header, Footer, Admin Dashboard Layout
│   │   ├── learn           # Components for the 'Learn' module
│   │   └── ui              # ShadCN UI components
│   ├── config              # Site-wide configuration
│   ├── hooks               # Custom React hooks
│   ├── lib                 # Core libraries and utilities
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

The application will be available at `http://localhost:9002`.
