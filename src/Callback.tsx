import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    if (code) {
      const fetchAccessToken = async () => {
        try {
            const response = await axios.post('/.netlify/functions/exchangeToken', new URLSearchParams({
                code: code,
                redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI || 'http://localhost:8888/callback',
            }));
            
            console.log("Response from exchangeToken function:", response.data)
          const data = response.data;
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          navigate('/')
        } catch (error) {
          console.error('Error fetching access token:', error);
        }
      };

      fetchAccessToken();
    }
  }, [location.search, navigate]);

  return <div>Processing...</div>;
};

export default Callback;
