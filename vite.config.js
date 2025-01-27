import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path"; // Add this import

export default defineConfig({
  base: "/", // Changed from './' to '/'
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "images";
          }
          return `${extType}/[name][extname]`;
        },
      },
    },
  },
  // Add base URL configuration
  base: "/",
  // Handle SPA routing
  server: {
    historyApiFallback: true,
  },
});
