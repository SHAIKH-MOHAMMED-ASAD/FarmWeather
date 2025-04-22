'use client';

import { useState } from 'react';
import { AgroAdvisor } from '../../components/AgroAdvisor';
import { AgroAdvisorForm } from '../../components/AgroAdvisorForm';

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

export default function AgroAdvisorPage() {
  const [showForm, setShowForm] = useState(true);
  const [farmData, setFarmData] = useState<AgroData | null>(null);

  const handleFormSubmit = (data: AgroData) => {
    setFarmData(data);
    setShowForm(false);
  };

  const handleReset = () => {
    setShowForm(true);
    setFarmData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Agricultural Advisory System</h1>
        
        {showForm ? (
          <AgroAdvisorForm onSubmit={handleFormSubmit} />
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Enter Different Farm Data
              </button>
            </div>
            {farmData && <AgroAdvisor data={farmData} />}
          </div>
        )}
      </div>
    </div>
  );
} 
