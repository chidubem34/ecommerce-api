const app = require("../app");
const mongoose = require("mongoose");
const request = require("supertest");
const usersModel = require("../models/usersModel");
const productModel = require("../models/productModel");
const path = require("path");

let adminToken;
let secondProductId;

beforeAll(async () => {
  await usersModel.deleteMany();
  await productModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Admin Registration and Login", () => {
  test("Register an Admin", async () => {
    const response = await request(app)
      .post("/v1/auth/register")
      .send({
        firstName: "Admin",
        lastName: "chidubem",
        email: "chidubem@gmail.com",
        password: "123456",
        role: "admin", // Ensure the user is created with the correct role
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  }, 10000); // Increased timeout value

  test("Login an Admin", async () => {
    const response = await request(app)
      .post("/v1/auth/login")
      .send({
        email: "chidubem@gmail.com",
        password: "123456",
      });

    adminToken = response.body.access_token;
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.user).toBeTruthy();
    expect(response.body.access_token).toBeTruthy();
    expect(response.body.user.role).toBe("admin");
    expect(response.body.user.isEmailVerified).toBe(true);
  });
});

describe("Admin Product Management", () => {
  test("Add a product", async () => {
    const response = await request(app)
      .post("/v1/admin/product")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("productName", "car")
      .field("description", "Tesla CyberTruck")
      .field("price", 1000)
      .field("stock", 20)
      .attach(
        "productImages",
        path.resolve(__dirname, "../public/images/2892af83-3afc-438c-8e05-3f1edb8aa6d6.jpeg")
      )
      .attach(
        "productImages",
        path.resolve(__dirname, "../public/images/2892af83-3afc-438c-8e05-3f1edb8aa6d6.jpeg")
      );

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Product created successfully");
  });

  test("Get all products", async () => {
    const response = await request(app)
      .get("/v1/admin/products/1/2")
      .set("Authorization", `Bearer ${adminToken}`);

    if (response.body.products && response.body.products.docs) {
      secondProductId = response.body.products.docs[1]._id;
    }
    expect(response.status).toBe(200);
    expect(response.body.products.docs.length).toBeGreaterThanOrEqual(1);
  });

  test("Delete a product", async () => {
    const response = await request(app)
      .delete(`/v1/admin/product/${secondProductId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product deleted successfully");
  });
});