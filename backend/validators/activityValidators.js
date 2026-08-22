import { param, query } from "express-validator";

export const activityIdValidator = [
  param("activityId")
    .isInt({ min: 1 })
    .withMessage("activityId must be a positive integer"),
];

export const activityQueryValidator = [
  query("cityId")
    .optional()
    .isInt({ min: 1 }).toInt()
    .withMessage("cityId must be a positive integer"),
  query("type")
    .optional()
    .isIn(["sightseeing", "food", "adventure", "other"])
    .withMessage("type must be sightseeing, food, adventure, or other"),
  query("minCost").optional().isFloat({ min: 0 }).toFloat().withMessage("minCost must be a non-negative number"),
  query("maxCost").optional().isFloat({ min: 0 }).toFloat().withMessage("maxCost must be a non-negative number"),
  query("minDuration").optional().isInt({ min: 0 }).toInt().withMessage("minDuration must be a non-negative integer"),
  query("maxDuration").optional().isInt({ min: 0 }).toInt().withMessage("maxDuration must be a non-negative integer"),
    query("minCost").custom((value, { req }) => value === undefined || req.query.maxCost === undefined || Number(value) <= Number(req.query.maxCost)).withMessage("minCost must be less than or equal to maxCost"),
    query("minDuration").custom((value, { req }) => value === undefined || req.query.maxDuration === undefined || Number(value) <= Number(req.query.maxDuration)).withMessage("minDuration must be less than or equal to maxDuration"),
];