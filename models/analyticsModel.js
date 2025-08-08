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
    widgetName: String, // <-- Added widgetName
    device: String,
    platform: String,
    country: String,
    region: String,
    state: String,
    ipAddress: String,
    lastViewedAt: Date
}, { timestamps: true }); // Auto-created createdAt & updatedAt

module.exports = mongoose.model('Analytics', analyticsSchema);
