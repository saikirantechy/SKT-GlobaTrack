'use server';
/**
 * @fileOverview AI agent to suggest people to meet based on common origins, languages, or interests.
 *
 * - suggestPeopleToMeet - A function that suggests people to meet.
 * - SuggestPeopleToMeetInput - The input type for the suggestPeopleToMeet function.
 * - SuggestPeopleToMeetOutput - The return type for the suggestPeopleToMeet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPeopleToMeetInputSchema = z.object({
  origin: z.string().describe('The origin of the user (e.g., city, state, or country).'),
  language: z.string().describe('The primary language of the user.'),
  interests: z.string().describe('A comma-separated list of the user\'s interests.'),
});
export type SuggestPeopleToMeetInput = z.infer<typeof SuggestPeopleToMeetInputSchema>;

const SuggestPeopleToMeetOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      name: z.string().describe('The name of the suggested person.'),
      reason: z.string().describe('The reason for suggesting this person (e.g., common origin, language, or interest).'),
    })
  ).describe('A list of suggested people to meet and the reasons for suggesting them.'),
});
export type SuggestPeopleToMeetOutput = z.infer<typeof SuggestPeopleToMeetOutputSchema>;

export async function suggestPeopleToMeet(input: SuggestPeopleToMeetInput): Promise<SuggestPeopleToMeetOutput> {
  return suggestPeopleToMeetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPeopleToMeetPrompt',
  input: {schema: SuggestPeopleToMeetInputSchema},
  output: {schema: SuggestPeopleToMeetOutputSchema},
  prompt: `You are an AI assistant helping event attendees connect with each other.

  Given the following information about a user:

  Origin: {{{origin}}}
  Language: {{{language}}}
  Interests: {{{interests}}}

  Suggest people to meet at the event based on common origins, languages, or interests. Provide a reason for each suggestion.
  Format your response as a JSON array of objects, where each object has a 'name' and a 'reason' field.
  `,
});

const suggestPeopleToMeetFlow = ai.defineFlow(
  {
    name: 'suggestPeopleToMeetFlow',
    inputSchema: SuggestPeopleToMeetInputSchema,
    outputSchema: SuggestPeopleToMeetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
