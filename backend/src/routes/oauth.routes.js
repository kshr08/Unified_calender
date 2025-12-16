import express from "express";
import {
  googleAuth,
  googleCallback,
} from "../controllers/oauth.controller.js";
import {
  outlookLogin,
  outlookCallback,
} from "../controllers/oauth.outlook.controller.js";

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

router.get("/outlook", outlookLogin);
router.get("/outlook/callback", outlookCallback);

export default router;
