const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    siteName: { type: String, required: true },
    siteId: { type: String, required: true },
    embedId: { type: String, required: true },
    videoId: { type: String, required: true },
    eventType: { type: String, required: true },
    channel: String,
    category: String,
    tags: [String],
    viewCount: { type: Number, default: 0 },
    userId: String,
    device: String,
    platform: String,
    country: String,
    region: String,
    state: String,
    ipAddress: String,
    lastViewedAt: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
