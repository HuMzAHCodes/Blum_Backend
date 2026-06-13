// src/tests/products.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock, adminMock, verifyIdTokenMock, MOCK_USER, MOCK_ADMIN, MOCK_PRODUCT, MOCK_CATEGORY } from "./setup.js";
 
vi.mock("../lib/prisma.js", () => ({ default: prismaMock }));
vi.mock("../lib/firebase.js", () => ({ default: adminMock }));
 
import request from "supertest";
import app from "../app.js";
 
function mockAuthAs(user: typeof MOCK_USER | typeof MOCK_ADMIN) {
  verifyIdTokenMock.mockResolvedValue({ uid: user.id, email: user.email });
  prismaMock.user.findUnique.mockResolvedValue(user);
}
 
beforeEach(() => vi.clearAllMocks());
 
describe("GET /api/products", () => {
  it("200 — returns product list without auth", async () => {
    prismaMock.product.findMany.mockResolvedValue([MOCK_PRODUCT]);
    prismaMock.product.count.mockResolvedValue(1);
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.data.products).toHaveLength(1);
  });
 
  it("200 — filters by category", async () => {
    prismaMock.product.findMany.mockResolvedValue([MOCK_PRODUCT]);
    prismaMock.product.count.mockResolvedValue(1);
    const res = await request(app).get("/api/products").query({ category: "skincare" });
    expect(res.status).toBe(200);
  });
 
  it("200 — filters by search term", async () => {
    prismaMock.product.findMany.mockResolvedValue([MOCK_PRODUCT]);
    prismaMock.product.count.mockResolvedValue(1);
    const res = await request(app).get("/api/products").query({ search: "serum" });
    expect(res.status).toBe(200);
  });
 
  it("200 — filters by price range", async () => {
    prismaMock.product.findMany.mockResolvedValue([MOCK_PRODUCT]);
    prismaMock.product.count.mockResolvedValue(1);
    const res = await request(app).get("/api/products").query({ minPrice: "50", maxPrice: "100" });
    expect(res.status).toBe(200);
  });
 
  it("200 — sorts by price asc", async () => {
    prismaMock.product.findMany.mockResolvedValue([MOCK_PRODUCT]);
    prismaMock.product.count.mockResolvedValue(1);
    const res = await request(app).get("/api/products").query({ sortBy: "price", sortOrder: "asc" });
    expect(res.status).toBe(200);
  });
 
  it("200 — paginates correctly", async () => {
    prismaMock.product.findMany.mockResolvedValue([MOCK_PRODUCT]);
    prismaMock.product.count.mockResolvedValue(20);
    const res = await request(app).get("/api/products").query({ page: "2", limit: "10" });
    expect(res.status).toBe(200);
    expect(res.body.data.page).toBe(2);
  });
 
  it("200 — returns empty list when no products match", async () => {
    prismaMock.product.findMany.mockResolvedValue([]);
    prismaMock.product.count.mockResolvedValue(0);
    const res = await request(app).get("/api/products").query({ search: "nonexistent" });
    expect(res.status).toBe(200);
    expect(res.body.data.products).toHaveLength(0);
  });
});
 
describe("GET /api/products/:idOrSlug", () => {
  it("200 — returns product by slug", async () => {
    prismaMock.product.findUnique.mockResolvedValue(MOCK_PRODUCT);
    const res = await request(app).get("/api/products/radiance-serum");
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe("radiance-serum");
  });
 
  it("200 — returns product by ID", async () => {
    prismaMock.product.findUnique.mockResolvedValue(MOCK_PRODUCT);
    const res = await request(app).get(`/api/products/${MOCK_PRODUCT.id}`);
    expect(res.status).toBe(200);
  });
 
  it("404 — returns error for unknown slug", async () => {
    prismaMock.product.findUnique.mockResolvedValue(null);
    const res = await request(app).get("/api/products/no-such-product");
    expect(res.status).toBe(404);
  });
});
 
describe("POST /api/products", () => {
  const newProduct = { name: "New Cream", description: "Nice cream.", price: 45, images: ["https://cdn.blum.com/img.webp"], categoryId: "cat-001" };
 
  it("201 — admin creates product", async () => {
    mockAuthAs(MOCK_ADMIN);
    prismaMock.product.create.mockResolvedValue({ ...MOCK_PRODUCT, ...newProduct });
    const res = await request(app).post("/api/products").set("Authorization", "Bearer admin-token").send(newProduct);
    expect(res.status).toBe(201);
  });
 
  it("403 — customer cannot create product", async () => {
    mockAuthAs(MOCK_USER);
    const res = await request(app).post("/api/products").set("Authorization", "Bearer user-token").send(newProduct);
    expect(res.status).toBe(403);
  });
 
  it("401 — unauthenticated request rejected", async () => {
    const res = await request(app).post("/api/products").send(newProduct);
    expect(res.status).toBe(401);
  });
});
 
describe("PUT /api/products/:id", () => {
  it("403 — customer cannot update product", async () => {
    mockAuthAs(MOCK_USER);
    const res = await request(app).put(`/api/products/${MOCK_PRODUCT.id}`).set("Authorization", "Bearer user-token").send({ price: 75 });
    expect(res.status).toBe(403);
  });
});
 
describe("DELETE /api/products/:id", () => {
  it("403 — customer cannot delete product", async () => {
    mockAuthAs(MOCK_USER);
    const res = await request(app).delete(`/api/products/${MOCK_PRODUCT.id}`).set("Authorization", "Bearer user-token");
    expect(res.status).toBe(403);
  });
});
 
describe("GET /api/categories", () => {
  it("200 — returns all categories without auth", async () => {
    prismaMock.category.findMany.mockResolvedValue([MOCK_CATEGORY]);
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].slug).toBe("skincare");
  });
});
 
describe("GET /api/categories/:idOrSlug", () => {
  it("200 — returns category by slug", async () => {
    prismaMock.category.findUnique.mockResolvedValue(MOCK_CATEGORY);
    const res = await request(app).get("/api/categories/skincare");
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Skincare");
  });
 
  it("404 — unknown category returns 404", async () => {
    prismaMock.category.findUnique.mockResolvedValue(null);
    const res = await request(app).get("/api/categories/no-such-cat");
    expect(res.status).toBe(404);
  });
});
 