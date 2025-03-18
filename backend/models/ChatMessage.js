import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);
export default ChatMessage;
