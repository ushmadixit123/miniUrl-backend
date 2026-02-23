// routes/url.js
import express from 'express';
import { shortenUrl, redirectUrl, userUrls, getAnalytics } from '../controller/UrlController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/shorten', shortenUrl);
router.get('/getUserUrls',authMiddleware, userUrls);
router.get('/analytics',authMiddleware, getAnalytics)
router.get('/:code', redirectUrl);



export default router;
