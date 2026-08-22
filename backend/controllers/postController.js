import prisma from "../config/prisma.js";
import { publicUserSelect } from "../utils/userSelect.js";

export async function listPosts(req, res) {
  try {
    const posts = await prisma.communityPost.findMany({
      include: {
        user: {
          select: publicUserSelect,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ posts });
  } catch (error) {
    console.error("List posts error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createPost(req, res) {
  try {
    const { content } = req.body;
    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await prisma.communityPost.create({
      data: {
        userId: req.user.userId,
        content: content.trim(),
      },
      include: {
        user: {
          select: publicUserSelect,
        },
      },
    });

    return res.status(201).json({ post });
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePost(req, res) {
  try {
    const postId = Number(req.params.postId);
    const existing = await prisma.communityPost.findFirst({
      where: { postId, userId: req.user.userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }

    await prisma.communityPost.delete({ where: { postId } });
    return res.status(204).send();
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
