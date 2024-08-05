const { BrowserWindow } = require('electron');
const axios = require('axios');
const querystring = require('querystring');

// Configuration
const CLIENT_ID = '450825445336-6qbk3s52h65msf9lcjjkvvbgm0udbl41.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

// Function to open an OAuth2 window
function openOAuth2Window() {
  return new Promise((resolve, reject) => {
    const authUrl = `${AUTHORIZATION_URL}?${querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
      access_type: 'offline', // Request refresh token
      prompt: 'consent', // Ask for user consent to ensure refresh token is provided
    })}`;

    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true, // Enable context isolation for security
      },
    });

    win.loadURL(authUrl);

    // Intercept redirect to the callback URL
    win.webContents.on('will-redirect', async (event, url) => {
      console.log(`Intercepting redirect to: ${url}`);
      
      if (url.startsWith(REDIRECT_URI)) {
        event.preventDefault(); // Prevent the navigation
        console.log("preventing refresh")
        try {
          const urlParams = new URL(url).searchParams;
          const authorizationCode = urlParams.get('code');

          if (authorizationCode) {
            // Exchange the authorization code for tokens
            const tokens = await exchangeAuthorizationCodeForTokens(authorizationCode);
            resolve(tokens);
          }
        } catch (error) {
          reject(error);
        } finally {
          win.close(); // Close the OAuth window
        }
      }
    });

    win.on('closed', () => {
      reject(new Error('OAuth2 window was closed by the user'));
    });
  });
}

// Function to exchange authorization code for tokens
async function exchangeAuthorizationCodeForTokens(code) {
  try {
    const response = await axios.post(
      TOKEN_URL,
      querystring.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error exchanging authorization code:', error);
    throw error;
  }
}

module.exports = { openOAuth2Window };
