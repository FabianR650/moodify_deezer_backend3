import React from "react";

export default function SpotifyLoginButton() {
  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:3000/login";
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        padding: "12px 24px",
        backgroundColor: "#1DB954",
        color: "white",
        borderRadius: "50px",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      Login with Spotify
    </button>
  );
}
