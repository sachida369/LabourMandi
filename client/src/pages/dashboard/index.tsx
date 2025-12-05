import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet,
  Briefcase,
  MessageSquare,
  Bell,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { Job, Bid, Notification } from "@shared/schema";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: walletData } = useQuery<{ balance: string; escrowBalance: string }>({
    queryKey: ["/api/wallet/balance"],
    enabled: !!user,
  });

  const { data: myJobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs/my"],
    enabled: !!user,
  });

  const { data: myBids } = useQuery<Bid[]>({
    queryKey: ["/api/bids/my"],
    enabled: !!user,
  });

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const stats = [
    {
      label: "Wallet Balance",
      value: `₹${walletData ? Number(walletData.balance).toLocaleString() : "0"}`,
      icon: Wallet,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      href: "/dashboard/wallet",
    },
    {
      label: "Active Jobs",
      value: myJobs?.filter((j) => j.status === "open" || j.status === "in_progress").length || 0,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      href: "/dashboard/jobs",
    },
    {
      label: "Pending Bids",
      value: myBids?.filter((b) => b.status === "pending").length || 0,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      href: "/dashboard/bids",
    },
    {
      label: "Notifications",
      value: notifications?.filter((n) => !n.isRead).length || 0,
      icon: Bell,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      href: "/dashboard/notifications",
    },
  ];

  const quickActions = [
    { label: "Post a Job", icon: Plus, href: "/post-job", primary: true },
    { label: "Add Funds", icon: Wallet, href: "/dashboard/wallet/add", primary: false },
    { label: "View Bids", icon: MessageSquare, href: "/dashboard/bids", primary: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your activity
          </p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button variant={action.primary ? "default" : "outline"} size="sm" data-testid={`button-${action.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <action.icon className="mr-2 h-4 w-4" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="overflow-visible hover-elevate cursor-pointer" data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid={`text-stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Jobs</CardTitle>
            <Link href="/dashboard/jobs">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {myJobs && myJobs.length > 0 ? (
              <div className="space-y-4">
                {myJobs.slice(0, 5).map((job) => (
                  <Link key={job.id} href={`/job/${job.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover-elevate cursor-pointer border" data-testid={`item-job-${job.id}`}>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1">{job.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {job.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {job.bidCount || 0} bids
                          </span>
                        </div>
                      </div>
                      <JobStatusBadge status={job.status} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No jobs posted yet</p>
                <Link href="/post-job">
                  <Button variant="link" className="mt-2">
                    Post your first job
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Notifications</CardTitle>
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      notification.isRead ? "opacity-60" : ""
                    }`}
                    data-testid={`item-notification-${notification.id}`}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No notifications yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function JobStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    open: { label: "Open", className: "bg-green-500/10 text-green-600", icon: Clock },
    in_progress: { label: "In Progress", className: "bg-blue-500/10 text-blue-600", icon: TrendingUp },
    completed: { label: "Completed", className: "bg-gray-500/10 text-gray-600", icon: CheckCircle2 },
    cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-600", icon: XCircle },
  };

  const config = statusConfig[status] || statusConfig.open;
  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
