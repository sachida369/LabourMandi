import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MessageSquare, TrendingUp } from "lucide-react";
import type { Review, User } from "@shared/schema";

interface ReviewWithUser extends Review {
  reviewer?: User;
}

export default function ReviewsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: reviews, isLoading } = useQuery<ReviewWithUser[]>({
    queryKey: [`/api/technicians/${user?.id}/reviews`],
    enabled: isAuthenticated && !!user?.id,
  });

  const stats = {
    totalReviews: reviews?.length || 0,
    averageRating: reviews && reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
      : "0",
    positiveReviews: reviews?.filter(r => Number(r.rating) >= 4).length || 0,
  };

  const ratingBreakdown = [
    { stars: 5, count: reviews?.filter(r => Number(r.rating) === 5).length || 0 },
    { stars: 4, count: reviews?.filter(r => Number(r.rating) === 4).length || 0 },
    { stars: 3, count: reviews?.filter(r => Number(r.rating) === 3).length || 0 },
    { stars: 2, count: reviews?.filter(r => Number(r.rating) === 2).length || 0 },
    { stars: 1, count: reviews?.filter(r => Number(r.rating) === 1).length || 0 },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Sign in to view reviews</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews & Ratings</h1>
        <p className="text-muted-foreground mt-2">See what clients say about your work</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
                <p className="text-3xl font-bold">{stats.totalReviews}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">{stats.averageRating}</p>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Positive Reviews</p>
                <p className="text-3xl font-bold">{stats.positiveReviews}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalReviews > 0 ? `${Math.round((stats.positiveReviews / stats.totalReviews) * 100)}%` : "0%"}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Breakdown of ratings received</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ratingBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-4">
              <div className="flex items-center gap-1 w-20">
                {Array.from({ length: item.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                {Array.from({ length: 5 - item.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gray-300" />
                ))}
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: stats.totalReviews > 0 ? `${(item.count / stats.totalReviews) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
              <p className="text-sm font-medium w-12 text-right">{item.count}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
          <CardDescription>Reviews from clients who hired you</CardDescription>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b last:border-b-0 last:pb-0">
                  <div className="flex gap-4">
                    {review.reviewer && (
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={review.reviewer.avatar || undefined} alt={review.reviewer.name} />
                        <AvatarFallback>{review.reviewer.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{review.reviewer?.name || "Anonymous"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Number(review.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge
                              variant={Number(review.rating) >= 4 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {review.rating} stars
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground shrink-0">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>

                      {review.comment && (
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-muted-foreground">No reviews yet. Complete your first job to receive reviews!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
