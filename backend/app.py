from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import yt_dlp
import os
import time
import threading

app = Flask(__name__)
CORS(app)

def delayed_delete(path, delay=10):
    def _delete():
        time.sleep(delay)
        try:
            os.remove(path)
        except Exception as e:
            print(f"Gagal hapus file: {e}")
    threading.Thread(target=_delete).start()

@app.route('/convertmp3', methods=['POST'])
def convert_to_mp3():
    data = request.get_json()
    url = data.get('url')
    quality = data.get('bitrate', '128')  # default 128kbps

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    try:
        # Download dulu untuk dapetin metadata
        with yt_dlp.YoutubeDL({
            'quiet': True,
            'cookiefile': 'cookies.txt'
        }) as ydl:
            info_dict = ydl.extract_info(url, download=False)

        title = info_dict.get("title", "audio")
        uploader = info_dict.get("uploader", "")
        safe_name = f"{uploader}_{title}".strip().replace(" ", "_").replace("/", "_")[:50]
        filename = f"{safe_name}.mp3"

        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': filename,
            'quiet': True,
            'cookiefile': 'cookies.txt',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': quality
            }, {
                'key': 'FFmpegMetadata'
            }]
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        if not os.path.exists(filename):
            return jsonify({'error': 'MP3 file not generated'}), 500

        response = send_file(filename, as_attachment=True, download_name=filename)
        delayed_delete(filename, delay=15)
        return response

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/info', methods=['POST'])
def get_video_info():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Referer': 'https://www.tiktok.com/'  # Ini biar aman buat TikTok juga
    }

    ydl_opts = {
        'quiet': True,
        'skip_download': True,
        'forcejson': True,
        'no_warnings': True,
        'cookiefile': 'cookies.txt',
        'http_headers': headers
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

            # ✅ Jika multiple videos (kayak X.com thread / multi-video tweet)
            if 'entries' in info:
                return jsonify({
                    'multi': True,
                    'videos': [
                        {
                            'title': entry.get('title'),
                            'thumbnail': entry.get('thumbnail'),
                            'index': idx + 1,
                            'formats': [
                                {
                                    'format_id': f['format_id'],
                                    'ext': f['ext'],
                                    'format_note': f.get('format_note', ''),
                                    'resolution': f.get('resolution') or f"{f.get('width')}x{f.get('height')}",
                                    'filesize': f.get('filesize') or 0
                                }
                                for f in entry.get('formats', []) if f.get('vcodec') != 'none'
                            ]
                        }
                        for idx, entry in enumerate(info['entries'])
                    ]
                })

            # ✅ Kalau single video biasa
            formats = [
                {
                    'format_id': f['format_id'],
                    'ext': f['ext'],
                    'format_note': f.get('format_note', ''),
                    'resolution': f.get('resolution') or f"{f.get('width')}x{f.get('height')}",
                    'filesize': f.get('filesize') or 0
                }
                for f in info.get('formats', []) if f.get('vcodec') != 'none'
            ]

            return jsonify({
                'multi': False,
                'title': info.get('title'),
                'thumbnail': info.get('thumbnail'),
                'formats': formats
            })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/download', methods=['POST'])
def download():
    data = request.get_json()
    url = data.get('url')
    format_id = data.get('format_id')
    video_index = data.get('video_index')  # ini misalnya 2 atau 3

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    unique_filename = f"video_{int(time.time())}.mp4"

    ydl_opts = {
        'outtmpl': unique_filename,
        'merge_output_format': 'mp4',
        'format': format_id or 'best',
        'quiet': True,
        'cookiefile': 'cookies.txt',
    }

    # 🧠 tambahkan opsi playlist-items biar cuma download video ke-n
    if video_index:
        ydl_opts['playlist_items'] = str(video_index)  # ← PENTING BGT INI BRO

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        if not os.path.exists(unique_filename):
            return jsonify({'error': 'Download failed. File not found.'}), 500

        response = send_file(unique_filename, as_attachment=True)
        delayed_delete(unique_filename)
        return response

    except Exception as e:
        print(f"🔥 ERROR: {e}")
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
