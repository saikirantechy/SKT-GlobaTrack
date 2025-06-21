// This file is machine-generated - edit with caution!

'use server';

/**
 * @fileOverview Real-time speech translation flow.
 *
 * - translateSpeech - A function that translates speech in real-time.
 * - TranslateSpeechInput - The input type for the translateSpeech function.
 * - TranslateSpeechOutput - The return type for the translateSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateSpeechInputSchema = z.object({
  spokenLanguage: z
    .string()
    .describe('The language of the spoken input. Use ISO language codes.'),
  targetLanguage: z
    .string()
    .describe('The language to translate the spoken input to. Use ISO language codes.'),
  speechDataUri: z
    .string()
    .describe(
      'The spoken input as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type TranslateSpeechInput = z.infer<typeof TranslateSpeechInputSchema>;

const TranslateSpeechOutputSchema = z.object({
  translation: z.string().describe('The translated text.'),
  media: z.string().optional().describe('The translated speech as audio data URI.'),
});
export type TranslateSpeechOutput = z.infer<typeof TranslateSpeechOutputSchema>;

export async function translateSpeech(input: TranslateSpeechInput): Promise<TranslateSpeechOutput> {
  return translateSpeechFlow(input);
}

const translateSpeechPrompt = ai.definePrompt({
  name: 'translateSpeechPrompt',
  input: {
    schema: TranslateSpeechInputSchema,
  },
  output: {
    schema: TranslateSpeechOutputSchema,
  },
  prompt: `You are a real-time speech translator. A user will speak in their native language, and you will translate it into the target language.

  Spoken Language: {{{spokenLanguage}}}
  Target Language: {{{targetLanguage}}}
  Spoken Input: {{media url=speechDataUri}}

  Translation:`, // Omit media URL from the output schema description
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const translateSpeechFlow = ai.defineFlow(
  {
    name: 'translateSpeechFlow',
    inputSchema: TranslateSpeechInputSchema,
    outputSchema: TranslateSpeechOutputSchema,
  },
  async input => {
    const {output} = await translateSpeechPrompt(input);
    return output!;
  }
);

