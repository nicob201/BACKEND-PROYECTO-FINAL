const express = require("express");
const path = require("path");
const app = express();

const productsRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/carts.router.js");

const PORT = 8080;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartRouter);

// Puerto
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT} OK`);
});
