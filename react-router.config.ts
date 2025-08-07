import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from "@react-router/dev/config";

export default {
  // Temporarily switch back to SPA mode to test API functions
  ssr: false,
  
  // Add Vercel preset for enhanced functionality
  presets: [vercelPreset()],
  
  // Configure build output
  buildDirectory: "build",
} satisfies Config;
