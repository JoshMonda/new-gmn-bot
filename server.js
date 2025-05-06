// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const { App, ExpressReceiver } = require("@slack/bolt");

// ⚡ Initialize Slack ExpressReceiver
const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// ⚡ Initialize Slack Bolt App
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver,
});

// ⚡ Auto‑send welcome message when a new user joins
slackApp.event("team_join", async ({ event, client }) => {
  const userId = event.user.id;
  console.log("🚀 New user joined:", userId);

  // ——— DM to new user ———
  const welcomeText = `
:wave: *Welcome <@${userId}>!* Let’s help you get started and connect with other members well. Your profile must include your personal headshot :busts_in_silhouette:. Include your marketing superpower :mechanical_arm:. See <@U023P5YL0HE> or <@U03670FRLKY>'s profiles as examples.

:white_check_mark: Participate in the LIVE Tuesday Broadcast at 8am PT / 11am ET via FB, LinkedIn, Twitter, YouTube.

:white_check_mark: Watch the Giver Marketing Blueprint and post action items in #general.

:white_check_mark: Add your scheduler in #schedulers.

:white_check_mark: Start 1:1 meetings in Slack weekly.

:white_check_mark: Want to be a guest speaker? Click the arrow!

:movie_camera: Get started with membership videos in #member-success.

:pushpin: Share your origin story and ask questions in #general.
`;

  await client.chat.postMessage({
    channel: userId,
    text: welcomeText,
  });

  // ——— Announcement in general channel ———
  await client.chat.postMessage({
    channel: "C022WC9572N", // replace with your actual channel ID
    text: `:tada: Please let's welcome <@${userId}> to the Giver Marketing Network community! <@${userId}> Check your DM for more info.`,
  });
});

// 🌐 Create Express server
const app = express();

// ─── Mount the Bolt receiver ────────────────────────────────────────────────────
app.use(expressReceiver.app);
// ────────────────────────────────────────────────────────────────────────────────

const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

// 🧪 Manual: Send DM
app.post("/api/send-welcome-message", async (req, res) => {
  try {
    const { userId } = req.body;
    await slackApp.client.chat.postMessage({
      channel: userId,
      text: `:wave: *Welcome <@${userId}>!* ...`,
    });
    res.status(200).json({ message: "Welcome message sent out!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Slack message failed" });
  }
});

// 🧪 Manual: Send channel message
app.post("/api/send-channel-message", async (req, res) => {
  try {
    const { userId, channelId } = req.body;
    await slackApp.client.chat.postMessage({
      channel: channelId,
      text: `:tada: Please welcome <@${userId}>...`,
    });
    res.status(200).json({ message: "Channel welcome message sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Slack channel message failed" });
  }
});

// 🧪 Manual: Send onboarding video
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
            text: "1. Welcome & Introduction:\n<https://www.youtube.com/watch?v=ZA7Js3Ibsk0|Watch here>",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "2. Profile Setup:\n<https://www.youtube.com/watch?v=bvIUaSUdTGE|Watch here>",
          },
        },

        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "3. Getting Showcased:\n<https://www.youtube.com/watch?v=vod8x79CVVQ|Watch here>",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "2. Team Collaboration:\n<https://www.youtube.com/watch?v=hZ7_uf5iyCg|Watch here>",
          },
        },
      ],
    });
    res.status(200).json({ message: "Video message sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Video post failed" });
  }
});

// Serve React frontend
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start server + Slack app
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🌐 Express server running on port ${PORT}`)
);

(async () => {
  await slackApp.start();
  console.log("⚡️ Slack Bolt app initialized and listening for events");
})();
