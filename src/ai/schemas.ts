
import { z } from 'zod';

export const GenerateEventDetailsInputSchema = z.object({
  prompt: z.string().describe('A simple prompt describing the event to be created. e.g., "A diwali celebration in Sydney"'),
});
export type GenerateEventDetailsInput = z.infer<typeof GenerateEventDetailsInputSchema>;


export const GenerateEventDetailsOutputSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters.").max(120, "Title must not be longer than 120 characters."),
    summary: z.string().max(240, "Summary must not be longer than 240 characters.").optional(),
    isOnline: z.boolean().default(false),
    venue: z.object({
        name: z.string().optional(),
        address: z.string().optional(),
    }).optional(),
    meetingLink: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
    ticketing: z.object({
        type: z.enum(['free','paid','external']),
        priceMin: z.coerce.number().optional(),
        externalUrl: z.string().url().optional().or(z.literal('')),
    }),
}).transform(async (val) => ({
    ...val,
    price: val.ticketing.priceMin,
}));
export type GenerateEventDetailsOutput = z.infer<typeof GenerateEventDetailsOutputSchema>;

    