import { Router } from "express";
import { getCity, listCities } from "../controllers/cityController.js";
import { validate } from "../middleware/validate.js";
import { cityIdValidator } from "../validators/cityValidators.js";

const router = Router();

router.get("/", listCities);
router.get("/:cityId", cityIdValidator, validate, getCity);

export default router;