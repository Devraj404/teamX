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
  const { activityId, activityDate, activityName, expense, expenseCategory } = req.body;
  const section = await findOwnedSection(tripId, sectionId, req.user.userId);

  if (!section) {
    return res.status(404).json({ message: "Section not found" });
  }

    if (activityDate && section.startDate && new Date(activityDate) < new Date(section.startDate)) {
      return res.status(400).json({ message: "activityDate must be within the section dates" });
    }
    if (activityDate && section.endDate && new Date(activityDate) > new Date(section.endDate)) {
      return res.status(400).json({ message: "activityDate must be within the section dates" });
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
      expenseCategory: expenseCategory || "activities",
    },
    include: activityInclude,
  });

  return res.status(201).json({ activity: savedActivity });
}

export async function updateSectionActivity(req, res) {
  const sectionActivityId = Number(req.params.sectionActivityId);
  const tripId = Number(req.params.tripId);
  const sectionId = Number(req.params.sectionId);
  const { activityId, activityDate, activityName, expense, expenseCategory } = req.body;
  const existingActivity = await findOwnedSectionActivity(
    sectionActivityId,
    tripId,
    sectionId,
    req.user.userId,
  );

  if (!existingActivity) {
    return res.status(404).json({ message: "Section activity not found" });
  }

  const section = await prisma.tripSection.findUnique({ where: { sectionId } });
  const nextActivityDate = activityDate !== undefined ? activityDate : existingActivity.activityDate;
  if (nextActivityDate && section?.startDate && new Date(nextActivityDate) < new Date(section.startDate)) {
    return res.status(400).json({ message: "activityDate must be within the section dates" });
  }
  if (nextActivityDate && section?.endDate && new Date(nextActivityDate) > new Date(section.endDate)) {
    return res.status(400).json({ message: "activityDate must be within the section dates" });
  }

  if (activityId !== undefined && activityId !== null) {
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
      ...(expense !== undefined ? { expense: expense ?? null } : {}),
      ...(expenseCategory !== undefined ? { expenseCategory } : {}),
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