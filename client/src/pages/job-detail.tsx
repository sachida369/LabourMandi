import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Clock,
  IndianRupee,
  MessageSquare,
  Zap,
  Calendar,
  User,
  Star,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { Job, User as UserType, Bid, TechnicianProfile } from "@shared/schema";

const bidFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  deliveryTime: z.string().min(1, "Please select delivery time"),
});

type BidFormData = z.infer<typeof bidFormSchema>;

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [bidDialogOpen, setBidDialogOpen] = useState(false);

  const { data: job, isLoading } = useQuery<Job & { user?: UserType }>({
    queryKey: ["/api/jobs", params.id],
  });

  const { data: bids } = useQuery<(Bid & { vendor?: UserType & { technicianProfile?: TechnicianProfile } })[]>({
    queryKey: ["/api/jobs", params.id, "bids"],
    enabled: !!params.id,
  });

  const form = useForm<BidFormData>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      amount: "",
      message: "",
      deliveryTime: "",
    },
  });

  const submitBidMutation = useMutation({
    mutationFn: async (data: BidFormData) => {
      const res = await apiRequest("POST", `/api/jobs/${params.id}/bids`, {
        amount: data.amount,
        message: data.message,
        deliveryTime: data.deliveryTime,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs", params.id, "bids"] });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs", params.id] });
      toast({ title: "Bid submitted successfully!" });
      setBidDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to submit bid", description: error.message, variant: "destructive" });
    },
  });

  const onSubmitBid = (data: BidFormData) => {
    submitBidMutation.mutate(data);
  };

  if (isLoading) {
    return <JobDetailSkeleton />;
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p className="text-muted-foreground">The job you're looking for doesn't exist.</p>
      </div>
    );
  }

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
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="secondary">{job.category}</Badge>
                  {job.urgency && job.urgency !== "normal" && (
                    <Badge className={urgencyColors[job.urgency] || ""}>
                      <Zap className="h-3 w-3 mr-1" />
                      {job.urgency === "urgent" ? "Urgent" : "Flexible"}
                    </Badge>
                  )}
                  <Badge variant="outline">{job.status}</Badge>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-job-title">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  {job.user && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={job.user.avatar || undefined} alt={job.user.name} />
                        <AvatarFallback className="text-xs">{job.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>Posted by {job.user.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.city || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeAgo(job.createdAt)}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="text-lg font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-job-description">
                    {job.description}
                  </p>
                </div>

                {job.images && job.images.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h2 className="text-lg font-semibold mb-3">Attachments</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {job.images.map((image, index) => (
                          <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted">
                            <img src={image} alt={`Attachment ${index + 1}`} className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Bids ({bids?.length || 0})</span>
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="lowest">Lowest Price</SelectItem>
                      <SelectItem value="highest">Highest Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bids && bids.length > 0 ? (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <div key={bid.id} className="border rounded-lg p-4" data-testid={`card-bid-${bid.id}`}>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={bid.vendor?.avatar || undefined} alt={bid.vendor?.name} />
                            <AvatarFallback>{bid.vendor?.name?.charAt(0) || "V"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <Link href={`/technician/${bid.vendorId}`}>
                                  <p className="font-semibold hover:text-primary cursor-pointer">
                                    {bid.vendor?.name || "Vendor"}
                                  </p>
                                </Link>
                                {bid.vendor?.technicianProfile && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{Number(bid.vendor.technicianProfile.rating).toFixed(1)}</span>
                                    <span>({bid.vendor.technicianProfile.totalReviews} reviews)</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-primary" data-testid="text-bid-amount">
                                  ₹{Number(bid.amount).toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">{bid.deliveryTime}</p>
                              </div>
                            </div>
                            <p className="text-muted-foreground mt-2 line-clamp-3">{bid.message}</p>
                            {job.userId === user?.id && bid.status === "pending" && (
                              <div className="flex gap-2 mt-4">
                                <Button size="sm" data-testid={`button-accept-bid-${bid.id}`}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline" data-testid={`button-reject-bid-${bid.id}`}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {bid.status !== "pending" && (
                              <Badge className="mt-2" variant={bid.status === "accepted" ? "default" : "secondary"}>
                                {bid.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No bids yet. Be the first to submit a bid!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-job-budget">
                    {formatBudget()}
                  </p>
                  {job.timeline && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      {job.timeline}
                    </p>
                  )}
                </div>

                {user?.role === "vendor" && job.status === "open" && job.userId !== user.id && (
                  <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg" data-testid="button-submit-bid">
                        Submit Bid
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Your Bid</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitBid)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bid Amount (₹)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="Enter your bid amount" {...field} data-testid="input-bid-amount" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="deliveryTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Delivery Time</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-delivery-time">
                                      <SelectValue placeholder="Select delivery time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1-2 days">1-2 days</SelectItem>
                                    <SelectItem value="3-5 days">3-5 days</SelectItem>
                                    <SelectItem value="1 week">1 week</SelectItem>
                                    <SelectItem value="2 weeks">2 weeks</SelectItem>
                                    <SelectItem value="1 month">1 month</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe why you're the best fit for this job..."
                                    rows={4}
                                    {...field}
                                    data-testid="input-bid-message"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full" disabled={submitBidMutation.isPending} data-testid="button-confirm-bid">
                            {submitBidMutation.isPending ? "Submitting..." : "Submit Bid"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}

                {!user && (
                  <Button className="w-full" size="lg" variant="outline" data-testid="button-login-to-bid">
                    Sign In to Submit Bid
                  </Button>
                )}

                <Separator className="my-6" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{job.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{job.city || "Not specified"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bids Received</span>
                    <span className="font-medium">{job.bidCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={job.status === "open" ? "default" : "secondary"}>
                      {job.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date | null | undefined): string {
  if (!date) return "Recently";
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hours ago`;
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString();
}

function JobDetailSkeleton() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
          <Skeleton className="h-80" />
        </div>
      </div>
    </div>
  );
}
