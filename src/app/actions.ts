
'use server';

import { summarizeThreatData } from '@/ai/flows/summarize-threat-data';
import { generateReportRecommendations } from '@/ai/flows/generate-report-recommendations';
import type { IpInfo, IpLookupResult, MalwareHashInfo } from '@/lib/definitions';

export async function lookupIp(
  ip: string
): Promise<{ success: true; data: IpLookupResult } | { success: false; error: string }> {
  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon,isp,org,as,proxy,hosting,query`
    );
    if (!response.ok) {
      // This is a network-level error.
      return { success: false, error: 'Failed to fetch IP information from the API.' };
    }
    const ipInfo: IpInfo = await response.json();

    if (ipInfo.status === 'fail') {
      // This is an API-level error for an invalid query.
      return { success: false, error: 'Invalid IP address or private range.' };
    }

    const threatDataForAI = JSON.stringify({
      isProxy: ipInfo.proxy,
      isHosting: ipInfo.hosting,
      isp: ipInfo.isp,
      organization: ipInfo.org,
      as: ipInfo.as,
    });

    const threatAnalysis = await summarizeThreatData({
      ipAddress: ip,
      threatData: threatDataForAI,
    });

    return { success: true, data: { ipInfo, threatAnalysis } };
  } catch (error) {
    console.error('IP Lookup Error:', error);
    return { success: false, error: 'An unexpected error occurred during IP lookup.' };
  }
}

export async function lookupHash(
  hash: string
): Promise<{ success: true; data: MalwareHashInfo } | { success: false; error: string }> {
  try {
    const formData = new FormData();
    formData.append('query', 'get_info');
    formData.append('hash', hash);

    const response = await fetch('https://mb-api.abuse.ch/api/v1/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch hash information from MalwareBazaar API.' };
    }

    const hashInfo: MalwareHashInfo = await response.json();
    return { success: true, data: hashInfo };
  } catch (error) {
    console.error('Hash Lookup Error:', error);
    return { success: false, error: 'An unexpected error occurred during hash lookup.' };
  }
}

export async function getRecommendations(
  threatSummary: string
): Promise<{ success: true; data: string } | { success: false; error: string }> {
  try {
    const result = await generateReportRecommendations({ threatSummary });
    return { success: true, data: result.recommendations };
  } catch (error) {
    console.error('Recommendation Generation Error:', error);
    return { success: false, error: 'Failed to generate recommendations.' };
  }
}
