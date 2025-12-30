'use client';

import { useState } from 'react';
import { Globe, Network, MapPin, Building, Server, Loader2, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import type { IpLookupResult } from '@/lib/definitions';
import { getRecommendations } from '@/app/actions';

type ReportDisplayProps = {
  result: IpLookupResult;
};

const getRiskBadgeVariant = (riskLevel: string): 'default' | 'secondary' | 'destructive' => {
  const level = riskLevel.toLowerCase();
  if (level.includes('high') || level.includes('critical')) {
    return 'destructive';
  }
  if (level.includes('medium')) {
    return 'secondary';
  }
  return 'default';
};

export function ReportDisplay({ result }: ReportDisplayProps) {
  const { ipInfo, threatAnalysis } = result;
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isRecLoading, setIsRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    setIsRecLoading(true);
    setRecError(null);
    setRecommendations(null);
    const response = await getRecommendations(threatAnalysis.summary);
    if (response.success) {
      setRecommendations(response.data);
    } else {
      setRecError(response.error);
    }
    setIsRecLoading(false);
  };

  return (
    <div className="animate-in fade-in-50 duration-500 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold font-headline">
          Report for <span className="font-code text-primary">{ipInfo.query}</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Overall Risk Level:</span>
          <Badge variant={getRiskBadgeVariant(threatAnalysis.riskLevel)}>
            {threatAnalysis.riskLevel}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Geolocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {ipInfo.city}, {ipInfo.regionName}, {ipInfo.country}</p>
            <p className="font-code text-muted-foreground">Lat: {ipInfo.lat}, Lon: {ipInfo.lon}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5 text-primary" /> Network Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground" /> <strong>ISP:</strong> {ipInfo.isp}</p>
            <p className="flex items-center gap-2"><Server className="h-4 w-4 text-muted-foreground" /> <strong>AS:</strong> {ipInfo.as} ({ipInfo.org})</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Threat Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Summary</h4>
            <p className="text-muted-foreground">{threatAnalysis.summary}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Justification</h4>
            <p className="text-muted-foreground">{threatAnalysis.justification}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Flags</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant={ipInfo.proxy ? 'destructive' : 'secondary'}>Proxy: {ipInfo.proxy ? 'Yes' : 'No'}</Badge>
              <Badge variant={ipInfo.hosting ? 'destructive' : 'secondary'}>Hosting: {ipInfo.hosting ? 'Yes' : 'No'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary"/> Mitigation Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
            {!recommendations && !isRecLoading && !recError &&(
                <div className="text-center p-4 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">Generate AI-powered recommendations to mitigate potential threats.</p>
                    <Button onClick={handleGetRecommendations} disabled={isRecLoading}>
                        {isRecLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Recommendations
                    </Button>
                </div>
            )}
            
            {isRecLoading && (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            )}

            {recError && (
                 <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{recError}</AlertDescription>
                </Alert>
            )}

            {recommendations && (
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                    {recommendations}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
