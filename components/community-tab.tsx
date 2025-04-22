import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UsersRound, MessageSquare, ThumbsUp, Share2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function CommunityTab() {
  return (
    <div className="py-6">
      {/* Community Header */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <UsersRound className="h-6 w-6" />
            <h2 className="text-xl font-bold">Farmer Community</h2>
          </div>
          <p className="text-sm text-gray-400">Share your farming experiences, tips, and local news with other farmers</p>
        </CardContent>
      </Card>

      {/* Post Form */}
      <Card className="bg-card mb-6">
        <CardContent className="p-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">Your name</label>
            <Input
              id="name"
              placeholder="Enter your name"
              className="bg-gray-900 border-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="post" className="block text-sm font-medium mb-2">Share your farming experience, ask questions, or post local agricultural news...</label>
            <Textarea
              id="post"
              placeholder="What's on your mind about farming today?"
              className="bg-gray-900 border-gray-700 min-h-[150px]"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="tags" className="block text-sm font-medium mb-2">Tags (comma separated, e.g.: irrigation,wheat,organic)</label>
            <Input
              id="tags"
              placeholder="Add relevant tags"
              className="bg-gray-900 border-gray-700"
            />
          </div>

          <div className="flex justify-end">
            <Button>Share with Community</Button>
          </div>
        </CardContent>
      </Card>

      {/* Community Posts */}
      <div className="space-y-4">
        {/* Post 1 */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex gap-4 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-700 text-white">RA</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">Rajesh Kumar</h3>
                <p className="text-xs text-gray-400">Punjab • 2 hours ago</p>
              </div>
            </div>

            <p className="mb-4">
              I have been using drip irrigation for my wheat crop this season. It has reduced my water usage by 30% while maintaining yield. Happy to share more details with anyone interested!
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-gray-800 rounded-full text-xs">#irrigation</span>
              <span className="px-2 py-1 bg-gray-800 rounded-full text-xs">#wheat</span>
              <span className="px-2 py-1 bg-gray-800 rounded-full text-xs">#water-saving</span>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <ThumbsUp size={14} /> 24
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageSquare size={14} /> 5
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share2 size={14} /> Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Post 2 */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex gap-4 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-green-700 text-white">SP</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">Sunil Patel</h3>
                <p className="text-xs text-gray-400">Gujarat • 5 hours ago</p>
              </div>
            </div>

            <p className="mb-4">
              Has anyone tried the new BT cotton variety? I'm considering it for the next season but would like to hear about others' experiences with pests and yield.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-gray-800 rounded-full text-xs">#cotton</span>
              <span className="px-2 py-1 bg-gray-800 rounded-full text-xs">#bt-variety</span>
              <span className="px-2 py-1 bg-gray-800 rounded-full text-xs">#pest-management</span>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <ThumbsUp size={14} /> 12
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageSquare size={14} /> 8
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share2 size={14} /> Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Post 3 */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex gap-4 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-purple-700 text-white">AM</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">Anita Mehta</h3>
                <p className="text-xs text-gray-400">Maharashtra • Yesterday</p>
              </div>
            </div>

            <p className="mb-4">
              Weather alert: Heavy rainfall predicted in Western Maharashtra next week. Make sure your fields have proper drainage systems to prevent waterlogging damage to crops.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-gray-800 rounded-full text-xs">#weather-alert</span>
              <span className="px-2 py-1 bg-gray-800 rounded-full text-xs">#drainage</span>
              <span className="px-2 py-1 bg-gray-800 rounded-full text-xs">#maharashtra</span>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <ThumbsUp size={14} /> 38
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageSquare size={14} /> 12
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share2 size={14} /> Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
