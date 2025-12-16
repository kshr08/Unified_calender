import axios from "axios";

export const OUTLOOK_AUTH_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

export const OUTLOOK_TOKEN_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/token";

export const OUTLOOK_SCOPES = [
  "offline_access",
  "User.Read",
  "Calendars.Read",
];
