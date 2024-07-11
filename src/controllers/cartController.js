import {
  getCartsService,
  getCartByIdService,
  createCartService,
  deleteCartService,
  renderCartsService,
  deleteProductFromCartService,
  updateProductUnitsService,
  createTicketService,
  getTicketByIdService
} from "../services/cartService.js";

// Devuelve todos los carritos
async function getCarts(req, res) {
  try {
    const carts = await getCartsService();
    res.json(carts);
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: "Failed to fetch carts!" });
  }
}

// Devuelve un carrito por su ID
async function getCartById(req, res) {
  const { cid } = req.params;
  const userId = req.user._id;
    
  try {
    const result = await getCartByIdService(cid, userId);
    if (!result) {
      return res.status(404).send({ status: "error", error: "Cart not found or access denied!" });
    }
    res.send({ result: "success", payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: "Failed to fetch cart!" });
  }
}

// Crea un carrito con los ID de los productos seleccionados
// Si se pasa cantidad de unidades se agrega ese monto a "units", sino por defecto es 1
// Es necesario que haya una sesion iniciada de algun usuario
async function createCart(req, res) {
  const { productId, units } = req.body;
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).send({ status: "error", error: "User not authenticated!" });
  }

  if (!productId) {
    return res.status(400).send({ status: "error", error: "Product ID is required!" });
  }

  try {
    const result = await createCartService(userId, productId, units);
    res.send({ result: result.message });
  } catch (error) {
    console.error("Error adding product to cart!:", error);
    res.status(500).send({ status: "error", error: "Failed to add product to cart!" });
  }
}

// Borra todo el carrito
async function deleteCart(req, res) {
  const { cid, userId } = req.params;
  try {
    const result = await deleteCartService(cid);
    if (!result.deletedCount) {
      return res.status(404).send({ status: "error", error: "Cart not found!" });
    }
    res.send({ result: "Success deleting cart!", payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: "Failed to delete cart!" });
  }
}

// Renderiza los carritos en el front
async function renderCarts(req, res) {
  try {
    const carts = await renderCartsService();
    res.render("carts", { carts: carts });
  } catch (error) {
    console.log("Error fetching carts:", error);
    res.status(500).send({ status: "error", error: "Failed to fetch carts!" });
  }
}

// Elimina un producto dado su ID de un carrito
async function deleteProductFromCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const result = await deleteProductFromCartService(cid, pid);
    res.send({ result: result.message });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).send({ status: "error", error: "Failed to remove product from cart!" });
  }
}

// Actualiza la cantidad de un producto en un carrito
async function updateProductUnits(req, res) {
  const { cid, pid } = req.params;
  const { units } = req.body;

  if (!units || isNaN(units) || units < 0) {
    return res.status(400).send({ status: "error", error: "Invalid units provided" });
  }

  try {
    const result = await updateProductUnitsService(cid, pid, units);
    res.send({ result: result.message });
  } catch (error) {
    console.error("Error updating product units in cart:", error);
    res.status(500).send({ status: "error", error: "Failed to update product units in cart!" });
  }
}

// Crear un ticket a partir del carrito del user
async function createTicket(req, res) {
  const { cid } = req.params;
  try {
    const ticket = await createTicketService(cid);
    if (!ticket) {
      return res.status(404).send({ status: "error", error: "Cart not found!" });
    }
    res.send({ status: "success", payload: ticket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).send({ status: "error", error: "Failed to create ticket!" });
  }
}

// Devuelve un ticket por id
async function getTicketById(req, res) {
  const { tid } = req.params;
  try {
    const ticket = await getTicketByIdService(tid);
    if (!ticket) {
      return res.status(404).send({ status: "error", error: "Ticket not found!" });
    }
    res.send({ status: "success", payload: ticket });
  } catch (error) {
    console.error("Error getting ticket:", error);
    res.status(500).send({ status: "error", error: "Failed to get ticket!" });
  }
}

export {
  getCarts,
  getCartById,
  createCart,
  deleteCart,
  renderCarts,
  deleteProductFromCart,
  updateProductUnits,
  createTicket,
  getTicketById
};