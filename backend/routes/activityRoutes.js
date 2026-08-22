import { Router } from "express";
import { getActivity, listActivities } from "../controllers/activityController.js";
import { validate } from "../middleware/validate.js";
import { activityIdValidator, activityQueryValidator } from "../validators/activityValidators.js";

const router = Router();

router.get("/", activityQueryValidator, validate, listActivities);
router.get("/:activityId", activityIdValidator, validate, getActivity);

export default router;