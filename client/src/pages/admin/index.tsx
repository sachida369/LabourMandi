import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Briefcase,
  FileText,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  Shield,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalTechnicians: number;
  totalListings: number;
  totalJobs: number;
  pendingReports: number;
  pendingKYC: number;
  totalRevenue: number;
  activeJobs: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      trend: "+12%",
      href: "/admin/users",
    },
    {
      title: "Technicians",
      value: stats?.totalTechnicians || 0,
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      trend: "+8%",
      href: "/admin/users?role=vendor",
    },
    {
      title: "Active Jobs",
      value: stats?.activeJobs || 0,
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      trend: "+15%",
      href: "/admin/jobs",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: IndianRupee,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      trend: "+23%",
      href: "/admin/payments",
    },
  ];

  const alertCards = [
    {
      title: "Pending Reports",
      value: stats?.pendingReports || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      href: "/admin/reports",
      actionLabel: "Review Reports",
    },
    {
      title: "Pending KYC",
      value: stats?.pendingKYC || 0,
      icon: FileText,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      href: "/admin/kyc",
      actionLabel: "Verify KYC",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-admin-title">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your platform activity and moderation queue
        </p>
      </div>

      {alertCards.some(card => card.value > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {alertCards.map((card) => (
            card.value > 0 && (
              <Card key={card.title} className="border-yellow-500/50 bg-yellow-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                        <card.icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{card.title}</p>
                        <p className="text-2xl font-bold">{card.value}</p>
                      </div>
                    </div>
                    <Link href={card.href}>
                      <Button size="sm" data-testid={`button-${card.title.toLowerCase().replace(/\s+/g, "-")}`}>
                        {card.actionLabel}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((card) => (
            <Link key={card.title} href={card.href}>
              <Card className="overflow-visible hover-elevate cursor-pointer" data-testid={`card-stat-${card.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-10 w-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                      <card.icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {card.trend}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Link href="/admin/logs">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    {i % 2 === 0 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {i % 2 === 0 ? "KYC verified" : "New report submitted"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i} minute{i !== 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/listings">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Review Listings
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Handle Reports
                </Button>
              </Link>
              <Link href="/admin/kyc">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Verify KYC
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
