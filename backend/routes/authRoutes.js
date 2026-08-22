import { Router } from "express";
import { register, login, getMe, updateMe, deleteMe } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginValidator, registerValidator, updateProfileValidator } from "../validators/authValidators.js";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateProfileValidator, validate, updateMe);
router.delete("/me", authenticate, deleteMe);

export default router;
