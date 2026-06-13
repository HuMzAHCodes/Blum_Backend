// src/tests/vitest.setup.ts
// Global setup — only mocks firebase-admin (the npm package)
// Each test file must also call vi.mock for ../lib/prisma.js and ../lib/firebase.js

import { vi } from "vitest";
import { adminMock } from "./setup.js";

vi.mock("firebase-admin", () => ({ default: adminMock }));
