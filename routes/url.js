// routes/url.js
import express from 'express';
import { shortenUrl, redirectUrl } from '../controller/UrlController.js';

const router = express.Router();

router.post('/shorten', shortenUrl);
router.get('/:code', redirectUrl);

export default router;
