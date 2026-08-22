import { Router } from "express";
import {
  createSection,
  deleteSection,
  listSections,
  updateSection,
} from "../controllers/sectionController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createSectionValidator,
  sectionParamsValidator,
  updateSectionValidator,
} from "../validators/sectionValidators.js";
import sectionActivityRoutes from "./sectionActivityRoutes.js";

const router = Router({ mergeParams: true });

router.use(authenticate);
router.get("/", sectionParamsValidator, validate, listSections);
router.post("/", sectionParamsValidator, createSectionValidator, validate, createSection);
router.patch(
  "/:sectionId",
  sectionParamsValidator,
  updateSectionValidator,
  validate,
  updateSection,
);
router.delete("/:sectionId", sectionParamsValidator, validate, deleteSection);
router.use("/:sectionId/activities", sectionActivityRoutes);

export default router;