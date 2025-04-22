import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WeatherTab } from "@/components/weather-tab";
import { CropAdvisoryTab } from "@/components/crop-advisory-tab";
import { AIAgronomistTab } from "@/components/ai-agronomist-tab";
import { FarmerSupportTab } from "@/components/farmer-support-tab";
import { CommunityTab } from "@/components/community-tab";

export function MainTabs() {
  const [activeTab, setActiveTab] = useState("weather");

  return (
    <Tabs
      defaultValue="weather"
      className="w-full"
      onValueChange={setActiveTab}
    >
      <div className="border-b">
        <div className="container mx-auto">
          <TabsList className="h-14 w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger
              value="weather"
              className="h-14 rounded-none border-b-2 px-4 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Weather
            </TabsTrigger>
            <TabsTrigger
              value="crop-advisory"
              className="h-14 rounded-none border-b-2 px-4 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Crop Advisory
            </TabsTrigger>
            <TabsTrigger
              value="ai-agronomist"
              className="h-14 rounded-none border-b-2 px-4 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              AI Agronomist
            </TabsTrigger>
            <TabsTrigger
              value="farmer-support"
              className="h-14 rounded-none border-b-2 px-4 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Farmer Support
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="h-14 rounded-none border-b-2 px-4 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Community
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <div className="container mx-auto">
        <TabsContent value="weather" className="mt-6">
          <WeatherTab />
        </TabsContent>
        <TabsContent value="crop-advisory" className="mt-6">
          <CropAdvisoryTab />
        </TabsContent>
        <TabsContent value="ai-agronomist" className="mt-6">
          <AIAgronomistTab />
        </TabsContent>
        <TabsContent value="farmer-support" className="mt-6">
          <FarmerSupportTab />
        </TabsContent>
        <TabsContent value="community" className="mt-6">
          <CommunityTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}
