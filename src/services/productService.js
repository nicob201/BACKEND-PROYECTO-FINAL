import productModel from "../dao/models/product.model.js";

// Devuelve los productos
async function getProductsService({ sort, limit = 10, page = 1, category }) {
  const query = category ? { category } : {};

  let options = {
    limit: parseInt(limit, 10),
    page: parseInt(page, 10)
  };

  // Ordenamiento por precio ascendente o descendente
  if (sort === "asc" || sort === "desc") {
    options.sort = { price: sort === "asc" ? 1 : -1 };
  }

  const result = await productModel.paginate(query, options);
  const categories = await productModel.distinct("category");

  return {
    result,
    categories
  };
}

// Devuelve un producto dado su ID
async function getProductByIdService(id) {
  return await productModel.findById(id);
}

// Crea un nuevo producto
async function createProductService({ title, description, price, thumbnail, code, status, stock }) {
  return await productModel.create({
    title,
    description,
    price,
    thumbnail,
    code,
    status: status !== undefined ? status : true,
    stock,
  });
}

// Actualiza un producto
async function updateProductService(pid, productToReplace) {
  return await productModel.updateOne({ _id: pid }, productToReplace);
}

// Elimina un producto
async function deleteProductService(pid) {
  return await productModel.deleteOne({ _id: pid });
}

// Renderiza en el front los productos
async function renderProductsService({ sort, limit = 10, page = 1, category = "" }) {
  const url = `http://localhost:8080/api/products?sort=${sort}&limit=${limit}&page=${page}&category=${category}`;
  const response = await fetch(url);
  return await response.json();
}

export {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
  renderProductsService,
};