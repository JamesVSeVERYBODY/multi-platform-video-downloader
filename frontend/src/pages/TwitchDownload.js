import React, { useState } from 'react';
import axios from 'axios';
import { FaTwitch, FaDownload, FaExclamationTriangle, FaCheckCircle, FaCopy, FaTimes, FaLink, FaSearch, FaSlidersH } from 'react-icons/fa';
import './pages.css';

function TwitchDownload() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  // Recent downloads for Twitch
  const recentDownloads = (JSON.parse(localStorage.getItem('downloadHistory')) || []).filter(d => d.platform === 'twitch').slice(0, 3);

  const handleDownload = async () => {
    if (!url.trim()) {
      setError('Please enter a Twitch URL');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:5000/download', { url }, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'video/mp4' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `twitch_video.mp4`;
      link.click();
      setSuccess('Download completed successfully!');
      // Save to history
      const currentHistory = JSON.parse(localStorage.getItem('downloadHistory')) || [];
      currentHistory.unshift({
        title: 'Twitch Video',
        url,
        platform: 'twitch',
        thumbnail: '',
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('downloadHistory', JSON.stringify(currentHistory));
    } catch (err) {
      setError('Download failed! Please check the link or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleClear = () => {
    setUrl('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="page-wrapper">
      <div className="page-center">
        <div className="card fade-in">
          <div className="card-accent" style={{ borderColor: '#9146FF' }}>
            <FaTwitch style={{ color: '#9146FF' }} />
          </div>
          <h2>Download from Twitch</h2>
          <div className="subtitle">Download Twitch clips and videos in one click. Fast, easy, and free!</div>
          <div className="input-row">
            <input type="text" placeholder="Paste Twitch link here" value={url} onChange={(e) => setUrl(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleDownload()} />
            <button className="copy-btn" onClick={handleCopy} title="Copy link" type="button">
              <FaCopy />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="clear-btn" onClick={handleClear} title="Clear" type="button">
              <FaTimes />
            </button>
          </div>
          <button onClick={handleDownload} disabled={loading} className={loading ? 'loading' : ''}>
            <FaDownload style={{ marginRight: '8px' }} />
            {loading ? 'Downloading...' : 'Download'}
          </button>
          {error && (
            <div className="error">
              <FaExclamationTriangle />
              {error}
            </div>
          )}
          {success && (
            <div className="success">
              <FaCheckCircle />
              {success}
            </div>
          )}
          <div className="howto">
            <div className="howto-title">How to use:</div>
            <div className="howto-step"><span className="howto-icon"><FaLink /></span> Paste the Twitch video link above.</div>
            <div className="howto-step"><span className="howto-icon"><FaSearch /></span> Click <b>Preview</b> (or press Enter) to fetch video info.</div>
            <div className="howto-step"><span className="howto-icon"><FaSlidersH /></span> Click <b>Download</b> to save the video.</div>
          </div>
          {recentDownloads.length > 0 && (
            <div className="recent-downloads">
              <div className="recent-downloads-title">Recent Twitch Downloads</div>
              <ul className="recent-download-list">
                {recentDownloads.map((item, idx) => (
                  <li className="recent-download-item" key={idx}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{new Date(item.timestamp).toLocaleString()}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TwitchDownload;