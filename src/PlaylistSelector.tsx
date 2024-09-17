import React, { useEffect, useState } from "react";

interface Playlist {
    id: string;
    name: string;
    images: { url: string }[];
}

interface PlaylistSelectorProps {
    onSelectPlaylist: (playlistId: string) => void;
}

const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({ onSelectPlaylist }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch playlists from Spotify API
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) return;

        const fetchPlaylists = async () => {
            try {
                const response = await fetch('https://api.spotify.com/v1/me/playlists', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                setPlaylists(data.items);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch playlist.');
                setLoading(false);
            }
        };
        
        fetchPlaylists();
    }, []);

    if (loading) return <div>Loading playlists...</div>;
    if (error) return <div>{error}</div>

    return (
        <div>
            <h2>Select a playlist</h2>
            <ul>
                {playlists.map((playlist) => (
                    <li key={playlist.id} onClick={() => onSelectPlaylist(playlist.id)} style={{ cursor: 'pointer'}}>
                        {playlist.images[0] ? (
                            <img src={playlist.images[0].url} alt={playlist.name} style={{ width: '50px', height: '50px'}} />
                        ) : null}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PlaylistSelector;