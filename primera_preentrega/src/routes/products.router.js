const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/products.js");
const manager = new ProductManager(
  "./primera_preentrega/src/data/products.json"
);

// Endpoints

// Devuelve todos los productos del products.json
router.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    let limit = parseInt(req.query.limit);
    if (limit) {
      const arrayLimit = products.splice(0, limit);
      return res.json(arrayLimit);
    } else {
      return res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: "Error loading products" });
  }
});

// Filtro por ID
router.get("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = await manager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

// Crear nuevo producto
router.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    await manager.addProduct(newProduct);
    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error adding a new product!" });
  }
});

// Actualizar producto
router.put("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedFields = req.body;
  try {
    const result = await manager.updateProduct(productId, updatedFields);
    if (result.error === "Cannot update 'pid' field!") {
      res
        .status(400)
        .json({ error: "Cannot update the 'pid' field of a product!!" });
    } else {
      res.json({ message: "Product updated successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating the product!" });
  }
});

// Eliminar producto
router.delete("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const deleted = await manager.deleteProduct(productId);
    if (deleted) {
      res.json({ message: "Product deleted successfully!" });
    } else {
      res.status(404).json({ error: "Product id not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting the product!" });
  }
});

module.exports = router;
