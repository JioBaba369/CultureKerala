export type Category = "Events" | "Communities" | "Businesses" | "Deals" | "Movies";

export type Item = {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  image: string;
};

export const locations = ["Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai"];

export const allItems: Item[] = [
  {
    id: "evt1",
    title: "Mumbai Music Festival",
    description: "A three-day celebration of classical and contemporary Indian music, featuring renowned artists.",
    category: "Events",
    location: "Mumbai",
    image: "https://placehold.co/600x400.png",
  },
  {
    id: "com1",
    title: "Bangalore Techies Meetup",
    description: "A community for tech enthusiasts in Bangalore to network, share ideas, and collaborate on projects.",
    category: "Communities",
    location: "Bangalore",
    image: "https://placehold.co/600x400.png",
  },
  {
    id: "biz1",
    title: "Delhi Spice House",
    description: "Authentic North Indian cuisine with a modern twist. Known for our butter chicken and vibrant ambiance.",
    category: "Businesses",
    location: "Delhi",
    image: "https://placehold.co/600x400.png",
  },
  {
    id: "deal1",
    title: "50% Off at Chennai Silks",
    description: "Get a flat 50% discount on all silk sarees for a limited time. The perfect festive deal!",
    category: "Deals",
    location: "Chennai",
    image: "https://placehold.co/600x400.png",
  },
  {
    id: "mov1",
    title: "Gulab Jamun",
    description: "A heartwarming romantic comedy about two chefs from different backgrounds falling in love.",
    category: "Movies",
    location: "Mumbai",
    image: "https://placehold.co/600x400.png",
  },
  {
    id: "evt2",
    title: "Kolkata International Film Festival",
    description: "A prestigious event showcasing a diverse range of international and regional films.",
    category: "Events",
    location: "Kolkata",
    image: "https://placehold.co/600x400.png",
  },
  {
    id: "biz2",
    title: "Startup Cafe Bangalore",
    description: "A co-working space and cafe designed for entrepreneurs and freelancers. High-speed internet and great coffee.",
    category: "Businesses",
    location: "Bangalore",
    image: "https://placehold.co/600x400.png",
  },
  {
    id: "com2",
    title: "Mumbai Photowalkers",
    description: "Join fellow photography lovers to explore and capture the streets of Mumbai. All skill levels welcome.",
    category: "Communities",
    location: "Mumbai",
    image: "https://placehold.co/600x400.png",
  },
   {
    id: "deal2",
    title: "Buy 1 Get 1 at Delhi Foodies",
    description: "Enjoy our special BOGO offer on all main courses every Tuesday. Bring a friend and savor the taste.",
    category: "Deals",
    location: "Delhi",
    image: "https://placehold.co/600x400.png",
  },
  {
    id: "mov2",
    title: "The Bengal Tiger",
    description: "An action-packed thriller set in the Sundarbans, a forest guard must protect the endangered tigers.",
    category: "Movies",
    location: "Kolkata",
    image: "https://placehold.co/600x400.png",
  },
  {
    id: "evt3",
    title: "Chennai Art Expo",
    description: "Discover contemporary and traditional art from South India's most talented artists.",
    category: "Events",
    location: "Chennai",
    image: "https://placehold.co/600x400.png",
  },
  {
    id: "biz3",
    title: "Kolkata Book Nook",
    description: "A quaint bookstore with a vast collection of literature, from classics to modern bestsellers.",
    category: "Businesses",
    location: "Kolkata",
    image: "https://placehold.co/600x400.png",
  },
];
