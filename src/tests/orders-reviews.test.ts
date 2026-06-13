// tests/orders-reviews.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import {
  MOCK_USER, MOCK_PRODUCT, MOCK_ORDER, MOCK_REVIEW,
  prismaMock, firebaseMock,
} from "./setup.js";

vi.mock("../src/lib/prisma.js", () => ({ default: prismaMock }));
vi.mock("../src/lib/firebase.js", () => ({ default: firebaseMock }));

const VALID_TOKEN = "valid-token";

function mockAuthAsUser() {
  firebaseMock.auth.mockReturnValue({
    verifyIdToken: vi.fn().mockResolvedValue({
      uid: MOCK_USER.id, email: MOCK_USER.email,
    }),
  });
  prismaMock.user.findUnique.mockResolvedValue(MOCK_USER);
}

const VALID_ORDER_BODY = {
  address: {
    label:   "Home",
    street:  "123 Main St",
    city:    "Lahore",
    state:   "Punjab",
    zip:     "54000",
    country: "Pakistan",
  },
  paymentMethod: "card",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockAuthAsUser();
});

// ── POST /api/orders ──────────────────────────────────────────

describe("POST /api/orders", () => {

  it("201 — places order with a new address", async () => {
    prismaMock.cartItem.findMany.mockResolvedValue([
      { ...require("./setup.js").MOCK_CART_ITEM }
    ]);
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.address.create.mockResolvedValue(MOCK_ORDER.address);
    prismaMock.order.create.mockResolvedValue(MOCK_ORDER);

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send(VALID_ORDER_BODY);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Order placed successfully");
    expect(res.body.data.id).toBe(MOCK_ORDER.id);
  });

  it("201 — places order with a saved addressId", async () => {
    prismaMock.cartItem.findMany.mockResolvedValue([
      { ...require("./setup.js").MOCK_CART_ITEM }
    ]);
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.address.findFirst.mockResolvedValue(MOCK_ORDER.address);
    prismaMock.order.create.mockResolvedValue(MOCK_ORDER);

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ addressId: "addr-001", paymentMethod: "cod" });

    expect(res.status).toBe(201);
  });

  it("400 — rejects when neither address nor addressId provided", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ paymentMethod: "card" }); // no address or addressId

    expect(res.status).toBe(400);
  });

  it("400 — rejects missing paymentMethod", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ address: VALID_ORDER_BODY.address }); // no paymentMethod

    expect(res.status).toBe(400);
  });

  it("400 — rejects empty cart checkout", async () => {
    prismaMock.cartItem.findMany.mockResolvedValue([]); // empty cart

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send(VALID_ORDER_BODY);

    expect(res.status).toBe(400);
  });

  it("400 — rejects incomplete address object", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({
        address: { street: "123 Main" }, // missing city, state, zip, country
        paymentMethod: "card",
      });

    expect(res.status).toBe(400);
  });

  it("401 — rejects unauthenticated request", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(VALID_ORDER_BODY);

    expect(res.status).toBe(401);
  });
});

// ── GET /api/orders ───────────────────────────────────────────

describe("GET /api/orders", () => {

  it("200 — returns list of user's orders", async () => {
    prismaMock.order.findMany.mockResolvedValue([MOCK_ORDER]);

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(MOCK_ORDER.id);
  });

  it("200 — returns empty array when user has no orders", async () => {
    prismaMock.order.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("401 — rejects unauthenticated request", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(401);
  });
});

// ── GET /api/orders/:id ───────────────────────────────────────

describe("GET /api/orders/:id", () => {

  it("200 — returns order detail for owner", async () => {
    prismaMock.order.findFirst.mockResolvedValue(MOCK_ORDER);

    const res = await request(app)
      .get(`/api/orders/${MOCK_ORDER.id}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(MOCK_ORDER.id);
    expect(res.body.data.status).toBe("PENDING");
    expect(res.body.data.items).toHaveLength(1);
  });

  it("404 — returns 404 for unknown order ID", async () => {
    prismaMock.order.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/orders/nonexistent-id")
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(404);
  });

  it("403 — customer cannot access another user's order", async () => {
    const otherUserOrder = { ...MOCK_ORDER, userId: "other-user-id" };
    prismaMock.order.findFirst.mockResolvedValue(null); // service filters by userId

    const res = await request(app)
      .get(`/api/orders/${MOCK_ORDER.id}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect([403, 404]).toContain(res.status);
  });
});

// ── GET /api/reviews/product/:productId ──────────────────────

describe("GET /api/reviews/product/:productId", () => {

  it("200 — returns product reviews without auth", async () => {
    prismaMock.review.findMany.mockResolvedValue([MOCK_REVIEW]);

    const res = await request(app)
      .get(`/api/reviews/product/${MOCK_PRODUCT.id}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].rating).toBe(5);
  });

  it("200 — returns empty array for product with no reviews", async () => {
    prismaMock.review.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get(`/api/reviews/product/${MOCK_PRODUCT.id}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

// ── POST /api/reviews ─────────────────────────────────────────

describe("POST /api/reviews", () => {

  it("201 — authenticated user posts a review", async () => {
    prismaMock.product.findUnique.mockResolvedValue(MOCK_PRODUCT);
    prismaMock.review.findFirst.mockResolvedValue(null); // no existing review
    prismaMock.review.create.mockResolvedValue(MOCK_REVIEW);

    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({
        productId: MOCK_PRODUCT.id,
        rating:    5,
        title:     "Amazing!",
        body:      "Love this product.",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.rating).toBe(5);
  });

  it("400 — rejects rating outside 1–5 range", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({
        productId: MOCK_PRODUCT.id,
        rating:    6,
        body:      "Great!",
      });

    expect(res.status).toBe(400);
  });

  it("400 — rejects rating of 0", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({
        productId: MOCK_PRODUCT.id,
        rating:    0,
        body:      "Bad.",
      });

    expect(res.status).toBe(400);
  });

  it("400 — rejects empty review body", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({
        productId: MOCK_PRODUCT.id,
        rating:    4,
        body:      "",
      });

    expect(res.status).toBe(400);
  });

  it("400 — rejects duplicate review from same user", async () => {
    prismaMock.product.findUnique.mockResolvedValue(MOCK_PRODUCT);
    prismaMock.review.findFirst.mockResolvedValue(MOCK_REVIEW); // already reviewed

    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({
        productId: MOCK_PRODUCT.id,
        rating:    4,
        body:      "Second review attempt.",
      });

    expect(res.status).toBe(400);
  });

  it("401 — rejects unauthenticated request", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .send({
        productId: MOCK_PRODUCT.id,
        rating:    5,
        body:      "Love it.",
      });

    expect(res.status).toBe(401);
  });
});

// ── PATCH /api/reviews/:id ────────────────────────────────────

describe("PATCH /api/reviews/:id", () => {

  it("200 — user updates their own review", async () => {
    prismaMock.review.findFirst.mockResolvedValue(MOCK_REVIEW);
    prismaMock.review.update.mockResolvedValue({ ...MOCK_REVIEW, rating: 4, body: "Still good." });

    const res = await request(app)
      .patch(`/api/reviews/${MOCK_REVIEW.id}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ rating: 4, body: "Still good." });

    expect(res.status).toBe(200);
    expect(res.body.data.rating).toBe(4);
  });

  it("403 — user cannot update another user's review", async () => {
    prismaMock.review.findFirst.mockResolvedValue(null); // service returns null for wrong owner

    const res = await request(app)
      .patch(`/api/reviews/${MOCK_REVIEW.id}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ rating: 1 });

    expect([403, 404]).toContain(res.status);
  });

  it("400 — rejects invalid rating in update", async () => {
    const res = await request(app)
      .patch(`/api/reviews/${MOCK_REVIEW.id}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ rating: 10 });

    expect(res.status).toBe(400);
  });
});

// ── DELETE /api/reviews/:id ───────────────────────────────────

describe("DELETE /api/reviews/:id", () => {

  it("200 — user deletes their own review", async () => {
    prismaMock.review.findFirst.mockResolvedValue(MOCK_REVIEW);
    prismaMock.review.delete.mockResolvedValue(MOCK_REVIEW);

    const res = await request(app)
      .delete(`/api/reviews/${MOCK_REVIEW.id}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(200);
  });

  it("404 — returns 404 for non-existent review", async () => {
    prismaMock.review.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .delete(`/api/reviews/ghost-review`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(404);
  });

  it("401 — rejects unauthenticated request", async () => {
    const res = await request(app)
      .delete(`/api/reviews/${MOCK_REVIEW.id}`);

    expect(res.status).toBe(401);
  });
});
