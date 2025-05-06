// src/App.js
import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [channelId, setChannelId] = useState("");

  // Helper to POST JSON and throw on error
  const postJson = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      ...(body && { body: JSON.stringify(body) }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return res.json();
  };

  const sendWelcomeMessage = async () => {
    if (!userId) {
      alert("Please enter a Slack user ID.");
      return;
    }
    setLoading(true);
    try {
      await postJson("/api/send-welcome-message", { userId });
      alert("✅ Welcome message sent!");
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendChannelMessage = async () => {
    if (!userId || !channelId) {
      alert("Please enter both a Slack user ID and a Channel ID.");
      return;
    }
    setLoading(true);
    try {
      await postJson("/api/send-channel-message", { userId, channelId });
      alert("✅ Channel message sent!");
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendVideo = async () => {
    setLoading(true);
    try {
      await postJson("/api/send-video");
      alert("✅ Video message sent!");
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Slack Bot Control Panel</h2>

      <input
        type="text"
        placeholder="Enter Slack user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{ padding: 10, marginBottom: 10, width: 300, fontSize: 16 }}
      />
      <br />
      <input
        type="text"
        placeholder="Enter Channel ID or #channel-name"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
        style={{ padding: 10, marginBottom: 20, width: 300, fontSize: 16 }}
      />
      <br />

      <button
        onClick={sendWelcomeMessage}
        disabled={loading || !userId}
        style={{ margin: 10, padding: "10px 20px", fontSize: 16 }}
      >
        {loading ? "Sending…" : "Send Welcome DM"}
      </button>

      <button
        onClick={sendChannelMessage}
        disabled={loading || !userId || !channelId}
        style={{ margin: 10, padding: "10px 20px", fontSize: 16 }}
      >
        {loading ? "Sending…" : "Send Channel Message"}
      </button>

      <button
        onClick={sendVideo}
        disabled={loading}
        style={{ margin: 10, padding: "10px 20px", fontSize: 16 }}
      >
        {loading ? "Sending…" : "Send Video Message"}
      </button>
    </div>
  );
};

export default App;
