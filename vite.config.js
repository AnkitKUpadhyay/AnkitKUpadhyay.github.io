import { defineConfig } from "vite";

// The first paint of each prerendered page includes its habitat and typography.
export default defineConfig({ build: { cssCodeSplit: false } });
