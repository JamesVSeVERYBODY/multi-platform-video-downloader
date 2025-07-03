import React, { useEffect, useState } from 'react';
import { 
  FaYoutube, FaTwitter, FaInstagram, FaTiktok, FaFacebook, FaTwitch,
  FaHistory, FaSearch, FaFilter, FaUndo, FaTrash, FaBookmark, FaExternalLinkAlt,
  FaCopy, FaTimes, FaEye
} from 'react-icons/fa';
import './TabStyle.css';

const platformIcons = {
  youtube: <FaYoutube color="#FF0000" />,
  x: <FaTwitter color="#1DA1F2" />,
  instagram: <FaInstagram color="#C13584" />,
  tiktok: <FaTiktok color="#000" />,
  facebook: <FaFacebook color="#1877F2" />,
  twitch: <FaTwitch color="#9146FF" />,
};

const DownloadHistory = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [lastDeleted, setLastDeleted] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('downloadHistory')) || [];
    const savedBookmarks = JSON.parse(localStorage.getItem('videoBookmarks')) || [];
    setHistory(Array.isArray(stored) ? stored : []);
    setBookmarks(savedBookmarks);
  }, []);

  const isBookmarked = (item) => {
    return bookmarks.some(b => b.url === item.url && b.timestamp === item.timestamp);
  };

  const handleBookmarkToggle = (item) => {
    let updated;
    if (isBookmarked(item)) {
      updated = bookmarks.filter(b => !(b.url === item.url && b.timestamp === item.timestamp));
    } else {
      updated = [item, ...bookmarks];
    }
    setBookmarks(updated);
    localStorage.setItem('videoBookmarks', JSON.stringify(updated));
  };

  const handleDelete = (timestamp) => {
    const current = Array.isArray(history) ? history : [];
    const toDelete = current.find(h => h.timestamp === timestamp);
    if (toDelete) {
      setLastDeleted(toDelete);
      const updated = current.filter(item => item.timestamp !== timestamp);
      setHistory(updated);
      localStorage.setItem('downloadHistory', JSON.stringify(updated));
    }
  };

  const handleUndo = () => {
    if (lastDeleted) {
      const updated = [lastDeleted, ...history];
      setHistory(updated);
      localStorage.setItem('downloadHistory', JSON.stringify(updated));
      setLastDeleted(null);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleClear = () => {
    setSearch('');
    setFilter('all');
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) || item.url.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.platform === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-wrapper">
      <div className="page-center">
        <div className="card fade-in">
          <div className="card-accent" style={{ borderColor: '#6366f1' }}>
            <FaHistory style={{ color: '#6366f1' }} />
          </div>
          <h2>Download History</h2>
          <div className="subtitle">Track and manage all your downloaded videos. Search, filter, and organize with ease!</div>
          
          <div className="input-row">
            <input
              type="text"
              placeholder="Search downloads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button className="copy-btn" onClick={() => handleCopy(search)} title="Copy search" type="button">
              <FaCopy />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="clear-btn" onClick={handleClear} title="Clear" type="button">
              <FaTimes />
            </button>
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
            {lastDeleted && (
              <button className="undo-button" onClick={handleUndo}>
                <FaUndo style={{ marginRight: '8px' }} />
                Undo Delete
              </button>
            )}
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number">{filteredHistory.length}</span>
              <span className="stat-label">Downloads</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{history.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{bookmarks.length}</span>
              <span className="stat-label">Bookmarked</span>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No downloads found</h3>
              <p>Try adjusting your search or filter to see more results.</p>
            </div>
          ) : (
            <div className="history-grid">
              {filteredHistory.map((item, i) => (
                <div key={i} className="history-card slide-up">
                  <div className="history-header">
                    <div className="platform-badge">
                      {platformIcons[item.platform] || '📹'}
                    </div>
                    <div className="history-actions">
                      <button 
                        className="action-btn bookmark-btn"
                        onClick={() => handleBookmarkToggle(item)}
                        title={isBookmarked(item) ? 'Remove bookmark' : 'Add bookmark'}
                      >
                        <FaBookmark style={{ color: isBookmarked(item) ? '#f59e0b' : '#9ca3af' }} />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(item.timestamp)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  {item.thumbnail && (
                    <div className="history-thumbnail">
                      <img
                        src={item.thumbnail}
                        alt="preview"
                        className="history-thumbnail-img"
                      />
                    </div>
                  )}
                  
                  <div className="history-content">
                    <h4 className="history-title">
                      {item.title || 'Untitled Video'}
                    </h4>
                    <div className="history-meta">
                      <span className="history-date">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <span className="history-time">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="history-url">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="history-link"
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
};

export default DownloadHistory;
