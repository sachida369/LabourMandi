import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">We collect several types of information from and about users:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Personal information (name, email, phone number)</li>
              <li>Profile information (skills, experience, portfolio)</li>
              <li>Location data (city, address for job matching)</li>
              <li>Identity documents (for KYC verification)</li>
              <li>Payment information (wallet transactions)</li>
              <li>Usage data (how you interact with our platform)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Provide and maintain our services</li>
              <li>Match clients with appropriate service providers</li>
              <li>Process payments and wallet transactions</li>
              <li>Verify user identities (KYC)</li>
              <li>Send notifications about jobs, bids, and payments</li>
              <li>Improve our platform and user experience</li>
              <li>Ensure platform safety and security</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Information Sharing</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">
              We do not sell your personal information. We may share your information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>With other users as necessary for job matching and communication</li>
              <li>With payment processors for transaction processing</li>
              <li>With legal authorities when required by law</li>
              <li>With service providers who assist in operating our platform</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational security measures to protect your personal information. This includes encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to improve your experience on our platform. You can control cookie preferences through your browser settings. Essential cookies required for platform functionality cannot be disabled.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-muted max-w-none">
            <p className="text-muted-foreground">
              For any privacy-related questions or concerns, please contact our Data Protection Officer at privacy@labourmandi.com.
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
