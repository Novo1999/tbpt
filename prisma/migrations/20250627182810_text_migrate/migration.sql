-- CreateTable
CREATE TABLE "Text" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Text" ADD CONSTRAINT "Text_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
