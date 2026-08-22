import { Router } from "express";
import {
  createSectionActivity,
  deleteSectionActivity,
  listSectionActivities,
  updateSectionActivity,
} from "../controllers/sectionActivityController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createSectionActivityValidator,
  sectionActivityParamsValidator,
  updateSectionActivityValidator,
} from "../validators/sectionActivityValidators.js";

const router = Router({ mergeParams: true });

router.use(authenticate);
router.get("/", sectionActivityParamsValidator, validate, listSectionActivities);
router.post("/", sectionActivityParamsValidator, createSectionActivityValidator, validate, createSectionActivity);
router.patch(
  "/:sectionActivityId",
  sectionActivityParamsValidator,
  updateSectionActivityValidator,
  validate,
  updateSectionActivity,
);
router.delete("/:sectionActivityId", sectionActivityParamsValidator, validate, deleteSectionActivity);

export default router;