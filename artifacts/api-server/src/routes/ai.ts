import { Router, type IRouter } from "express";
import { aiConversations, createAiReply } from "../data/mockAI.js";

const router: IRouter = Router();

/** GET /ai/conversations */
router.get("/ai/conversations", async (_req, res): Promise<void> => {
  res.json(aiConversations);
});

/** POST /ai/chat */
router.post("/ai/chat", async (req, res): Promise<void> => {
  const { message, conversationId } = req.body as { message?: string; conversationId?: string | null };

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  // Simulate a small delay for realism
  const { assistantMessage } = createAiReply(message, conversationId);
  res.json(assistantMessage);
});

export default router;
