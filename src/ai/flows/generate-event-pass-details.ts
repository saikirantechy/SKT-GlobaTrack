'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating event pass details based on attendee role and language preferences.
 *
 * - generateEventPassDetails - A function that generates event pass details.
 * - GenerateEventPassDetailsInput - The input type for the generateEventPassDetails function.
 * - GenerateEventPassDetailsOutput - The output type for the generateEventPassDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventPassDetailsInputSchema = z.object({
  role: z
    .enum(['Attendee', 'Volunteer', 'Speaker'])
    .describe('The role of the attendee.'),
  languagePreference: z
    .string()
    .describe('The preferred language of the attendee.'),
  attendeeName: z.string().describe('The name of the attendee.'),
});

export type GenerateEventPassDetailsInput = z.infer<
  typeof GenerateEventPassDetailsInputSchema
>;

const GenerateEventPassDetailsOutputSchema = z.object({
  details: z.string().describe('The generated event pass details.'),
  colorCode: z.string().describe('The color code for the event pass.'),
});

export type GenerateEventPassDetailsOutput = z.infer<
  typeof GenerateEventPassDetailsOutputSchema
>;

export async function generateEventPassDetails(
  input: GenerateEventPassDetailsInput
): Promise<GenerateEventPassDetailsOutput> {
  return generateEventPassDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEventPassDetailsPrompt',
  input: {schema: GenerateEventPassDetailsInputSchema},
  output: {schema: GenerateEventPassDetailsOutputSchema},
  prompt: `You are an event pass generator. You will generate event pass details and a color code based on the attendee's role and language preferences.

Role: {{{role}}}
Language Preference: {{{languagePreference}}}
Attendee Name: {{{attendeeName}}}

Consider the following:
- If the role is Volunteer, the details should include the volunteer duties and the color code should be green.
- If the role is Speaker, the details should include the session details and the color code should be blue.
- If the role is Attendee, the details should include the event schedule and the color code should be yellow.

The details should be concise and informative.

Output the details and the color code in JSON format.`,
});

const generateEventPassDetailsFlow = ai.defineFlow(
  {
    name: 'generateEventPassDetailsFlow',
    inputSchema: GenerateEventPassDetailsInputSchema,
    outputSchema: GenerateEventPassDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
