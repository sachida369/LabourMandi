import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { VerifyCallback } from "passport-google-oauth20";
import { storage } from "./storage";

/**
 * Register Google OAuth strategy with passport.
 * Expects env vars:
 *  - GOOGLE_CLIENT_ID
 *  - GOOGLE_CLIENT_SECRET
 *  - GOOGLE_REDIRECT_URI  (full redirect URI)
 *
 * The verify callback will:
 *  - create/upsert the user via storage.upsertUser
 *  - attach tokens & claims to the user object returned to session
 */

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
  // Do not throw at import time in case you want to use a different auth (shim will guard)
  console.warn("Google OAuth environment variables not fully provided. GOOGLE_CLIENT_ID / SECRET / REDIRECT_URI recommended.");
}

export function ensureGoogleStrategy() {
  const name = "google";

  // If already registered, skip
  if ((passport as any)._strategy && (passport as any)._strategy[name]) return;

  const strategy = new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_REDIRECT_URI || "/api/auth/google/callback",
      passReqToCallback: false,
    },
    // verify
    async (accessToken: string, refreshToken: string | undefined, profile: any, done: VerifyCallback) => {
      try {
        const claims = {
          sub: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          first_name: profile.name?.givenName,
          last_name: profile.name?.familyName,
          profile_image_url: profile.photos?.[0]?.value,
        };

        // Upsert user to DB if DATABASE_URL exists (storage.upsertUser is no-op if DB not configured)
        await storage.upsertUser({
          id: claims.sub,
          email: claims.email,
          name: claims.name,
          avatar: claims.profile_image_url,
          firstName: claims.first_name,
          lastName: claims.last_name,
          profileImageUrl: claims.profile_image_url,
        });

        // Build a user object that we store in session
        const user: any = {
          id: claims.sub,
          email: claims.email,
          name: claims.name,
          avatar: claims.profile_image_url,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: undefined, // passport-google-oauth20 doesn't expose exp directly; tokens may be short-lived
          claims,
        };

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    },
  );

  passport.use(name, strategy);
}
