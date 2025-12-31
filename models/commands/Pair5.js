const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "pair5",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "taha-babu",
  description: "Create Love Pair DP with match percentage",
  usePrefix: true,
  commandCategory: "fun",
  usages: "@mention",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

// Facebook avatar URL
const getAvatarUrl = (uid) => {
  return `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { senderID, threadID, messageID, mentions } = event;

  try {
    // Create cache directory
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    const output = path.join(cacheDir, `lovepair_${Date.now()}.png`);

    // Get users
    let uid1 = senderID;
    let uid2;
    
    if (Object.keys(mentions).length > 0) {
      uid2 = Object.keys(mentions)[0];
    } else {
      const threadInfo = await api.getThreadInfo(threadID);
      const participants = threadInfo.participantIDs.filter(id => id !== senderID);
      if (participants.length === 0) {
        return api.sendMessage("❌ No other user found to pair with!", threadID, messageID);
      }
      uid2 = participants[Math.floor(Math.random() * participants.length)];
    }

    // Get names
    let name1, name2;
    try {
      name1 = await Users.getNameUser(uid1).catch(() => "User 1");
      name2 = await Users.getNameUser(uid2).catch(() => "User 2");
      
      // Clean names (remove special characters)
      name1 = name1.replace(/[★☆✨]/g, "").trim();
      name2 = name2.replace(/[★☆✨]/g, "").trim();
      
      // Shorten if too long
      if (name1.length > 15) name1 = name1.substring(0, 15) + "...";
      if (name2.length > 15) name2 = name2.substring(0, 15) + "...";
      
    } catch (error) {
      console.log("Name error:", error);
      name1 = "User 1";
      name2 = "User 2";
    }
    
    // Generate match percentage (70% to 99%)
    const matchPercentage = Math.floor(Math.random() * 30) + 70;
    
    console.log(`Creating Love Pair: ${name1} & ${name2} - ${matchPercentage}%`);
    
    // Download avatars
    const avatar1 = await downloadAvatar(uid1, name1, cacheDir);
    const avatar2 = await downloadAvatar(uid2, name2, cacheDir);
    
    // Create canvas
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");
    
    // === BACKGROUND WITH GRADIENT ===
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, "#0a0a2a");
    gradient.addColorStop(1, "#1a1a4a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Add stars in background
    ctx.fillStyle = "#FFFFFF";
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 600;
      const radius = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // === HEADER TEXT ===
    ctx.fillStyle = "#FF6B8B";
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("LOVE PAIR", 400, 80);
    
    // Decorative line under header
    ctx.strokeStyle = "#FF6B8B";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(250, 100);
    ctx.lineTo(550, 100);
    ctx.stroke();
    
    // === LOAD AND DRAW AVATARS ===
    let img1, img2;
    try {
      const avatar1Buffer = fs.readFileSync(avatar1);
      const avatar2Buffer = fs.readFileSync(avatar2);
      
      img1 = await loadImage(avatar1Buffer);
      img2 = await loadImage(avatar2Buffer);
      console.log("✓ Images loaded");
    } catch (error) {
      console.log("✗ Using placeholder images");
      img1 = await createPlaceholderImage(name1);
      img2 = await createPlaceholderImage(name2);
    }
    
    // First avatar (LEFT)
    ctx.save();
    ctx.beginPath();
    ctx.arc(200, 250, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img1, 100, 150, 200, 200);
    ctx.restore();
    
    // Avatar border with glow effect
    ctx.strokeStyle = "#FF6B8B";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(200, 250, 100, 0, Math.PI * 2);
    ctx.stroke();
    
    // Second avatar (RIGHT)
    ctx.save();
    ctx.beginPath();
    ctx.arc(600, 250, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
