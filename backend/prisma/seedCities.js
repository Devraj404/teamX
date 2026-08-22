import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/password.js";

const prisma = new PrismaClient();

const data = [
  {
    state: "Rajasthan",
    cities: [
      {
        name: "Jaipur",
        costIndex: 3.5,
        popularity: 95,
        activities: [
          { name: "Amber Fort Sunrise Visit", type: "sightseeing", estimatedCost: 500, duration: 3, description: "Historic hilltop fort with royal palace courtyards and sweeping views of Maota Lake." },
          { name: "Hawa Mahal & Old City Walk", type: "sightseeing", estimatedCost: 200, duration: 2, description: "Explore the pink sandstone honeycomb facade and vibrant bazaar lanes." },
          { name: "Chokhi Dhani Rajasthani Dinner", type: "food", estimatedCost: 950, duration: 3, description: "Authentic Rajasthani village-style thali dinner with folk dance & music." },
          { name: "Sunrise Hot Air Balloon Ride", type: "adventure", estimatedCost: 8500, duration: 4, description: "Float gracefully above Jaipur's ancient palaces, hills, and forts." },
        ],
      },
      {
        name: "Udaipur",
        costIndex: 3.8,
        popularity: 92,
        activities: [
          { name: "Lake Pichola Sunset Boat Cruise", type: "sightseeing", estimatedCost: 650, duration: 2, description: "Golden hour boat cruise with views of Jag Mandir and City Palace." },
          { name: "City Palace Heritage Tour", type: "sightseeing", estimatedCost: 350, duration: 3, description: "Explore the grand marble and granite palace complex overlooking the lake." },
          { name: "Rooftop Dining at Ambrai Ghat", type: "food", estimatedCost: 1200, duration: 2, description: "Lakeside candlelight dinner with unobstructed views of the illuminated palace." },
        ],
      },
      {
        name: "Jodhpur",
        costIndex: 3.2,
        popularity: 86,
        activities: [
          { name: "Mehrangarh Fort Excursion", type: "sightseeing", estimatedCost: 450, duration: 3, description: "Towering cliffside fortress offering panoramic views over the Blue City." },
          { name: "Blue City Heritage Alley Walk", type: "sightseeing", estimatedCost: 300, duration: 2, description: "Guided walk through indigo-painted Brahmin homes and narrow alleys." },
          { name: "Osian Desert Camel Safari", type: "adventure", estimatedCost: 2200, duration: 5, description: "Sunset camel ride across the Thar sand dunes with folk campfire performance." },
        ],
      },
    ],
  },
  {
    state: "Kerala",
    cities: [
      {
        name: "Kochi",
        costIndex: 3.0,
        popularity: 88,
        activities: [
          { name: "Fort Kochi & Chinese Nets Walk", type: "sightseeing", estimatedCost: 300, duration: 2, description: "Stroll along historic colonial streets, art cafes, and iconic fishing nets." },
          { name: "Kathakali Evening Dance Show", type: "culture", estimatedCost: 450, duration: 2, description: "Classical Kerala dance drama featuring elaborate facial makeup and storytelling." },
          { name: "Malabar Seafood Tasting Trail", type: "food", estimatedCost: 750, duration: 3, description: "Savor fresh Karimeen fish curry, crab roast, and coconut appams." },
        ],
      },
      {
        name: "Munnar",
        costIndex: 2.9,
        popularity: 90,
        activities: [
          { name: "Tea Estate & Museum Walk", type: "nature", estimatedCost: 350, duration: 3, description: "Walk through lush green tea slopes and sample fresh artisanal tea blends." },
          { name: "Eravikulam National Park Safari", type: "nature", estimatedCost: 500, duration: 4, description: "Spot the endangered Nilgiri Tahr against mist-covered mountain peaks." },
          { name: "Top Station Ridge Trek", type: "adventure", estimatedCost: 850, duration: 4, description: "Hike along high-altitude mountain trails bordering Tamil Nadu." },
        ],
      },
      {
        name: "Alleppey",
        costIndex: 3.3,
        popularity: 94,
        activities: [
          { name: "Luxury Houseboat Backwater Cruise", type: "nature", estimatedCost: 5500, duration: 6, description: "Glide through tranquil palm-fringed canals with freshly cooked onboard meals." },
          { name: "Shikara Boat Village Canal Tour", type: "nature", estimatedCost: 700, duration: 2, description: "Explore narrow interior waterways inaccessible to larger houseboats." },
          { name: "Backwater Toddy & Fish Curry Feast", type: "food", estimatedCost: 550, duration: 2, description: "Authentic coastal dining at traditional backwater eateries." },
        ],
      },
    ],
  },
  {
    state: "Goa",
    cities: [
      {
        name: "North Goa",
        costIndex: 3.6,
        popularity: 95,
        activities: [
          { name: "Baga & Calangute Water Sports", type: "adventure", estimatedCost: 1800, duration: 3, description: "Thrilling parasailing, jet-skiing, and banana boat rides along Baga Beach." },
          { name: "Anjuna Flea Market & Sunset", type: "sightseeing", estimatedCost: 0, duration: 2, description: "Browse bohemian crafts, jewelry, and beachside acoustic music." },
          { name: "Beach Shack Seafood Grill", type: "food", estimatedCost: 1100, duration: 2, description: "Dine on grilled butter garlic prawns and Goan fish curry under palm trees." },
        ],
      },
      {
        name: "South Goa",
        costIndex: 3.4,
        popularity: 84,
        activities: [
          { name: "Palolem Bay Kayaking", type: "adventure", estimatedCost: 750, duration: 2, description: "Paddle around the serene crescent bay and nearby Butterfly Beach." },
          { name: "Cabo de Rama Fort Viewpoint", type: "sightseeing", estimatedCost: 100, duration: 2, description: "Historic Portuguese cliffside ruins overlooking the Arabian Sea." },
        ],
      },
      {
        name: "Panaji",
        costIndex: 3.3,
        popularity: 80,
        activities: [
          { name: "Fontainhas Latin Quarter Heritage Walk", type: "culture", estimatedCost: 250, duration: 2, description: "Wander past bright yellow and blue Portuguese heritage villas." },
          { name: "Mandovi River Sunset Cruise", type: "sightseeing", estimatedCost: 650, duration: 2, description: "Evening river cruise featuring traditional Goan dance and music." },
        ],
      },
    ],
  },
  {
    state: "Maharashtra",
    cities: [
      {
        name: "Mumbai",
        costIndex: 4.5,
        popularity: 96,
        activities: [
          { name: "Gateway of India & Marine Drive Promenade", type: "sightseeing", estimatedCost: 0, duration: 3, description: "Walk along Mumbai's iconic waterfront and watch the sunset at Queen's Necklace." },
          { name: "Elephanta Caves Ferry Tour", type: "culture", estimatedCost: 1200, duration: 5, description: "Ferry trip across Mumbai harbor to ancient UNESCO rock-cut cave temples." },
          { name: "Mohammed Ali Road Street Food Trail", type: "food", estimatedCost: 550, duration: 2, description: "Sample famous kebabs, shawarmas, and seasonal sweets." },
        ],
      },
      {
        name: "Pune",
        costIndex: 3.2,
        popularity: 80,
        activities: [
          { name: "Shaniwar Wada Fort Tour", type: "culture", estimatedCost: 250, duration: 2, description: "Explore the Peshwa-era palace fortress in the heart of old Pune." },
          { name: "Sinhagad Fort Monsoon Trek", type: "adventure", estimatedCost: 350, duration: 4, description: "Scenic hill fort hike with fresh pitla bhakri at the summit." },
        ],
      },
      {
        name: "Lonavala",
        costIndex: 3.0,
        popularity: 85,
        activities: [
          { name: "Tiger's Point Sunrise Ridge Trek", type: "adventure", estimatedCost: 400, duration: 3, description: "Breathtaking cliffside viewpoint surrounded by mist and valleys." },
          { name: "Bhushi Dam & Waterfall Dip", type: "nature", estimatedCost: 100, duration: 2, description: "Popular monsoon spot with cascading stepped waterfalls." },
          { name: "Authentic Lonavala Chikki Tasting", type: "food", estimatedCost: 250, duration: 1, description: "Sample handmade jaggery nut chikkis and fudge." },
        ],
      },
    ],
  },
  {
    state: "Gujarat",
    cities: [
      {
        name: "Ahmedabad",
        costIndex: 2.8,
        popularity: 88,
        activities: [
          { name: "Sabarmati Ashram & Riverfront Walk", type: "culture", estimatedCost: 0, duration: 2, description: "Peaceful sanctuary museum dedicated to Mahatma Gandhi along Sabarmati river." },
          { name: "Heritage Pols Old City Walk", type: "culture", estimatedCost: 500, duration: 3, description: "Guided tour through wooden carved birdfeeders and historic pol neighborhoods." },
          { name: "Manek Chowk Night Food Market", type: "food", estimatedCost: 450, duration: 2, description: "Bustling late-night food plaza famous for cheese pineapple sandwiches and kulfi." },
          { name: "Adalaj Ni Vav Stepwell Visit", type: "sightseeing", estimatedCost: 200, duration: 2, description: "Magnificent 5-storey subterranean stepwell with intricate carvings." },
        ],
      },
      {
        name: "Surat",
        costIndex: 2.7,
        popularity: 78,
        activities: [
          { name: "Surat Street Food & Farsan Trail", type: "food", estimatedCost: 350, duration: 2, description: "Taste fresh Surat Locho, Ghari, and Ponk specialties." },
          { name: "Dumas Beach Sunset Walk", type: "sightseeing", estimatedCost: 0, duration: 2, description: "Relaxing coastal breeze and black sand beach promenade." },
        ],
      },
      {
        name: "Vadodara",
        costIndex: 2.6,
        popularity: 82,
        activities: [
          { name: "Laxmi Vilas Palace Royal Tour", type: "culture", estimatedCost: 300, duration: 3, description: "Grand Indo-Saracenic palace 4x larger than Buckingham Palace." },
          { name: "Traditional Kathiyawadi Thali", type: "food", estimatedCost: 500, duration: 2, description: "Hearty Gujarati thali with ringan ravaiya, bajra rotla, and jaggery." },
        ],
      },
    ],
  },
  {
    state: "Delhi",
    cities: [
      {
        name: "Delhi",
        costIndex: 3.0,
        popularity: 96,
        activities: [
          { name: "Red Fort & Chandni Chowk Rikshaw Tour", type: "sightseeing", estimatedCost: 550, duration: 3, description: "Mughal empire fortress and bustling heritage market streets." },
          { name: "Humayun's Tomb Garden Walk", type: "culture", estimatedCost: 500, duration: 2, description: "Stunning Persian-style garden tomb that inspired the Taj Mahal." },
          { name: "Old Delhi Paranthe Wali Gali Feast", type: "food", estimatedCost: 400, duration: 2, description: "Historic lane serving stuffed parathas with sweet rabri." },
        ],
      },
    ],
  },
];

async function main() {
  console.log("Purging all existing database records...");
  await prisma.sectionActivity.deleteMany();
  await prisma.tripSection.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database successfully cleared.");

  const hashedPassword = await hashPassword("travel123");

  const usersData = [
    {
      username: "aanya",
      password: hashedPassword,
      email: "aanya@example.com",
      firstName: "Aanya",
      lastName: "Sharma",
      city: "Jaipur",
      country: "India",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
    {
      username: "rohan",
      password: hashedPassword,
      email: "rohan@example.com",
      firstName: "Rohan",
      lastName: "Verma",
      city: "Delhi",
      country: "India",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
    {
      username: "priya",
      password: hashedPassword,
      email: "priya@example.com",
      firstName: "Priya",
      lastName: "Patel",
      city: "Ahmedabad",
      country: "India",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
    {
      username: "dev",
      password: hashedPassword,
      email: "dev@example.com",
      firstName: "Dev",
      lastName: "Malhotra",
      city: "Mumbai",
      country: "India",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    },
    {
      username: "admin",
      password: await hashPassword("admin123"),
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      city: "Mumbai",
      country: "India",
      photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.create({ data: u });
    createdUsers.push(user);
  }

  let cityCount = 0;
  let activityCount = 0;

  for (const group of data) {
    for (const cityInfo of group.cities) {
      const city = await prisma.city.create({
        data: {
          cityName: cityInfo.name,
          country: "India",
          region: group.state,
          costIndex: cityInfo.costIndex,
          popularity: cityInfo.popularity,
        },
      });
      cityCount += 1;

      for (const act of cityInfo.activities) {
        await prisma.activity.create({
          data: {
            cityId: city.cityId,
            activityName: act.name,
            type: act.type,
            cost: act.estimatedCost,
            duration: act.duration,
            description: act.description,
          },
        });
        activityCount += 1;
      }
    }
  }

  const delhi = await prisma.city.findFirst({ where: { cityName: "Delhi" } });
  const jaipur = await prisma.city.findFirst({ where: { cityName: "Jaipur" } });
  const udaipur = await prisma.city.findFirst({ where: { cityName: "Udaipur" } });
  const kochi = await prisma.city.findFirst({ where: { cityName: "Kochi" } });
  const munnar = await prisma.city.findFirst({ where: { cityName: "Munnar" } });
  const alleppey = await prisma.city.findFirst({ where: { cityName: "Alleppey" } });
  const mumbai = await prisma.city.findFirst({ where: { cityName: "Mumbai" } });
  const lonavala = await prisma.city.findFirst({ where: { cityName: "Lonavala" } });
  const ahmedabad = await prisma.city.findFirst({ where: { cityName: "Ahmedabad" } });
  const vadodara = await prisma.city.findFirst({ where: { cityName: "Vadodara" } });
  const panaji = await prisma.city.findFirst({ where: { cityName: "Panaji" } });
  const northGoa = await prisma.city.findFirst({ where: { cityName: "North Goa" } });

  let tripTotalCount = 0;

  // Seed 3 Multi-City Trips for EVERY user (aanya, rohan, priya, dev, admin)
  for (const user of createdUsers) {
    // 1. Monsoon Escape in Lonavala & Mumbai (ONGOING - covers today 2026-08-22)
    if (mumbai && lonavala) {
      const trip1 = await prisma.trip.create({
        data: {
          userId: user.userId,
          tripName: "Monsoon Escape in Lonavala & Mumbai",
          description: "Quick monsoon getaway starting from Mumbai waterfront to misty Lonavala waterfalls.",
          startDate: new Date("2026-08-20"),
          endDate: new Date("2026-08-26"),
          coverPhoto: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
          isPublic: true,
        },
      });
      tripTotalCount += 1;

      const s1 = await prisma.tripSection.create({
        data: {
          tripId: trip1.tripId,
          cityId: mumbai.cityId,
          sectionOrder: 1,
          description: "Marine Drive walk & Street Food Trail",
          startDate: new Date("2026-08-20"),
          endDate: new Date("2026-08-23"),
          budget: 1200,
        },
      });

      const s2 = await prisma.tripSection.create({
        data: {
          tripId: trip1.tripId,
          cityId: lonavala.cityId,
          sectionOrder: 2,
          description: "Tiger's Point sunrise trek & Bhushi Dam waterfalls",
          startDate: new Date("2026-08-23"),
          endDate: new Date("2026-08-26"),
          budget: 900,
        },
      });

      const actLonavala = await prisma.activity.findFirst({ where: { cityId: lonavala.cityId } });
      if (actLonavala) {
        await prisma.sectionActivity.create({
          data: {
            sectionId: s2.sectionId,
            activityId: actLonavala.activityId,
            activityName: actLonavala.activityName,
            expense: actLonavala.cost,
            expenseCategory: "activities",
            activityDate: new Date("2026-08-24"),
          },
        });
      }
    }

    // 2. Golden Triangle Expedition (UPCOMING - Sept 2026)
    if (delhi && jaipur && udaipur) {
      const trip2 = await prisma.trip.create({
        data: {
          userId: user.userId,
          tripName: "Golden Triangle Expedition",
          description: "A 2-week heritage adventure exploring Delhi, Jaipur, and Udaipur.",
          startDate: new Date("2026-09-05"),
          endDate: new Date("2026-09-18"),
          coverPhoto: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
          isPublic: true,
        },
      });
      tripTotalCount += 1;

      const s1 = await prisma.tripSection.create({
        data: {
          tripId: trip2.tripId,
          cityId: delhi.cityId,
          sectionOrder: 1,
          description: "Old Delhi Heritage & Red Fort Tour",
          startDate: new Date("2026-09-05"),
          endDate: new Date("2026-09-09"),
          budget: 1500,
        },
      });

      const s2 = await prisma.tripSection.create({
        data: {
          tripId: trip2.tripId,
          cityId: jaipur.cityId,
          sectionOrder: 2,
          description: "Pink City, Amber Fort & Chokhi Dhani",
          startDate: new Date("2026-09-09"),
          endDate: new Date("2026-09-14"),
          budget: 2200,
        },
      });

      const actJaipur = await prisma.activity.findFirst({ where: { cityId: jaipur.cityId, activityName: { contains: "Amber Fort" } } });
      if (actJaipur) {
        await prisma.sectionActivity.create({
          data: {
            sectionId: s2.sectionId,
            activityId: actJaipur.activityId,
            activityName: actJaipur.activityName,
            expense: actJaipur.cost,
            expenseCategory: "activities",
            activityDate: new Date("2026-09-10"),
          },
        });
      }
    }

    // 3. Kerala Backwaters & Tea Gardens (UPCOMING - Oct 2026)
    if (kochi && munnar && alleppey) {
      const trip3 = await prisma.trip.create({
        data: {
          userId: user.userId,
          tripName: "Kerala Backwaters & Tea Gardens",
          description: "Relaxing tropical tour with tea estates and luxury houseboat stay.",
          startDate: new Date("2026-10-01"),
          endDate: new Date("2026-10-10"),
          coverPhoto: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
          isPublic: true,
        },
      });
      tripTotalCount += 1;

      await prisma.tripSection.createMany({
        data: [
          {
            tripId: trip3.tripId,
            cityId: kochi.cityId,
            sectionOrder: 1,
            description: "Fort Kochi, spice markets & Kathakali show",
            startDate: new Date("2026-10-01"),
            endDate: new Date("2026-10-04"),
            budget: 1100,
          },
          {
            tripId: trip3.tripId,
            cityId: munnar.cityId,
            sectionOrder: 2,
            description: "Munnar Tea Plantations & Eravikulam Trek",
            startDate: new Date("2026-10-04"),
            endDate: new Date("2026-10-07"),
            budget: 1400,
          },
          {
            tripId: trip3.tripId,
            cityId: alleppey.cityId,
            sectionOrder: 3,
            description: "Alleppey backwater houseboat cruise",
            startDate: new Date("2026-10-07"),
            endDate: new Date("2026-10-10"),
            budget: 2500,
          },
        ],
      });
    }

    // 4. Goa Coastal & Heritage Trail (COMPLETED - Jan 2026)
    if (panaji && northGoa) {
      const trip4 = await prisma.trip.create({
        data: {
          userId: user.userId,
          tripName: "Goa Coastal & Heritage Trail",
          description: "Latin Quarter villas, beach shacks, and water sports adventure.",
          startDate: new Date("2026-01-10"),
          endDate: new Date("2026-01-18"),
          coverPhoto: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
          isPublic: true,
        },
      });
      tripTotalCount += 1;

      await prisma.tripSection.createMany({
        data: [
          {
            tripId: trip4.tripId,
            cityId: panaji.cityId,
            sectionOrder: 1,
            description: "Fontainhas Latin Quarter heritage walk & river cruise",
            startDate: new Date("2026-01-10"),
            endDate: new Date("2026-01-14"),
            budget: 900,
          },
          {
            tripId: trip4.tripId,
            cityId: northGoa.cityId,
            sectionOrder: 2,
            description: "Baga water sports & Anjuna flea market sunset",
            startDate: new Date("2026-01-14"),
            endDate: new Date("2026-01-18"),
            budget: 1600,
          },
        ],
      });
    }
  }

  // Community Posts
  const aanya = createdUsers[0];
  const rohan = createdUsers[1];
  const priya = createdUsers[2];
  const dev = createdUsers[3];

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
        content: "Quick weekend trip to Lonavala during monsoons! Bhushi dam and Tiger's Point ridge fog was breathtaking 🌧️⛰️",
      },
      {
        userId: dev.userId,
        content: "Pro tip for Panaji: Walk through Fontainhas early morning around 7 AM when the light hits the Portuguese facades perfectly 📸",
      },
      {
        userId: rohan.userId,
        content: "Old Delhi street food recommendation: Rabri Paratha in Chandni Chowk and Jalebi at Dariba Kalan! 😋",
      },
      {
        userId: priya.userId,
        content: "Late night Manek Chowk in Ahmedabad serves the best cheese pineapple toasted sandwiches and matka kulfi! 🧀🍍",
      },
    ],
  });

  console.log(`Fresh seed complete: ${cityCount} Indian cities, ${activityCount} catalog activities, ${createdUsers.length} users, ${tripTotalCount} trips across accounts, and community posts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
