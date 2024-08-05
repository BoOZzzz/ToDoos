// src/utils/api.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(__dirname, 'tokens.json');

let tokenStore = {}; // In-memory token store for development

function storeTokens(tokens) {
  if (process.env.NODE_ENV === 'development') {
    tokenStore = tokens;
    console.log('Tokens stored in memory:', tokenStore);
  } else {
    // Save tokens to a file or secure storage in production
    const fs = require('fs');
    fs.writeFileSync(path.join(__dirname, 'utils/tokens.json'), JSON.stringify(tokens));
  }
}

function loadTokens() {
  if (process.env.NODE_ENV === 'development') {
    return tokenStore;
  } else {
    const fs = require('fs');
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'utils/tokens.json'), 'utf8'));
  }
}

// Function to make authenticated API request
async function makeApiRequest() {
  const tokens = loadTokens();

  if (!tokens) {
    throw new Error('No tokens found, please log in first');
  }

  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    //console.log('User info:', response.data);
  } catch (error) {
    console.error('API request failed:', error);
  }
}

module.exports = { storeTokens, loadTokens, makeApiRequest };
