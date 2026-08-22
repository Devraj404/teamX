import prisma from "../config/prisma.js";

export async function getPublicTrip(req, res) {
  const trip = await prisma.trip.findFirst({
    where: { tripId: Number(req.params.tripId), isPublic: true },
    select: {
      tripId: true,
      tripName: true,
      description: true,
      startDate: true,
      endDate: true,
      coverPhoto: true,
      sections: {
        select: {
          sectionId: true,
          sectionOrder: true,
          description: true,
          startDate: true,
          endDate: true,
          city: true,
          sectionActivities: {
            select: {
              sectionActivityId: true,
              activityDate: true,
              activityName: true,
              expense: true,
              expenseCategory: true,
              activity: true,
            },
            orderBy: { activityDate: "asc" },
          },
        },
        orderBy: { sectionOrder: "asc" },
      },
    },
  });

  if (!trip) {
    return res.status(404).json({ message: "Public trip not found" });
  }

  return res.json({ trip });
}