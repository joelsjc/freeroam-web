DROP TABLE IF EXISTS "ServerVisit" CASCADE;
DROP TABLE IF EXISTS "Subscription" CASCADE;
DROP TABLE IF EXISTS "SaasPlan" CASCADE;
DROP TABLE IF EXISTS "WaitlistEmail" CASCADE;
DROP TABLE IF EXISTS "Rating" CASCADE;
DROP TABLE IF EXISTS "Server" CASCADE;
DROP TYPE IF EXISTS "GameStatus" CASCADE;

CREATE TYPE "GameStatus" AS ENUM ('GTA_V', 'GTA_6', 'BOTH');

CREATE TABLE "Server" ("id" TEXT NOT NULL, "slug" TEXT NOT NULL, "name" TEXT NOT NULL, "description" TEXT NOT NULL, "country" TEXT NOT NULL, "languages" TEXT[], "styles" TEXT[], "allowlist" BOOLEAN NOT NULL DEFAULT false, "featured" BOOLEAN NOT NULL DEFAULT false, "status" "GameStatus" NOT NULL DEFAULT 'GTA_V', "tags" TEXT[], "officialUrl" TEXT, "discordUrl" TEXT, "verified" BOOLEAN NOT NULL DEFAULT false, "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0, "ratingCount" INTEGER NOT NULL DEFAULT 0, "visitCount" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Server_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Rating" ("id" TEXT NOT NULL, "serverId" TEXT NOT NULL, "userId" TEXT, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "stars" INTEGER NOT NULL, "comment" TEXT, "approved" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Rating_pkey" PRIMARY KEY ("id"));
CREATE TABLE "WaitlistEmail" ("id" TEXT NOT NULL, "email" TEXT NOT NULL, "source" TEXT NOT NULL, "confirmed" BOOLEAN NOT NULL DEFAULT false, "confirmToken" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "WaitlistEmail_pkey" PRIMARY KEY ("id"));
CREATE TABLE "SaasPlan" ("id" TEXT NOT NULL, "code" TEXT NOT NULL, "tier" TEXT NOT NULL, "cycle" TEXT NOT NULL, "name" TEXT NOT NULL, "priceCents" INTEGER NOT NULL, "benefits" JSONB NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "SaasPlan_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Subscription" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "planCode" TEXT NOT NULL, "status" TEXT NOT NULL, "mpPreapprovalId" TEXT, "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "endsAt" TIMESTAMP(3), "autoRenew" BOOLEAN NOT NULL DEFAULT true, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id"));
CREATE TABLE "ServerVisit" ("id" TEXT NOT NULL, "serverId" TEXT NOT NULL, "event" TEXT NOT NULL, "referrer" TEXT, "userId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "ServerVisit_pkey" PRIMARY KEY ("id"));

CREATE UNIQUE INDEX "Server_slug_key" ON "Server"("slug");
CREATE INDEX "Server_status_featured_idx" ON "Server"("status", "featured");
CREATE INDEX "Server_ratingAvg_idx" ON "Server"("ratingAvg" DESC);
CREATE INDEX "Server_country_idx" ON "Server"("country");
CREATE INDEX "Rating_serverId_approved_idx" ON "Rating"("serverId", "approved");
CREATE UNIQUE INDEX "WaitlistEmail_email_key" ON "WaitlistEmail"("email");
CREATE INDEX "WaitlistEmail_source_confirmed_idx" ON "WaitlistEmail"("source", "confirmed");
CREATE UNIQUE INDEX "SaasPlan_code_key" ON "SaasPlan"("code");
CREATE UNIQUE INDEX "Subscription_mpPreapprovalId_key" ON "Subscription"("mpPreapprovalId");
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");
CREATE INDEX "ServerVisit_serverId_event_idx" ON "ServerVisit"("serverId", "event");

ALTER TABLE "Rating" ADD CONSTRAINT "Rating_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planCode_fkey" FOREIGN KEY ("planCode") REFERENCES "SaasPlan"("code") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ServerVisit" ADD CONSTRAINT "ServerVisit_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
