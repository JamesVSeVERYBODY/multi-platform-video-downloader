// Landing.js (enhanced with better content and features)

import React, { useState } from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';
import {
  FaYoutube,
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaTwitch,
  FaDownload,
  FaSearch,
  FaBolt,
  FaBookmark,
  FaHeadphones,
  FaListUl,
  FaBars,
  FaRocket,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaMoon,
  FaSun
} from 'react-icons/fa';

const platforms = [
  { name: 'YouTube', key: 'youtube', icon: <FaYoutube />, color: '#FF0000' },
  { name: 'X (Twitter)', key: 'x', icon: <FaTwitter />, color: '#1DA1F2' },
  { name: 'Instagram', key: 'instagram', icon: <FaInstagram />, color: '#C13584' },
  { name: 'TikTok', key: 'tiktok', icon: <FaTiktok />, color: '#000000' },
  { name: 'Facebook', key: 'facebook', icon: <FaFacebook />, color: '#1877F2' },
  { name: 'Twitch', key: 'twitch', icon: <FaTwitch />, color: '#9146FF' },
];

const tabs = [
  { 
    name: 'Download History', 
    to: '/download-history', 
    icon: <FaDownload />,
    description: 'View and manage your download history'
  },
  { 
    name: 'Smart Downloader', 
    to: '/smart-downloader', 
    icon: <FaBolt />,
    description: 'AI-powered smart video detection and download'
  },
  { 
    name: 'Bookmark Videos', 
    to: '/bookmark-videos', 
    icon: <FaBookmark />,
    description: 'Save and organize your favorite videos'
  },
  { 
    name: 'Convert to MP3', 
    to: '/convert-mp3', 
    icon: <FaHeadphones />,
    description: 'Extract audio from videos in high quality'
  },
  { 
    name: 'Bulk Link Submitter', 
    to: '/bulk-link', 
    icon: <FaListUl />,
    description: 'Download multiple videos at once'
  },
];

const features = [
  {
    icon: <FaRocket />,
    title: 'Lightning Fast',
    description: 'Download videos in seconds with our optimized engine'
  },
  {
    icon: <FaShieldAlt />,
    title: 'Safe & Secure',
    description: 'Your data is protected with end-to-end encryption'
  },
  {
    icon: <FaClock />,
    title: 'Always Available',
    description: '24/7 service with no downtime or restrictions'
  },
  {
    icon: <FaStar />,
    title: 'High Quality',
    description: 'Download videos in the highest available quality'
  }
];

function Landing() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  React.useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className="landing-container">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 2000,
          background: 'var(--bg-primary)',
          color: 'var(--primary-color)',
          border: '2px solid var(--border-color)',
          borderRadius: '50%',
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        aria-label="Toggle dark/light theme"
        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <h2 onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer' }}>
          <FaBars /> {sidebarOpen && 'MediaSaver'}
        </h2>
        <ul>
          {platforms.map((p) => (
            <li key={p.key}>
              <Link to={`/${p.key}`} className="tab-link">
                <span className="icon" style={{ color: p.color }}>{p.icon}</span>
                {sidebarOpen && <span>{p.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content scrollable">
        <div className="welcome-text">
          <h1>Welcome to <span>MEDIASAVER</span></h1>
          <p>Your ultimate media download companion. Download videos from all major platforms with lightning speed and crystal clear quality. 🚀</p>

          {/* Features Section */}
          <div className="features-section">
            <h3>Why Choose MediaSaver?</h3>
            <div className="features-grid">
              {features.map((feature, idx) => (
                <div key={idx} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tab-preview">
            <h3>Powerful Tools</h3>
            <div className="tab-grid">
              {tabs.map((tab, idx) => (
                <Link to={tab.to} key={idx} className="tab-card">
                  <span className="tab-icon">{tab.icon}</span>
                  <div className="tab-content">
                    <span className="tab-title">{tab.name}</span>
                    <span className="tab-description">{tab.description}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Start Section */}
          <div className="quick-start">
            <h3>🚀 Quick Start</h3>
            <div className="quick-start-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Choose Platform</h4>
                  <p>Select your preferred platform from the sidebar</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Paste URL</h4>
                  <p>Copy and paste the video URL you want to download</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Download</h4>
                  <p>Choose quality and download your video instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;