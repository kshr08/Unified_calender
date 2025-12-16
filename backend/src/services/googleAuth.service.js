import prisma from "../config/prisma.js";
import { oauth2Client } from "../config/google.js";

export const getValidGoogleAccessToken = async (account) => {
  // If token still valid, return it
  if (account.expiresAt && new Date(account.expiresAt) > new Date()) {
    return account.accessToken;
  }

  // Otherwise refresh it
  oauth2Client.setCredentials({
    refresh_token: account.refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();

  // Save new token in DB
  await prisma.connectedAccount.update({
    where: { id: account.id },
    data: {
      accessToken: credentials.access_token,
      expiresAt: credentials.expiry_date
        ? new Date(credentials.expiry_date)
        : null,
    },
  });

  return credentials.access_token;
};
