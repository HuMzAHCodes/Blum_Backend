// tests/auth.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { MOCK_USER, prismaMock, firebaseMock } from "./setup.js";

// ── Mocks ─────────────────────────────────────────────────────

vi.mock("../src/lib/prisma.js", () => ({ default: prismaMock }));
vi.mock("../src/lib/firebase.js", () => ({ default: firebaseMock }));

const VALID_TOKEN = "valid-firebase-token";

beforeEach(() => {
  vi.clearAllMocks();

  // Default: Firebase verifies the token successfully
  firebaseMock.auth.mockReturnValue({
    verifyIdToken: vi.fn().mockResolvedValue({
      uid:     MOCK_USER.id,
      email:   MOCK_USER.email,
      name:    MOCK_USER.name,
      picture: null,
    }),
  });
});

// ── POST /api/auth/sync ───────────────────────────────────────

describe("POST /api/auth/sync", () => {

  it("200 — creates and returns user on first sync", async () => {
    prismaMock.user.upsert.mockResolvedValue(MOCK_USER);

    const res = await request(app)
      .post("/api/auth/sync")
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toMatchObject({
      id:    MOCK_USER.id,
      email: MOCK_USER.email,
      role:  "CUSTOMER",
    });
    expect(prismaMock.user.upsert).toHaveBeenCalledOnce();
  });

  it("200 — updates existing user on re-sync", async () => {
    const updated = { ...MOCK_USER, name: "Updated Name" };
    prismaMock.user.upsert.mockResolvedValue(updated);

    const res = await request(app)
      .post("/api/auth/sync")
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated Name");
  });

  it("401 — rejects request with no Authorization header", async () => {
    const res = await request(app).post("/api/auth/sync");
    expect(res.status).toBe(401);
  });

  it("401 — rejects request with invalid token", async () => {
    firebaseMock.auth.mockReturnValue({
      verifyIdToken: vi.fn().mockRejectedValue(new Error("Token expired")),
    });

    const res = await request(app)
      .post("/api/auth/sync")
      .set("Authorization", "Bearer bad-token");

    expect(res.status).toBe(401);
  });

  it("401 — rejects token without Bearer prefix", async () => {
    const res = await request(app)
      .post("/api/auth/sync")
      .set("Authorization", VALID_TOKEN); // missing "Bearer "

    expect(res.status).toBe(401);
  });
});
