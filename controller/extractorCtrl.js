const ytdl = require('ytdl-core');
var ffmpeg = require('ffmpeg');
const fs = require('fs');
const path = require('path');
const sound = require('../model/sound');
const { json } = require('body-parser');


exports.getVideoInfo = async (req, res, next) => {
    try {
        // req.body.userId = req.user.id;
        await ytdl.getInfo(req.body.youtubeUrl).then(async (result) => {
            if (result) {
                const formats = result.formats;
                const details = result.videoDetails
                const related_videos = result.related_videos
                const musicUrl = formats.find((format) => format.mimeType.includes('audio/mp4')).url;
                let { lengthSeconds, title, thumbnails, video_url, chapters, author, viewCount, videoId, category, publishDate } = details;
                const thumbnail = thumbnails.pop().url;
                author = {
                    name: author.name,
                    channel: author.channel_url,
                    thumbnails: author.thumbnails.pop().url,
                }
                const chapterLinks = chapters.map(chapter => ({
                    title: chapter.title,
                    start_time: chapter.start_time,
                    link: `https://www.youtube.com/watch?v=${videoId}&t=${chapter.start_time}`,
                }));
                const newSound = new sound({
                    title: title,
                    video_url: video_url,
                    thumbnailUrl: thumbnail,
                    urlmx: musicUrl,
                    chapters: chapterLinks,
                    lengthSecondes: lengthSeconds,
                    author: author,
                    viewCount: viewCount,
                    VIDEO_ID: videoId,
                    category: category,
                    publishDate: publishDate,
                    related_videos: related_videos,
                });
                // const _newSound = await newSound.save()
                return res.status(200).json(newSound);
            }
            else {
                return res.status(403).json({ result: false, message: 'no detail found' });
            }
        }).catch((err) => {
            return res.status(500).json({ result: false, message: 'unable to find', error: err.message });
        });
    } catch (error) {
        next(error);
    }
};

exports.downloadchapter = async (req, res, next) => {
    try {
        let chapter = req.body.chapter;
        console.log(chapter.link);
        const videoReadableStream = ytdl(chapter.link, { quality: 'highestaudio' });
        const mp3FilePath = path.join(__dirname, `${chapter.title}.mp3`);
        const mp3FileWriteStream = fs.createWriteStream(mp3FilePath);
        videoReadableStream.pipe(mp3FileWriteStream);
        videoReadableStream.on('end', () => { res.sendFile(mp3FilePath, () => { fs.unlinkSync(mp3FilePath); }); });
    } catch (error) {
        next(error);
    }
};
