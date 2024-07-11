import cartModel from "../dao/models/cart.model.js";
import userModel from "../dao/models/user.js";
import ticketModel from "../dao/models/ticket.model.js";
import sendEmail from "./emailService.js";
import { nanoid } from "nanoid";
import config from "../config/config.js";

// Devuelve los carritos
async function getCartsService() {
  return await cartModel.find().populate("products.product");
}

// Devuelve un carrito dado su ID
async function getCartByIdService(cid, userId) {
  const cart = await cartModel.findOne({ _id: cid, user: userId }).populate("products");
  return cart;
}

// Crea un nuevo carrito
async function createCartService(userId, productId, units = 1) {
  let cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    cart = await cartModel.create({
      user: userId,
      products: [{ product: productId, units }],
    });
    await cart.save();
    await userModel.findByIdAndUpdate(userId, {
      $push: { cart: { id: cart._id } },
    });
    return { message: "Success adding product to cart!" };
  }
  // Si ya existe el producto en el carrito, se agrega una unidad adicional a la cantidad que ya tenia
  const existingProduct = cart.products.find((item) => item.product._id.toString() === productId);
  if (existingProduct) {
    existingProduct.units += parseInt(units);
  } else {
    cart.products.push({ product: productId, units });
  }
  await cart.save();
  return { message: "Success adding product to cart!" };
}

// Borra un carrito
async function deleteCartService(cid) {
  return await cartModel.deleteOne({ _id: cid });
}

// Renderiza carritos
async function renderCartsService() {
  return await cartModel.find().populate("products.product").lean();
}

// Borra un producto determinado de un carrito
async function deleteProductFromCartService(cid, pid) {
  // primero se busca el carrito
  const cart = await cartModel.findById(cid);
  if (!cart) {
    throw new Error("Cart not found!");
  }
  // si se encuentra el carrito y el id del producto, se lo borra del carrito
  cart.products = cart.products.filter((product) => product.product._id != pid);
  await cart.save();
  return { message: "Success removing product from cart!" };
}

// Actualiza las cantidades de un producto en un carrito
async function updateProductUnitsService(cid, pid, units) {
  const cart = await cartModel.findById(cid);
  if (!cart) {
    throw new Error("Cart not found!");
  }

  const existingProduct = cart.products.find((item) => item.product._id.toString() === pid);
  if (existingProduct) {
    existingProduct.units += parseInt(units);
  } else {
    cart.products.push({ product: pid, units });
  }

  await cart.save();
  return { message: "Success updating product units in cart!" };
}

// Crea un ticket a partir del carrito
async function createTicketService(cid) {
  const cart = await cartModel.findById(cid).populate("products.product");
  if (!cart) {
    throw new Error("Cart not found!");
  }

  const products = cart.products.map(item => ({
    product: item.product._id,
    title: item.product.title,
    units: item.units,
    price: item.product.price,
    total: item.units * item.product.price
  }));

  const totalAmount = products.reduce((acc, item) => acc + item.total, 0);

  const ticket = await ticketModel.create({
    amount: totalAmount,
    purchaser: cart.user,
    code: nanoid(10)
  });

  // Detalle de los productos en formato HTML para el email
  const productDetails = products.map(item => `
    <tr>
      <td>${item.title}</td>
      <td>${item.units}</td>
      <td>${item.price}</td>
      <td>${item.total}</td>
    </tr>
  `).join("");

  const emailHTML = `
    <h1>Detalle de tu compra</h1>
    <p>Gracias por tu compra! Detalle de los productos:</p>
    <p><strong>Número de Orden:</strong> ${ticket.code}</p>
    <table border="1">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${productDetails}
      </tbody>
    </table>
    <p>Total: $ ${totalAmount}</p>
  `;

  // Enviar email al comprador
  await sendEmail(config.MAILING_EMAIL, "Detalle de tu compra", "", emailHTML);

  return ticket;
}

// Devuelve el ticket dado su id
async function getTicketByIdService(tid) {
  const ticket = await ticketModel.findById(tid).populate("products.product");
  if (!ticket) {
    throw new Error("Ticket not found!");
  }
  return ticket;
}

export {
  getCartsService,
  getCartByIdService,
  createCartService,
  deleteCartService,
  renderCartsService,
  deleteProductFromCartService,
  updateProductUnitsService,
  createTicketService,
  getTicketByIdService
};