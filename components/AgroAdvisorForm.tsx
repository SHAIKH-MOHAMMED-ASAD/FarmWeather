import React, { useState } from 'react';

interface AgroData {
  location_name: string;
  lat: number;
  lon: number;
  climate_summary: string;
  soil_type: string;
  soil_ph: number;
  organic_matter: string;
  season: string;
  rainfall_forecast: string;
  water_source: string;
  equipment: string;
  labor_availability: string;
}

interface AgroAdvisorFormProps {
  onSubmit: (data: AgroData) => void;
}

export function AgroAdvisorForm({ onSubmit }: AgroAdvisorFormProps) {
  const [formData, setFormData] = useState<AgroData>({
    location_name: '',
    lat: 0,
    lon: 0,
    climate_summary: '',
    soil_type: '',
    soil_ph: 6.5,
    organic_matter: 'moderate',
    season: '',
    rainfall_forecast: '',
    water_source: '',
    equipment: '',
    labor_availability: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lat' || name === 'lon' || name === 'soil_ph' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Farm Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Location Name</label>
          <input
            type="text"
            name="location_name"
            value={formData.location_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="number"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              step="0.0001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="number"
              name="lon"
              value={formData.lon}
              onChange={handleChange}
              step="0.0001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Climate Summary</label>
          <textarea
            name="climate_summary"
            value={formData.climate_summary}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Soil Type</label>
          <select
            name="soil_type"
            value={formData.soil_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select soil type</option>
            <option value="Sandy">Sandy</option>
            <option value="Loamy">Loamy</option>
            <option value="Clay">Clay</option>
            <option value="Silt">Silt</option>
            <option value="Peaty">Peaty</option>
            <option value="Chalky">Chalky</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Soil pH</label>
          <input
            type="number"
            name="soil_ph"
            value={formData.soil_ph}
            onChange={handleChange}
            min="0"
            max="14"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Organic Matter</label>
          <select
            name="organic_matter"
            value={formData.organic_matter}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Season</label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select season</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Autumn">Autumn</option>
            <option value="Winter">Winter</option>
            <option value="Monsoon">Monsoon</option>
            <option value="Dry">Dry</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Rainfall Forecast</label>
          <input
            type="text"
            name="rainfall_forecast"
            value={formData.rainfall_forecast}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Above average rainfall expected"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Water Source</label>
          <select
            name="water_source"
            value={formData.water_source}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select water source</option>
            <option value="rainfall">Rainfall</option>
            <option value="well">Well</option>
            <option value="river">River</option>
            <option value="irrigation">Irrigation System</option>
            <option value="mixed">Mixed Sources</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Equipment</label>
          <select
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select equipment level</option>
            <option value="Basic farming equipment">Basic farming equipment</option>
            <option value="Intermediate equipment">Intermediate equipment</option>
            <option value="Advanced equipment">Advanced equipment</option>
            <option value="Full mechanization">Full mechanization</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Labor Availability</label>
          <select
            name="labor_availability"
            value={formData.labor_availability}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select labor availability</option>
            <option value="Limited">Limited</option>
            <option value="Moderate">Moderate</option>
            <option value="Adequate">Adequate</option>
            <option value="Abundant">Abundant</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generate Advisory
        </button>
      </div>
    </form>
  );
} 