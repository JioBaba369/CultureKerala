
'use server';
/**
 * @fileOverview An AI flow to generate event details from a user prompt.
 *
 * - generateEventDetails - A function that handles the event detail generation process.
 * - GenerateEventDetailsInput - The input type for the generateEventDetails function.
 * - GenerateEventDetailsOutput - The return type for the generateEventDetails function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  Event as EventType,
} from '@/types';

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
}).transform(val => ({
    ...val,
    price: val.ticketing.priceMin,
}));
export type GenerateEventDetailsOutput = z.infer<typeof GenerateEventDetailsOutputSchema>;


const prompt = ai.definePrompt({
    name: 'generateEventPrompt',
    input: { schema: GenerateEventDetailsInputSchema },
    output: { schema: GenerateEventDetailsOutputSchema },
    prompt: `You are an expert event planner. Given the user's prompt, generate compelling and plausible details for an event.
    
    If the event is physical, provide a fictional but realistic venue name and address. If it's online, provide a placeholder meeting link.
    
    For ticketing, if the prompt doesn't specify a price, decide whether it should be free or paid based on the event type and provide a reasonable starting price for paid events.
    
    Prompt: {{{prompt}}}
    `,
});

const generateEventDetailsFlow = ai.defineFlow(
  {
    name: 'generateEventDetailsFlow',
    inputSchema: GenerateEventDetailsInputSchema,
    outputSchema: GenerateEventDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function generateEventDetails(
  input: GenerateEventDetailsInput
): Promise<GenerateEventDetailsOutput> {
  return await generateEventDetailsFlow(input);
}
