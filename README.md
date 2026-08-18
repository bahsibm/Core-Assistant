# ☁️✨ Core Assistant

A multi-purpose Chromium browser extension. It brings 10 essential features together to manage tabs, focus, and read comfortably on the web.

## 🚀 Features

| Feature | Description |
|---|---|
| 🗂️ Smart Tab Grouping | Automatically groups tabs from the same site or topic (by site / by topic / by selection). |
| 💾 Session Manager | Save tabs into workspaces like "Work / Entertainment / Research" and restore them with one click. |
| 🛡️ Ad Blocker | Built-in Manifest V3 AdBlock logic to hide pop-ups and ads across all sites. |
| 🌙 Dark Theme | Turns any website into a comfortable dark mode instantly. |
| 📖 Reading Mode | Removes clutter, sidebars, and ads to make articles readable (Light, Sepia, Dark themes). |
| ⏳ Focus Shield | Work Mode blocks social media and news sites for a set duration. |
| 🖱️ Mouse Gestures | Right-click and drag: ← back, → forward, ↑ scroll up, ↓ close tab. |
| ✨ Quick Summary | Right-click any text or page to get an instant AI-like summary (uses TextRank). |
| 😴 Sleeping Tabs | Freezes idle tabs to free up memory and save battery. |
| 🧹 One-Click Cleanup | Clears cookies, cache, and browsing history from the last hour or day instantly. |

## 📦 Installation

1. Go to `chrome://extensions/`
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked** and select the `.output/chrome-mv3` folder.

## 🛠️ Tech Stack
- [WXT](https://wxt.dev/) (Vite + Vue/React ready, currently vanilla TS)
- Manifest V3
- @mozilla/readability (For Reading Mode)

## 📄 License
MIT License.
