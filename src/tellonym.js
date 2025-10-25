/**
 * Module to automate Tellonym posting using Playwright.
 */

const { chromium } = require('playwright');
const { logAction } = require('./utils');
require('dotenv').config();

const TARGET_NAMES = [
    "layla.belle", "Layla.06", "falayla", "onlyleila", "noor.hany.4341536",
    "noor.8535242", "sara.___s", "sara.nappi"
];

/**
 * Posts a poem to a Tellonym profile.
 * @param {string} poem - The poem to post.
 */
async function postToTellonym(poem) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Select random user
    const randomName = TARGET_NAMES[Math.floor(Math.random() * TARGET_NAMES.length)];
    console.log(`Posting to: ${randomName}`);

    // Navigate to login
    await page.goto('https://tellonym.me/login');
    await page.fill('input[name="email"]', process.env.TELLYNOM_EMAIL);
    await page.fill('input[name="password"]', process.env.TELLYNOM_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Go to profile
    await page.goto(`https://tellonym.me/${randomName}`);
    await page.waitForTimeout(2000); // Wait for page to load
    console.log('Navigated to profile');

    // Take screenshot for debugging
    await page.screenshot({ path: 'debug_profile.png' });

    // Try to fill
    try {
      await page.fill('textarea', poem);
      console.log('Filled textarea');
      await page.click('button[type="submit"]');
      console.log('Clicked submit');
      // Log the action
      logAction(`Posted "${poem}" to ${randomName}`, new Date().toISOString());
      console.log('Post successful');
    } catch (error) {
      console.log('Fill failed, taking screenshot');
      await page.screenshot({ path: 'debug_fill.png' });
      throw new Error(`Fill failed: ${error.message}`);
    }

  } catch (error) {
    throw new Error(`Tellonym posting failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

module.exports = { postToTellonym };
