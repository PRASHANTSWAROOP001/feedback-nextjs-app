-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('SENT', 'FAILED', 'PENDING');

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "inviteStatus" "InviteStatus" NOT NULL DEFAULT 'PENDING';
