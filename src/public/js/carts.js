// Funcion para borrar el carrito completo (fetch al backend)
async function deleteCart(cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Cart deleted successfully!");
      document.getElementById('button[id^="deleteButton-"]').remove();
    } else {
      console.error("Failed to delete cart!");
    }
  } catch (error) {
    console.error("Error deleting cart!:", error);
  }
}

// Selecciona todos los botones de delete de carrito completo y llama a la funcion deleteCart
document.querySelectorAll('button[id^="deleteButton-"]').forEach((button) => {
  button.addEventListener("click", async function () {
    const cartId = button.getAttribute("data-id");
    await deleteCart(cartId);
    window.location.reload();
  });
});

// Funcion para borrar un producto determinado de un carrito (fecth al backend)
async function deleteProductFromCart(cartId, productId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log(`Product deleted successfully!`);
      await fetch(`/api/carts/`);
      window.location.reload();
    } else {
      console.error("Failed to delete product!");
    }
  } catch (error) {
    console.error("Error deleting product!:", error);
  }
}

// Selecciona todos los botones de los productos del carrito y llama a la funcion deleteProductFromCart
document.querySelectorAll('button[id^="deleteProductFromCart-"]').forEach((button) => {
  button.addEventListener("click", async function () {
    const cartElement = button.closest("[data-cart-id]");
    const cartId = cartElement.getAttribute("data-cart-id");
    const productId = button.getAttribute("data-product-id");
    await deleteProductFromCart(cartId, productId);
  });
});
