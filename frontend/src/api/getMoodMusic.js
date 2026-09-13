export async function getMoodMusic(mood) {
  const res = await fetch(`http://127.0.0.1:3000/api/music?mood=${mood}`, {
    credentials: "include", // IMPORTANT: sends the session cookie
  });

  return res.json();
}