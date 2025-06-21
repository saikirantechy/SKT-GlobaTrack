import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-people-to-meet.ts';
import '@/ai/flows/generate-event-pass-details.ts';
import '@/ai/flows/generate-session-summaries.ts';
import '@/ai/flows/translate-speech.ts';