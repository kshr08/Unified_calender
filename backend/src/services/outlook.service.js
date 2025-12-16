import axios from "axios";

export const fetchOutlookEvents = async (accessToken) => {
  const res = await axios.get(
    "https://graph.microsoft.com/v1.0/me/events",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        $orderby: "start/dateTime",
        $top: 50,
      },
    }
  );

  return res.data.value.map((e) => ({
    provider: "outlook",
    externalEventId: e.id,
    title: e.subject || "No Title",
    startTime: new Date(e.start.dateTime),
    endTime: new Date(e.end.dateTime),
    inviteStatus: e.responseStatus?.response || null,
  }));
};
