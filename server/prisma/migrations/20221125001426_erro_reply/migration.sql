/*
  Warnings:

  - You are about to drop the column `replyToId` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "replyToId",
ADD COLUMN     "replyTo" TEXT;
