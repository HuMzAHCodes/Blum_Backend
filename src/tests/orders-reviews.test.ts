// src/tests/orders-reviews.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { MOCK_USER, MOCK_PRODUCT, MOCK_CART_ITEM, MOCK_ORDER, MOCK_REVIEW, prismaMock, verifyIdTokenMock } from "./setup.js";

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
  it("201 — places order with a new address", async () => {
    prismaMock.cartItem.findMany.mockResolvedValue([MOCK_CART_ITEM]);
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.address.create.mockResolvedValue(MOCK_ORDER.address);
    prismaMock.order.create.mockResolvedValue(MOCK_ORDER);
    const res = await request(app).post("/api/orders").set("Authorization", "Bearer valid-token").send(VALID_ORDER_BODY);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
  });

  it("400 — rejects when neither address nor addressId provided", async () => {
    const res = await request(app).post("/api/orders").set("Authorization", "Bearer valid-token").send({ paymentMethod: "card" });
    expect(res.status).toBe(400);
  });

  it("400 — rejects missing paymentMethod", async () => {
    const res = await request(app).post("/api/orders").set("Authorization", "Bearer valid-token").send({ address: VALID_ORDER_BODY.address });
    expect(res.status).toBe(400);
  });

  it("400 — rejects incomplete address object", async () => {
    const res = await request(app).post("/api/orders").set("Authorization", "Bearer valid-token").send({ address: { street: "123 Main" }, paymentMethod: "card" });
    expect(res.status).toBe(400);
  });

  it("401 — rejects unauthenticated request", async () => {
    const res = await request(app).post("/api/orders").send(VALID_ORDER_BODY);
    expect(res.status).toBe(401);
  });
});

describe("GET /api/orders", () => {
  it("200 — returns list of user orders", async () => {
    prismaMock.order.findMany.mockResolvedValue([MOCK_ORDER]);
    const res = await request(app).get("/api/orders").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("200 — returns empty array when user has no orders", async () => {
    prismaMock.order.findMany.mockResolvedValue([]);
    const res = await request(app).get("/api/orders").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("401 — rejects unauthenticated request", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/orders/:id", () => {
  it("200 — returns order detail for owner", async () => {
    prismaMock.order.findFirst.mockResolvedValue(MOCK_ORDER);
    const res = await request(app).get(`/api/orders/${MOCK_ORDER.id}`).set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(MOCK_ORDER.id);
  });

  it("404 — returns 404 for unknown order ID", async () => {
    prismaMock.order.findFirst.mockResolvedValue(null);
    const res = await request(app).get("/api/orders/nonexistent").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/reviews/product/:productId", () => {
  it("200 — returns product reviews without auth", async () => {
    prismaMock.review.findMany.mockResolvedValue([MOCK_REVIEW]);
    const res = await request(app).get(`/api/reviews/product/${MOCK_PRODUCT.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("200 — returns empty array for product with no reviews", async () => {
    prismaMock.review.findMany.mockResolvedValue([]);
    const res = await request(app).get(`/api/reviews/product/${MOCK_PRODUCT.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe("POST /api/reviews", () => {
  it("201 — authenticated user posts a review", async () => {
    prismaMock.product.findUnique.mockResolvedValue(MOCK_PRODUCT);
    prismaMock.review.findFirst.mockResolvedValue(null);
    prismaMock.review.create.mockResolvedValue(MOCK_REVIEW);
    const res = await request(app).post("/api/reviews").set("Authorization", "Bearer valid-token").send({ productId: MOCK_PRODUCT.id, rating: 5, title: "Amazing!", body: "Love this product." });
    expect(res.status).toBe(201);
  });

  it("400 — rejects rating outside 1-5", async () => {
    const res = await request(app).post("/api/reviews").set("Authorization", "Bearer valid-token").send({ productId: MOCK_PRODUCT.id, rating: 6, body: "Great!" });
    expect(res.status).toBe(400);
  });

  it("400 — rejects duplicate review", async () => {
    prismaMock.product.findUnique.mockResolvedValue(MOCK_PRODUCT);
    prismaMock.review.findFirst.mockResolvedValue(MOCK_REVIEW);
    const res = await request(app).post("/api/reviews").set("Authorization", "Bearer valid-token").send({ productId: MOCK_PRODUCT.id, rating: 4, body: "Second attempt." });
    expect(res.status).toBe(400);
  });

  it("401 — rejects unauthenticated request", async () => {
    const res = await request(app).post("/api/reviews").send({ productId: MOCK_PRODUCT.id, rating: 5, body: "Love it." });
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/reviews/:id", () => {
  it("200 — user deletes their own review", async () => {
    prismaMock.review.findFirst.mockResolvedValue(MOCK_REVIEW);
    prismaMock.review.delete.mockResolvedValue(MOCK_REVIEW);
    const res = await request(app).delete(`/api/reviews/${MOCK_REVIEW.id}`).set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
  });

  it("404 — non-existent review", async () => {
    prismaMock.review.findFirst.mockResolvedValue(null);
    const res = await request(app).delete("/api/reviews/ghost").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(404);
  });

  it("401 — rejects unauthenticated request", async () => {
    const res = await request(app).delete(`/api/reviews/${MOCK_REVIEW.id}`);
    expect(res.status).toBe(401);
  });
});
