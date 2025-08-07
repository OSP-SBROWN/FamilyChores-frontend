import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from "@react-router/dev/config";

export default {
  // Enable SSR for API routes to work properly on Vercel
  ssr: true,
  
  // Add Vercel preset for enhanced functionality
  presets: [vercelPreset()],
  
  // Configure build output
  buildDirectory: "build",
} satisfies Config;
