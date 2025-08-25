
import { Timestamp, GeoPoint } from "firebase/firestore";

export type Category = "Event" | "Community" | "Business" | "Deal" | "Movie";

// Base type for any directory item for display purposes (e.g. cards)
export type Item = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  image: string;
  date?: Timestamp | Date | string;
  price?: number;
  organizer?: string;
};

// ===================================
// Main Data Models
// ===================================

export type Event = {
  id: string;

  // Identity
  title: string;
  slug: string;
  categoryId: string; // From config/categories
  tags?: string[];
  coverURL?: string;
  gallery?: string[];

  // Timing
  startsAt: Timestamp;
  endsAt: Timestamp;
  timezone: string;

  // Location
  venue?: {
    name: string;
    address: string;
    geo?: GeoPoint;
    geohash?: string;
  };
  isOnline: boolean;
  meetingLink?: string;

  // Ticketing / RSVP
  ticketing?: {
    type: 'free' | 'paid' | 'external';
    provider?: 'stripe' | 'external' | null;
    currency?: string;
    priceMin?: number;
    priceMax?: number;
    externalUrl?: string;
  };
  capacity?: number;
  sold?: number;

  // Relationships
  communityId?: string | null;
  organizers: string[]; // array of user UIDs
  sponsors?: string[]; // array of business IDs

  // Moderation & Status
  status: 'draft' | 'published' | 'archived';
  verified: boolean;
  visibility: 'public' | 'unlisted';

  // SEO & Share
  summary?: string; // 160–240 chars
  ogImageURL?: string;
  shortCode?: string;

  // Internationalization (optional)
  i18n?: { [key: string]: { title: string; summary: string } };

  // System
  createdBy: string; // user UID
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Community = {
  id: string;

  // Core
  name: string;
  slug: string;
  type: 'cultural' | 'student' | 'religious' | 'professional' | 'regional' | 'other';
  logoURL?: string;
  bannerURL?: string;
  description: string;
  region: {
    country: string;
    state?: string;
    city: string;
  };

  // Contact & Social
  contact?: { email?: string; phone?: string; website?: string };
  socials?: { facebook?: string; instagram?: string; x?: string; youtube?: string; whatsapp?: string; telegram?: string };

  // Membership
  membership?: {
    mode: 'open' | 'request' | 'invite';
    dues?: { currency: string; amount: number };
  };
  roles: {
    owners: string[]; // UIDs
    admins?: string[]; // UIDs
    moderators?: string[]; // UIDs
  };

  // Governance
  verified: boolean;
  status: 'draft' | 'published' | 'archived';

  // System
  createdBy: string; // UID
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Business = {
    id: string;

    // Identity
    displayName: string;
    slug: string;
    legalName?: string;
    categoryId: string; // e.g., 'restaurant', 'grocer', 'services'

    // Locations
    locations: Array<{
        label?: string;
        address: string;
        geo?: GeoPoint;
        geohash?: string;
        hours?: { [key in 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun']?: string };
    }>;
    isOnline: boolean;

    // Contact
    contact: { email?: string; phone?: string; website?: string; whatsapp?: string };
    socials?: { instagram?: string; facebook?: string; x?: string; youtube?: string };
    
    // Details
    description?: string;
    services?: string[];
    priceRange?: '$' | '$$' | '$$$' | '$$$$';
    images?: string[];

    // Trust
    verified: boolean;
    verificationDocs?: string[]; // Storage paths, admin-only access

    // System
    ownerId: string; // UID
    status: 'draft' | 'published' | 'archived';
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export type Deal = {
    id: string;

    // Core
    title: string;
    businessId: string;
    description: string;
    terms?: string;
    images?: string[];

    // Validity
    startsAt: Timestamp;
    endsAt: Timestamp;
    daysOfWeek?: number[]; // 0-6 for Sun-Sat

    // Redemption
    mode: 'in_store' | 'online' | 'both';
    couponCode?: string;
    url?: string;
    perUserLimit?: number;
    globalLimit?: number;
    redeemedCount?: number;

    // Value
    currency?: string;
    priceOriginal?: number;
    priceDiscounted?: number;
    percentOff?: number;

    // Geo scope
    locationScope: 'single' | 'multi' | 'online';
    geohashes?: string[];

    // System
    status: 'draft' | 'published' | 'expired';
    createdBy: string; // UID
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export type Movie = {
    id: string;

    // Identity
    title: string;
    slug: string;
    languages: string[];
    genres?: string[];
    certification?: string; // 'U', 'UA', 'A', etc.
    runtimeMins?: number;
    posterURL?: string;
    trailerURL?: string;

    // Synopsis
    tagline?: string;
    overview: string;

    // People
    cast?: Array<{ name: string; role?: string }>;
    crew?: Array<{ name: string; job: string }>;

    // External IDs
    externalIds?: { imdb?: string; tmdb?: number };

    // Screenings
    screenings?: Array<{
        cinema: string;
        address: string;
        city: string;
        geo?: GeoPoint;
        startsAt: Timestamp;
        ticketURL: string;
        priceFrom?: number;
        currency?: string;
    }>;

    // System
    status: 'coming_soon' | 'now_showing' | 'archived';
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export type User = {
    id: string; // Firestore document ID
    uid: string; // Firebase Auth UID
    email: string;

    // Profile
    displayName?: string;
    username: string; // unique
    photoURL?: string | null;
    bio?: string;
    location?: { country?: string; city?: string };
    languages?: string[]; // ISO codes
    website?: string;

    // Roles & Permissions
    roles: {
        admin?: boolean;
        moderator?: boolean;
        organizer?: boolean;
    };
    status: 'active' | 'suspended' | 'deleted';
    
    // Preferences
    interests?: string[];
    notifications?: {
        email?: boolean;
        push?: boolean;
        digests?: 'none' | 'weekly' | 'daily';
    };
    privacy?: {
        profile: 'public' | 'followers' | 'private';
    };

    // Affiliations
    communities?: string[]; // Pinned community IDs
    handles?: { instagram?: string; x?: string; youtube?: string; linkedin?: string };

    // System & Stats
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastActiveAt?: Timestamp;
};


// ===================================
// Other Types
// ===================================

export type Report = {
    id: string;
    itemId: string;
    itemType: string;
    itemTitle: string;
    reason: string;
    reporterId: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Timestamp;
}

export type Booking = {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  createdAt: Timestamp;
};

export type Country = {
    code: string;
    name: string;
};

export type IndiaState = {
    code: string;
    name: string;
};
