import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ColorDisplay from "./ColorDisplay";
import Login from "./Login";
import Callback from "./Callback";
import "./App.css";

// Define the type for audio features
interface AudioFeatures {
  danceability: number;
  energy: number;
  valence: number;
}

// Use euclidean distance to calculate distance between 2 songs
const euclideanDistance = (a: AudioFeatures, b: AudioFeatures): number => {
  return Math.sqrt(
    (a.danceability - b.danceability) ** 2 +
    (a.energy - b.energy) ** 2 +
    (a.valence - b.valence) ** 2 
  );
}

// Function to calculate the average audio features for a group of songs
const averageAudioFeatures = (featuresArray: AudioFeatures[]): AudioFeatures => {
  const totalSongs = featuresArray.length;

  const summedFeatures = featuresArray.reduce(
    (acc, features) => {
      acc.danceability += features.danceability;
      acc.energy += features.energy;
      acc.valence += features.valence;
      return acc;
    },
    { danceability: 0, energy: 0, valence: 0}
  );

  return {
    danceability: summedFeatures.danceability / totalSongs,
    energy: summedFeatures.energy / totalSongs,
    valence: summedFeatures.valence / totalSongs,
  };
};

const kMeansClustering = (playlist: AudioFeatures[], k: number, maxIterations: number): AudioFeatures[][] => {
  // Randomly initialize entroids
  let centroids = playlist.slice(0, k);

  let clusters: AudioFeatures[][] = [];
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    clusters = Array.from({ length: k }, () => []);

    // Assign each song to the closest centroid
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
  const { danceability, energy, valence } = features;

  // Map valence to hue (0–360) -> Blue (sad) to Red (happy)
  const hue = mapRange(valence, 0, 1, 240, 60);

  // Map energy to saturation (0–100%) -> More energy, more saturation
  const saturation = mapRange(energy, 0, 1, 30, 100);

  // Map danceability to brightness (0–100%) -> Danceable songs are brighter
  const brightness = mapRange(danceability, 0, 1, 40, 90);

  return `hsl(${hue}, ${saturation}%, ${brightness}%)`;
};

const App: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem('access_token')
  // Simulated song's audio features
  const playlist: AudioFeatures[] = [
    { danceability: 0.698, energy: 0.581, valence: 0.865, },
    { danceability: 0.898, energy: 0.734, valence: 0.94,},
    { danceability: 0.516, energy: 0.322, valence: 0.261, },
    { danceability: 0.571, energy: 0.761, valence: 0.681,  },
    { danceability: 0.576, energy: 0.457, valence: 0.301,  },
    { danceability: 0.532, energy: 0.623, valence: 0.403,  },
    { danceability: 0.651, energy: 0.546, valence: 0.623,  },
    { danceability: 0.696, energy: 0.39, valence: 0.395,  },
    { danceability: 0.465, energy: 0.711, valence: 0.255,  },
  ]

  const [colors, setColors] = useState<string[]>([]);

  // Function to calculate 9 colors from the playlist
  const calculateColors = () => {
    const maxIterations = 10; // Fixed # of iterations
    const clusters = kMeansClustering(playlist, 9, maxIterations);

    const generatedColors = clusters.map((cluster) => {
      const avgFeatures = averageAudioFeatures(cluster);
      return generateColor(avgFeatures);
    });

    setColors(generatedColors)
  }

  useEffect(() => {
    calculateColors();
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          isLoggedIn ? <ColorDisplay colors={colors} /> : <Navigate to="/login" />
        }/>
        <Route path="/login" element={<Login />}/>
        <Route path="/callback" element={<Callback />} /> 
      </Routes>
    </Router>
  );
};

export default App;
