#!/usr/bin/env bash
cd ~/tellonym
source venv/bin/activate
export PHONE_SERIAL="${1:-192.168.1.123:5555}"
exec python3 bot.py
