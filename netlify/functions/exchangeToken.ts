import fetch from 'node-fetch';

interface SpotifyTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  error?: string;
}

export const handler = async (event: any) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  console.log("SPOTIFY_CLIENT_ID:", clientId);
  console.log("SPOTIFY_CLIENT_SECRET:", clientSecret);
  console.log("SPOTIFY_REDIRECT_URI:", redirectUri);

  if (!clientId || !clientSecret || !redirectUri) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing Spotify credentials or redirect URI' }),
    };
  }

  const params = new URLSearchParams(event.body);
  const code = params.get('code');
  const redirect_uri = params.get('redirect_uri') || redirectUri;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization code is missing' }),
    };
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
      }),
    });

    const data = (await response.json()) as SpotifyTokenResponse;

    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      }),
    };
  } catch (error) {
    console.error('Error fetching access token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch access token' }),
    };
  }
};
