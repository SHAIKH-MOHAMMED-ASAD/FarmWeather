"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WeatherData {
  time: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
  precipitation: number;
}

export function HourlyWeatherForecast() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useCelsius, setUseCelsius] = useState(true);
  const [useKmh, setUseKmh] = useState(true);

  useEffect(() => {
    // Simulated weather data - replace with actual API call
    const mockData: WeatherData[] = Array.from({ length: 16 }, (_, i) => ({
      time: new Date(Date.now() + i * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: 20 + Math.random() * 10,
      windSpeed: 5 + Math.random() * 15,
      humidity: 40 + Math.random() * 30,
      precipitation: Math.random() * 100,
    }));
    
    setWeatherData(mockData);
    setIsLoading(false);
  }, []);

  const convertTemperature = (temp: number) => {
    return useCelsius ? temp : (temp * 9/5) + 32;
  };

  const convertWindSpeed = (speed: number) => {
    return useKmh ? speed : speed * 0.621371;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-48">Loading weather data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="temperature-unit"
              checked={useCelsius}
              onCheckedChange={setUseCelsius}
            />
            <Label htmlFor="temperature-unit">
              {useCelsius ? "°C" : "°F"}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="wind-speed-unit"
              checked={useKmh}
              onCheckedChange={setUseKmh}
            />
            <Label htmlFor="wind-speed-unit">
              {useKmh ? "km/h" : "mph"}
            </Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {weatherData.map((data, index) => (
          <Card key={index} className="p-4 text-center">
            <div className="text-sm font-medium">{data.time}</div>
            <div className="text-2xl font-bold mt-2">
              {convertTemperature(data.temperature).toFixed(1)}°{useCelsius ? "C" : "F"}
            </div>
            <div className="text-sm mt-2">
              Wind: {convertWindSpeed(data.windSpeed).toFixed(1)} {useKmh ? "km/h" : "mph"}
            </div>
            <div className="text-sm">
              Humidity: {data.humidity.toFixed(0)}%
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default HourlyWeatherForecast; 