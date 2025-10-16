module.exports.config = {
        name: "joinNoti",
        eventType: ["log:subscribe"],
        version: "1.0.1",
        credits: "CatalizCS", //fixing ken gusler
        description: "Notify bot or group member with random gif/photo/video",
        dependencies: {
                "fs-extra": "",
                "path": "",
                "pidusage": ""
        }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

        const path = join(__dirname, "cache", "joinGif");
        if (existsSync(path)) mkdirSync(path, { recursive: true });        

        const path2 = join(__dirname, "cache", "joinGif", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}


module.exports.run = async function({ api, event }) {
        const { join } = global.nodemodule["path"];
        const { threadID } = event;
        if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
                api.changeNickname(`{ ${global.config.PREFIX} } × ${(!global.config.BOTNAME) ? "bot" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
                const fs = require("fs");
                return api.sendMessage("🩵🍒 𝙷𝚎𝚕𝚕𝚘 𝙴𝚟𝚎𝚛𝚢𝚘𝚗𝚎 🙋🏻‍♀️", event.threadID, () => api.sendMessage({body:`💝 𝐒𝐇𝐘𝐀𝐌 𝐃𝐈𝐖𝐀𝐍𝐈 𝐁𝐎𝐓 💝\n✧═════════•❁❀❁•═════════✧\n💝 वेलकम करो जल्दी जल्दी मेरा आपका प्यारा बोट आ गया 💝\n✧═════════•❁❀❁•═════════✧\n🇲‌🇦‌🇸‌🇹‌🇮‌ 🇧‌🇴‌🇹‌\n✧═════════•❁❀❁•═════════✧\n🍒🌸🍒 आपका ग्रुप को मेरे बॉस कृष्णा ज़ी ने अप्रूव कर दिया है 🍒🌸🍒\n✧═════════•❁❀❁•═════════✧\n ☟☟ 🍒🩵 बोट का मालिक  ☟☟\n🇰‌🇷‌🇮‌🇸‌🇭‌🇳‌🇦‌ \n✧═════════•❁❀❁•═════════✧\n🩷🩵 आप लोगो को किसी भी तारे की हेल्प चाहिए तो मेरे बॉस से कांटेक्ट कर सकते हो 🌸💝🍒\n✧═════════•❁❀❁•═════════✧\nUse ${global.config.PREFIX}help to see commands.\nexample :\n${global.config.PREFIX}video7 (video songs)\n${global.config.PREFIX}music (audio songs)\n${global.config.PREFIX}help2 (command list)\n${global.config.PREFIX}info\n✧═════════•❁❀❁•═════════✧\n💝🍒 ये लो मेरे बॉस की फेसबुक की लिंक ☟☟☟\nhttps://www.facebook.com/profile.php?id=61573328623221\n✧═════════•❁❀❁•═════════✧\n🩵🌸🍒 फ़ोन नम्बर मेरे बॉस का ☟☟☟\n[ 𝟴𝟬𝟵𝟰𝟴𝟮𝟴𝟮𝟯𝟳 ]`, attachment: fs.createReadStream(__dirname + "/cache/krishna.mp4")} ,threadID));
        }
        else {
                try {
                        const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
                        let { threadName, participantIDs } = await api.getThreadInfo(threadID);

                        const threadData = global.data.threadData.get(parseInt(threadID)) || {};
                        const path = join(__dirname, "cache", "joinGif");
                        const pathGif = join(path, `${threadID}.gif`);

                        var mentions = [], nameArray = [], memLength = [], i = 0;

                        for (id in event.logMessageData.addedParticipants) {
                                const userName = event.logMessageData.addedParticipants[id].fullName;
                                nameArray.push(userName);
                                mentions.push({ tag: userName, id });
                                memLength.push(participantIDs.length - i++);
                        }
                        memLength.sort((a, b) => a - b);

                        (typeof threadData.customJoin == "undefined") ? msg = "🙋🏻‍♀️𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑 🙋🏻‍♀️\n✧═════════•❁❀❁•═════════✧\n💝🍒 न्यू मेंबर नाम ➻ [ {name} ]\n✧═════════•❁❀❁•═════════✧\n🌸🍒 ग्रूप नाम ➻ [ {threadName} ]\n✧═════════•❁❀❁•═════════✧\n🤓🌸 और तोमे इस ग्रूप के ⭆[ {soThanhVien} ]⭅मेम्बर हो 🥰🩵\n✧═════════•❁❀❁•═════════✧\n😘 और मेरे साथ मस्ती करो आपका प्यारा बोट श्याम दीवानी 🍒💝🙋🏻‍♀️\n✧═════════•❁❀❁•═════════✧\n ☟☟ 🍒🩵 बोट का मालिक  ☟☟\n🇰‌🇷‌🇮‌🇸‌🇭‌🇳‌🇦‌\n✧═════════•❁❀❁•═════════✧\n💝🍒 ये लो मेरे बॉस की फेसबुक की लिंक ☟☟☟\nhttps://www.facebook.com/profile.php?id=61573328623221\n✧═════════•❁❀❁•═════════✧\n🩵🌸🍒 फ़ोन नम्बर मेरे बॉस का ☟☟☟\n[ 𝟴𝟬𝟵𝟰𝟴𝟮𝟴𝟮𝟯𝟳 ]" : msg = threadData.customJoin;
                        msg = msg
                        .replace(/\{name}/g, nameArray.join(', '))
                        .replace(/\{type}/g, (memLength.length > 1) ?  'You' : 'Friend')
                        .replace(/\{soThanhVien}/g, memLength.join(', '))
                        .replace(/\{threadName}/g, threadName);

                        if (existsSync(path)) mkdirSync(path, { recursive: true });

                        const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));

                        if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
                        else if (randomPath.length != 0) {
                                const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
                                formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }
                        }
                        else formPush = { body: msg, mentions }

                        return api.sendMessage(formPush, threadID);
                } catch (e) { return console.log(e) };
        }
                    }
