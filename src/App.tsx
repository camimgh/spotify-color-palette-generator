import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes,} from 'react-router-dom';
import ColorDisplay from "./ColorDisplay";
import Login from "./Login";
import Callback from "./Callback";
import "./App.css";
import PrivateRoute from "./PrivateRoute";
import PlaylistSelector from "./PlaylistSelector";


const App: React.FC = () => {
  const [selectedPlaylistId, setSelectedPlaylist] = useState<string | null>(null);
  const handleBack = () => {
    setSelectedPlaylist(null);
  }
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />}/>
        <Route path="/" element={
          <PrivateRoute>
            {selectedPlaylistId ? (
              <ColorDisplay playlistId={selectedPlaylistId} onBack={handleBack}/> ) : 
              (
                <PlaylistSelector onSelectPlaylist={setSelectedPlaylist} />
              ) }
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
