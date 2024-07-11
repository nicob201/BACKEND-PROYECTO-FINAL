import { Router } from "express";
import * as userController from "../controllers/userController.js";

const router = Router();

// Devuelve todos los usuarios
router.get("/", userController.getUsers);

// Devuelve un usuario por su id
router.get("/:uid", userController.getUserById);

// Crear usuario
router.post("/register", userController.createUser);

// Elimina un usuario dado su id
router.delete("/:uid", userController.deleteUserById);

export default router;
