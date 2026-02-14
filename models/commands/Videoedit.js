const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "videoedit",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TAHA BABU",
  description: "Edit videos using AI",
  commandCategory: "Media",
  usages: "[prompt] - Reply to a video",
  prefix: true,
  cooldowns: 15
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, messageReply, type } = event;

  if (type !== "message_reply" || !messageReply) {
    return api.sendMessage(
      "⚠️ Please reply to a video with your edit prompt!\n\n📝 Usage: videoedit [prompt]\n\nExample: videoedit make it black and white, add slow motion",
      threadID,
      messageID
    );
  }

  if (!messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage(
      "❌ The message you replied to doesn't contain any video!\n\nPlease reply to a message with a video.",
      threadID,
      messageID
    );
  }

  const attachment = messageReply.attachments[0];
  if (attachment.type !== "video") {
    return api.sendMessage(
      "❌ Please reply to a video, not a " + attachment.type + "!",
      threadID,
      messageID
    );
  }

  const prompt = args.join(" ");
  if (!prompt) {
    return api.sendMessage(
      "❌ Please provide an edit prompt!\n\n📝 Usage: videoedit [prompt]\n\nExample: videoedit make it colorful and add music",
      threadID,
      messageID
    );
  }

  const videoUrl = attachment.url;

  const processingMsg = await api.sendMessage(
    "🎬 Processing your video edit request...\n⏳ This may take a few moments (videos take longer than images)...",
    threadID
  );

  try {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    // Download original video first
    const videoFileName = `original_video_${Date.now()}.mp4`;
    const videoFilePath = path.join(cacheDir, videoFileName);
    
    const videoResponse = await axios({
      url: videoUrl,
      method: "GET",
      responseType: "stream",
      timeout: 120000 // 2 minutes timeout for video download
    });

    const videoWriter = fs.createWriteStream(videoFilePath);
    videoResponse.data.pipe(videoWriter);

    await new Promise((resolve, reject) => {
      videoWriter.on("finish", resolve);
      videoWriter.on("error", reject);
    });

    // Here you would integrate with a video editing API
    // Since there's no direct video editing API in the original code,
    // we'll use a placeholder API or you can integrate with services like:
    // - RunwayML API
    // - Kapwing API
    // - FFmpeg for local processing
    
    // For now, we'll use a placeholder message
    // You can replace this with actual video editing API integration
    
    api.unsendMessage(processingMsg.messageID);
    
    // Send the original video back with a message (placeholder)
    // Replace this part with actual video editing API call
    api.sendMessage(
      {
        body: `🎬 Video edit request received!\n\n📝 Prompt: ${prompt}\n\n⚠️ Note: Video editing API is currently in development.\n\n✅ Your original video is attached below.\n\n👩‍💻 Credit: MISS ALIYA`,
        attachment: fs.createReadStream(videoFilePath)
      },
      threadID,
      () => {
        fs.unlinkSync(videoFilePath);
      },
      messageID
    );

    // For actual video editing, you would integrate with an API like:
    /*
    const formData = new FormData();
    formData.append('video', fs.createReadStream(videoFilePath));
    formData.append('prompt', prompt);
    
    const editResponse = await axios.post('https://video-editing-api.com/edit', formData, {
      headers: { ...formData.getHeaders() },
      responseType: 'stream',
      timeout: 300000
    });
    
    const editedVideoPath = path.join(cacheDir, `edited_video_${Date.now()}.mp4`);
    const editWriter = fs.createWriteStream(editedVideoPath);
    editResponse.data.pipe(editWriter);
    
    await new Promise((resolve, reject) => {
      editWriter.on("finish", resolve);
      editWriter.on("error", reject);
    });
    
    // Send edited video
    api.sendMessage(
      {
        body: `🎬 Video edited successfully!\n\n📝 Prompt: ${prompt}\n\n👩‍💻 Credit: MISS ALIYA`,
        attachment: fs.createReadStream(editedVideoPath)
      },
      threadID,
      () => {
        fs.unlinkSync(videoFilePath);
        fs.unlinkSync(editedVideoPath);
      },
      messageID
    );
    */

  } catch (error) {
    console.error("Error in videoedit command:", error);
    api.unsendMessage(processingMsg.messageID);
    
    let errorMessage = "❌ An error occurred while processing the video.";
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      errorMessage = "❌ Request timeout. Video files are large and take time to process.\n\n💡 Please try again with a smaller video.";
    } else if (error.message) {
      errorMessage += `\n\n📌 Error: ${error.message}`;
    }
    
    api.sendMessage(errorMessage, threadID, messageID);
  }
};
