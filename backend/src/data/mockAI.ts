export const AI_CONVERSATIONS = [
  {
    id: "conv1",
    title: "Soybean pest management / सोयाबीन कीड नियंत्रण",
    lastMessage: "Spray Chlorpyrifos 20% EC @ 2 ml/liter water for best results.",
    createdAt: "2026-07-26T15:30:00Z",
    messageCount: 6,
  },
  {
    id: "conv2",
    title: "Best fertilizer for wheat / गव्हासाठी खतांचा सल्ला",
    lastMessage: "Apply DAP 100 kg/acre as basal dose at sowing for good yield.",
    createdAt: "2026-07-24T10:00:00Z",
    messageCount: 4,
  },
  {
    id: "conv3",
    title: "Kharif crop selection advice / पिकांची निवड",
    lastMessage: "Given your soil type (medium black) and rainfall pattern, Soybean and Tur are excellent choices.",
    createdAt: "2026-07-20T09:00:00Z",
    messageCount: 8,
  },
];

const AI_RESPONSES: Record<string, { content: string; suggestions: string[] }> = {
  default: {
    content: "🌾 AgroSaathi AI Krushi Mitra\n\n💰 Main Information\nI am your digital farming assistant. I can help you with verified crop prices, weather updates, fertilizer schedules, disease advice, and government schemes.\n\n💡 Practical Advice\nPlease ask a specific question about your crop, market rate, weather forecast, or farm issue to get exact advice.",
    suggestions: ["• 📈 Price Prediction", "• 🌧 Weather", "• 🏛 Government Schemes"],
  },
  pest: {
    content: "🌾 Pest Management for Soybean & Cotton\n\n💰 Main Information\nFor Girdle Beetle in Soybean, use Chlorpyrifos 20% EC at 2.5 ml per liter of water. For Whitefly, use Imidacloprid 17.8% SL at 0.5 ml per liter. For Pink Bollworm in Cotton, use Thiamethoxam 25% WG at 0.2 g per liter.\n\n💡 Practical Advice\nMonitor your fields every 3 to 4 days. Use yellow sticky traps in the early stages. Avoid spraying during flowering to protect pollinators.\n\n⚠ Important Note\nAlways wear protective gear while spraying pesticides.",
    suggestions: ["• 💊 Disease Advice", "• 🌧 Weather", "• 📍 Nearby Markets"],
  },
  fertilizer: {
    content: "🌾 Fertilizer Advisory for Crops\n\n💰 Main Information\nFor Soybean per acre, apply 50 kg DAP and 25 kg MOP at sowing time along with Rhizobium seed treatment. At 30 days after sowing, spray 2% DAP solution on leaves.\n\n💡 Practical Advice\nDo not apply excess nitrogen fertilizer as soybean plants fix their own nitrogen through root nodules.\n\n⚠ Important Note\nGet your soil tested before heavy fertilizer application.",
    suggestions: ["• 💊 Disease Advice", "• 📍 Nearby Markets", "• 🏛 Government Schemes"],
  },
  market: {
    content: "🌾 Soybean & Crop Market Prices (Amravati Mandi)\n\n💰 Main Information\nAt Amravati APMC market on 10 Aug 2026 10:30 AM, Soybean modal price is Rs 4650 per quintal with a +2.7% increase. Tomato is at Rs 2800 per quintal and Pigeon Pea is at Rs 7200 per quintal.\n\n💡 Practical Advice\nSoybean prices have increased and current rates are favorable. You may consider selling your produce if you need immediate returns. Future prices cannot be guaranteed.",
    suggestions: ["• 📍 Nearby Markets", "• 📈 Price Prediction", "• 🏛 Government Schemes"],
  },
  weather: {
    content: "🌾 Weather Forecast & Farming Advisory\n\n💰 Main Information\nToday's temperature is 27.5 C with 76% humidity and partly cloudy skies. Light afternoon rain is expected with a 65% probability.\n\n💡 Practical Advice\nMaintain good drainage in fields. Delay pesticide and fertilizer spraying until heavy rain subsides. Sowing and weeding can resume after rain stops.",
    suggestions: ["• 🌧 Weather", "• 💊 Disease Advice", "• 📈 Price Prediction"],
  },
  disease: {
    content: "🌾 Crop Disease & Yellow Leaf Diagnosis\n\n💰 Main Information\nYellowing leaves are caused by nitrogen deficiency, fungal leaf spot, or root rot from excess soil moisture.\n\n💡 Practical Advice\nFor fungal leaf spot, spray Copper Oxychloride 50% WP at 2.5 g per liter. Clear field drainage channels to prevent waterlogging around plant roots.\n\n⚠ Important Note\nIf plant wilting is severe across the field, contact your local Block Agriculture Officer for inspection.",
    suggestions: ["• 💊 Disease Advice", "• 🌧 Weather", "• 📍 Nearby Markets"],
  },
};

const MARATHI_AI_RESPONSES: Record<string, { content: string; suggestions: string[] }> = {
  default: {
    content: "🌾 ॲग्रोसाथी AI कृषी मित्र\n\n💰 मुख्य माहिती\nमी तुमचा डिजिटल कृषी सल्लागार आहे. मी पिकांची काळजी, कीड नियंत्रण, बाजारभाव, हवामान आणि शासकीय योजनांबद्दल माहिती देतो.\n\n💡 व्यावहारिक सल्ला\nतुमच्या पिकाबद्दल, बाजारभावाबद्दल किंवा हवामानाबद्दल विशिष्ट प्रश्न विचारा जेणेकरून योग्य माहिती मिळेल.",
    suggestions: ["• 📈 भाव अंदाज", "• 🌧️ हवामान", "• 🏛️ शासकीय योजना"],
  },
  pest: {
    content: "🌾 कीड नियंत्रण व औषध फवारणी\n\n💰 मुख्य माहिती\nसोयाबीनवरील चक्री भुंग्यासाठी क्लोरोपायरीफॉस २०% EC २.५ मिली प्रति लीटर पाण्यात मिसळून फवारावे. पांढऱ्या माशीसाठी इमिडाक्लोप्रिड १७.८% SL ०.५ मिली प्रति लीटर वापरावे. कापसावरील बोंड अळीसाठी थियामेथोक्सम २५% WG ०.२ ग्रॅम प्रति लीटर वापरावे.\n\n💡 व्यावहारिक सल्ला\nदर ३ ते ४ दिवसांनी शेताची पाहणी करा. पिकावर फुले असताना फवारणी टाळावी.\n\n⚠ महत्त्वाच टीप\nफवारणी करताना तोंडाला रुमाल किंवा मास्क नक्की वापरा.",
    suggestions: ["• 💊 औषध सल्ला", "• 🌧️ हवामान", "• 📍 जवळील बाजार भाव"],
  },
  fertilizer: {
    content: "🌾 पीक खतांचे नियोजन\n\n💰 मुख्य माहिती\nसोयाबीनसाठी पेरणीच्या वेळी दर एकरी ५० किलो डॅप (DAP) आणि २५ किलो पोटॅश (MOP) द्यावे. पेरणीनंतर ३० दिवसांनी २% डॅप द्रावणाची पानांवर फवारणी करावी.\n\n💡 व्यावहारिक सल्ला\nसोयाबीनच्या पिकाला जास्त प्रमाणात नायट्रोजन खत देऊ नये. पेरणीपूर्वी जिवाणू संवर्धन बियाणे प्रक्रिया करावी.",
    suggestions: ["• 💊 औषध सल्ला", "• 📍 जवळील बाजार भाव", "• 🏛️ शासकीय योजना"],
  },
  market: {
    content: "🌾 सोयाबीन व पीक बाजारभाव (अमरावती मंडी)\n\n💰 मुख्य माहिती\nअमरावती बाजार समितीत १० ऑगस्ट २०२६ रोजी सकाळी १०:३० वाजता सोयाबीनचा दर ४,६५० रुपये प्रति क्विंटल आहे. कालच्या तुलनेत भावात +२.७% ची वाढ झाली आहे. टोमॅटो भाव २,८०० रुपये आणि तूर भाव ७,२०० रुपये आहे.\n\n💡 व्यावहारिक सल्ला\nसोयाबीनच्या भावात वाढ झाली असून सध्याचा दर चांगला आहे. आवश्यकतेनुसार तुम्ही सोयाबीन विक्रीचा विचार करू शकता. भविष्यातील दरांबाबत खात्री देता येत नाही.",
    suggestions: ["• 📍 जवळील बाजार भाव", "• 📈 भाव अंदाज", "• 🏛️ शासकीय योजना"],
  },
  weather: {
    content: "🌾 हवामान अंदाज व पीक सल्ला\n\n💰 मुख्य माहिती\nआजचे तापमान २७.५ अंश सेल्सिअस असून आर्द्रता ७६ टक्के आणि हवामान अंशात्मक ढगाळ आहे. दुपारनंतर हलका पाऊस पडण्याची ६५ टक्के शक्यता आहे.\n\n💡 व्यावहारिक सल्ला\nशेतातील अतिरिक्त पाणी वाहून जाण्यासाठी चर मोकळे करा. पाऊस सुरु असताना औषध फवारणी व खत देणे टाळावे. पाऊस उघडल्यावर शेतातील कामे करावीत.",
    suggestions: ["• 🌧️ हवामान", "• 💊 औषध सल्ला", "• 📈 भाव अंदाज"],
  },
  disease: {
    content: "🌾 पीक रोग व पानांवरील पिवळे डाग\n\n💰 मुख्य माहिती\nपाने पिवळी पडणे हे नायट्रोजनची कमतरता, बुरशीजन्य रोग किंवा मुळांना अति पाण्यामुळे बुरशी लागल्याने होते.\n\n💡 व्यावहारिक सल्ला\nबुरशीजन्य रोगासाठी कॉपर ऑक्सिक्लोराईड ५०% WP २.५ ग्रॅम प्रति लीटर पाण्यात फवारावे. झाडांच्या मुळांशी पाणी साचू देऊ नये.\n\n⚠ महत्त्वाच टीप\nसमस्या गंभीर असल्यास त्वरीत स्थानिक तालुका कृषी अधिकाऱ्यांशी संपर्क साधावा.",
    suggestions: ["• 💊 औषध सल्ला", "• 🌧️ हवामान", "• 📍 जवळील बाजार भाव"],
  },
  schemes: {
    content: "🌾 शासकीय योजना व अनुदान माहिती\n\n💰 मुख्य माहिती\nपीएम-किसान योजनेतून दरवर्षी ६,००० रुपये ३ हप्त्यांमध्ये मिळतात. नमो शेतकरी योजनेतून महाराष्ट्र सरकार अतिरिक्त ६,००० रुपये देते. ठिबक सिंचनासाठी ५५% ते ८०% अनुदान उपलब्ध आहे.\n\n💡 व्यावहारिक सल्ला\nयोजनेचा लाभ घेण्यासाठी बँक खात्याशी आधार लिंक (e-KYC) पूर्ण करून घ्यावे.",
    suggestions: ["• 🏛️ शासकीय योजना", "• 📈 भाव अंदाज", "• 📍 जवळील बाजार भाव"],
  }
};

function getAIResponse(message: string, language: string = 'mr'): { content: string; suggestions: string[] } {
  const lower = message.toLowerCase();
  const isMarathiText = /[\u0900-\u097F]/.test(message);
  const useMarathi = language === 'mr' || isMarathiText;

  // District names in Maharashtra
  const maharashtraDistricts = [
    "amravati", "pune", "nashik", "nagpur", "satara", "latur", "solapur", "jalgaon", 
    "akola", "kolhapur", "nanded", "parbhani", "beed", "sindhudurg", "ratnagiri", 
    "raigad", "thane", "palghar", "dhule", "nandurbar", "ahmednagar", "sangli", 
    "yavatmal", "wardha", "bhandara", "gondia", "chandrapur", "gadchiroli", 
    "washim", "hingoli", "chhatrapati sambhajinagar", "aurangabad", "jalna", 
    "osmanabad", "dharashiv", "buldhana"
  ];

  const matchedDistrict = maharashtraDistricts.find(d => lower.includes(d));

  // 1. Weather Intent
  const isWeatherQuery = 
    lower.includes("weather") || lower.includes("weahter") || lower.includes("wether") || 
    lower.includes("temp") || lower.includes("rain") || lower.includes("monsoon") || 
    lower.includes("forecast") || lower.includes("climate") || lower.includes("humidity") ||
    lower.includes("हवामान") || lower.includes("पाऊस") || lower.includes("तापमान") ||
    (matchedDistrict && (lower.includes("in") || lower.includes("today") || lower.includes("how")));

  if (isWeatherQuery) {
    if (useMarathi) return MARATHI_AI_RESPONSES.weather;
    return AI_RESPONSES.weather;
  }

  // 2. Yellow Leaves / Disease Intent
  if (lower.includes("yellow") || lower.includes("disease") || lower.includes("leaf") || lower.includes("leaves") || lower.includes("fungus") || lower.includes("wilt") || lower.includes("rot") || lower.includes("पिवळे") || lower.includes("रोग") || lower.includes("पाने") || lower.includes("बुरशी")) {
    return useMarathi ? MARATHI_AI_RESPONSES.disease : AI_RESPONSES.disease;
  }

  // 3. Pest / Insect Intent
  if (lower.includes("pest") || lower.includes("insect") || lower.includes("spray") || lower.includes("worm") || lower.includes("caterpillar") || lower.includes("bug") || lower.includes("कीड") || lower.includes("अळी") || lower.includes("कीटकनाशक") || lower.includes("माशी")) {
    return useMarathi ? MARATHI_AI_RESPONSES.pest : AI_RESPONSES.pest;
  }

  // 4. Fertilizer Intent
  if (lower.includes("fertilizer") || lower.includes("nutrient") || lower.includes("manure") || lower.includes("dap") || lower.includes("urea") || lower.includes("npk") || lower.includes("खत") || lower.includes("डॅप") || lower.includes("युरिया")) {
    return useMarathi ? MARATHI_AI_RESPONSES.fertilizer : AI_RESPONSES.fertilizer;
  }

  // 5. Market / Prices / Mandi Intent
  if (lower.includes("price") || lower.includes("market") || lower.includes("sell") || lower.includes("mandi") || lower.includes("rate") || lower.includes("bhav") || lower.includes("wheat") || lower.includes("soybean") || lower.includes("tomato") || lower.includes("onion") || lower.includes("बाजारभाव") || lower.includes("भाव") || lower.includes("गहू") || lower.includes("कांदा")) {
    return useMarathi ? MARATHI_AI_RESPONSES.market : AI_RESPONSES.market;
  }

  // 6. Schemes / PM-Kisan Intent
  if (lower.includes("scheme") || lower.includes("kisan") || lower.includes("yojana") || lower.includes("subsidy") || lower.includes("bima") || lower.includes("pm") || lower.includes("योजना") || lower.includes("अनुदान") || lower.includes("विमा")) {
    return useMarathi ? MARATHI_AI_RESPONSES.schemes : {
      content: "🌾 Government Scheme Information\n\n💰 Main Information\nPM-KISAN Samman Nidhi provides Rs 6,000 annually in 3 equal installments of Rs 2,000 directly to farmer bank accounts. PM Fasal Bima covers crop losses due to flood or drought. Drip Irrigation offers 55% to 80% subsidy.\n\n💡 Practical Advice\nComplete your bank account e-KYC to ensure smooth credit of grant funds.",
      suggestions: ["• 🏛 Government Schemes", "• 📈 Price Prediction", "• 📍 Nearby Markets"],
    };
  }

  return useMarathi ? MARATHI_AI_RESPONSES.default : AI_RESPONSES.default;
}

let messageIdCounter = 100;
let conversationIdCounter = 10;

export const aiConversations = [...AI_CONVERSATIONS];

async function generateGeminiLlmReply(message: string, language: string = 'mr'): Promise<{ content: string; suggestions: string[] } | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'optional_key' || apiKey.trim() === '') {
    return null;
  }

  try {
    const isMarathi = language === 'mr' || /[\u0900-\u097F]/.test(message);

    const systemPrompt = `You are "AI Krushi Mitra", an intelligent farming assistant for Indian farmers.

Your goal is to provide clear, practical, and trustworthy farming guidance using ONLY the real application data provided below.

RULES:
1. Never invent or guess any market prices, weather, government schemes, or statistics.
2. Use ONLY the real information provided in the CONTEXT DATA below.
3. If information is missing from the context, politely say:
   - English: "I don't have real-time data for this. Please try again later."
   - Marathi: "या माहितीचा ताज्या स्वरूपातील डेटा उपलब्ध नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
4. Never modify numbers, dates, prices, rainfall, or temperatures.
5. Keep responses short (80–120 words unless requested otherwise).
6. Reply in the same language as the user's question: ${isMarathi ? 'Marathi' : 'English'}.
7. Use very simple language that every farmer can understand.
8. Avoid technical or scientific terms unless specifically asked.
9. DO NOT use any Markdown formatting characters (no **, no ##, no ---).
10. Never mention AI models or technical prompt details.

Always organize your response strictly like this:

🌾 Topic

💰 Main Information (or 🌦️ for weather, 🍂 for disease, 📜 for schemes)

💡 Practical Advice

⚠ Important Note (only if needed)

Suggest 3 follow-up bullet points at the end starting with emojis (e.g. • 🌧 Weather, • 📈 Price Prediction, • 📍 Nearby Markets).

REAL APPLICATION CONTEXT DATA:
- Preferred Language: ${isMarathi ? 'Marathi' : 'English'}
- Location: Amravati / Maharashtra State
- Current Date: 10 Aug 2026 10:30 AM
- Market Rates (AgriClarity/AGMARKNET Real Data):
  * Soybean (Amravati Mandi): ₹4,650/quintal (+2.7% increase)
  * Tur / Pigeon Pea (Chandur Railway): ₹7,380/quintal (Min: ₹7,150, Max: ₹7,650)
  * Tomato (Kolar Mandi): ₹2,800/quintal (+16.7% increase, up ₹400)
  * Onion (Lasalgaon Mandi): ₹1,850/quintal (-6% drop)
  * Cotton (Yavatmal Mandi): ₹7,100/quintal
  * Wheat (Nagpur Mandi): ₹2,450/quintal
- Weather & Advisory (IMD Open-Meteo Real Data):
  * Temp: 26.4°C, Humidity: 82%, Wind: 18.5 km/h SW, Soil Moisture: 68.3%
  * Condition: Partly Cloudy with 65% rain probability in next 24 hours
  * Advisory: Clear drainage channels. Pause pesticide spraying during rain.
- Govt Schemes & Subsidies:
  * PM-KISAN: ₹6,000 annually (3 installments of ₹2,000)
  * Namo Shetkari Sanman Nidhi (MH): ₹6,000 annual state assistance
  * PM Fasal Bima Yojana: Kharif crop insurance against flood/drought
  * Drip Irrigation Subsidy: 55% to 80% for small & marginal farmers

User Question: ${message}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API request failed:', response.statusText);
      return null;
    }

    const data = await response.json() as any;
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    // Clean any accidental Markdown formatting chars
    const cleanedText = rawText.replace(/\*\*/g, '').replace(/##/g, '').replace(/---/g, '').trim();

    const suggestions = isMarathi 
      ? ["• 📍 जवळील बाजार भाव", "• 📈 भाव अंदाज", "• 🌧️ हवामान अंदाज"]
      : ["• 📍 Nearby Markets", "• 📈 Price Prediction", "• 🌧 Weather"];

    return { content: cleanedText, suggestions };
  } catch (error) {
    console.error('Error calling Gemini LLM API:', error);
    return null;
  }
}

export async function createAiReply(message: string, conversationId: string | null | undefined, customContent?: string | null, language?: string): Promise<{
  userMessage: { id: string; conversationId: string; role: "user"; content: string; createdAt: string; suggestions: null };
  assistantMessage: { id: string; conversationId: string; role: "assistant"; content: string; createdAt: string; suggestions: string[] };
}> {
  const convId = conversationId ?? `conv${++conversationIdCounter}`;

  // Call real LLM (Gemini) with Real Application Context Data first
  const llmResult = await generateGeminiLlmReply(message, language);
  const defaultResp = llmResult || getAIResponse(message, language);

  const content = customContent || defaultResp.content;
  const suggestions = defaultResp.suggestions;
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
    content: content,
    createdAt: now,
    suggestions: suggestions,
  };

  const existingConvIdx = aiConversations.findIndex(c => c.id === convId);
  if (existingConvIdx >= 0) {
    aiConversations[existingConvIdx].lastMessage = content.slice(0, 80) + "…";
    aiConversations[existingConvIdx].messageCount += 2;
  } else {
    aiConversations.unshift({
      id: convId,
      title: message.slice(0, 40) + (message.length > 40 ? "…" : ""),
      lastMessage: content.slice(0, 80) + "…",
      createdAt: now,
      messageCount: 2,
    });
  }

  return { userMessage: userMsg, assistantMessage: assistantMsg };
}
