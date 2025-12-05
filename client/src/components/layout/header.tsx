import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Search,
  Wallet,
  Bell,
  Menu,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Briefcase,
  ShoppingBag,
  Home,
  HardHat,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Notification } from "@shared/schema";

const navTabs = [
  { label: "Buy", href: "/listings?type=buy", icon: ShoppingBag },
  { label: "Sell", href: "/listings?type=sell", icon: ShoppingBag },
  { label: "Rent", href: "/listings?type=rent", icon: Home },
];

export function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    enabled: isAuthenticated,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col gap-6 pt-6">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center gap-2">
                      <HardHat className="h-8 w-8 text-primary" />
                      <span className="text-xl font-bold">LabourMandi</span>
                    </div>
                  </Link>
                  <nav className="flex flex-col gap-2">
                    {navTabs.map((tab) => (
                      <Link key={tab.href} href={tab.href} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <tab.icon className="h-4 w-4" />
                          {tab.label}
                        </Button>
                      </Link>
                    ))}
                    <Link href="/technicians" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <User className="h-4 w-4" />
                        Find Professionals
                      </Button>
                    </Link>
                    <Link href="/jobs" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Briefcase className="h-4 w-4" />
                        Browse Jobs
                      </Button>
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/">
              <div className="flex items-center gap-2">
                <HardHat className="h-8 w-8 text-primary" />
                <span className="hidden text-xl font-bold sm:inline-block">LabourMandi</span>
              </div>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="hidden flex-1 max-w-2xl md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for services, professionals, or items..."
                className="h-10 w-full pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-1">
            {navTabs.map((tab) => (
              <Link key={tab.href} href={tab.href}>
                <Button
                  variant={location.includes(tab.href.split("?")[0]) ? "secondary" : "ghost"}
                  size="sm"
                >
                  {tab.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard/wallet">
                  <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                    <Wallet className="h-4 w-4" />
                    <span className="font-semibold">₹0</span>
                  </Button>
                </Link>

                <Link href="/dashboard/notifications">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard">
                      <DropdownMenuItem>
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/profile/edit">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/jobs">
                      <DropdownMenuItem>
                        <Briefcase className="mr-2 h-4 w-4" />
                        My Jobs
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/wallet">
                      <DropdownMenuItem>
                        <Wallet className="mr-2 h-4 w-4" />
                        Wallet
                      </DropdownMenuItem>
                    </Link>
                    {(user.role === "admin" || user.role === "superadmin") && (
                      <>
                        <DropdownMenuSeparator />
                        <Link href="/admin">
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Panel
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild disabled={isLoading}>
                <a href="/api/login">{isLoading ? "Loading..." : "Sign In"}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
