-- CreateTable
CREATE TABLE "EmailUsage" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "sentCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EmailUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailUsage_workspaceId_key" ON "EmailUsage"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailUsage_workspaceId_month_key" ON "EmailUsage"("workspaceId", "month");

-- AddForeignKey
ALTER TABLE "EmailUsage" ADD CONSTRAINT "EmailUsage_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
