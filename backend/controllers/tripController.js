import prisma from "../config/prisma.js";

function tripStatus(trip) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (trip.startDate && new Date(trip.startDate) > today) {
    return "upcoming";
  }

  if (trip.endDate && new Date(trip.endDate) < today) {
    return "completed";
  }

  return "ongoing";
}

function formatTrip(trip) {
  return { ...trip, status: tripStatus(trip) };
}

function dateValue(value) {
  return value ? new Date(value) : null;
}

export async function listTrips(req, res) {
  const trips = await prisma.trip.findMany({
    where: { userId: req.user.userId },
    include: {
      sections: {
        include: { city: true },
        orderBy: { sectionOrder: "asc" },
      },
    },
    orderBy: [{ startDate: "asc" }, { tripId: "desc" }],
  });

  return res.json({ trips: trips.map(formatTrip) });
}

export async function createTrip(req, res) {
  const { tripName, description, startDate, endDate, coverPhoto, isPublic } = req.body;

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ message: "startDate must be on or before endDate" });
  }

  const trip = await prisma.trip.create({
    data: {
      userId: req.user.userId,
      tripName: tripName.trim(),
      description: description?.trim() || null,
      startDate: dateValue(startDate),
      endDate: dateValue(endDate),
      coverPhoto: coverPhoto?.trim() || null,
      isPublic: isPublic === true,
    },
    include: { sections: true },
  });

  return res.status(201).json({ trip: formatTrip(trip) });
}

export async function getTrip(req, res) {
  const trip = await prisma.trip.findFirst({
    where: { tripId: Number(req.params.tripId), userId: req.user.userId },
    include: {
      sections: {
        include: { city: true, sectionActivities: { include: { activity: true } } },
        orderBy: { sectionOrder: "asc" },
      },
    },
  });

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  return res.json({ trip: formatTrip(trip) });
}

export async function updateTrip(req, res) {
  const { tripName, description, startDate, endDate, coverPhoto, isPublic } = req.body;
  const existingTrip = await prisma.trip.findFirst({
    where: { tripId: Number(req.params.tripId), userId: req.user.userId },
  });

  if (!existingTrip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const nextStartDate = startDate !== undefined ? startDate : existingTrip.startDate;
  const nextEndDate = endDate !== undefined ? endDate : existingTrip.endDate;
  if (nextStartDate && nextEndDate && new Date(nextStartDate) > new Date(nextEndDate)) {
    return res.status(400).json({ message: "startDate must be on or before endDate" });
  }

  const trip = await prisma.trip.update({
    where: { tripId: existingTrip.tripId },
    data: {
      ...(tripName !== undefined ? { tripName: tripName.trim() } : {}),
      ...(description !== undefined ? { description: description?.trim() || null } : {}),
      ...(startDate !== undefined ? { startDate: dateValue(startDate) } : {}),
      ...(endDate !== undefined ? { endDate: dateValue(endDate) } : {}),
      ...(coverPhoto !== undefined ? { coverPhoto: coverPhoto?.trim() || null } : {}),
      ...(isPublic !== undefined ? { isPublic } : {}),
    },
    include: { sections: true },
  });

  return res.json({ trip: formatTrip(trip) });
}

export async function deleteTrip(req, res) {
  const result = await prisma.trip.deleteMany({
    where: { tripId: Number(req.params.tripId), userId: req.user.userId },
  });

  if (result.count === 0) {
    return res.status(404).json({ message: "Trip not found" });
  }

  return res.status(204).send();
}