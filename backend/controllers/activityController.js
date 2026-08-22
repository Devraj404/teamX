import prisma from "../config/prisma.js";

export async function listActivities(req, res) {
  const { q, type } = req.query;
  const cityId = req.query.cityId !== undefined ? Number(req.query.cityId) : undefined;
  const minCost = req.query.minCost !== undefined ? Number(req.query.minCost) : undefined;
  const maxCost = req.query.maxCost !== undefined ? Number(req.query.maxCost) : undefined;
  const minDuration = req.query.minDuration !== undefined ? Number(req.query.minDuration) : undefined;
  const maxDuration = req.query.maxDuration !== undefined ? Number(req.query.maxDuration) : undefined;

  const activities = await prisma.activity.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { activityName: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { type: { contains: q, mode: "insensitive" } },
              { city: { cityName: { contains: q, mode: "insensitive" } } },
              { city: { region: { contains: q, mode: "insensitive" } } },
              { city: { country: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
      ...(cityId ? { cityId: Number(cityId) } : {}),
      ...(type ? { type: { equals: type, mode: "insensitive" } } : {}),
      ...(minCost !== undefined || maxCost !== undefined
        ? { cost: { ...(minCost !== undefined ? { gte: minCost } : {}), ...(maxCost !== undefined ? { lte: maxCost } : {}) } }
        : {}),
      ...(minDuration !== undefined || maxDuration !== undefined
        ? { duration: { ...(minDuration !== undefined ? { gte: minDuration } : {}), ...(maxDuration !== undefined ? { lte: maxDuration } : {}) } }
        : {}),
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