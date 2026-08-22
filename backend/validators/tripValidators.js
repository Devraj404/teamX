import { body, param } from "express-validator";

export const tripIdValidator = [
  param("tripId")
    .isInt({ min: 1 })
    .withMessage("tripId must be a positive integer"),
];

export const createTripValidator = [
  body("tripName")
    .trim()
    .notEmpty()
    .withMessage("tripName is required")
    .isLength({ max: 200 })
    .withMessage("tripName must be at most 200 characters"),
  body("startDate").optional({ values: "falsy" }).isISO8601().withMessage("startDate must be a valid date"),
  body("endDate").optional({ values: "falsy" }).isISO8601().withMessage("endDate must be a valid date"),
  body("isPublic").optional().isBoolean().toBoolean().withMessage("isPublic must be boolean"),
];

export const updateTripValidator = [
  body("tripName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("tripName cannot be empty")
    .isLength({ max: 200 })
    .withMessage("tripName must be at most 200 characters"),
  body("startDate").optional({ values: "falsy" }).isISO8601().withMessage("startDate must be a valid date"),
  body("endDate").optional({ values: "falsy" }).isISO8601().withMessage("endDate must be a valid date"),
  body("isPublic").optional().isBoolean().toBoolean().withMessage("isPublic must be boolean"),
];