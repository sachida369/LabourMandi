import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, pgEnum, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const userRoleEnum = pgEnum('user_role', ['user', 'vendor', 'admin', 'superadmin']);
export const listingTypeEnum = pgEnum('listing_type', ['buy', 'sell', 'rent']);
export const listingStatusEnum = pgEnum('listing_status', ['active', 'pending', 'hidden', 'removed']);
export const jobStatusEnum = pgEnum('job_status', ['open', 'in_progress', 'completed', 'cancelled']);
export const bidStatusEnum = pgEnum('bid_status', ['pending', 'shortlisted', 'accepted', 'rejected']);
export const kycStatusEnum = pgEnum('kyc_status', ['pending', 'submitted', 'verified', 'rejected']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['trialing', 'active', 'expired', 'cancelled']);
export const reportStatusEnum = pgEnum('report_status', ['pending', 'reviewed', 'resolved', 'dismissed']);
export const transactionTypeEnum = pgEnum('transaction_type', ['credit', 'debit', 'refund', 'escrow_hold', 'escrow_release']);

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  firebaseUid: varchar("firebase_uid", { length: 255 }).unique(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  name: text("name").notNull(),
  avatar: text("avatar"),
  role: userRoleEnum("role").default('user').notNull(),
  isOnline: boolean("is_online").default(false),
  lastActive: timestamp("last_active").defaultNow(),
  city: text("city"),
  state: text("state"),
  pincode: varchar("pincode", { length: 10 }),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isBanned: boolean("is_banned").default(false),
  banReason: text("ban_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const kycDocuments = pgTable("kyc_documents", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  documentType: text("document_type").notNull(),
  documentNumber: varchar("document_number", { length: 100 }),
  documentUrl: text("document_url").notNull(),
  status: kycStatusEnum("status").default('pending').notNull(),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: varchar("verified_by", { length: 255 }).references(() => users.id),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const technicianProfiles = pgTable("technician_profiles", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id).unique(),
  headline: text("headline"),
  bio: text("bio"),
  skills: text("skills").array(),
  categories: text("categories").array(),
  experience: integer("experience").default(0),
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: integer("total_reviews").default(0),
  completedJobs: integer("completed_jobs").default(0),
  portfolioImages: text("portfolio_images").array(),
  certificates: text("certificates").array(),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const listings = pgTable("listings", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: listingTypeEnum("type").notNull(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }),
  priceType: text("price_type"),
  images: text("images").array(),
  city: text("city"),
  state: text("state"),
  pincode: varchar("pincode", { length: 10 }),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  status: listingStatusEnum("status").default('active').notNull(),
  views: integer("views").default(0),
  reportCount: integer("report_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  budgetMin: decimal("budget_min", { precision: 12, scale: 2 }),
  budgetMax: decimal("budget_max", { precision: 12, scale: 2 }),
  timeline: text("timeline"),
  urgency: text("urgency").default('normal'),
  images: text("images").array(),
  city: text("city"),
  state: text("state"),
  pincode: varchar("pincode", { length: 10 }),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  status: jobStatusEnum("status").default('open').notNull(),
  assignedTo: varchar("assigned_to", { length: 255 }).references(() => users.id),
  bidCount: integer("bid_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bids = pgTable("bids", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id", { length: 255 }).notNull().references(() => jobs.id),
  vendorId: varchar("vendor_id", { length: 255 }).notNull().references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  message: text("message"),
  deliveryTime: text("delivery_time"),
  status: bidStatusEnum("status").default('pending').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wallets = pgTable("wallets", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id).unique(),
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0").notNull(),
  escrowBalance: decimal("escrow_balance", { precision: 12, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id", { length: 255 }).notNull().references(() => wallets.id),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  razorpayOrderId: varchar("razorpay_order_id", { length: 255 }),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 }),
  jobId: varchar("job_id", { length: 255 }).references(() => jobs.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id).unique(),
  status: subscriptionStatusEnum("status").default('trialing').notNull(),
  trialStartDate: timestamp("trial_start_date").defaultNow().notNull(),
  trialEndDate: timestamp("trial_end_date"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  reporterId: varchar("reporter_id", { length: 255 }).notNull().references(() => users.id),
  targetType: text("target_type").notNull(),
  targetId: varchar("target_id", { length: 255 }).notNull(),
  reason: text("reason").notNull(),
  description: text("description"),
  evidence: text("evidence").array(),
  status: reportStatusEnum("status").default('pending').notNull(),
  resolvedBy: varchar("resolved_by", { length: 255 }).references(() => users.id),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const adminActions = pgTable("admin_actions", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id", { length: 255 }).notNull().references(() => users.id),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: varchar("target_id", { length: 255 }).notNull(),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id", { length: 255 }).notNull().references(() => jobs.id),
  reviewerId: varchar("reviewer_id", { length: 255 }).notNull().references(() => users.id),
  revieweeId: varchar("reviewee_id", { length: 255 }).notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  isRead: boolean("is_read").default(false),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  technicianProfile: one(technicianProfiles, { fields: [users.id], references: [technicianProfiles.userId] }),
  wallet: one(wallets, { fields: [users.id], references: [wallets.userId] }),
  subscription: one(subscriptions, { fields: [users.id], references: [subscriptions.userId] }),
  kycDocuments: many(kycDocuments),
  listings: many(listings),
  jobs: many(jobs),
  bids: many(bids),
  reports: many(reports),
  notifications: many(notifications),
}));

export const technicianProfilesRelations = relations(technicianProfiles, ({ one }) => ({
  user: one(users, { fields: [technicianProfiles.userId], references: [users.id] }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  user: one(users, { fields: [jobs.userId], references: [users.id] }),
  assignedVendor: one(users, { fields: [jobs.assignedTo], references: [users.id] }),
  bids: many(bids),
  reviews: many(reviews),
}));

export const bidsRelations = relations(bids, ({ one }) => ({
  job: one(jobs, { fields: [bids.jobId], references: [jobs.id] }),
  vendor: one(users, { fields: [bids.vendorId], references: [users.id] }),
}));

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTechnicianProfileSchema = createInsertSchema(technicianProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertListingSchema = createInsertSchema(listings).omit({ id: true, createdAt: true, updatedAt: true, views: true, reportCount: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true, updatedAt: true, bidCount: true });
export const insertBidSchema = createInsertSchema(bids).omit({ id: true, createdAt: true, updatedAt: true });
export const insertReportSchema = createInsertSchema(reports).omit({ id: true, createdAt: true, updatedAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = {
  id: string;
  email?: string | null;
  name?: string;
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
};
export type TechnicianProfile = typeof technicianProfiles.$inferSelect;
export type InsertTechnicianProfile = z.infer<typeof insertTechnicianProfileSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type AdminAction = typeof adminActions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type KycDocument = typeof kycDocuments.$inferSelect;
