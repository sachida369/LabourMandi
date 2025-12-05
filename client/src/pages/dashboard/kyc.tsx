import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Clock, Upload, FileText, Shield, AlertTriangle } from "lucide-react";
import type { KYCDocument } from "@shared/schema";

interface KYCStatus {
  overallStatus: "pending" | "verified" | "rejected";
  documents: KYCDocument[];
}

export default function KYCPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast ? { toast: () => {} } : { toast: () => {} };
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("aadhar");

  const { data: kycData, isLoading } = useQuery<KYCStatus>({
    queryKey: [`/api/users/${user?.id}/kyc`],
    enabled: isAuthenticated && !!user?.id,
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/kyc/upload`, {
        method: "POST",
        body: formData,
      });
      return res.json();
    },
    onSuccess: () => {
      toast?.({ title: "Success", description: "Document uploaded successfully" });
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/kyc`] });
    },
    onError: () => {
      toast?.({ title: "Error", description: "Failed to upload document", variant: "destructive" });
    },
  });

  if (authLoading || isLoading) {
    return <div className="space-y-6"><Skeleton className="h-96 w-full" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Sign in to verify KYC</h2>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("documentType", documentType);
    uploadMutation.mutate(formData);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      verified: { color: "bg-green-500/10 text-green-600", icon: <CheckCircle2 className="h-4 w-4" />, label: "Verified" },
      pending: { color: "bg-yellow-500/10 text-yellow-600", icon: <Clock className="h-4 w-4" />, label: "Pending" },
      submitted: { color: "bg-blue-500/10 text-blue-600", icon: <Upload className="h-4 w-4" />, label: "Submitted" },
      rejected: { color: "bg-red-500/10 text-red-600", icon: <AlertTriangle className="h-4 w-4" />, label: "Rejected" },
    };
    const config = statusMap[status] || statusMap.pending;
    return (
      <Badge className={`${config.color} gap-1.5`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const overallStatus = kycData?.overallStatus || "pending";
  const documents = kycData?.documents || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground mt-2">Complete your identity verification to unlock full features</p>
      </div>

      {/* KYC Status Overview */}
      <Card className={overallStatus === "verified" ? "border-green-200 bg-green-50/50" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Your overall KYC verification status</CardDescription>
            </div>
            {getStatusBadge(overallStatus)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {overallStatus === "verified" ? (
            <div className="flex items-center gap-3 p-4 bg-green-100/50 rounded-lg border border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="font-medium text-sm text-green-900">Verification Complete</p>
                <p className="text-xs text-green-700">All documents verified. You have full access to the platform.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-yellow-100/50 rounded-lg border border-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
              <div>
                <p className="font-medium text-sm text-yellow-900">Verification Pending</p>
                <p className="text-xs text-yellow-700">Complete KYC verification to get verified status.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{documents.length}</p>
              <p className="text-xs text-muted-foreground">Documents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{documents.filter(d => d.status === "verified").length}</p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{documents.filter(d => d.status === "pending").length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload & Management */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card key={doc.id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium capitalize">{doc.documentType}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {doc.documentNumber ? `ID: ${doc.documentNumber}` : "No number provided"}
                          </p>
                          {doc.verifiedAt && (
                            <p className="text-xs text-green-600 mt-1">
                              Verified on {new Date(doc.verifiedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(doc.status)}
                        {doc.documentUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    {doc.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
                        <p className="font-medium text-red-900 mb-1">Rejection Reason</p>
                        <p className="text-red-700">{doc.rejectionReason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground mb-4">No documents uploaded yet</p>
                <Button onClick={() => document.querySelector('input[type="file"]')?.click()}>
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Upload your identity document for verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="doc-type">Document Type</Label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="aadhar">Aadhaar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="passport">Passport</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="voter_id">Voter ID</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="doc-file">Document File</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition">
                  <Input
                    id="doc-file"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium mb-1">
                    {selectedFile ? selectedFile.name : "Click or drag file here"}
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (max 5MB)</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="doc-number">Document Number (Optional)</Label>
                <Input
                  id="doc-number"
                  placeholder="Enter document number"
                  className="text-sm"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                <p className="font-medium text-blue-900 mb-1">Important</p>
                <ul className="text-blue-700 text-xs space-y-1 list-disc list-inside">
                  <li>Document must be clear and legible</li>
                  <li>Must show your full name and photo</li>
                  <li>File size should not exceed 5MB</li>
                </ul>
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                className="w-full"
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Guidelines Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Verification Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3 text-muted-foreground">
          <p>📋 <strong>Documents Accepted:</strong> Aadhaar, PAN, Passport, Driver's License, Voter ID</p>
          <p>⏱️ <strong>Processing Time:</strong> Usually completed within 24-48 hours</p>
          <p>🔒 <strong>Security:</strong> Your documents are encrypted and stored securely</p>
          <p>❌ <strong>Rejection Reasons:</strong> Unclear image, missing information, or document expiry</p>
          <p>🔄 <strong>Resubmit:</strong> You can resubmit rejected documents</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Toast hook placeholder if not available
const useToast = () => ({
  toast: (props: any) => console.log(props),
});
