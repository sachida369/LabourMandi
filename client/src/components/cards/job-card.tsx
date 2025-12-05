import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, IndianRupee, MessageSquare, Zap } from "lucide-react";
import type { Job, User } from "@shared/schema";

interface JobCardProps {
  job: Job & { user?: User };
}

export function JobCard({ job }: JobCardProps) {
  const urgencyColors: Record<string, string> = {
    urgent: "bg-red-500/10 text-red-600 dark:text-red-400",
    normal: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    flexible: "bg-green-500/10 text-green-600 dark:text-green-400",
  };

  const formatBudget = () => {
    if (job.budgetMin && job.budgetMax) {
      return `₹${Number(job.budgetMin).toLocaleString()} - ₹${Number(job.budgetMax).toLocaleString()}`;
    }
    if (job.budgetMax) {
      return `Up to ₹${Number(job.budgetMax).toLocaleString()}`;
    }
    if (job.budgetMin) {
      return `From ₹${Number(job.budgetMin).toLocaleString()}`;
    }
    return "Budget negotiable";
  };

  return (
    <Card className="overflow-visible hover-elevate h-full flex flex-col" data-testid={`card-job-${job.id}`}>
      <CardContent className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs shrink-0">
                {job.category}
              </Badge>
              {job.urgency && job.urgency !== "normal" && (
                <Badge className={`text-xs shrink-0 ${urgencyColors[job.urgency] || ""}`}>
                  <Zap className="h-3 w-3 mr-1" />
                  {job.urgency === "urgent" ? "Urgent" : "Flexible"}
                </Badge>
              )}
            </div>

            <Link href={`/job/${job.id}`}>
              <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors cursor-pointer" data-testid="text-job-title">
                {job.title}
              </h3>
            </Link>

            <p className="text-sm text-muted-foreground line-clamp-2 mt-2" data-testid="text-job-description">
              {job.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-muted-foreground">
          {job.user && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={job.user.avatar || undefined} alt={job.user.name} />
                <AvatarFallback className="text-xs">{job.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="line-clamp-1">{job.user.name}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1" data-testid="text-job-location">
              {job.city || "Location not specified"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatTimeAgo(job.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t">
          <div className="flex items-center gap-1 text-lg font-bold text-primary">
            <IndianRupee className="h-5 w-5" />
            <span data-testid="text-job-budget">{formatBudget()}</span>
          </div>

          {job.bidCount !== null && job.bidCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span data-testid="text-job-bids">{job.bidCount} bids</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link href={`/job/${job.id}`} className="w-full">
          <Button className="w-full" data-testid="button-submit-bid">
            Submit Bid
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function formatTimeAgo(date: Date | null | undefined): string {
  if (!date) return "Recently";
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function JobCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-2 mb-2">
          <div className="h-5 w-20 bg-muted animate-pulse rounded" />
          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-full bg-muted animate-pulse rounded mb-1" />
        <div className="h-4 w-2/3 bg-muted animate-pulse rounded mb-4" />
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-10 w-full bg-muted animate-pulse rounded" />
      </CardFooter>
    </Card>
  );
}
