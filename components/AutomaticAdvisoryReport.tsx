import React, { useEffect, useState } from 'react';
import { fetchAllAgroData } from '../lib/apiService';
import { generateAutomaticAdvisoryReport, AgroData } from '../lib/agroService';
import ReactMarkdown from 'react-markdown';
import { useGeolocation } from '../hooks/useGeolocation';
import { reverseGeocode } from '../lib/geocodingService';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

const AutomaticAdvisoryReport: React.FC = () => {
  const { isLoading: locationLoading, position, error: locationError, refreshLocation } = useGeolocation();
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [useFallbackLocation, setUseFallbackLocation] = useState<boolean>(false);

  useEffect(() => {
    const generateReport = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Generate report with real location or fallback
        if (position) {
          // Get location name from coordinates
          let locationData = '';
          try {
            const geoData = await reverseGeocode(position.latitude, position.longitude);
            locationData = geoData.formatted;
            setLocationName(locationData);
          } catch (geoErr) {
            console.error('Error getting location name:', geoErr);
            locationData = 'Your Location';
          }
          
          // Get agricultural data using user's actual location
          const agroData: AgroData = await fetchAllAgroData(
            position.latitude,
            position.longitude,
            locationData
          );
          
          const advisoryReport = generateAutomaticAdvisoryReport(agroData);
          setReport(advisoryReport);
        } else if (useFallbackLocation) {
          // Use default location from API service
          const agroData: AgroData = await fetchAllAgroData();
          setLocationName(agroData.location_name);
          const advisoryReport = generateAutomaticAdvisoryReport(agroData);
          setReport(advisoryReport);
        } else {
          setLoading(false);
          return; // Don't proceed if no location and not using fallback
        }
      } catch (err) {
        setError('Failed to generate advisory report. Please try again later.');
        console.error('Error generating report:', err);
      } finally {
        setLoading(false);
      }
    };

    // Generate report when position changes or fallback is selected
    if (position || useFallbackLocation) {
      generateReport();
    } else if (!locationLoading && locationError) {
      setLoading(false);
    }
  }, [position, locationLoading, locationError, useFallbackLocation]);

  // Show loading indicator
  if (locationLoading || loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-600">
          {locationLoading ? "Getting your location..." : "Generating your advisory report..."}
        </p>
      </div>
    );
  }

  // Show location error with options to retry or use default location
  if (locationError && !useFallbackLocation && !position) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-800">
        <div className="flex items-start mb-4">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium mb-2">Location access required</h3>
            <p className="mb-4">{locationError} To get personalized agricultural advice, we need your location.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={refreshLocation}
            className="bg-green-600 hover:bg-green-700"
          >
            Retry Location Access
          </Button>
          <Button 
            onClick={() => setUseFallbackLocation(true)}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Use Demo Location
          </Button>
        </div>
      </div>
    );
  }

  // Show other errors
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <div className="mb-3">{error}</div>
        <Button 
          onClick={() => setUseFallbackLocation(true)}
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50"
        >
          Try Using Demo Location
        </Button>
      </div>
    );
  }

  // If we have no report yet but no error either, this is a state issue
  if (!report && !error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
        <p className="mb-3">Waiting for location data to generate your report.</p>
        <Button 
          onClick={() => setUseFallbackLocation(true)}
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50"
        >
          Use Demo Location Instead
        </Button>
      </div>
    );
  }

  // Show the report
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {locationName && (
        <div className="mb-4 text-green-700 font-medium flex items-center">
          <span className="mr-2">📍</span>
          <span>
            {useFallbackLocation ? 'Demo Location: ' : 'Your Location: '}
            {locationName}
          </span>
        </div>
      )}
      <div className="prose prose-green max-w-none">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>
    </div>
  );
};

export default AutomaticAdvisoryReport; 