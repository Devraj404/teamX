-- CreateTable
CREATE TABLE "cities" (
    "city_id" SERIAL NOT NULL,
    "city_name" VARCHAR(150) NOT NULL,
    "country" VARCHAR(100),
    "region" VARCHAR(100),

    CONSTRAINT "cities_pkey" PRIMARY KEY ("city_id")
);
