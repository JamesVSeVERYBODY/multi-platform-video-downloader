import React, { useState } from 'react';
import axios from 'axios';
import { 
  FaMusic, FaDownload, FaEye, FaExclamationTriangle, FaCheckCircle,
  FaCopy, FaTimes, FaLink, FaSearch, FaSlidersH, FaVolumeUp
} from 'react-icons/fa';
import './convertmp3.css';

function ConvertToMp3() {
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState(null);
  const [bitrate, setBitrate] = useState('192');
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handlePreview = async () => {
    if (!url.trim()) {
      setErrorMsg('Please enter a video URL');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setPreviewLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/info', { url });
      setInfo(res.data);
      setSuccessMsg('Video information loaded successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to get info. Make sure the URL is valid.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!url || !info) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post('http://localhost:5000/convertmp3', {
        url,
        bitrate
      }, { responseType: 'blob' });

      const blob = new Blob([res.data], { type: 'audio/mp3' });
      const link = document.createElement('a');
      const cleanTitle = (info.title || 'audio').replace(/[^\w\s]/gi, '').split(' ').slice(0, 8).join('_');
      link.href = URL.createObjectURL(blob);
      link.download = `${cleanTitle}_${bitrate}kbps.mp3`;
      link.click();

      const current = JSON.parse(localStorage.getItem('downloadHistory')) || [];
      current.unshift({
        title: info.title,
        url,
        thumbnail: info.thumbnail,
        platform: detectPlatform(url),
        timestamp: new Date().toISOString(),
        type: 'mp3'
      });
      localStorage.setItem('downloadHistory', JSON.stringify(current));
      setSuccessMsg('MP3 conversion completed successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to convert or download.');
    }

    setLoading(false);
  };

  const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'x';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('twitch.tv')) return 'twitch';
    return 'unknown';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleClear = () => {
    setUrl('');
    setInfo(null);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="page-wrapper">
      <div className="page-center">
        <div className="card fade-in">
          <div className="card-accent" style={{ borderColor: '#10b981' }}>
            <FaMusic style={{ color: '#10b981' }} />
          </div>
          <h2>Convert to MP3</h2>
          <div className="subtitle">Extract audio from any video. High-quality MP3 conversion with customizable bitrate!</div>
          
          <div className="input-row">
            <input
              type="text"
              placeholder="Paste video URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePreview()}
            />
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

          {errorMsg && (
            <div className="error">
              <FaExclamationTriangle />
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="success">
              <FaCheckCircle />
              {successMsg}
            </div>
          )}

          <div className="howto">
            <div className="howto-title">How to convert:</div>
            <div className="howto-step"><span className="howto-icon"><FaLink /></span> Paste the video link above.</div>
            <div className="howto-step"><span className="howto-icon"><FaSearch /></span> Click <b>Preview</b> to fetch video info.</div>
            <div className="howto-step"><span className="howto-icon"><FaVolumeUp /></span> Select quality and click <b>Convert</b>.</div>
          </div>

          {info && (
            <div className="slide-up">
              <div className="audio-preview">
                <img src={info.thumbnail} alt="Video thumbnail" />
                <div className="audio-info">
                  <h3>{info.title}</h3>
                  <div className="audio-meta">
                    <span>Duration: {info.duration ? Math.floor(info.duration / 60) + ':' + (info.duration % 60).toString().padStart(2, '0') : 'Unknown'}</span>
                  </div>
                </div>
              </div>
              
              <div className="quality-selector">
                <label>Audio Quality:</label>
                <select value={bitrate} onChange={(e) => setBitrate(e.target.value)}>
                  <option value="128">🎵 128 kbps (Good)</option>
                  <option value="192">🎵 192 kbps (Better)</option>
                  <option value="320">🎵 320 kbps (Best)</option>
                </select>
              </div>

              <button onClick={handleDownload} disabled={loading} className={loading ? 'loading' : ''}>
                <FaDownload style={{ marginRight: '8px' }} />
                {loading ? 'Converting...' : 'Convert to MP3'}
              </button>
            </div>
          )}

          <div className="features-section">
            <h3>Features</h3>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🎵</div>
                <div className="feature-text">
                  <h4>High Quality</h4>
                  <p>Convert to MP3 with up to 320 kbps quality</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <h4>Fast Conversion</h4>
                  <p>Quick audio extraction from any video</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌐</div>
                <div className="feature-text">
                  <h4>All Platforms</h4>
                  <p>Works with YouTube, TikTok, Instagram, and more</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConvertToMp3;
