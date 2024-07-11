import { Router } from "express";
import { getMessages, createMessage } from "../services/messageService.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const messages = await getMessages();
    res.send({ result: "success", payload: messages });
  } catch (error) {
    console.error(error);
    res.status(500).send({ result: "error", error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { user_email, message } = req.body;
  try {
    const result = await createMessage({ user_email, message });
    res.status(201).send({ result: "success", payload: result });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).send({ result: "error", error: error.message });
  }
});

export default router;
