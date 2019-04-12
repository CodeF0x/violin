# 🎼 Violin

![screenshot](docs/images/screenshot.png)

Violin is a minimalistic and fast music player for Linux, macOS, and Windows.

If you just want to open a folder with your music and start listening instead of importing your songs to Spotify, downloading a huge app that's just overkill for your needs, or your songs are not on streaming platforms, Violin is for you. If that's not the case, you probably won't like Violin.

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

[Get it here.](https://github.com/CodeF0x/violin/releases)

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
   - `npm run create-installer-linux` (this creates a .deb package. For other distros, use the created .app file you created in above's step 3)
   - `npm run create-installer-windows` (this creates a standalone-app what is the intendend behaviour)
