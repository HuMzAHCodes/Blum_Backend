// tests/admin.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import {
  MOCK_USER, MOCK_ADMIN, MOCK_ORDER, MOCK_PRODUCT,
  prismaMock, firebaseMock,
} from "./setup.js";

vi.mock("../src/lib/prisma.js", () => ({ default: prismaMock }));
vi.mock("../src/lib/firebase.js", () => ({ default: firebaseMock }));

const ADMIN_TOKEN = "admin-token";
const USER_TOKEN  = "user-token";

function mockAuthAs(user: typeof MOCK_USER | typeof MOCK_ADMIN) {
  firebaseMock.auth.mockReturnValue({
    verifyIdToken: vi.fn().mockResolvedValue({
      uid: user.id, email: user.email,
    }),
  });
  prismaMock.user.findUnique.mockResolvedValue(user);
}

beforeEach(() => vi.clearAllMocks());

// ── GET /api/admin/orders ─────────────────────────────────────

describe("GET /api/admin/orders", () => {

  it("200 — admin retrieves all orders", async () => {
    mockAuthAs(MOCK_ADMIN);
    prismaMock.order.findMany.mockResolvedValue([MOCK_ORDER]);

    const res = await request(app)
      .get("/api/admin/orders")
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(MOCK_ORDER.id);
  });

  it("403 — customer cannot access admin orders", async () => {
    mockAuthAs(MOCK_USER);

    const res = await request(app)
      .get("/api/admin/orders")
      .set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(res.status).toBe(403);
  });

  it("401 — unauthenticated request is rejected", async () => {
    const res = await request(app).get("/api/admin/orders");
    expect(res.status).toBe(401);
  });
});

// ── PUT /api/admin/orders/:id ─────────────────────────────────

describe("PUT /api/admin/orders/:id", () => {

  it("200 — admin updates order status to CONFIRMED", async () => {
    mockAuthAs(MOCK_ADMIN);
    prismaMock.order.findFirst.mockResolvedValue(MOCK_ORDER);
    prismaMock.order.update.mockResolvedValue({ ...MOCK_ORDER, status: "CONFIRMED" });

    const res = await request(app)
      .put(`/api/admin/orders/${MOCK_ORDER.id}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
      .send({ status: "CONFIRMED" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("CONFIRMED");
  });

  it("200 — admin updates order status to SHIPPED", async () => {
    mockAuthAs(MOCK_ADMIN);
    prismaMock.order.findFirst.mockResolvedValue(MOCK_ORDER);
    prismaMock.order.update.mockResolvedValue({ ...MOCK_ORDER, status: "SHIPPED" });

    const res = await request(app)
      .put(`/api/admin/orders/${MOCK_ORDER.id}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
      .send({ status: "SHIPPED" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("SHIPPED");
  });

  it("400 — rejects invalid order status value", async () => {
    mockAuthAs(MOCK_ADMIN);

    const res = await request(app)
      .put(`/api/admin/orders/${MOCK_ORDER.id}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
      .send({ status: "FLYING" }); // not a valid OrderStatus enum

    expect(res.status).toBe(400);
  });

  it("404 — returns 404 for unknown order", async () => {
    mockAuthAs(MOCK_ADMIN);
    prismaMock.order.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/admin/orders/ghost-order")
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
      .send({ status: "CONFIRMED" });

    expect(res.status).toBe(404);
  });

  it("403 — customer cannot update order status", async () => {
    mockAuthAs(MOCK_USER);

    const res = await request(app)
      .put(`/api/admin/orders/${MOCK_ORDER.id}`)
      .set("Authorization", `Bearer ${USER_TOKEN}`)
      .send({ status: "CONFIRMED" });

    expect(res.status).toBe(403);
  });
});

// ── GET /api/admin/products ───────────────────────────────────

describe("GET /api/admin/products", () => {

  it("200 — admin retrieves all products including inactive", async () => {
    mockAuthAs(MOCK_ADMIN);
    const inactiveProduct = { ...MOCK_PRODUCT, isActive: false };
    prismaMock.product.findMany.mockResolvedValue([MOCK_PRODUCT, inactiveProduct]);
    prismaMock.product.count.mockResolvedValue(2);

    const res = await request(app)
      .get("/api/admin/products")
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it("403 — customer cannot access admin products endpoint", async () => {
    mockAuthAs(MOCK_USER);

    const res = await request(app)
      .get("/api/admin/products")
      .set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(res.status).toBe(403);
  });
});

// ── GET /api/admin/analytics ──────────────────────────────────

describe("GET /api/admin/analytics", () => {

  it("200 — admin retrieves analytics data", async () => {
    mockAuthAs(MOCK_ADMIN);

    // Analytics service aggregates several counts — mock them all
    prismaMock.order.findMany.mockResolvedValue([MOCK_ORDER]);
    prismaMock.user.findMany.mockResolvedValue([MOCK_USER]);
    prismaMock.product.findMany.mockResolvedValue([MOCK_PRODUCT]);

    const res = await request(app)
      .get("/api/admin/analytics")
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it("403 — customer cannot access analytics", async () => {
    mockAuthAs(MOCK_USER);

    const res = await request(app)
      .get("/api/admin/analytics")
      .set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(res.status).toBe(403);
  });
});
