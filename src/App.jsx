import { useState } from "react";
import axios from "axios";
// import "./App.css"; // We'll use this for futuristic CSS

function App() {
  const [conversationUrl, setConversationUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversationName, setConversationName] = useState("Futuristic Session");

  const createConversation = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/conversation",
        { conversation_name: conversationName }
      );
      setConversationUrl(response.data.conversation_url);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to create conversation. Check API key or session limits.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">🤖 Lizzy
           AI Avatar Showcase</h1>
        <p className="subtitle">
          Interact with a real-time AI avatar. Voice, camera, and facial reactions enabled.
        </p>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter session name..."
          value={conversationName}
          onChange={(e) => setConversationName(e.target.value)}
          className="input-field"
        />
        <button
          onClick={createConversation}
          disabled={loading}
          className={`create-btn ${loading ? "loading" : ""}`}
        >
          {loading ? "Creating..." : "Launch Avatar"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {conversationUrl && (
        <div className="avatar-container">
          <h2 className="avatar-title">Live Avatar Session</h2>
          <iframe
            src={conversationUrl}
            width="100%"
            height="600px"
            allow="camera; microphone; autoplay"
            title="Tavus AI Avatar"
            className="avatar-iframe"
          ></iframe>
          <p className="hint">
            Speak to the avatar and watch it respond in real-time. Make sure your mic & camera are allowed.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
