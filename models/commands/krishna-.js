const fs = require("fs");
module.exports.config = {
  name: "arif",
    version: "1.1.1",
  hasPermssion: 0,
  credits: "ARIF BABU", 
  description: "Just Respond",
  usePrefix: true,
  commandCategory: "no prefix",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  let react = event.body.toLowerCase();
  if(react.includes("arif") ||
     react.includes("krishna") || react.includes("Ravi") || react.includes("RAVI") ||
react.includes("Krishna") ||
react.includes("KRISHNA")) {
    var msg = {
        body: `𝐃𝐄𝐊𝐇𝐎 𝐌𝐄 𝐀 𝐆𝐀𝐘𝐀 𝐀𝐀𝐏𝐊𝐀 KRISHNA 𝐁𝐀𝐁𝐔 🙈 😍 𓆩♡𓆪`,attachment: fs.createReadStream(__dirname + `/KRISHNA-BABU/PROFILE.jpg`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😘", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
