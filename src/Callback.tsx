import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Callback: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const state = queryParams.get('state');

    if (code) {
      const fetchAccessToken = async () => {
        try {
          const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': 'http://localhost:3000/callback',
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${btoa('0f7a19684fdd4fc2940aa0d59c3c6013:1f86aa6be7064be7a8033a3b83b8e26e')}`,
            },
          });
          const data = response.data;
          localStorage.setItem('access_token', data.access_token);
          window.location.href = '/'; // Redirect to the home page or wherever you want
        } catch (error) {
          console.error('Error fetching access token:', error);
        }
      };

      fetchAccessToken();
    }
  }, [location.search]);

  return <div>Processing...</div>;
};

export default Callback;
