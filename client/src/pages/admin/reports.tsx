import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import type { Report } from "@shared/schema";

export default function AdminReportsPage() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolution, setResolution] = useState("");
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);

  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ["/api/admin/reports"],
  });

  const resolveReportMutation = useMutation({
    mutationFn: async ({ reportId, status, resolution }: { reportId: string; status: string; resolution: string }) => {
      const res = await apiRequest("POST", `/api/admin/reports/${reportId}/resolve`, { status, resolution });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      toast({ title: "Report resolved successfully" });
      setResolveDialogOpen(false);
      setSelectedReport(null);
      setResolution("");
    },
    onError: (error: Error) => {
      toast({ title: "Failed to resolve report", description: error.message, variant: "destructive" });
    },
  });

  const filteredReports = reports?.filter((report) => {
    if (statusFilter === "all") return true;
    return report.status === statusFilter;
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600",
    reviewed: "bg-blue-500/10 text-blue-600",
    resolved: "bg-green-500/10 text-green-600",
    dismissed: "bg-gray-500/10 text-gray-600",
  };

  const statusIcons: Record<string, typeof Clock> = {
    pending: Clock,
    reviewed: Eye,
    resolved: CheckCircle2,
    dismissed: XCircle,
  };

  const openResolveDialog = (report: Report) => {
    setSelectedReport(report);
    setResolveDialogOpen(true);
  };

  const handleResolve = (status: "resolved" | "dismissed") => {
    if (selectedReport) {
      resolveReportMutation.mutate({
        reportId: selectedReport.id,
        status,
        resolution,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">
          Review and resolve user reports
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {["pending", "reviewed", "resolved", "dismissed"].map((status) => {
          const count = reports?.filter((r) => r.status === status).length || 0;
          const StatusIcon = statusIcons[status];
          return (
            <Card
              key={status}
              className={`cursor-pointer ${statusFilter === status ? "ring-2 ring-primary" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${statusColors[status]} flex items-center justify-center`}>
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground capitalize">{status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reports List</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <div className="h-12 bg-muted animate-pulse rounded" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredReports && filteredReports.length > 0 ? (
                  filteredReports.map((report) => {
                    const StatusIcon = statusIcons[report.status];
                    return (
                      <TableRow key={report.id} data-testid={`row-report-${report.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">#{report.id.slice(0, 8)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium capitalize">{report.targetType}</p>
                            <p className="text-xs text-muted-foreground">ID: {report.targetId.slice(0, 8)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="line-clamp-1">{report.reason}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[report.status]}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openResolveDialog(report)}
                            disabled={report.status === "resolved" || report.status === "dismissed"}
                            data-testid={`button-review-report-${report.id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              Review the report details and take appropriate action
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Target Type</p>
                  <p className="text-muted-foreground capitalize">{selectedReport.targetType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Target ID</p>
                  <p className="text-muted-foreground">{selectedReport.targetId}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Reason</p>
                <p className="text-muted-foreground">{selectedReport.reason}</p>
              </div>

              {selectedReport.description && (
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-muted-foreground">{selectedReport.description}</p>
                </div>
              )}

              {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Evidence</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedReport.evidence.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary text-sm hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        Evidence {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-1">Resolution Notes</p>
                <Textarea
                  placeholder="Add notes about your decision..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={3}
                  data-testid="input-resolution"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleResolve("dismissed")}
              disabled={resolveReportMutation.isPending}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Dismiss
            </Button>
            <Button
              onClick={() => handleResolve("resolved")}
              disabled={resolveReportMutation.isPending}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
