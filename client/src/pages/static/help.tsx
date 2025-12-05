import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  User,
  Briefcase,
  Wallet,
  Shield,
  MessageCircle,
  FileText,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

const helpCategories = [
  {
    icon: User,
    title: "Getting Started",
    description: "Learn how to create your account and set up your profile",
    href: "/help/getting-started",
  },
  {
    icon: Briefcase,
    title: "Posting Jobs",
    description: "How to post jobs and manage bids effectively",
    href: "/help/posting-jobs",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Understanding verification, ratings, and safety features",
    href: "/help/trust-safety",
  },
  {
    icon: Wallet,
    title: "Payments & Wallet",
    description: "Managing your wallet, payments, and withdrawals",
    href: "/help/payments",
  },
  {
    icon: FileText,
    title: "For Professionals",
    description: "Guide for service providers and technicians",
    href: "/help/professionals",
  },
  {
    icon: MessageCircle,
    title: "Communication",
    description: "Using chat, notifications, and messaging features",
    href: "/help/communication",
  },
];

const popularArticles = [
  "How to complete KYC verification",
  "Understanding the bidding system",
  "How to withdraw funds from wallet",
  "Tips for writing winning bids",
  "How ratings and reviews work",
  "Resolving disputes",
];

export default function HelpPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground mb-8">
            How can we help you today?
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              className="pl-12 h-12 text-lg"
              data-testid="input-help-search"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {helpCategories.map((category) => (
            <Link key={category.title} href={category.href}>
              <Card className="h-full overflow-visible hover-elevate cursor-pointer">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Popular Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {popularArticles.map((article, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg hover-elevate"
                    >
                      <span className="text-sm">{article}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Live Chat</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Chat with our support team in real-time
                  </p>
                  <Button size="sm">Start Chat</Button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email Support</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Send us an email and we'll respond within 24 hours
                  </p>
                  <a href="mailto:support@labourmandi.com" className="text-primary text-sm hover:underline">
                    support@labourmandi.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">FAQ</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Browse frequently asked questions
                  </p>
                  <Link href="/faq" className="text-primary text-sm hover:underline">
                    View FAQ
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
