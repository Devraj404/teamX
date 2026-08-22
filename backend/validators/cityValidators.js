import { param } from "express-validator";

export const cityIdValidator = [
  param("cityId")
    .isInt({ min: 1 })
    .withMessage("cityId must be a positive integer"),
];