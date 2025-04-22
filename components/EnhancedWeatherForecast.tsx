'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Cloud, CloudDrizzle, CloudRain, CloudSnow, Sun, Thermometer, Wind, Droplets } from 'lucide-react';
import { fetchHourlyWeatherForecast } from '@/lib/apiService';

interface WeatherPoint {
  timestamp: string;
  temperature_c: number;
  temperature_f: number;
  precipitation_probability: number;
  wind_speed_kmh: number;
  wind_speed_mph: number;
  humidity: number;
  condition?: string;
}

const getWeatherIcon = (precipitation: number, timestamp: string) => {
  const hour = parseInt(timestamp.split(':')[0], 10);
  const isNight = hour < 6 || hour > 18;
  
  if (precipitation >= 70) return <CloudRain className="h-5 w-5 text-blue-500" />;
  if (precipitation >= 30) return <CloudDrizzle className="h-5 w-5 text-blue-300" />;
  if (precipitation >= 10) return <Cloud className="h-5 w-5 text-gray-400" />;
  return isNight ? <Cloud className="h-5 w-5 text-gray-600" /> : <Sun className="h-5 w-5 text-yellow-400" />;
};

const getWeatherCondition = (precipitation: number, timestamp: string) => {
  const hour = parseInt(timestamp.split(':')[0], 10);
  const isNight = hour < 6 || hour > 18;
  
  if (precipitation >= 70) return "Heavy Rain";
  if (precipitation >= 30) return "Light Rain";
  if (precipitation >= 10) return "Cloudy";
  return isNight ? "Clear Night" : "Sunny";
};

const EnhancedWeatherForecast: React.FC<{ latitude: number; longitude: number }> = ({ latitude, longitude }) => {
  const [weatherData, setWeatherData] = useState<WeatherPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useCelsius, setUseCelsius] = useState<boolean>(true);
  const [useKmh, setUseKmh] = useState<boolean>(true);
  
  // Function to fetch weather data
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchHourlyWeatherForecast(latitude, longitude);
      
      // Add condition to each weather point
      const enhancedData = data.map(point => ({
        ...point,
        condition: getWeatherCondition(point.precipitation_probability, point.timestamp)
      }));
      
      setWeatherData(enhancedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to fetch weather forecast. Please try again later.");
      setLoading(false);
    }
  };
  
  // Generate a farming activity tip based on the weather data
  const generateFarmingTip = (data: WeatherPoint[]): string => {
    if (!data || data.length === 0) return "";
    
    // Check for upcoming rain
    const upcomingRain = data
      .filter((_, index) => index >= 4) // Current hour and future
      .findIndex(point => point.precipitation_probability >= 50);
    
    if (upcomingRain > -1 && upcomingRain < 4) {
      const rainTime = data[upcomingRain + 4].timestamp;
      return `Caution: Rain expected around ${rainTime}. Consider completing field work soon.`;
    }
    
    // Check for high winds
    const highWinds = data
      .filter((_, index) => index >= 4) // Current hour and future
      .some(point => (useKmh ? point.wind_speed_kmh > 20 : point.wind_speed_mph > 12));
    
    if (highWinds) {
      return "High winds expected. Delay spraying operations and secure loose equipment.";
    }
    
    // Check for ideal planting conditions
    const idealPlanting = data
      .filter((_, index) => index >= 4) // Current hour and future
      .every(point => 
        point.precipitation_probability < 30 && 
        (useKmh ? point.wind_speed_kmh < 15 : point.wind_speed_mph < 10) &&
        ((useCelsius && point.temperature_c > 15 && point.temperature_c < 30) || 
         (!useCelsius && point.temperature_f > 60 && point.temperature_f < 86))
      );
    
    if (idealPlanting) {
      return "Ideal conditions for planting, transplanting, or field work.";
    }
    
    // Default tip
    const averageTemp = data.reduce((sum, point) => sum + (useCelsius ? point.temperature_c : point.temperature_f), 0) / data.length;
    if ((useCelsius && averageTemp > 30) || (!useCelsius && averageTemp > 86)) {
      return "Hot conditions expected. Ensure adequate hydration for workers and consider irrigation.";
    } else if ((useCelsius && averageTemp < 10) || (!useCelsius && averageTemp < 50)) {
      return "Cool conditions expected. Monitor sensitive crops for frost if temperatures drop further.";
    }
    
    return "Moderate weather conditions. Good for general farm activities.";
  };
  
  // Load data on component mount or when coordinates change
  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData();
    }
  }, [latitude, longitude]);
  
  // Get now index (should be 4, as we have 4 past hours)
  const nowIndex = 4;
  
  // Get the farming tip
  const farmingTip = generateFarmingTip(weatherData);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
            <p>Loading weather forecast...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchWeatherData} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-card mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Cloud className="h-5 w-5 mr-2 text-primary" />
            16-Hour Weather Forecast
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm">°F</span>
              <Switch checked={useCelsius} onCheckedChange={setUseCelsius} />
              <span className="text-sm">°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">mph</span>
              <Switch checked={useKmh} onCheckedChange={setUseKmh} />
              <span className="text-sm">km/h</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Temp</TableHead>
                <TableHead>Precip.</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Wind</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weatherData.map((point, i) => (
                <TableRow key={i} className={i === nowIndex ? "bg-primary/10" : ""}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {i === nowIndex ? "Now" : point.timestamp}
                    {i === nowIndex && <span className="ml-2 text-xs text-primary">(Current)</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getWeatherIcon(point.precipitation_probability, point.timestamp)}
                      <span className="ml-2">{point.condition}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {useCelsius ? `${point.temperature_c}°C` : `${point.temperature_f}°F`}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, point.precipitation_probability)}%` }}
                        ></div>
                      </div>
                      {point.precipitation_probability}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                      {point.humidity}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Wind className="h-4 w-4 mr-1 text-gray-500" />
                      {useKmh ? `${point.wind_speed_kmh} km/h` : `${point.wind_speed_mph} mph`}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Weather Charts - Simplified for example */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-red-400" />
              Temperature Trend
            </h3>
            <div className="h-32 flex items-end space-x-1">
              {weatherData.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full ${i === nowIndex ? 'bg-primary' : 'bg-gray-600'}`} 
                    style={{ 
                      height: `${(useCelsius ? point.temperature_c : (point.temperature_f - 32) / 1.8) * 2}px`,
                      maxHeight: '100%',
                      minHeight: '4px'
                    }}
                  ></div>
                  <span className="text-xs mt-1 text-gray-400">
                    {point.timestamp.split(':')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <CloudRain className="h-4 w-4 mr-2 text-blue-400" />
              Precipitation Probability
            </h3>
            <div className="h-32 flex items-end space-x-1">
              {weatherData.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full ${i === nowIndex ? 'bg-primary' : 'bg-blue-600'}`} 
                    style={{ 
                      height: `${point.precipitation_probability * 0.3}px`,
                      maxHeight: '100%',
                      minHeight: '4px'
                    }}
                  ></div>
                  <span className="text-xs mt-1 text-gray-400">
                    {point.timestamp.split(':')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Farming Tip */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
              <span className="text-xs text-black font-bold">!</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Farming Activity Tip</h3>
              <p className="text-sm text-gray-300">{farmingTip}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedWeatherForecast; 