-- DropIndex
DROP INDEX "Workspace_clerkId_idx";

-- CreateIndex
CREATE INDEX "Workspace_clerkId_id_idx" ON "Workspace"("clerkId", "id");
