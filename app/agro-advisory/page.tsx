'use client';

import { Header } from '@/components/header';
import LocationBasedAdvisory from '@/components/LocationBasedAdvisory';

export default function AgroAdvisoryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Location-Based Agricultural Advisory</h1>
        <p className="text-gray-400 mb-6">
          Get personalized agricultural recommendations based on your current location, local weather patterns, and soil conditions.
        </p>
        
        <div className="grid grid-cols-1 gap-6">
          <LocationBasedAdvisory />
          
          <div className="p-4 bg-muted rounded-lg">
            <h2 className="text-lg font-medium mb-2">About Location-Based Advisory</h2>
            <p className="text-sm text-muted-foreground">
              This feature uses your device's GPS location to provide customized agricultural recommendations.
              Your location data is only used to generate the advisory and is not stored on our servers.
              The recommendations consider local climate patterns, soil types, and weather forecasts
              to suggest optimal crops, irrigation practices, and farming techniques for your specific area.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 
