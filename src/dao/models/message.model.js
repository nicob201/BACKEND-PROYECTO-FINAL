// Modelo de Mensajes del chat
import mongoose from "mongoose";

const messageCollection = "Messages";

const messageSchema = new mongoose.Schema({
  user_email: { type: String },
  message: { type: String },
});

const messageModel = mongoose.model(messageCollection, messageSchema);

export default messageModel;
