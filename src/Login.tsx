import React from "react";

const Login: React.FC = () => {
    const clientId = '0f7a19684fdd4fc2940aa0d59c3c6013';
    const redirectUri = 'http://localhost:3000/callback';
    const scope = 'playlist-read-private';
    const state = 'yIns5qUPcxoyrWfMh3ju';

    const handleLogin = () => {
        window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    };

    return (
        <div>
            <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    )
}

export default Login;