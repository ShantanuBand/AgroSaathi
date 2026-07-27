// Mock AI conversation data

export const AI_CONVERSATIONS = [
  {
    id: "conv1",
    title: "Soybean pest management",
    lastMessage: "Spray Chlorpyrifos 20% EC @ 2 ml/liter water for best results.",
    createdAt: "2026-07-26T15:30:00Z",
    messageCount: 6,
  },
  {
    id: "conv2",
    title: "Best fertilizer for wheat",
    lastMessage: "Apply DAP 100 kg/acre as basal dose at sowing for good yield.",
    createdAt: "2026-07-24T10:00:00Z",
    messageCount: 4,
  },
  {
    id: "conv3",
    title: "Kharif crop selection advice",
    lastMessage: "Given your soil type (medium black) and rainfall pattern, Soybean and Tur are excellent choices.",
    createdAt: "2026-07-20T09:00:00Z",
    messageCount: 8,
  },
];

// Canned AI responses for realistic mock behavior
const AI_RESPONSES: Record<string, { content: string; suggestions: string[] }> = {
  default: {
    content: "Namaste! I am AgroSaathi AI, your digital farming assistant. I can help you with crop management, pest control, fertilizer recommendations, market insights, and government scheme guidance.\n\nCould you please tell me more about your query so I can give you the best advice?",
    suggestions: ["What is the best crop for this season?", "How to control pests in soybean?", "Fertilizer schedule for wheat"],
  },
  pest: {
    content: "For pest management in Kharif crops:\n\n**Soybean:**\n- Girdle Beetle: Spray Chlorpyrifos 20% EC @ 2.5 ml/liter\n- Whitefly: Imidacloprid 17.8% SL @ 0.5 ml/liter\n- Stem fly: Triazophos 40% EC @ 2 ml/liter\n\n**Preventive measures:**\n1. Monitor fields every 3–4 days during critical growth stages\n2. Use sticky yellow traps for early detection\n3. Avoid spraying during flowering to protect pollinators\n\nAlways wear protective gear while spraying. Maintain 15-day pre-harvest interval.",
    suggestions: ["Best fungicide for soybean?", "Organic pest control methods", "What is integrated pest management?"],
  },
  fertilizer: {
    content: "**Fertilizer recommendations for Soybean (per acre):**\n\n*Basal dose (at sowing):*\n- DAP: 50 kg (23 kg N + 23 kg P)\n- MOP: 25 kg (15 kg K)\n- Rhizobium + PSB seed treatment\n\n*Foliar spray (30 DAS):*\n- 2% DAP solution: spray on leaves\n\n*Micronutrients:*\n- Zinc Sulphate: 5 kg/acre if zinc deficiency visible\n\n**Note:** Soybean fixes its own nitrogen through root nodules. Avoid excess nitrogen application as it reduces nodulation.",
    suggestions: ["Organic fertilizers for soybean", "Fertilizer for wheat crop", "How to do soil testing?"],
  },
  market: {
    content: "Based on current market trends (July 27, 2026):\n\n**Top performing crops:**\n- Tomato: ₹2,800/qtl (+16.7%) — strong demand due to off-season\n- Soybean: ₹4,620/qtl (+2.67%) — export demand rising\n- Pigeon Pea: ₹7,200/qtl (+2.86%) — good prospects\n\n**My recommendation:**\nIf you are planning to sell soybean or tur dal in the next 2 weeks, current prices are favorable. However, onion and cotton prices are under pressure — consider holding if you have proper storage.\n\nCheck the Market Prices page for live mandi rates and charts.",
    suggestions: ["Where to sell my soybean?", "Price trend for wheat next month", "How to register on eNAM?"],
  },
  weather: {
    content: "**Farming advisory based on current weather (Pune district):**\n\n*This week:*\n- Tuesday–Wednesday: Heavy rain expected. Avoid pesticide spraying.\n- Thursday: Good conditions for weeding and inter-cultivation.\n- Sunday: Thunderstorm warning — secure equipment.\n\n*Monsoon progress:*\nMonsoon is progressing well in Maharashtra. Soil moisture is at 68% — adequate for transplanting and germination. Avoid over-irrigation this week.\n\n*Kharif advisory:*\nIf you haven't sown your kharif crops yet, good sowing window available on Thursday–Saturday before the next rain spell.",
    suggestions: ["Best crops for monsoon?", "How to protect crops from heavy rain?", "Soil drainage tips"],
  },
};

function getAIResponse(message: string): { content: string; suggestions: string[] } {
  const lower = message.toLowerCase();
  if (lower.includes("pest") || lower.includes("insect") || lower.includes("disease") || lower.includes("spray")) {
    return AI_RESPONSES.pest;
  }
  if (lower.includes("fertilizer") || lower.includes("nutrient") || lower.includes("manure") || lower.includes("dap") || lower.includes("urea")) {
    return AI_RESPONSES.fertilizer;
  }
  if (lower.includes("price") || lower.includes("market") || lower.includes("sell") || lower.includes("mandi") || lower.includes("rate")) {
    return AI_RESPONSES.market;
  }
  if (lower.includes("weather") || lower.includes("rain") || lower.includes("monsoon") || lower.includes("forecast") || lower.includes("temperature")) {
    return AI_RESPONSES.weather;
  }
  return AI_RESPONSES.default;
}

let messageIdCounter = 100;
let conversationIdCounter = 10;

// In-memory storage for the session
export const aiConversations = [...AI_CONVERSATIONS];

export function createAiReply(message: string, conversationId: string | null | undefined): {
  userMessage: { id: string; conversationId: string; role: "user"; content: string; createdAt: string; suggestions: null };
  assistantMessage: { id: string; conversationId: string; role: "assistant"; content: string; createdAt: string; suggestions: string[] };
} {
  const convId = conversationId ?? `conv${++conversationIdCounter}`;
  const response = getAIResponse(message);
  const now = new Date().toISOString();

  const userMsg = {
    id: `msg${++messageIdCounter}`,
    conversationId: convId,
    role: "user" as const,
    content: message,
    createdAt: now,
    suggestions: null,
  };

  const assistantMsg = {
    id: `msg${++messageIdCounter}`,
    conversationId: convId,
    role: "assistant" as const,
    content: response.content,
    createdAt: now,
    suggestions: response.suggestions,
  };

  // Update or create conversation in memory
  const existingConvIdx = aiConversations.findIndex(c => c.id === convId);
  if (existingConvIdx >= 0) {
    aiConversations[existingConvIdx].lastMessage = response.content.slice(0, 80) + "…";
    aiConversations[existingConvIdx].messageCount += 2;
  } else {
    aiConversations.unshift({
      id: convId,
      title: message.slice(0, 40) + (message.length > 40 ? "…" : ""),
      lastMessage: response.content.slice(0, 80) + "…",
      createdAt: now,
      messageCount: 2,
    });
  }

  return { userMessage: userMsg, assistantMessage: assistantMsg };
}
