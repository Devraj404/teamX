import { body } from "express-validator";

export const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("username must be between 3 and 100 characters"),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 255 })
    .withMessage("password must be between 6 and 255 characters"),

  body("email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage("email must be valid")
    .isLength({ max: 150 })
    .withMessage("email must be at most 150 characters"),

  body("firstName")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("firstName must be at most 100 characters"),

  body("lastName")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("lastName must be at most 100 characters"),

  body("phoneNumber")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 30 })
    .withMessage("phoneNumber must be at most 30 characters"),

  body("city")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("city must be at most 100 characters"),

  body("country")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("country must be at most 100 characters"),

  body("photo").optional({ values: "falsy" }).trim(),

  body("additionalInformation")
    .optional({ values: "falsy" })
    .trim(),
];

export const loginValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required"),

  body("password")
    .notEmpty()
    .withMessage("password is required"),
];
