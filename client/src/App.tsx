import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import TechniciansPage from "@/pages/technicians";
import TechnicianPortfolioPage from "@/pages/technician-portfolio";
import JobsPage from "@/pages/jobs";
import JobDetailPage from "@/pages/job-detail";
import PostJobPage from "@/pages/post-job";
import DashboardPage from "@/pages/dashboard";
import DashboardWalletPage from "@/pages/dashboard/wallet";
import DashboardJobsPage from "@/pages/dashboard/jobs";
import DashboardBidsPage from "@/pages/dashboard/bids";
import DashboardNotificationsPage from "@/pages/dashboard/notifications";
import DashboardSettingsPage from "@/pages/dashboard/settings";
import DashboardReviewsPage from "@/pages/dashboard/reviews";
import DashboardKYCPage from "@/pages/dashboard/kyc";
import DashboardProfilePage from "@/pages/dashboard/profile";
import ProfileEditPage from "@/pages/profile/edit";
import ListingsPage from "@/pages/listings";
import RegisterProfessionalPage from "@/pages/register-professional";
import RegisterVendorPage from "@/pages/register-vendor";
import AdminDashboard from "@/pages/admin";
import AdminUsersPage from "@/pages/admin/users";
import AdminReportsPage from "@/pages/admin/reports";
import AboutPage from "@/pages/static/about";
import TermsPage from "@/pages/static/terms";
import PrivacyPage from "@/pages/static/privacy";
import FAQPage from "@/pages/static/faq";
import HelpPage from "@/pages/static/help";
import RefundPage from "@/pages/static/refund";
import CancellationPage from "@/pages/static/cancellation";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const isDashboard = location.startsWith("/dashboard");
  const isAdmin = location.startsWith("/admin");
  const isProfile = location.startsWith("/profile");

  if (isAdmin) {
    return (
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/users" component={AdminUsersPage} />
          <Route path="/admin/reports" component={AdminReportsPage} />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    );
  }

  if (isDashboard || isProfile) {
    return (
      <MainLayout>
        <DashboardLayout>
          <Switch>
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/dashboard/wallet" component={DashboardWalletPage} />
            <Route path="/dashboard/jobs" component={DashboardJobsPage} />
            <Route path="/dashboard/bids" component={DashboardBidsPage} />
            <Route path="/dashboard/notifications" component={DashboardNotificationsPage} />
            <Route path="/dashboard/settings" component={DashboardSettingsPage} />
            <Route path="/dashboard/reviews" component={DashboardReviewsPage} />
            <Route path="/dashboard/kyc" component={DashboardKYCPage} />
            <Route path="/dashboard/profile" component={DashboardProfilePage} />
            <Route path="/profile/edit" component={ProfileEditPage} />
            <Route component={NotFound} />
          </Switch>
        </DashboardLayout>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/technicians" component={TechniciansPage} />
        <Route path="/technician/:id" component={TechnicianPortfolioPage} />
        <Route path="/jobs" component={JobsPage} />
        <Route path="/job/:id" component={JobDetailPage} />
        <Route path="/post-job" component={PostJobPage} />
        <Route path="/listings" component={ListingsPage} />
        <Route path="/register-professional" component={RegisterProfessionalPage} />
        <Route path="/register-vendor" component={RegisterVendorPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/help" component={HelpPage} />
        <Route path="/refund" component={RefundPage} />
        <Route path="/cancellation" component={CancellationPage} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
