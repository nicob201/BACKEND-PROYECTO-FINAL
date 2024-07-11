// Configuracion de conexion con MongoDB
import mongoose from "mongoose";
import config from "../config/config.js";

mongoose.connect(config.MONGO_URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!");
});

export default db;
