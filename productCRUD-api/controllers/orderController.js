const orderModel = require("../models/orderModel");

const index = (req, res) => {
    orderModel.index().then((orders) => {
        res.render("pages/orders/index", { orders });
    });
};

const show = (req, res) => {
    const id = req.params["id"];
    orderModel.show(id).then((oneOrder) => {
        res.render("pages/orders/show", { oneOrder });
    });
};

const createForm = (req, res) => {
    res.render("pages/orders/createForm");
};

const store = (req, res) => {
    // Add userId from session/auth
    req.body.userId = req.user._id; // Assuming auth middleware sets req.user

    orderModel
        .store(req.body)
        .then(() => {
            res.redirect("/orders");
        })
        .catch((error) => {
            res.render("pages/orders/createForm", {
                error: "Error creating order",
                formData: req.body,
            });
        });
};

const updateForm = (req, res) => {
    const id = req.params["id"];
    orderModel.updateForm(id).then((oneOrder) => {
        res.render("pages/orders/updateForm", { oneOrder });
    });
};

const update = (req, res) => {
    orderModel
        .update(req.body)
        .then(() => {
            res.redirect("/orders");
        })
        .catch((error) => {
            res.render("pages/orders/updateForm", {
                error: "Error updating order",
                formData: req.body,
            });
        });
};

const destroy = (req, res) => {
    const id = req.params["id"];
    orderModel
        .destroy(id)
        .then(() => {
            res.redirect("/orders");
        })
        .catch((error) => {
            res.redirect("/orders");
        });
};

module.exports = {
    index,
    show,
    createForm,
    store,
    updateForm,
    update,
    destroy,
};
