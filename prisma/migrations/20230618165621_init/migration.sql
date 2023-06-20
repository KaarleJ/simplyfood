-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "ingredients" TEXT[],
    "equipment" TEXT[],
    "duration" INTEGER,
    "imgUrl" TEXT NOT NULL,
    "description" TEXT,
    "guide" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);
