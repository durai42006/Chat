import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: "Error adding comment" });
    }
};

export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ questionId: req.params.questionId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments" });
    }
};

export const likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (comment) {
            comment.likes += 1;
            await comment.save();
            res.status(200).json({ message: "Comment liked" });
        } else {
            res.status(404).json({ message: "Comment not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error liking comment" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment" });
    }
};
