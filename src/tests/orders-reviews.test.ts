// src/tests/orders-reviews.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock, adminMock, verifyIdTokenMock, MOCK_USER, MOCK_PRODUCT, MOCK_CART_ITEM, MOCK_ORDER, MOCK_REVIEW } from "./setup.js";

vi.mock("../lib/prisma.js", () => ({ default: prismaMock }));
vi.mock("../lib/firebase.js", () => ({ default: adminMock }));

import request from "supertest";
import app from "../app.js";

function mockAuthAsUser() {
  verifyIdTokenMock.mockResolvedValue({ uid: MOCK_USER.id, email: MOCK_USER.email });
  prismaMock.user.findUnique.mockResolvedValue(MOCK_USER);
}

const VALID_ORDER_BODY = {
  address: { label: "Home", street: "123 Main St", city: "Lahore", state: "Punjab", zip: "54000", country: "Pakistan" },
  paymentMethod: "card",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockAuthAsUser();
});

describe("POST /api/orders", () => {
  it("400 — rejects missing paymentMethod", async () => {
    const res = await request(app).post("/api/orders").set("Authorization", "Bearer valid-token").send({ address: VALID_ORDER_BODY.address });
    expect(res.status).toBe(400);
  });

  it("400 — rejects incomplete address", async () => {
    const res = await request(app).post("/api/orders").set("Authorization", "Bearer valid-token").send({ address: { street: "123 Main" }, paymentMethod: "card" });
    expect(res.status).toBe(400);
  });

  it("401 — rejects unauthenticated", async () => {
    const res = await request(app).post("/api/orders").send(VALID_ORDER_BODY);
    expect(res.status).toBe(401);
  });
});

describe("GET /api/orders", () => {
  it("200 — returns user orders", async () => {
    prismaMock.order.findMany.mockResolvedValue([MOCK_ORDER]);
    const res = await request(app).get("/api/orders").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("200 — returns empty array", async () => {
    prismaMock.order.findMany.mockResolvedValue([]);
    const res = await request(app).get("/api/orders").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("401 — rejects unauthenticated", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/orders/:id", () => {
  it("401 — rejects unauthenticated", async () => {
    const res = await request(app).get(`/api/orders/${MOCK_ORDER.id}`);
    expect(res.status).toBe(401);
  });
});

describe("GET /api/reviews/product/:productId", () => {
  it("200 — returns product reviews without auth", async () => {
    prismaMock.review.findMany.mockResolvedValue([MOCK_REVIEW]);
    const res = await request(app).get(`/api/reviews/product/${MOCK_PRODUCT.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("200 — returns empty array for no reviews", async () => {
    prismaMock.review.findMany.mockResolvedValue([]);
    const res = await request(app).get(`/api/reviews/product/${MOCK_PRODUCT.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe("POST /api/reviews", () => {
  it("401 — rejects unauthenticated", async () => {
    const res = await request(app).post("/api/reviews").send({ productId: MOCK_PRODUCT.id, rating: 5, body: "Love it." });
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/reviews/:id", () => {
  it("401 — rejects unauthenticated", async () => {
    const res = await request(app).delete(`/api/reviews/${MOCK_REVIEW.id}`);
    expect(res.status).toBe(401);
  });
});
