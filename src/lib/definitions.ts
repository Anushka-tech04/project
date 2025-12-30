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
  query_status: 'ok' | 'hash_not_found' | 'no_results' | 'illegal_hash';
  data?: Array<{
    sha256_hash: string;
    sha1_hash: string;
    md5_hash: string;
    first_seen: string | null;
    last_seen: string | null;
    signature: string | null;
    tags: string[] | null;
    threat_type: string | null;
    file_type: string | null;
    reporter: string;
  }>;
}
