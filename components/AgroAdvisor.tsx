import React from 'react';
import { 
  generateAgroRecommendations, 
  getSoilPreparationTips,
  getIrrigationPlan,
  getPestManagementTips,
  getSustainabilityTips
} from '../lib/agroService';

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

interface AgroAdvisorProps {
  data: AgroData;
}

export function AgroAdvisor({ data }: AgroAdvisorProps) {
  const recommendations = generateAgroRecommendations(data);
  const soilPreparationTips = getSoilPreparationTips(data);
  const irrigationPlan = getIrrigationPlan(data);
  const pestManagementTips = getPestManagementTips(data);
  const sustainabilityTips = getSustainabilityTips(data);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Agricultural Advisory Report</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Location Information</h2>
        <p><strong>Location:</strong> {data.location_name}</p>
        <p><strong>Coordinates:</strong> {data.lat}, {data.lon}</p>
        <p><strong>Climate:</strong> {data.climate_summary}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Soil Profile</h2>
        <p><strong>Type:</strong> {data.soil_type}</p>
        <p><strong>pH:</strong> {data.soil_ph}</p>
        <p><strong>Organic Matter:</strong> {data.organic_matter}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Crops</h2>
        {recommendations.map((crop, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold">{crop.name}</h3>
            <p><strong>Rationale:</strong> {crop.rationale}</p>
            <p><strong>Planting Window:</strong> {crop.plantingWindow}</p>
            <p><strong>Expected Yield:</strong> {crop.expectedYield}</p>
            <p><strong>Market Timing:</strong> {crop.marketTiming}</p>
            <p><strong>Soil Preparation:</strong> {crop.soilPreparation}</p>
            <p><strong>Irrigation Plan:</strong> {crop.irrigationPlan}</p>
            <p><strong>Pest Management:</strong> {crop.pestManagement}</p>
            <p><strong>Sustainability Tips:</strong> {crop.sustainabilityTips}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Soil Preparation & Amendments</h2>
        <ul className="list-disc pl-5">
          {soilPreparationTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Irrigation Plan</h2>
        <p>{irrigationPlan}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pest & Disease Management</h2>
        <ul className="list-disc pl-5">
          {pestManagementTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sustainability Recommendations</h2>
        <ul className="list-disc pl-5">
          {sustainabilityTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Resources Available</h2>
        <p><strong>Water Source:</strong> {data.water_source}</p>
        <p><strong>Equipment:</strong> {data.equipment}</p>
        <p><strong>Labor Availability:</strong> {data.labor_availability}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Seasonal Information</h2>
        <p><strong>Current Season:</strong> {data.season}</p>
        <p><strong>Rainfall Forecast:</strong> {data.rainfall_forecast}</p>
      </div>
    </div>
  );
} 