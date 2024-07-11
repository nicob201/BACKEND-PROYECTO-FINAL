// Configuracion del servidor websocket para el Chat de la API
import { Server } from "socket.io";

const configureSocket = (httpServer) => {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Client connected on WebSocket server!");

    socket.on("message", (message) => {
      console.log(`Received message: ${JSON.stringify(message)}`);
      io.emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected!");
    });
  });

  return io;
};

export default configureSocket;
