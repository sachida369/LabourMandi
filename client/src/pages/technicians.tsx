import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TechnicianCard, TechnicianCardSkeleton } from "@/components/cards/technician-card";
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
import { Search, Filter, MapPin, X } from "lucide-react";
import type { User, TechnicianProfile } from "@shared/schema";

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
];

export default function TechniciansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCity, setSelectedCity] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const { data: technicians, isLoading } = useQuery<(User & { technicianProfile: TechnicianProfile | null })[]>({
    queryKey: ["/api/technicians"],
  });

  const filteredTechnicians = technicians?.filter((tech) => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.technicianProfile?.skills?.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All Categories" ||
      tech.technicianProfile?.categories?.includes(selectedCategory);

    const matchesCity =
      !selectedCity || tech.city?.toLowerCase().includes(selectedCity.toLowerCase());

    return matchesSearch && matchesCategory && matchesCity;
  });

  const sortedTechnicians = [...(filteredTechnicians || [])].sort((a, b) => {
    if (sortBy === "rating") {
      return (Number(b.technicianProfile?.rating) || 0) - (Number(a.technicianProfile?.rating) || 0);
    }
    if (sortBy === "reviews") {
      return (b.technicianProfile?.totalReviews || 0) - (a.technicianProfile?.totalReviews || 0);
    }
    if (sortBy === "price-low") {
      return (Number(a.technicianProfile?.dailyRate) || 0) - (Number(b.technicianProfile?.dailyRate) || 0);
    }
    if (sortBy === "price-high") {
      return (Number(b.technicianProfile?.dailyRate) || 0) - (Number(a.technicianProfile?.dailyRate) || 0);
    }
    return 0;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedCity("");
    setSortBy("rating");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "All Categories" || selectedCity;

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Professionals</h1>
          <p className="text-muted-foreground">
            Connect with skilled workers for your construction and renovation needs
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or skill..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-technicians"
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
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
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
            {isLoading
              ? "Loading..."
              : `${sortedTechnicians?.length || 0} professionals found`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <TechnicianCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedTechnicians && sortedTechnicians.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTechnicians.map((tech) => (
              <TechnicianCard key={tech.id} technician={tech} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-medium mb-2">No professionals found</p>
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
