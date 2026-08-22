import prisma from "../config/prisma.js";

const sectionInclude = {
  city: true,
  sectionActivities: {
    include: { activity: true },
    orderBy: { activityDate: "asc" },
  },
};

async function findOwnedTrip(tripId, userId) {
  return prisma.trip.findFirst({ where: { tripId, userId } });
}

async function findOwnedSection(sectionId, tripId, userId) {
  return prisma.tripSection.findFirst({
    where: { sectionId, tripId, trip: { userId } },
  });
}

function dateValue(value) {
  return value ? new Date(value) : null;
}

export async function listSections(req, res) {
  const tripId = Number(req.params.tripId);
  const trip = await findOwnedTrip(tripId, req.user.userId);

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const sections = await prisma.tripSection.findMany({
    where: { tripId },
    include: sectionInclude,
    orderBy: { sectionOrder: "asc" },
  });

  return res.json({ sections });
}

export async function createSection(req, res) {
  const tripId = Number(req.params.tripId);
  const { cityId, sectionOrder, description, startDate, endDate, budget } = req.body;
  const trip = await findOwnedTrip(tripId, req.user.userId);

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const city = await prisma.city.findUnique({ where: { cityId } });
  if (!city) {
    return res.status(404).json({ message: "City not found" });
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ message: "startDate must be on or before endDate" });
  }
  if (startDate && trip.startDate && new Date(startDate) < new Date(trip.startDate)) {
    return res.status(400).json({ message: "Section startDate must be within the trip dates" });
  }
  if (endDate && trip.endDate && new Date(endDate) > new Date(trip.endDate)) {
    return res.status(400).json({ message: "Section endDate must be within the trip dates" });
  }

  const lastSection = await prisma.tripSection.findFirst({
    where: { tripId },
    orderBy: { sectionOrder: "desc" },
  });

  const section = await prisma.tripSection.create({
    data: {
      tripId,
      cityId,
      sectionOrder: sectionOrder ?? (lastSection?.sectionOrder || 0) + 1,
      description: description?.trim() || null,
      startDate: dateValue(startDate),
      endDate: dateValue(endDate),
      budget: budget ?? null,
    },
    include: sectionInclude,
  });

  return res.status(201).json({ section });
}

export async function updateSection(req, res) {
  const sectionId = Number(req.params.sectionId);
  const tripId = Number(req.params.tripId);
  const { cityId, sectionOrder, description, startDate, endDate, budget } = req.body;
  const section = await findOwnedSection(sectionId, tripId, req.user.userId);

  if (!section) {
    return res.status(404).json({ message: "Section not found" });
  }

  const nextStartDate = startDate !== undefined ? startDate : section.startDate;
  const nextEndDate = endDate !== undefined ? endDate : section.endDate;
  if (nextStartDate && nextEndDate && new Date(nextStartDate) > new Date(nextEndDate)) {
    return res.status(400).json({ message: "startDate must be on or before endDate" });
  }

  if (cityId !== undefined) {
    const city = await prisma.city.findUnique({ where: { cityId } });
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
  }

  const updatedSection = await prisma.tripSection.update({
    where: { sectionId },
    data: {
      ...(cityId !== undefined ? { cityId } : {}),
      ...(sectionOrder !== undefined ? { sectionOrder } : {}),
      ...(description !== undefined ? { description: description?.trim() || null } : {}),
      ...(startDate !== undefined ? { startDate: dateValue(startDate) } : {}),
      ...(endDate !== undefined ? { endDate: dateValue(endDate) } : {}),
      ...(budget !== undefined ? { budget: budget || null } : {}),
    },
    include: sectionInclude,
  });

  return res.json({ section: updatedSection });
}

export async function deleteSection(req, res) {
  const section = await findOwnedSection(
    Number(req.params.sectionId),
    Number(req.params.tripId),
    req.user.userId,
  );

  if (!section) {
    return res.status(404).json({ message: "Section not found" });
  }

  await prisma.tripSection.delete({ where: { sectionId: section.sectionId } });
  return res.status(204).send();
}