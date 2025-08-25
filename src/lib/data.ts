
import type { Item, ModerationItem } from "@/types";

export const locations = ["Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Sydney", "Melbourne"];

export const events: Item[] = [
    {
        id: "evt1",
        slug: "mumbai-music-festival-2025",
        title: "Mumbai Music Festival 2025",
        description: "A three-day celebration of classical and contemporary Indian music, featuring renowned artists from across the globe.",
        category: "Event",
        location: "Mumbai",
        image: "https://placehold.co/600x400.png",
    },
    {
        id: "evt2",
        slug: "kolkata-international-film-festival",
        title: "Kolkata International Film Festival",
        description: "A prestigious event showcasing a diverse range of international and regional films, with screenings and panel discussions.",
        category: "Event",
        location: "Kolkata",
        image: "https://placehold.co/600x400.png",
    },
    {
        id: "evt3",
        slug: "chennai-art-expo",
        title: "Chennai Art Expo",
        description: "Discover contemporary and traditional art from South India's most talented artists. Includes workshops and live demonstrations.",
        category: "Event",
        location: "Chennai",
        image: "https://placehold.co/600x400.png",
    },
    {
        id: "evt4",
        slug: "sydney-diwali-fair",
        title: "Sydney Diwali Fair",
        description: "Celebrate the festival of lights with food stalls, cultural performances, and fireworks at this family-friendly event.",
        category: "Event",
        location: "Sydney",
        image: "https://placehold.co/600x400.png",
    }
];

export const communities: Item[] = [
    {
        id: "com1",
        slug: "bangalore-techies-meetup",
        title: "Bangalore Techies Meetup",
        description: "A community for tech enthusiasts in Bangalore to network, share ideas, and collaborate on innovative projects.",
        category: "Community",
        location: "Bangalore",
        image: "https://placehold.co/600x400.png",
    },
    {
        id: "com2",
        slug: "mumbai-photowalkers-club",
        title: "Mumbai Photowalkers Club",
        description: "Join fellow photography lovers to explore and capture the vibrant streets of Mumbai. All skill levels welcome.",
        category: "Community",
        location: "Mumbai",
        image: "https://placehold.co/600x400.png",
    },
    {
        id: "com3",
        slug: "melbourne-bollywood-dance-group",
        title: "Melbourne Bollywood Dance Group",
        description: "Learn and perform Bollywood dance routines. A fun way to stay active and connect with the community.",
        category: "Community",
        location: "Melbourne",
        image: "https://placehold.co/600x400.png",
    }
];

export const businesses: Item[] = [
    {
        id: "biz1",
        slug: "delhi-spice-house",
        title: "Delhi Spice House",
        description: "Authentic North Indian cuisine with a modern twist. Known for our butter chicken and vibrant ambiance.",
        category: "Business",
        location: "Delhi",
        image: "https://placehold.co/600x400.png",
    },
    {
        id: "biz2",
        slug: "startup-cafe-bangalore",
        title: "Startup Cafe Bangalore",
        description: "A co-working space and cafe designed for entrepreneurs and freelancers. High-speed internet and great coffee.",
        category: "Business",
        location: "Bangalore",
        image: "https://placehold.co/600x400.png",
    },
    {
        id: "biz3",
        slug: "kolkata-book-nook",
        title: "Kolkata Book Nook",
        description: "A quaint bookstore with a vast collection of literature, from classics to modern bestsellers and rare finds.",
        category: "Business",
        location: "Kolkata",
        image: "https://placehold.co/600x400.png",
    }
];

export const deals: Item[] = [
    {
        id: "deal1",
        slug: "50-off-at-chennai-silks",
        title: "50% Off at Chennai Silks",
        description: "Get a flat 50% discount on all silk sarees for a limited time. The perfect festive deal for all occasions!",
        category: "Deal",
        location: "Chennai",
        image: "https://placehold.co/600x400.png",
    },
    {
        id: "deal2",
        slug: "buy-1-get-1-at-delhi-foodies-paradise",
        title: "Buy 1 Get 1 at Delhi Foodies Paradise",
        description: "Enjoy our special BOGO offer on all main courses every Tuesday. Bring a friend and savor the taste of Delhi.",
        category: "Deal",
        location: "Delhi",
        image: "https://placehold.co/600x400.png",
    }
];

export const movies: Item[] = [
    {
        id: "mov1",
        slug: "gulab-jamun-rom-com",
        title: "Gulab Jamun: A Sweet Love Story",
        description: "A heartwarming romantic comedy about two chefs from different backgrounds falling in love over their shared passion for food.",
        category: "Movie",
        location: "Mumbai",
        image: "https://placehold.co/600x400.png",
    },
    {
        id: "mov2",
        slug: "the-bengal-tiger-thriller",
        title: "The Bengal Tiger",
        description: "An action-packed thriller set in the Sundarbans, where a forest guard must protect the endangered tigers from poachers.",
        category: "Movie",
        location: "Kolkata",
        image: "https://placehold.co/600x400.png",
    }
];

export const moderationItems: ModerationItem[] = [
    { type: "Business", title: "Mumbai Delights", user: "user@example.com", time: "36m ago", status: "Pending" },
    { type: "Event", title: "Late Night Party", user: "reporter@example.com", time: "2h ago", status: "Reported", reason: "Spam" },
    { type: "Community", title: "Delhi Bikers Group", user: "newuser@example.com", time: "1d ago", status: "Pending" },
    { type: "Deal", title: "Free Coffee", user: "bizowner@example.com", time: "2d ago", status: "Pending" },
    { type: "Business", title: "Sydney Sari Palace", user: "owner@example.com", time: "3d ago", status: "Pending" },
    { type: "Community", title: "Chennai Coders", user: "dev@example.com", time: "4d ago", status: "Approved" },
    { type: "Event", title: "Beach Cleanup", user: "volunteer@example.com", time: "5d ago", status: "Approved" },
    { type: "Deal", title: "Invalid Deal", user: "reporter2@example.com", time: "6d ago", status: "Rejected", reason: "Expired" },
];


export const allItems: Item[] = [...events, ...communities, ...businesses, ...deals, ...movies];

export const allItemsBySlug = allItems.reduce((acc, item) => {
  acc[item.slug] = item;
  return acc;
}, {} as Record<string, Item>);
