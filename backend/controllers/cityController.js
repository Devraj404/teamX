import prisma from "../config/prisma.js";

export async function listCities(req, res) {
  const { q, country, region } = req.query;

  const cities = await prisma.city.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { cityName: { contains: q, mode: "insensitive" } },
              { region: { contains: q, mode: "insensitive" } },
              { country: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(country ? { country: { equals: country, mode: "insensitive" } } : {}),
      ...(region ? { region: { equals: region, mode: "insensitive" } } : {}),
    },
    orderBy: [{ popularity: "desc" }, { cityName: "asc" }],
  });

  return res.json({ cities });
}

export async function getCity(req, res) {
  const city = await prisma.city.findUnique({
    where: { cityId: Number(req.params.cityId) },
  });

  if (!city) {
    return res.status(404).json({ message: "City not found" });
  }

  return res.json({ city });
}