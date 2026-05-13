-- CreateEnum
CREATE TYPE "niche" AS ENUM ('CARS', 'GAMING', 'ANIME', 'SPORTS', 'GENERAL');

-- CreateEnum
CREATE TYPE "thumbnail_style" AS ENUM ('BRIGHT_ENERGETIC', 'MYSTERIOUS', 'COMEDIC', 'PROFESSIONAL');

-- CreateTable
CREATE TABLE "thumbnail_sets" (
    "id" TEXT NOT NULL,
    "kid_id" TEXT NOT NULL,
    "video_description" TEXT NOT NULL,
    "title_text" TEXT NOT NULL,
    "niche" "niche" NOT NULL,
    "style_preset" "thumbnail_style" NOT NULL,
    "prompt_version" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "thumbnail_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thumbnails" (
    "id" TEXT NOT NULL,
    "set_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "image_url" TEXT,
    "status" "visual_generation_status" NOT NULL DEFAULT 'PENDING',
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "thumbnails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "thumbnail_sets_kid_id_created_at_idx" ON "thumbnail_sets"("kid_id", "created_at");

-- CreateIndex
CREATE INDEX "thumbnails_set_id_idx" ON "thumbnails"("set_id");

-- CreateIndex
CREATE INDEX "thumbnails_set_id_selected_idx" ON "thumbnails"("set_id", "selected");

-- AddForeignKey
ALTER TABLE "thumbnail_sets" ADD CONSTRAINT "thumbnail_sets_kid_id_fkey" FOREIGN KEY ("kid_id") REFERENCES "kids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thumbnails" ADD CONSTRAINT "thumbnails_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "thumbnail_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
