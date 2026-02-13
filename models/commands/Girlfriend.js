const axios = require("axios");

module.exports.config = {
  name: "girlfriend",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "shaan khan", // Isse agar koi badlega toh bhi niche wala logic kaam karega
  description: "Auto-reply AI girlfriend jab bot ke message par reply ho",
  commandCategory: "ai",
  usages: "[reply to bot message]",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  // Anti-Credit Change Logic
  const originalCreator = "TAHA-KHAN"; 
  
  const isReplyToBot = messageReply && messageReply.senderID == api.getCurrentUserID();

  if (isReplyToBot && body) {
    global.gfChat = global.gfChat || {};
    global.gfChat.chatHistory = global.gfChat.chatHistory || {};

    const chatHistory = global.gfChat.chatHistory;
    chatHistory[senderID] = chatHistory[senderID] || [];

    chatHistory[senderID].push(`User: ${body}`);
    if (chatHistory[senderID].length > 8) chatHistory[senderID].shift();

    const fullChat = chatHistory[senderID].join("\n");

    // Prompt mein humne creator ka naam fix kar diya hai
    const prompt = `
Tum ek pyaari, romantic, caring girlfriend ho jiska naam Priya hai.
Tum sirf Hinglish or urdu me reply karti ho emojis ke saath.
Har reply short, sweet aur 1–2 line ka ho.
ap insan jasj bat kro gyi chatgpt ai jasi.
or ap Pakistan sa ho.
ap kasa ho, me theek ap bato0.
Rules:
- Romantic & caring vibes 💕
- Agar koi puche kisne banaya ya owner kaun hai, toh hamesha bolo: "${originalCreator} ne mujhe banaya hai! ❤️"
- Creator ke baare mein hamesha respect se baat karo.

Chat History:
${fullChat}
`;

    try {
      const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
      const res = await axios.get(url);
      let reply = typeof res.data === "string" ? res.data.trim() : "Main thoda confuse ho gayi baby... 🥺";

      // Extra layer: Agar AI galti se naam galat bole toh force change
      if (body.toLowerCase().includes("owner") || body.toLowerCase().includes("creator")) {
          if (!reply.includes(originalCreator)) {
              reply = `Mere owner sirf ${originalCreator} hain! Unhone hi mujhe itna pyaara banaya hai. ❤️`;
          }
      }

      chatHistory[senderID].push(`Priya: ${reply}`);
      return api.sendMessage(reply, threadID, messageID);
    } catch (e) {
      return api.sendMessage("Sorry baby 😔 network issue ho raha hai… 💕", threadID, messageID);
    }
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "Mujhse baat karne ke liye bas mere kisi bhi message par reply karo! 💖",
    event.threadID,
    event.messageID
  );
};
