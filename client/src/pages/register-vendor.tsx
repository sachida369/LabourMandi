import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { AlertCircle, CheckCircle, Loader2, Store, FileText } from "lucide-react";
import type { User as UserType } from "@shared/schema";

const VENDOR_CATEGORIES = [
  "Building Materials",
  "Tools & Equipment",
  "Safety Equipment",
  "Paints & Chemicals",
  "Electrical Supplies",
  "Plumbing Supplies",
  "Hardware",
  "Machinery",
  "Scaffolding",
  "Other"
];

const vendorRegistrationSchema = z.object({
  headline: z
    .string()
    .min(10, "Business headline must be at least 10 characters")
    .max(100, "Business headline must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-&,'.]*$/, "Headline contains invalid characters"),
  
  bio: z
    .string()
    .min(20, "Business description must be at least 20 characters")
    .max(500, "Business description must be less than 500 characters")
    .regex(/^[a-zA-Z0-9\s\-&,'.\n]*$/, "Description contains invalid characters"),
  
  categories: z
    .array(z.string())
    .min(1, "Select at least one product category")
    .max(5, "Select at most 5 categories"),
  
  businessPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is invalid")
    .regex(/^[0-9\-\+\s]*$/, "Phone number contains invalid characters"),

  businessAddress: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters")
    .regex(/^[a-zA-Z0-9\s\-&,'.\n]*$/, "Address contains invalid characters"),

  city: z
    .string()
    .min(2, "City is required")
    .max(50, "City name is invalid")
    .regex(/^[a-zA-Z\s\-]*$/, "City contains invalid characters"),

  state: z
    .string()
    .min(2, "State is required")
    .max(50, "State name is invalid")
    .regex(/^[a-zA-Z\s\-]*$/, "State contains invalid characters"),

  pincode: z
    .string()
    .length(6, "Pincode must be 6 digits")
    .regex(/^[0-9]*$/, "Pincode must contain only numbers"),
});

type VendorRegistrationData = z.infer<typeof vendorRegistrationSchema>;

export default function RegisterVendorPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/vendor/profile"],
    enabled: isAuthenticated,
    retry: false,
  });

  const form = useForm<VendorRegistrationData>({
    resolver: zodResolver(vendorRegistrationSchema),
    defaultValues: {
      headline: "",
      bio: "",
      categories: [],
      businessPhone: "",
      businessAddress: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: VendorRegistrationData) => {
      try {
        const payload = {
          headline: data.headline.trim(),
          bio: data.bio.trim(),
          categories: data.categories,
          businessPhone: data.businessPhone.trim(),
          businessAddress: data.businessAddress.trim(),
          city: data.city.trim(),
          state: data.state.trim(),
          pincode: data.pincode.trim(),
        };

        const res = await apiRequest("POST", "/api/vendor/profile", payload);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Server error: ${res.status}`);
        }

        return res.json();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "You've successfully registered as a vendor. Your business profile is now active!",
        variant: "default",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/profile"] });
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register as vendor. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 mb-4">
          <AlertCircle className="h-6 w-6 text-orange-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Sign In Required</h2>
        <p className="text-gray-600 mb-6">You need to sign in to register as a vendor.</p>
        <Button asChild size="lg">
          <a href="/api/login">Sign In Now</a>
        </Button>
      </div>
    );
  }

  if (user?.role === "vendor" && profile) {
    return (
      <div className="text-center py-12 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Already Registered</h2>
        <p className="text-gray-600 mb-6">You're already registered as a vendor. Visit your dashboard to manage your business profile.</p>
        <Button asChild size="lg">
          <a href="/dashboard">Go to Dashboard</a>
        </Button>
      </div>
    );
  }

  const selectedCategories = form.watch("categories");

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 px-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
          <Store className="h-8 w-8 text-orange-600" />
          Register as Vendor
        </h1>
        <p className="text-gray-600 mt-2">Set up your vendor/supplier business and reach customers across India</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vendor Business Profile
          </CardTitle>
          <CardDescription>Register your business and start selling materials and equipment</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit((data) => registrationMutation.mutate(data))} 
              className="space-y-6"
            >
              {/* Business Headline */}
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name/Headline</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Premium Building Materials & Hardware Store"
                        maxLength={100}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Your business name that appears on the marketplace
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Description */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your business, products, quality standards, and what makes you unique..."
                        maxLength={500}
                        rows={5}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value.length}/500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categories */}
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Categories</FormLabel>
                    <FormDescription>Select the categories of products you supply</FormDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {VENDOR_CATEGORIES.map((category) => (
                        <div
                          key={category}
                          onClick={() => {
                            const newCategories = selectedCategories.includes(category)
                              ? selectedCategories.filter(c => c !== category)
                              : [...selectedCategories, category];
                            field.onChange(newCategories);
                          }}
                          className={`px-3 py-1 rounded-full cursor-pointer text-sm font-medium transition ${
                            selectedCategories.includes(category)
                              ? "bg-orange-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="businessPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+91 98765 43210"
                          maxLength={20}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Information */}
              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Street address, building number"
                        maxLength={200}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Details */}
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="6-digit code"
                          maxLength={6}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={registrationMutation.isPending}
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="lg"
              >
                {registrationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Complete Vendor Registration"
                )}
              </Button>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>🔒 Your information is secure:</strong> Your business data is encrypted and stored securely. 
                  We'll never share your information with third parties without your consent.
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
