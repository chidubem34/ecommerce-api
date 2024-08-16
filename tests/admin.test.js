const app = require("../bin/www");
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
}, 20000);

afterAll(async () => {
    await mongoose.disconnect();
    app.close();
}, 20000);

describe("Admin registration and login tests", () => {
    test("Registering an Admin", async () => {
        const response = await request(app)
            .post("/v1/auth/register")
            .send({
                firstName: "Admin",
                lastName: "kizito",
                email: "kizito@gmail.com",
                password: "12345",
                role: "admin",
            });

        await usersModel.findOneAndUpdate(
            { email: "kizito@gmail.com" },
            { isEmailVerified: true },
            { new: true }
        );

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User created successfully");
    }, 20000);

    test("Login an Admin", async () => {
        const response = await request(app)
            .post("/v1/auth/login")
            .send({
                email: "kizito@gmail.com",
                password: "12345",
            });

        adminToken = response.body.access_token;

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Login successful");
        expect(response.body.user).toBeTruthy();
        expect(response.body.access_token).toBeTruthy();
        expect(response.body.user.role).toBe("admin");
    }, 20000);
});

describe("Admin product management tests", () => {
    test("Add a product", async () => {
        const response = await request(app)
            .post("/v1/admin/product")
            .set("Authorization", `Bearer ${adminToken}`)
            .field("productName", "Laptop")
            .field("description", "A very powerful laptop")
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
    }, 20000);

    test("Add a second product", async () => {
        const response = await request(app)
            .post("/v1/admin/product")
            .set("Authorization", `Bearer ${adminToken}`)
            .field("productName", "Bag")
            .field("description", "A very powerful bag")
            .field("price", 500)
            .field("stock", 10)
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
    }, 20000);

    test("Get all products", async () => {
        const response = await request(app)
            .get("/v1/admin/products/1/2")
            .set("Authorization", `Bearer ${adminToken}`);

        secondProductId = response.body.products.docs[1]._id;

        expect(response.status).toBe(200);
        expect(response.body.products.docs.length).toBe(2);
    }, 20000);

    test("Get a single product", async () => {
        const response = await request(app)
            .get(`/v1/admin/product/${secondProductId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.product).toBeTruthy();
    }, 20000);

    test("Edit the second product", async () => {
        const response = await request(app)
            .put(`/v1/admin/product/${secondProductId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .field("productName", "Editted Bag")
            .field("description", "A very powerful bag")
            .field("price", 200)
            .field("stock", 10)
            .attach(
                "productImages",
                path.resolve(__dirname, "../public/images/2892af83-3afc-438c-8e05-3f1edb8aa6d6.jpeg")
            )
            .attach(
                "productImages",
                path.resolve(__dirname, "../public/images/2892af83-3afc-438c-8e05-3f1edb8aa6d6.jpeg")
            );

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Product updated successfully");
    }, 20000);

    test("Delete a product", async () => {
        const response = await request(app)
            .delete(`/v1/admin/product/${secondProductId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Product deleted successfully");
    }, 20000);
});