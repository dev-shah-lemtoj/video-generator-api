const Analytics = require('../models/analyticsModel');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

function getClientIp(req) {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }
    return ip;
}

// CREATE
exports.createAnalytics = async (req, res) => {
    try {
        const ip = getClientIp(req);
        const geo = geoip.lookup(ip) || {};
        const parser = new UAParser(req.headers['user-agent']);

        const analytics = new Analytics({
            ...req.body,
            ipAddress: ip,
            country: geo.country || null,
            region: geo.region || null,
            state: geo.city || null,
            device: parser.getDevice().type || 'Desktop',
            platform: parser.getOS().name
        });

        const saved = await analytics.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// GET ALL (with filters)
exports.getAllAnalytics = async (req, res) => {
    try {
        // Pagination params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search param
        const search = req.query.search ? req.query.search.trim() : "";

        // Build filter
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { siteName: { $regex: search, $options: "i" } },
                    { widgetName: { $regex: search, $options: "i" } },
                    { eventType: { $regex: search, $options: "i" } },
                    { category: { $regex: search, $options: "i" } },
                    { country: { $regex: search, $options: "i" } },
                    { tags: { $regex: search, $options: "i" } }
                ]
            };
        }

        // Query with pagination
        const [data, total] = await Promise.all([
            Analytics.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Analytics.countDocuments(filter)
        ]);

        res.json({
            data,
            total,
            page,
            limit
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SUMMARY: Views by Country
exports.getViewsByCountry = async (req, res) => {
    try {
        const summary = await Analytics.aggregate([
            { $group: { _id: "$country", totalViews: { $sum: "$viewCount" } } },
            { $sort: { totalViews: -1 } }
        ]);
        res.json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
exports.updateAnalytics = async (req, res) => {
    try {
        const updated = await Analytics.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE
exports.deleteAnalytics = async (req, res) => {
    try {
        await Analytics.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SUMMARY: Total views by Embed ID + Widget ID with filters
exports.getCountByEmbedId = async (req, res) => {
    try {
        const { search, startDate, endDate } = req.query;

        // Build filter
        let filter = {};

        // Search filter
        if (search) {
            const trimmed = search.trim();
            filter.$or = [
                { siteName: { $regex: trimmed, $options: "i" } },
                { widgetName: { $regex: trimmed, $options: "i" } },
                { eventType: { $regex: trimmed, $options: "i" } },
                { category: { $regex: trimmed, $options: "i" } },
                { country: { $regex: trimmed, $options: "i" } },
                { tags: { $regex: trimmed, $options: "i" } },
                { embedId: { $regex: trimmed, $options: "i" } }
            ];
        }

        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Per-embedId summary
        const summary = await Analytics.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: {
                        embedId: "$embedId",
                        widgetId: "$widgetId",
                        widgetName: "$widgetName"
                    },
                    totalViews: { $sum: "$viewCount" }
                }
            },
            { $sort: { totalViews: -1 } }
        ]);

        // Calculate grand total
        const grandTotal = summary.reduce((sum, item) => sum + (item.totalViews || 0), 0);

        res.json({
            perEmbed: summary,
            grandTotal
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SUMMARY: Total views by Video ID + Widget ID + Site ID + Site Name with filters
exports.getCountByVideoId = async (req, res) => {
    try {
        const { search, startDate, endDate } = req.query;

        // Build filter - exclude null or empty videoId
        let filter = {
            videoId: { $nin: [null, " "] }
        };

        // Search filter
        if (search) {
            const trimmed = search.trim();
            filter.$or = [
                { siteName: { $regex: trimmed, $options: "i" } },
                { widgetName: { $regex: trimmed, $options: "i" } },
                { eventType: { $regex: trimmed, $options: "i" } },
                { category: { $regex: trimmed, $options: "i" } },
                { country: { $regex: trimmed, $options: "i" } },
                { tags: { $regex: trimmed, $options: "i" } },
                { videoId: { $regex: trimmed, $options: "i" } },
                { siteId: { $regex: trimmed, $options: "i" } }
            ];
        }

        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Aggregate by videoId
        const summary = await Analytics.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: {
                        siteId: "$siteId",
                        siteName: "$siteName",
                        videoId: "$videoId",
                        widgetId: "$widgetId",
                        widgetName: "$widgetName"
                    },
                    totalViews: { $sum: "$viewCount" }
                }
            },
            { $sort: { totalViews: -1 } }
        ]);

        // Calculate grand total
        const grandTotal = summary.reduce((sum, item) => sum + (item.totalViews || 0), 0);

        res.json({
            perVideo: summary,
            grandTotal
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
