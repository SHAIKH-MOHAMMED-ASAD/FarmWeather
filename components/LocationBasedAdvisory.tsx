'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Sprout, Cloud, Droplets } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { reverseGeocode } from '@/lib/geocodingService';
import { fetchAllAgroData } from '../lib/apiService';
import { generateAutomaticAdvisoryReport } from '../lib/agroService';
import ReactMarkdown from 'react-markdown';

interface AdvisorySection {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

const LocationBasedAdvisory: React.FC = () => {
  const { isLoading, position, error, refreshLocation } = useGeolocation();
  const [locationData, setLocationData] = useState<{ city: string; state: string; country: string } | null>(null);
  const [advisoryReport, setAdvisoryReport] = useState<string>('');
  const [advisorySections, setAdvisorySections] = useState<AdvisorySection[]>([]);
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [showFullReport, setShowFullReport] = useState<boolean>(false);

  // Function to fetch location data from coordinates
  const fetchLocationDetails = async (lat: number, lon: number) => {
    try {
      const result = await reverseGeocode(lat, lon);
      setLocationData({
        city: result.city,
        state: result.state,
        country: result.country
      });
      return result;
    } catch (err) {
      console.error('Error fetching location details:', err);
      return null;
    }
  };

  // Parse markdown report to extract sections
  const parseReportSections = (markdown: string): AdvisorySection[] => {
    const sections: AdvisorySection[] = [];
    
    // Extract crop recommendations section
    const cropMatch = markdown.match(/## 1\. Top 3 Crop Recommendations([\s\S]*?)(?=##|$)/);
    if (cropMatch && cropMatch[1]) {
      sections.push({ 
        title: "Crop Recommendations", 
        content: cropMatch[1].trim(),
        icon: <Sprout className="h-4 w-4 mr-2 text-green-500" />
      });
    }
    
    // Extract irrigation plan section
    const irrigationMatch = markdown.match(/## 3\. Irrigation Plan([\s\S]*?)(?=##|$)/);
    if (irrigationMatch && irrigationMatch[1]) {
      sections.push({ 
        title: "Irrigation Advice", 
        content: irrigationMatch[1].trim(),
        icon: <Droplets className="h-4 w-4 mr-2 text-blue-500" />
      });
    }
    
    // Extract weather-related information
    const additionalMatch = markdown.match(/## 6\. Additional Notes([\s\S]*?)(?=##|$)/);
    if (additionalMatch && additionalMatch[1]) {
      sections.push({ 
        title: "Weather & Climate Notes", 
        content: additionalMatch[1].trim(),
        icon: <Cloud className="h-4 w-4 mr-2 text-gray-400" />
      });
    }
    
    // If no sections were found, return default sections
    if (sections.length === 0) {
      return [
        { 
          title: "Crop Recommendations", 
          content: "Based on your soil type and climate conditions, consider planting drought-resistant varieties.",
          icon: <Sprout className="h-4 w-4 mr-2 text-green-500" />
        },
        { 
          title: "Irrigation Advice", 
          content: "Current precipitation levels suggest moderate irrigation needs. Use drip irrigation where possible to conserve water.",
          icon: <Droplets className="h-4 w-4 mr-2 text-blue-500" />
        },
        { 
          title: "Weather Alert", 
          content: "Weather changes expected in the coming days. Monitor conditions for agricultural activities.",
          icon: <Cloud className="h-4 w-4 mr-2 text-gray-400" />
        }
      ];
    }
    
    return sections;
  };

  // Generate agricultural advisory based on location
  const generateAdvisory = async () => {
    if (!position) return;
    
    setReportLoading(true);
    setReportError(null);
    
    try {
      // First get the location details if we don't have them
      if (!locationData) {
        await fetchLocationDetails(position.latitude, position.longitude);
      }
      
      // Fetch agricultural data and generate report
      const agroData = await fetchAllAgroData();
      const report = generateAutomaticAdvisoryReport(agroData);
      setAdvisoryReport(report);
      
      // Parse the report to get sections
      const sections = parseReportSections(report);
      setAdvisorySections(sections);
      setReportLoading(false);
    } catch (err) {
      console.error('Error generating advisory:', err);
      setReportError('Failed to generate agricultural advisory. Please try again later.');
      setReportLoading(false);
    }
  };

  // When position changes, fetch location details and generate advisory
  useEffect(() => {
    if (position) {
      fetchLocationDetails(position.latitude, position.longitude);
      generateAdvisory();
    }
  }, [position]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p>Detecting your location for personalized advisory...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
            Location Error
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-destructive">{error}</p>
            <p className="text-sm text-muted-foreground">
              We need your location to provide a personalized agricultural advisory.
            </p>
            <Button onClick={refreshLocation} variant="outline" size="sm" className="mt-2">
              Allow Location Access
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Location-Based Agricultural Advisory
        </CardTitle>
      </CardHeader>
      <CardContent>
        {locationData && position && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <p>
                Advisory for: <span className="font-medium">{locationData.city}, {locationData.state}, {locationData.country}</span>
              </p>
            </div>
            
            {reportLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p>Generating agricultural advisory...</p>
              </div>
            ) : reportError ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {reportError}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {advisorySections.map((section, index) => (
                    <Card key={index} className="bg-gray-900">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          {section.icon}
                          <h4 className="font-semibold">{section.title}</h4>
                        </div>
                        <p className="text-sm">{section.content.substring(0, 120)}{section.content.length > 120 ? '...' : ''}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button 
                    onClick={generateAdvisory} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    Refresh Advisory
                  </Button>
                  
                  <Button 
                    onClick={() => setShowFullReport(!showFullReport)} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {showFullReport ? 'Hide Full Report' : 'Show Full Report'}
                  </Button>
                </div>
                
                {showFullReport && advisoryReport && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{advisoryReport}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationBasedAdvisory; 