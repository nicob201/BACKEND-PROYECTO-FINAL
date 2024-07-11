import { Router } from "express";
import * as cartController from "../controllers/cartController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

// Rutas para GET
router.get("/", cartController.getCarts);
router.get("/:cid", cartController.getCartById);
router.get("/ticket/:tid", isAuthenticated, cartController.getTicketById);

// Rutas para POST
router.post("/", isAuthenticated, cartController.createCart);
router.post("/:cid/ticket", isAuthenticated, cartController.createTicket);

// Rutas para PUT
router.put("/:cid/product/:pid", isAuthenticated, cartController.updateProductUnits);

// Rutas para DELETE
router.delete("/:cid", isAuthenticated, cartController.deleteCart);
router.delete("/:cid/product/:pid", isAuthenticated, cartController.deleteProductFromCart);

export default router;
