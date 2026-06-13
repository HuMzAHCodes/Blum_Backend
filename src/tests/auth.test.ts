// src/tests/auth.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock, adminMock, verifyIdTokenMock, MOCK_USER } from "./setup.js";

vi.mock("../lib/prisma.js", () => ({ default: prismaMock }));
vi.mock("../lib/firebase.js", () => ({ default: adminMock }));

import request from "supertest";
import app from "../app.js";

beforeEach(() => vi.clearAllMocks());

describe("POST /api/auth/sync", () => {
  it("200 — creates and returns user on first sync", async () => {
    verifyIdTokenMock.mockResolvedValue({ uid: MOCK_USER.id, email: MOCK_USER.email, name: MOCK_USER.name });
    prismaMock.user.upsert.mockResolvedValue(MOCK_USER);
    const res = await request(app).post("/api/auth/sync").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ id: MOCK_USER.id, email: MOCK_USER.email, role: "CUSTOMER" });
  });

  it("200 — updates existing user on re-sync", async () => {
    verifyIdTokenMock.mockResolvedValue({ uid: MOCK_USER.id, email: MOCK_USER.email, name: "Updated Name" });
    prismaMock.user.upsert.mockResolvedValue({ ...MOCK_USER, name: "Updated Name" });
    const res = await request(app).post("/api/auth/sync").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated Name");
  });

  it("401 — rejects request with no Authorization header", async () => {
    const res = await request(app).post("/api/auth/sync");
    expect(res.status).toBe(401);
  });

  it("401 — rejects invalid token", async () => {
    verifyIdTokenMock.mockRejectedValue(new Error("Token expired"));
    const res = await request(app).post("/api/auth/sync").set("Authorization", "Bearer bad-token");
    expect(res.status).toBe(401);
  });

  it("401 — rejects token without Bearer prefix", async () => {
    const res = await request(app).post("/api/auth/sync").set("Authorization", "just-a-token");
    expect(res.status).toBe(401);
  });
});
