const axios = require("axios");

// 🔒 HARD-LOCK CREDITS PROTECTION 🔒
function protectCredits(config) {
  if (config.credits !== "TAHA-BABU") {
    console.log("\n🚫 Credits change detected! Restoring original credits…\n");
    config.credits = "TAHA-BABU";
    throw new Error("❌ Credits are LOCKED by ARIF-BABU 🔥 File execution stopped!");
  }
}

module.exports.config = {
  name: "TAHA-AI",
  version: "2.2.0",
  hasPermssion: 0,
  credits: "ARIF-BABU",
  description: "taha Babu AI (Pollinations)",
  commandCategory: "ai",
  usages: "Auto reply on name / reply",
  cooldowns: 2,
  dependencies: { axios: "" }
};

protectCredits(module.exports.config);

// =========================
// 🤖 SYSTEM PROMPT (FIXED)
// =========================
const systemPrompt = `
You are taha Babu AI.
Creator & Owner: taha Babu only.

Rules:
- User jis language mein bole, usi language mein reply do.
- Hindi, English aur Roman Urdu allowed.
- Tone masti bhari, caring, boyfriend-style ho.
- Tum pak se ho.
- Shayari ya joke ho toh short aur cute ho.
- Reply sirf 1–2 lines ka ho.
- Emojis use karo 🙂❤️😌
- Agar koi bole "AI bolo" toh reply sirf:
  Main taha Babu AI hoon 🙂❤️😌
`;

// =========================
// 🧠 CHAT HISTORY
// =========================
const historyData = {};

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
  protectCredits(module.exports.config);

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const trigger =
    body.toLowerCase().includes("ai") ||
    (messageReply && messageReply.senderID === api.getCurrentUserID());

  if (!trigger) return;

  if (!historyData[senderID]) historyData[senderID] = [];

  historyData[senderID].push({
    role: "user",
    content: body
  });

  if (historyData[senderID].length > 5) {
    historyData[senderID].shift();
  }

  api.setMessageReaction("⌛", messageID, () => {}, true);

  try {
    // =========================
    // 🤖 AI POST REQUEST
    // =========================
    const res = await axios.post(
      "https://text.pollinations.ai/openai",
      {
        messages: [
          { role: "system", content: systemPrompt },
          ...historyData[senderID]
        ]
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000
      }
    );

    const reply =
      res.data?.choices?.[0]?.message?.content ||
      "Uff baby 😕 kuch samajh nahi aaya.";

    historyData[senderID].push({
      role: "assistant",
      content: reply
    });

    api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("💖", messageID, () => {}, true);

  } catch (err) {
    console.log("AI Error:", err.response?.data || err.message);
    api.sendMessage(
      "Oops baby 😔 thodi si problem aa gayi… baad me try karo 🥺❤️",
      threadID,
      messageID
    );
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};
