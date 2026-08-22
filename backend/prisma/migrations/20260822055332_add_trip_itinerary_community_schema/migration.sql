-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "cost_index" DECIMAL(5,2),
ADD COLUMN     "popularity" INTEGER;

-- CreateTable
CREATE TABLE "activities" (
    "activity_id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "activity_name" VARCHAR(200) NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "cost" DECIMAL(12,2),
    "duration" INTEGER,
    "description" TEXT,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("activity_id")
);

-- CreateTable
CREATE TABLE "trips" (
    "trip_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "trip_name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "cover_photo" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("trip_id")
);

-- CreateTable
CREATE TABLE "trip_sections" (
    "section_id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "city_id" INTEGER NOT NULL,
    "section_order" INTEGER NOT NULL,
    "description" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "budget" DECIMAL(12,2),

    CONSTRAINT "trip_sections_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "section_activities" (
    "section_activity_id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "activity_id" INTEGER,
    "activity_date" DATE,
    "activity_name" VARCHAR(200),
    "expense" DECIMAL(12,2),

    CONSTRAINT "section_activities_pkey" PRIMARY KEY ("section_activity_id")
);

-- CreateTable
CREATE TABLE "community_posts" (
    "post_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("post_id")
);

-- CreateIndex
CREATE INDEX "activities_city_id_idx" ON "activities"("city_id");

-- CreateIndex
CREATE INDEX "trips_user_id_idx" ON "trips"("user_id");

-- CreateIndex
CREATE INDEX "trip_sections_city_id_idx" ON "trip_sections"("city_id");

-- CreateIndex
CREATE UNIQUE INDEX "trip_sections_trip_id_section_order_key" ON "trip_sections"("trip_id", "section_order");

-- CreateIndex
CREATE INDEX "section_activities_section_id_idx" ON "section_activities"("section_id");

-- CreateIndex
CREATE INDEX "section_activities_activity_id_idx" ON "section_activities"("activity_id");

-- CreateIndex
CREATE INDEX "community_posts_user_id_idx" ON "community_posts"("user_id");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("city_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_sections" ADD CONSTRAINT "trip_sections_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("trip_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_sections" ADD CONSTRAINT "trip_sections_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("city_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_activities" ADD CONSTRAINT "section_activities_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "trip_sections"("section_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_activities" ADD CONSTRAINT "section_activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("activity_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
