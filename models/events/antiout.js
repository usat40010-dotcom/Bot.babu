module.exports.config = {
 name: "antiout",
 eventType: ["log:unsubscribe"],
 version: "0.0.1",
 credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
 description: "Listen events"
};

module.exports.run = async({ event, api, Threads, Users }) => {
 let data = (await Threads.getData(event.threadID)).data || {};
 if (data.antiout == false) return;
 if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
 const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
 const type = (event.author == event.logMessageData.leftParticipantFbId) ? "self-separation" : "Koi Ase Pichware Mai Lath Marta Hai?";
 if (type == "self-separation") {
  api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
   if (error) {
    api.sendMessage(`🍒💖🥀__☞__𝙺𝚁𝙸𝚂𝙷𝙽𝙰 𝙱𝙰𝙱𝚄___☜___🌸💖🍒 ☞  [ ${name} ]  ☜ 𝙸𝚂𝚂𝙴 𝙳𝚄𝙱𝙰𝚁𝙰 𝙰𝙳𝙳 𝙽𝙷𝙸 𝙺𝙰𝚁 𝙿𝙰𝚈𝙸 🥹 𝙶𝚁𝙾𝚄𝙿 𝙼𝙴 🫣 𝚂𝙰𝚈𝙰𝙳 𝙼𝚄𝙹𝙷𝙴 𝙱𝙻𝙾𝙲𝙺 𝙺𝙰𝚁 𝙺𝙴 𝙱𝙷𝙰𝙶 𝙶𝙰𝚈𝙰____🌸🍒🥹 :( `, event.threadID)
   } else api.sendMessage(`🌸🥀🍒_____𝙱𝙷𝙰𝙶 𝙺𝙴 𝙹𝙰𝙽𝙴 𝙺𝙰 𝙽𝙷𝙸 ☞ [ ${name} ] ☜ 😁 𝙱𝙴𝙱𝚈 𝙳𝙴𝙺𝙷𝙾 💖 ☞ ★𝗢𝘄𝗻𝗲𝗿 ➺ ✦𝐊𝐫𝐢𝐬𝐡𝐧𝐚 𝐁𝐚𝐛𝐮✦ ☜ 💖 𝙽𝙴 𝙵𝙷𝙸𝚁 𝚂𝙴 𝙰𝙳𝙳 𝙺𝙰𝚁 𝙳𝙸𝚈𝙰 𝙰𝙰𝙿𝙺𝙾____🌸🥀🍒`, event.threadID);
  })
 }
}
