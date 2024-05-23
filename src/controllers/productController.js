import productModel from "../dao/models/product.model.js";

// Devuelve todos los productos de la base de datos
async function getProducts(req, res) {
  try {
    const { sort, limit = 10, page = 1, category } = req.query;
    const query = category ? { category: category } : {};

    let productsSorted = {};

    if (sort === "asc" || sort === "desc") {
      productsSorted.sort = { price: sort === "asc" ? 1 : -1 };
    }

    productsSorted.limit = parseInt(limit, 10);
    productsSorted.page = parseInt(page, 10);

    const result = await productModel.paginate({}, productsSorted, query);

    // Filtro por categoria
    const categories = await productModel.distinct("category");
    result.categories = categories;
    
    /* const categoryFiltered = req.query.category;
    if (categoryFiltered) {
      const filteredProducts = allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
      res.json(filteredProducts);
    } else {
      res.json(result);
    } */

    const baseUrl = `/products?limit=${limit}&sort=${sort || ""}&category=${category || ""}`;

    result.prevLink = result.hasPrevPage ? `${baseUrl}&page=${result.prevPage}` : "";
    result.nextLink = result.hasNextPage ? `${baseUrl}&page=${result.nextPage}` : "";
    result.isValid = !(page <= 0 || page > result.totalPages);

    res.json(result);
  } catch (error) {
    console.log("Error fetching products!", error);
    res.status(500).send({ status: "error", error: "Failed to fetch products!" });
  }
}

// Devuelve un producto por su ID
async function getProductById(req, res) {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.send({ status: "error", error: "Product not found!" });
    }
    res.send(product);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).send({ status: "error", error: "Failed to get product!" });
  }
}

// Crea un nuevo producto
async function createProduct(req, res) {
  let { title, description, price, thumbnail, code, status, stock } = req.body;
  if (!title || !price || !stock) {
    return res.send({
      status: "error",
      error: "It is required to input the title, price, and stock",
    });
  }
  try {
    let result = await productModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      status: status !== undefined ? status : true,
      stock,
    });
    res.send({ result: "Product created ok!", payload: result });
  } catch (error) {
    console.log("Error creating product!:", error);
    res.status(500).send({ status: "error", error: "Failed to create the product!" });
  }
}

// Actualiza un producto existente
async function updateProduct(req, res) {
  let { pid } = req.params;
  let productToReplace = req.body;

  if (
    !productToReplace.title ||
    !productToReplace.price ||
    !productToReplace.stock
  ) {
    return res.send({
      status: "error",
      error: "Undefined parameters of products",
    });
  }
  try {
    let result = await productModel.updateOne({ _id: pid }, productToReplace);
    res.send({ result: "Product edited!", payload: result });
  } catch (error) {
    console.log("Error updating product!:", error);
    res.status(500).send({ status: "error", error: "Failed to update the product!" });
  }
}

// Elimina un producto
async function deleteProduct(req, res) {
  let { pid } = req.params;
  try {
    let result = await productModel.deleteOne({ _id: pid });
    res.send({ result: "Product deleted!", payload: result });
  } catch (error) {
    console.log("Error deleting product!:", error);
    res.status(500).send({ status: "error", error: "Failed to delete the product!" });
  }
}

// Renderiza los productos en el front
async function renderProducts(req, res) {
  const { sort, limit = 10, page = 1, category } = req.query;
  const url = `http://localhost:8080/api/products?sort=${sort}&limit=${limit}&page=${page}&category=${category}`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    res.render("products", {
      products: result.docs,
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
