import "dotenv/config";
import express from "express";
import calendarRoutes from "./routes/calendar.routes.js";
import oauthRoutes from "./routes/oauth.routes.js";
import outlookOAuthRoutes from "./routes/oauth.routes.js";

const app = express();

app.use(express.json());
app.use("/api/calendar", calendarRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/oauth", outlookOAuthRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
