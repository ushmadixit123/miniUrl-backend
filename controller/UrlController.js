// controllers/urlController.js
import Url from '../models/UrlSchema.js';
import { nanoid } from 'nanoid';

export const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = nanoid(6);

  try {
    const newUrl = await Url.create({ longUrl, shortCode });
    res.json({ shortUrl: `https://miniurl-backend.onrender.com/${shortCode}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
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
