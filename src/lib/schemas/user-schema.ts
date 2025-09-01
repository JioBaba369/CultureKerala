
import { z } from 'zod';
import { addYears, isBefore, isEqual } from 'date-fns';

export const profileFormSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters.").max(50),
  username: z.string().min(3, "Username must be at least 3 characters.").max(30).regex(/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, underscores, and periods."),
  bio: z.string().max(160, "Bio must not be longer than 160 characters.").optional(),
  photoURL: z.string().url("A valid image URL is required.").optional().or(z.literal('')).nullable(),
  dob: z.date({
      errorMap: (issue, ctx) => ({ message: 'Please select your date of birth.'})
  }).refine((date) => {
    const today = new Date();
    const eighteenYearsAgo = addYears(today, -18);
    return isBefore(date, eighteenYearsAgo) || isEqual(date, eighteenYearsAgo);
  }, { message: "You must be at least 18 years old." }).optional().nullable(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  interests: z.array(z.string()).optional(),
  phone: z.string().max(20).optional(),
  socials: z.object({
      website: z.string().url().optional().or(z.literal('')),
      x: z.string().url().optional().or(z.literal('')),
      instagram: z.string().url().optional().or(z.literal('')),
      facebook: z.string().url().optional().or(z.literal('')),
      linkedin: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
