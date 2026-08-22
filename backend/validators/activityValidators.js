import { param, query } from "express-validator";

export const activityIdValidator = [
  param("activityId")
    .isInt({ min: 1 })
    .withMessage("activityId must be a positive integer"),
];

export const activityQueryValidator = [
  query("cityId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("cityId must be a positive integer"),
  query("type")
    .optional()
    .isIn(["sightseeing", "food", "adventure", "other"])
    .withMessage("type must be sightseeing, food, adventure, or other"),
];