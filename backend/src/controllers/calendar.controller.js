import prisma from "../config/prisma.js";
import { fetchGoogleEvents } from "../services/google.service.js";
import { fetchOutlookEvents } from "../services/outlook.service.js";
import { getValidGoogleAccessToken } from "../services/googleAuth.service.js";
import { getValidOutlookAccessToken } from "../services/outlookAuth.service.js";
import {
  getDayRange,
  getWeekRange,
  getMonthRange,
} from "../utils/dateRanges.js";

export const syncCalendars = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // 1️⃣ Get connected accounts
    const accounts = await prisma.connectedAccount.findMany({
      where: { userId },
    });

    let allEvents = [];

    // 2️⃣ Fetch events from all providers
    for (const acc of accounts) {
      if (acc.provider === "google") {
        const token = await getValidGoogleAccessToken(acc);
        const events = await fetchGoogleEvents(token);
        allEvents.push(...events);
      }

      if (acc.provider === "outlook") {
        const token = await getValidOutlookAccessToken(acc);
        const events = await fetchOutlookEvents(token);
        allEvents.push(...events);
      }
    }

    // 3️⃣ Clear old events
    await prisma.event.deleteMany({
      where: { userId },
    });

    // 4️⃣ Insert new events
    if (allEvents.length > 0) {
      await prisma.event.createMany({
        data: allEvents.map((event) => ({
          ...event,
          userId,
        })),
      });
    }

    return res.json({
      message: "Calendars synced successfully",
      count: allEvents.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getEvents = async (req, res) => {
  const userId = Number(req.query.userId);

  const events = await prisma.event.findMany({
    where: { userId },
    orderBy: { startTime: "asc" },
  });

  res.json(events);
};

export const getDayEvents = async (req, res) => {
  const userId = Number(req.query.userId);
  const date = req.query.date || new Date();
  const provider = req.query.provider; // 👈 NEW

  const { start, end } = getDayRange(date);

  const events = await prisma.event.findMany({
    where: buildProviderFilter(userId, provider, start, end),
    orderBy: { startTime: "asc" },
  });

  res.json(events);
};

export const getWeekEvents = async (req, res) => {
  const userId = Number(req.query.userId);
  const date = req.query.date || new Date();
  const provider = req.query.provider;

  const { start, end } = getWeekRange(date);

  const events = await prisma.event.findMany({
    where: buildProviderFilter(userId, provider, start, end),
    orderBy: { startTime: "asc" },
  });

  res.json(events);
};


export const getMonthEvents = async (req, res) => {
  const userId = Number(req.query.userId);
  const date = req.query.date || new Date();
  const provider = req.query.provider;

  const { start, end } = getMonthRange(date);

  const events = await prisma.event.findMany({
    where: buildProviderFilter(userId, provider, start, end),
    orderBy: { startTime: "asc" },
  });

  res.json(events);
};


const buildProviderFilter = (userId, provider, start, end) => {
  const where = {
    userId,
    startTime: { gte: start, lte: end },
  };

  if (provider) {
    where.provider = provider;
  }

  return where;
};
