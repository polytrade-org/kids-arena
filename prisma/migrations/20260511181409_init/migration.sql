-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kids" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "age_range" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
    "kid_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "personality_json" JSONB NOT NULL,
    "visual_url" TEXT,
    "stats_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parents_email_key" ON "parents"("email");

-- CreateIndex
CREATE INDEX "kids_parent_id_idx" ON "kids"("parent_id");

-- CreateIndex
CREATE INDEX "characters_kid_id_idx" ON "characters"("kid_id");

-- AddForeignKey
ALTER TABLE "kids" ADD CONSTRAINT "kids_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_kid_id_fkey" FOREIGN KEY ("kid_id") REFERENCES "kids"("id") ON DELETE CASCADE ON UPDATE CASCADE;
