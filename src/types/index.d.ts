
import { Timestamp, GeoPoint } from "firebase/firestore";

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

export type Category = "Event" | "Community" | "Business" | "Deal" | "Movie" | "Classified" | "Perk";

export type User = {
  id: string;
  uid: string; // Firebase Auth UID
  displayName: string;
  email: string;
  username: string;
  bio?: string;
  photoURL?: string | null;
  roles: {
    admin: boolean;
    moderator: boolean;
    organizer: boolean;
  };
  clubMembership?: {
    status: 'active' | 'expired' | 'cancelled';
    tier: 'monthly' | 'annual';
    startedAt: Timestamp;
    expiresAt: Timestamp;
  }
  wallet?: {
    points: number;
    tier: 'bronze' | 'silver' | 'gold';
  };
  status: 'active' | 'suspended';
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Community = {
  id: string;
  name: string;
  slug: string;
  type: 'cultural' | 'student' | 'religious' | 'professional' | 'regional' | 'other';
  description?: string;
  logoURL?: string;
  bannerURL?: string;
  region: {
    city: string;
    country: string; // ISO 3166-1 alpha-2 code
  };
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  socials?: {
    facebook?: string;
    instagram?: string;
    x?: string;
    youtube?: string;
  }
  roles: {
    owners: string[]; // UIDs
    admins: string[]; // UIDs
  };
  memberCount: number;
  verified: boolean;
  status: "draft" | "published" | "archived";
  createdBy: string; // UID
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type TicketTier = {
    id: string;
    name: string;
    price: number;
    quantityTotal: number;
    quantityAvailable: number;
    description?: string;
}

export type Event = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  organizers: string[]; // array of UIDs of event managers
  organizer: string; // Display name of organizer
  communityId?: string;
  businessId?: string;
  startsAt: Timestamp;
  endsAt: Timestamp;
  timezone: string;
  isOnline: boolean;
  venue?: {
    name?: string;
    address: string;
    city?: string;
    gmapsUrl?: string;
  };
  meetingLink?: string;
  coverURL?: string;
  tags?: string[];
  ticketing?: {
    type: 'free' | 'paid' | 'external';
    provider?: 'stripe' | null;
    priceMin?: number; // Minimum price for display
    externalUrl?: string;
    tiers?: TicketTier[];
  };
  capacity?: number;
  rsvpCount?: number;
  status: "draft" | "published" | "archived";
  visibility: 'public' | 'unlisted';
  createdBy: string; // UID
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Business = {
  id: string;
  ownerId: string; // UID
  displayName: string;
  slug: string;
  description?: string;
  category: "restaurant" | "grocer" | "services" | "retail" | "other";
  locations: {
    address: string;
    city: string;
    state: string; // e.g. NSW
    country: string; // ISO 3166-1 alpha-2
    gmapsUrl?: string;
  }[];
  cities: string[]; // Denormalized for querying
  isOnline: boolean;
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  images?: string[];
  logoURL?: string;
  status: "draft" | "published" | "archived";
  verified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Deal = {
  id: string;
  businessId: string;
  slug: string;
  title: string;
  description: string;
  code?: string;
  redeemUrl?: string;
  startsAt: Timestamp;
  endsAt: Timestamp;
  images?: string[];
  priceOriginal?: number;
  priceDiscounted?: number;
  status: 'draft' | 'published' | 'archived';
  cities: string[]; // Denormalized from Business for querying
  createdBy: string; // UID
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Post = {
  id: string;
  authorId: string;
  type: "reel" | "photo" | "text";
  text?: string;
  media?: any; // Simplified
  city: string;
  modStatus: "pending" | "approved" | "rejected";
};

export type Movie = {
  id: string;
  title: string;
  slug: string;
  overview: string;
  posterURL?: string;
  backdropURL?: string;
  releaseDate: Timestamp;
  genres: string[];
  languages: string[];
  cast: { name: string; character: string; image?: string; }[];
  crew: { name: string; role: string; }[];
  status: "upcoming" | "now_showing" | "archived";
  screenings?: {
    startsAt: Timestamp;
    city: string;
    cinemaName: string;
    bookingUrl: string;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Country = {
  code: string;
  name: string;
};

export type IndiaState = {
  code: string;
  name: string;
};

export type Report = {
  id: string;
  itemId: string;
  itemType: string;
  itemTitle: string;
  reason: string;
  reporterId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
};

export type Booking = {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  ticketTypeId: string;
  quantity: number;
  totalPrice: number;
  createdAt: Timestamp;
};

export type Perk = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  type: 'discount' | 'exclusive_access' | 'partner_offer' | 'other';
  status: 'active' | 'archived';
  eligibility: 'club_members' | 'all_users';
  partnerBusinessId?: string; // Link to a business in the directory
  imageURL?: string;
  code?: string;
  redeemUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Reward = {
  id: string;
  title: string;
  description?: string;
  terms?: string;
  type: 'voucher' | 'discount' | 'ticket' | 'merch' | 'badge';
  pointsCost: number;
  inventory?: number | null; // null for unlimited
  status: 'active' | 'archived';
  imageURL?: string;
  validFrom?: Timestamp | null;
  validTo?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type Ad = {
  id: string;
  title: string;
  status: 'draft' | 'approved' | 'running' | 'paused' | 'archived';
  advertiserType: 'house' | 'business' | 'community' | 'external';
  entityId?: string; // Optional ID of the event, business, etc. being promoted
  
  creative: {
    type: 'native_entity' | 'image' | 'html' | 'video';
    imageURL?: string;
    htmlContent?: string;
    videoURL?: string;
    cta: {
      label: string;
      url?: string;
    };
  };
  
  placements: string[]; // e.g., 'home_feed', 'events_list_inline'
  
  target: {
    cities?: string[];
    categories?: string[]; // e.g., 'festival', 'food'
    clubOnly?: boolean;
  };

  schedule: {
    startAt: Timestamp;
    endAt: Timestamp;
  };

  priority: number; // 1-10, for ordering
  featured?: {
    isFeatured: boolean;
    expiresAt?: Timestamp;
  };

  counts: {
    impressions: number;
    clicks: number;
  };

  ownerId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type Classified = {
  id: string;
  createdBy: string;
  slug: string;
  title: string;
  description: string;
  category: 'for_sale' | 'job_opening' | 'service' | 'other';
  status: 'draft' | 'published' | 'archived';
  imageURL?: string;
  contact: {
    name: string;
    email?: string;
    phone?: string;
  };
  location: {
    city: string;
    country: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
