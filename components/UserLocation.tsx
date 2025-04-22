'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, RefreshCw } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { reverseGeocode, LocationResult } from '@/lib/geocodingService';

interface ReverseGeocodingState {
  data: LocationResult | null;
  loading: boolean;
  error: string | null;
}

export function UserLocation() {
  const { isLoading, position, error } = useGeolocation();
  const [locationName, setLocationName] = useState<ReverseGeocodingState>({
    data: null,
    loading: false,
    error: null,
  });

  // Function to fetch location data
  const fetchLocationData = async (lat: number, lon: number) => {
    try {
      setLocationName({
        data: null,
        loading: true,
        error: null,
      });
      
      const result = await reverseGeocode(lat, lon);
      
      setLocationName({
        data: result,
        loading: false,
        error: null,
      });
    } catch (err) {
      setLocationName({
        data: null,
        loading: false,
        error: 'Failed to get location name. Please try again.',
      });
    }
  };

  useEffect(() => {
    if (position) {
      fetchLocationData(position.latitude, position.longitude);
    }
  }, [position]);

  const handleRefreshLocation = () => {
    if (position) {
      fetchLocationData(position.latitude, position.longitude);
    } else {
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p>Detecting your location...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-destructive">{error}</p>
            <Button onClick={handleRefreshLocation} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary" />
          Your Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {position && (
          <div className="space-y-2">
            {locationName.loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p>Getting location details...</p>
              </div>
            ) : locationName.error ? (
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-destructive">{locationName.error}</p>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}
                </p>
              </div>
            ) : (
              <>
                <p className="font-medium">
                  {locationName.data?.formatted || 'Unknown location'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Accuracy: ±{Math.round(position.accuracy)} meters
                </p>
              </>
            )}
            <div className="pt-2">
              <Button 
                onClick={handleRefreshLocation} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
                disabled={locationName.loading}
              >
                <RefreshCw className="h-3 w-3" />
                Refresh Location
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 