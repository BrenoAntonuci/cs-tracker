-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('COMPETITIVE', 'PREMIER', 'WINGMAN', 'DEATHMATCH', 'CASUAL');

-- CreateEnum
CREATE TYPE "MatchResult" AS ENUM ('WIN', 'LOSS', 'DRAW');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "steamId" TEXT,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "map" TEXT NOT NULL,
    "mode" "GameMode" NOT NULL,
    "result" "MatchResult" NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "headshots" INTEGER NOT NULL,
    "mvps" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "duration" INTEGER,
    "playedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalKills" INTEGER NOT NULL,
    "totalDeaths" INTEGER NOT NULL,
    "totalWins" INTEGER NOT NULL,
    "totalMatches" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "hsPercentage" DOUBLE PRECISION NOT NULL,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL,
    "rawData" JSONB NOT NULL,

    CONSTRAINT "SteamStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_steamId_key" ON "User"("steamId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Match_userId_idx" ON "Match"("userId");

-- CreateIndex
CREATE INDEX "Match_userId_playedAt_idx" ON "Match"("userId", "playedAt");

-- CreateIndex
CREATE INDEX "Match_userId_map_idx" ON "Match"("userId", "map");

-- CreateIndex
CREATE INDEX "Match_userId_mode_idx" ON "Match"("userId", "mode");

-- CreateIndex
CREATE UNIQUE INDEX "SteamStats_userId_key" ON "SteamStats"("userId");

-- CreateIndex
CREATE INDEX "SteamStats_userId_idx" ON "SteamStats"("userId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamStats" ADD CONSTRAINT "SteamStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
