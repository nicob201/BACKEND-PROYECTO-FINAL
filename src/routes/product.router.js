import { Router } from "express";
import * as productController from "../controllers/productController.js";

const router = Router();

// Rutas para GET
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// Rutas para POST
router.post("/", productController.createProduct);

// Rutas para PUT
router.put("/:pid", productController.updateProduct);

// Rutas para DELETE
router.delete("/:pid", productController.deleteProduct);

export default router;
