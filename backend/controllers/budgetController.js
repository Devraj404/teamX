import prisma from "../config/prisma.js";

export async function getTripBudget(req, res) {
  const tripId = Number(req.params.tripId);
  const trip = await prisma.trip.findFirst({
    where: { tripId, userId: req.user.userId },
    include: {
      sections: {
        include: {
          city: true,
          sectionActivities: { include: { activity: true } },
        },
        orderBy: { sectionOrder: "asc" },
      },
    },
  });

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const byType = {};
  let total = 0;
  const bySection = trip.sections.map((section) => {
    const sectionTotal = section.sectionActivities.reduce((sum, item) => {
      const expense = Number(item.expense || 0);
      const type = item.activity?.type || "other";
      total += expense;
      byType[type] = (byType[type] || 0) + expense;
      return sum + expense;
    }, 0);

    return {
      sectionId: section.sectionId,
      city: section.city,
      budget: section.budget ? Number(section.budget) : null,
      activityTotal: sectionTotal,
    };
  });

  return res.json({
    tripId,
    total,
    byType,
    bySection,
  });
}