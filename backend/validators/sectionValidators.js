import { body, param } from "express-validator";

export const sectionParamsValidator = [
  param("tripId").isInt({ min: 1 }).withMessage("tripId must be a positive integer"),
  param("sectionId").optional().isInt({ min: 1 }).withMessage("sectionId must be a positive integer"),
];

export const createSectionValidator = [
  body("cityId").isInt({ min: 1 }).withMessage("cityId must be a positive integer"),
  body("sectionOrder").optional().isInt({ min: 1 }).withMessage("sectionOrder must be a positive integer"),
  body("startDate").optional({ values: "falsy" }).isISO8601().withMessage("startDate must be a valid date"),
  body("endDate").optional({ values: "falsy" }).isISO8601().withMessage("endDate must be a valid date"),
  body("budget").optional({ values: "falsy" }).isDecimal().withMessage("budget must be a decimal number"),
];

export const updateSectionValidator = [
  body("cityId").optional().isInt({ min: 1 }).withMessage("cityId must be a positive integer"),
  body("sectionOrder").optional().isInt({ min: 1 }).withMessage("sectionOrder must be a positive integer"),
  body("startDate").optional({ values: "falsy" }).isISO8601().withMessage("startDate must be a valid date"),
  body("endDate").optional({ values: "falsy" }).isISO8601().withMessage("endDate must be a valid date"),
  body("budget").optional({ values: "falsy" }).isDecimal().withMessage("budget must be a decimal number"),
];