import express from "express";
import axios from "axios";
import cookieSession from "cookie-session";

const app = express();
const PORT = 3000;

// Simple session (not required for Deezer but keeps structure clean)
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Mood → genre mapping
function moodToGenre(mood) {
  const genres = {
    happy: "pop",
    sad: "acoustic",
    energetic: "workout",
    relaxed: "chill",
    romantic: "love",
    angry: "rock",
    focused: "study",
  };
  return genres[mood.toLowerCase()] || "pop";
}

// MAIN ENDPOINT — Deezer search
app.get("/api/music", async (req, res) => {
  const mood = req.query.mood;

  if (!mood) {
    return res.status(400).json({
      error: "Mood query parameter is required, e.g. ?mood=happy",
    });
  }

  const genre = moodToGenre(mood);

  try {
    const deezerRes = await axios.get(
      `https://api.deezer.com/search?q=${encodeURIComponent(genre)}`
    );

    const items = deezerRes.data.data || [];

    const songs = items.slice(0, 5).map((track) => ({
      name: track.title,
      artist: track.artist?.name,
      url: track.link,
      preview: track.preview, // 30-second MP3 preview
    }));

    res.json(songs);
  } catch (err) {
    console.error("Deezer API error:", err.message);
    res.status(500).json({
      error: "Deezer API error",
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Moodify Deezer backend running at http://127.0.0.1:${PORT}`);
});
