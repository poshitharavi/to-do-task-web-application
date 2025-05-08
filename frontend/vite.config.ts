import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { UserConfig as VitestUserConfig } from "vitest/config";

interface CombinedUserConfig extends UserConfig, VitestUserConfig {}

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
  },
} as CombinedUserConfig);
