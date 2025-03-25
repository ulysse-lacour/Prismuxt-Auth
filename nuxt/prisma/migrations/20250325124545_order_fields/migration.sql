/*
  Warnings:

  - You are about to drop the column `color` on the `slide_tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "portfolio" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "slide_tag" DROP COLUMN "color";
