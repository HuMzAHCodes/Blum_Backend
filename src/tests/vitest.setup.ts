// src/tests/vitest.setup.ts
import { vi } from "vitest";
import { adminMock, prismaMock } from "./setup.js";

// Mock firebase-admin before anything imports it
vi.mock("firebase-admin", () => ({ default: adminMock }));

// Mock src/lib/firebase.ts — this is what auth.ts actually imports
vi.mock("../lib/firebase.js", () => ({ default: adminMock }));

// Mock src/lib/prisma.ts globally
vi.mock("../lib/prisma.js", () => ({ default: prismaMock }));
