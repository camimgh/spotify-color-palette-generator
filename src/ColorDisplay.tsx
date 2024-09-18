import React, { useState, useEffect } from "react";
import './ColorDisplay.css';

interface AudioFeatures {
  danceability: number;
  energy: number;
  valence: number;
  tempo: number;
}

// Use euclidean distance to calculate distance between 2 songs
const euclideanDistance = (a: AudioFeatures, b: AudioFeatures): number => {
  return Math.sqrt(
    (a.danceability - b.danceability) ** 2 +
    (a.energy - b.energy) ** 2 +
    (a.valence - b.valence) ** 2 +
    (a.tempo - b.tempo) ** 2
  );
}

// Function to calculate the average audio features for a group of songs
const averageAudioFeatures = (featuresArray: AudioFeatures[]): AudioFeatures => {
  const totalSongs = featuresArray.length;

  const summedFeatures = featuresArray.reduce(
    (acc, features) => {
      acc.danceability += features.danceability;
      acc.valence += features.valence;
      acc.energy += features.energy;
      acc.tempo += features.tempo
      return acc;
    },
    { danceability: 0, energy: 0, valence: 0, tempo: 0}
  );

  return {
    danceability: summedFeatures.danceability / totalSongs,
    energy: summedFeatures.energy / totalSongs,
    valence: summedFeatures.valence / totalSongs,
    tempo: summedFeatures.tempo / totalSongs,
  };
};

const kMeansClustering = (playlist: AudioFeatures[], k: number, maxIterations: number): AudioFeatures[][] => {
  // Randomly initialize entroids
  let centroids = playlist.slice(0, k);

  let clusters: AudioFeatures[][] = [];
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    clusters = Array.from({ length: k }, () => []);

    // Assign each song to the closest centroid
    // eslint-disable-next-line
    playlist.forEach((song) => {
      let closestCentroidIndex = 0;
      let minDistance = Infinity 

      centroids.forEach((centroid, index) => {
        const distance = euclideanDistance(song, centroid)
        if (distance < minDistance) {
          closestCentroidIndex = index;
          minDistance = distance;
        }
      });

      clusters[closestCentroidIndex].push(song);
    });

    centroids = clusters.map((cluster) => averageAudioFeatures(cluster));
  }
  return clusters;
}

// Helper function to map a value from one range to another
const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// Function to generate a color based on audio features
const generateColor = (features: AudioFeatures): string => {
  const { danceability, energy,  tempo} = features;

  // Map valence to hue (0–360) -> Blue (sad) to Red (happy)
    const hue = mapRange(tempo, 60, 200, 0, 360)

  // Map energy to saturation (0–100%) -> More energy, more saturation
  const saturation = mapRange(energy, 0, 1, 0, 100);
  console.log(energy)

  // Map danceability to brightness (0–100%) -> Danceable songs are brighter
  const brightness = mapRange(danceability, 0, 1, 0, 100);

  return `hsl(${hue}, ${saturation}%, ${brightness}%)`;
};


interface ColorDisplayProps {
    playlistId: string;
    onBack: () => void;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ( { playlistId, onBack }) => {

    const handleBackClick = () => {
        onBack();
    }
    const [colors, setColors] = useState<string[]>([]);
    const processAudioFeatures = (features: AudioFeatures[]) => {
        const maxIterations = 10;
        const clusters = kMeansClustering(features, 9, maxIterations)

        // Map each cluster to a color
        const generatedColors = clusters.map((cluster) => {
            const avgFeatures = averageAudioFeatures(cluster);
            return generateColor(avgFeatures);
        });
        return generatedColors;
}
  useEffect(() => {
    const fetchPlaylistTracks = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;

        try {
            const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const playlistData = await playlistResponse.json();
            const trackIds = playlistData.items.map((item: any) => item.track.id).join(',');

            const audioFeaturesResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const audioFeaturesData = await audioFeaturesResponse.json();

            const generatedColors = processAudioFeatures(audioFeaturesData.audio_features);
            setColors(generatedColors);
        } catch (err) {
            console.error('Error fetching playlist data:', err)
        }
    };

    fetchPlaylistTracks();
  }, [playlistId]);

    return (
        <div className="color-display">
            <button className="back-button" onClick={handleBackClick}>← Back to Playlists</button>
            <div className="color-container">
                <div className="color-grid">
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            className="color-box"
                            style={{ backgroundColor: color}}
                        ></div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default ColorDisplay;