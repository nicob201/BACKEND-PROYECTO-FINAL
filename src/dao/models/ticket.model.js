// Modelo de Ticket de compras
import mongoose from "mongoose";
import { nanoid } from "nanoid";

const ticketCollection = "Tickets";

const ticketSchema = new mongoose.Schema({
  code: { type: String, default: () => nanoid(10), },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      units: { type: Number },
      price: { type: Number },
      total: { type: Number }
    }
  ]
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
