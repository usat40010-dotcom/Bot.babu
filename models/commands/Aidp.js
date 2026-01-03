const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "aidp",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TAHA-BABU",
  description: "Generate FREE AI images using Pollinations (No API key)",
  commandCategory: "ai",
  usages: "pollimg <prompt>",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ");
  if (!prompt) {
    return api.sendMessage(
      "❌ Prompt likho\nExample: pollimg anime boy dp",
      event.threadID,
      event.messageID
    );
  }

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const imgPath = path.join(cacheDir, `poll_${Date.now()}.png`);

  try {
    api.sendMessage("⏳ image generate ho rahi hai...", event.threadID);

    // Prompt encode (important)
    const encodedPrompt = encodeURIComponent(prompt);

    // Pollinations FREE image URL
    const imgURL = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    // Download image
    const res = await axios.get(imgURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(res.data));

    api.sendMessage(
      {
        body: `✅ Image Generated\n🖊 Prompt: ${prompt}`,
        attachment: fs.createReadStream(imgPath)
      },
      event.threadID,
      () => fs.unlinkSync(imgPath),
      event.messageID
    );

  } catch (err) {
    console.log("❌ Pollinations Error:", err.message);
    api.sendMessage(
      "❌ Image generate nahi ho paayi (Pollinations error)",
      event.threadID,
      event.messageID
    );
  }
};
