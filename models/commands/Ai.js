const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Arif Babu AI (Reply + Normal Chat)",
  usePrefix: true,
  commandCategory: "AI",
  usages: "[message | reply]",
  cooldowns: 3
};

// 🧠 User-wise memory
const historyData = {};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID, messageReply } = event;

  let userMsg = args.join(" ");

  // ✅ Reply se baat
  if (!userMsg && messageReply && messageReply.body) {
    userMsg = messageReply.body;
  }

  if (!userMsg) {
    return api.sendMessage(
      "❌ Kuch likho ya AI ke message pe reply karo 🙂",
      threadID
    );
  }

  // Init memory
  if (!historyData[senderID]) {
    historyData[senderID] = [];
  }

  // 🧠 SYSTEM PROMPT (FIXED)
  const systemPrompt = `
You are Arif Babu AI.
Creator & Owner: Arif Babu only.

Behavior Rules:
- User jis language mein bole, usi language mein reply do.
- Hindi (اردو), English, aur Roman Urdu allowed.
- Tone: masti bhara, caring, boyfriend-style.
- Tum India se ho.
- Reply hamesha sirf 1–2 lines ka ho.
- Shayari ya joke ho to short aur cute ho.
- Emojis zaroor use karo 🙂❤️😌

Special Rule:
- Agar user bole "AI bolo", to exactly yahi jawab do:
  "Main taha Babu AI hoon 🙂❤️😌"
`;

  // Save user message
  historyData[senderID].push({
    role: "user",
    content: userMsg
  });

  try {
    const res = await axios.post(
      "https://text.pollinations.ai/openai",
      {
        messages: [
          { role: "system", content: systemPrompt },
          ...historyData[senderID]
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    const reply =
      res.data?.choices?.[0]?.message?.content ||
      "Aaj thoda sa chup hoon 😌";

    // Save assistant reply
    historyData[senderID].push({
      role: "assistant",
      content: reply
    });

    api.sendMessage(reply, threadID);
  } catch (err) {
    console.error("AI ERROR:", err.message);
    api.sendMessage(
      "❌ Thodi der baad baat karte hain 🙂",
      threadID
    );
  }
};
