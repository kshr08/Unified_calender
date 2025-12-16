import axios from "axios";

export const fetchGoogleEvents = async (accessToken) => {
  const res = await axios.get(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 50,
      },
    }
  );

  return res.data.items.map((e) => ({
    provider: "google",
    externalEventId: e.id,
    title: e.summary || "No Title",
    startTime: new Date(e.start.dateTime || e.start.date),
    endTime: new Date(e.end.dateTime || e.end.date),
    inviteStatus: e.status,
  }));
};
