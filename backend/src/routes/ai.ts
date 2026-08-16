import { Router, type IRouter } from "express";
import { aiConversations, createAiReply } from "../data/mockAI.js";

const router: IRouter = Router();

/** GET /ai/conversations */
router.get("/ai/conversations", async (_req, res): Promise<void> => {
  res.json(aiConversations);
});

/** POST /ai/chat */
router.post("/ai/chat", async (req, res): Promise<void> => {
  const { message, conversationId, language } = req.body as { message?: string; conversationId?: string | null; language?: string };

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const { assistantMessage } = await createAiReply(message, conversationId, null, language);
  res.json(assistantMessage);
});

/** POST /ai/audio-query - Handle voice / speech query for Marathi, Hindi, English */
router.post("/ai/audio-query", async (req, res): Promise<void> => {
  const { language } = req.body as { language?: string; audioBase64?: string };

  const promptText = language === 'mr' 
    ? "माझ्या कापूस पिकावर पांढरी माशी आहे, उपाय सांगा."
    : language === 'hi'
    ? "मेरी सोयाबीन की फसल में कीट लग रहे हैं, समाधान बताएं।"
    : "How to manage stem borer pest in my rice crop?";

  const { assistantMessage } = await createAiReply(promptText, null);
  res.json({
    transcription: promptText,
    assistantMessage
  });
});

export default router;
