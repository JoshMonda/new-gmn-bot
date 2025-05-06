import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [channelId, setChannelId] = useState("");

  // Base URL for live vercel backend
  const API_BASE = "https://new-gmn-nxqziqd2l-joshmondas-projects.vercel.app/";

  // Send DM
  const sendWelcomeMessage = async () => {
    if (!userId) {
      alert("Please enter a Slack user ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/send-welcome-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      alert("Welcome message sent to user!");
    } catch (err) {
      console.error(err);
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  // Send video message
  const sendVideo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/send-video`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to send video");
      alert("Video message sent!");
    } catch (err) {
      console.error(err);
      alert("Error sending video message");
    } finally {
      setLoading(false);
    }
  };

  // Send channel message
  const sendChannelMessage = async () => {
    if (!userId || !channelId) {
      alert("Please enter both Slack user ID and Channel ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/send-channel-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, channelId }),
      });

      if (!res.ok) throw new Error("Failed to send channel message");
      alert("Channel welcome message sent!");
    } catch (err) {
      console.error(err);
      alert("Error sending channel message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Slack Bot Control Panel</h2>

      <input
        type="text"
        placeholder="Enter Slack user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "10px",
          width: "300px",
          fontSize: "16px",
        }}
      />

      <br />

      <input
        type="text"
        placeholder="Enter Channel ID or #channel-name"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "300px",
          fontSize: "16px",
        }}
      />

      <br />

      <button
        onClick={sendWelcomeMessage}
        disabled={loading || !userId}
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Sending..." : "Send Welcome DM"}
      </button>

      <button
        onClick={sendChannelMessage}
        disabled={loading || !userId || !channelId}
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Sending..." : "Send Channel Message"}
      </button>

      <button
        onClick={sendVideo}
        disabled={loading}
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Sending..." : "Send Video Message to the channel"}
      </button>
    </div>
  );
};

export default App;
