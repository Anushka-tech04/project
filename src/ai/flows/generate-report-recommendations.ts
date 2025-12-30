'use server';

/**
 * @fileOverview Generates security recommendations based on threat intelligence data.
 *
 * - generateReportRecommendations - A function to generate security recommendations.
 * - GenerateReportRecommendationsInput - The input type for the generateReportRecommendations function.
 * - GenerateReportRecommendationsOutput - The return type for the generateReportRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportRecommendationsInputSchema = z.object({
  threatSummary: z
    .string()
    .describe('A summary of threat intelligence data for the given IP address.'),
});
export type GenerateReportRecommendationsInput = z.infer<
  typeof GenerateReportRecommendationsInputSchema
>;

const GenerateReportRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of security recommendations to mitigate potential threats.'
    ),
});
export type GenerateReportRecommendationsOutput = z.infer<
  typeof GenerateReportRecommendationsOutputSchema
>;

export async function generateReportRecommendations(
  input: GenerateReportRecommendationsInput
): Promise<GenerateReportRecommendationsOutput> {
  return generateReportRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportRecommendationsPrompt',
  input: {schema: GenerateReportRecommendationsInputSchema},
  output: {schema: GenerateReportRecommendationsOutputSchema},
  prompt: `Based on the following threat summary:\n\n{{threatSummary}}\n\ngenerate a list of security recommendations to mitigate potential threats. These should include specific and actionable steps, such as firewall rules, blocking strategies, and monitoring activities.\n\nReturn the result in a single string.`,
});

const generateReportRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateReportRecommendationsFlow',
    inputSchema: GenerateReportRecommendationsInputSchema,
    outputSchema: GenerateReportRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
