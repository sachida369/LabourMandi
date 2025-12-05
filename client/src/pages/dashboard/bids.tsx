import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Gavel, Eye, Clock, IndianRupee } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Bid, Job } from "@shared/schema";

interface BidWithJob extends Bid {
  job?: Job;
}

export default function DashboardBidsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: bids = [], isLoading } = useQuery<BidWithJob[]>({
    queryKey: ["/api/bids/my"],
    enabled: isAuthenticated,
  });

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Sign in to view your bids</h2>
        <Button asChild>
          <a href="/api/login">Sign In</a>
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "shortlisted":
        return <Badge className="bg-blue-500">Shortlisted</Badge>;
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Bids</h1>
        <p className="text-muted-foreground">Track your submitted bids</p>
      </div>

      {bids.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gavel className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bids submitted yet</h3>
            <p className="text-muted-foreground mb-4">Browse jobs and submit bids to get started</p>
            <Button asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <Card key={bid.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{bid.job?.title || "Job"}</h3>
                      {getStatusBadge(bid.status)}
                    </div>
                    {bid.message && (
                      <p className="text-muted-foreground line-clamp-2">{bid.message}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        Your bid: ₹{bid.amount}
                      </span>
                      {bid.deliveryTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {bid.deliveryTime}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(bid.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/job/${bid.jobId}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Job
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
