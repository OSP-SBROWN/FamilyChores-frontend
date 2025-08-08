import type { Config } from "@react-router/dev/config";

export default {
  // Build as a pure SPA. API is hosted on Railway, so no server routes/functions.
  ssr: false,
  
  // Configure build output
  buildDirectory: "build",
} satisfies Config;
