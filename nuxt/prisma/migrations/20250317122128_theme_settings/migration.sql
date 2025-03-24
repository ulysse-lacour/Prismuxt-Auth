-- CreateTable
CREATE TABLE "theme_settings" (
    "id" TEXT NOT NULL,
    "logoUrl" TEXT,
    "headingFont" TEXT,
    "bodyFont" TEXT,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "accentColor" TEXT,
    "secondaryColor" TEXT,
    "companyName" TEXT,
    "companyDescription" TEXT,
    "companyEmail" TEXT,
    "companyPhone" TEXT,
    "companyAddress" TEXT,
    "defaultLanguageId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "theme_settings_userId_key" ON "theme_settings"("userId");

-- AddForeignKey
ALTER TABLE "theme_settings" ADD CONSTRAINT "theme_settings_defaultLanguageId_fkey" FOREIGN KEY ("defaultLanguageId") REFERENCES "language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme_settings" ADD CONSTRAINT "theme_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
