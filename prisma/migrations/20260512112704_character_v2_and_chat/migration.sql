/*
  Warnings:

  - Added the required column `personality_version` to the `characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vibe_description` to the `characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visual_style` to the `characters` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "visual_style" AS ENUM ('REALISTIC', 'CARTOON', 'ANIME', 'PIXEL');

-- CreateEnum
CREATE TYPE "visual_generation_status" AS ENUM ('PENDING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "chat_message_role" AS ENUM ('USER', 'CHARACTER');

-- AlterTable
ALTER TABLE "characters" ADD COLUMN     "personality_version" TEXT NOT NULL,
ADD COLUMN     "vibe_description" TEXT NOT NULL,
ADD COLUMN     "visual_generation_status" "visual_generation_status" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "visual_style" "visual_style" NOT NULL;

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "character_id" TEXT NOT NULL,
    "role" "chat_message_role" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_messages_character_id_created_at_idx" ON "chat_messages"("character_id", "created_at");

-- CreateIndex
CREATE INDEX "characters_kid_id_created_at_idx" ON "characters"("kid_id", "created_at");

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
