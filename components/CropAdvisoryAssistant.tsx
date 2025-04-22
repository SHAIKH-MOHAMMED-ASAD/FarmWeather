'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, SendIcon, RefreshCw, ThumbsUp, ThumbsDown, Bot, Sprout, Info } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { reverseGeocode } from '@/lib/geocodingService';
import { fetchEnvironmentalData } from '@/lib/environmentalDataService';
import { generateCropRecommendations, CropRecommendation } from '@/lib/cropRecommendationService';
import { EnvironmentalData } from '@/lib/environmentalDataService';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string | React.ReactNode;
  timestamp: Date;
}

// List of possible clarifying questions the assistant might ask
const clarifyingQuestions = [
  "What crops are you interested in growing?",
  "Do you have specific soil concerns?",
  "What kind of irrigation system do you have?",
  "Are you looking for recommendations for this season or planning ahead?",
  "What's the size of your farming operation?",
  "Do you have any pest or disease concerns?",
  "Are you interested in organic farming methods?",
  "What's your farming experience level?",
];

// Helper function to format recommendations as React nodes
const formatRecommendation = (crop: CropRecommendation): React.ReactNode => {
  return (
    <div key={crop.name} className="mb-4 p-3 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center">
          <Sprout className="h-4 w-4 mr-2 text-green-500" />
          {crop.name}
        </h3>
        <span className="text-xs px-2 py-1 bg-green-900/50 rounded text-green-400">
          {crop.suitabilityScore}% Match
        </span>
      </div>
      
      <div className="text-sm space-y-2">
        <ul className="list-disc pl-5 space-y-1">
          {crop.justification.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <h4 className="text-xs font-medium text-gray-400">Planting Window</h4>
            <p>{crop.plantingWindow}</p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-400">Harvest Window</h4>
            <p>{crop.harvestWindow}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Function to generate an assistant message based on user input and context
const generateAssistantResponse = (
  userInput: string,
  environmentalData: EnvironmentalData | null,
  recommendations: CropRecommendation[] | null,
  previousMessages: Message[]
): { message: string | React.ReactNode, followUp?: string } => {
  // Check for greetings
  const greetings = ["hi", "hello", "hey", "greetings", "howdy"];
  if (greetings.some(g => userInput.toLowerCase().includes(g))) {
    return {
      message: "Hello! I'm your Agricultural Assistant. I can provide crop recommendations based on your location and environmental conditions. What would you like to know?",
      followUp: "You can ask about recommended crops, soil suggestions, or irrigation advice."
    };
  }
  
  // No environmental data yet
  if (!environmentalData) {
    return {
      message: "I'm still collecting environmental data for your location. Once I have that information, I can provide personalized crop recommendations.",
      followUp: "This should only take a moment. Thank you for your patience."
    };
  }
  
  // Check for questions about soil
  if (userInput.toLowerCase().includes("soil")) {
    return {
      message: `Based on your location, your soil type is ${environmentalData.soilType} with a pH of ${environmentalData.soilPh}. ${
        environmentalData.soilPh < 6.0 ? "This is slightly acidic soil, suitable for crops like potatoes, blueberries, and certain varieties of beans." :
        environmentalData.soilPh > 7.5 ? "This is alkaline soil, suitable for crops like asparagus, beets, and cabbage." :
        "This is neutral to slightly alkaline soil, which is excellent for a wide variety of crops."
      }`,
      followUp: "Would you like specific recommendations for crops that thrive in your soil conditions?"
    };
  }
  
  // Check for questions about climate
  if (userInput.toLowerCase().includes("climate") || userInput.toLowerCase().includes("weather")) {
    return {
      message: `Your location has a ${environmentalData.climateZone} climate with a ${environmentalData.rainfallPattern} rainfall pattern. The current season is ${environmentalData.currentSeason}. This climate is generally suitable for ${
        environmentalData.climateZone === "Tropical" ? "tropical fruits, rice, and certain vegetables." :
        environmentalData.climateZone === "Subtropical" ? "citrus fruits, cotton, and a variety of vegetables." :
        environmentalData.climateZone === "Temperate" ? "wheat, corn, soybeans, and many vegetables." :
        environmentalData.climateZone === "Cool Temperate" ? "potatoes, barley, oats, and cool-season vegetables." :
        "hardy crops and those with short growing seasons."
      }`,
      followUp: "Would you like me to recommend specific crops based on your climate?"
    };
  }
  
  // Check for questions about water or irrigation
  if (userInput.toLowerCase().includes("water") || userInput.toLowerCase().includes("irrigation")) {
    return {
      message: `Your available water source is identified as "${environmentalData.availableWaterSource}". ${
        environmentalData.availableWaterSource.includes("Rainfall") ? "With good rainfall, you can rely primarily on natural precipitation for many crops, but you may need supplemental irrigation during dry periods." :
        environmentalData.availableWaterSource.includes("River") ? "Having access to river water provides a reliable irrigation source, which is excellent for water-intensive crops." :
        environmentalData.availableWaterSource.includes("Wells") ? "Wells provide consistent water access, but you may need to monitor water usage especially for water-intensive crops." :
        "With limited natural water sources, you'll need efficient irrigation systems. Consider drip irrigation or other water-conserving methods."
      }`,
      followUp: "Would you like recommendations for water-efficient crops or irrigation strategies?"
    };
  }
  
  // Check for questions about crops or recommendations
  if (userInput.toLowerCase().includes("crop") || 
      userInput.toLowerCase().includes("recommend") || 
      userInput.toLowerCase().includes("grow") ||
      userInput.toLowerCase().includes("plant") ||
      userInput.toLowerCase().includes("suggestion")) {
    
    if (!recommendations || recommendations.length === 0) {
      return {
        message: "I'm currently generating crop recommendations based on your environmental conditions. This may take a moment.",
        followUp: "In the meantime, can you tell me what kind of crops you're interested in? Vegetables, grains, fruits, or cash crops?"
      };
    }
    
    const recommendationNodes = recommendations.slice(0, 3).map(formatRecommendation);
    return {
      message: (
        <div>
          <p className="mb-2">Based on your location's climate, soil, and other environmental factors, here are my top crop recommendations:</p>
          <div className="space-y-2">
            {recommendationNodes}
          </div>
          <p className="mt-2">These recommendations consider your soil type, pH level, climate zone, and available resources.</p>
        </div>
      ),
      followUp: "Would you like more detailed information about any of these crops?"
    };
  }
  
  // Check for specific crop inquiries
  const cropNames = [
    "rice", "wheat", "maize", "corn", "potatoes", "soybeans", 
    "cotton", "sugarcane", "tomatoes", "onions", "cassava"
  ];
  
  for (const crop of cropNames) {
    if (userInput.toLowerCase().includes(crop)) {
      // Find if we have a recommendation for this crop
      const specificCrop = recommendations?.find(r => 
        r.name.toLowerCase().includes(crop) || 
        (crop === "corn" && r.name.toLowerCase().includes("maize"))
      );
      
      if (specificCrop) {
        return {
          message: (
            <div>
              <p className="mb-2">Here's information about {specificCrop.name} for your location:</p>
              {formatRecommendation(specificCrop)}
            </div>
          ),
          followUp: "Would you like fertilizer recommendations or pest management tips for this crop?"
        };
      } else {
        return {
          message: `I don't have detailed information about ${crop} in my current recommendations for your location. This might be because it's not among the most suitable crops for your environmental conditions.`,
          followUp: "Would you like to see the most suitable crops for your location instead?"
        };
      }
    }
  }
  
  // If we can't determine a specific response, ask a clarifying question
  const randomQuestion = clarifyingQuestions[Math.floor(Math.random() * clarifyingQuestions.length)];
  return {
    message: "I'm not sure I understood your question completely.",
    followUp: randomQuestion
  };
};

const CropAdvisoryAssistant: React.FC = () => {
  const { position, isLoading: locationLoading, error: locationError } = useGeolocation();
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendation[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: "👋 Hello! I'm your AI Crop Advisory Assistant. I can help you with personalized crop recommendations based on your location and local environmental conditions.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch environmental data when position is available
  useEffect(() => {
    const fetchData = async () => {
      if (!position) return;
      
      try {
        setLoading(true);
        
        // Get location name
        const locationResult = await reverseGeocode(position.latitude, position.longitude);
        
        // Get environmental data
        const envData = await fetchEnvironmentalData(
          position.latitude, 
          position.longitude,
          locationResult
        );
        
        setEnvironmentalData(envData);
        
        // Add system message about detected location
        setMessages(prev => [
          ...prev, 
          {
            id: Date.now().toString(),
            type: 'system',
            content: `📍 Location detected: ${locationResult.city}, ${locationResult.state}, ${locationResult.country}`,
            timestamp: new Date()
          }
        ]);
        
        // Generate crop recommendations
        const cropRecs = generateCropRecommendations(envData);
        setRecommendations(cropRecs);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching environmental data:", err);
        setLoading(false);
        
        // Add error message
        setMessages(prev => [
          ...prev, 
          {
            id: Date.now().toString(),
            type: 'system',
            content: "⚠️ There was an error fetching environmental data. Some recommendations may be limited.",
            timestamp: new Date()
          }
        ]);
      }
    };
    
    fetchData();
  }, [position]);
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Generate assistant response
    setTimeout(() => {
      const { message, followUp } = generateAssistantResponse(
        input, 
        environmentalData, 
        recommendations,
        messages
      );
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Add follow-up question if available
      if (followUp) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'assistant',
            content: followUp,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, followUpMessage]);
        }, 1000);
      }
    }, 500);
  };
  
  // Reset the conversation
  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-reset',
        type: 'assistant',
        content: "👋 Hello again! How can I help you with crop recommendations today?",
        timestamp: new Date()
      }
    ]);
  };
  
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          AI Crop Advisory Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.type === 'system'
                    ? 'bg-muted text-muted-foreground text-xs'
                    : 'bg-gray-800'
                }`}
              >
                {message.content}
                
                {message.type === 'assistant' && (
                  <div className="flex justify-end gap-1 mt-2 text-gray-400">
                    <button className="p-1 rounded hover:bg-gray-700">
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-700">
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {(locationLoading || loading) && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <p className="text-sm text-muted-foreground">
              {locationLoading ? "Detecting your location..." : "Analyzing environmental data..."}
            </p>
          </div>
        )}
        
        {locationError && (
          <div className="flex items-center justify-center p-4 text-destructive">
            <p className="text-sm">
              Error detecting location. Some features may be limited.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            title="Reset conversation"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Ask about crop recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!input.trim()}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CropAdvisoryAssistant; 