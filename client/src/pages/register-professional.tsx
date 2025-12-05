import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { AlertCircle, CheckCircle, Loader2, Award, FileText } from "lucide-react";
import type { User as UserType } from "@shared/schema";

const PROFESSIONAL_CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Carpentry",
  "Painting",
  "AC & Appliances",
  "Welding",
  "Masonry",
  "Maintenance",
  "Cleaning",
  "Other"
];

const EXPERIENCE_LEVELS = [
  { value: "1", label: "1 Year" },
  { value: "2", label: "2 Years" },
  { value: "3", label: "3 Years" },
  { value: "5", label: "5 Years" },
  { value: "10", label: "10 Years" },
  { value: "15", label: "15+ Years" }
];

const professionalRegistrationSchema = z.object({
  headline: z
    .string()
    .min(10, "Headline must be at least 10 characters")
    .max(100, "Headline must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-&,'.]*$/, "Headline contains invalid characters"),
  
  bio: z
    .string()
    .min(20, "Bio must be at least 20 characters")
    .max(500, "Bio must be less than 500 characters")
    .regex(/^[a-zA-Z0-9\s\-&,'.\n]*$/, "Bio contains invalid characters"),
  
  categories: z
    .array(z.string())
    .min(1, "Select at least one category")
    .max(5, "Select at most 5 categories"),
  
  skills: z
    .string()
    .transform(s => s.split(",").map(skill => skill.trim()).filter(Boolean))
    .refine(arr => arr.length > 0, "Enter at least one skill")
    .refine(arr => arr.length <= 10, "Enter at most 10 skills")
    .refine(
      arr => arr.every(skill => /^[a-zA-Z0-9\s\-&]*$/.test(skill) && skill.length <= 50),
      "Skills contain invalid characters or are too long"
    ),
  
  experience: z
    .string()
    .transform(Number)
    .pipe(z.number().min(0, "Experience must be 0 or more").max(70, "Enter a valid experience")),
  
  dailyRate: z
    .string()
    .transform(val => val === "" ? undefined : parseFloat(val))
    .refine(val => val === undefined || (!isNaN(val) && val > 0), "Enter a valid daily rate")
    .refine(val => val === undefined || val <= 999999, "Daily rate is too high"),
  
  hourlyRate: z
    .string()
    .transform(val => val === "" ? undefined : parseFloat(val))
    .refine(val => val === undefined || (!isNaN(val) && val > 0), "Enter a valid hourly rate")
    .refine(val => val === undefined || val <= 99999, "Hourly rate is too high"),
});

type ProfessionalRegistrationData = z.infer<typeof professionalRegistrationSchema>;

export default function RegisterProfessionalPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/technicians/profile"],
    enabled: isAuthenticated,
    retry: false,
  });

  const form = useForm<ProfessionalRegistrationData>({
    resolver: zodResolver(professionalRegistrationSchema),
    defaultValues: {
      headline: "",
      bio: "",
      categories: [],
      skills: "",
      experience: 0,
      dailyRate: "",
      hourlyRate: "",
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: ProfessionalRegistrationData) => {
      try {
        const payload = {
          headline: data.headline.trim(),
          bio: data.bio.trim(),
          categories: data.categories,
          skills: data.skills,
          experience: data.experience,
          dailyRate: data.dailyRate ? data.dailyRate.toString() : undefined,
          hourlyRate: data.hourlyRate ? data.hourlyRate.toString() : undefined,
          isAvailable: true,
        };

        const res = await apiRequest("POST", "/api/technicians/profile", payload);
        
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
        description: "You've successfully registered as a professional. Your profile is now active!",
        variant: "default",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/technicians/profile"] });
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register as professional. Please try again.",
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
        <p className="text-gray-600 mb-6">You need to sign in to register as a professional.</p>
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
        <p className="text-gray-600 mb-6">You're already registered as a professional. Visit your dashboard to manage your profile.</p>
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
          <Award className="h-8 w-8 text-orange-600" />
          Register as Professional
        </h1>
        <p className="text-gray-600 mt-2">Create your professional profile and start offering services on LabourMandi</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Professional Profile
          </CardTitle>
          <CardDescription>Share your expertise and attract customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit((data) => registrationMutation.mutate(data))} 
              className="space-y-6"
            >
              {/* Professional Headline */}
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Headline</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Expert Electrician with 15+ Years Experience"
                        maxLength={100}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A brief title that appears on your profile
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your experience, specialties, and what makes you unique..."
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
                    <FormLabel>Service Categories</FormLabel>
                    <FormDescription>Select the categories you specialize in</FormDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {PROFESSIONAL_CATEGORIES.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategories.includes(category) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newCategories = selectedCategories.includes(category)
                              ? selectedCategories.filter(c => c !== category)
                              : [...selectedCategories, category];
                            field.onChange(newCategories);
                          }}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills */}
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Electrical Wiring, Panel Installation, Smart Home (comma-separated)"
                        maxLength={500}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      List your skills separated by commas (up to 10 skills)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Experience */}
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <Select value={field.value.toString()} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pricing */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dailyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Rate (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="e.g., 2500"
                          step="100"
                          min="0"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Rate in ₹ per day
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="e.g., 350"
                          step="50"
                          min="0"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Rate in ₹ per hour
                      </FormDescription>
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
                  "Complete Registration"
                )}
              </Button>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>🔒 Your information is secure:</strong> Your data is encrypted and stored securely. 
                  We'll never share your personal information with third parties without your consent.
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
