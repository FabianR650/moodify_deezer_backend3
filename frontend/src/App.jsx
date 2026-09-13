import { useState } from "react";

export default function App() {
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function fetchSongs() {
    if (!mood.trim()) return;

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      // Ensure no trailing slash on the base URL to prevent double slashes (//api/music)
      const rawBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";
      const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

      const response = await fetch(`${API_BASE_URL}/api/music?mood=${encodeURIComponent(mood)}`);

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setSongs([]);
      } else {
        setSongs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("Failed to fetch songs. Please try again.");
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto",
        color: "#333",
        backgroundColor: "#e6ded5",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1>Moodify</h1>

      {/* Mood Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchSongs();
        }}
      >
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

        <button
          type="submit"
          disabled={loading || !mood.trim()}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Get Songs"}
        </button>
      </form>

      {/* Error Message */}
      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {/* Songs List / Dynamic Message */}
      {!hasSearched && !error && (
        <p style={{ marginTop: "20px" }}>Enter a mood above to generate a playlist.</p>
      )}

      {hasSearched && songs.length === 0 && !error && !loading && (
        <p style={{ marginTop: "20px" }}>No songs found for "{mood}". Try another mood!</p>
      )}

      {songs.map((song, index) => (
        <div
          key={song.id || song.url || index}
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
            <div style={{ marginTop: "10px" }}>
              <audio controls src={song.preview} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}