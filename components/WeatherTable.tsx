import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { fetchHourlyWeatherForecast } from '@/lib/apiService';

interface WeatherTableProps {
  useMetric: boolean;
  location?: { lat: number; lon: number } | null;
}

export const WeatherTable: React.FC<WeatherTableProps> = ({ useMetric, location }) => {
  const [forecast, setForecast] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        // Use default location if none provided
        const lat = location?.lat ?? 12.9716;
        const lon = location?.lon ?? 77.5946;
        
        const data = await fetchHourlyWeatherForecast(lat, lon);
        setForecast(data);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableCaption>Hourly weather forecast for the next 16 hours</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Time</TableHead>
            <TableHead>Temperature</TableHead>
            <TableHead>Precipitation</TableHead>
            <TableHead>Wind Speed</TableHead>
            <TableHead>Humidity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forecast.map((hour, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{hour.timestamp}</TableCell>
              <TableCell>
                {useMetric 
                  ? `${hour.temperature_c}°C` 
                  : `${hour.temperature_f}°F`
                }
              </TableCell>
              <TableCell>{hour.precipitation_probability}%</TableCell>
              <TableCell>
                {useMetric 
                  ? `${hour.wind_speed_kmh} km/h` 
                  : `${hour.wind_speed_mph} mph`
                }
              </TableCell>
              <TableCell>{hour.humidity}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Data refreshes hourly
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}; 