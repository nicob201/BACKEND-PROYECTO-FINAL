import { Router } from "express";
import * as productController from "../controllers/productController.js";
import { isAdmin } from "../middleware/auth.js";

const router = Router();

// Rutas para GET
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// Rutas para POST
router.post("/", isAdmin, productController.createProduct);

// Rutas para PUT
router.put("/:pid", isAdmin, productController.updateProduct);

// Rutas para DELETE
router.delete("/:pid", isAdmin, productController.deleteProduct);

export default router;
