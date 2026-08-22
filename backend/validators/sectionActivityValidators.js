import { body, param } from "express-validator";

export const sectionActivityParamsValidator = [
  param("tripId").isInt({ min: 1 }).withMessage("tripId must be a positive integer"),
  param("sectionId").isInt({ min: 1 }).withMessage("sectionId must be a positive integer"),
  param("sectionActivityId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("sectionActivityId must be a positive integer"),
];

export const createSectionActivityValidator = [
  body("activityId").optional({ nullable: true }).isInt({ min: 1 }).withMessage("activityId must be a positive integer"),
  body("activityName").optional({ values: "falsy" }).trim().isLength({ max: 200 }).withMessage("activityName must be at most 200 characters"),
  body("activityDate").optional({ values: "falsy" }).isISO8601().withMessage("activityDate must be a valid date"),
  body("expense").optional({ values: "falsy" }).isDecimal().withMessage("expense must be a decimal number"),
];

export const updateSectionActivityValidator = createSectionActivityValidator;