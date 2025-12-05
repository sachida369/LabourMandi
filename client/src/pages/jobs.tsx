import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { JobCard, JobCardSkeleton } from "@/components/cards/job-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, MapPin, X, Plus } from "lucide-react";
import { Link } from "wouter";
import type { Job, User } from "@shared/schema";

const categories = [
  "All Categories",
  "Construction",
  "Plumbing",
  "Electrical",
  "Painting",
  "Carpentry",
  "Transport",
  "Welding",
  "Masonry",
  "Tiling",
  "Interior Design",
  "Renovation",
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCity, setSelectedCity] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const { data: jobs, isLoading } = useQuery<(Job & { user?: User })[]>({
    queryKey: ["/api/jobs"],
  });

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" || job.category === selectedCategory;

    const matchesCity =
      !selectedCity || job.city?.toLowerCase().includes(selectedCity.toLowerCase());

    return matchesSearch && matchesCategory && matchesCity && job.status === "open";
  });

  const sortedJobs = [...(filteredJobs || [])].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    }
    if (sortBy === "budget-high") {
      return (Number(b.budgetMax) || 0) - (Number(a.budgetMax) || 0);
    }
    if (sortBy === "budget-low") {
      return (Number(a.budgetMin) || 0) - (Number(b.budgetMin) || 0);
    }
    if (sortBy === "bids") {
      return (b.bidCount || 0) - (a.bidCount || 0);
    }
    return 0;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedCity("");
    setSortBy("recent");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "All Categories" || selectedCity;

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Jobs</h1>
            <p className="text-muted-foreground">
              Find construction and renovation work opportunities
            </p>
          </div>
          <Link href="/post-job">
            <Button data-testid="button-post-job">
              <Plus className="mr-2 h-4 w-4" />
              Post a Job
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-jobs"
                />
              </div>

              <div className="relative flex-1 lg:max-w-xs">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="City or location..."
                  className="pl-10"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  data-testid="input-city"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48" data-testid="select-category">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-40" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                  <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                  <SelectItem value="bids">Most Bids</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}
                {selectedCategory !== "All Categories" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedCategory("All Categories")}
                    />
                  </Badge>
                )}
                {selectedCity && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCity}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedCity("")}
                    />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `${sortedJobs?.length || 0} jobs found`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedJobs && sortedJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-medium mb-2">No jobs found</p>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
