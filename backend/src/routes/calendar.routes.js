import express from "express";
import {
  syncCalendars,
  getEvents,
  getDayEvents,
  getWeekEvents,
  getMonthEvents,
} from "../controllers/calendar.controller.js";

const router = express.Router();

router.post("/sync", syncCalendars);
router.get("/events", getEvents);

router.get("/day", getDayEvents);
router.get("/week", getWeekEvents);
router.get("/month", getMonthEvents);

export default router;
