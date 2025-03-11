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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "portfolio_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_project_block" (
    "id" TEXT NOT NULL,
    "type" "BlockType" NOT NULL,
    "order" INTEGER NOT NULL,
    "config" JSONB,
    "content" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "portfolioProjectId" TEXT NOT NULL,

    CONSTRAINT "portfolio_project_block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_slug_key" ON "portfolio"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_project_portfolioId_projectId_key" ON "portfolio_project"("portfolioId", "projectId");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_project" ADD CONSTRAINT "portfolio_project_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_project" ADD CONSTRAINT "portfolio_project_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_project_block" ADD CONSTRAINT "portfolio_project_block_portfolioProjectId_fkey" FOREIGN KEY ("portfolioProjectId") REFERENCES "portfolio_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
