// tests/vitest.setup.ts
// Runs before every test file — mocks firebase-admin globally
import { vi } from "vitest";

vi.mock("firebase-admin", () => ({
  default: {
    apps: [],
    initializeApp: vi.fn(),
    credential: {
      cert: vi.fn(),
    },
    auth: vi.fn(() => ({
      verifyIdToken: vi.fn(),
    })),
  },
}));
