-- CreateEnum
CREATE TYPE "script_length" AS ENUM ('SECS_30', 'SECS_60', 'MINS_2');

-- CreateEnum
CREATE TYPE "script_tone" AS ENUM ('EXCITED', 'EDUCATIONAL', 'FUNNY', 'CALM_EXPLAINER');

-- CreateTable
CREATE TABLE "scripts" (
    "id" TEXT NOT NULL,
    "kid_id" TEXT NOT NULL,
    "niche" "niche" NOT NULL,
    "topic" TEXT NOT NULL,
    "target_length" "script_length" NOT NULL,
    "tone" "script_tone" NOT NULL,
    "content_json" JSONB NOT NULL,
    "prompt_version" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scripts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scripts_kid_id_created_at_idx" ON "scripts"("kid_id", "created_at");

-- AddForeignKey
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_kid_id_fkey" FOREIGN KEY ("kid_id") REFERENCES "kids"("id") ON DELETE CASCADE ON UPDATE CASCADE;
