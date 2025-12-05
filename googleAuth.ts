import passport from "passport";
import session from "express-session";
import { Express, RequestHandler } from "express";

import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// -------------------------
// SESSION CONFIG
// -------------------------
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;

  let sessionStore;
  if (process.env.DATABASE_URL) {
    const PgStore = connectPg(session);
    sessionStore = new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: "sessions",
    });
  } else {
    const MemoryStore = createMemoryStore(session);
    sessionStore = new MemoryStore({ checkPeriod: sessionTtl });
    console.warn("Using memory session store (DATABASE_URL not set)");
  }

  const isProduction = process.env.NODE_ENV === "production";

  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
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

// -------------------------
// SAVE USER TO DATABASE
// -------------------------
async function upsertUser(profile: any) {
  const firstName = profile.name?.givenName || "";
  const lastName = profile.name?.familyName || "";
  const email = profile.emails?.[0]?.value;
  const avatar = profile.photos?.[0]?.value;

  await storage.upsertUser({
    id: profile.id,
    email,
    name: profile.displayName,
    avatar,
    firstName,
    lastName,
    profileImageUrl: avatar,
  });
}

// -------------------------
// GOOGLE AUTH SETUP
// -------------------------
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_REDIRECT_URI!,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          await upsertUser(profile);
          const user = {
            id: profile.id,
            profile,
            accessToken,
            refreshToken,
          };
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  // -------------------------
  // ROUTES
  // -------------------------
  app.get("/api/login", passport.authenticate("google", {
    scope: ["profile", "email"],
  }));

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/api/login",
    })
  );

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
}

// -------------------------
// AUTH MIDDLEWARE
// -------------------------
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
