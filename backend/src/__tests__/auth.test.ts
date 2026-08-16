import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app.js";

describe("Authentication & API Security Integration Tests", () => {
  const testUser = {
    name: "Automated QA Test Farmer",
    phone: `99${Date.now().toString().slice(-8)}`,
    password: "SecurePassword123!",
    district: "Amravati",
    city: "Chandur Railway",
    landHolding: 5,
    primaryCrops: ["Cotton", "Soybean"],
  };

  let token = "";

  it("POST /api/auth/register should register user, hash password, and return JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.phone).toBe(testUser.phone);
    expect(res.body.data.user.passwordHash).toBeUndefined(); // Should NEVER expose password hash
    expect(res.body.data.token).toBeDefined();

    token = res.body.data.token;
  });

  it("POST /api/auth/login should authenticate user and issue JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        phone: testUser.phone,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it("POST /api/marketplace/listings without JWT token should return 401 Unauthorized", async () => {
    const res = await request(app)
      .post("/api/marketplace/listings")
      .send({
        type: "sell",
        cropName: "Organic Cotton",
        category: "Cereals",
        quantity: 50,
        unit: "Quintal",
        pricePerUnit: 7200,
        location: "Amravati",
        state: "Maharashtra",
        description: "High grade organic cotton",
        quality: "A",
        isOrganic: true,
        isNegotiable: true,
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/marketplace/listings WITH valid JWT token should create listing under authenticated user", async () => {
    const res = await request(app)
      .post("/api/marketplace/listings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "sell",
        cropName: "Organic Cotton",
        category: "Cereals",
        quantity: 50,
        unit: "Quintal",
        pricePerUnit: 7200,
        location: "Amravati",
        state: "Maharashtra",
        description: "High grade organic cotton",
        quality: "A",
        isOrganic: true,
        isNegotiable: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.sellerName).toBe(testUser.name);
    expect(res.body.sellerPhone).toBe(testUser.phone);
  });
});
