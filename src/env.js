import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string(),
    EMAIL_FROM: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    STRIPE_RESTRICTED_KEY_ALL: z.string(),
    FACEBOOK_CLIENT_ID: z.string(),
    FACEBOOK_CLIENT_SECRET: z.string(),
    TWILIO_ACCOUNT_SID: z.string(),
    TWILIO_AUTH_TOKEN: z.string(),
    TWILIO_FROM: z.string(),
    TRAMONA_ADMIN_USER_ID: z.string(),
    ADMIN_TEAM_ID: z.coerce.number(),
    SLACK_TOKEN: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    REGION: z.string(),
    MAP_SCREENSHOTS_BUCKET_NAME: z.string(),
    RAPIDAPI_KEY: z.string(),
    RAPIDAPI_HOST: z.string(),
    GOOGLE_MAPS_KEY: z.string(),
    OCP_APIM_SUBSCRIPTION_KEY: z.string(),
    X_ENVIRONMENT: z.string(),
    HOSPITABLE_API_KEY: z.string(),
    PROXY_URL: z.string().url(),
    GEMINI_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_GOOGLE_PLACES_KEY: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    EMAIL_FROM: process.env.EMAIL_FROM,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GOOGLE_PLACES_KEY: process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_RESTRICTED_KEY_ALL: process.env.STRIPE_RESTRICTED_KEY_ALL,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_FROM: process.env.TWILIO_FROM,
    TRAMONA_ADMIN_USER_ID: process.env.TRAMONA_ADMIN_USER_ID,
    ADMIN_TEAM_ID: process.env.ADMIN_TEAM_ID,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SLACK_TOKEN: process.env.SLACK_TOKEN,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    REGION: process.env.REGION,
    MAP_SCREENSHOTS_BUCKET_NAME: process.env.MAP_SCREENSHOTS_BUCKET_NAME,
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
    RAPIDAPI_HOST: process.env.RAPIDAPI_HOST,
    GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY,
    OCP_APIM_SUBSCRIPTION_KEY: process.env.OCP_APIM_SUBSCRIPTION_KEY,
    X_ENVIRONMENT: process.env.X_ENVIRONMENT,
    HOSPITABLE_API_KEY: process.env.HOSPITABLE_API_KEY,
    PROXY_URL: process.env.PROXY_URL,
    GEMINI_KEY: process.env.GEMINI_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
