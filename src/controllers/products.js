const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  // Listar todos los productos
  async getProducts() {
    await this.loadProducts();
    return this.products;
  }

  // Cargar los productos desde el archivo products.json
  async loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      if (data) {
        this.products = JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading products!", error);
    }
  }

  // Guardar los productos en el archivo products.json
  async saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
      console.log("Products saved successfully!");
    } catch (error) {
      console.error("Error saving products!", error);
    }
  }

  // Agregar un nuevo producto
  addProduct(product) {
    product.pid = this.products.length + 1;
    this.products.push(product);
    this.saveProducts();
    console.log("Product added to list!");
  }

  // Buscar un producto por su ID
  getProductById(productId) {
    this.loadProducts();
    const product = this.products.find((product) => product.pid === productId);
    if (product) {
      return product;
    } else {
      console.log("Product not found!");
      return null;
    }
  }

  // Actualizar un producto existente
  updateProduct(productId, updatedFields) {
    this.loadProducts();
    const index = this.products.findIndex(
      (product) => product.pid === productId
    );
    if (index !== -1) {
      if ("pid" in updatedFields) {
        return { error: "Cannot update 'pid' field!" };
      }
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.saveProducts();
      return { success: true };
    } else {
      return { error: "Product not found" };
    }
  }

  // Eliminar un producto existente
  deleteProduct(productId) {
    this.loadProducts();
    const index = this.products.findIndex(
      (product) => product.pid === productId
    );
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      console.log("Product deleted successfully!");
      return true;
    } else {
      console.log("Product not found!");
      return false;
    }
  }
}

module.exports = ProductManager;
