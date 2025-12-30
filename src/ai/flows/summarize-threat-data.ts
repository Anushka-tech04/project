'use server';

/**
 * @fileOverview Summarizes threat intelligence data for an IP address.
 *
 * - summarizeThreatData - A function that summarizes threat data.
 * - SummarizeThreatDataInput - The input type for the summarizeThreatData function.
 * - SummarizeThreatDataOutput - The return type for the summarizeThreatData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeThreatDataInputSchema = z.object({
  ipAddress: z.string().describe('The IP address to analyze.'),
  threatData: z.string().describe('Aggregated threat intelligence data in JSON format.'),
});
export type SummarizeThreatDataInput = z.infer<typeof SummarizeThreatDataInputSchema>;

const SummarizeThreatDataOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the threat intelligence data.'),
  riskLevel: z.string().describe('The overall risk level associated with the IP address (e.g., low, medium, high).'),
  justification: z.string().describe('A justification for the assigned risk level based on the threat data.'),
});
export type SummarizeThreatDataOutput = z.infer<typeof SummarizeThreatDataOutputSchema>;

export async function summarizeThreatData(input: SummarizeThreatDataInput): Promise<SummarizeThreatDataOutput> {
  return summarizeThreatDataFlow(input);
}

const summarizeThreatDataPrompt = ai.definePrompt({
  name: 'summarizeThreatDataPrompt',
  input: {schema: SummarizeThreatDataInputSchema},
  output: {schema: SummarizeThreatDataOutputSchema},
  prompt: `You are an expert cybersecurity analyst. Analyze the provided threat intelligence data for the given IP address and provide a concise summary, risk level, and justification.

IP Address: {{{ipAddress}}}

Threat Data: {{{threatData}}}

Summary:
Risk Level:
Justification: `,
});

const summarizeThreatDataFlow = ai.defineFlow(
  {
    name: 'summarizeThreatDataFlow',
    inputSchema: SummarizeThreatDataInputSchema,
    outputSchema: SummarizeThreatDataOutputSchema,
  },
  async input => {
    const {output} = await summarizeThreatDataPrompt(input);
    return output!;
  }
);
