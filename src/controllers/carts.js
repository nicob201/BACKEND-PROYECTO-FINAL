const fs = require("fs");

class Cart {
  constructor(id, products) {
    this.id = id;
    this.products = products;
    this.path = "./src/data/carts.json";
  }

  // Cargar el/los carritos que hay en carts.json
  async loadCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading carts!", error);
      throw error;
    }
  }

  // Agregar un carrito nuevo a carts.json
  async addCart() {
    try {
      const carts = await this.loadCarts();
      let newId = carts.length + 1;
      const cartId = carts.find((cart) => cart.id === newId);
      if (cartId) {
        newId = newId + 1;
      }
      const newCart = { id: newId, products: [] };
      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return newCart;
    } catch (error) {
      console.error("Error generating new cart!", error);
      throw error;
    }
  }

  // Obtener los productos de un carrito dado un id
  async getCartProducts(id) {
    try {
      const carts = await this.loadCarts();
      const cart = carts.find((cart) => cart.id === id);
      if (cart) {
        return cart.products;
      } else {
        console.log("Cart not found!");
        return null;
      }
    } catch (error) {
      console.error("Error getting cart products!", error);
      throw error;
    }
  }

  // Agregar un producto a un carrito dado su id
  async addProductToCart(cid, pid) {
    try {
      const carts = await this.loadCarts();
      const cart = carts.find((cart) => cart.id === cid);
      if (cart) {
        const product = cart.products.find((product) => product.id === pid);
        if (product) {
          product.quantity++;
        } else {
          const newProduct = { id: pid, quantity: 1 };
          cart.products.push(newProduct);
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
      } else {
        const newCart = await this.addCart();
        return this.addProductToCart(newCart.id, pid);
      }
      return cart;
    } catch (error) {
      console.error("Error adding product to cart!", error);
      throw error;
    }
  }
}

module.exports = Cart;
