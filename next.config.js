/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a0.muscache.com",
        port: "",
        pathname: "/im/pictures/**",
      },
      {
        // protocol: "https",
        hostname: "archziner.com",
        // port: "",
        // pathname: "/im/pictures/**",
      },

      {
        hostname: "www.iwantthatdoor.com",
        // port: "",
        // pathname: "/im/pictures/**",
      },
      {
        hostname: "trpc-test.s3.amazonaws.com",

        // port: "",
        // pathname: "/im/pictures/**",
      },
      {
        protocol: "https",
        hostname: "trpc-test.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "www.vrbo.com",
      },
      {
        protocol: "https",
        hostname: "images.trvl-media.com",
      },
      {
        protocol: "https",
        hostname: "orbirental-images.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "hallson.co",
      },
      {
        protocol: "https",
        hostname: "www.killingtongroup.com",
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
};

export default config;
