import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals:     true,
    environment: "node",
    include:     ["**/*.test.ts"], 
    setupFiles:  ["./tests/vitest.setup.ts"],   
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include:  ["src/**/*.ts"],
      exclude:  ["src/server.ts", "src/lib/prisma.ts", "src/lib/firebase.ts"],
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  esbuild: {
    target: "es2020",
  },
});