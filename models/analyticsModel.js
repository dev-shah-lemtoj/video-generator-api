const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    siteName: { type: String, required: true },
    siteId: { type: String, required: true },
    embedId: { type: String, required: true },
    videoId: String,
    videoName: { type: String, required: false },
    eventType: { type: String, required: true },
    channel: String,
    category: String,
    tags: [String],
    viewCount: { type: Number, default: 0 },
    userId: String,
    widgetName: String, // <-- Added widgetName
    widgetId: String, // <-- Added widgetId
    device: String,
    platform: String,
    country: String,
    region: String,
    state: String,
    ipAddress: String,
    lastViewedAt: Date
}, { timestamps: true, strict: false }); // <-- Added strict: false to allow dynamic fields

module.exports = mongoose.model('Analytics', analyticsSchema);
