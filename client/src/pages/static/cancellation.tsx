import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CancellationPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-bold mb-8">Cancellation Policy</h1>

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Please read this policy carefully before engaging in any transactions on LabourMandi.
          </AlertDescription>
        </Alert>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Job Cancellation by Clients</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">Clients may cancel a posted job under the following conditions:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <strong>Before accepting any bid:</strong> No charges apply. The job will be removed from the platform.
              </li>
              <li>
                <strong>After accepting a bid, before work begins:</strong> A cancellation fee of 10% of the agreed amount may apply to compensate the service provider for their time.
              </li>
              <li>
                <strong>After work has begun:</strong> Payment for completed work must be made. Partial payment may be negotiated based on work completed.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Job Cancellation by Service Providers</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">Service providers may cancel an accepted job under the following conditions:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <strong>Before work begins:</strong> No direct financial penalty, but cancellation rate will be recorded and may affect ratings and visibility on the platform.
              </li>
              <li>
                <strong>After work has begun:</strong> Provider must return any advance payment. Repeated cancellations may result in account suspension.
              </li>
              <li>
                <strong>Emergency situations:</strong> Please contact support immediately for exceptions.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Subscription Cancellation</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">For premium subscriptions:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>You may cancel your subscription at any time from your account settings.</li>
              <li>Cancellation takes effect at the end of the current billing period.</li>
              <li>No refunds are provided for the unused portion of the current period.</li>
              <li>Trial period cancellations before the trial ends incur no charges.</li>
              <li>After cancellation, you will retain access to basic features.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Bid Withdrawal</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">Service providers may withdraw their bids:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Anytime before the bid is accepted by the client.</li>
              <li>After acceptance, withdrawal is treated as a job cancellation (see Section 2).</li>
              <li>Frequent bid withdrawals may affect your platform reputation.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Force Majeure</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground">
              In cases of natural disasters, government restrictions, or other circumstances beyond reasonable control, both parties may mutually agree to cancel without penalties. LabourMandi support will assist in mediating such situations.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Account Cancellation</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">To cancel your LabourMandi account:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Complete or cancel all active jobs first.</li>
              <li>Withdraw any remaining wallet balance.</li>
              <li>Request account deletion from Settings or contact support.</li>
              <li>Your data will be retained for 30 days before permanent deletion.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground">
              If you disagree with a cancellation decision or fee, you may raise a dispute through our support system. Our mediation team will review the case and make a fair decision based on the evidence provided by both parties.
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
