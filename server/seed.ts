import { db } from "./db";
import { users, technicianProfiles, jobs, listings, reviews } from "@shared/schema";
import { sql } from "drizzle-orm";

const technicianData = [
  {
    id: "tech-1",
    email: "rajesh.kumar@example.com",
    name: "Rajesh Kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    role: "vendor" as const,
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    isOnline: true,
    isBanned: false,
  },
  {
    id: "tech-2", 
    email: "priya.sharma@example.com",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    role: "vendor" as const,
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    isOnline: true,
    isBanned: false,
  },
  {
    id: "tech-3",
    email: "amit.patel@example.com",
    name: "Amit Patel",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    role: "vendor" as const,
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380001",
    isOnline: false,
    isBanned: false,
  },
  {
    id: "tech-4",
    email: "sunita.devi@example.com",
    name: "Sunita Devi",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    role: "vendor" as const,
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    isOnline: true,
    isBanned: false,
  },
  {
    id: "tech-5",
    email: "vikram.singh@example.com",
    name: "Vikram Singh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    role: "vendor" as const,
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    isOnline: true,
    isBanned: false,
  },
];

const technicianProfiles_ = [
  {
    userId: "tech-1",
    headline: "Expert Electrician with 15+ Years Experience",
    bio: "I specialize in residential and commercial electrical work. From wiring to smart home installations, I deliver quality work on time.",
    skills: ["Electrical Wiring", "Panel Installation", "Smart Home", "Safety Inspection"],
    categories: ["Electrical"],
    experience: 15,
    dailyRate: "2500",
    hourlyRate: "350",
    rating: "4.8",
    totalReviews: 127,
    completedJobs: 245,
    isAvailable: true,
  },
  {
    userId: "tech-2",
    headline: "Professional Plumber - All Types of Plumbing Work",
    bio: "Certified plumber with expertise in all plumbing solutions. Quick response time and guaranteed satisfaction.",
    skills: ["Pipe Fitting", "Leak Repair", "Bathroom Installation", "Water Heater"],
    categories: ["Plumbing"],
    experience: 10,
    dailyRate: "2000",
    hourlyRate: "300",
    rating: "4.6",
    totalReviews: 89,
    completedJobs: 178,
    isAvailable: true,
  },
  {
    userId: "tech-3",
    headline: "Skilled Carpenter - Furniture & Woodwork Specialist",
    bio: "Master carpenter creating beautiful custom furniture and woodwork. From repairs to complete installations.",
    skills: ["Custom Furniture", "Door Installation", "Kitchen Cabinets", "Wood Repair"],
    categories: ["Carpentry"],
    experience: 12,
    dailyRate: "2200",
    hourlyRate: "320",
    rating: "4.9",
    totalReviews: 156,
    completedJobs: 312,
    isAvailable: true,
  },
  {
    userId: "tech-4",
    headline: "Interior Painter - Transform Your Space",
    bio: "Professional painter specializing in interior and exterior painting. Premium finishes and attention to detail.",
    skills: ["Interior Painting", "Exterior Painting", "Texture Work", "Waterproofing"],
    categories: ["Painting"],
    experience: 8,
    dailyRate: "1800",
    hourlyRate: "250",
    rating: "4.7",
    totalReviews: 98,
    completedJobs: 189,
    isAvailable: true,
  },
  {
    userId: "tech-5",
    headline: "AC Technician & Appliance Repair Expert",
    bio: "Certified technician for AC installation, repair, and all home appliance services. Fast and reliable service.",
    skills: ["AC Installation", "AC Repair", "Refrigerator Repair", "Washing Machine"],
    categories: ["AC & Appliances"],
    experience: 7,
    dailyRate: "1500",
    hourlyRate: "220",
    rating: "4.5",
    totalReviews: 67,
    completedJobs: 134,
    isAvailable: true,
  },
];

const jobsData = [
  {
    id: "job-1",
    userId: "tech-1",
    title: "Electrical Wiring for New 2BHK Apartment",
    description: "Need complete electrical wiring for a new 2BHK apartment including switches, sockets, and main panel installation. Must follow safety standards.",
    category: "Electrical",
    budgetMin: "25000",
    budgetMax: "35000",
    timeline: "1-2 weeks",
    urgency: "normal",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400053",
    status: "open" as const,
    bidCount: 5,
  },
  {
    id: "job-2",
    userId: "tech-2",
    title: "Bathroom Renovation - Complete Plumbing Work",
    description: "Full bathroom renovation requiring new plumbing, fixtures installation, and waterproofing. Looking for experienced plumber.",
    category: "Plumbing",
    budgetMin: "15000",
    budgetMax: "25000",
    timeline: "5-7 days",
    urgency: "high",
    city: "Delhi",
    state: "Delhi",
    pincode: "110019",
    status: "open" as const,
    bidCount: 8,
  },
  {
    id: "job-3",
    userId: "tech-3",
    title: "Custom Wardrobe Design and Installation",
    description: "Need a custom built-in wardrobe for master bedroom. Looking for skilled carpenter who can design and install within budget.",
    category: "Carpentry",
    budgetMin: "40000",
    budgetMax: "60000",
    timeline: "2-3 weeks",
    urgency: "normal",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    status: "open" as const,
    bidCount: 3,
  },
  {
    id: "job-4",
    userId: "tech-4",
    title: "Full House Painting - 3BHK Apartment",
    description: "Complete interior painting for 3BHK apartment. Premium Asian Paints required. Need neat and clean work.",
    category: "Painting",
    budgetMin: "50000",
    budgetMax: "70000",
    timeline: "1 week",
    urgency: "normal",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    status: "open" as const,
    bidCount: 12,
  },
  {
    id: "job-5",
    userId: "tech-5",
    title: "AC Installation - 2 Split Units",
    description: "Need to install 2 split AC units with copper piping. Brand new Daikin units. Professional installation required.",
    category: "AC & Appliances",
    budgetMin: "8000",
    budgetMax: "12000",
    timeline: "1 day",
    urgency: "high",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    status: "open" as const,
    bidCount: 6,
  },
];

const listingsData = [
  {
    id: "listing-1",
    userId: "tech-1",
    title: "Professional Drill Machine - Bosch GSB 500W",
    description: "High-quality Bosch drill machine in excellent condition. Perfect for heavy-duty work. 1 year old with all accessories.",
    type: "sell" as const,
    category: "Tools & Equipment",
    price: "4500",
    priceType: "fixed",
    city: "Mumbai",
    state: "Maharashtra",
    status: "active" as const,
  },
  {
    id: "listing-2",
    userId: "tech-2",
    title: "Scaffolding Set for Rent - 20 Pieces",
    description: "Complete scaffolding set available for rent. Suitable for 3-story building work. Daily and weekly rates available.",
    type: "rent" as const,
    category: "Construction Materials",
    price: "500",
    priceType: "per day",
    city: "Delhi",
    state: "Delhi",
    status: "active" as const,
  },
  {
    id: "listing-3",
    userId: "tech-3",
    title: "Looking for Used Welding Machine",
    description: "Want to buy a used welding machine in good working condition. Prefer inverter type. Budget up to 15000.",
    type: "buy" as const,
    category: "Tools & Equipment",
    price: "15000",
    priceType: "budget",
    city: "Ahmedabad",
    state: "Gujarat",
    status: "active" as const,
  },
  {
    id: "listing-4",
    userId: "tech-4",
    title: "Paint Sprayer Machine - Wagner",
    description: "Selling Wagner paint sprayer in excellent condition. Used for 5 projects only. Comes with extra nozzles.",
    type: "sell" as const,
    category: "Tools & Equipment",
    price: "8000",
    priceType: "fixed",
    city: "Bangalore",
    state: "Karnataka",
    status: "active" as const,
  },
  {
    id: "listing-5",
    userId: "tech-5",
    title: "Generator 5KVA for Rent",
    description: "Portable generator available for rent. Perfect for construction sites and events. Well maintained.",
    type: "rent" as const,
    category: "Machinery",
    price: "1500",
    priceType: "per day",
    city: "Jaipur",
    state: "Rajasthan",
    status: "active" as const,
  },
];

export async function seed() {
  console.log("Starting seed...");
  
  try {
    for (const userData of technicianData) {
      await db.insert(users).values(userData).onConflictDoNothing();
    }
    console.log("Users seeded");

    for (const profile of technicianProfiles_) {
      await db.insert(technicianProfiles).values(profile).onConflictDoNothing();
    }
    console.log("Technician profiles seeded");

    for (const job of jobsData) {
      await db.insert(jobs).values(job).onConflictDoNothing();
    }
    console.log("Jobs seeded");

    for (const listing of listingsData) {
      await db.insert(listings).values(listing).onConflictDoNothing();
    }
    console.log("Listings seeded");

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  }
}

seed().then(() => process.exit(0)).catch(() => process.exit(1));
