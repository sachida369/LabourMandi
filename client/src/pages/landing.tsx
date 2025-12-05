import { useState, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TechnicianCard, TechnicianCardSkeleton } from "@/components/cards/technician-card";
import { JobCard, JobCardSkeleton } from "@/components/cards/job-card";
import { HeroBanner } from "@/components/layout/hero-banner";
import { HeroSlider } from "@/components/layout/hero-slider";
import {
  ShoppingBag,
  Tag,
  Home,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Briefcase,
  Shield,
  Star,
  HardHat,
  Wrench,
  Paintbrush,
  Zap,
  Hammer,
  Truck,
} from "lucide-react";
import type { User, TechnicianProfile, Job } from "@shared/schema";

const categories = [
  { icon: HardHat, label: "Construction", href: "/technicians?category=construction" },
  { icon: Wrench, label: "Plumbing", href: "/technicians?category=plumbing" },
  { icon: Zap, label: "Electrical", href: "/technicians?category=electrical" },
  { icon: Paintbrush, label: "Painting", href: "/technicians?category=painting" },
  { icon: Hammer, label: "Carpentry", href: "/technicians?category=carpentry" },
  { icon: Truck, label: "Transport", href: "/technicians?category=transport" },
];

const listingTypes = [
  {
    type: "buy",
    label: "Buy",
    description: "Find construction materials, tools, and equipment at the best prices",
    icon: ShoppingBag,
    color: "from-green-500 to-emerald-600",
    href: "/listings?type=buy",
  },
  {
    type: "sell",
    label: "Sell",
    description: "List your materials, equipment, or services to reach thousands of buyers",
    icon: Tag,
    color: "from-blue-500 to-indigo-600",
    href: "/listings?type=sell",
  },
  {
    type: "rent",
    label: "Rent",
    description: "Rent heavy machinery, scaffolding, and construction equipment",
    icon: Home,
    color: "from-purple-500 to-violet-600",
    href: "/listings?type=rent",
  },
];

const features = [
  {
    icon: Users,
    title: "Verified Professionals",
    description: "All technicians are KYC verified and background checked",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Escrow protection ensures safe transactions for both parties",
  },
  {
    icon: Star,
    title: "Quality Guarantee",
    description: "Ratings and reviews help you find the best professionals",
  },
  {
    icon: Briefcase,
    title: "Wide Network",
    description: "Connect with thousands of skilled workers across India",
  },
];

export default function LandingPage() {
  const [techExpanded, setTechExpanded] = useState(false);
  const [jobsExpanded, setJobsExpanded] = useState(false);

  const { data: technicians, isLoading: techLoading } = useQuery<(User & { technicianProfile: TechnicianProfile | null })[]>({
    queryKey: ["/api/technicians"],
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery<(Job & { user?: User })[]>({
    queryKey: ["/api/jobs"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Slider Section */}
      <section className="relative overflow-hidden">
        <div className="relative">
          <HeroSlider />
        </div>

        {/* Buy/Sell/Rent Cards Section */}
        <div className="bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listingTypes.map((item) => (
                <Link key={item.type} href={item.href}>
                  <Card className="overflow-visible hover-elevate group cursor-pointer h-full" data-testid={`card-listing-type-${item.type}`}>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Banner with All Services */}
      <HeroBanner />

      {/* Available Professionals Slider Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Available Professionals</h2>
              <p className="text-gray-600 dark:text-gray-400">Browse verified professionals in your area</p>
            </div>
            <Link href="/technicians">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {techLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TechnicianCardSkeleton key={i} />
                ))
              ) : technicians && technicians.length > 0 ? (
                technicians.slice(0, 4).map((tech) => (
                  <TechnicianCard key={tech.id} technician={tech} />
                ))
              ) : (
                <div className="col-span-full py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mb-3 opacity-30" />
                  <p>No professionals available yet. Be the first to register!</p>
                  <Link href="/register-professional">
                    <Button variant="outline" size="sm" className="mt-4">
                      Register as Professional
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Job Requests Slider Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recent Job Requests</h2>
              <p className="text-gray-600 dark:text-gray-400">Find exciting work opportunities from clients</p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))
              ) : jobs && jobs.length > 0 ? (
                jobs.slice(0, 3).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="col-span-full py-12 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mb-3 opacity-30" />
                  <p>No job requests yet. Be the first to post a job!</p>
                  <Link href="/post-job">
                    <Button size="sm" className="mt-4">
                      Post a Job
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold mb-4">Why Choose LabourMandi?</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            We're committed to making construction work easier, safer, and more efficient for everyone.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="overflow-visible hover-elevate flex flex-col h-full">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1">{feature.description}</p>
                  <Button variant="outline" size="sm" className="w-full mt-auto">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl">
            Join thousands of professionals and clients already using LabourMandi
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/post-job">
              <Button size="lg" variant="secondary" className="h-12 px-8" data-testid="button-cta-post-job">
                Post a Job
              </Button>
            </Link>
            <Link href="/register-vendor">
              <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-cta-register">
                Register as Professional
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
