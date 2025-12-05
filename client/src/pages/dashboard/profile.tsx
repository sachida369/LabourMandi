import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Shield,
  Award,
  MessageSquare,
  Eye,
  Star,
  Briefcase,
  Building,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { User } from "@shared/schema";

interface UserProfile extends User {
  profileCompleteness?: number;
  totalJobs?: number;
  totalReviews?: number;
  avgRating?: number;
  isVerified?: boolean;
  isProfessional?: boolean;
  isVendor?: boolean;
}

export default function DashboardProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: [`/api/users/${user?.id}/profile`],
    enabled: isAuthenticated && !!user?.id,
  });

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Sign in to view profile</h2>
      </div>
    );
  }

  const profileData = profile || user;
  const completeness = profile?.profileCompleteness || 0;
  const isProfessional = profile?.isProfessional || false;
  const isVendor = profile?.isVendor || false;
  const isVerified = profile?.isVerified || false;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-none bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={profileData.avatar || undefined} alt={profileData.name} />
              <AvatarFallback className="text-lg">{profileData.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h1 className="text-3xl font-bold">{profileData.name}</h1>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {isProfessional && (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        <Briefcase className="h-3 w-3 mr-1" />
                        Professional
                      </Badge>
                    )}
                    {isVendor && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <Building className="h-3 w-3 mr-1" />
                        Vendor
                      </Badge>
                    )}
                    {isVerified && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <Button asChild className="gap-2">
                  <a href="/profile/edit">
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Profile Complete</p>
                <p className="text-3xl font-bold">{completeness}%</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${completeness}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Jobs Completed</p>
                <p className="text-3xl font-bold">{profile?.totalJobs || 0}</p>
              </div>
              <Briefcase className="h-8 w-8 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reviews</p>
                <p className="text-3xl font-bold">{profile?.totalReviews || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <p className="text-3xl font-bold">{profile?.avgRating || "0"}</p>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mt-1" />
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact & Location Information */}
      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profileData.email}</p>
                </div>
              </div>

              {profileData.phone && (
                <div className="flex items-center gap-3 pt-2 border-t">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{profileData.phone}</p>
                  </div>
                </div>
              )}

              {profileData.createdAt && (
                <div className="flex items-center gap-3 pt-2 border-t">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{new Date(profileData.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Location Information</CardTitle>
            </CardHeader>
            <CardContent>
              {profileData.city || profileData.state || profileData.address ? (
                <div className="space-y-4">
                  {(profileData.city || profileData.state) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">City / State</p>
                        <p className="font-medium">
                          {profileData.city && profileData.state
                            ? `${profileData.city}, ${profileData.state}`
                            : profileData.city || profileData.state}
                        </p>
                      </div>
                    </div>
                  )}

                  {profileData.pincode && (
                    <div className="flex items-start gap-3 pt-2 border-t">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pincode</p>
                        <p className="font-medium">{profileData.pincode}</p>
                      </div>
                    </div>
                  )}

                  {profileData.address && (
                    <div className="flex items-start gap-3 pt-2 border-t">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium text-sm">{profileData.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-muted-foreground text-sm">No location information</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Profile Visibility</span>
            </div>
            <Badge variant="outline" className="bg-blue-100">Public</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Account Status</span>
            </div>
            <Badge variant="outline" className="bg-green-100">Active</Badge>
          </div>

          {profileData.isBanned && (
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Account Status</span>
              </div>
              <Badge variant="outline" className="bg-red-100">Banned</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="gap-2" asChild>
              <a href="/dashboard/settings">
                <Edit2 className="h-4 w-4" />
                Settings
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="/dashboard/kyc">
                <Shield className="h-4 w-4" />
                KYC
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="/dashboard/reviews">
                <Star className="h-4 w-4" />
                Reviews
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="/profile/edit">
                <Edit2 className="h-4 w-4" />
                Edit
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
