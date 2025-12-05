import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/technicians", async (req, res) => {
    try {
      const technicians = await storage.getAllTechnicians();
      res.json(technicians);
    } catch (error) {
      console.error("Get technicians error:", error);
      res.status(500).json({ error: "Failed to get technicians" });
    }
  });

  app.get("/api/technicians/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "Technician not found" });
      }

      const profile = await storage.getTechnicianProfile(user.id);
      res.json({ ...user, technicianProfile: profile || null });
    } catch (error) {
      console.error("Get technician error:", error);
      res.status(500).json({ error: "Failed to get technician" });
    }
  });

  app.get("/api/technicians/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByUser(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({ error: "Failed to get reviews" });
    }
  });

  app.post("/api/technicians/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const existingProfile = await storage.getTechnicianProfile(userId);
      
      if (existingProfile) {
        const updated = await storage.updateTechnicianProfile(userId, req.body);
        return res.json(updated);
      }
      
      await storage.updateUser(userId, { role: "vendor" });
      const profile = await storage.createTechnicianProfile({ userId, ...req.body });
      res.json(profile);
    } catch (error) {
      console.error("Create/update technician profile error:", error);
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  app.get("/api/listings", async (req, res) => {
    try {
      const listings = await storage.getAllListings();
      res.json(listings);
    } catch (error) {
      console.error("Get listings error:", error);
      res.status(500).json({ error: "Failed to get listings" });
    }
  });

  app.post("/api/listings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const listing = await storage.createListing({ ...req.body, userId });
      res.json(listing);
    } catch (error) {
      console.error("Create listing error:", error);
      res.status(500).json({ error: "Failed to create listing" });
    }
  });

  app.get("/api/listings/:id", async (req, res) => {
    try {
      const listing = await storage.getListing(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      console.error("Get listing error:", error);
      res.status(500).json({ error: "Failed to get listing" });
    }
  });

  app.get("/api/listings/my", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const listings = await storage.getListingsByUser(userId);
      res.json(listings);
    } catch (error) {
      console.error("Get my listings error:", error);
      res.status(500).json({ error: "Failed to get listings" });
    }
  });

  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      const jobsWithUsers = await Promise.all(
        jobs.map(async (job) => {
          const user = await storage.getUser(job.userId);
          return { ...job, user: user || undefined };
        })
      );
      res.json(jobsWithUsers);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ error: "Failed to get jobs" });
    }
  });

  app.post("/api/jobs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const job = await storage.createJob({ ...req.body, userId });
      
      await storage.createNotification({
        userId,
        title: "Job Posted",
        message: `Your job "${job.title}" has been posted successfully!`,
        type: "job_created",
      });
      
      res.json(job);
    } catch (error) {
      console.error("Create job error:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.get("/api/jobs/my", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const jobs = await storage.getJobsByUser(userId);
      res.json(jobs);
    } catch (error) {
      console.error("Get my jobs error:", error);
      res.status(500).json({ error: "Failed to get jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      const user = await storage.getUser(job.userId);
      res.json({ ...job, user: user || undefined });
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({ error: "Failed to get job" });
    }
  });

  app.put("/api/jobs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const job = await storage.getJob(req.params.id);
      
      if (!job || job.userId !== userId) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      const updated = await storage.updateJob(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Update job error:", error);
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  app.get("/api/jobs/:id/bids", async (req, res) => {
    try {
      const bids = await storage.getBidsByJob(req.params.id);
      const bidsWithVendors = await Promise.all(
        bids.map(async (bid) => {
          const vendor = await storage.getUser(bid.vendorId);
          const profile = vendor ? await storage.getTechnicianProfile(vendor.id) : null;
          return { 
            ...bid, 
            vendor: vendor ? { ...vendor, technicianProfile: profile } : undefined 
          };
        })
      );
      res.json(bidsWithVendors);
    } catch (error) {
      console.error("Get bids error:", error);
      res.status(500).json({ error: "Failed to get bids" });
    }
  });

  app.post("/api/jobs/:id/bids", isAuthenticated, async (req: any, res) => {
    try {
      const vendorId = req.user.claims.sub;
      const { amount, message, deliveryTime } = req.body;
      
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      
      const bid = await storage.createBid({
        jobId: req.params.id,
        vendorId,
        amount,
        message,
        deliveryTime,
        status: "pending",
      });
      
      await storage.createNotification({
        userId: job.userId,
        title: "New Bid Received",
        message: `You received a new bid of ₹${amount} on your job "${job.title}"`,
        type: "new_bid",
      });
      
      res.json(bid);
    } catch (error) {
      console.error("Create bid error:", error);
      res.status(500).json({ error: "Failed to create bid" });
    }
  });

  app.put("/api/bids/:id/accept", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bid = await storage.getBid(req.params.id);
      
      if (!bid) {
        return res.status(404).json({ error: "Bid not found" });
      }
      
      const job = await storage.getJob(bid.jobId);
      if (!job || job.userId !== userId) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      await storage.updateBid(bid.id, { status: "accepted" });
      await storage.updateJob(job.id, { status: "in_progress", assignedTo: bid.vendorId });
      
      const otherBids = await storage.getBidsByJob(job.id);
      for (const otherBid of otherBids) {
        if (otherBid.id !== bid.id) {
          await storage.updateBid(otherBid.id, { status: "rejected" });
        }
      }
      
      await storage.createNotification({
        userId: bid.vendorId,
        title: "Bid Accepted!",
        message: `Your bid on "${job.title}" has been accepted!`,
        type: "bid_accepted",
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Accept bid error:", error);
      res.status(500).json({ error: "Failed to accept bid" });
    }
  });

  app.get("/api/bids/my", isAuthenticated, async (req: any, res) => {
    try {
      const vendorId = req.user.claims.sub;
      const bids = await storage.getBidsByVendor(vendorId);
      
      const bidsWithJobs = await Promise.all(
        bids.map(async (bid) => {
          const job = await storage.getJob(bid.jobId);
          return { ...bid, job };
        })
      );
      
      res.json(bidsWithJobs);
    } catch (error) {
      console.error("Get my bids error:", error);
      res.status(500).json({ error: "Failed to get bids" });
    }
  });

  app.get("/api/wallet", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let wallet = await storage.getWallet(userId);
      
      if (!wallet) {
        wallet = await storage.createWallet(userId);
      }
      
      res.json(wallet);
    } catch (error) {
      console.error("Get wallet error:", error);
      res.status(500).json({ error: "Failed to get wallet" });
    }
  });

  app.get("/api/wallet/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const wallet = await storage.getWallet(userId);
      
      if (!wallet) {
        return res.json([]);
      }
      
      const transactions = await storage.getWalletTransactions(wallet.id);
      res.json(transactions);
    } catch (error) {
      console.error("Get wallet transactions error:", error);
      res.status(500).json({ error: "Failed to get transactions" });
    }
  });

  app.get("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ error: "Failed to get notifications" });
    }
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req: any, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(500).json({ error: "Failed to update notification" });
    }
  });

  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const techProfile = await storage.getTechnicianProfile(userId);
      res.json({ ...user, technicianProfile: techProfile });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  app.put("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updated = await storage.updateUser(userId, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.get("/api/admin/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      const technicians = await storage.getAllTechnicians();
      const listings = await storage.getAllListings();
      const jobs = await storage.getAllJobs();
      const reports = await storage.getReports();

      res.json({
        totalUsers: users.length,
        totalTechnicians: technicians.length,
        totalListings: listings.length,
        totalJobs: jobs.length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        pendingKYC: 0,
        totalRevenue: 0,
        activeJobs: jobs.filter(j => j.status === 'open' || j.status === 'in_progress').length,
      });
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Get admin users error:", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  app.post("/api/admin/users/:id/ban", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const adminUser = await storage.getUser(userId);
      
      if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "superadmin")) {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const { ban, reason } = req.body;
      const user = await storage.updateUser(req.params.id, { 
        isBanned: ban,
        banReason: ban ? (reason || "Banned by admin") : null 
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Ban user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.get("/api/admin/reports", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      console.error("Get admin reports error:", error);
      res.status(500).json({ error: "Failed to get reports" });
    }
  });

  app.post("/api/admin/reports/:id/resolve", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const { status, resolution } = req.body;
      const report = await storage.updateReport(req.params.id, { 
        status, 
        resolution,
        resolvedBy: userId,
      });
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Resolve report error:", error);
      res.status(500).json({ error: "Failed to resolve report" });
    }
  });

  app.post("/api/reports", isAuthenticated, async (req: any, res) => {
    try {
      const reporterId = req.user.claims.sub;
      const report = await storage.createReport({ ...req.body, reporterId });
      res.json(report);
    } catch (error) {
      console.error("Create report error:", error);
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  return httpServer;
}
