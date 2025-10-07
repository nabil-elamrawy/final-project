const express = require("express");
const webRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");

/* -------------- parse of form ------------------- */
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/uploades/");
    },
    filename: (req, file, cb) => {
        if (file) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    },
});

const upload = multer({
    storage: storage,
});

/* -------------- route roles ------------------------ */

/* -------------------products route roles----------------------- */
webRouter.get("/products", (req, res) => {
    productController.index(req, res);
});
webRouter.get("/products/show/:id", (req, res) => {
    productController.show(req, res);
});
webRouter.get("/products/createForm", (req, res) => {
    productController.createForm(req, res);
});

/* ---****---- */
webRouter.post("/products/store", upload.single("photo"), (req, res) => {
    productController.store(req, res);
});

webRouter.get("/products/updateForm/:id", (req, res) => {
    productController.updateForm(req, res);
});
webRouter.post("/products/update", upload.single("photo"), (req, res) => {
    productController.update(req, res);
});
webRouter.get("/products/destroy/:id", (req, res) => {
    productController.destroy(req, res);
});

/* -------------------orders route roles----------------------- */
webRouter.get("/orders", (req, res) => {
    orderController.index(req, res);
});
webRouter.get("/orders/show/:id", (req, res) => {
    orderController.show(req, res);
});
webRouter.get("/orders/createForm", (req, res) => {
    orderController.createForm(req, res);
});
webRouter.post("/orders/store", (req, res) => {
    orderController.store(req, res);
});
webRouter.get("/orders/updateForm/:id", (req, res) => {
    orderController.updateForm(req, res);
});
webRouter.post("/orders/update", (req, res) => {
    orderController.update(req, res);
});
webRouter.get("/orders/destroy/:id", (req, res) => {
    orderController.destroy(req, res);
});
// add more route roles

module.exports = webRouter;
