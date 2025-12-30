import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-threat-data.ts';
import '@/ai/flows/generate-report-recommendations.ts';