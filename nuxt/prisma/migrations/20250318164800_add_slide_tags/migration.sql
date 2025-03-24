-- AlterTable
ALTER TABLE "project_content_block" ADD COLUMN     "slideTagId" TEXT;

-- CreateTable
CREATE TABLE "slide_tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "slide_tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "slide_tag_name_userId_key" ON "slide_tag"("name", "userId");

-- AddForeignKey
ALTER TABLE "project_content_block" ADD CONSTRAINT "project_content_block_slideTagId_fkey" FOREIGN KEY ("slideTagId") REFERENCES "slide_tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slide_tag" ADD CONSTRAINT "slide_tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
