// src/tests/admin.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { MOCK_USER, MOCK_ADMIN, MOCK_ORDER, MOCK_PRODUCT, prismaMock, verifyIdTokenMock } from "./setup.js";

function mockAuthAs(user: typeof MOCK_USER | typeof MOCK_ADMIN) {
  verifyIdTokenMock.mockResolvedValue({ uid: user.id, email: user.email });
  prismaMock.user.findUnique.mockResolvedValue(user);
}

beforeEach(() => vi.clearAllMocks());

describe("GET /api/admin/orders", () => {
  it("200 — admin retrieves all orders", async () => {
    mockAuthAs(MOCK_ADMIN);
    prismaMock.order.findMany.mockResolvedValue([MOCK_ORDER]);
    const res = await request(app).get("/api/admin/orders").set("Authorization", "Bearer admin-token");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("403 — customer cannot access admin orders", async () => {
    mockAuthAs(MOCK_USER);
    const res = await request(app).get("/api/admin/orders").set("Authorization", "Bearer user-token");
    expect(res.status).toBe(403);
  });

  it("401 — unauthenticated request is rejected", async () => {
    const res = await request(app).get("/api/admin/orders");
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/admin/orders/:id", () => {
  it("200 — admin updates order status to CONFIRMED", async () => {
    mockAuthAs(MOCK_ADMIN);
    prismaMock.order.findFirst.mockResolvedValue(MOCK_ORDER);
    prismaMock.order.update.mockResolvedValue({ ...MOCK_ORDER, status: "CONFIRMED" });
    const res = await request(app).put(`/api/admin/orders/${MOCK_ORDER.id}`).set("Authorization", "Bearer admin-token").send({ status: "CONFIRMED" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("CONFIRMED");
  });

  it("400 — rejects invalid order status", async () => {
    mockAuthAs(MOCK_ADMIN);
    const res = await request(app).put(`/api/admin/orders/${MOCK_ORDER.id}`).set("Authorization", "Bearer admin-token").send({ status: "FLYING" });
    expect(res.status).toBe(400);
  });

  it("404 — returns 404 for unknown order", async () => {
    mockAuthAs(MOCK_ADMIN);
    prismaMock.order.findFirst.mockResolvedValue(null);
    const res = await request(app).put("/api/admin/orders/ghost-order").set("Authorization", "Bearer admin-token").send({ status: "CONFIRMED" });
    expect(res.status).toBe(404);
  });

  it("403 — customer cannot update order status", async () => {
    mockAuthAs(MOCK_USER);
    const res = await request(app).put(`/api/admin/orders/${MOCK_ORDER.id}`).set("Authorization", "Bearer user-token").send({ status: "CONFIRMED" });
    expect(res.status).toBe(403);
  });
});

describe("GET /api/admin/products", () => {
  it("200 — admin retrieves all products", async () => {
    mockAuthAs(MOCK_ADMIN);
    prismaMock.product.findMany.mockResolvedValue([MOCK_PRODUCT]);
    prismaMock.product.count.mockResolvedValue(1);
    const res = await request(app).get("/api/admin/products").set("Authorization", "Bearer admin-token");
    expect(res.status).toBe(200);
  });

  it("403 — customer cannot access admin products", async () => {
    mockAuthAs(MOCK_USER);
    const res = await request(app).get("/api/admin/products").set("Authorization", "Bearer user-token");
    expect(res.status).toBe(403);
  });
});
