// get-access-token.ts
import axios from 'axios';

const getZoomToken = async (code : string) => {
  const clientId = "";
  const clientSecret = ""
  const redirectUri =  "http://localhost:3000/oauth/callback"

   const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await axios.post(
    'https://zoom.us/oauth/token',
    null,
    {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      },
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return res.data.access_token;
};
