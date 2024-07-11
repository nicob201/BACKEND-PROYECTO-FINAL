import {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
  renderProductsService
} from "../services/productService.js";

// Devuelve todos los productos de la base de datos
async function getProducts(req, res) {
  try {
    const { sort, limit, page, category } = req.query;
    const { result, categories } = await getProductsService({ sort, limit, page, category });

    const baseUrl = `/products?limit=${limit}&sort=${sort || ""}&category=${category || ""}`;

    // Estructura de la respuesta del server
    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}&page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}&page=${result.nextPage}` : null,
      categories: categories
    };

    res.json(response);
  } catch (error) {
    console.log("Error fetching products!", error);
    res.status(500).send({ status: "error", error: "Failed to fetch products!" });
  }
}

// Devuelve un producto por su ID
async function getProductById(req, res) {
  try {
    const product = await getProductByIdService(req.params.id);
    if (!product) {
      return res.status(404).send({ status: "error", error: "Product not found!" });
    }
    res.send(product);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).send({ status: "error", error: "Failed to get product!" });
  }
}

// Crea un nuevo producto
async function createProduct(req, res) {
  const { title, description, price, thumbnail, code, status, stock } = req.body;

  if (!title || !price || !stock) {
    return res.status(400).send({ status: "error", error: "It is required to input the title, price, and stock", });
  }

  try {
    const result = await createProductService({ title, description, price, thumbnail, code, status, stock });
    res.send({ result: "Product created ok!", payload: result });
  } catch (error) {
    console.log("Error creating product!:", error);
    res.status(500).send({ status: "error", error: "Failed to create the product!" });
  }
}

// Actualiza un producto existente
async function updateProduct(req, res) {
  const { pid } = req.params;
  const productToReplace = req.body;

  if (!productToReplace.title || !productToReplace.price || !productToReplace.stock) {
    return res.status(400).send({ status: "error", error: "Undefined parameters of products", });
  }

  try {
    const result = await updateProductService(pid, productToReplace);
    res.send({ result: "Product edited!", payload: result });
  } catch (error) {
    console.log("Error updating product!:", error);
    res.status(500).send({ status: "error", error: "Failed to update the product!" });
  }
}

// Elimina un producto
async function deleteProduct(req, res) {
  const { pid } = req.params;
  try {
    const result = await deleteProductService(pid);
    res.status(400).send({ result: "Product deleted!", payload: result });
  } catch (error) {
    console.log("Error deleting product!:", error);
    res.status(500).send({ status: "error", error: "Failed to delete the product!" });
  }
}

// Renderiza los productos en el front
async function renderProducts(req, res) {
  const { sort, limit, page, category } = req.query;

  try {
    const result = await renderProductsService({ sort, limit, page, category });
    const user = req.session.user;

    res.render("products", {
      products: result.payload,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
      sort,
      categories: result.categories,
      user,
    });
  } catch (error) {
    console.log("Error fetching products!", error);
    res.status(500).send({ status: "error", error: "Failed to fetch products!" });
  }
}

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renderProducts,
};