const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "userinfo",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "(Reply / Mention / Self)",
  usePrefix: true,
  commandCategory: "utility",
  usages: "[reply | mention | self]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ api, event }) => {
  try {
    let uid;

    // ✅ UID detect
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else {
      uid = event.senderID;
    }

    // ✅ User Info
    const data = await api.getUserInfo(uid);
    const user = data[uid];

    // ✅ Gender
    let gender = "Unknown";
    if (user.gender === 1) gender = "👦 Male";
    if (user.gender === 2) gender = "👧 Female";

    // ✅ Avatar
    const cachePath = path.join(__dirname, "cache");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

    const avatarPath = path.join(cachePath, `${uid}.jpg`);
    const avatarURL = `https://graph.facebook.com/${uid}/picture?width=720&height=720`;

    const avatar = await axios.get(avatarURL, { responseType: "arraybuffer" });
    fs.writeFileSync(avatarPath, avatar.data);

    // ✅ Stylish Message (FIXED BOX)
    const msg =
`╭─────────── ★ ·. · ★ ────────────╮
│         ✦ 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢 ✦         │
╰─────────── ★ ·. · ★ ────────────╯

👤 Name : ${user.name}
🆔 UID : ${uid}
⚧ Gender : ${gender}
🤝 Friend With Bot : ${user.isFriend ? "✅ Yes" : "❌ No"}

🔗 Profile :
https://facebook.com/${uid}

⏰ Time :
${new Date().toLocaleString("en-IN", { timeZone: "Asia/Karachi" })}`;

    // ✅ Send
    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(avatarPath)
      },
      event.threadID,
      () => fs.unlinkSync(avatarPath),
      event.messageID
    );

  } catch (e) {
    console.log(e);
    api.sendMessage("❌ User info fetch karne me error aa gaya!", event.threadID, event.messageID);
  }
};
