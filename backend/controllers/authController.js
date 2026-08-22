import prisma from "../config/prisma.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { publicUserSelect } from "../utils/userSelect.js";

export async function register(req, res) {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      phoneNumber,
      city,
      country,
      photo,
      additionalInformation,
    } = req.body;

    const normalizedUsername = username.trim();

    const existingUser = await prisma.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        password: hashedPassword,
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        email: email?.trim() || null,
        phoneNumber: phoneNumber?.trim() || null,
        city: city?.trim() || null,
        country: country?.trim() || null,
        photo: photo?.trim() || null,
        additionalInformation: additionalInformation?.trim() || null,
      },
      select: publicUserSelect,
    });

    const token = signToken(user.userId);

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { username, email, password } = req.body;
    const identifier = (email || username).trim();

    const user = await prisma.user.findFirst({
      where: { OR: [{ username: identifier }, { email: identifier }] },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = signToken(user.userId);

    const publicUser = await prisma.user.findUnique({
      where: { userId: user.userId },
      select: publicUserSelect,
    });

    return res.json({ user: publicUser, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateMe(req, res) {
  try {
    const { username, email, password, firstName, lastName, phoneNumber, city, country, photo, additionalInformation } = req.body;
    const duplicate = await prisma.user.findFirst({
      where: {
        userId: { not: req.user.userId },
        OR: [
          ...(username ? [{ username: username.trim() }] : []),
          ...(email ? [{ email: email.trim() }] : []),
        ],
      },
    });

    if (duplicate) {
      return res.status(409).json({ message: "Username or email already in use" });
    }

    const user = await prisma.user.update({
      where: { userId: req.user.userId },
      data: {
        ...(username !== undefined ? { username: username.trim() } : {}),
        ...(email !== undefined ? { email: email?.trim() || null } : {}),
        ...(password !== undefined ? { password: await hashPassword(password) } : {}),
        ...(firstName !== undefined ? { firstName: firstName?.trim() || null } : {}),
        ...(lastName !== undefined ? { lastName: lastName?.trim() || null } : {}),
        ...(phoneNumber !== undefined ? { phoneNumber: phoneNumber?.trim() || null } : {}),
        ...(city !== undefined ? { city: city?.trim() || null } : {}),
        ...(country !== undefined ? { country: country?.trim() || null } : {}),
        ...(photo !== undefined ? { photo: photo?.trim() || null } : {}),
        ...(additionalInformation !== undefined ? { additionalInformation: additionalInformation?.trim() || null } : {}),
      },
      select: publicUserSelect,
    });

    return res.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteMe(req, res) {
  await prisma.user.delete({ where: { userId: req.user.userId } });
  return res.status(204).send();
}

export async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: req.user.userId },
      select: publicUserSelect,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
