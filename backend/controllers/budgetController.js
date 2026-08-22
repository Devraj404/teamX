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
  const byCategory = {};
  let total = 0;
  let plannedBudget = 0;
  const bySection = trip.sections.map((section) => {
    const sectionTotal = section.sectionActivities.reduce((sum, item) => {
      const expense = Number(item.expense || 0);
      const type = item.activity?.type || "other";
      const category = item.expenseCategory || "other";
      total += expense;
      byType[type] = (byType[type] || 0) + expense;
      byCategory[category] = (byCategory[category] || 0) + expense;
      return sum + expense;
    }, 0);
    const sectionBudget = section.budget === null ? null : Number(section.budget);
    if (sectionBudget !== null) plannedBudget += sectionBudget;

    return {
      sectionId: section.sectionId,
      city: section.city,
      budget: sectionBudget,
      activityTotal: sectionTotal,
      remainingBudget: sectionBudget === null ? null : sectionBudget - sectionTotal,
      isOverBudget: sectionBudget !== null && sectionTotal > sectionBudget,
    };
  });

  return res.json({
    tripId,
    total,
    byType,
    byCategory,
    bySection,
    plannedBudget,
    remainingBudget: plannedBudget - total,
    isOverBudget: plannedBudget > 0 && total > plannedBudget,
    averagePerDay: trip.startDate && trip.endDate
      ? total / (Math.floor((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000) + 1)
      : null,
  });
}