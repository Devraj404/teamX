import { param } from "express-validator";

export const publicTripIdValidator = [
  param("tripId").isInt({ min: 1 }).toInt().withMessage("tripId must be a positive integer"),
];