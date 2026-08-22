import { Router } from "express";
import { getTripBudget } from "../controllers/budgetController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { budgetTripIdValidator } from "../validators/budgetValidators.js";

const router = Router({ mergeParams: true });

router.use(authenticate);
router.get("/", budgetTripIdValidator, validate, getTripBudget);

export default router;