import express from "express";
import { addComment, getComments, likeComment, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

router.post("/add", addComment);
router.get("/:questionId", getComments);
router.post("/like/:commentId", likeComment);
router.delete("/:commentId", deleteComment);

export default router;
