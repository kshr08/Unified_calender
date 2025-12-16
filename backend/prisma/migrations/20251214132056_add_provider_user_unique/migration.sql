/*
  Warnings:

  - A unique constraint covering the columns `[provider,userId]` on the table `ConnectedAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ConnectedAccount_provider_userId_key" ON "ConnectedAccount"("provider", "userId");
