# 🎵 Omed Player

Omed Player is a premium, high-performance web-based audio and video player designed for the modern user. Built with a focus on aesthetics, speed, and cloud-native features, Omed provides a seamless experience across music, podcasts, and video.

![Omed Player Architecture](https://img.shields.io/badge/Architecture-Cloud--Native-blue?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-orange?style=flat-square)

## ✨ Key Features

- **☁️ Cloud Sync**: Effortless synchronization of your playlists and settings with **Google Drive**.
- **🎙️ Podcast Explorer**: Native XML-based RSS parser (no external limits!) with smart AI-powered summaries.
- **🕒 Listening History**: Detailed logging of your activities with instant replay capabilities.
- **🎨 Dynamic Themes**: Choose from 7 premium themes (Omed Default, Ocean, Cyberpunk, Midnight, Peach, Forest, Sunset).
- **📱 Responsive Design**: Fully optimized for Desktop and Mobile with a dedicated navigation drawer.
- **⚡ Performance**: Built with Vite and Zustand for ultra-fast state management and loading.

## 🚀 Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: TailwindCSS 4
- **State Management**: Zustand (with Persistence)
- **Audio Engine**: Howler.js
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API integrations**: Google Drive (Storage), iTunes (Podcasts), Gemini (AI Summaries)

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- A Google Cloud Project (for Drive Sync)
- A Gemini API Key (optional, for AI features)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rudolf-Staline/Aurora-Player.git
   cd aurora_player
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run in development mode**:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/core`: Core audio engine logic.
- `src/store`: Zustand state management (Auth, Player, Playlists, etc.).
- `src/features`: Modular feature implementation (Music, Podcast, Drive, Video).
- `src/components`: Shared UI components (Sidebar, BottomPlayer, Layout).
- `src/utils`: Utility functions (RSS Parsing, Syncing, File Scanning).

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Created by [Rudolf-Staline](https://github.com/Rudolf-Staline)*
