const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const yts = require('yt-search');

module.exports = {
  config: {
    name: "video",
    version: "2.1.0",
    hasPermssion: 0,
    credits: "SHAAN KHAN", // Updated Creator
    description: "Search and download videos from YouTube.",
    commandCategory: "Entertainment",
    usages: "[video name]",
    cooldowns: 5,
  },
  run: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query) {
      return api.sendMessage("❌ Please provide a video name. Example: video tere bin", event.threadID, event.messageID);
    }

    const searchMsg = await api.sendMessage(`🔍 Search ho raha hai: "${query}"...`, event.threadID);

    try {
      // 1. YouTube Search
      const searchResults = await yts(query);
      const videos = searchResults.videos;

      if (!videos || videos.length === 0) {
        return api.sendMessage("❌ Koi result nahi mila.", event.threadID, event.messageID);
      }

      const firstResult = videos[0];
      const videoUrl = firstResult.url;
      const title = firstResult.title;
      const duration = firstResult.timestamp;

      await api.editMessage(`🎬 Found: ${title}\n⏱️ Duration: ${duration}\n⏳ Downloading...`, searchMsg.messageID, event.threadID);

      // 2. Video Download API (New API Integrated)
      const API_BASE = "https://yt-tt.onrender.com";
      const response = await axios.get(`${API_BASE}/api/youtube/video`, {
        params: { url: videoUrl },
        timeout: 180000, // 3 minutes timeout for larger files
        responseType: 'arraybuffer'
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("API returned empty data.");
      }

      // 3. Cache Folder Setup
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
      
      const videoPath = path.join(cacheDir, `${Date.now()}.mp4`);
      fs.writeFileSync(videoPath, Buffer.from(response.data));

      // 4. Send the Video
      await api.sendMessage({
        body: `🎥 𝙔𝙚 𝙍𝙖𝙝𝙞 𝘼𝙥𝙠𝙞 𝙑𝙞𝙙𝙚𝙤\n\n📝 𝙏𝙞𝙩𝙡𝙚: ${title}\n⏱️ 𝙏𝙞𝙢𝙚: ${duration}\n👤 𝘾𝙧𝙚𝙙𝙞𝙩𝙨: TAHA KHAN`,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, () => {
        // Cleanup after sending
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        api.unsendMessage(searchMsg.messageID);
      }, event.messageID);

    } catch (error) {
      console.error("Error:", error.message);
      api.sendMessage("❌ Error: API server busy hai ya video ki size 25MB se zyada hai.", event.threadID, event.messageID);
      if (searchMsg) api.unsendMessage(searchMsg.messageID);
    }
  }
};
