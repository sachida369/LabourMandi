import { 
  users, technicianProfiles, listings, jobs, bids, wallets, 
  walletTransactions, reports, reviews, notifications,
  type User, type InsertUser, type UpsertUser,
  type TechnicianProfile, type InsertTechnicianProfile,
  type Listing, type InsertListing,
  type Job, type InsertJob,
  type Bid, type InsertBid,
  type Report, type InsertReport,
  type Review, type InsertReview,
  type Wallet, type WalletTransaction,
  type Notification, type KycDocument, type Subscription
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  getTechnicianProfile(userId: string): Promise<TechnicianProfile | undefined>;
  createTechnicianProfile(profile: InsertTechnicianProfile): Promise<TechnicianProfile>;
  updateTechnicianProfile(userId: string, data: Partial<TechnicianProfile>): Promise<TechnicianProfile | undefined>;
  getAllTechnicians(): Promise<(User & { technicianProfile: TechnicianProfile | null })[]>;
  
  getListing(id: string): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: string, data: Partial<Listing>): Promise<Listing | undefined>;
  getAllListings(): Promise<Listing[]>;
  getListingsByUser(userId: string): Promise<Listing[]>;
  
  getJob(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, data: Partial<Job>): Promise<Job | undefined>;
  getAllJobs(): Promise<Job[]>;
  getJobsByUser(userId: string): Promise<Job[]>;
  
  getBid(id: string): Promise<Bid | undefined>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateBid(id: string, data: Partial<Bid>): Promise<Bid | undefined>;
  getBidsByJob(jobId: string): Promise<Bid[]>;
  getBidsByVendor(vendorId: string): Promise<Bid[]>;
  
  getWallet(userId: string): Promise<Wallet | undefined>;
  createWallet(userId: string): Promise<Wallet>;
  updateWallet(userId: string, data: Partial<Wallet>): Promise<Wallet | undefined>;
  getWalletTransactions(walletId: string): Promise<WalletTransaction[]>;
  
  createReport(report: InsertReport): Promise<Report>;
  getReports(): Promise<Report[]>;
  updateReport(id: string, data: Partial<Report>): Promise<Report | undefined>;
  
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByUser(userId: string): Promise<Review[]>;
  
  createNotification(notification: { userId: string; title: string; message: string; type: string }): Promise<Notification>;
  getNotifications(userId: string): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const name = userData.name || 
      [userData.firstName, userData.lastName].filter(Boolean).join(" ") || 
      userData.email?.split("@")[0] || "User";
    
    const [user] = await db
      .insert(users)
      .values({
        id: userData.id,
        email: userData.email || "",
        name,
        avatar: userData.avatar || userData.profileImageUrl,
        role: "user",
        isOnline: true,
        isBanned: false,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email || undefined,
          name,
          avatar: userData.avatar || userData.profileImageUrl,
          isOnline: true,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    const existingWallet = await this.getWallet(user.id);
    if (!existingWallet) {
      await this.createWallet(user.id);
    }
    
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    await this.createWallet(user.id);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getTechnicianProfile(userId: string): Promise<TechnicianProfile | undefined> {
    const [profile] = await db.select().from(technicianProfiles).where(eq(technicianProfiles.userId, userId));
    return profile;
  }

  async createTechnicianProfile(profile: InsertTechnicianProfile): Promise<TechnicianProfile> {
    const [techProfile] = await db.insert(technicianProfiles).values(profile).returning();
    return techProfile;
  }

  async updateTechnicianProfile(userId: string, data: Partial<TechnicianProfile>): Promise<TechnicianProfile | undefined> {
    const [profile] = await db
      .update(technicianProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(technicianProfiles.userId, userId))
      .returning();
    return profile;
  }

  async getAllTechnicians(): Promise<(User & { technicianProfile: TechnicianProfile | null })[]> {
    const vendorUsers = await db.select().from(users).where(eq(users.role, "vendor"));
    const result = await Promise.all(
      vendorUsers.map(async (user) => {
        const profile = await this.getTechnicianProfile(user.id);
        return { ...user, technicianProfile: profile || null };
      })
    );
    return result;
  }

  async getListing(id: string): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async createListing(listing: InsertListing): Promise<Listing> {
    const [newListing] = await db.insert(listings).values(listing).returning();
    return newListing;
  }

  async updateListing(id: string, data: Partial<Listing>): Promise<Listing | undefined> {
    const [listing] = await db
      .update(listings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(listings.id, id))
      .returning();
    return listing;
  }

  async getAllListings(): Promise<Listing[]> {
    return db.select().from(listings).where(eq(listings.status, "active")).orderBy(desc(listings.createdAt));
  }

  async getListingsByUser(userId: string): Promise<Listing[]> {
    return db.select().from(listings).where(eq(listings.userId, userId));
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJob(id: string, data: Partial<Job>): Promise<Job | undefined> {
    const [job] = await db
      .update(jobs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async getAllJobs(): Promise<Job[]> {
    return db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJobsByUser(userId: string): Promise<Job[]> {
    return db.select().from(jobs).where(eq(jobs.userId, userId)).orderBy(desc(jobs.createdAt));
  }

  async getBid(id: string): Promise<Bid | undefined> {
    const [bid] = await db.select().from(bids).where(eq(bids.id, id));
    return bid;
  }

  async createBid(bid: InsertBid): Promise<Bid> {
    const [newBid] = await db.insert(bids).values(bid).returning();
    const job = await this.getJob(bid.jobId);
    if (job) {
      await this.updateJob(job.id, { bidCount: (job.bidCount || 0) + 1 });
    }
    return newBid;
  }

  async updateBid(id: string, data: Partial<Bid>): Promise<Bid | undefined> {
    const [bid] = await db
      .update(bids)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bids.id, id))
      .returning();
    return bid;
  }

  async getBidsByJob(jobId: string): Promise<Bid[]> {
    return db.select().from(bids).where(eq(bids.jobId, jobId)).orderBy(desc(bids.createdAt));
  }

  async getBidsByVendor(vendorId: string): Promise<Bid[]> {
    return db.select().from(bids).where(eq(bids.vendorId, vendorId)).orderBy(desc(bids.createdAt));
  }

  async getWallet(userId: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
    return wallet;
  }

  async createWallet(userId: string): Promise<Wallet> {
    const [wallet] = await db.insert(wallets).values({ userId, balance: "0", escrowBalance: "0" }).returning();
    return wallet;
  }

  async updateWallet(userId: string, data: Partial<Wallet>): Promise<Wallet | undefined> {
    const [wallet] = await db
      .update(wallets)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(wallets.userId, userId))
      .returning();
    return wallet;
  }

  async getWalletTransactions(walletId: string): Promise<WalletTransaction[]> {
    return db.select().from(walletTransactions).where(eq(walletTransactions.walletId, walletId)).orderBy(desc(walletTransactions.createdAt));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async getReports(): Promise<Report[]> {
    return db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async updateReport(id: string, data: Partial<Report>): Promise<Report | undefined> {
    const [report] = await db
      .update(reports)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(reports.id, id))
      .returning();
    return report;
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.revieweeId, userId)).orderBy(desc(reviews.createdAt));
  }

  async createNotification(notification: { userId: string; title: string; message: string; type: string }): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values({
      ...notification,
      isRead: false,
    }).returning();
    return newNotification;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async markNotificationRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();
