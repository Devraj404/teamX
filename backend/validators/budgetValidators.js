import { param } from "express-validator";

export const budgetTripIdValidator = [
  param("tripId").isInt({ min: 1 }).withMessage("tripId must be a positive integer"),
];