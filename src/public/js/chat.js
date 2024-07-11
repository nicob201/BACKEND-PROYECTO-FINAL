document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname === "/chat") {
    const socket = io();

    // Evento 'message' recibido desde el server
    socket.on("message", (message) => {
      renderMessages([message]);
    });

    // Evento 'click' del boton Enviar
    document.getElementById("sendMessage").addEventListener("click", async () => {
        const result = await Swal.fire({
          title: "Ingresa tu email para poder enviar el mensaje",
          input: "text",
          inputValidator: (value) => {
            return !value && "Necesitas ingresar el email para continuar";
          },
        });

        const user = result.value;

        if (!user) return;

        const message = document.getElementById("chatBox").value;
        if (!message.trim()) return;

        try {
          // Emite el mensaje al servidor a traves del socket
          socket.emit("message", { user_email: user, message: message });

          // Guardar mensaje en la base de datos
          const response = await fetch("/api/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_email: user, message: message }),
          });

          if (!response.ok) {
            throw new Error("Error al guardar el mensaje en la base de datos");
          }

          document.getElementById("chatBox").value = "";

          // Recargar mensajes despues de que se hayan guardado en la base
          await fetchMessages();
        } catch (error) {
          console.error("Error sending message:", error);
        }
      });

    // Funcion para renderizar varios mensajes
    function renderMessages(messages) {
      const messageLogs = document.getElementById("messageLogs");
      messageLogs.innerHTML = "";

      // verifica si messages es un array
      if (Array.isArray(messages)) {
        messages.forEach((message) => {
          const messageElement = document.createElement("div");
          messageElement.innerHTML = `<div class="mx-5 my-5"><h6 class="text-primary">${message.user_email}:</h6><h6>${message.message}</h6></div>`;
          messageLogs.appendChild(messageElement);
        });
      } else {
        console.error(
          "No se pudo renderizar mensajes. messages no es un array válido:",
          messages
        );
      }
    }

    // Cargar mensajes existentes al cargar la pagina
    async function fetchMessages() {
      try {
        const response = await fetch("/api/messages");
        if (response.ok) {
          const messages = await response.json();
          if (messages.result === "success") {
            renderMessages(messages.payload);
          } else {
            console.error("Error fetching messages:", messages.error);
          }
        } else {
          console.error("Error fetching messages!");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    fetchMessages();
  }
});
