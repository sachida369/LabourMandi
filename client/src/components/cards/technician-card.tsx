import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, IndianRupee } from "lucide-react";
import type { User, TechnicianProfile } from "@shared/schema";

interface TechnicianCardProps {
  technician: User & { technicianProfile: TechnicianProfile | null };
}

export function TechnicianCard({ technician }: TechnicianCardProps) {
  const profile = technician.technicianProfile;
  
  return (
    <Card className="overflow-visible hover-elevate group h-full flex flex-col" data-testid={`card-technician-${technician.id}`}>
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex flex-col items-center text-center flex-1">
          <div className="relative mb-4">
            <Avatar className="h-20 w-20 border-2 border-background shadow-md">
              <AvatarImage src={technician.avatar || undefined} alt={technician.name} />
              <AvatarFallback className="text-2xl">{technician.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${
                technician.isOnline ? "bg-status-online" : "bg-status-offline"
              }`}
              aria-label={technician.isOnline ? "Online" : "Offline"}
            />
          </div>

          <h3 className="font-semibold text-lg line-clamp-1" data-testid="text-technician-name">
            {technician.name}
          </h3>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1" data-testid="text-technician-location">
              {technician.city || "Location not set"}
            </span>
          </div>

          {profile && (
            <>
              <div className="flex items-center gap-1 mt-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium" data-testid="text-technician-rating">
                  {Number(profile.rating).toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({profile.totalReviews} reviews)
                </span>
              </div>

              <div className="flex items-center gap-1 mt-2 text-lg font-bold text-primary">
                <IndianRupee className="h-4 w-4" />
                <span data-testid="text-technician-rate">
                  {profile.dailyRate ? `${Number(profile.dailyRate).toLocaleString()}/day` : "Rate not set"}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mt-3 justify-center">
                {profile.skills?.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {profile.skills && profile.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.skills.length - 3}
                  </Badge>
                )}
              </div>
            </>
          )}

          <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {technician.isOnline
                ? "Available now"
                : `Last seen ${formatLastActive(technician.lastActive)}`}
            </span>
          </div>
        </div>

        <Link href={`/technician/${technician.id}`} className="w-full mt-4">
          <Button className="w-full" data-testid="button-view-profile">
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function formatLastActive(lastActive: Date | null | undefined): string {
  if (!lastActive) return "recently";
  const now = new Date();
  const diff = now.getTime() - new Date(lastActive).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return "a while ago";
}

export function TechnicianCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-muted animate-pulse mb-3" />
          <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
          <div className="h-6 w-28 bg-muted animate-pulse rounded mb-3" />
          <div className="flex gap-1">
            <div className="h-5 w-16 bg-muted animate-pulse rounded" />
            <div className="h-5 w-16 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-9 w-full bg-muted animate-pulse rounded mt-4" />
        </div>
      </CardContent>
    </Card>
  );
}
