import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/password.js";

const prisma = new PrismaClient();

const data = [
  {
    state: "Rajasthan",
    cities: [
      { name: "Jaipur", costIndex: 3.5, popularity: 95, activities: [{ name: "Amber Fort Visit", type: "sightseeing", estimatedCost: 500, description: "Historic hilltop fort with palace courtyards and panoramic views." }, { name: "Hawa Mahal Tour", type: "sightseeing", estimatedCost: 200, description: "Visit Jaipur's iconic pink palace facade and old-city market area." }, { name: "Chokhi Dhani Cultural Dinner", type: "food", estimatedCost: 900, description: "Enjoy a traditional Rajasthani village-themed dinner and performances." }, { name: "Hot Air Balloon Ride", type: "adventure", estimatedCost: 8500, description: "Take a sunrise balloon ride over Jaipur's forts and countryside." }] },
      { name: "Udaipur", costIndex: 3.8, popularity: 90, activities: [{ name: "Lake Pichola Boat Ride", type: "sightseeing", estimatedCost: 600, description: "Take an evening boat ride with views of Udaipur's lakeside palaces." }, { name: "City Palace Tour", type: "sightseeing", estimatedCost: 300, description: "Explore the large palace complex overlooking Lake Pichola." }, { name: "Rooftop Dinner at Ambrai Ghat", type: "food", estimatedCost: 1200, description: "Enjoy lakeside dining with views of the City Palace." }] },
      { name: "Jodhpur", costIndex: 3.2, popularity: 82, activities: [{ name: "Mehrangarh Fort Visit", type: "sightseeing", estimatedCost: 400, description: "Explore one of India's largest forts above the Blue City." }, { name: "Blue City Walking Tour", type: "sightseeing", estimatedCost: 350, description: "Walk through the old blue-painted neighborhoods of Jodhpur." }, { name: "Desert Safari (Osian)", type: "adventure", estimatedCost: 2000, description: "Take a camel safari near the sand dunes of Osian." }] },
    ],
  },
  {
    state: "Kerala",
    cities: [
      { name: "Kochi", costIndex: 3.0, popularity: 85, activities: [{ name: "Fort Kochi Walking Tour", type: "sightseeing", estimatedCost: 300, description: "Explore colonial architecture, heritage streets, and Chinese fishing nets." }, { name: "Kathakali Dance Show", type: "other", estimatedCost: 400, description: "Watch Kerala's traditional dance-drama and elaborate costume performance." }, { name: "Seafood Trail", type: "food", estimatedCost: 700, description: "Taste fresh seafood and local coastal dishes around Fort Kochi." }] },
      { name: "Munnar", costIndex: 2.8, popularity: 88, activities: [{ name: "Tea Plantation Tour", type: "sightseeing", estimatedCost: 350, description: "Walk through Munnar's tea estates and learn about tea production." }, { name: "Eravikulam National Park Visit", type: "sightseeing", estimatedCost: 500, description: "Visit the wildlife sanctuary known for Nilgiri tahr and mountain scenery." }, { name: "Trekking at Top Station", type: "adventure", estimatedCost: 800, description: "Take a scenic trek with views across the Western Ghats valleys." }] },
      { name: "Alleppey", costIndex: 3.1, popularity: 90, activities: [{ name: "Houseboat Backwater Cruise", type: "sightseeing", estimatedCost: 4500, description: "Cruise Kerala's backwaters and stay overnight on a traditional houseboat." }, { name: "Village Canoe Tour", type: "adventure", estimatedCost: 600, description: "Paddle through narrow backwater canals and village waterways." }, { name: "Toddy and Local Cuisine Tasting", type: "food", estimatedCost: 500, description: "Try regional Kerala dishes at a traditional toddy shop." }] },
    ],
  },
  {
    state: "Goa",
    cities: [
      { name: "North Goa", costIndex: 3.6, popularity: 92, activities: [{ name: "Baga Beach Water Sports", type: "adventure", estimatedCost: 1500, description: "Try jet ski, parasailing, and banana boat rides at Baga Beach." }, { name: "Anjuna Flea Market Visit", type: "sightseeing", estimatedCost: 0, description: "Browse the famous flea market and local craft stalls." }, { name: "Beach Shack Dinner", type: "food", estimatedCost: 1000, description: "Enjoy a seafood dinner at a seasonal beach shack." }] },
      { name: "South Goa", costIndex: 3.4, popularity: 80, activities: [{ name: "Palolem Beach Kayaking", type: "adventure", estimatedCost: 700, description: "Kayak through the calm waters of Palolem Bay." }, { name: "Cabo de Rama Fort Visit", type: "sightseeing", estimatedCost: 100, description: "Visit the cliffside fort and its ocean viewpoints." }] },
      { name: "Panaji", costIndex: 3.3, popularity: 75, activities: [{ name: "Fontainhas Latin Quarter Walk", type: "sightseeing", estimatedCost: 200, description: "Walk through Panaji's colorful Portuguese-era streets." }, { name: "Mandovi River Cruise", type: "sightseeing", estimatedCost: 600, description: "Take an evening cruise on the Mandovi River with live music." }] },
    ],
  },
  {
    state: "Maharashtra",
    cities: [
      { name: "Mumbai", costIndex: 4.5, popularity: 96, activities: [{ name: "Gateway of India and Colaba Walk", type: "sightseeing", estimatedCost: 0, description: "Visit Mumbai's iconic waterfront monument and nearby market streets." }, { name: "Elephanta Caves Ferry Tour", type: "sightseeing", estimatedCost: 1200, description: "Take a ferry to the ancient rock-cut caves on Elephanta Island." }, { name: "Street Food Trail (Mohammed Ali Road)", type: "food", estimatedCost: 500, description: "Taste famous Mumbai street food around Mohammed Ali Road." }] },
      { name: "Pune", costIndex: 3.2, popularity: 78, activities: [{ name: "Shaniwar Wada Fort Visit", type: "sightseeing", estimatedCost: 250, description: "Explore the historic Peshwa-era fortification in central Pune." }, { name: "Sinhagad Fort Trek", type: "adventure", estimatedCost: 300, description: "Hike to the popular hill fort and enjoy views near Pune." }] },
      { name: "Lonavala", costIndex: 3.0, popularity: 83, activities: [{ name: "Tiger's Point Sunrise Trek", type: "adventure", estimatedCost: 400, description: "Take a scenic trek to a well-known Lonavala viewpoint." }, { name: "Bhushi Dam Visit", type: "sightseeing", estimatedCost: 100, description: "Visit the popular monsoon waterfall and picnic spot." }, { name: "Local Chikki Tasting Tour", type: "food", estimatedCost: 200, description: "Taste Lonavala's famous nut-and-jaggery chikki sweet." }] },
    ],
  },
  {
    state: "Gujarat",
    cities: [
      { name: "Ahmedabad", costIndex: 2.8, popularity: 88, activities: [{ name: "Sabarmati Ashram", type: "sightseeing", estimatedCost: 0, description: "Visit Gandhi's former riverside residence and museum." }, { name: "Ahmedabad Heritage Walk", type: "sightseeing", estimatedCost: 500, description: "Explore historic pols, monuments, and old-city architecture." }, { name: "Manek Chowk Night Food Walk", type: "food", estimatedCost: 400, description: "Taste Gujarati street food and late-night snacks at Manek Chowk." }, { name: "Adalaj Ni Vav Excursion", type: "sightseeing", estimatedCost: 200, description: "Visit the intricately carved stepwell near Ahmedabad." }] },
      { name: "Surat", costIndex: 2.7, popularity: 78, activities: [{ name: "Surat Food Trail", type: "food", estimatedCost: 350, description: "Try locho, ghari, farsan, and other local Surat specialties." }, { name: "Dumas Beach Sunset", type: "sightseeing", estimatedCost: 0, description: "Enjoy an evening visit to Surat's popular coastal beach." }, { name: "Dutch Garden Visit", type: "sightseeing", estimatedCost: 0, description: "Explore Surat's historic cemetery garden and colonial heritage." }] },
      { name: "Vadodara", costIndex: 2.6, popularity: 80, activities: [{ name: "Laxmi Vilas Palace", type: "sightseeing", estimatedCost: 250, description: "Tour Vadodara's grand palace and royal collection." }, { name: "Sayaji Garden Walk", type: "sightseeing", estimatedCost: 50, description: "Walk through the historic public garden in central Vadodara." }, { name: "Gujarati Thali Experience", type: "food", estimatedCost: 500, description: "Enjoy a traditional Gujarati thali with regional dishes." }] },
    ],
  },
  {
    state: "Delhi",
    cities: [
      { name: "Delhi", costIndex: 3.0, popularity: 96, activities: [{ name: "Red Fort Visit", type: "sightseeing", estimatedCost: 500, description: "Explore the Mughal-era Red Fort in Old Delhi." }, { name: "Humayun's Tomb", type: "sightseeing", estimatedCost: 500, description: "Visit the Mughal garden tomb and its surrounding grounds." }, { name: "India Gate Evening Walk", type: "sightseeing", estimatedCost: 0, description: "See the landmark war memorial and surrounding boulevard." }, { name: "Old Delhi Food Walk", type: "food", estimatedCost: 900, description: "Taste street food and traditional dishes in Old Delhi." }] },
    ],
  },
];

async function main() {
  let cityCount = 0;
  let activityCount = 0;

  for (const stateGroup of data) {
    for (const cityData of stateGroup.cities) {
      const existingCity = await prisma.city.findFirst({
        where: { cityName: cityData.name, country: "India" },
      });
      const city = existingCity
        ? await prisma.city.update({
            where: { cityId: existingCity.cityId },
            data: {
              region: stateGroup.state,
              costIndex: cityData.costIndex,
              popularity: cityData.popularity,
            },
          })
        : await prisma.city.create({
            data: {
              cityName: cityData.name,
              region: stateGroup.state,
              country: "India",
              costIndex: cityData.costIndex,
              popularity: cityData.popularity,
            },
          });
      cityCount += 1;

      for (const activity of cityData.activities) {
        const existingActivity = await prisma.activity.findFirst({
          where: { cityId: city.cityId, activityName: activity.name },
        });
        const activityData = {
          activityName: activity.name,
          type: activity.type,
          cost: activity.estimatedCost,
          description: activity.description,
          cityId: city.cityId,
        };
        if (existingActivity) {
          await prisma.activity.update({ where: { activityId: existingActivity.activityId }, data: activityData });
        } else {
          await prisma.activity.create({ data: activityData });
        }
        activityCount += 1;
      }
    }
  }

  // Seed Demo Users
  const hashedPassword = await hashPassword("travel123");
  const usersData = [
    {
      username: "aanya",
      password: hashedPassword,
      email: "aanya@example.com",
      firstName: "Aanya",
      lastName: "Sharma",
      city: "Mumbai",
      country: "India",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
    {
      username: "rohan",
      password: hashedPassword,
      email: "rohan@example.com",
      firstName: "Rohan",
      lastName: "Verma",
      city: "Delhi",
      country: "India",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    {
      username: "priya",
      password: hashedPassword,
      email: "priya@example.com",
      firstName: "Priya",
      lastName: "Patel",
      city: "Ahmedabad",
      country: "India",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const existing = await prisma.user.findUnique({ where: { username: u.username } });
    if (existing) {
      createdUsers.push(existing);
    } else {
      const user = await prisma.user.create({ data: u });
      createdUsers.push(user);
    }
  }

  const aanya = createdUsers[0];
  const rohan = createdUsers[1];
  const priya = createdUsers[2];

  // Fetch some cities for trip sections
  const delhi = await prisma.city.findFirst({ where: { cityName: "Delhi" } });
  const jaipur = await prisma.city.findFirst({ where: { cityName: "Jaipur" } });
  const udaipur = await prisma.city.findFirst({ where: { cityName: "Udaipur" } });
  const kochi = await prisma.city.findFirst({ where: { cityName: "Kochi" } });
  const munnar = await prisma.city.findFirst({ where: { cityName: "Munnar" } });
  const alleppey = await prisma.city.findFirst({ where: { cityName: "Alleppey" } });
  const mumbai = await prisma.city.findFirst({ where: { cityName: "Mumbai" } });
  const lonavala = await prisma.city.findFirst({ where: { cityName: "Lonavala" } });

  // Seed Sample Trips for Aanya
  if (aanya && delhi && jaipur && udaipur) {
    const trip1Existing = await prisma.trip.findFirst({ where: { userId: aanya.userId, tripName: "Golden Triangle Expedition" } });
    if (!trip1Existing) {
      const trip1 = await prisma.trip.create({
        data: {
          userId: aanya.userId,
          tripName: "Golden Triangle Expedition",
          description: "A 2-week heritage adventure exploring Delhi, Jaipur, and Udaipur.",
          startDate: new Date("2026-09-05"),
          endDate: new Date("2026-09-18"),
          coverPhoto: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
          isPublic: true,
        },
      });

      await prisma.tripSection.createMany({
        data: [
          {
            tripId: trip1.tripId,
            cityId: delhi.cityId,
            sectionOrder: 1,
            description: "Old Delhi Heritage & Red Fort Tour",
            startDate: new Date("2026-09-05"),
            endDate: new Date("2026-09-09"),
            budget: 500,
          },
          {
            tripId: trip1.tripId,
            cityId: jaipur.cityId,
            sectionOrder: 2,
            description: "Pink City, Amber Fort & Chokhi Dhani",
            startDate: new Date("2026-09-09"),
            endDate: new Date("2026-09-14"),
            budget: 800,
          },
          {
            tripId: trip1.tripId,
            cityId: udaipur.cityId,
            sectionOrder: 3,
            description: "Lakeside Relaxation & City Palace",
            startDate: new Date("2026-09-14"),
            endDate: new Date("2026-09-18"),
            budget: 600,
          },
        ],
      });
    }
  }

  if (aanya && kochi && munnar && alleppey) {
    const trip2Existing = await prisma.trip.findFirst({ where: { userId: aanya.userId, tripName: "Kerala Backwaters & Hills" } });
    if (!trip2Existing) {
      const trip2 = await prisma.trip.create({
        data: {
          userId: aanya.userId,
          tripName: "Kerala Backwaters & Hills",
          description: "Relaxing tropical tour with tea gardens and houseboat stay.",
          startDate: new Date("2026-10-01"),
          endDate: new Date("2026-10-10"),
          coverPhoto: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
          isPublic: true,
        },
      });

      await prisma.tripSection.createMany({
        data: [
          {
            tripId: trip2.tripId,
            cityId: kochi.cityId,
            sectionOrder: 1,
            description: "Fort Kochi, spice markets & Kathakali show",
            startDate: new Date("2026-10-01"),
            endDate: new Date("2026-10-04"),
            budget: 400,
          },
          {
            tripId: trip2.tripId,
            cityId: munnar.cityId,
            sectionOrder: 2,
            description: "Munnar Tea Plantations & Eravikulam Trek",
            startDate: new Date("2026-10-04"),
            endDate: new Date("2026-10-07"),
            budget: 500,
          },
          {
            tripId: trip2.tripId,
            cityId: alleppey.cityId,
            sectionOrder: 3,
            description: "Alleppey backwater houseboat cruise",
            startDate: new Date("2026-10-07"),
            endDate: new Date("2026-10-10"),
            budget: 700,
          },
        ],
      });
    }
  }

  if (aanya && mumbai && lonavala) {
    const trip3Existing = await prisma.trip.findFirst({ where: { userId: aanya.userId, tripName: "Monsoon Escape to Lonavala" } });
    if (!trip3Existing) {
      const trip3 = await prisma.trip.create({
        data: {
          userId: aanya.userId,
          tripName: "Monsoon Escape to Lonavala",
          description: "Quick monsoon weekend trip starting from Mumbai.",
          startDate: new Date("2026-08-10"),
          endDate: new Date("2026-08-18"),
          coverPhoto: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
          isPublic: true,
        },
      });

      await prisma.tripSection.createMany({
        data: [
          {
            tripId: trip3.tripId,
            cityId: mumbai.cityId,
            sectionOrder: 1,
            description: "Colaba walk & Marine Drive sunset",
            startDate: new Date("2026-08-10"),
            endDate: new Date("2026-08-14"),
            budget: 450,
          },
          {
            tripId: trip3.tripId,
            cityId: lonavala.cityId,
            sectionOrder: 2,
            description: "Tiger's Point trek & Bhushi Dam monsoon waterfalls",
            startDate: new Date("2026-08-14"),
            endDate: new Date("2026-08-18"),
            budget: 350,
          },
        ],
      });
    }
  }

  // Seed Community Posts
  const existingPosts = await prisma.communityPost.count();
  if (existingPosts === 0 && aanya && rohan && priya) {
    await prisma.communityPost.createMany({
      data: [
        {
          userId: aanya.userId,
          content: "Just finalized our September itinerary across Delhi, Jaipur, and Udaipur! Excited for the sunrise hot air balloon over Amber Fort 🎈",
        },
        {
          userId: rohan.userId,
          content: "If you're visiting Alleppey, don't skip the night backwater houseboat cruise. Fresh Karimeen fry on board is unforgettable 🐟",
        },
        {
          userId: priya.userId,
          content: "Quick weekend trip to Lonavala during monsoons. Bhushi dam and Tiger's point fog was stunning! 🌧️⛰️",
        },
        {
          userId: rohan.userId,
          content: "Old Delhi street food recommendation: Rabri Paratha in Chandni Chowk and Jalebi at Dariba Kalan! 😋",
        },
      ],
    });
  }

  console.log(`Seed complete: ${cityCount} Indian cities, ${activityCount} catalog activities, demo users, sample trips with section dates, and community posts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
