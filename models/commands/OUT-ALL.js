module.exports.config = {
	name: "outall",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "ARIF BABU",
	description: "THIS BOT WAS MADE BY MR ARIF BABU",
	commandCategory: "ALL OUT OF THE GROUP BOT",
	usages: "PREFIX",
	cooldowns: 5,
	info: [
		{
			key: "Text",
			prompt: "The text you want to send to everyone",
			type: 'Document',
			example: 'Hello Em'
		}
	]
};

module.exports.run = async ({ api, event, args }) => {
    const permission = ["100085636015827","",""];
             if (!permission.includes(event.senderID))
             return api.sendMessage("MERI JAN TAHA-KHAN KO ALLOWED HA🙂✌️", event.threadID, event.messageID);
	return api.getThreadList(100, null, ["INBOX"], (err, list) => {
		if (err) throw err;
		list.forEach(item => (item.isGroup == true && item.threadID != event.threadID) ? api.removeUserFromGroup(api.getCurrentUserID(), item.threadID) : '');
		api.sendMessage('HYEEEEEEEEEEEEE 🙂✌️', event.threadID);
	});
  }
