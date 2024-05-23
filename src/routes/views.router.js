import express from "express";
import * as cartController from "../controllers/cartController.js";
import * as productController from "../controllers/productController.js";

const router = express.Router();

// Ruta para ver todos los productos
router.get("/products", productController.renderProducts);

// Ruta para ver formulario de nuevo producto
router.get("/newProduct", (req, res) => {
  res.render("newProduct", {});
});

// Ruta para ver formulario de edicion de producto
router.get("/editProduct/:id", (req, res) => {
  res.render("editProduct");
});

// Ruta para ver los carritos
router.get("/carts", cartController.renderCarts);

export default router;
