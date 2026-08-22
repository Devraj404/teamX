import { body, param } from "express-validator";

export const sectionParamsValidator = [
  param("tripId").isInt({ min: 1 }).toInt().withMessage("tripId must be a positive integer"),
  param("sectionId").optional().isInt({ min: 1 }).toInt().withMessage("sectionId must be a positive integer"),
];

export const createSectionValidator = [
  body("cityId").isInt({ min: 1 }).toInt().withMessage("cityId must be a positive integer"),
  body("sectionOrder").optional().isInt({ min: 1 }).toInt().withMessage("sectionOrder must be a positive integer"),
  body("startDate").optional({ values: "falsy" }).isISO8601().withMessage("startDate must be a valid date"),
  body("endDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("endDate must be a valid date")
    .custom((endDate, { req }) => !req.body.startDate || new Date(endDate) >= new Date(req.body.startDate))
    .withMessage("endDate must be on or after startDate"),
    body("budget").optional({ nullable: true }).isFloat({ min: 0 }).toFloat().withMessage("budget must be a non-negative number"),
];

export const updateSectionValidator = [
  body("cityId").optional().isInt({ min: 1 }).toInt().withMessage("cityId must be a positive integer"),
  body("sectionOrder").optional().isInt({ min: 1 }).toInt().withMessage("sectionOrder must be a positive integer"),
  body("startDate").optional({ values: "falsy" }).isISO8601().withMessage("startDate must be a valid date"),
  body("endDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("endDate must be a valid date")
    .custom((endDate, { req }) => !req.body.startDate || new Date(endDate) >= new Date(req.body.startDate))
    .withMessage("endDate must be on or after startDate"),
    body("budget").optional({ nullable: true }).isFloat({ min: 0 }).toFloat().withMessage("budget must be a non-negative number"),
];