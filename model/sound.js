
const mongoose = require("mongoose");
const Validator = require("mongoose-unique-validator");


const SoundSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    VIDEO_ID: { type: String, unique: true },
    video_url: { type: String, require: true },
    title: { type: String, require: true, unique: true },
    urlmx: { type: String },
    chapters: [],
    thumbnailUrl: { type: String },
    lengthSecondes: { type: String },
    artist: { type: String },
    album: { type: String },
    genre: { type: String },
    category: { type: String },
    publishDate: { type: String },
    author: [],
    parole: { type: String },
    viewCount: { type: String },
    related_videos: [],
},
    { timestamps: true }

);
SoundSchema.plugin(Validator);

module.exports = mongoose.model('Sound', SoundSchema)