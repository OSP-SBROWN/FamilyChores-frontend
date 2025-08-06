import type { Config } from "@react-router/dev/config";

export default {
  // Enable SPA mode for Vercel deployment
  ssr: false,
  
  // Configure build output
  buildDirectory: "build",
} satisfies Config;
