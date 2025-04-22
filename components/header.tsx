import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Sprout, CloudSun } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6" />
          <span className="text-xl font-bold">Farm</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/weather-table-demo" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            Weather Table
          </Link>
          <Link href="/api-test" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            API Test
          </Link>
          <Link href="/test-css" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            CSS Test
          </Link>
          <Link href="/location" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Location
          </Link>
          <Link href="/agro-advisory" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground flex items-center gap-1">
            <Sprout className="h-3 w-3" />
            Agro Advisory
          </Link>
          <Link href="/agriculture-dashboard" className="text-sm font-medium text-primary transition-colors hover:text-primary/80 flex items-center gap-1">
            <CloudSun className="h-3 w-3" />
            Agriculture Dashboard
          </Link>
          <Link href="#" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            Weather Intelligence
          </Link>
          <Link href="#" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            Crop Advisory
          </Link>
        </nav>

        <Button variant="outline" size="sm">
          Farmer Portal
        </Button>
      </div>
    </header>
  );
}
