import { useState } from "react";

export default function App() {
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchSongs() {
    if (!mood) return;

    setLoading(true);
    setError("");

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

      const response = await fetch(`${API_BASE_URL}/api/music?mood=${mood}`);

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setSongs([]);
      } else {
        setSongs(data);
      }
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("Failed to fetch songs");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", textAlign: "center", maxWidth: "600px", margin: "0 auto", color: "#333", backgroundColor: "#e6ded5", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
      <h1>Moodify</h1>

      {/* Mood Input */}
      <input
        type="text"
        placeholder="Enter your mood (e.g. happy, sad, relaxed)"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        style={{
          marginTop: "20px",
          padding: "10px",
          width: "250px",
          fontSize: "16px",
        }}
      />

      {/* Fetch Button */}
      <button
        onClick={fetchSongs}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        {loading ? "Loading..." : "Get Songs"}
      </button>

      {/* Error Message */}
      {error && (
        <p style={{ color: "red", marginTop: "20px" }}>
          {error}
        </p>
      )}

      {/* Songs List */}
      {songs.length === 0 && !error ? (
        <p style={{ marginTop: "20px" }}>
          No songs yet — enter a mood above
        </p>
      ) : (
        songs.map((song, index) => (
          <div
            key={index}
            className="song"
            style={{
              marginTop: "20px",
              padding: "10px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <strong>{song.name}</strong> — {song.artist}
            <br />
            <a href={song.url} target="_blank" rel="noreferrer">
              Listen on Spotify
            </a>
            {song.preview && (
             <audio controls src={song.preview} style={{ marginTop: "10px" }} />
            )}
          </div>
        ))
      )}
    </div>
  );
}
