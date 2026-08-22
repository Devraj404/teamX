import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cityData = [
  {
    cityName: "Paris",
    country: "France",
    region: "Europe",
    costIndex: "82.00",
    popularity: 98,
    activities: [
      { activityName: "Eiffel Tower Visit", type: "sightseeing", cost: "28.00", duration: 3, description: "Visit the Eiffel Tower and enjoy views across Paris." },
      { activityName: "Seine River Cruise", type: "sightseeing", cost: "18.00", duration: 2, description: "Take a sightseeing cruise along the Seine." },
      { activityName: "French Cooking Class", type: "food", cost: "75.00", duration: 3, description: "Learn classic French techniques with a local chef." },
    ],
  },
  {
    cityName: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    costIndex: "78.00",
    popularity: 94,
    activities: [
      { activityName: "Canal Boat Tour", type: "sightseeing", cost: "22.00", duration: 2, description: "Explore Amsterdam's historic canals by boat." },
      { activityName: "Van Gogh Museum", type: "sightseeing", cost: "25.00", duration: 3, description: "See the world's largest collection of Van Gogh works." },
      { activityName: "Bike Tour", type: "adventure", cost: "30.00", duration: 3, description: "Cycle through neighborhoods, parks, and canal paths." },
    ],
  },
  {
    cityName: "Rome",
    country: "Italy",
    region: "Europe",
    costIndex: "70.00",
    popularity: 97,
    activities: [
      { activityName: "Colosseum Tour", type: "sightseeing", cost: "32.00", duration: 3, description: "Discover the history of Rome's ancient amphitheater." },
      { activityName: "Pasta Making Workshop", type: "food", cost: "65.00", duration: 3, description: "Make fresh pasta alongside a Roman cook." },
      { activityName: "Vatican Museums", type: "sightseeing", cost: "28.00", duration: 3, description: "Visit the Vatican Museums and Sistine Chapel." },
    ],
  },
  {
    cityName: "Tokyo",
    country: "Japan",
    region: "Asia",
    costIndex: "76.00",
    popularity: 96,
    activities: [
      { activityName: "Tsukiji Food Walk", type: "food", cost: "45.00", duration: 3, description: "Sample fresh seafood and street food around Tsukiji." },
      { activityName: "Shibuya Crossing", type: "sightseeing", cost: "0.00", duration: 1, description: "Experience one of Tokyo's most famous landmarks." },
      { activityName: "Mount Fuji Day Trip", type: "adventure", cost: "90.00", duration: 10, description: "Take a full-day trip to the Fuji Five Lakes region." },
    ],
  },
  {
    cityName: "New York",
    country: "United States",
    region: "North America",
    costIndex: "91.00",
    popularity: 95,
    activities: [
      { activityName: "Central Park Walk", type: "sightseeing", cost: "0.00", duration: 2, description: "Walk through the iconic heart of Manhattan." },
      { activityName: "Broadway Show", type: "other", cost: "120.00", duration: 3, description: "See a live show in New York's theater district." },
      { activityName: "Brooklyn Food Tour", type: "food", cost: "85.00", duration: 4, description: "Taste local favorites across Brooklyn neighborhoods." },
    ],
  },
];

async function seedCity(city) {
  const existingCity = await prisma.city.findFirst({
    where: { cityName: city.cityName, country: city.country },
  });

  const savedCity = existingCity
    ? await prisma.city.update({
        where: { cityId: existingCity.cityId },
        data: {
          region: city.region,
          costIndex: city.costIndex,
          popularity: city.popularity,
        },
      })
    : await prisma.city.create({
        data: {
          cityName: city.cityName,
          country: city.country,
          region: city.region,
          costIndex: city.costIndex,
          popularity: city.popularity,
        },
      });

  for (const activity of city.activities) {
    const existingActivity = await prisma.activity.findFirst({
      where: { cityId: savedCity.cityId, activityName: activity.activityName },
    });

    if (existingActivity) {
      await prisma.activity.update({
        where: { activityId: existingActivity.activityId },
        data: activity,
      });
    } else {
      await prisma.activity.create({
        data: { ...activity, cityId: savedCity.cityId },
      });
    }
  }
}

try {
  for (const city of cityData) {
    await seedCity(city);
  }

  console.log(`Seeded ${cityData.length} cities and their activities.`);
} finally {
  await prisma.$disconnect();
}