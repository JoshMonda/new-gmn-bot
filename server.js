// server.js
require("dotenv").config();

const path = require("path");
const cors = require("cors");
const express = require("express");
const { App, ExpressReceiver } = require("@slack/bolt");

// ── 1) Initialize Slack ExpressReceiver on /api/slack/events ────────────────
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // This makes Bolt listen on POST /api/slack/events
  endpoints: "/api/slack/events",
});

// ── 2) Initialize your Slack Bolt App with that receiver ────────────────────
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

// ── 3) Bolt event handler: welcome on team_join ─────────────────────────────
slackApp.event("team_join", async ({ event, client }) => {
  const userId = event.user.id;
  console.log("🚀 New user joined:", userId);

  const welcomeText = `
:wave: *Welcome <@${userId}>!* Let’s help you get started and connect with other members.
• Include your headshot :busts_in_silhouette: and your marketing superpower :mechanical_arm:.
• Participate in the LIVE Tuesday Broadcast at 8 am PT / 11 am ET.
• Watch the Giver Marketing Blueprint in #general.
• Add your scheduler in #schedulers.
• Start weekly 1:1s.
• Want to be a guest speaker? Click the arrow!
• Check membership videos in #member-success.
• Share your origin story in #general.
`;

  // DM the new member
  await client.chat.postMessage({
    channel: userId,
    text: welcomeText,
  });

  // Announce in your “general” channel
  await client.chat.postMessage({
    channel: "C022WC9572N", // ← replace with your real channel ID
    text: `:tada: Please welcome <@${userId}> to the community!`,
  });
});

// ── 4) Grab the Express app from the receiver ────────────────────────────────
const app = receiver.app;

// Apply CORS + JSON body-parsing to your manual endpoints
app.use(cors());
app.use(express.json());

// 🧪 Manual: Send a welcome DM
app.post("/api/send-welcome-message", async (req, res) => {
  try {
    const { userId } = req.body;
    await slackApp.client.chat.postMessage({
      channel: userId,
      text: `:wave: *Welcome <@${userId}>!* …`,
    });
    res.json({ message: "Welcome message sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Slack message failed" });
  }
});

// 🧪 Manual: Send to a specific channel
app.post("/api/send-channel-message", async (req, res) => {
  try {
    const { userId, channelId } = req.body;
    await slackApp.client.chat.postMessage({
      channel: channelId,
      text: `:tada: Please welcome <@${userId}>!`,
    });
    res.json({ message: "Channel message sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Slack channel message failed" });
  }
});

// 🧪 Manual: Post onboarding videos
app.post("/api/send-video", async (req, res) => {
  try {
    await slackApp.client.chat.postMessage({
      channel: "C069VM8QFLN",
      text: "Helpful onboarding videos",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "1. *Welcome & Introduction*:\n<https://youtu.be/ZA7Js3Ibsk0|Watch here>",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "2. *Profile Setup*:\n<https://youtu.be/bvIUaSUdTGE|Watch here>",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "3. *Getting Showcased*:\n<https://youtu.be/vod8x79CVVQ|Watch here>",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "4. *Team Collaboration*:\n<https://youtu.be/hZ7_uf5iyCg|Watch here>",
          },
        },
      ],
    });
    res.json({ message: "Video message sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Video post failed" });
  }
});

// ── 5) Serve your React frontend build + fallback to index.html ─────────────
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ── 6) Start the Express server (Bolt routes already wired in) ─────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🌐 Express server running on port ${PORT}`);
});

// ── 7) (Optional) Log that Bolt is ready ──────────────────────────────────
(async () => {
  // For ExpressReceiver, you don't *have* to call start(), 
  // but logging here confirms your handlers are bound.
  await slackApp.start();
  console.log("⚡️ Slack Bolt app initialized");
})();
