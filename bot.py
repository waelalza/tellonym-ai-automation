#!/usr/bin/env python3
import os, time, re, random, subprocess
from ollama import Client as OllamaClient

PHONE  = os.getenv("PHONE_SERIAL", "192.168.1.123:5555")
OLLAMA = OllamaClient(host="http://127.0.0.1:11434")
MODEL  = "deepseek-coder:1.3b"

UI = {
    "reply_btn":  {"text": "Reply"},
    "input_field":{"res": "input_field"},
    "send_btn":   {"text": "Send"},
}

def adb(cmd, t=10): return subprocess.check_output(["adb"]+cmd.split(), text=True, timeout=t).strip()
def tap(x,y): adb(f"-s {PHONE} shell input tap {x} {y}")
def text_input(txt): adb(f'-s {PHONE} shell input text "{txt.replace('"',r'\"')}"')
def swipe(): adb(f"-s {PHONE} shell input swipe 500 1000 500 500 300")

def find_coord(k):
    dump=adb(f"-s {PHONE} shell uiautomator dump /sdcard/window.xml")
    dump=adb(f"-s {PHONE} shell cat /sdcard/window.xml")
    pat=re.compile(r'bounds="\[(.+?),(.+?)\]\[(.+?),(.+?)\]".*?'+(
                   f'text="{k["text"]}"' if "text" in k else f'resource-id="{k["res"]}"'))
    m=pat.search(dump)
    if not m: raise LookupError(k)
    g=m.groups(); x1,y1,x2,y2=map(int,g); return (x1+x2)//2,(y1+y2)//2

def post_comment(cmt):
    tap(*find_coord(UI["reply_btn"])); time.sleep(1.5)
    tap(*find_coord(UI["input_field"])); time.sleep(.5)
    text_input(cmt); time.sleep(.5)
    tap(*find_coord(UI["send_btn"]))
    print("✉️ posted:", cmt)

def generate_comment(text):
    return OLLAMA.chat(model=MODEL,messages=[{"role":"user","content":f"Short positive comment (≤12 words) for: {text}"}])["message"]["content"].strip()

def main():
    adb("start-server")
    try: adb(f"connect {PHONE}")
    except: pass
    if not any(PHONE in d and "device" in d for d in adb("devices").splitlines()[1:]):
        exit(f"❌ {PHONE} unreachable")
    print("🤖 loop start"); time.sleep(2)
    while True:
        try:
            dump=adb(f"-s {PHONE} shell uiautomator dump /sdcard/window.xml")
            texts=re.findall(r'text="([^"]*)"', adb(f"-s {PHONE} shell cat /sdcard/window.xml"))
            for t in texts:
                if "tell" in t.lower() and len(t)>10:
                    cmt=generate_comment(t)
                    print("💬", cmt)
                    post_comment(cmt)
                    time.sleep(random.randint(4,8))
                    break
            else: swipe()
            time.sleep(random.randint(30,90))
        except Exception as e: print("🔥",e); time.sleep(60)
if __name__=="__main__": main()
