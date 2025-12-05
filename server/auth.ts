// server/auth.ts
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { ensureGoogleStrategy } from "./googleAuth";

/**
 * getSession - returns an express-session middleware configured with either:
 *  - pg store (if DATABASE_URL set), or
 *  - in-memory store (memorystore) for development
 *
 * Required env:
 *  - SESSION_SECRET
 *  - DATABASE_URL (optional)
 */

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 7 days

  let store: any;
  if (process.env.DATABASE_URL) {
    const PgStore = connectPg(session);
    store = new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: sessionTtl / 1000, // in seconds for connect-pg-simple
      tableName: "sessions",
    });
  } else {
    const MemoryStore = createMemoryStore(session);
    store = new MemoryStore({
      checkPeriod: sessionTtl,
    });
    console.warn("Using in-memory session store (DATABASE_URL not set)");
  }

  const isProduction = process.env.NODE_ENV === "production";

  if (!process.env.SESSION_SECRET) {
    console.warn("SESSION_SECRET is not set - sessions will not be secure for production.");
  }

  return session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: sessionTtl,
    },
  });
}

/**
 * setupAuth - mounts passport/session and auth routes onto an Express app
 *
 * Routes:
 *  - GET /api/auth/google    -> starts OAuth (redirect to Google)
 *  - GET /api/auth/google/callback  -> Google callback; redirects to "/"
 *  - GET /api/logout -> logs out user and redirects to root
 *
 * IMPORTANT: ensure getSession() has already been applied before this is used.
 */
export async function setupAuth(app: Express) {
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Ensure Google strategy registered (no-op if env not present)
  ensureGoogleStrategy();

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // start auth
  app.get("/api/auth/google", (req, res, next) => {
    // initiate google auth
    return passport.authenticate("google", {
      scope: ["openid", "email", "profile", "https://www.googleapis.com/auth/userinfo.profile"],
      accessType: "offline", // for refresh token
      prompt: "consent",
    })(req, res, next);
  });

  // callback
  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/",
      successReturnToOrRedirect: "/",
    }),
  );

  // logout
  app.get("/api/logout", (req, res, next) => {
    const redirectUrl = req.query.redirect || "/";
    req.logout((err) => {
      if (err) return next(err);
      // optionally revoke tokens here if you stored them and want to revoke at provider
      res.redirect(String(redirectUrl));
    });
  });
}

/**
 * isAuthenticated - middleware to protect API routes
 * For simplicity we check req.isAuthenticated() and presence of user object.
 */
export const isAuthenticated: RequestHandler = (req, res, next) => {
  const user = req.user as any;
  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};
