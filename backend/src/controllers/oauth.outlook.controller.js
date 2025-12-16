import axios from "axios";
import prisma from "../config/prisma.js";
import {
  OUTLOOK_AUTH_URL,
  OUTLOOK_TOKEN_URL,
  OUTLOOK_SCOPES,
} from "../config/outlook.js";

export const outlookLogin = (req, res) => {
  const url =
    `${OUTLOOK_AUTH_URL}?` +
    new URLSearchParams({
      client_id: process.env.OUTLOOK_CLIENT_ID,
      response_type: "code",
      redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
      response_mode: "query",
      scope: OUTLOOK_SCOPES.join(" "),
    });

  res.redirect(url);
};

export const outlookCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.post(
      OUTLOOK_TOKEN_URL,
      new URLSearchParams({
        client_id: process.env.OUTLOOK_CLIENT_ID,
        client_secret: process.env.OUTLOOK_CLIENT_SECRET,
        code,
        redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    await prisma.connectedAccount.upsert({
      where: {
        provider_userId: {
          provider: "outlook",
          userId: 1,
        },
      },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: new Date(Date.now() + expires_in * 1000),
      },
      create: {
        provider: "outlook",
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: new Date(Date.now() + expires_in * 1000),
        userId: 1,
      },
    });

    res.send("✅ Outlook Calendar connected");
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Outlook OAuth failed");
  }
};
