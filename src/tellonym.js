/**
 * Module to automate Tellonym posting using Playwright.
 */

const { chromium } = require('playwright');
const { logAction } = require('./utils');
require('dotenv').config();

/**
 * Posts a poem to a Tellonym profile.
 * @param {string} poem - The poem to post.
 */
async function postToTellonym(poem) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to Tellonym login
    await page.goto('https://tellonym.me/login');

    // Log in
    await page.fill('input[name="email"]', process.env.TELLYNOM_EMAIL);
    await page.fill('input[name="password"]', process.env.TELLYNOM_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Simulate searching for a random profile (since actual search might vary)
    // For simplicity, assume we navigate to a known profile or use a placeholder
    // In real scenario, implement search logic
    const randomName = 'waelalza'; // Fixed profile for testing
    await page.goto(`https://tellonym.me/${randomName}`);

    // Post the poem in the ask question field
    await page.fill('textarea[name="question"]', poem);
    await page.click('button[type="submit"]'); // Assuming the post button

    // Log the action
    logAction(`Posted "${poem}" to ${randomName}`, new Date().toISOString());

  } catch (error) {
    throw new Error(`Tellonym posting failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

module.exports = { postToTellonym };
