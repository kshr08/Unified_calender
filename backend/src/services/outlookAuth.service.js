import axios from "axios";
import prisma from "../config/prisma.js";
import { OUTLOOK_TOKEN_URL } from "../config/outlook.js";

export const getValidOutlookAccessToken = async (account) => {
  if (account.expiresAt && new Date(account.expiresAt) > new Date()) {
    return account.accessToken;
  }

  const res = await axios.post(
    OUTLOOK_TOKEN_URL,
    new URLSearchParams({
      client_id: process.env.OUTLOOK_CLIENT_ID,
      client_secret: process.env.OUTLOOK_CLIENT_SECRET,
      refresh_token: account.refreshToken,
      grant_type: "refresh_token",
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const { access_token, expires_in } = res.data;

  await prisma.connectedAccount.update({
    where: { id: account.id },
    data: {
      accessToken: access_token,
      expiresAt: new Date(Date.now() + expires_in * 1000),
    },
  });

  return access_token;
};
