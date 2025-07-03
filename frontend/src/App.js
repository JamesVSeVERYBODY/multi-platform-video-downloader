// App.js (setup router)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './Landing';
import XDownload from './pages/XDownload';
import YouTubeDownload from './pages/YouTubeDownload';
import TikTokDownload from './pages/TikTokDownload';
import InstagramDownload from './pages/InstagramDownload';
import FacebookDownload from './pages/FacebookDownload';
import TwitchDownload from './pages/TwitchDownload';

import DownloadHistory from './components/DownloadHistory';
import SmartDownloader from './components/SmartDownloader';
import BookmarkVideos from './components/BookmarkVideos';
import ConvertToMP3 from './components/ConvertToMP3';
import BulkLinkSubmitter from './components/BulkLinkSubmitter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/x" element={<XDownload />} />
        <Route path="/youtube" element={<YouTubeDownload />} />
        <Route path="/tiktok" element={<TikTokDownload />} />
        <Route path="/instagram" element={<InstagramDownload />} />
        <Route path="/facebook" element={<FacebookDownload />} />
        <Route path="/twitch" element={<TwitchDownload />} />

        <Route path="/download-history" element={<DownloadHistory />} />
        <Route path="/smart-downloader" element={<SmartDownloader />} />
        <Route path="/bookmark-videos" element={<BookmarkVideos />} />
        <Route path="/convert-mp3" element={<ConvertToMP3 />} />
        <Route path="/bulk-link" element={<BulkLinkSubmitter />} />
      </Routes>
    </Router>
  );
}

export default App;
