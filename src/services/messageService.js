import messageModel from "../dao/models/message.model.js";
import { io } from "../app.js";

// Devuelve todos los mensajes que hay en la base de datos al cargar la pagina del chat
export const getMessages = async () => {
    try {
        return await messageModel.find();
    } catch (error) {
        throw new Error("Error fetching messages: " + error.message);
    }
};

// Crea y almacena en la base de datos un nuevo mensaje
export const createMessage = async ({ user_email, message }) => {
    if (!user_email || !message) {
        throw new Error("User email and message are required");
    }
    try {
        const result = await messageModel.create({ user_email, message });
        io.emit("message", { user_email, message });
        return result;
    } catch (error) {
        throw new Error("Error saving message: " + error.message);
    }
};
