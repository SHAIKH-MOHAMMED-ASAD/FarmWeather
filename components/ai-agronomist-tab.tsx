import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, RefreshCcw, Leaf } from "lucide-react";

export function AIAgronomistTab() {
  return (
    <div className="py-6">
      {/* AI Agronomist Header */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-6 w-6" />
            <h2 className="text-xl font-bold">AI Agronomist Advisor</h2>
          </div>
          <p className="text-sm text-gray-400">Get detailed crop recommendations tailored to your specific farming conditions</p>
        </CardContent>
      </Card>

      {/* Enter Farming Details Form */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Enter Your Farming Details</h3>
              <p className="text-sm text-gray-400">Provide information about your location and farming conditions to receive tailored recommendations.</p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCcw size={14} />
              Auto-Fetch All Data
            </Button>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <div>
                <h4 className="font-semibold">Your detected location: Mumbai, Maharashtra</h4>
                <p className="text-xs text-gray-400">Coordinates: 19.0830, 72.9159</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                defaultValue="Mumbai, Maharashtra"
                className="bg-gray-900 border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Climate</label>
              <div className="relative">
                <select className="w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-700">
                  <option>Tropical</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Soil Type</label>
              <div className="relative">
                <select className="w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-700">
                  <option>Black Cotton</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Soil pH (if known)</label>
              <Input
                defaultValue="7.5"
                className="bg-gray-900 border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Current Season</label>
              <div className="relative">
                <select className="w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-700">
                  <option>Summer</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rainfall Pattern</label>
              <div className="relative">
                <select className="w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-700">
                  <option>High (&gt; 1000mm annually)</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Advisory Report */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">AI Agronomist Advisory Report</h3>
            <div className="flex gap-3">
              <span className="px-2 py-1 bg-green-900/50 rounded text-green-400 text-xs">Auto-Generated</span>
              <span className="px-2 py-1 bg-gray-700 rounded text-gray-300 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                AI Powered
              </span>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <p className="text-sm">
                Based on your location: <span className="font-semibold">Mumbai, Maharashtra</span> •
                Climate: Tropical • Soil: Black Cotton
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4">1. Top Crop Recommendations</h4>

            <div className="bg-gray-800 rounded-lg p-4 mb-3">
              <h5 className="font-semibold mb-1">1. Rice</h5>
              <p className="text-sm">Well-suited to the coastal climate of Mumbai with good monsoon rainfall.</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-3">
              <h5 className="font-semibold mb-1">2. Vegetables (Okra, Brinjal, Tomato)</h5>
              <p className="text-sm">High-value crops for urban and peri-urban farming with strong local market demand.</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-3">
              <h5 className="font-semibold mb-1">3. Pulses (Moong, Urad)</h5>
              <p className="text-sm">Short-duration crops that can be grown between main seasons.</p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4">2. Planting Window</h4>

            <div className="bg-gray-800 rounded-lg p-4 mb-3">
              <p>Rice: June-July (Kharif); Vegetables: Year-round with irrigation; Pulses: October-November after rice harvest.</p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4">3. Soil Preparation & Amendments</h4>

            <div className="bg-gray-800 rounded-lg p-4 mb-3">
              <p className="text-sm">1. Early preparation to allow soil to settle before planting.</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-3">
              <p className="text-sm">2. Avoid working when too wet or too dry to prevent structural damage.</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-3">
              <p className="text-sm">3. Create adequate drainage channels to prevent waterlogging.</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-3">
              <p className="text-sm">4. Apply farm yard manure (8-10 tons/ha) to improve soil structure.</p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4">4. Irrigation Schedule</h4>

            <div className="bg-gray-800 rounded-lg p-4 mb-3">
              <p className="text-sm">1. Focus on drainage rather than irrigation during rainy periods.</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-3">
              <p className="text-sm">2. Prepare supplemental irrigation for dry spells between rain events.</p>
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-6 border-t border-gray-700 pt-4">
            <span className="font-semibold">Note:</span> This advisory is generated by AI based on the information provided. For best results, always consult with local agricultural experts for advice tailored to your specific conditions.<br />
            Generated on: 4/20/2025 at 1:32:14 AM
          </p>
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
