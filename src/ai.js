/**
 * Module to generate Arabic poems using Cloudflare Workers AI.
 */

const axios = require('axios');
require('dotenv').config();

const ACCOUNT_ID = '98d2eaaf2003c3db0302e7b49a862fe8';
const MODEL = '@cf/meta/llama-3.1-8b-instruct';
const API_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}`;

const femaleNames = ['Layla', 'Amira', 'Fatima', 'Noor', 'Aisha', 'Sara', 'Yasmin', 'Rania'];

/**
 * Generates a short romantic Arabic poem for a random female name.
 * @returns {string} The generated poem.
 */
async function generatePoem() {
  const name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
  const prompt = `Generate a short romantic poem for ${name} about love and poetry. Keep it under 100 characters.`;

  try {
    const response = await axios.post(API_URL, {
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      return response.data.result.response.trim();
    } else {
      throw new Error('AI API failed');
    }
  } catch (error) {
    throw new Error(`Poem generation failed: ${error.message}`);
  }
}

module.exports = { generatePoem };
