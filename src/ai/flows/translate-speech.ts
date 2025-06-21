'use server';

/**
 * @fileOverview Real-time speech and text translation flow.
 *
 * - translate - A function that translates speech or text in real-time.
 * - TranslateInput - The input type for the translate function.
 * - TranslateOutput - The return type for the translate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateInputSchema = z
  .object({
    sourceLanguage: z
      .string()
      .describe(
        'The language of the input. Use ISO language codes. Use "auto" for auto-detection.'
      ),
    targetLanguage: z
      .string()
      .describe(
        'The language to translate the input to. Use ISO language codes.'
      ),
    speechDataUri: z
      .string()
      .optional()
      .describe(
        'The spoken input as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
      ),
    text: z.string().optional().describe('The text input to translate.'),
  })
  .refine(data => data.text || data.speechDataUri, {
    message: 'Either text or speechDataUri must be provided.',
  });
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.object({
  translation: z.string().describe('The translated text.'),
  media: z
    .string()
    .optional()
    .describe('The translated speech as audio data URI.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translate(
  input: TranslateInput
): Promise<TranslateOutput> {
  return translateFlow(input);
}

const translatePrompt = ai.definePrompt({
  name: 'translatePrompt',
  input: {
    schema: TranslateInputSchema,
  },
  output: {
    schema: TranslateOutputSchema,
  },
  prompt: `You are a real-time translator. A user will provide input in their native language, and you will translate it into the target language.

  Source Language: {{{sourceLanguage}}}
  Target Language: {{{targetLanguage}}}

  {{#if text}}
  Text Input: {{{text}}}
  {{/if}}

  {{#if speechDataUri}}
  Spoken Input: {{media url=speechDataUri}}
  {{/if}}

  Translation:`,
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

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async input => {
    const {output} = await translatePrompt(input);
    return output!;
  }
);
