from yt_dlp import YoutubeDL

url = 'https://www.tiktok.com/@qaaaaays/video/7267152360177274117'

with YoutubeDL({}) as ydl:
    ydl.download([url])
