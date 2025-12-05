import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RefundPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Overview</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground">
              At LabourMandi, we strive to ensure satisfaction for all our users. This refund policy outlines the circumstances under which refunds may be processed for wallet transactions and payments made through our platform.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Wallet Refunds</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">Refunds for wallet top-ups may be requested under the following conditions:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Technical error resulting in incorrect amount being charged</li>
              <li>Duplicate transaction</li>
              <li>Unauthorized transaction (subject to investigation)</li>
              <li>Account closure with remaining wallet balance</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Service-Related Refunds</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">
              For payments made to service providers through our escrow system:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Full refund if the service provider cancels before work begins</li>
              <li>Partial or full refund if work is not completed as agreed (subject to dispute resolution)</li>
              <li>Refund of unused escrow balance after job completion</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Note: Once a job is marked as completed and payment is released to the service provider, refunds are subject to the provider's consent and our mediation.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Non-Refundable Items</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">The following are not eligible for refunds:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Platform subscription fees (unless within cancellation window)</li>
              <li>Featured listing or promotional fees</li>
              <li>Contact unlock fees after information has been accessed</li>
              <li>Completed transactions where service was delivered satisfactorily</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Refund Process</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">To request a refund:</p>
            <ol className="list-decimal list-inside text-muted-foreground space-y-2">
              <li>Contact our support team at refunds@labourmandi.com</li>
              <li>Provide your transaction ID and reason for refund request</li>
              <li>Include any supporting evidence (screenshots, communications, etc.)</li>
              <li>Our team will review and respond within 3-5 business days</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Refund Timeline</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">Once a refund is approved:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Credit/Debit Card: 5-7 business days</li>
              <li>UPI: 2-3 business days</li>
              <li>Net Banking: 5-7 business days</li>
              <li>Wallet Credit: Instant</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Processing times may vary depending on your bank or payment provider.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground">
              For refund-related queries, please contact us at refunds@labourmandi.com or call our support line at +91 98765 43210.
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
