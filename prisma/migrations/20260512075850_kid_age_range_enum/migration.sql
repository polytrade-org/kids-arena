/*
  Warnings:

  - Changed the type of `age_range` on the `kids` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "age_range" AS ENUM ('AGES_8_10', 'AGES_11_12', 'AGES_13_14');

-- AlterTable
ALTER TABLE "kids" DROP COLUMN "age_range",
ADD COLUMN     "age_range" "age_range" NOT NULL;
