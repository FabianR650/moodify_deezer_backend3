import axios from "axios"
import dotenv from "dotenv"

dotenv.config();

async function getAccessToken() {
  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res.data.access_token;
}

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

export default async function getSongsByMood(mood) {
  const token = await getAccessToken();
  const genre = moodToGenre(mood);

  const res = await axios.get(
    `https://api.spotify.com/v1/search?q=${genre}&type=track&limit=5`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data.tracks.items.map((track) => ({
    name: track.name,
    artist: track.artists[0].name,
    url: track.external_urls.spotify,
  }));
}
