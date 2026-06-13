// src/tests/cart-wishlist.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { MOCK_USER, MOCK_PRODUCT, MOCK_CART_ITEM, MOCK_WISHLIST_ITEM, prismaMock, verifyIdTokenMock } from "./setup.js";

function mockAuthAsUser() {
  verifyIdTokenMock.mockResolvedValue({ uid: MOCK_USER.id, email: MOCK_USER.email });
  prismaMock.user.findUnique.mockResolvedValue(MOCK_USER);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockAuthAsUser();
});

// ── Cart ──────────────────────────────────────────────────────

describe("GET /api/cart", () => {
  it("200 — returns user cart with items and subtotal", async () => {
    prismaMock.cartItem.findMany.mockResolvedValue([MOCK_CART_ITEM]);
    const res = await request(app).get("/api/cart").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body.data.items).toBeDefined();
    expect(res.body.data.subtotal).toBeDefined();
  });

  it("200 — returns empty cart when user has no items", async () => {
    prismaMock.cartItem.findMany.mockResolvedValue([]);
    const res = await request(app).get("/api/cart").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(0);
    expect(res.body.data.subtotal).toBe(0);
  });

  it("401 — rejects unauthenticated request", async () => {
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/cart", () => {
  it("201 — adds new item to cart", async () => {
    prismaMock.product.findUnique.mockResolvedValue(MOCK_PRODUCT);
    prismaMock.cartItem.findFirst.mockResolvedValue(null);
    prismaMock.cartItem.create.mockResolvedValue(MOCK_CART_ITEM);
    const res = await request(app).post("/api/cart").set("Authorization", "Bearer valid-token").send({ productId: MOCK_PRODUCT.id, quantity: 2 });
    expect(res.status).toBe(201);
  });

  it("201 — increments quantity if item already in cart", async () => {
    prismaMock.product.findUnique.mockResolvedValue(MOCK_PRODUCT);
    prismaMock.cartItem.findFirst.mockResolvedValue(MOCK_CART_ITEM);
    prismaMock.cartItem.update.mockResolvedValue({ ...MOCK_CART_ITEM, quantity: 3 });
    const res = await request(app).post("/api/cart").set("Authorization", "Bearer valid-token").send({ productId: MOCK_PRODUCT.id, quantity: 1 });
    expect(res.status).toBe(201);
  });

  it("400 — rejects missing productId", async () => {
    const res = await request(app).post("/api/cart").set("Authorization", "Bearer valid-token").send({ quantity: 1 });
    expect(res.status).toBe(400);
  });

  it("404 — rejects non-existent product", async () => {
    prismaMock.product.findUnique.mockResolvedValue(null);
    const res = await request(app).post("/api/cart").set("Authorization", "Bearer valid-token").send({ productId: "ghost", quantity: 1 });
    expect(res.status).toBe(404);
  });

  it("401 — rejects unauthenticated request", async () => {
    const res = await request(app).post("/api/cart").send({ productId: MOCK_PRODUCT.id, quantity: 1 });
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/cart/:productId", () => {
  it("200 — updates cart item quantity", async () => {
    prismaMock.cartItem.findFirst.mockResolvedValue(MOCK_CART_ITEM);
    prismaMock.cartItem.update.mockResolvedValue({ ...MOCK_CART_ITEM, quantity: 5 });
    const res = await request(app).put(`/api/cart/${MOCK_PRODUCT.id}`).set("Authorization", "Bearer valid-token").send({ quantity: 5 });
    expect(res.status).toBe(200);
  });

  it("404 — returns 404 for item not in cart", async () => {
    prismaMock.cartItem.findFirst.mockResolvedValue(null);
    const res = await request(app).put(`/api/cart/${MOCK_PRODUCT.id}`).set("Authorization", "Bearer valid-token").send({ quantity: 3 });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/cart/:productId", () => {
  it("200 — removes item from cart", async () => {
    prismaMock.cartItem.findFirst.mockResolvedValue(MOCK_CART_ITEM);
    prismaMock.cartItem.delete.mockResolvedValue(MOCK_CART_ITEM);
    const res = await request(app).delete(`/api/cart/${MOCK_PRODUCT.id}`).set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
  });

  it("404 — returns 404 for item not in cart", async () => {
    prismaMock.cartItem.findFirst.mockResolvedValue(null);
    const res = await request(app).delete(`/api/cart/${MOCK_PRODUCT.id}`).set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/cart", () => {
  it("200 — clears entire cart", async () => {
    prismaMock.cartItem.deleteMany.mockResolvedValue({ count: 3 });
    const res = await request(app).delete("/api/cart").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
  });
});

// ── Wishlist ──────────────────────────────────────────────────

describe("GET /api/wishlist", () => {
  it("200 — returns user wishlist", async () => {
    prismaMock.wishlistItem.findMany.mockResolvedValue([MOCK_WISHLIST_ITEM]);
    const res = await request(app).get("/api/wishlist").set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("401 — rejects unauthenticated request", async () => {
    const res = await request(app).get("/api/wishlist");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/wishlist", () => {
  it("201 — adds item to wishlist", async () => {
    prismaMock.product.findUnique.mockResolvedValue(MOCK_PRODUCT);
    prismaMock.wishlistItem.findFirst.mockResolvedValue(null);
    prismaMock.wishlistItem.create.mockResolvedValue(MOCK_WISHLIST_ITEM);
    const res = await request(app).post("/api/wishlist").set("Authorization", "Bearer valid-token").send({ productId: MOCK_PRODUCT.id });
    expect(res.status).toBe(201);
  });

  it("400 — rejects duplicate wishlist entry", async () => {
    prismaMock.product.findUnique.mockResolvedValue(MOCK_PRODUCT);
    prismaMock.wishlistItem.findFirst.mockResolvedValue(MOCK_WISHLIST_ITEM);
    const res = await request(app).post("/api/wishlist").set("Authorization", "Bearer valid-token").send({ productId: MOCK_PRODUCT.id });
    expect(res.status).toBe(400);
  });

  it("400 — rejects missing productId", async () => {
    const res = await request(app).post("/api/wishlist").set("Authorization", "Bearer valid-token").send({});
    expect(res.status).toBe(400);
  });

  it("404 — rejects non-existent product", async () => {
    prismaMock.product.findUnique.mockResolvedValue(null);
    const res = await request(app).post("/api/wishlist").set("Authorization", "Bearer valid-token").send({ productId: "ghost" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/wishlist/:productId", () => {
  it("200 — removes item from wishlist", async () => {
    prismaMock.wishlistItem.findFirst.mockResolvedValue(MOCK_WISHLIST_ITEM);
    prismaMock.wishlistItem.delete.mockResolvedValue(MOCK_WISHLIST_ITEM);
    const res = await request(app).delete(`/api/wishlist/${MOCK_PRODUCT.id}`).set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
  });

  it("404 — item not in wishlist", async () => {
    prismaMock.wishlistItem.findFirst.mockResolvedValue(null);
    const res = await request(app).delete(`/api/wishlist/${MOCK_PRODUCT.id}`).set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(404);
  });
});
