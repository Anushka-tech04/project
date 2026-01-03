import type { SummarizeThreatDataOutput } from '@/ai/flows/summarize-threat-data';

export interface IpInfo {
  query: string;
  status: 'success' | 'fail';
  country: string;
  regionName: string;
  city: string;
  lat: number;
  lon: number;
  isp: string;
  org: string;
  as: string;
  proxy: boolean;
  hosting: boolean;
}

export type IpLookupResult = {
  ipInfo: IpInfo;
  threatAnalysis: SummarizeThreatDataOutput;
};

export interface MalwareHashInfo {
  query_status: 'ok' | 'hash_not_found';
  data?: {
    attributes: {
      meaningful_name: string | null;
      last_analysis_stats: {
        malicious: number;
        suspicious: number;
        undetected: number;
        harmless: number;
        timeout: number;
      };
      last_analysis_date: number | null;
      first_submission_date: number | null;
      tags: string[] | null;
      type_description: string | null;
      reputation: number;
      md5: string;
      sha1: string;
      sha256: string;
    };
  };
  error?: {
    code: string;
    message: string;
  }
}
