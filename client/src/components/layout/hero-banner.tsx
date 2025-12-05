import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Users,
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Truck,
  HardHat,
  Shovel,
  Drill,
  Pickaxe,
  Building2,
  Loader,
  Shield,
  Pipette,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const HERO_CATEGORIES = [
  {
    icon: Users,
    label: "Construction Labourers",
    description: "Skilled & unskilled workers",
    href: "/technicians?category=labour",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: HardHat,
    label: "Technicians",
    description: "Electrical, Plumbing, etc.",
    href: "/technicians",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Loader,
    label: "Heavy Equipment",
    description: "Cranes, JCB, Excavators",
    href: "/listings?type=rent&category=equipment",
    color: "from-yellow-500 to-amber-600",
  },
  {
    icon: Building2,
    label: "Materials",
    description: "Cement, Steel, Wood",
    href: "/listings?type=buy&category=materials",
    color: "from-gray-500 to-slate-600",
  },
  {
    icon: Wrench,
    label: "Equipment Rental",
    description: "Tools & Machinery",
    href: "/listings?type=rent",
    color: "from-purple-500 to-indigo-600",
  },
  {
    icon: Shovel,
    label: "Excavation Services",
    description: "Digging & Site clearing",
    href: "/technicians?category=excavation",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Truck,
    label: "Transportation",
    description: "Logistics & Delivery",
    href: "/technicians?category=transport",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: Paintbrush,
    label: "Painting & Finishes",
    description: "Interior & Exterior",
    href: "/technicians?category=painting",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Zap,
    label: "Electrical Work",
    description: "Wiring & Installation",
    href: "/technicians?category=electrical",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    icon: Pipette,
    label: "Plumbing & Sanitization",
    description: "Water & Waste Systems",
    href: "/technicians?category=plumbing",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Drill,
    label: "Carpentry & Fabrication",
    description: "Wood & Metal Work",
    href: "/technicians?category=carpentry",
    color: "from-amber-600 to-orange-700",
  },
  {
    icon: Shield,
    label: "Safety Equipment",
    description: "PPE & Safety Gear",
    href: "/listings?type=buy&category=safety",
    color: "from-red-500 to-pink-600",
  },
];

export function HeroBanner() {
  return (
    <section className="w-full bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 md:py-16 border-b">
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Everything for Construction & Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Find skilled workers, rent equipment, buy materials, and connect with service providers
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {HERO_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.label} href={category.href}>
                <div className="group h-full">
                  <div className="h-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-900/20 cursor-pointer bg-white dark:bg-slate-800">
                    <div className={`bg-gradient-to-br ${category.color} p-3 rounded-lg w-fit mb-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                      {category.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Action Row */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Ready to Get Started?
              </h3>
              <p className="text-orange-100">
                Post a job, find professionals, or list your services today
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 whitespace-nowrap">
              <Link href="/post-job">
                <Button size="lg" variant="secondary" className="gap-2">
                  Post a Job
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register-professional">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 gap-2">
                  Become Professional
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register-vendor">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 gap-2">
                  Become Vendor
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>India's Largest Construction Marketplace:</strong> Over 10,000+ skilled professionals, verified vendors, and equipment available across 50+ cities. Connect with verified service providers, rent heavy machinery, buy quality materials, and hire skilled workers - all in one platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
