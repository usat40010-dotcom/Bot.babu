const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "userinfo",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "User Info",
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
  let uid;
  try {
    // 🔎 UID detect
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else {
      uid = event.senderID;
    }

    const data = await api.getUserInfo(uid);
    const user = data[uid];

    // ⚧ Gender
    let gender = "Unknown";
    if (user.gender === 1) gender = "👦 Male";
    if (user.gender === 2) gender = "👧 Female";

    // 📦 Cache
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const avatarPath = path.join(cacheDir, `${uid}.jpg`);
    let hasAvatar = false;

    // ✅ DP FIX (real working method)
    try {
      const avatarURL = user.profileUrl + "/picture?width=720&height=720";
      const img = await axios.get(avatarURL, {
        responseType: "arraybuffer",
        maxRedirects: 5
      });
      fs.writeFileSync(avatarPath, img.data);
      hasAvatar = true;
    } catch {
      hasAvatar = false;
    }

    // 🧾 Message
    const msg =
`╭─────────── ★ ·. · ★ ────────────╮
         ✦ 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢 ✦         
╰─────────── ★ ·. · ★ ────────────╯

👤 Name : ${user.name}
🆔 UID : ${uid}
⚧ Gender : ${gender}
🤝 Friend With Bot : ${user.isFriend ? "✅ Yes" : "❌ No"}

🔗 Profile :
${user.profileUrl}

⏰ Time :
${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;

    // 📤 Send (DP optional)
    api.sendMessage(
      hasAvatar
        ? { body: msg, attachment: fs.createReadStream(avatarPath) }
        : { body: msg + "\n\n⚠️ DP Private / Not Accessible" },
      event.threadID,
      () => {
        if (hasAvatar && fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
      },
      event.messageID
    );

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ User info error aa gaya!", event.threadID, event.messageID);
  }
};
