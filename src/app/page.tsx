import { Header } from '@/components/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IpLookup } from '@/components/ip-lookup';
import { MalwareHashLookup } from '@/components/malware-hash-lookup';
import { MapPin, Hash } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your Proactive Security Partner
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Leverage real-time threat intelligence to analyze IP addresses and
              malware hashes.
            </p>
          </div>
          <Tabs defaultValue="ip-lookup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ip-lookup">
                <MapPin className="mr-2 h-4 w-4" />
                IP Lookup
              </TabsTrigger>
              <TabsTrigger value="malware-hash-lookup">
                <Hash className="mr-2 h-4 w-4" />
                Malware Hash Lookup
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ip-lookup" className="mt-6">
              <IpLookup />
            </TabsContent>
            <TabsContent value="malware-hash-lookup" className="mt-6">
              <MalwareHashLookup />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
