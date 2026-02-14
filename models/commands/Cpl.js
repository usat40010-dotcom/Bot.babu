const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports.config = {
  name: "couple",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "TAHA BABU",
  description: "Better Stylish Couple Name",
  commandCategory: "image",
  usages: "reply image + couple Name1 | Name2",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0)
      return api.sendMessage("❌ Image ko reply karo.", threadID, messageID);

    const attachment = messageReply.attachments[0];
    if (attachment.type !== "photo")
      return api.sendMessage("❌ Sirf photo pe kaam karega.", threadID, messageID);

    const input = args.join(" ");
    if (!input.includes("|"))
      return api.sendMessage("❌ Format: couple Name1 | Name2", threadID, messageID);

    const [name1, name2] = input.split("|").map(x => x.trim());

    const imgData = (await axios.get(attachment.url, { responseType: "arraybuffer" })).data;
    const img = await loadImage(imgData);

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, img.width, img.height);

    function stylishText(text, y, mainColor) {
      ctx.textAlign = "center";
      ctx.font = `bold ${Math.floor(img.width / 10)}px Arial`;

      // Outer stroke
      ctx.lineWidth = 8;
      ctx.strokeStyle = "black";
      ctx.strokeText(text, img.width / 2, y);

      // Glow
      ctx.shadowColor = mainColor;
      ctx.shadowBlur = 20;

      ctx.fillStyle = mainColor;
      ctx.fillText(text, img.width / 2, y);

      ctx.shadowBlur = 0;
    }

    stylishText(name1.toUpperCase(), img.height * 0.55, "#1e90ff");

    stylishText("X", img.height * 0.65, "#ffffff");

    stylishText(name2.toUpperCase(), img.height * 0.75, "#ff1e1e");

    ctx.font = `${Math.floor(img.width / 15)}px Arial`;
    ctx.fillStyle = "red";
    ctx.fillText("❤️", img.width / 2 - img.width / 4, img.height * 0.65);
    ctx.fillText("❤️", img.width / 2 + img.width / 4, img.height * 0.65);

    const filePath = path.join(__dirname, `couple_${Date.now()}.jpg`);
    fs.writeFileSync(filePath, canvas.toBuffer("image/jpeg"));

    api.sendMessage({
      body: "✨ Stylish Couple Card Ready 💕",
      attachment: fs.createReadStream(filePath)
    }, threadID, () => fs.unlinkSync(filePath), messageID);

  } catch (e) {
    console.error(e);
    api.sendMessage("❌ Error aaya, check hosting.", event.threadID, event.messageID);
  }
};
