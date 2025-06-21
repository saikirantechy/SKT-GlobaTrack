// src/ai/flows/generate-session-summaries.ts
'use server';
/**
 * @fileOverview Generates a summary of a session given its transcript.
 *
 * - generateSessionSummary - A function that generates a session summary.
 * - GenerateSessionSummaryInput - The input type for the generateSessionSummary function.
 * - GenerateSessionSummaryOutput - The return type for the generateSessionSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSessionSummaryInputSchema = z.object({
  transcript: z.string().describe('The transcript of the session.'),
});
export type GenerateSessionSummaryInput = z.infer<
  typeof GenerateSessionSummaryInputSchema
>;

const GenerateSessionSummaryOutputSchema = z.object({
  summary: z.string().describe('The summary of the session.'),
});
export type GenerateSessionSummaryOutput = z.infer<
  typeof GenerateSessionSummaryOutputSchema
>;

export async function generateSessionSummary(
  input: GenerateSessionSummaryInput
): Promise<GenerateSessionSummaryOutput> {
  return generateSessionSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSessionSummaryPrompt',
  input: {schema: GenerateSessionSummaryInputSchema},
  output: {schema: GenerateSessionSummaryOutputSchema},
  prompt: `You are an AI assistant that specializes in summarizing session transcripts.

  Given the following transcript, generate a concise and informative summary of the session, highlighting the key takeaways and important information.

  Transcript: {{{transcript}}}`,
});

const generateSessionSummaryFlow = ai.defineFlow(
  {
    name: 'generateSessionSummaryFlow',
    inputSchema: GenerateSessionSummaryInputSchema,
    outputSchema: GenerateSessionSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
