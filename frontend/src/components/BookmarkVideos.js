import React, { useState, useEffect } from 'react';
import './bookmarks.css';
import {
  FaYoutube, FaTwitter, FaInstagram,
  FaTiktok, FaFacebook, FaTwitch, FaTrash, FaDownload,
  FaBookmark, FaExternalLinkAlt, FaHeart, FaShare
} from 'react-icons/fa';

const platformIcons = {
  youtube: <FaYoutube color="#FF0000" />,
  x: <FaTwitter color="#1DA1F2" />,
  instagram: <FaInstagram color="#C13584" />,
  tiktok: <FaTiktok color="#000" />,
  facebook: <FaFacebook color="#1877F2" />,
  twitch: <FaTwitch color="#9146FF" />
};

function Bookmarks({ onImport }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('videoBookmarks')) || [];
    setBookmarks(stored);
  }, []);

  const handleDelete = (timestamp) => {
    const updated = bookmarks.filter(b => b.timestamp !== timestamp);
    setBookmarks(updated);
    localStorage.setItem('videoBookmarks', JSON.stringify(updated));
  };

  const handleImport = (item) => {
    if (onImport) onImport(item); // Trigger to SmartDownloader
  };

  const handleShare = (item) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        url: item.url
      });
    } else {
      navigator.clipboard.writeText(item.url);
    }
  };

  const filteredBookmarks = bookmarks.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) || item.url.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.platform === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-wrapper">
      <div className="page-center">
        <div className="card fade-in">
          <div className="card-accent" style={{ borderColor: '#f59e0b' }}>
            <FaBookmark style={{ color: '#f59e0b' }} />
          </div>
          <h2>Bookmarked Videos</h2>
          <div className="subtitle">Your favorite videos saved for quick access. Import them anytime!</div>
          
          <div className="input-row">
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-row">
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">🌐 All Platforms</option>
              <option value="youtube">📺 YouTube</option>
              <option value="x">🐦 X (Twitter)</option>
              <option value="instagram">📷 Instagram</option>
              <option value="tiktok">🎵 TikTok</option>
              <option value="facebook">📘 Facebook</option>
              <option value="twitch">🎮 Twitch</option>
            </select>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number">{filteredBookmarks.length}</span>
              <span className="stat-label">Bookmarks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{bookmarks.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{new Set(bookmarks.map(b => b.platform)).size}</span>
              <span className="stat-label">Platforms</span>
            </div>
          </div>

          {filteredBookmarks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔖</div>
              <h3>No bookmarks found</h3>
              <p>Start bookmarking videos from your download history to see them here.</p>
            </div>
          ) : (
            <div className="bookmark-grid">
              {filteredBookmarks.map((item, idx) => (
                <div key={idx} className="bookmark-card slide-up">
                  <div className="bookmark-header">
                    <div className="platform-badge">
                      {platformIcons[item.platform] || '📹'}
                    </div>
                    <div className="bookmark-actions">
                      <button 
                        className="action-btn share-btn"
                        onClick={() => handleShare(item)}
                        title="Share"
                      >
                        <FaShare />
                      </button>
                      <button 
                        className="action-btn import-btn"
                        onClick={() => handleImport(item)}
                        title="Import to downloader"
                      >
                        <FaDownload />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(item.timestamp)}
                        title="Remove bookmark"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  {item.thumbnail && (
                    <div className="bookmark-thumbnail">
                      <img
                        src={item.thumbnail}
                        alt="preview"
                        className="bookmark-thumbnail-img"
                      />
                    </div>
                  )}
                  
                  <div className="bookmark-content">
                    <h4 className="bookmark-title">
                      {item.title || 'Untitled Video'}
                    </h4>
                    <div className="bookmark-meta">
                      <span className="bookmark-date">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <span className="bookmark-time">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bookmark-url">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bookmark-link"
                      >
                        <FaExternalLinkAlt style={{ marginRight: '4px' }} />
                        View Original
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bookmarks;
