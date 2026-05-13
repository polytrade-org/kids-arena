-- AlterTable
ALTER TABLE "kids" ADD COLUMN     "spark_balance" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "battles" (
    "id" TEXT NOT NULL,
    "character_a_id" TEXT NOT NULL,
    "character_b_id" TEXT NOT NULL,
    "scenario_id" TEXT NOT NULL,
    "winner_id" TEXT NOT NULL,
    "outcome_narrative" TEXT NOT NULL,
    "spark_coins_awarded" INTEGER NOT NULL,
    "prompt_version" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "battles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "battles_character_a_id_idx" ON "battles"("character_a_id");

-- CreateIndex
CREATE INDEX "battles_character_b_id_idx" ON "battles"("character_b_id");

-- CreateIndex
CREATE INDEX "battles_winner_id_idx" ON "battles"("winner_id");

-- CreateIndex
CREATE INDEX "battles_created_at_idx" ON "battles"("created_at");

-- AddForeignKey
ALTER TABLE "battles" ADD CONSTRAINT "battles_character_a_id_fkey" FOREIGN KEY ("character_a_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battles" ADD CONSTRAINT "battles_character_b_id_fkey" FOREIGN KEY ("character_b_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battles" ADD CONSTRAINT "battles_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
