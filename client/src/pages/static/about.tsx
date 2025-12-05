import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Zap, Target, Award, Heart } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Every professional is verified through comprehensive background checks and KYC verification.",
  },
  {
    icon: Zap,
    title: "Speed & Efficiency",
    description: "Get matched with skilled workers within minutes, not days. Fast turnaround guaranteed.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We're building a community where workers and clients thrive together.",
  },
  {
    icon: Target,
    title: "Quality Focus",
    description: "Our rating system ensures only top-quality professionals remain on our platform.",
  },
  {
    icon: Award,
    title: "Fair Pricing",
    description: "Transparent bidding ensures competitive rates for clients and fair wages for workers.",
  },
  {
    icon: Heart,
    title: "Made in India",
    description: "Built by Indians, for India's construction and labour market needs.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About LabourMandi</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            India's leading construction marketplace connecting skilled professionals with clients who need their expertise.
          </p>
        </div>

        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <div className="prose prose-muted max-w-none">
              <p className="text-muted-foreground mb-4">
                LabourMandi was founded with a simple mission: to revolutionize how India's construction industry connects talent with opportunities. We noticed a significant gap between skilled workers looking for jobs and clients who desperately needed reliable professionals.
              </p>
              <p className="text-muted-foreground mb-4">
                Traditional methods of finding construction workers were inefficient, unreliable, and often led to poor outcomes for both parties. Workers struggled to find consistent work, while clients had no way to verify the skills and reliability of the professionals they were hiring.
              </p>
              <p className="text-muted-foreground">
                We built LabourMandi to solve these problems. Our platform provides a transparent, efficient, and secure way for skilled workers to showcase their expertise and for clients to find the perfect professionals for their projects.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title} className="overflow-visible">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Registered Professionals</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">100+</p>
                <p className="text-sm text-muted-foreground">Cities Covered</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">25K+</p>
                <p className="text-sm text-muted-foreground">Projects Completed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">4.8</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
