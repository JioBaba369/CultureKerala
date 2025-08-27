
'use server';
/**
 * @fileOverview An AI flow to generate event details from a user prompt.
 *
 * - generateEventDetails - A function that handles the event detail generation process.
 * - GenerateEventDetailsInput - The input type for the generateEventDetails function.
 * - GenerateEventDetailsOutput - The return type for the generateEventDetails function.
 */

import { ai } from '@/ai/genkit';
import { 
    GenerateEventDetailsInputSchema, 
    GenerateEventDetailsOutputSchema, 
    type GenerateEventDetailsInput,
    type GenerateEventDetailsOutput
} from '@/ai/schemas';


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

    