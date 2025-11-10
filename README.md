# Tellonym AI Automation

AI-powered Tellonym automation for Raspberry Pi 5 using ADB and local Ollama AI.

## Description

This project automates Tellonym interactions by controlling an Android phone via ADB. It uses a local Ollama AI model running on Raspberry Pi 5 to generate intelligent comments and automatically posts them to Tellonym tells.

## Features

- AI-generated comments using Ollama (deepseek-coder:1.3b)
- Direct Android phone control via ADB
- UI automation using uiautomator
- Self-hosted GitHub Actions runner support
- Automated posting every 30 minutes

## Requirements

- Raspberry Pi 5 (or similar Linux system)
- Android phone with wireless debugging enabled
- Ollama installed and running locally

## Setup

### 0. ONE-TIME Pi 5 PREP
```bash
sudo apt update && sudo apt install -y git curl unzip python3-venv android-tools-adb
mkdir -p ~/tellonym && cd ~/tellonym
python3 -m venv venv && source venv/bin/activate
pip install -U pip ollama
# optional newest adb
curl -Lo p.zip https://dl.google.com/android/repository/platform-tools-latest-linux-arm.zip
sudo unzip -q -o p.zip -d /opt && sudo ln -sf /opt/platform-tools/adb /usr/local/bin/adb
```

### 1. REPO LAYOUT (~/tellonym)
```
run.sh      → executable launcher
bot.py      → full AI reply + tap/send (no extra PyPI pkgs)
requirements.txt   (ollama only)
.github/workflows/tellonym-runner.yml   # optional cron
```

### 2. FILE CONTENTS

Clone this repo to ~/tellonym:
```bash
cd ~/tellonym
git clone https://github.com/waelalza/tellonym-ai-automation.git .
```

Make run.sh executable:
```bash
chmod +x run.sh
```

### 3. PHONE PAIR (once)

Enable wireless debugging on your Android phone, then pair:
```bash
# Get IP:pair-port + code from phone's wireless debugging settings
adb pair <ip>:<pair-port> <code>
adb connect <ip>:5555
```

### 4. RUN

```bash
~/tellonym/run.sh
```

Phone will open tell → tap Reply → type AI comment → send.  
Exit with Ctrl-C.

You can also specify a custom phone serial:
```bash
~/tellonym/run.sh 192.168.1.100:5555
```

### 5. PUSH & FORGET (Optional GitHub Actions)

Setup self-hosted runner:
1. Go to repo → Settings → Actions → Runners
2. Add self-hosted runner
3. Follow setup instructions on Pi
4. Run `./config.sh` with token
5. Install service: `./svc.sh install`

Bot now auto-runs every 30 minutes via GitHub Actions.

## Ethics

- Use responsibly to avoid platform bans
- Respect rate limits
- Content is AI-generated and positive

## Contributing

Feel free to contribute via PRs.
