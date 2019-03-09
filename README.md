# ⚠️ Warning: Design is not final and will probably change

# 🎼 Violin

![screenshot](docs/images/screenshot.png)

Violin is a minimalistic and fast music player for Linux, macOS and Windows.

## 📓 Features

- It's dark themed
- It supports all most common audio file types:
  - mp3
  - wav
  - ogg
  - webm
  - flac
  - mp4
- Shows meta information like album cover, artist and song name if available
- Blazingly fast
- Simple and self-explanatory UI

## ⬇️ Download and install it

Work in progress

## 🔨 Pack it yourself & create a installer

#### Pack it yourself

1. Clone the repository `git clone https://github.com/CodeF0x/violin.git`
2. Install dependencies `npm install`
3. Pack it for your system:
   - `npm run package-mac`
   - `npm run package-linux`
   - `npm run package-windows`

#### Create a installer

(Steps 1 - 3 from above)

4. Create installer for your system (you must be on the system you want to create an installer for):
   - `npm run create-installer-mac`
   - `npm run create-installer-linux`
   - `npm run create-installer-windows`
