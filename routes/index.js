import express from "express";
import auth from "./auth.js";
import url from "./url.js";

const router = express.Router();

router.use('/auth', auth);
router.use('/url', url);

export default router;