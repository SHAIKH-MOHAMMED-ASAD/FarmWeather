import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, ExternalLink } from "lucide-react";

export function FarmerSupportTab() {
  return (
    <div className="py-6">
      {/* Farmer Support Header */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-6 w-6" />
            <h2 className="text-xl font-bold">Government Schemes for Farmers</h2>
          </div>
          <p className="text-sm text-gray-400">Agricultural support programs and subsidies</p>
        </CardContent>
      </Card>

      {/* PM Kisan Scheme */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex md:items-center gap-4 flex-col md:flex-row">
            <div className="bg-gray-800 rounded-full p-3">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">PM Kisan Samman Nidhi</h3>
              <p className="text-sm text-gray-400 mb-3">Income support of ₹6000 per year to eligible farmer families</p>

              <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-center">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-300">Eligibility:</span>
                  </div>
                  <span className="text-sm">All landholding farmers with cultivable land</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-300">Last Updated:</span>
                  </div>
                  <span className="text-sm">March 2025</span>
                </div>
              </div>
            </div>
            <Button className="flex items-center gap-1">
              Apply Now
              <ExternalLink size={14} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crop Insurance */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex md:items-center gap-4 flex-col md:flex-row">
            <div className="bg-gray-800 rounded-full p-3">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Pradhan Mantri Fasal Bima Yojana</h3>
              <p className="text-sm text-gray-400 mb-3">Crop insurance scheme to protect farmers against crop failure</p>

              <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-center">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-300">Eligibility:</span>
                  </div>
                  <span className="text-sm">All farmers growing notified crops</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-300">Last Updated:</span>
                  </div>
                  <span className="text-sm">March 2025</span>
                </div>
              </div>
            </div>
            <Button className="flex items-center gap-1">
              Apply Now
              <ExternalLink size={14} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kisan Credit Card */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex md:items-center gap-4 flex-col md:flex-row">
            <div className="bg-gray-800 rounded-full p-3">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Kisan Credit Card</h3>
              <p className="text-sm text-gray-400 mb-3">Credit facility for farmers with flexible repayment options</p>

              <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-center">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-300">Eligibility:</span>
                  </div>
                  <span className="text-sm">All farmers, sharecroppers, and tenant farmers</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-300">Last Updated:</span>
                  </div>
                  <span className="text-sm">March 2025</span>
                </div>
              </div>
            </div>
            <Button className="flex items-center gap-1">
              Apply Now
              <ExternalLink size={14} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Soil Health Card */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex md:items-center gap-4 flex-col md:flex-row">
            <div className="bg-gray-800 rounded-full p-3">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Soil Health Card Scheme</h3>
              <p className="text-sm text-gray-400 mb-3">Assessment of soil fertility status and recommendation of nutrients</p>

              <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-center">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-300">Eligibility:</span>
                  </div>
                  <span className="text-sm">All farmers</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-300">Last Updated:</span>
                  </div>
                  <span className="text-sm">January 2025</span>
                </div>
              </div>
            </div>
            <Button className="flex items-center gap-1">
              Apply Now
              <ExternalLink size={14} />
            </Button>
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
