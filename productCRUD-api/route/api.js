const express = require("express");
const apiRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const productApiController = require("../controllers/productApiController");
const orderApiController = require("../controllers/orderApiController");
const authController = require("../controllers/authController");

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

/* ---------- auth ----------------- */

apiRouter.post("/signin", (req, res) => {
    authController.signin(req, res);
});

apiRouter.post("/signup", (req, res) => {
    authController.signup(req, res);
});
///////////////////////
/* apiRouter.use(authController.verifySignin); */

/* -------------------products route roles----------------------- */
apiRouter.get("/products", (req, res) => {
    productApiController.index(req, res);
});
apiRouter.get("/products/show/:id", (req, res) => {
    productApiController.show(req, res);
});
apiRouter.get("/products/createForm", (req, res) => {
    productApiController.createForm(req, res);
});

/* ---****---- */
apiRouter.post("/products/store", upload.single("photo"), (req, res) => {
    productApiController.store(req, res);
});

apiRouter.get("/products/updateForm/:id", (req, res) => {
    productApiController.updateForm(req, res);
});
apiRouter.post("/products/update", upload.single("photo"), (req, res) => {
    productApiController.update(req, res);
});
apiRouter.get("/products/destroy/:id", (req, res) => {
    productApiController.destroy(req, res);
});

/* -------------------orders route roles----------------------- */
// Apply auth middleware to all order routes
apiRouter.use("/orders", authController.verifySignin);

apiRouter.get("/orders", (req, res) => {
    orderApiController.index(req, res);
});
apiRouter.get("/orders/show/:id", (req, res) => {
    orderApiController.show(req, res);
});
apiRouter.post("/orders/store", (req, res) => {
    orderApiController.store(req, res);
});
apiRouter.put("/orders/update", (req, res) => {
    orderApiController.update(req, res);
});
apiRouter.delete("/orders/destroy/:id", (req, res) => {
    orderApiController.destroy(req, res);
});

// Confirm order route
apiRouter.put("/orders/:id/confirm", (req, res) => {
    orderApiController.confirmOrder(req, res);
});
// add more route roles

module.exports = apiRouter;
