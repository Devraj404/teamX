import { Router } from "express";
import {
  createTrip,
  deleteTrip,
  getTrip,
  listTrips,
  updateTrip,
} from "../controllers/tripController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createTripValidator,
  tripIdValidator,
  updateTripValidator,
} from "../validators/tripValidators.js";
import sectionRoutes from "./sectionRoutes.js";

const router = Router();

router.use(authenticate);
router.get("/", listTrips);
router.post("/", createTripValidator, validate, createTrip);
router.get("/:tripId", tripIdValidator, validate, getTrip);
router.patch("/:tripId", tripIdValidator, updateTripValidator, validate, updateTrip);
router.delete("/:tripId", tripIdValidator, validate, deleteTrip);
router.use("/:tripId/sections", sectionRoutes);

export default router;