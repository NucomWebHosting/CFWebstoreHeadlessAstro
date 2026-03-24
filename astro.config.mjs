import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [react(), tailwind()],
  output: "static",
  adapter: node({
    mode: "standalone",
  }),
  session: {
    driver: "fs",
  },
  security: {
    checkOrigin: false,
  },
});
