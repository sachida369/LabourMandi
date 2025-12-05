import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Package, ShoppingBag, Home, Filter } from "lucide-react";
import { Link } from "wouter";
import type { Listing } from "@shared/schema";

const categories = [
  "All Categories",
  "Tools & Equipment",
  "Construction Materials",
  "Electrical",
  "Plumbing",
  "Safety Gear",
  "Vehicles",
  "Machinery",
  "Other",
];

const listingTypes = [
  { value: "all", label: "All Types", icon: Package },
  { value: "buy", label: "For Sale", icon: ShoppingBag },
  { value: "sell", label: "Wanted", icon: ShoppingBag },
  { value: "rent", label: "For Rent", icon: Home },
];

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("all");

  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
  });

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || listing.category === selectedCategory;
    const matchesType = selectedType === "all" || listing.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "buy":
        return <Badge className="bg-green-500">For Sale</Badge>;
      case "sell":
        return <Badge className="bg-blue-500">Wanted</Badge>;
      case "rent":
        return <Badge className="bg-orange-500">For Rent</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Buy, Sell & Rent</h1>
        <p className="text-muted-foreground">Browse equipment, tools, and materials</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          {listingTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
              className="gap-1"
            >
              <type.icon className="h-4 w-4" />
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or check back later</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  {getTypeBadge(listing.type)}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{listing.title}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{listing.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-primary">
                    {listing.price ? `₹${parseFloat(listing.price).toLocaleString()}` : "Contact for price"}
                    {listing.priceType && <span className="text-sm font-normal text-muted-foreground">/{listing.priceType}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4" />
                  {listing.city || "Location not specified"}
                </div>
                <div className="mt-3">
                  <Badge variant="outline">{listing.category}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
