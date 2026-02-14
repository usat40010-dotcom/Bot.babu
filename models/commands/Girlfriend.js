const axios = require("axios");

// 🔒 HARD-LOCK CREDITS PROTECTION 🔒
function protectCredits(config) {
  if (config.credits !== "TAHA-BABU") {
    console.log("\n🚫 Credits change detected! Restoring original credits…\n");
    config.credits = "TAHA-BABU";
    throw new Error("❌ Credits are LOCKED by TAHA-BABU 🔥 File execution stopped!");
  }
}

module.exports.config = {
  name: "TAHA-AI",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "TAHA-KHAN",
  description: "Ultra-Fast taha khan  AI (Groq API)",
  commandCategory: "ai",
  usages: "Mention or reply",
  cooldowns: 2,
  dependencies: {
    axios: ""
  }
};

// Lock check
protectCredits(module.exports.config);

// 🔑 GROQ API KEY (Yahan apni Groq key lagayein)
const GROQ_API_KEY = "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"; 

// 🧠 TEMPORARY MEMORY
const chatMemory = {};

// 🧾 SYSTEM PROMPT
const systemPrompt = `
You are taha Khan AI 🙂❤️😌
Creator & Owner: taha Khan 💞
Language: Reply ONLY in English or Roman Urdu. Strictly NO Hindi script.
Vibe: Talk like a loving boyfriend. Caring, romantic, and playful.
Style: Keep replies 1-2 lines short. Emojis are mandatory 🙂❤️😌.
`;

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
  protectCredits(module.exports.config);

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const isTrigger =
    body.toLowerCase().includes("ai") ||
    (messageReply && messageReply.senderID === api.getCurrentUserID());

  if (!isTrigger) return;

  if (!chatMemory[senderID]) chatMemory[senderID] = [];
  chatMemory[senderID].push({ role: "user", content: body });

  if (chatMemory[senderID].length > 5) chatMemory[senderID].shift();

  api.setMessageReaction("⌛", messageID, () => {}, true);

  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // Groq ka super fast model
        messages: [
          { role: "system", content: systemPrompt },
          ...chatMemory[senderID]
        ],
        max_tokens: 100,
        temperature: 0.8
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = res.data?.choices?.[0]?.message?.content || "Main yahin hoon, meri jaan 🙂❤️😌";

    chatMemory[senderID].push({ role: "assistant", content: reply });

    api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("💖", messageID, () => {}, true);

  } catch (err) {
    console.log("Groq Error:", err.response?.data || err.message);
    api.sendMessage("Connection thoda weak hai, taha se kaho check kare 🙂❤️😌", threadID, messageID);
  }
};
