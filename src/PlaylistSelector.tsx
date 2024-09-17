import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Playlist from "./Playlist";

interface Playlist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
}

interface PlaylistSelectorProps {
    onSelectPlaylist: (playlistId: string) => void;
}

const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({ onSelectPlaylist }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch playlists from Spotify API
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            setError('No access token available. Please log in.')
            setLoading(false);
            return;
        };

        const fetchPlaylists = async () => {
            try {
                const response = await fetch('https://api.spotify.com/v1/me/playlists', {
                   headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                
                // Check if response is unauthorized
                if (response.status === 401) {
                    setError('Access token has expired. Please log in again.');
                    navigate('/login', { state: { message: 'Access token has expired. Please log in again.'}});
                }
                if (!response.ok) {
                    throw new Error(`Failed to fetch playlists: ${response.statusText}`);
                }
                const data = await response.json();
                if (data.items) {
                    setPlaylists(data.items);
                } else {
                    setPlaylists([])
                    console.log(data.items)
                }
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
            <div className="playlist-list">
                {playlists.map((playlist) => (
                    <Playlist
                        key={playlist.id}
                        id={playlist.id}
                        name={playlist.name}
                        description={playlist.description}
                        imageUrl={playlist.images[0]?.url || ''}
                        onSelect={onSelectPlaylist}
                    />
                ))}
            </div>
        </div>
    )
}

export default PlaylistSelector;