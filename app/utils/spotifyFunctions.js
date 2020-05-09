import SpotifyWebAPI from 'spotify-web-api-js';
import { getUserData, refreshTokens } from '../utils/authorization.js';

export const getValidSPObj = async () => {
    const tokenExpirationTime = await getUserData('expirationTime');
    if (new Date().getTime() > tokenExpirationTime) {
      // access token has expired, so we need to use the refresh token
      await refreshTokens();
    }
    const accessToken = await getUserData('accessToken');
    var sp = new SpotifyWebAPI();
    sp.setAccessToken(accessToken);
    return sp; 
}
