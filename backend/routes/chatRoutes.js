import express from "express";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

// ✅ Get all chat messages
router.get("/", async (req, res) => {
    try {
        const messages = await ChatMessage.find().sort({ timestamp: 1 }); // Oldest messages first
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chat messages" });
    }
});

// ✅ Send a new chat message
router.post("/", async (req, res) => {
    try {
        const { username, message } = req.body;
        if (!username || !message) {
            return res.status(400).json({ error: "Username and message are required" });
        }

        const newMessage = new ChatMessage({ username, message });
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
});

// ✅ Clear all chat messages (Admin feature)
router.delete("/clear", async (req, res) => {
    try {
        await ChatMessage.deleteMany({});
        res.status(200).json({ message: "All chat messages cleared" });
    } catch (error) {
        res.status(500).json({ error: "Failed to clear messages" });
    }
});

export default router;
