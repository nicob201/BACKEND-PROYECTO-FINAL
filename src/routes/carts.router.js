const express = require("express");
const routerCart = express.Router();
const Cart = require("../controllers/carts");

const manager = new Cart();

// Endpoints

// Devuelve todos los carritos que hay en carts.json
routerCart.get("/", async (req, res) => {
  try {
    const carts = await manager.loadCarts();
    res.status(200).send(carts);
  } catch (error) {
    res.status(500).json({ message: "Error loading carts!" });
  }
});

// Devuelve un carrito segun su id
routerCart.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    const cart = await manager.getCartProducts(cartId);
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Error loading cart!" });
  }
});

// Crea un carrito
routerCart.post("/", async (req, res) => {
  try {
    const newCart = await manager.addCart();
    res.status(200).json({ message: "Cart added!", newCart });
  } catch (error) {
    res.status(500).json({ message: "Error creating cart!" });
  }
});

// Agrega un producto segun su id al carrito segun su id
routerCart.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  try {
    const cart = await manager.addProductToCart(cartId, productId);
    res.status(200).json({ message: "Product added to cart!", cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding product to cart!" });
  }
});

module.exports = routerCart;
