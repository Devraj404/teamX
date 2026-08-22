import { Router } from "express";
import { createPost, deletePost, listPosts } from "../controllers/postController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", listPosts);
router.post("/", authenticate, createPost);
router.delete("/:postId", authenticate, deletePost);

export default router;
