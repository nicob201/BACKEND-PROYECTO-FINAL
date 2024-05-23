import express from "express";
import mongoose from "mongoose";
import __dirname from "./utils.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import productRouter from "./routes/product.router.js";
import handlebars from "express-handlebars";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server running on port ${PORT} OK`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use("/public", express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((error) => console.error("Connection error!", error));

app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
app.use("/", viewsRouter);
