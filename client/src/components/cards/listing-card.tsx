import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Eye, IndianRupee, ShoppingBag, Tag, Home } from "lucide-react";
import type { Listing } from "@shared/schema";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const typeIcons: Record<string, typeof ShoppingBag> = {
    buy: ShoppingBag,
    sell: Tag,
    rent: Home,
  };

  const typeColors: Record<string, string> = {
    buy: "bg-green-500/10 text-green-600 dark:text-green-400",
    sell: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    rent: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  const TypeIcon = typeIcons[listing.type] || ShoppingBag;

  return (
    <Card className="overflow-hidden hover-elevate group" data-testid={`card-listing-${listing.id}`}>
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <TypeIcon className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <Badge className={`absolute top-3 left-3 ${typeColors[listing.type] || ""}`}>
          <TypeIcon className="h-3 w-3 mr-1" />
          {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
        </Badge>
      </div>

      <CardContent className="p-4">
        <Badge variant="secondary" className="mb-2 text-xs">
          {listing.category}
        </Badge>

        <Link href={`/listing/${listing.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors cursor-pointer" data-testid="text-listing-title">
            {listing.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mt-1" data-testid="text-listing-description">
          {listing.description}
        </p>

        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1" data-testid="text-listing-location">
            {listing.city || "Location not specified"}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center gap-1 text-lg font-bold text-primary">
            <IndianRupee className="h-5 w-5" />
            <span data-testid="text-listing-price">
              {listing.price
                ? `${Number(listing.price).toLocaleString()}${listing.priceType ? `/${listing.priceType}` : ""}`
                : "Contact for price"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{listing.views || 0}</span>
          </div>
        </div>

        <Link href={`/listing/${listing.id}`} className="block mt-4">
          <Button variant="outline" className="w-full" data-testid="button-view-listing">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <CardContent className="p-4">
        <div className="h-5 w-20 bg-muted animate-pulse rounded mb-2" />
        <div className="h-5 w-full bg-muted animate-pulse rounded mb-1" />
        <div className="h-5 w-3/4 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-full bg-muted animate-pulse rounded mb-1" />
        <div className="h-4 w-2/3 bg-muted animate-pulse rounded mb-3" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded mb-4" />
        <div className="flex justify-between items-center pt-3 border-t">
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-12 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-10 w-full bg-muted animate-pulse rounded mt-4" />
      </CardContent>
    </Card>
  );
}
