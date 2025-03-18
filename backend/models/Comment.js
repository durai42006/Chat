import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    questionId: { type: Number, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
