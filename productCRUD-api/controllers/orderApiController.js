const orderModel = require("../models/orderModel");

const index = (req, res) => {
    orderModel
        .index()
        .then((orders) => {
            res.json(orders);
        })
        .catch((error) => {
            res.status(500).json({ error: "Error fetching orders" });
        });
};

const show = (req, res) => {
    const id = req.params["id"];
    orderModel
        .show(id)
        .then((order) => {
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json(order);
        })
        .catch((error) => {
            res.status(500).json({ error: "Error fetching order" });
        });
};

const store = (req, res) => {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    // Format the request data
    const orderData = {
        userId: req.user._id,
        products: Array.isArray(req.body)
            ? req.body.map((product) => ({
                  productId: product.id, // Use the provided id as productId
                  productName: product.productName,
                  price: product.price,
                  quantity: product.quantity,
              }))
            : [],
        totalPrice: 0, // Will be calculated in the model
    };

    // Log the formatted order data for debugging
    console.log("Formatted order data:", orderData);

    orderModel
        .store(orderData)
        .then(() => {
            res.status(201).json({ message: "Order created successfully" });
        })
        .catch((error) => {
            console.error("Error creating order:", error);
            res.status(400).json({ error: "Error creating order" });
        });
};

const update = (req, res) => {
    orderModel
        .update(req.body)
        .then(() => {
            res.json({ message: "Order updated successfully" });
        })
        .catch((error) => {
            res.status(400).json({ error: "Error updating order" });
        });
};

const destroy = (req, res) => {
    const id = req.params["id"];
    orderModel
        .destroy(id)
        .then(() => {
            res.json({ message: "Order deleted successfully" });
        })
        .catch((error) => {
            res.status(400).json({ error: "Error deleting order" });
        });
};

const confirmOrder = (req, res) => {
    const id = req.params["id"];
    orderModel
        .updateStatus(id, "confirmed")
        .then((order) => {
            res.json({
                message: "Order confirmed successfully",
                order: order,
            });
        })
        .catch((error) => {
            console.error("Error confirming order:", error);
            res.status(400).json({
                error: "Error confirming order",
                details: error.message,
            });
        });
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
    confirmOrder,
};
