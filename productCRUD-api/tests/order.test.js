const request = require("supertest");
const mongoose = require("mongoose");
const { mongoConnection } = require("../models/mongooseConnection");
const app = require("../index"); // Make sure to export app from index.js

describe("Order API Tests", () => {
    let authToken;
    let testUserId;
    let testProductId;

    // Before all tests, connect to the database and create test data
    beforeAll(async () => {
        await mongoose.connect(mongoConnection);

        // Create a test user and get token
        const loginRes = await request(app)
            .post("/api/signin")
            .send({
                userName: process.env.TEST_USERNAME || "testuser",
                password: process.env.TEST_PASSWORD || "testpass123",
            });

        authToken = loginRes.body.token;
        testUserId = loginRes.body.userId;

        // Create a test product
        const productRes = await request(app)
            .post("/api/products/store")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                productName: "Test Product",
                price: 100,
                quantity: 1,
            });

        testProductId = productRes.body.id;
    });

    // After all tests, clean up
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe("GET /api/orders", () => {
        it("should return all orders for authenticated user", async () => {
            const response = await request(app)
                .get("/api/orders")
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        it("should return 401 if not authenticated", async () => {
            const response = await request(app).get("/api/orders");

            expect(response.status).toBe(401);
        });
    });

    describe("POST /api/orders/store", () => {
        it("should create a new order successfully", async () => {
            const newOrder = {
                products: [
                    {
                        productId: testProductId,
                        productName: "Test Product",
                        price: 100,
                        quantity: 2,
                    },
                ],
                totalPrice: 200,
                address: "123 Test St",
            };

            const response = await request(app)
                .post("/api/orders/store")
                .set("Authorization", `Bearer ${authToken}`)
                .send(newOrder);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty(
                "message",
                "Order created successfully"
            );
        });

        it("should calculate total price if not provided", async () => {
            const newOrder = {
                products: [
                    {
                        productId: testProductId,
                        productName: "Test Product",
                        price: 100,
                        quantity: 2,
                    },
                ],
                address: "123 Test St",
            };

            const response = await request(app)
                .post("/api/orders/store")
                .set("Authorization", `Bearer ${authToken}`)
                .send(newOrder);

            expect(response.status).toBe(201);
        });

        it("should return 400 if products array is empty", async () => {
            const newOrder = {
                products: [],
                totalPrice: 0,
                address: "123 Test St",
            };

            const response = await request(app)
                .post("/api/orders/store")
                .set("Authorization", `Bearer ${authToken}`)
                .send(newOrder);

            expect(response.status).toBe(400);
        });

        it("should return 401 if not authenticated", async () => {
            const newOrder = {
                products: [
                    {
                        productId: testProductId,
                        productName: "Test Product",
                        price: 100,
                        quantity: 2,
                    },
                ],
                totalPrice: 200,
                address: "123 Test St",
            };

            const response = await request(app)
                .post("/api/orders/store")
                .send(newOrder);

            expect(response.status).toBe(401);
        });
    });
});
