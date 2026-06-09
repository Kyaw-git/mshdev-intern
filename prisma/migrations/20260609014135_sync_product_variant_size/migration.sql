/*
  Warnings:

  - Added the required column `size` to the `product_variants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "size" TEXT NOT NULL;
