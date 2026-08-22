import { Router } from "express";
import { getPublicTrip } from "../controllers/publicTripController.js";
import { validate } from "../middleware/validate.js";
import { publicTripIdValidator } from "../validators/publicTripValidators.js";

const router = Router();

router.get("/:tripId", publicTripIdValidator, validate, getPublicTrip);

export default router;