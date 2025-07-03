// BulkLinkSubmitter.js

import React, { useState } from 'react';
import axios from 'axios';
import { 
  FaDownload, FaExclamationTriangle, FaCheckCircle, FaTrash,
  FaCopy, FaTimes, FaLink, FaSearch, FaSlidersH, FaLayerGroup,
  FaFileUpload, FaPlus, FaPlay
} from 'react-icons/fa';
import './bulklink.css';

function BulkLinkSubmitter() {
  const [bulkInput, setBulkInput] = useState('');
  const [links, setLinks] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [statusMap, setStatusMap] = useState({});
  const [copied, setCopied] = useState(false);

  const fetchInfo = async (url) => {
    try {
      const res = await axios.post('http://localhost:5000/info', { url });
      if (res.data.multi) {
        return res.data.videos.map((vid, idx) => ({
          ...vid,
          index: idx + 1,  // ✅ penting untuk playlist_items
          url
        }));
      } else {
        return [{
          ...res.data,
          index: 1,
          url
        }];
      }
    } catch {
      return [];
    }
  };
  

  const handleAddLinks = async () => {
    const rawLinks = bulkInput.split('\n').map(link => link.trim()).filter(link => link !== '');
    let allNewLinks = [];

    for (const url of rawLinks) {
      const infos = await fetchInfo(url);
      const formatted = infos.map(info => ({
        url: info.url,
        info,
        selectedIndex: info.index
      }));
      allNewLinks = [...allNewLinks, ...formatted];
    }

    setLinks(prev => [...prev, ...allNewLinks]);
    setBulkInput('');
  };

  const handleRemoveLink = (url, index) => {
    setLinks(prev => prev.filter(l => !(l.url === url && l.selectedIndex === index)));
  };

  const handleDownloadAll = async () => {
    setDownloading(true);
  
    for (const linkObj of links) {
      const { url, info, selectedIndex } = linkObj;
      try {
        setStatusMap(prev => ({ ...prev, [`${url}-${selectedIndex}`]: 'downloading' }));
        const res = await axios.post('http://localhost:5000/download', {
          url,
          format_id: info.formats?.find(f => f.ext === 'mp4')?.format_id || 'best',
          video_index: selectedIndex   // ✅ ini dia
        }, { responseType: 'blob' });
  
        const blob = new Blob([res.data], { type: 'video/mp4' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${info.title || 'video'}_${selectedIndex}.mp4`;
        a.click();
  
        const current = JSON.parse(localStorage.getItem('downloadHistory')) || [];
        current.unshift({
          title: info.title,
          url,
          thumbnail: info.thumbnail,
          platform: detectPlatform(url),
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('downloadHistory', JSON.stringify(current));
  
        setStatusMap(prev => ({ ...prev, [`${url}-${selectedIndex}`]: 'success' }));
      } catch (err) {
        setStatusMap(prev => ({ ...prev, [`${url}-${selectedIndex}`]: 'error' }));
      }
    }
  
    setDownloading(false);
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
    navigator.clipboard.writeText(bulkInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleClear = () => {
    setBulkInput('');
    setLinks([]);
    setStatusMap({});
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBulkInput(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-center">
        <div className="card fade-in">
          <div className="card-accent" style={{ borderColor: '#ec4899' }}>
            <FaLayerGroup style={{ color: '#ec4899' }} />
          </div>
          <h2>Bulk Link Submitter</h2>
          <div className="subtitle">Download multiple videos at once. Perfect for playlists and batch processing!</div>
          
          <div className="input-row">
            <textarea
              placeholder="Paste multiple links here, one per line..."
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="bulk-textarea"
              rows={6}
            />
            <button className="copy-btn" onClick={handleCopy} title="Copy links" type="button">
              <FaCopy />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="clear-btn" onClick={handleClear} title="Clear" type="button">
              <FaTimes />
            </button>
          </div>

          <div className="bulk-actions">
            <button onClick={handleAddLinks} className="add-btn">
              <FaPlus style={{ marginRight: '8px' }} />
              Add Links
            </button>
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
                Upload .txt file
              </label>
            </div>
          </div>

          <div className="howto">
            <div className="howto-title">How to use bulk download:</div>
            <div className="howto-step"><span className="howto-icon"><FaLink /></span> Paste multiple video links (one per line)</div>
            <div className="howto-step"><span className="howto-icon"><FaPlus /></span> Click <b>Add Links</b> to process them</div>
            <div className="howto-step"><span className="howto-icon"><FaDownload /></span> Click <b>Download All</b> to start batch download</div>
          </div>

          {links.length > 0 && (
            <div className="bulk-section">
              <div className="bulk-header">
                <div className="bulk-stats">
                  <span className="bulk-count">{links.length} videos loaded</span>
                  <span className="bulk-platforms">
                    {new Set(links.map(l => detectPlatform(l.url))).size} platforms
                  </span>
                </div>
                <button onClick={handleDownloadAll} className="download-all-btn" disabled={downloading}>
                  <FaDownload style={{ marginRight: '8px' }} />
                  {downloading ? 'Downloading...' : 'Download All'}
                </button>
              </div>

              <div className="bulk-list">
                {links.map((item, i) => (
                  <div key={`${item.url}-${item.selectedIndex}`} className="bulk-card slide-up">
                    <div className="bulk-thumbnail">
                      <img src={item.info.thumbnail} alt="thumb" />
                      <div className="bulk-index">{item.selectedIndex}</div>
                    </div>
                    <div className="bulk-info">
                      <h4 className="bulk-title">{item.info.title}</h4>
                      <div className="bulk-meta">
                        <span className="bulk-platform">{detectPlatform(item.url)}</span>
                        <span className="bulk-url">{item.url}</span>
                      </div>
                      <div className="bulk-actions">
                        <span className={`bulk-status ${statusMap[`${item.url}-${item.selectedIndex}`]}`}>
                          {statusMap[`${item.url}-${item.selectedIndex}`] === 'downloading' && '⬇️ Downloading'}
                          {statusMap[`${item.url}-${item.selectedIndex}`] === 'success' && '✅ Done'}
                          {statusMap[`${item.url}-${item.selectedIndex}`] === 'error' && '❌ Failed'}
                          {!statusMap[`${item.url}-${item.selectedIndex}`] && '⏳ Pending'}
                        </span>
                        <button onClick={() => handleRemoveLink(item.url, item.selectedIndex)} className="remove-btn">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="features-section">
            <h3>Bulk Features</h3>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">📝</div>
                <div className="feature-text">
                  <h4>Text Input</h4>
                  <p>Paste multiple URLs separated by new lines</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📁</div>
                <div className="feature-text">
                  <h4>File Upload</h4>
                  <p>Upload .txt files with multiple links</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <div className="feature-text">
                  <h4>Playlist Support</h4>
                  <p>Automatically detects and processes playlists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkLinkSubmitter;
