// src/utils/api.js

const axios = require('axios');

async function saveTokens(token) {
  await window.api.saveToken(token);
}

async function loadTokens() {
  return await window.api.getValidToken();
}

// Function to make authenticated API request
async function makeApiRequest(token) {
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
  }
}

module.exports = { saveTokens, loadTokens, makeApiRequest };
