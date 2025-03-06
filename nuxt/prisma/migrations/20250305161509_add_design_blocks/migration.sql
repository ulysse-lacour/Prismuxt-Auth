-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('HEADER', 'TEXT', 'IMAGE', 'QUOTE');

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "client" TEXT,
    "date" TEXT,
    "tags" TEXT[],
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "design_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_block" (
    "id" TEXT NOT NULL,
    "type" "BlockType" NOT NULL,
    "order" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "designId" TEXT NOT NULL,

    CONSTRAINT "design_block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "block_content" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "designBlockId" TEXT NOT NULL,

    CONSTRAINT "block_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_project" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,

    CONSTRAINT "portfolio_project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "block_content_designBlockId_key" ON "block_content"("designBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_slug_key" ON "portfolio"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_project_portfolioId_projectId_key" ON "portfolio_project"("portfolioId", "projectId");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "design_block" ADD CONSTRAINT "design_block_designId_fkey" FOREIGN KEY ("designId") REFERENCES "design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_content" ADD CONSTRAINT "block_content_designBlockId_fkey" FOREIGN KEY ("designBlockId") REFERENCES "design_block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_project" ADD CONSTRAINT "portfolio_project_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_project" ADD CONSTRAINT "portfolio_project_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_project" ADD CONSTRAINT "portfolio_project_designId_fkey" FOREIGN KEY ("designId") REFERENCES "design"("id") ON DELETE CASCADE ON UPDATE CASCADE;
