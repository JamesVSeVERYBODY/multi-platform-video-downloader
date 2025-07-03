import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaYoutube, FaTwitter, FaInstagram,
  FaTiktok, FaFacebook, FaTwitch,
  FaBolt, FaDownload, FaEye, FaUpload,
  FaExclamationTriangle, FaCheckCircle,
  FaTrash, FaFileUpload, FaCopy, FaTimes,
  FaLink, FaSearch, FaSlidersH, FaMagic
} from 'react-icons/fa';
import './smartdownloader.css';

const platformIcons = {
  youtube: <FaYoutube color="#FF0000" />,
  x: <FaTwitter color="#1DA1F2" />,
  instagram: <FaInstagram color="#C13584" />,
  tiktok: <FaTiktok color="#000" />,
  facebook: <FaFacebook color="#1877F2" />,
  twitch: <FaTwitch color="#9146FF" />
};

function SmartDownloader() {
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState(null);
  const [formatId, setFormatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [autoDetected, setAutoDetected] = useState(false);
  const [bulkLinks, setBulkLinks] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto Detect Clipboard
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text.startsWith('http') && text.includes('.com') && !autoDetected) {
          setUrl(text);
          setAutoDetected(true);
        }
      } catch (err) {
        console.log('Clipboard check failed:', err);
      }
    };
    checkClipboard();
  }, [autoDetected]);

  const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'x';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('twitch.tv')) return 'twitch';
    return 'unknown';
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / 1024 / 1024;
    return mb.toFixed(1) + ' MB';
  };

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
      setFormatId(res.data.formats?.[0]?.format_id || '');
      setSuccessMsg('Video information loaded successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch video info. Make sure the URL is valid.');
      setInfo(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!info || !formatId) {
      setErrorMsg('Please preview the video first and select a format');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const platform = detectPlatform(url);
    const current = JSON.parse(localStorage.getItem('downloadHistory')) || [];

    // Dupe check
    const isDuplicate = current.find(h => h.url === url);
    if (isDuplicate) {
      setErrorMsg('This video has already been downloaded.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/download', {
        url,
        format_id: formatId
      }, { responseType: 'blob' });

      const blob = new Blob([res.data], { type: 'video/mp4' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);

      // Smart naming
      const filename = `${platform}_${info.title?.slice(0, 40).replace(/\s+/g, '_') || 'video'}.mp4`;
      link.download = filename;
      link.click();

      // Save to history
      const updated = [{
        title: info.title,
        url,
        thumbnail: info.thumbnail,
        platform,
        timestamp: new Date().toISOString()
      }, ...current];

      localStorage.setItem('downloadHistory', JSON.stringify(updated));
      setSuccessMsg('Download completed successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg('Download failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const extractLinksFromText = (text) => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(regex);
    return matches || [];
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "text/plain") {
      setErrorMsg('Please upload a valid .txt file');
      return;
    }

    setBulkLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const urls = extractLinksFromText(text);
      const validVideos = [];

      for (const url of urls) {
        try {
          const res = await axios.post('http://localhost:5000/info', { url });
          validVideos.push({ url, info: res.data });
        } catch (err) {
          console.warn(`Invalid link or can't fetch: ${url}`);
        }
      }

      setBulkLinks(validVideos);
      setSuccessMsg(`Successfully loaded ${validVideos.length} videos from file!`);
      setBulkLoading(false);
    };

    reader.readAsText(file);
  };

  const handleDownloadAllFromTxt = async () => {
    setBulkLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    for (const item of bulkLinks) {
      try {
        const res = await axios.post('http://localhost:5000/download', {
          url: item.url,
          format_id: item.info.formats?.[0]?.format_id || 'best'
        }, { responseType: 'blob' });

        const blob = new Blob([res.data], { type: 'video/mp4' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${item.info.title || 'video'}.mp4`;
        link.click();

        // Save to history
        const current = JSON.parse(localStorage.getItem('downloadHistory')) || [];
        current.unshift({
          title: item.info.title,
          url: item.url,
          thumbnail: item.info.thumbnail,
          platform: detectPlatform(item.url),
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('downloadHistory', JSON.stringify(current));
      } catch (err) {
        console.error(`Failed to download: ${item.url}`);
      }
    }

    setSuccessMsg('Bulk download completed!');
    setBulkLoading(false);
  };

  const handleSingleDownload = async (item) => {
    try {
      const res = await axios.post('http://localhost:5000/download', {
        url: item.url,
        format_id: item.info.formats?.[0]?.format_id || 'best'
      }, { responseType: 'blob' });

      const blob = new Blob([res.data], { type: 'video/mp4' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${item.info.title || 'video'}.mp4`;
      link.click();

      // Save to history
      const current = JSON.parse(localStorage.getItem('downloadHistory')) || [];
      current.unshift({
        title: item.info.title,
        url: item.url,
        thumbnail: item.info.thumbnail,
        platform: detectPlatform(item.url),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('downloadHistory', JSON.stringify(current));

      setSuccessMsg('Download completed!');
    } catch (err) {
      setErrorMsg('Download failed!');
    }
  };

  const handleRemoveFromTxt = (idx) => {
    setBulkLinks(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleClear = () => {
    setUrl('');
    setInfo(null);
    setFormatId('');
    setErrorMsg('');
    setSuccessMsg('');
    setBulkLinks([]);
  };

  return (
    <div className="page-wrapper">
      <div className="page-center">
        <div className="card fade-in">
          <div className="card-accent" style={{ borderColor: '#8b5cf6' }}>
            <FaMagic style={{ color: '#8b5cf6' }} />
          </div>
          <h2>Smart Downloader</h2>
          <div className="subtitle">AI-powered video downloader with auto-detection, bulk processing, and smart features!</div>
          
          <div className="input-row">
            <input
              type="text"
              placeholder="Paste any video URL here..."
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
            <div className="howto-title">Smart Features:</div>
            <div className="howto-step"><span className="howto-icon"><FaBolt /></span> Auto-detects clipboard links</div>
            <div className="howto-step"><span className="howto-icon"><FaSearch /></span> Supports all major platforms</div>
            <div className="howto-step"><span className="howto-icon"><FaUpload /></span> Bulk download from text files</div>
          </div>

          {info && (
            <div className="slide-up">
              <div className="video-preview">
                <img src={info.thumbnail} alt="Video thumbnail" />
                <div className="video-info">
                  <h3>{info.title}</h3>
                  <div className="platform-badge">
                    {platformIcons[detectPlatform(url)] || '📹'}
                    <span>{detectPlatform(url)}</span>
                  </div>
                </div>
              </div>
              <select value={formatId} onChange={(e) => setFormatId(e.target.value)}>
                {info.formats.map(f => (
                  <option key={f.format_id} value={f.format_id}>
                    {f.format_note || f.resolution || f.format_id}
                    {f.filesize && ` (${formatSize(f.filesize)})`}
                  </option>
                ))}
              </select>
              <button onClick={handleDownload} disabled={loading} className={loading ? 'loading' : ''}>
                <FaDownload style={{ marginRight: '8px' }} />
                {loading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          )}

          <div className="bulk-section">
            <h3>Bulk Download</h3>
            <div className="file-upload-area">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                id="file-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <FaFileUpload style={{ marginRight: '8px' }} />
                Upload .txt file with URLs
              </label>
            </div>

            {bulkLinks.length > 0 && (
              <div className="bulk-list">
                <div className="bulk-header">
                  <span>{bulkLinks.length} videos loaded</span>
                  <button onClick={handleDownloadAllFromTxt} disabled={bulkLoading} className={bulkLoading ? 'loading' : ''}>
                    <FaDownload style={{ marginRight: '8px' }} />
                    {bulkLoading ? 'Downloading All...' : 'Download All'}
                  </button>
                </div>
                {bulkLinks.map((item, idx) => (
                  <div key={idx} className="bulk-item">
                    <img src={item.info.thumbnail} alt="thumb" />
                    <div className="bulk-item-info">
                      <h4>{item.info.title}</h4>
                      <div className="bulk-item-actions">
                        <button onClick={() => handleSingleDownload(item)} className="download-single-btn">
                          <FaDownload />
                        </button>
                        <button onClick={() => handleRemoveFromTxt(idx)} className="remove-btn">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartDownloader;
