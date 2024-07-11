import express from "express";
import * as cartController from "../controllers/cartController.js";
import * as productController from "../controllers/productController.js";
import { isAdmin, isAuthenticated, isNotAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Ruta inicial
router.get("/", isNotAuthenticated, (req, res) => {
  res.render("login");
});

// Ruta para ver todos los productos
router.get("/products", isAuthenticated, productController.renderProducts);

// Ruta para ver formulario de nuevo producto
router.get("/newProduct", isAuthenticated, isAdmin, (req, res) => {
  res.render("newProduct", {});
});

// Ruta para ver formulario de edicion de producto
router.get("/editProduct/:id", isAuthenticated, isAdmin, (req, res) => {
  res.render("editProduct");
});

// Ruta para ver los carritos
router.get("/carts", isAuthenticated, cartController.renderCarts);

// Session Login
router.get("/login", (req, res) => {
  res.render("login");
});

// Session Register
router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register");
});

// Session Profile
router.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user });
});

// Chat
router.get("/chat", (req, res) => {
  res.render("chat", {});
});

export default router;
