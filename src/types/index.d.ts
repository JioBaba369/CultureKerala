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

export type Category = "Event" | "Community" | "Business" | "Deal" | "Movie" | "Lesson";

export type User = {
  id: string;
  uid: string; // Firebase Auth UID
  displayName: string;
  email: string;
  photoURL?: string | null;
  city: string;
  roles: {
    orgAdmin: boolean;
    superAdmin: boolean;
  };
  interests: string[];
  points: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Org = {
  id: string;
  name: string;
  city: string;
  type: "association" | "temple" | "troupe" | "school";
  admins: string[]; // array of UIDs
  verified: boolean;
  contact: {
    email: string;
    phone: string;
    url: string;
  };
  createdAt: Timestamp;
};

export type Event = {
  id: string;
  title: string;
  subtitle?: string;
  type: "onam" | "concert" | "workshop" | "temple" | "family";
  orgId: string;
  venueId?: string;
  city: string;
  startsAt: Timestamp;
  endsAt: Timestamp;
  timezone: string;
  coverImage?: string;
  tags?: string[];
  free: boolean;
  priceFrom?: number;
  capacity?: number;
  rsvpCount?: number;
  status: "draft" | "published" | "archived";
  socials?: {
    whatsappInvite?: string;
    instagram?: string;
  };
  createdBy: string; // UID
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Venue = {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    city: string;
    capacity?: number;
};

export type Business = {
  id: string;
  name: string;
  category: "restaurant" | "grocer" | "services" | "retail" | "other";
  city: string;
  offers?: any[]; // Simplified for now
};

export type Deal = {
  id: string;
  bizId: string;
  title: string;
  description: string;
  validFrom: Timestamp;
  validTo: Timestamp;
  cities: string[];
};

export type Lesson = {
  id: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  sections: {
    type: "video" | "quiz" | "card";
    content: any; // Simplified
  }[];
  xp: number;
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
