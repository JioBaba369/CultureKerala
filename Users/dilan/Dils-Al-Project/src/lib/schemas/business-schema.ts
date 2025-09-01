
import { z } from "zod";

export const businessFormSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters.").max(100),
  description: z.string().max(2000).optional(),
  category: z.enum(["restaurant", "grocer", "services", "retail", "other"]),
  status: z.enum(['draft', 'published', 'archived']),
  verified: z.boolean().default(false),
  isOnline: z.boolean().default(false),
  locations: z.array(z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State/Province is required"),
    country: z.string().min(1, "Country is required"),
  })).optional(),
  contact: z.object({
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
  }),
  socials: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    x: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
  }).optional(),
  logoURL: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string().url()).optional(),
}).refine(data => {
    if (data.isOnline) {
      return true; // If online, locations are not required
    }
    // If not online, locations array must exist and have at least one item
    return Array.isArray(data.locations) && data.locations.length > 0;
  }, {
    message: "At least one location is required for physical businesses.",
    path: ["locations"], // Point the error to the locations field
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;
