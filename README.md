
# Culture Kerala - Your Community, Connected

## Core Concept

**Culture Kerala** is a comprehensive web platform designed to be the central digital hub for the global Malayalee community. Its primary goal is to connect Malayalees worldwide with their culture and with each other by providing a unified place to discover, share, and engage with community-centric content.

The application serves two main audiences:
1.  **General Users**: Malayalees and anyone interested in Kerala culture who want to find local events, support community businesses, and stay connected to their heritage.
2.  **Content Creators/Organizers**: Verified community leaders, business owners, and event organizers who need a platform to promote their activities and reach the Malayalee community.

---

## Core Features

The application is built around several core pillars:

**1. Global Directory & Discovery:**
This is the heart of the platform. Users can explore a rich directory of content categorized into several sections:
*   **Events**: Find cultural celebrations, festivals (like Onam), workshops, and meetups.
*   **Communities**: Discover and join local or online Malayalee associations, clubs, and groups.
*   **Businesses**: A directory of local Malayalee-owned businesses, from restaurants and grocery stores to professional services.
*   **Deals**: Exclusive offers and discounts from partner businesses.
*   **Movies**: Information on Malayalam movie screenings and showtimes in various locations.
*   **Classifieds**: A community marketplace for job postings, items for sale, and services.

**2. User Engagement & Personalization:**
To create a personalized experience, users can:
*   **Create a Profile**: Have a public-facing profile to showcase their identity.
*   **Save Items**: Bookmark events, businesses, or deals they are interested in for later access.
*   **Share Content**: Easily share any listing with others via a direct link or a scannable QR code.
*   **Book Tickets**: For events with ticketing enabled, users can book and pay for tickets directly on the platform.

**3. Content Creation & Management (The Admin Dashboard):**
The `/admin` section is a powerful, secure backend for registered organizers, business owners, and platform administrators. It allows them to:
*   **Create and Manage Listings**: Verified users can create, edit, and publish their own events, community pages, business listings, and deals.
*   **Manage Roles**: Platform administrators can assign specific roles (like Moderator or Organizer) to users, granting them different levels of access.
*   **Moderate Content**: A dedicated moderation queue allows admins to review and act on user-reported content, ensuring the platform remains safe and appropriate.
*   **View Platform Analytics**: Admins can monitor key metrics like sales, ticket bookings, and user registrations from a central dashboard.

**4. Future-Facing Features:**
The application is built to be scalable, with sections that are ready for future expansion:
*   **Learn Malayalam**: A dedicated section (`/learn`) is set up to eventually host interactive lessons on the Malayalam language and culture.
*   **Perks & Rewards**: The backend includes management for a loyalty program, where users could earn points and redeem them for rewards, further incentivizing engagement.


## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage)


## Project Structure

The repository is organized to maintain a clean and scalable architecture.

` + "```" + `
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
` + "```" + `

## Getting Started

To get the application up and running locally, follow these steps:

1.  **Install Dependencies**:
    ` + "```" + `bash
    npm install
    ` + "```" + `

2.  **Run the Development Server**:
    ` + "```" + `bash
    npm run dev
    ` + "```" + `

The application will be available at ` + "`http://localhost:9002`" + `.
