'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { UserLocation } from '@/components/UserLocation';
import EnhancedWeatherForecast from '@/components/EnhancedWeatherForecast';
import CropAdvisoryAssistant from '@/components/CropAdvisoryAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGeolocation } from '@/hooks/useGeolocation';

export default function AgricultureDashboard() {
  const { position, isLoading } = useGeolocation();
  const [activeTab, setActiveTab] = useState('weather');
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-2">Agriculture Dashboard</h1>
        <p className="text-gray-400 mb-6">
          Complete agricultural intelligence and crop advisory based on your location's environmental conditions
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <UserLocation />
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Environmental Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading environmental data...</p>
                ) : !position ? (
                  <p className="text-sm text-muted-foreground">Enable location access to view environmental data</p>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Coordinates</p>
                      <p>{position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Accuracy</p>
                      <p>±{Math.round(position.accuracy)} meters</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="lg:hidden">
              <CropAdvisoryAssistant />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="weather" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 h-auto p-1 mb-6">
                <TabsTrigger value="weather" className="py-2">
                  Weather Forecast
                </TabsTrigger>
                <TabsTrigger value="crops" className="py-2">
                  Crop Advisory
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="weather" className="mt-0">
                {position && (
                  <EnhancedWeatherForecast
                    latitude={position.latitude}
                    longitude={position.longitude}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="crops" className="mt-0">
                <div className="hidden lg:block">
                  <CropAdvisoryAssistant />
                </div>
                <div className="lg:hidden">
                  <Card className="p-6">
                    <p className="text-center">
                      Please use the Crop Advisory Assistant at the bottom of the page on small screens.
                    </p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
} 
