# Tellonym AI Automation

AI-powered Tellonym automation for posting romantic Arabic poems to grow audience ethically.

## Description

This project uses Cloudflare Workers AI to generate short romantic Arabic poems and automates posting them on Tellonym profiles targeting Arabic female names. It posts 3 times per hour with randomized delays to avoid bans.

## Features

- AI-generated Arabic poems
- Web automation with Playwright
- Secure credential management
- Logging of actions
- Scheduled posting

## Ethics

- Posts are limited to 3 per hour.
- Content is varied and romantic.
- Use responsibly to avoid platform bans.

## Setup

1. Install Node.js 18+.
2. Clone the repo: `git clone https://github.com/waelvx/tellonym-ai-automation.git`
3. Install dependencies: `npm install`
4. Create `.env` file based on `.env.example` and fill in your credentials.

## Usage

Run locally: `npm start` or `node index.js`

## Deployment

Deploy to Vercel or another serverless platform. GitHub Actions will handle CI/CD on pushes.

## Contributing

Feel free to contribute via PRs.
