/**
 * Module to automate Tellonym posting using Playwright.
 */

const { chromium } = require('playwright');
const { logAction } = require('./utils');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const TARGET_NAMES = [
    "layla.belle", "Layla.06", "falayla", "onlyleila", "noor.hany.4341536",
    "noor.8535242", "sara.___s", "sara.nappi"
];

// Scraper function to find active users
async function scrapeActiveUsers(page, maxUsers = 10) {
    const activeUsers = [];
    const searchTerms = TARGET_NAMES.map(name => `${name} girl`).slice(0, 5);

    for (const term of searchTerms) {
        try {
            console.log(`Scraping for: ${term}`);
            await page.goto(`https://tellonym.me/search?q=${encodeURIComponent(term)}`, { timeout: 30000 });
            await page.waitForSelector('.search-result-item, .user-card, [data-user]', { timeout: 10000 });

            const users = await page.evaluate(() => {
                const results = Array.from(document.querySelectorAll('.user-link, .profile-username, [href*="/"]'));
                return results
                    .map(el => {
                        const href = el.getAttribute('href') || el.textContent.trim();
                        const username = href.replace('/@', '').replace('https://tellonym.me/', '');
                        return username;
                    })
                    .filter(username => username && username.includes('.') && !username.includes('tellonym'))
                    .slice(0, 3);
            });

            for (const username of users) {
                if (activeUsers.length >= maxUsers) break;
                if (await isValidProfile(page, username, true)) {
                    activeUsers.push(username);
                    logAction(`Scraped active user: ${username}`, new Date().toISOString());
                }
            }

            await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 3000));
        } catch (error) {
            console.error(`Scrape error for ${term}: ${error.message}`);
            logAction(`Scrape error: ${term} - ${error.message}`, new Date().toISOString());
        }
    }

    const usersFile = path.join(__dirname, '..', 'active_users.json');
    await fs.writeFile(usersFile, JSON.stringify(activeUsers, null, 2));
    console.log(`Scraped ${activeUsers.length} active users`);
    return activeUsers;
}

// Validation
async function isValidProfile(page, username, quick = false) {
    try {
        await page.goto(`https://tellonym.me/${username}`, { timeout: 30000 });
        if (quick) return true;
        await page.waitForSelector('textarea', { timeout: 5000 });
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Posts a poem to a Tellonym profile.
 * @param {string} poem - The poem to post.
 */
async function postToTellonym(poem) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Load or scrape users
        let targetUsers = [];
        const usersFile = path.join(__dirname, '..', 'active_users.json');
        try {
            const fileContent = await fs.readFile(usersFile, 'utf8');
            targetUsers = JSON.parse(fileContent);
        } catch (error) {
            targetUsers = await scrapeActiveUsers(page, 15);
        }

        if (targetUsers.length === 0) {
            targetUsers = TARGET_NAMES;
        }

        // Select random user
        const randomName = targetUsers[Math.floor(Math.random() * targetUsers.length)];

        // Navigate to login
        await page.goto('https://tellonym.me/login');
        await page.fill('input[name="email"]', process.env.TELLYNOM_EMAIL);
        await page.fill('input[name="password"]', process.env.TELLYNOM_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForNavigation();

        // Go to profile
        await page.goto(`https://tellonym.me/${randomName}`);

        // Post
        await page.fill('textarea', poem);
        await page.click('button[type="submit"]');

        // Log
        logAction(`Posted "${poem}" to ${randomName}`, new Date().toISOString());

    } catch (error) {
        throw new Error(`Tellonym posting failed: ${error.message}`);
    } finally {
        await browser.close();
    }
}

module.exports = { postToTellonym };
