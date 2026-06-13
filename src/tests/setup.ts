// src/tests/setup.ts
import { vi } from "vitest";

// ── Prisma mock ───────────────────────────────────────────────

export const prismaMock = {
  user: {
    upsert:     vi.fn(),
    findUnique: vi.fn(),
    findMany:   vi.fn(),
  },
  product: {
    findMany:   vi.fn(),
    findFirst:  vi.fn(),
    findUnique: vi.fn(),
    create:     vi.fn(),
    update:     vi.fn(),
    delete:     vi.fn(),
    count:      vi.fn(),
  },
  category: {
    findMany:  vi.fn(),
    findFirst: vi.fn(),
    create:    vi.fn(),
    update:    vi.fn(),
    delete:    vi.fn(),
  },
  cartItem: {
    findFirst:  vi.fn(),
    findMany:   vi.fn(),
    create:     vi.fn(),
    update:     vi.fn(),
    delete:     vi.fn(),
    deleteMany: vi.fn(),
  },
  wishlistItem: {
    findFirst:  vi.fn(),
    findMany:   vi.fn(),
    create:     vi.fn(),
    delete:     vi.fn(),
    deleteMany: vi.fn(),
  },
  order: {
    create:    vi.fn(),
    findFirst: vi.fn(),
    findMany:  vi.fn(),
    update:    vi.fn(),
  },
  review: {
    findFirst:  vi.fn(),
    findMany:   vi.fn(),
    create:     vi.fn(),
    update:     vi.fn(),
    delete:     vi.fn(),
  },
  address: {
    findFirst: vi.fn(),
    create:    vi.fn(),
  },
  $transaction: vi.fn(),
};

// ── Firebase mock ─────────────────────────────────────────────

export const verifyIdTokenMock = vi.fn();

export const adminMock = {
  apps: [true], // non-empty so firebase.ts skips initializeApp
  auth: vi.fn(() => ({ verifyIdToken: verifyIdTokenMock })),
  credential: { cert: vi.fn() },
  initializeApp: vi.fn(),
};

// ── Seed data ─────────────────────────────────────────────────

export const MOCK_USER = {
  id:        "firebase-uid-123",
  email:     "test@blum.com",
  name:      "Test User",
  avatar:    null,
  password:  "FIREBASE_EXTERNAL_AUTH",
  role:      "CUSTOMER" as const,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

export const MOCK_ADMIN = {
  ...MOCK_USER,
  id:   "firebase-admin-uid",
  role: "ADMIN" as const,
};

export const MOCK_CATEGORY = {
  id:          "cat-001",
  name:        "Skincare",
  slug:        "skincare",
  description: "Face serums, toners, moisturisers.",
  createdAt:   new Date("2025-01-01"),
  updatedAt:   new Date("2025-01-01"),
};

export const MOCK_PRODUCT = {
  id:          "prod-001",
  name:        "Radiance Serum",
  slug:        "radiance-serum",
  description: "A fast-absorbing serum with Vitamin C.",
  price:       68,
  salePrice:   null,
  stock:       100,
  images:      JSON.stringify(["/images/radiance-serum.webp"]),
  tags:        JSON.stringify(["serum", "glow"]),
  isActive:    true,
  categoryId:  "cat-001",
  createdAt:   new Date("2025-01-01"),
  updatedAt:   new Date("2025-01-01"),
  category:    { id: "cat-001", name: "Skincare", slug: "skincare" },
  reviews:     [],
  _count:      { reviews: 0 },
};

export const MOCK_CART_ITEM = {
  id:        "cart-item-001",
  userId:    MOCK_USER.id,
  productId: MOCK_PRODUCT.id,
  quantity:  2,
  createdAt: new Date("2025-01-01"),
  product:   MOCK_PRODUCT,
};

export const MOCK_WISHLIST_ITEM = {
  id:        "wish-001",
  userId:    MOCK_USER.id,
  productId: MOCK_PRODUCT.id,
  createdAt: new Date("2025-01-01"),
  product:   MOCK_PRODUCT,
};

export const MOCK_ADDRESS = {
  id:      "addr-001",
  userId:  MOCK_USER.id,
  label:   "Home",
  street:  "123 Main St",
  city:    "Lahore",
  state:   "Punjab",
  zip:     "54000",
  country: "Pakistan",
};

export const MOCK_ORDER = {
  id:        "order-001",
  userId:    MOCK_USER.id,
  status:    "PENDING" as const,
  total:     136,
  discount:  0,
  notes:     null,
  addressId: "addr-001",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  items: [{
    id:        "oi-001",
    orderId:   "order-001",
    productId: MOCK_PRODUCT.id,
    quantity:  2,
    price:     68,
    product:   MOCK_PRODUCT,
  }],
  payment: {
    id:            "pay-001",
    orderId:       "order-001",
    amount:        136,
    status:        "PENDING",
    method:        "card",
    transactionId: null,
    createdAt:     new Date("2025-01-01"),
  },
  address: MOCK_ADDRESS,
};

export const MOCK_REVIEW = {
  id:        "review-001",
  userId:    MOCK_USER.id,
  productId: MOCK_PRODUCT.id,
  rating:    5,
  title:     "Amazing!",
  body:      "Love this product.",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  user:      MOCK_USER,
};
