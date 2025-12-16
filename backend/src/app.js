import express from "express";
import cors from "cors";
import calendarRoutes from "./routes/calendar.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

app.use("/api/calendar", calendarRoutes);

export default app;
