import prisma from "../config/prisma.js";

const activityInclude = { activity: true };

async function findOwnedSection(tripId, sectionId, userId) {
  return prisma.tripSection.findFirst({
    where: { sectionId, tripId, trip: { userId } },
  });
}

async function findOwnedSectionActivity(sectionActivityId, tripId, sectionId, userId) {
  return prisma.sectionActivity.findFirst({
    where: {
      sectionActivityId,
      sectionId,
      section: { tripId, trip: { userId } },
    },
  });
}

function dateValue(value) {
  return value ? new Date(value) : null;
}

export async function listSectionActivities(req, res) {
  const section = await findOwnedSection(
    Number(req.params.tripId),
    Number(req.params.sectionId),
    req.user.userId,
  );

  if (!section) {
    return res.status(404).json({ message: "Section not found" });
  }

  const activities = await prisma.sectionActivity.findMany({
    where: { sectionId: section.sectionId },
    include: activityInclude,
    orderBy: [{ activityDate: "asc" }, { sectionActivityId: "asc" }],
  });

  return res.json({ activities });
}

export async function createSectionActivity(req, res) {
  const tripId = Number(req.params.tripId);
  const sectionId = Number(req.params.sectionId);
  const { activityId, activityDate, activityName, expense } = req.body;
  const section = await findOwnedSection(tripId, sectionId, req.user.userId);

  if (!section) {
    return res.status(404).json({ message: "Section not found" });
  }

  let catalogActivity = null;
  if (activityId !== undefined && activityId !== null) {
    catalogActivity = await prisma.activity.findFirst({
      where: { activityId, cityId: section.cityId },
    });

    if (!catalogActivity) {
      return res.status(404).json({ message: "Activity not found for this section city" });
    }
  }

  const savedActivity = await prisma.sectionActivity.create({
    data: {
      sectionId,
      activityId: catalogActivity?.activityId || null,
      activityDate: dateValue(activityDate),
      activityName: activityName?.trim() || catalogActivity?.activityName || null,
      expense: expense ?? catalogActivity?.cost ?? null,
    },
    include: activityInclude,
  });

  return res.status(201).json({ activity: savedActivity });
}

export async function updateSectionActivity(req, res) {
  const sectionActivityId = Number(req.params.sectionActivityId);
  const tripId = Number(req.params.tripId);
  const sectionId = Number(req.params.sectionId);
  const { activityId, activityDate, activityName, expense } = req.body;
  const existingActivity = await findOwnedSectionActivity(
    sectionActivityId,
    tripId,
    sectionId,
    req.user.userId,
  );

  if (!existingActivity) {
    return res.status(404).json({ message: "Section activity not found" });
  }

  if (activityId !== undefined && activityId !== null) {
    const section = await prisma.tripSection.findUnique({ where: { sectionId } });
    const catalogActivity = section
      ? await prisma.activity.findFirst({ where: { activityId, cityId: section.cityId } })
      : null;
    if (!catalogActivity) {
      return res.status(404).json({ message: "Activity not found for this section city" });
    }
  }

  const updatedActivity = await prisma.sectionActivity.update({
    where: { sectionActivityId },
    data: {
      ...(activityId !== undefined ? { activityId } : {}),
      ...(activityDate !== undefined ? { activityDate: dateValue(activityDate) } : {}),
      ...(activityName !== undefined ? { activityName: activityName?.trim() || null } : {}),
      ...(expense !== undefined ? { expense: expense || null } : {}),
    },
    include: activityInclude,
  });

  return res.json({ activity: updatedActivity });
}

export async function deleteSectionActivity(req, res) {
  const existingActivity = await findOwnedSectionActivity(
    Number(req.params.sectionActivityId),
    Number(req.params.tripId),
    Number(req.params.sectionId),
    req.user.userId,
  );

  if (!existingActivity) {
    return res.status(404).json({ message: "Section activity not found" });
  }

  await prisma.sectionActivity.delete({
    where: { sectionActivityId: existingActivity.sectionActivityId },
  });
  return res.status(204).send();
}