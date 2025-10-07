const { mongoose, Schema, mongoConnection } = require("./mongooseConnection");

const orderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "product",
                    required: true,
                },
                productName: String,
                price: Number,
                quantity: Number,
            },
        ],
        totalPrice: Number,
        status: { type: String, default: "pending" },
        address: String,
    },
    { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

mongoose
    .connect(mongoConnection)
    .then(() => {
        // connected to mongo
    })
    .catch((err) => {
        // failed connecting
    });

async function index() {
    const orders = await Order.find();
    return renameOrdersID(orders);
}

async function show(id) {
    let order = await Order.findById(id);
    order = [order];
    return renameOrdersID(order);
}

async function store(createFormData) {
    try {
        // Validate products array
        if (
            !Array.isArray(createFormData.products) ||
            createFormData.products.length === 0
        ) {
            throw new Error("Products array is required and cannot be empty");
        }

        // Compute totalPrice
        createFormData.totalPrice = createFormData.products.reduce((sum, p) => {
            const price = Number(p.price || 0);
            const qty = Number(p.quantity || 0);
            return sum + price * qty;
        }, 0);

        console.log("Creating order with data:", createFormData);
        const order = await Order.create(createFormData);
        console.log("Order created successfully:", order);
        return order;
    } catch (err) {
        console.error("Error in store function:", err);
        throw err; // Rethrow to handle in controller
    }
}

async function updateForm(id) {
    let orders = await Order.findById(id);
    orders = [orders];
    return renameOrdersID(orders);
}

async function update(updateFormData) {
    try {
        await Order.updateOne({ _id: updateFormData.id }, updateFormData);
        return;
    } catch (err) {
        // error
    }
}

async function destroy(id) {
    try {
        await Order.deleteOne({ _id: id });
        return;
    } catch (err) {
        // error
    }
}

function renameOrdersID(orders) {
    return orders.map((order) => renameID(order));
}

function renameID(order) {
    if (!order) return order;
    order.id = order._id;
    delete order._id;
    return order;
}

async function updateStatus(id, status) {
    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // Returns the updated document
        );
        if (!order) {
            throw new Error("Order not found");
        }
        return renameID(order);
    } catch (err) {
        console.error("Error updating order status:", err);
        throw err;
    }
}

module.exports = {
    index,
    show,
    store,
    updateForm,
    update,
    destroy,
    updateStatus,
};
