import React, { useState } from 'react';
import axios from 'axios';
import { FaTwitter, FaDownload, FaEye, FaExclamationTriangle, FaCheckCircle, FaCopy, FaTimes, FaLink, FaSearch, FaSlidersH } from 'react-icons/fa';
import './pages.css';

function XDownload() {
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  // Recent downloads for X
  const recentDownloads = (JSON.parse(localStorage.getItem('downloadHistory')) || []).filter(d => d.platform === 'x').slice(0, 3);

  const handlePreview = async () => {
    if (!url.trim()) {
      setError('Please enter a tweet URL');
      return;
    }
    setError('');
    setSuccess('');
    setPreviewLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/info', { url });
      setInfo(res.data);
      setSuccess('Video information loaded successfully!');
    } catch (err) {
      setError('Failed to fetch video info. Please check the URL and try again.');
      setInfo(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!info) {
      setError('Please preview the video first');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:5000/download', {
        url,
        format_id: info?.formats?.[0]?.format_id ?? 'best',
      }, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'video/mp4' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `x_${info?.title?.slice(0, 40).replace(/\s+/g, '_') || 'video'}.mp4`;
      link.click();
      // Save to download history
      const currentHistory = JSON.parse(localStorage.getItem('downloadHistory')) || [];
      currentHistory.unshift({
        title: info?.title || 'X Video',
        url,
        platform: 'x',
        thumbnail: info?.thumbnail,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('downloadHistory', JSON.stringify(currentHistory));
      setSuccess('Download completed successfully!');
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
    setInfo(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="page-wrapper">
      <div className="page-center">
        <div className="card fade-in">
          <div className="card-accent" style={{ borderColor: '#1DA1F2' }}>
            <FaTwitter style={{ color: '#1DA1F2' }} />
          </div>
          <h2>Download from X (Twitter)</h2>
          <div className="subtitle">Save X (Twitter) videos instantly. No login required. High quality!</div>
          <div className="input-row">
            <input type="text" placeholder="Paste tweet URL here..." value={url} onChange={(e) => setUrl(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handlePreview()} />
            <button className="copy-btn" onClick={handleCopy} title="Copy link" type="button">
              <FaCopy />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="clear-btn" onClick={handleClear} title="Clear" type="button">
              <FaTimes />
            </button>
          </div>
          <button onClick={handlePreview} disabled={previewLoading} className={previewLoading ? 'loading' : ''}>
            <FaEye style={{ marginRight: '8px' }} />
            {previewLoading ? 'Loading...' : 'Preview'}
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
            <div className="howto-step"><span className="howto-icon"><FaLink /></span> Paste the tweet link above.</div>
            <div className="howto-step"><span className="howto-icon"><FaSearch /></span> Click <b>Preview</b> to fetch video info.</div>
            <div className="howto-step"><span className="howto-icon"><FaSlidersH /></span> Select quality and click <b>Download</b>.</div>
          </div>
          {info && (
            <div className="slide-up">
              <img src={info.thumbnail} alt="preview" />
              <h3>{info.title}</h3>
            </div>
          )}
          {recentDownloads.length > 0 && (
            <div className="recent-downloads">
              <div className="recent-downloads-title">Recent X Downloads</div>
              <ul className="recent-download-list">
                {recentDownloads.map((item, idx) => (
                  <li className="recent-download-item" key={idx}>
                    <img className="recent-download-thumb" src={item.thumbnail} alt="thumb" />
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

export default XDownload;
