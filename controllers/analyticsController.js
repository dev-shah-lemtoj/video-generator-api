const Analytics = require('../models/analyticsModel');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

// CREATE
exports.createAnalytics = async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
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
        const filters = { ...req.query }; 
        const data = await Analytics.find(filters);
        res.json(data);
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
