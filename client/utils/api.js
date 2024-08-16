// src/utils/api.js

const axios = require('axios');

async function saveTokens(token) {
  await window.api.saveToken(token);
}

async function loadTokens() {
  return await window.api.getValidToken();
}

async function getUserInfoByEmail(email) {
  try {
    const response = await axios.get(`http://localhost:3000/users/email/${email}`);

    // Check if the response status is 204 No Content
    if (response.status === 204) {
      console.log('User not found, empty response returned');
      return null; // or return {} if you prefer an empty object
    }

    //console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.message);
    }
  }
}


// Function to make authenticated API request
async function makeApiRequest(token) {
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    //console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
  }
}

module.exports = { saveTokens, loadTokens, makeApiRequest, getUserInfoByEmail };
