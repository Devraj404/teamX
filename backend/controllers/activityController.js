import prisma from "../config/prisma.js";

export async function listActivities(req, res) {
  const { q, cityId, type } = req.query;

  const activities = await prisma.activity.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { activityName: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(cityId ? { cityId: Number(cityId) } : {}),
      ...(type ? { type: { equals: type, mode: "insensitive" } } : {}),
    },
    include: { city: true },
    orderBy: [{ activityName: "asc" }],
  });

  return res.json({ activities });
}

export async function getActivity(req, res) {
  const activity = await prisma.activity.findUnique({
    where: { activityId: Number(req.params.activityId) },
    include: { city: true },
  });

  if (!activity) {
    return res.status(404).json({ message: "Activity not found" });
  }

  return res.json({ activity });
}