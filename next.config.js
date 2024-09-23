/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import NextBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
  rewrites: async () => [
    { source: "/privacy-policy", destination: "/html/privacy-policy.html" },
    { source: "/tos", destination: "/html/tos.html" },
    { source: "/casamundo-tos", destination: "/html/casamundo-tos.html" },
    {
      source: "/cb-island-vacations-tos",
      destination: "/html/cB-island-vacations-tos.html",
    },
    { source: "/cleanbnb-tos", destination: "/html/cleanbnb-tos.html" },
    { source: "/evolve-tos", destination: "/html/evolve-tos.html" },
    {
      source: "/integrityarizona-tos",
      destination: "/html/integrityarizona-tos.html",
    },
    {
      source: "/evolve-tos",
      destination: "/html/evolve-tos.html",
    },
    { source: "/redawning-tos", destination: "/html/redawning-tos.html" },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
    swcPlugins: [["next-superjson-plugin", {}]],
  },
};

export default NextBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(
  config,
);

// old remote patterns

// {
//   protocol: "https",
//   hostname: "a0.muscache.com",
//   port: "",
//   pathname: "/im/pictures/**",
// },
// {
//   // protocol: "https",
//   hostname: "archziner.com",
//   // port: "",
//   // pathname: "/im/pictures/**",
// },
// {
//   hostname: "www.iwantthatdoor.com",
//   // port: "",
//   // pathname: "/im/pictures/**",
// },
// {
//   protocol: "https",
//   hostname: "trpc-test.s3.amazonaws.com",
// },
// {
//   protocol: "https",
//   hostname: "www.vrbo.com",
// },
// {
//   protocol: "https",
//   hostname: "images.trvl-media.com",
// },
// {
//   protocol: "https",
//   hostname: "orbirental-images.s3.amazonaws.com",
// },
// {
//   protocol: "https",
//   hostname: "hallson.co",
// },
// {
//   protocol: "https",
//   hostname: "www.killingtongroup.com",
// },
// {
//   protocol: "https",
//   hostname: "tramona-map-screenshots.s3.us-east-1.amazonaws.com",
// },
// {
//   protocol: "https",
//   hostname: "www.airbnb.com",
// },
// {
//   protocol: "https",
//   hostname: "guesty-listing-images.s3.amazonaws.com",
// },
// {
//   protocol: "https",
//   hostname: "guestybookings.s3.amazonaws.com",
// },
// {
//   protocol: "https",
//   hostname: "assets.guesty.com",
// },
// {
//   protocol: "https",
//   hostname: "dx577khz83dc.cloudfront.net",
// },
// {
//   protocol: "https",
//   hostname: "res.cloudinary.com",
// },
// {
//   protocol: "http",
//   hostname: "localhost",
// },
// {
//   protocol: "https",
//   hostname: "tramona-images.s3.amazonaws.com",
// },
