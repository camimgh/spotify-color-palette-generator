 import React from "react";
import './Playlist.css';

interface PlaylistProps {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    onSelect: (id: string) => void;
}

const Playlist: React.FC<PlaylistProps> = ({ id, name, description, imageUrl, onSelect }) => {
    return (
        <div className="playlist-card" onClick={() => onSelect(id)}>
            <img src={imageUrl} alt={name} className="playlist-image" />
            <div className="playlist-info">
                <h3 className="playlist-title">{name}</h3>
                <p className="playlist-description">{description}</p>
            </div>
        </div>
    )
}

export default Playlist;