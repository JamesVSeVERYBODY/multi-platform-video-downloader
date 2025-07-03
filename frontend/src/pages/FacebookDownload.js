import React, { useState } from 'react';
import axios from 'axios';
import { FaFacebook, FaDownload, FaEye, FaExclamationTriangle, FaCheckCircle, FaCopy, FaTimes, FaLink, FaSearch, FaSlidersH } from 'react-icons/fa';
import './pages.css';

function FacebookDownload() {
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState(null);
  const [format, setFormat] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  // Recent downloads for Facebook
  const recentDownloads = (JSON.parse(localStorage.getItem('downloadHistory')) || []).filter(d => d.platform === 'facebook').slice(0, 3);

  const handlePreview = async () => {
    if (!url.trim()) {
      setError('Please enter a Facebook URL');
      return;
    }
    setError('');
    setSuccess('');
    setPreviewLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/info', { url });
      setInfo(res.data);
      setFormat(res.data.formats?.[0]?.format_id || '');
      setSuccess('Video information loaded successfully!');
    } catch (err) {
      setError('Failed to fetch video info. Please check the URL and try again.');
      setInfo(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!info || !format) {
      setError('Please preview the video and select a format');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:5000/download', {
        url,
        format_id: format
      }, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'video/mp4' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `facebook_${info.title?.slice(0, 40).replace(/\s+/g, '_') || 'video'}.mp4`;
      link.click();
      setSuccess('Download completed successfully!');
      // Save to history
      const currentHistory = JSON.parse(localStorage.getItem('downloadHistory')) || [];
      currentHistory.unshift({
        title: info.title,
        url,
        platform: 'facebook',
        thumbnail: info.thumbnail,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('downloadHistory', JSON.stringify(currentHistory));
    } catch (err) {
      setError('Download failed. Please try again.');
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
    setFormat('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="page-wrapper">
      <div className="page-center">
        <div className="card fade-in">
          <div className="card-accent" style={{ borderColor: '#1877F2' }}>
            <FaFacebook style={{ color: '#1877F2' }} />
          </div>
          <h2>Download from Facebook</h2>
          <div className="subtitle">Download Facebook videos in HD. No login, no watermark, just fast downloads!</div>
          <div className="input-row">
            <input type="text" placeholder="Paste Facebook link here" value={url} onChange={(e) => setUrl(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handlePreview()} />
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
            <div className="howto-step"><span className="howto-icon"><FaLink /></span> Paste the Facebook video link above.</div>
            <div className="howto-step"><span className="howto-icon"><FaSearch /></span> Click <b>Preview</b> to fetch video info.</div>
            <div className="howto-step"><span className="howto-icon"><FaSlidersH /></span> Select quality and click <b>Download</b>.</div>
          </div>
          {info && (
            <div className="slide-up">
              <img src={info.thumbnail} alt="thumbnail" />
              <h3>{info.title}</h3>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                {info.formats.map(f => (
                  <option key={f.format_id} value={f.format_id}>
                    {f.format_note || f.resolution || f.format_id}
                  </option>
                ))}
              </select>
              <button onClick={handleDownload} disabled={loading} className={loading ? 'loading' : ''}>
                <FaDownload style={{ marginRight: '8px' }} />
                {loading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          )}
          {recentDownloads.length > 0 && (
            <div className="recent-downloads">
              <div className="recent-downloads-title">Recent Facebook Downloads</div>
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

export default FacebookDownload;
