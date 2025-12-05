import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  Clock,
  IndianRupee,
  MessageSquare,
  Phone,
  CheckCircle2,
  Briefcase,
  Calendar,
  Award,
} from "lucide-react";
import type { User, TechnicianProfile, Review } from "@shared/schema";

export default function TechnicianPortfolioPage() {
  const params = useParams<{ id: string }>();

  const { data: technician, isLoading } = useQuery<User & { technicianProfile: TechnicianProfile | null }>({
    queryKey: ["/api/technicians", params.id],
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/technicians", params.id, "reviews"],
    enabled: !!params.id,
  });

  if (isLoading) {
    return <TechnicianPortfolioSkeleton />;
  }

  if (!technician) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Professional Not Found</h1>
        <p className="text-muted-foreground">The professional you're looking for doesn't exist.</p>
      </div>
    );
  }

  const profile = technician.technicianProfile;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center flex-1">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={technician.avatar || undefined} alt={technician.name} />
                  <AvatarFallback className="text-4xl">{technician.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-background ${
                    technician.isOnline ? "bg-status-online" : "bg-status-offline"
                  }`}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-technician-name">
                    {technician.name}
                  </h1>
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>

                {profile?.headline && (
                  <p className="text-lg text-muted-foreground mt-2" data-testid="text-technician-headline">
                    {profile.headline}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg" data-testid="text-technician-rating">
                      {profile ? Number(profile.rating).toFixed(1) : "0.0"}
                    </span>
                    <span className="text-muted-foreground">
                      ({profile?.totalReviews || 0} reviews)
                    </span>
                  </div>

                  <Separator orientation="vertical" className="h-5" />

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span data-testid="text-technician-location">
                      {technician.city || "Location not set"}
                    </span>
                  </div>

                  <Separator orientation="vertical" className="h-5" />

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{profile?.completedJobs || 0} jobs completed</span>
                  </div>

                  <Separator orientation="vertical" className="h-5" />

                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className={technician.isOnline ? "text-green-600" : "text-muted-foreground"}>
                      {technician.isOnline ? "Available now" : "Currently offline"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Card className="min-w-[280px]">
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">Daily Rate</p>
                    <div className="flex items-center justify-center gap-1 text-3xl font-bold text-primary">
                      <IndianRupee className="h-6 w-6" />
                      <span data-testid="text-technician-daily-rate">
                        {profile?.dailyRate ? Number(profile.dailyRate).toLocaleString() : "Contact"}
                      </span>
                    </div>
                    {profile?.hourlyRate && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ₹{Number(profile.hourlyRate).toLocaleString()}/hour
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" size="lg" data-testid="button-hire-now">
                      <Briefcase className="mr-2 h-5 w-5" />
                      Hire Now
                    </Button>
                    <Button variant="outline" className="w-full" size="lg" data-testid="button-chat">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Chat
                    </Button>
                    <Button variant="secondary" className="w-full" data-testid="button-unlock-contact">
                      <Phone className="mr-2 h-4 w-4" />
                      Unlock Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3">
                Overview
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3">
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground" data-testid="text-technician-bio">
                        {profile?.bio || "No bio provided yet."}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profile?.skills && profile.skills.length > 0 ? (
                          profile.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No skills listed yet.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span className="font-medium">{profile?.experience || 0} years</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Completed Jobs</span>
                        <span className="font-medium">{profile?.completedJobs || 0}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Response Time</span>
                        <span className="font-medium">Within 1 hour</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Member Since</span>
                        <span className="font-medium">
                          {new Date(technician.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {profile?.certificates && profile.certificates.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Certifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {profile.certificates.map((cert, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-primary" />
                              <span className="text-sm">{cert}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.portfolioImages && profile.portfolioImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {profile.portfolioImages.map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img src={image} alt={`Portfolio ${index + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No portfolio images yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews ({profile?.totalReviews || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Client</p>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-muted-foreground ml-2">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment || "No comment provided."}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No reviews yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function TechnicianPortfolioSkeleton() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center flex-1">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-6 w-48" />
                <div className="flex gap-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            </div>
            <Skeleton className="h-64 w-72" />
          </div>
        </div>
      </section>
    </div>
  );
}
