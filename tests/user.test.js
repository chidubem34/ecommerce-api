const app = require("../bin/www");
const mongoose = require("mongoose");
const request = require("supertest");
const usersModel = require("../models/usersModel");
const { order } = require("../models/orderModel");

let userToken;
let productId;

beforeAll(async () => {
    await usersModel.deleteMany();
    await order.deleteMany({});
}, 20000);

afterAll(async () => {
    await mongoose.disconnect();
    app.close();
}, 20000);

describe("This is a test for user registration and login routes", () => {
    test("Register a user", async () => {
        const response = await request(app).post("/v1/auth/register").send({
            firstName: "user",
            lastName: "kizito",
            email: "kzito@gmail.com",
            password: "12345",
            role: "user"
        });
        await usersModel.findOneAndUpdate(
            { email: "kzito@gmail.com" },
            { isEmailVerified: true},
            { new: true }
        );

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User created successfully");
    }, 20000);

    test("Login an a user", async () => {
        const response = await request(app).post("/v1/auth/login").send({
            email: "kzito@gmail.com",
            password: "12345",
        });

        userToken = response.body.access_token;
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Login successful");
        expect(response.body.user).toBeTruthy();
        expect(response.body.access_token).toBeTruthy();
        expect(response.body.user.role).toBe("user");
    }, 20000);
});

describe("This is a test for user to view all products, single product and ceate an order", () => {
    test("Get all products", async () => {
        const response = await request(app)
            .get("/v1/user/products/1/2")
            .set("Authorization", `Bearer ${userToken}`);

        productId = response.body.products.docs[0]._id;
        expect(response.status).toBe(200);
        expect(response.body.products).toBeTruthy();
    }, 20000);

    test("Get a single product", async () => {
        const response = await request(app)
            .get(`/v1/user/product/${productId}`)
            .set("Authorization", `Bearer ${userToken}`);

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.product).toBeTruthy();
        expect(response.body.product._id).toBe(productId);
    }, 20000);

    test("Create an order", async () => {
        const response = await request(app)
            .post("/v1/user/product/order")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                orderItems: [
                    {
                        productId: productId,
                        quantity: 2,
                    },
                ],
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Order created successfully");
    }, 20000);
});