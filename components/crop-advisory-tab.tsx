import { MapPin, Sparkles, Sprout, ChevronDown, CheckIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { reverseGeocode } from "@/lib/geocodingService";

// Types for recommendations
interface CropRecommendation {
  name: string;
  stage: string;
  advice: string;
  irrigation: string;
  pestControl: string;
  fertilizer: string;
  details: {
    growingSeason: string;
    waterRequirements: string;
    soilTypes: string;
    varieties: string;
    cropDuration: string;
  };
}

// Expanded crop information
const CROP_RECOMMENDATIONS: Record<string, CropRecommendation> = {
  "rice": {
    name: "Rice",
    stage: "Vegetative Growth",
    advice: "Maintain water level in paddy fields. Monitor for leaf folder infestation.",
    irrigation: "Maintain 2-3 cm water level in the field. Drain water 7-10 days before harvesting.",
    pestControl: "Scout for stem borer, leaf folder and blast. Apply neem-based pesticides if infestation exceeds threshold.",
    fertilizer: "Top dress with urea after 21 days of transplanting. Apply second dose during panicle initiation.",
    details: {
      growingSeason: "Kharif (June-November), Rabi (November-May) in irrigated areas",
      waterRequirements: "1200-1800 mm throughout season",
      soilTypes: "Clayey or loamy soil with good water retention",
      varieties: "Basmati, IR-36, IR-64, Swarna, HMT",
      cropDuration: "120-150 days depending on variety"
    }
  },
  "wheat": {
    name: "Wheat",
    stage: "Sowing",
    advice: "Ideal time for sowing wheat in northern regions. Ensure soil moisture is adequate before sowing.",
    irrigation: "Light irrigation recommended before sowing. Critical irrigation at crown root initiation, tillering, jointing, flowering and grain filling stages.",
    pestControl: "Monitor for aphids, rust and powdery mildew. Use resistant varieties and timely fungicide application if necessary.",
    fertilizer: "Apply base fertilizer with NPK ratio 15:15:15 before sowing. Top dress with nitrogen at tillering and jointing stages.",
    details: {
      growingSeason: "Rabi season (November-April)",
      waterRequirements: "450-650 mm throughout season",
      soilTypes: "Well-drained loam or clay loam soils",
      varieties: "HD-2967, PBW-343, WH-542, GW-273",
      cropDuration: "120-140 days"
    }
  },
  "corn": {
    name: "Corn",
    stage: "Land Preparation",
    advice: "Begin land preparation for corn planting. Choose hybrid varieties suitable for your region.",
    irrigation: "Ensure adequate soil moisture for germination after planting. Critical irrigation at knee-high, tasseling, silking and grain filling stages.",
    pestControl: "Treat seeds with appropriate fungicides before planting. Monitor for fall armyworm and stem borer.",
    fertilizer: "Apply basal NPK fertilizer during final land preparation. Top dress with nitrogen at knee-high stage.",
    details: {
      growingSeason: "Kharif (June-October), Spring (January-May)",
      waterRequirements: "500-800 mm throughout season",
      soilTypes: "Well-drained sandy loam to clay loam",
      varieties: "Hybrid varieties - DMH-849, NK-6240, P-3396",
      cropDuration: "95-110 days for most varieties"
    }
  },
  "cotton": {
    name: "Cotton",
    stage: "Planning",
    advice: "Cotton cultivation in West India requires warm conditions. The current weather is acceptable for cotton.",
    irrigation: "Critical irrigation periods include flowering and boll development stages. Avoid water stress during square formation and flowering.",
    pestControl: "Implement IPM strategies for bollworm control. Consider Bt cotton varieties. Monitor for whitefly and pink bollworm.",
    fertilizer: "Apply phosphorus and potassium before planting. Split nitrogen application throughout growing season at 30, 60, 90 days after sowing.",
    details: {
      growingSeason: "April-May to October-November",
      waterRequirements: "700-1300 mm throughout season",
      soilTypes: "Deep black cotton soils (vertisols) or well-drained alluvial soils",
      varieties: "Bt cotton hybrids - Bollgard II, JK-Durga, Bunny",
      cropDuration: "160-180 days for most varieties"
    }
  },
  "chickpea": {
    name: "Chickpea (Gram)",
    stage: "Planning",
    advice: "Consider local conditions before planting Chickpea. Western regions may face water scarcity, consider drought-resistant varieties.",
    irrigation: "Maintain adequate soil moisture. Critical irrigation at flowering and pod development stages if needed.",
    pestControl: "Regular monitoring for pod borer (Helicoverpa). Use pheromone traps and timely insecticide sprays if needed.",
    fertilizer: "Apply balanced NPK fertilizer at sowing. Being leguminous, it fixes nitrogen in soil.",
    details: {
      growingSeason: "Rabi (October-November to March-April)",
      waterRequirements: "350-450 mm throughout season",
      soilTypes: "Well-drained loam or sandy loam soils with neutral pH",
      varieties: "Desi types: JG-11, JAKI-9218; Kabuli types: KAK-2, Vihar",
      cropDuration: "95-105 days for most varieties"
    }
  }
};

// Dropdown options
const CROP_OPTIONS = [
  "Wheat", "Rice", "Corn (Maize)", "Cotton", "Sugarcane", 
  "Potato", "Soybean", "Chickpea (Gram)", "Mustard", "Groundnut"
];

const SOIL_TYPES = [
  "Clay", "Sandy", "Loamy", "Silty", "Peaty", "Chalky", "Black Cotton"
];

const REGIONS = [
  "North India", "South India", "East India", "West India", "Central India", "Northeast India"
];

const WEATHER_CONDITIONS = [
  "Normal", "Drought", "Heavy Rainfall", "Humid", "Dry", "Warm", "Cold"
];

// Frequently used crops for General Recommendations section
const GENERAL_CROP_RECOMMENDATIONS = [
  {
    name: "Paddy Rice",
    season: "Kharif (Monsoon)",
    advice: "Ensure proper water management. Maintain 2-3 cm water level in fields.",
    cultivation: "Transplanting method is common. Use 15-20 day old seedlings for transplanting."
  },
  {
    name: "Wheat",
    season: "Rabi (Winter)",
    advice: "Timely sowing is crucial for good yield. Optimal sowing time is first half of November.",
    cultivation: "Line sowing at 22.5 cm row spacing is recommended for better yields."
  },
  {
    name: "Maize/Corn",
    season: "Both Kharif and Rabi",
    advice: "Use hybrid varieties for higher yield. Ensure proper spacing of 60×20 cm.",
    cultivation: "Ridge planting can help with better water management and root development."
  },
  {
    name: "Mustard",
    season: "Rabi (Winter)",
    advice: "Early sowing (October) gives better yields. Avoid late sowing after November.",
    cultivation: "Line sowing at 30-45 cm row spacing is ideal. Thinning after 15-20 days is recommended."
  },
  {
    name: "Pulses (General)",
    season: "Both seasons (crop dependent)",
    advice: "Seed treatment with Rhizobium culture enhances nitrogen fixation and yield.",
    cultivation: "These are good rotation crops that improve soil health and break pest cycles."
  }
];

// Add location-based recommendations data
const LOCATION_BASED_RECOMMENDATIONS: Record<string, any> = {
  "North India": {
    commonCrops: ["Wheat", "Rice", "Sugarcane", "Mustard"],
    commonSoils: ["Alluvial", "Clay Loam", "Sandy Loam"],
    climateSuitability: "Wide temperature variation from cold winters to hot summers. Suitable for wheat, rice rotation.",
    typicalWeather: ["Cold", "Dry", "Warm"]
  },
  "South India": {
    commonCrops: ["Rice", "Coconut", "Spices", "Millets"],
    commonSoils: ["Red", "Laterite", "Black Cotton"],
    climateSuitability: "Tropical climate with hot and humid conditions. Good for plantation crops and multiple rice seasons.",
    typicalWeather: ["Warm", "Humid", "Heavy Rainfall"]
  },
  "East India": {
    commonCrops: ["Rice", "Jute", "Tea", "Maize"],
    commonSoils: ["Alluvial", "Red", "Laterite"],
    climateSuitability: "High rainfall and humidity. Excellent for water-intensive crops like rice and jute.",
    typicalWeather: ["Humid", "Heavy Rainfall", "Warm"]
  },
  "West India": {
    commonCrops: ["Cotton", "Groundnut", "Jowar", "Bajra"],
    commonSoils: ["Black Cotton", "Sandy", "Alluvial"],
    climateSuitability: "Arid to semi-arid conditions. Suitable for drought-resistant crops like millets and pulses.",
    typicalWeather: ["Dry", "Warm"]
  },
  "Central India": {
    commonCrops: ["Soybean", "Cotton", "Pulses", "Wheat"],
    commonSoils: ["Black Cotton", "Medium Black", "Mixed Red and Black"],
    climateSuitability: "Moderate rainfall. Good for commercial crops like soybean and cotton.",
    typicalWeather: ["Normal", "Warm"]
  },
  "Northeast India": {
    commonCrops: ["Rice", "Tea", "Bamboo", "Citrus Fruits"],
    commonSoils: ["Acidic", "Red", "Alluvial"],
    climateSuitability: "High rainfall and humidity. Good for tea plantations and horticultural crops.",
    typicalWeather: ["Heavy Rainfall", "Humid"]
  }
};

// Crop-soil suitability mapping
const CROP_SOIL_SUITABILITY: Record<string, string[]> = {
  "Wheat": ["Loamy", "Clay Loam", "Sandy Loam"],
  "Rice": ["Clay", "Clayey Loam", "Black Cotton"],
  "Corn (Maize)": ["Sandy Loam", "Loamy", "Silty"],
  "Cotton": ["Black Cotton", "Loamy", "Clayey"],
  "Sugarcane": ["Loamy", "Sandy Loam", "Clayey Loam"],
  "Potato": ["Sandy Loam", "Loamy", "Silty"],
  "Soybean": ["Loamy", "Clay Loam", "Black Cotton"],
  "Chickpea (Gram)": ["Sandy Loam", "Loamy", "Black Cotton"],
  "Mustard": ["Sandy Loam", "Loamy", "Silty"],
  "Groundnut": ["Sandy", "Sandy Loam", "Red"]
};

// Add dynamic recommendation generation
const generateDynamicRecommendation = (crop: string, soil: string, region: string, weather: string) => {
  // Default to chickpea if no crop is selected
  const cropName = crop === "Select crop" ? "Chickpea (Gram)" : crop;
  
  // Stage recommendations based on crop and weather
  const stages: Record<string, string[]> = {
    "Wheat": ["Planning", "Sowing", "Germination", "Tillering", "Heading", "Ripening"],
    "Rice": ["Planning", "Seedling", "Vegetative", "Reproductive", "Ripening", "Harvesting"],
    "Corn (Maize)": ["Planning", "Seedling", "Vegetative", "Tasseling", "Silking", "Maturity"],
    "Cotton": ["Planning", "Emergence", "Vegetative", "Flowering", "Boll Development", "Maturity"],
    "Sugarcane": ["Planning", "Germination", "Tillering", "Grand Growth", "Maturation", "Harvesting"],
    "Potato": ["Planning", "Sprouting", "Vegetative", "Tuberization", "Maturation", "Harvesting"],
    "Soybean": ["Planning", "Emergence", "Vegetative", "Flowering", "Pod Development", "Maturity"],
    "Chickpea (Gram)": ["Planning", "Germination", "Vegetative", "Flowering", "Pod Formation", "Maturity"],
    "Mustard": ["Planning", "Seedling", "Rosette", "Bolting", "Flowering", "Siliqua Formation"],
    "Groundnut": ["Planning", "Germination", "Pegging", "Pod Development", "Kernel Development", "Maturity"]
  };

  // Weather-appropriate advice based on crop and weather condition
  const adviceByWeather: Record<string, Record<string, string>> = {
    "Normal": {
      default: `Current normal weather conditions are favorable for ${cropName} cultivation in ${region}.`,
      "Rice": `Maintain regular irrigation schedule for ${cropName} under normal conditions in ${region}.`,
      "Wheat": `Normal conditions are ideal for ${cropName} growth in ${region}. Maintain standard cultivation practices.`,
      "Cotton": `Standard cotton management practices are recommended under these normal conditions.`
    },
    "Drought": {
      default: `Consider drought-resistant varieties of ${cropName} for ${region} due to current drought conditions.`,
      "Rice": `Drought conditions require careful water management for ${cropName}. Consider alternate wetting and drying technique.`,
      "Wheat": `Under drought conditions, prioritize limited irrigation at critical growth stages for ${cropName}.`,
      "Sugarcane": `Apply mulching to conserve soil moisture for ${cropName} under current drought conditions in ${region}.`
    },
    "Heavy Rainfall": {
      default: `Ensure proper drainage for ${cropName} fields in ${region} to prevent waterlogging.`,
      "Cotton": `Heavy rainfall may lead to boll rot in cotton. Consider preventative fungicide application.`,
      "Groundnut": `Elevated ridges recommended for ${cropName} to avoid waterlogging in current heavy rainfall.`,
      "Chickpea (Gram)": `${cropName} is susceptible to root rot in excessive moisture. Ensure field drainage.`
    },
    "Humid": {
      default: `Monitor ${cropName} for fungal diseases under current humid conditions in ${region}.`,
      "Wheat": `Increased risk of rust and powdery mildew for wheat under humid conditions. Consider preventative spraying.`,
      "Potato": `High humidity increases risk of late blight in potato. Regular monitoring recommended.`
    },
    "Dry": {
      default: `Supplement irrigation for ${cropName} cultivation during current dry spell in ${region}.`,
      "Mustard": `${cropName} can tolerate dry conditions but critical irrigation at flowering stage is recommended.`,
      "Chickpea (Gram)": `${cropName} is relatively drought-tolerant but consider irrigation at pod formation stage.`
    },
    "Warm": {
      default: `Current warm conditions in ${region} are suitable for ${cropName} growth.`,
      "Cotton": `Warm conditions favor cotton development. Monitor for increased pest activity.`,
      "Rice": `Ensure adequate water levels in rice fields under warm conditions to prevent heat stress.`
    },
    "Cold": {
      default: `Protect young ${cropName} plants from cold stress in ${region}.`,
      "Wheat": `Cold conditions are generally favorable for wheat development in vegetative stage.`,
      "Potato": `Protect potato from frost damage under cold conditions. Consider row covers if temperatures drop further.`
    }
  };

  // Soil-specific recommendations
  const soilRecommendations: Record<string, Record<string, string>> = {
    "Clay": {
      irrigation: `Careful water management needed as ${soil} soil retains water longer. Avoid overwatering.`,
      fertilizer: `${soil} soil tends to bind nutrients. Consider split application of fertilizers.`
    },
    "Sandy": {
      irrigation: `Frequent but light irrigation recommended for ${cropName} in ${soil} soil as it drains quickly.`,
      fertilizer: `Apply organic matter to improve ${soil} soil's nutrient retention capacity.`
    },
    "Loamy": {
      irrigation: `${soil} soil has good water retention. Moderate irrigation schedule is suitable.`,
      fertilizer: `${soil} soil is ideal for most crops. Follow standard fertilizer recommendations.`
    },
    "Silty": {
      irrigation: `${soil} soil has good water retention but can form crust. Gentle irrigation recommended.`,
      fertilizer: `${soil} soil is generally fertile. Balanced NPK application recommended.`
    },
    "Peaty": {
      irrigation: `${soil} soil retains moisture well. Avoid overwatering ${cropName}.`,
      fertilizer: `${soil} soil is high in organic matter but may need mineral supplements, especially phosphorus.`
    },
    "Chalky": {
      irrigation: `${soil} soil drains quickly. Regular irrigation needed for ${cropName}.`,
      fertilizer: `${soil} soil may be deficient in iron and manganese. Consider micronutrient application.`
    },
    "Black Cotton": {
      irrigation: `${soil} soil expands when wet and cracks when dry. Careful water management required.`,
      fertilizer: `${soil} soil is generally fertile but needs balanced fertilization. Split application recommended.`
    }
  };

  // Pest control recommendations based on crop and region
  const pestControlRecommendations: Record<string, string> = {
    "Wheat": "Monitor for aphids, rust and powdery mildew. Use resistant varieties and timely fungicide application if necessary.",
    "Rice": "Regular scouting for stem borer, leaf folder and blast. Consider integrated pest management strategies.",
    "Corn (Maize)": "Watch for fall armyworm and stem borer. Consider bio-control agents for sustainable management.",
    "Cotton": "Monitor for bollworm, whitefly and pink bollworm. Implement IPM with pheromone traps and predator conservation.",
    "Sugarcane": "Be vigilant for early shoot borer and pyrilla. Trash mulching and light traps can help reduce pest incidence.",
    "Potato": "Watch for late blight and tuber moth. Regular monitoring and preventative sprays may be necessary.",
    "Soybean": "Monitor for girdle beetle and defoliators. Consider need-based insecticide application.",
    "Chickpea (Gram)": "Regular monitoring for pod borer. Use pheromone traps and timely insecticide sprays.",
    "Mustard": "Watch for aphids and sawfly. Consider yellow sticky traps and need-based insecticide application.",
    "Groundnut": "Monitor for leaf miner and Spodoptera. Consider light traps and need-based insecticide application."
  };

  // Default to generic recommendations if specific ones aren't available
  const specificAdvice = adviceByWeather[weather]?.[crop] || adviceByWeather[weather]?.default || `Consider local conditions before planting ${cropName}.`;
  const irrigationAdvice = soilRecommendations[soil]?.irrigation || "Maintain adequate soil moisture based on crop requirements.";
  const fertilizerAdvice = soilRecommendations[soil]?.fertilizer || "Apply balanced NPK fertilizer according to soil test recommendations.";
  const pestControlAdvice = pestControlRecommendations[crop] || "Regular monitoring and integrated pest management recommended.";

  // Calculate appropriate growth stage based on weather and region
  // This is a simple simulation - in a real app this would be more sophisticated
  const stageOptions = stages[crop] || stages["Chickpea (Gram)"];
  const stage = stageOptions[Math.floor((new Date().getMonth() + weather.length) % stageOptions.length)];

  return {
    name: cropName,
    stage: stage,
    advice: specificAdvice,
    irrigation: irrigationAdvice,
    pestControl: pestControlAdvice,
    fertilizer: fertilizerAdvice
  };
};

export function CropAdvisoryTab() {
  const [activeTab, setActiveTab] = useState("smart-recommendations");
  const [selectedCrop, setSelectedCrop] = useState("rice");
  const { position } = useGeolocation();
  const [location, setLocation] = useState({ city: "Mumbai", state: "Maharashtra", country: "India" });
  const [weather, setWeather] = useState("Sunny");
  
  // AI Crop Advisor form state
  const [advisorCrop, setAdvisorCrop] = useState<string>("Select crop");
  const [advisorSoil, setAdvisorSoil] = useState<string>("Select soil type");
  const [advisorRegion, setAdvisorRegion] = useState<string>("West India");
  const [advisorWeather, setAdvisorWeather] = useState<string>("Warm");
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [showSoilDropdown, setShowSoilDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showWeatherDropdown, setShowWeatherDropdown] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecommendation, setGeneratedRecommendation] = useState<CropRecommendation | null>(null);

  // Fetch location data when position changes
  useEffect(() => {
    const fetchLocation = async () => {
      if (position) {
        try {
          const locationData = await reverseGeocode(position.latitude, position.longitude);
          setLocation({
            city: locationData.city || "Mumbai",
            state: locationData.state || "Maharashtra",
            country: locationData.country || "India"
          });
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      }
    };
    
    fetchLocation();
  }, [position]);

  // Generate AI recommendations
  const generateRecommendations = () => {
    setIsGenerating(true);
    
    // Simulate API delay for a more realistic experience
    setTimeout(() => {
      const recommendation = generateDynamicRecommendation(
        advisorCrop, 
        advisorSoil, 
        advisorRegion, 
        advisorWeather
      );
      
      setGeneratedRecommendation(recommendation);
      setShowRecommendations(true);
      setIsGenerating(false);
    }, 1500);
  };

  // Function to determine best matching crops for a region
  const getBestCropsForRegion = (region: string): string[] => {
    return LOCATION_BASED_RECOMMENDATIONS[region]?.commonCrops || ["Wheat", "Rice", "Cotton"];
  };

  // Function to determine suitable soil types for a region
  const getSuitableSoilsForRegion = (region: string): string[] => {
    return LOCATION_BASED_RECOMMENDATIONS[region]?.commonSoils || ["Loamy", "Clay", "Sandy"];
  };

  // Function to get typical weather for a region
  const getTypicalWeatherForRegion = (region: string): string => {
    const weatherOptions = LOCATION_BASED_RECOMMENDATIONS[region]?.typicalWeather || ["Normal", "Warm"];
    return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
  };

  // Use My Location handler - autofill form fields
  const useMyLocation = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Use the detected region to suggest appropriate values
      const detectedRegion = advisorRegion !== "West India" ? advisorRegion : "West India";
      
      // Get suitable crops for this region
      const suitableCrops = getBestCropsForRegion(detectedRegion);
      const recommendedCrop = suitableCrops[0];
      
      // Get suitable soil for this region and crop
      const suitableSoils = getSuitableSoilsForRegion(detectedRegion);
      const recommendedSoil = CROP_SOIL_SUITABILITY[recommendedCrop]?.[0] || suitableSoils[0];
      
      // Set typical weather for this region
      const typicalWeather = getTypicalWeatherForRegion(detectedRegion);
      
      // Auto-fill the form
      setAdvisorCrop(recommendedCrop);
      setAdvisorSoil(recommendedSoil);
      setAdvisorRegion(detectedRegion);
      setAdvisorWeather(typicalWeather);
      
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="py-4 max-w-screen-xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sprout className="h-6 w-6" />
            <h2 className="text-xl font-bold">Crop Advisory</h2>
          </div>
        <p className="text-gray-400">Expert recommendations for your crops based on current conditions</p>
      </div>

      {/* Sub Tabs */}
      <div className="mb-6">
        <div className="flex w-full rounded-md overflow-hidden border border-gray-800">
          <button 
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${activeTab === "smart-recommendations" ? "bg-black/20" : "bg-black/5"}`}
            onClick={() => setActiveTab("smart-recommendations")}
          >
            <Sparkles size={16} className="text-yellow-400" />
                  <span>Smart Recommendations</span>
          </button>
          <button 
            className={`flex-1 py-3 px-4 flex items-center justify-center ${activeTab === "general-recommendations" ? "bg-black/20" : "bg-black/5"}`}
            onClick={() => setActiveTab("general-recommendations")}
              >
                General Recommendations
          </button>
          <button 
            className={`flex-1 py-3 px-4 flex items-center justify-center ${activeTab === "ai-crop-advisor" ? "bg-black/20" : "bg-black/5"}`}
            onClick={() => setActiveTab("ai-crop-advisor")}
              >
                AI Crop Advisor
          </button>
        </div>
      </div>

      {/* Smart Recommendations Tab Content */}
      {activeTab === "smart-recommendations" && (
        <div className="mb-6">
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-yellow-400" />
              <h3 className="text-xl font-semibold">Smart Recommendations for {location.city}, {location.state}</h3>
            </div>
            <p className="text-sm text-gray-400">Based on your location and current weather: {weather}</p>
          </div>

          {/* Crop Selection Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            <button 
              className={`py-3 px-4 text-center ${selectedCrop === "wheat" ? "bg-black/20 font-medium border-b-2 border-yellow-500" : "bg-black/10 hover:bg-black/15"}`}
              onClick={() => setSelectedCrop("wheat")}
            >
              Wheat
            </button>
            <button 
              className={`py-3 px-4 text-center ${selectedCrop === "rice" ? "bg-black/20 font-medium border-b-2 border-yellow-500" : "bg-black/10 hover:bg-black/15"}`}
              onClick={() => setSelectedCrop("rice")}
            >
              Rice
            </button>
            <button 
              className={`py-3 px-4 text-center ${selectedCrop === "corn" ? "bg-black/20 font-medium border-b-2 border-yellow-500" : "bg-black/10 hover:bg-black/15"}`}
              onClick={() => setSelectedCrop("corn")}
            >
              Corn
            </button>
            <button 
              className={`py-3 px-4 text-center ${selectedCrop === "cotton" ? "bg-black/20 font-medium border-b-2 border-yellow-500" : "bg-black/10 hover:bg-black/15"}`}
              onClick={() => setSelectedCrop("cotton")}
            >
              Cotton
            </button>
          </div>

          {/* Selected Crop Details */}
          <div className="bg-black/10 rounded-md border border-gray-800">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-5">{CROP_RECOMMENDATIONS[selectedCrop].name}</h3>
              
              <div className="mb-4">
                <h4 className="text-sm text-gray-400 mb-1">Current Stage</h4>
                <p className="font-semibold text-lg">{CROP_RECOMMENDATIONS[selectedCrop].stage}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm text-gray-400 mb-1">Advice</h4>
                <p>{CROP_RECOMMENDATIONS[selectedCrop].advice}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black/20 p-4 rounded-md">
                  <h4 className="font-semibold mb-2 text-blue-400">Irrigation</h4>
                  <p className="text-sm">{CROP_RECOMMENDATIONS[selectedCrop].irrigation}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-md">
                  <h4 className="font-semibold mb-2 text-green-400">Pest Control</h4>
                  <p className="text-sm">{CROP_RECOMMENDATIONS[selectedCrop].pestControl}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-md">
                  <h4 className="font-semibold mb-2 text-amber-400">Fertilizer</h4>
                  <p className="text-sm">{CROP_RECOMMENDATIONS[selectedCrop].fertilizer}</p>
                </div>
              </div>

              {/* Detailed Crop Information Section */}
              <div className="mt-6 border-t border-gray-800 pt-6">
                <h4 className="font-semibold mb-4 text-lg">Detailed Crop Information</h4>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-400 mb-1">Growing Season</h5>
                    <p>{CROP_RECOMMENDATIONS[selectedCrop].details.growingSeason}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-400 mb-1">Water Requirements</h5>
                    <p>{CROP_RECOMMENDATIONS[selectedCrop].details.waterRequirements}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-400 mb-1">Preferred Soil</h5>
                    <p>{CROP_RECOMMENDATIONS[selectedCrop].details.soilTypes}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-400 mb-1">Popular Varieties</h5>
                    <p>{CROP_RECOMMENDATIONS[selectedCrop].details.varieties}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-400 mb-1">Crop Duration</h5>
                    <p>{CROP_RECOMMENDATIONS[selectedCrop].details.cropDuration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* General Recommendations Tab Content */}
      {activeTab === "general-recommendations" && (
        <div className="mb-6">
                <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">General Crop Recommendations</h3>
            <p className="text-sm text-gray-400">Common practices for the most frequently cultivated crops in India</p>
                </div>

          <div className="grid grid-cols-1 gap-4">
            {GENERAL_CROP_RECOMMENDATIONS.map((crop, index) => (
              <div key={index} className="bg-black/10 p-5 rounded-md border border-gray-800">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <Sprout size={18} className="mr-2" />
                  {crop.name}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Growing Season</h4>
                    <p className="font-medium">{crop.season}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Key Advice</h4>
                    <p>{crop.advice}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Cultivation Practices</h4>
                    <p>{crop.cultivation}</p>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Crop Advisor Tab Content */}
      {activeTab === "ai-crop-advisor" && (
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">AI Crop Advisor</h3>
            <p className="text-sm text-gray-400">Get personalized crop recommendations by providing details about your specific farming conditions.</p>
          </div>

          <div className="bg-black/20 p-4 mb-6 rounded-md flex items-center border border-gray-800">
            <MapPin size={18} className="mr-2 text-blue-400" />
                <div>
              <h4 className="font-semibold">Your detected location: {location.city}, {location.state}</h4>
              <p className="text-sm text-gray-400">Current weather: {weather}</p>
                </div>
              </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Crop dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2">Crop</label>
                  <div className="relative">
                <button 
                  className="w-full h-10 px-3 rounded-md bg-black/10 border border-gray-700 flex justify-between items-center hover:bg-black/15"
                  onClick={() => setShowCropDropdown(!showCropDropdown)}
                >
                  <span>{advisorCrop}</span>
                  <ChevronDown size={18} />
                </button>
                
                {showCropDropdown && (
                  <div className="absolute z-10 mt-1 w-full rounded-md bg-black/90 border border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                    {CROP_OPTIONS.map((crop) => (
                      <div 
                        key={crop}
                        className="px-4 py-2 hover:bg-black/50 cursor-pointer"
                        onClick={() => {
                          setAdvisorCrop(crop);
                          setShowCropDropdown(false);
                        }}
                      >
                        {crop}
                      </div>
                    ))}
                  </div>
                )}
                  </div>
                </div>

            {/* Soil Type dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2">Soil Type</label>
                  <div className="relative">
                <button 
                  className="w-full h-10 px-3 rounded-md bg-black/10 border border-gray-700 flex justify-between items-center hover:bg-black/15"
                  onClick={() => setShowSoilDropdown(!showSoilDropdown)}
                >
                  <span>{advisorSoil}</span>
                  <ChevronDown size={18} />
                </button>
                
                {showSoilDropdown && (
                  <div className="absolute z-10 mt-1 w-full rounded-md bg-black/90 border border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                    {SOIL_TYPES.map((soil) => (
                      <div 
                        key={soil}
                        className="px-4 py-2 hover:bg-black/50 cursor-pointer"
                        onClick={() => {
                          setAdvisorSoil(soil);
                          setShowSoilDropdown(false);
                        }}
                      >
                        {soil}
                      </div>
                    ))}
                  </div>
                )}
                  </div>
                </div>

            {/* Region dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <div className="relative">
                <button 
                  className="w-full h-10 px-3 rounded-md bg-black/10 border border-gray-700 flex justify-between items-center hover:bg-black/15"
                  onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                >
                  <span>{advisorRegion}</span>
                  <ChevronDown size={18} />
                </button>
                
                {showRegionDropdown && (
                  <div className="absolute z-10 mt-1 w-full rounded-md bg-black/90 border border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                    {REGIONS.map((region) => (
                      <div 
                        key={region}
                        className="px-4 py-2 hover:bg-black/50 cursor-pointer flex justify-between items-center"
                        onClick={() => {
                          setAdvisorRegion(region);
                          setShowRegionDropdown(false);
                        }}
                      >
                        <span>{region}</span>
                        {advisorRegion === region && <CheckIcon size={16} className="text-green-400" />}
                      </div>
                    ))}
                  </div>
                )}
                  </div>
                </div>

            {/* Weather dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2">Current Weather</label>
                  <div className="relative">
                <button 
                  className="w-full h-10 px-3 rounded-md bg-black/10 border border-gray-700 flex justify-between items-center hover:bg-black/15"
                  onClick={() => setShowWeatherDropdown(!showWeatherDropdown)}
                >
                  <span>{advisorWeather}</span>
                  <ChevronDown size={18} />
                </button>
                
                {showWeatherDropdown && (
                  <div className="absolute z-10 mt-1 w-full rounded-md bg-black/90 border border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                    {WEATHER_CONDITIONS.map((condition) => (
                      <div 
                        key={condition}
                        className="px-4 py-2 hover:bg-black/50 cursor-pointer flex justify-between items-center"
                        onClick={() => {
                          setAdvisorWeather(condition);
                          setShowWeatherDropdown(false);
                        }}
                      >
                        <span>{condition}</span>
                        {advisorWeather === condition && <CheckIcon size={16} className="text-green-400" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4 mb-6">
            <button 
              className="flex-1 bg-white text-black font-medium py-3 px-4 rounded-md hover:bg-gray-200 flex items-center justify-center transition-all"
              onClick={generateRecommendations}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating recommendations...
                </>
              ) : (
                "Get Custom AI Recommendations"
              )}
            </button>
            <button 
              className="bg-black/20 py-3 px-4 rounded-md flex items-center hover:bg-black/30 transition-all"
              onClick={useMyLocation}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <MapPin size={16} className="mr-2 text-blue-400" />
              )}
              Use My Location
            </button>
          </div>

          {/* AI Generated Recommendations */}
          {showRecommendations && generatedRecommendation && (
            <div className="mt-8 bg-black/10 p-6 rounded-md border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{generatedRecommendation.name} Recommendations</h3>
                <div className="flex gap-2">
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-md flex items-center text-sm">
                    <Sparkles size={14} className="mr-1 text-yellow-400" />
                    AI Generated
                  </span>
                  <span className="bg-green-900 text-white px-3 py-1 rounded-md flex items-center text-sm">
                    <MapPin size={14} className="mr-1" />
                    Location-based
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm text-gray-400 mb-1">Current Stage</h4>
                <p className="font-semibold text-lg">{generatedRecommendation.stage}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm text-gray-400 mb-1">Advice</h4>
                <p>{generatedRecommendation.advice}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black/20 p-4 rounded-md">
                  <h4 className="font-semibold mb-2 text-blue-400">Irrigation</h4>
                  <p className="text-sm">{generatedRecommendation.irrigation}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-md">
                  <h4 className="font-semibold mb-2 text-green-400">Pest Control</h4>
                  <p className="text-sm">{generatedRecommendation.pestControl}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-md">
                  <h4 className="font-semibold mb-2 text-amber-400">Fertilizer</h4>
                  <p className="text-sm">{generatedRecommendation.fertilizer}</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic">
                These recommendations are generated by AI based on the information you provided. Always consult with local agricultural experts for specific advice.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Farmer's Assistant floating button */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-white text-black rounded-full px-4 py-2 flex items-center gap-2 shadow-lg hover:bg-gray-100 transition-colors">
          <span className="inline-block w-5 h-5 bg-black rounded-full text-white flex items-center justify-center text-xs">⏱</span>
          Farmer's Assistant
          <span className="ml-1">↗</span>
        </button>
      </div>
    </div>
  );
}
