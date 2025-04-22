import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Cloud, Droplets, Wind, AlertTriangle, CloudRain } from "lucide-react";
import HourlyWeatherForecast from "./HourlyWeatherForecast";
import { UserLocation } from "./UserLocation";
import LocationBasedAdvisory from "./LocationBasedAdvisory";

export function WeatherTab() {
  return (
    <div className="py-6">
      {/* FarmWeather Header Section */}
      <div className="farm-weather-card mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">FarmWeather</h2>
            <p className="text-sm text-muted-foreground">
              Empowering farmers with weather intelligence and crop advisory
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <UserLocation />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <Button variant="outline" size="sm" className="flex gap-2 items-center">
            <span className="inline-block w-5 h-5 flex items-center justify-center">🌱</span> Crop Insights
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2 items-center">
            <Cloud size={16} /> Weather Forecasts
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2 items-center">
            <Droplets size={16} /> Irrigation Advice
          </Button>
        </div>
      </div>

      {/* Location-based Advisory */}
      <LocationBasedAdvisory />

      {/* 16-Hour Weather Forecast */}
      <HourlyWeatherForecast />

      {/* Current Weather Section */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Mumbai, India</h2>
                <p className="text-sm text-gray-400">Sunday, April 20, 2025</p>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <CloudRain size={42} className="mr-2" />
                <div>
                  <div className="text-3xl font-bold">28°C</div>
                  <div className="text-sm font-semibold text-right">Heavy Rain</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800">
                <CardContent className="p-4 flex flex-col items-center">
                  <Droplets className="mb-2 mt-2 text-blue-400" size={32} />
                  <div className="text-gray-400 text-sm">Humidity</div>
                  <div className="text-xl font-bold">68%</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800">
                <CardContent className="p-4 flex flex-col items-center">
                  <CloudRain className="mb-2 mt-2 text-blue-400" size={32} />
                  <div className="text-gray-400 text-sm">Rainfall</div>
                  <div className="text-xl font-bold">9 mm</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800">
                <CardContent className="p-4 flex flex-col items-center">
                  <Wind className="mb-2 mt-2 text-blue-400" size={32} />
                  <div className="text-gray-400 text-sm">Wind</div>
                  <div className="text-xl font-bold">16 km/h</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <p className="text-sm">Ideal for field inspection and light farm work</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-red-500" />
            <h3 className="text-lg font-bold text-red-500">Weather Alerts for Farmers</h3>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2">Weather Alert - Moderate</h4>
            <p className="text-sm text-gray-300">
              Weather changes expected in the coming days. Monitor conditions for agricultural activities.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 7 Day Forecast */}
      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Cloud size={20} />
            <h3 className="text-lg font-bold">7-Day Weather Forecast</h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>High</TableHead>
                <TableHead>Low</TableHead>
                <TableHead>Rainfall</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Wind</TableHead>
                <TableHead>Farming Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Today</TableCell>
                <TableCell>Sunny</TableCell>
                <TableCell>28°C</TableCell>
                <TableCell>22°C</TableCell>
                <TableCell>0 mm</TableCell>
                <TableCell>65%</TableCell>
                <TableCell>12 km/h</TableCell>
                <TableCell>Ideal for harvesting and field work</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tomorrow</TableCell>
                <TableCell>Partly Cloudy</TableCell>
                <TableCell>29°C</TableCell>
                <TableCell>23°C</TableCell>
                <TableCell>0 mm</TableCell>
                <TableCell>70%</TableCell>
                <TableCell>10 km/h</TableCell>
                <TableCell>Good for planting and fertilizing</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Wednesday</TableCell>
                <TableCell>Cloudy</TableCell>
                <TableCell>30°C</TableCell>
                <TableCell>24°C</TableCell>
                <TableCell>20 mm</TableCell>
                <TableCell>75%</TableCell>
                <TableCell>8 km/h</TableCell>
                <TableCell>Avoid field work; check drainage</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Thursday</TableCell>
                <TableCell>Rain</TableCell>
                <TableCell>27°C</TableCell>
                <TableCell>22°C</TableCell>
                <TableCell>40 mm</TableCell>
                <TableCell>80%</TableCell>
                <TableCell>15 km/h</TableCell>
                <TableCell>Avoid field work; check drainage</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Friday</TableCell>
                <TableCell>Rain</TableCell>
                <TableCell>26°C</TableCell>
                <TableCell>21°C</TableCell>
                <TableCell>30 mm</TableCell>
                <TableCell>85%</TableCell>
                <TableCell>12 km/h</TableCell>
                <TableCell>Avoid field work; check drainage</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <p className="text-sm">This forecast is optimized for agricultural planning. Use it to schedule your farming activities.</p>
          </div>
        </CardContent>
      </Card>

      {/* Farmer's Assistant floating button */}
      <div className="fixed bottom-4 right-4">
        <Button className="rounded-full px-4 py-2 flex items-center gap-2">
          Farmer&apos;s Assistant
          <span className="ml-1">↗</span>
        </Button>
      </div>
    </div>
  );
}
