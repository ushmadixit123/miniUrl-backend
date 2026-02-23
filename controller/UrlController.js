// controllers/urlController.js
import Url from '../models/UrlSchema.js';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';

export const shortenUrl = async (req, res) => {
  console.log(req.user)
  const { longUrl } = req.body;
  const shortCode = nanoid(6);

  try {
    const user_id = req.user.id;
    const newUrl = await Url.create({user_id, longUrl, shortCode });
    res.json({ shortUrl: `https://miniurl-backend.onrender.com/url/${shortCode}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error', error: err.message });
  }
};

export const redirectUrl = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ shortCode: code });
    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    }
    res.status(404).send('URL not found');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const userUrls = async (req, res) => {
  try{
    console.log("userId:",req.user.id)
     const userId = req.user.id;
     
     const urls = await Url.find({user_id : userId});
     console.log("urls:", urls)
     return res.status(200).json({urls : urls});
  }catch(err) {
    res.status(500).json({message : err.message});
  }
}



export const getAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    /* =========================
       TOTAL CLICKS
    ========================== */
    const totalClicksAgg = await Url.aggregate([
      { $match: { user_id: userId } },
      { $group: { _id: null, total: { $sum: "$clicks" } } },
    ]);

    const totalClicks = totalClicksAgg[0]?.total || 0;

    /* =========================
       MOST CLICKED LINK
    ========================== */
    const mostClickedLink = await Url.findOne({ user_id: userId })
      .sort({ clicks: -1 })
      .limit(1);

    /* =========================
       TOP 5 LINKS
    ========================== */
    const topLinks = await Url.find({ user_id: userId })
      .sort({ clicks: -1 })
      .limit(5)
      .select("shortCode clicks");

    /* =========================
       DAILY CLICK TREND
    ========================== */
    const dailyTrend = await Url.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          clicks: { $sum: "$clicks" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedDaily = dailyTrend.map((item) => ({
      date: item._id,
      clicks: item.clicks,
    }));

    /* =========================
       WEEKLY CLICK TREND
    ========================== */
    const weeklyTrend = await Url.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: { $week: "$createdAt" },
          clicks: { $sum: "$clicks" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedWeekly = weeklyTrend.map((item) => ({
      date: `Week ${item._id}`,
      clicks: item.clicks,
    }));

    /* =========================
       RECENT LINKS (Last 5 Created)
    ========================== */
    const recentActivity = await Url.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("shortCode createdAt");

    res.status(200).json({
      totalClicks,
      clickTrend: {
        daily: formattedDaily,
        weekly: formattedWeekly,
      },
      topLinks: topLinks.map((link) => ({
        shortUrl: link.shortCode,
        clicks: link.clicks,
      })),
      mostClickedLink: mostClickedLink
        ? {
            shortUrl: mostClickedLink.shortCode,
            longUrl: mostClickedLink.longUrl,
            clicks: mostClickedLink.clicks,
          }
        : null,
      recentActivity: recentActivity.map((item) => ({
        shortUrl: item.shortCode,
        timestamp: item.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Analytics fetch failed",
      error: error.message,
    });
  }
};
