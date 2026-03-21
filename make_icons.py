#!/usr/bin/env python3
# Run this on your PC to create proper icon files from your logo
# pip install Pillow first

from PIL import Image
import urllib.request, io

url = "https://i.imgur.com/9mjKZAj.jpeg"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
data = urllib.request.urlopen(req).read()
img = Image.open(io.BytesIO(data)).convert("RGBA")

for sz in [192, 512]:
    resized = img.resize((sz, sz), Image.LANCZOS)
    resized.save(f"icon-{sz}.png", "PNG")
    print(f"Saved icon-{sz}.png")

print("Done! Upload both PNG files to your repo.")
