# 🎬 Multi-Platform Video Downloader

A modern, feature-rich video downloader that supports multiple platforms including YouTube, Instagram, TikTok, X (Twitter), Facebook, and Twitch. Built with React frontend and Flask backend.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Flask](https://img.shields.io/badge/Flask-2.0+-000000)
![Python](https://img.shields.io/badge/Python-3.8+-3776ab)

## ✨ Features

### 🎯 **Multi-Platform Support**
- **YouTube** - Download videos in any quality
- **Instagram** - Download Reels, Stories, and Posts
- **TikTok** - Download TikTok videos without watermark
- **X (Twitter)** - Download tweets with videos
- **Facebook** - Download Facebook videos
- **Twitch** - Download Twitch clips and streams

### 🚀 **Smart Features**
- **Smart Downloader** - Auto-detects platform and optimizes download
- **Bulk Download** - Download multiple videos at once
- **MP3 Conversion** - Extract audio from any video
- **Download History** - Track all your downloads
- **Bookmarks** - Save favorite videos for later
- **Dark/Light Theme** - Beautiful UI with theme switching

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works on desktop and mobile
- **Animated Components** - Smooth animations and transitions
- **Centered Layout** - Clean, modern card-based design
- **Real-time Feedback** - Loading states and progress indicators
- **Error Handling** - User-friendly error messages

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **React Icons** - Beautiful icon library
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with animations

### Backend
- **Flask** - Lightweight Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **yt-dlp** - Powerful video downloader
- **FFmpeg** - Audio/video processing

## 📦 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **FFmpeg** (for MP3 conversion)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/multi-platform-video-downloader.git
cd multi-platform-video-downloader
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

### 4. Install FFmpeg
#### Windows
```bash
# Using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

#### macOS
```bash
# Using Homebrew
brew install ffmpeg
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

## 🚀 Running the Application

### 1. Start Backend Server
```bash
cd backend
python app.py
```
Backend will run on `http://localhost:5000`

### 2. Start Frontend Development Server
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

### 3. Open Browser
Navigate to `http://localhost:3000` to use the application

## 📁 Project Structure

```
project/
├── backend/
│   ├── app.py              # Flask server
│   ├── requirements.txt    # Python dependencies
│   └── cookies.txt         # Cookies for authentication (not in repo)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json       # Node.js dependencies
│   └── README.md
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔧 Configuration

### Backend Configuration
The backend uses `yt-dlp` with cookies for better download success rates. Create a `cookies.txt` file in the backend directory:

```bash
# Download cookies from your browser
# Chrome: EditThisCookie extension
# Firefox: Cookie Quick Manager
# Save as cookies.txt in backend/ directory
```

### Frontend Configuration
The frontend connects to the backend API. Update the API URL in components if needed:

```javascript
// Default: http://localhost:5000
const API_BASE_URL = 'http://localhost:5000';
```

## 🎯 Usage Guide

### Basic Download
1. Navigate to any platform page (YouTube, Instagram, etc.)
2. Paste the video URL
3. Click "Preview" to fetch video information
4. Select quality and click "Download"

### Smart Downloader
1. Go to Smart Downloader page
2. Paste any video URL (auto-detects platform)
3. Use bulk upload for multiple videos
4. Download all at once

### MP3 Conversion
1. Go to Convert to MP3 page
2. Paste video URL
3. Select audio quality (128/192/320 kbps)
4. Click "Convert to MP3"

### Bulk Download
1. Go to Bulk Link Submitter
2. Paste multiple URLs (one per line)
3. Or upload a .txt file with URLs
4. Click "Add Links" then "Download All"

## 🔒 Security & Privacy

### What's Protected
- ✅ **Cookies file** - Excluded from repository
- ✅ **API keys** - No sensitive keys in code
- ✅ **User data** - Stored locally in browser
- ✅ **Downloaded files** - Automatically deleted

### Data Storage
- **Download History** - Stored in browser localStorage
- **Bookmarks** - Stored in browser localStorage
- **Theme Preference** - Stored in browser localStorage
- **No server-side storage** - All data stays on user's device

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Upload build/ folder to hosting service
```

### Backend Deployment (Heroku/Railway)
```bash
cd backend
# Add Procfile for Heroku
echo "web: python app.py" > Procfile
# Deploy to your preferred platform
```

### Environment Variables
Set these in your deployment platform:
```bash
FLASK_ENV=production
FLASK_DEBUG=False
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational purposes only. Please respect copyright laws and terms of service of the platforms you download from. Users are responsible for ensuring they have the right to download content.

## 🐛 Troubleshooting

### Common Issues

**Download fails:**
- Check if the URL is valid
- Ensure FFmpeg is installed
- Try different video quality

**Backend won't start:**
- Check if port 5000 is available
- Ensure all dependencies are installed
- Activate virtual environment

**Frontend won't start:**
- Check if port 3000 is available
- Run `npm install` to install dependencies
- Clear npm cache: `npm cache clean --force`

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

**Made with ❤️ by [Your Name]** 