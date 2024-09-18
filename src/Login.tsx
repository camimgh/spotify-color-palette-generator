import React from "react";
import { useLocation } from "react-router-dom";

const Login: React.FC = () => {
    const location = useLocation();
    const message = location.state?.message;

    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '';
    const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI || 'localhost:3000/callback';
    const scope = 'playlist-read-private';
    const state = 'yIns5qUPcxoyrWfMh3ju';

    console.log('clientId:', clientId)
    console.log('redirectUri:', redirectUri)

    const handleLogin = () => {
        if (!clientId) {
            console.error("Spotify Client ID is missing")
            return;
        }
        window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    };

    return (
        <div>
            {message && <p>{message}</p>}
            <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    )
}

export default Login;