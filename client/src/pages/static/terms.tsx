import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground">
              By accessing and using LabourMandi, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Use License</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily access and use LabourMandi for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            <p className="text-muted-foreground">Under this license you may not:</p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to reverse engineer any software contained on LabourMandi</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground">
              To access certain features of LabourMandi, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Service Provider Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">
              Service providers (technicians and vendors) on LabourMandi agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Provide accurate information about their skills and experience</li>
              <li>Complete KYC verification as required</li>
              <li>Honor accepted bids and commitments</li>
              <li>Maintain professional conduct at all times</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Client Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">
              Clients using LabourMandi agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Provide accurate job descriptions and requirements</li>
              <li>Make timely payments for completed work</li>
              <li>Treat service providers with respect</li>
              <li>Provide honest reviews and feedback</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground">
              LabourMandi acts as an intermediary platform connecting clients with service providers. We do not guarantee the quality of work performed by service providers or the payment by clients. Users engage with each other at their own risk.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at legal@labourmandi.com.
            </p>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground mt-8">
          Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
