// Selecciona todos los botones de delete
document.querySelectorAll('button[id^="deleteButton-"]').forEach((button) => {
  button.addEventListener("click", async function () {
    const productId = button.getAttribute("data-id");
    await deleteProduct(productId);
  });
});

// Selecciona todos los botones de edit
document.querySelectorAll('button[id^="editButton-"]').forEach((button) => {
  button.addEventListener("click", function () {
    const productId = button.getAttribute("data-id");
    window.location.href = `/editProduct/${productId}`;
  });
});

// Filtro de categorias
let select = document.getElementById("select-category");
if (select) {
  select.addEventListener("change", function () {
    const categoryId = this.options[this.selectedIndex].innerText;
    window.location.href = `/products/?category=${categoryId}`;
  });
}

// Boton de logout header
document.getElementById('logoutButton').addEventListener('click', function () {
  document.getElementById('logoutForm').submit();
});

// Funcion para borrar el producto
async function deleteProduct(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log(`Product deleted successfully!`);
      document.getElementById(`deleteButton-${productId}`).parentElement.remove();
    } else {
      console.error("Failed to delete product!");
    }
  } catch (error) {
    console.error("Error deleting product!:", error);
  }
}

// Logica para el manejo de carritos
// Funcion para agregar un producto al carrito
async function addToCart(productId, units) {
  try {
    const response = await fetch("/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, units }),
    });
    if (response.ok) {
      console.log(`Product added to cart successfully!`);
    } else {
      console.error("Failed to add product to cart!");
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}

// Selecciona todos los botones "Add to cart"
document.querySelectorAll('button[id^="cartButton-"]').forEach((button) => {
  button.addEventListener("click", async function () {
    const { value: quantity } = await Swal.fire({
      title: "Units:",
      input: "number",
      inputAttributes: {
        min: 1
      },
      inputValidator: (value) => {
        if (!value) {
          return "Units must be > 1";
        }
      }
    });

    if (quantity) {
      const productId = button.getAttribute("data-id");
      await addToCart(productId, quantity);

      // Alert con el icono de correcto
      await Swal.fire({
        icon: 'success',
        title: 'Product added to cart!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
});

// Formulario para crear productos
const productForm = document.getElementById("productForm");
if (productForm) {
  productForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let price = document.getElementById("price").value;
    let image = document.getElementById("image").files[0];
    let code = document.getElementById("code").value;
    let status = document.getElementById("status").value;
    let stock = document.getElementById("stock").value;

    let productData = {
      title,
      description,
      price,
      image,
      code,
      status,
      stock,
    };

    try {
      let response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(productData),
      });
      let result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error fetching products!:", error);
    }
  });
}

// Logica para editar productos (cargar la data en el form)
async function loadProductData(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);
    if (response.ok) {
      const product = await response.json();
      document.getElementById("title").value = product.title;
      document.getElementById("description").value = product.description;
      document.getElementById("price").value = product.price;
      document.getElementById("code").value = product.code;
      document.getElementById("status").value = product.status.toString();
      document.getElementById("stock").value = product.stock;
    } else {
      console.error("Failed to load product data!");
    }
  } catch (error) {
    console.error("Error loading product data!:", error);
  }
}

// Formulario para editar productos
const editForm = document.getElementById("editProductForm");
if (editForm) {
  editForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const productId = window.location.pathname.split("/").pop();
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let price = document.getElementById("price").value;
    let code = document.getElementById("code").value;
    let status = document.getElementById("status").value === "true";
    let stock = document.getElementById("stock").value;

    let productData = {
      title,
      description,
      price,
      code,
      status,
      stock,
    };

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        console.log("Product updated successfully!");
        window.location.href = "/products";
      } else {
        console.error("Failed to update product!");
      }
    } catch (error) {
      console.error("Error updating product!:", error);
    }
  });

  const productId = window.location.pathname.split("/").pop();
  loadProductData(productId);
}
