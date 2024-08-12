export const authProviders = [
  {
    id: "google",
    name: "Google",
    type: "oauth",
    signinUrl: "https://www.tramona.com/api/auth/signin/google",
    callbackUrl: "https://www.tramona.com/api/auth/callback/google",
  },
] as const;
