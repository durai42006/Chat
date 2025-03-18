import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import Comment from "./models/Comment.js";
import ChatMessage from "./models/ChatMessage.js"; 
import chatRoutes from './routes/chatRoutes.js'// New model for chat messages

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// Database Connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
});

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/chat", chatRoutes);

// Socket.IO Handling
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle new comments
    socket.on("newComment", async ({ questionId, comment }) => {
        io.emit("updateComments", { questionId, comment });
    });

    // Handle likes on comments
    socket.on("likeComment", async ({ commentId }) => {
        try {
            const comment = await Comment.findById(commentId);
            if (comment) {
                comment.likes = (comment.likes || 0) + 1;
                await comment.save();
                io.emit("commentLiked", { commentId, likes: comment.likes });
            }
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    });

    // Handle deleting comments
    socket.on("deleteComment", async ({ commentId }) => {
        try {
            await Comment.findByIdAndDelete(commentId);
            io.emit("commentDeleted", { commentId });
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    });

    // Handle real-time chat messages
    socket.on("chatMessage", async ({ username, message }) => {
        try {
            const chatMessage = new ChatMessage({ username, message });
            await chatMessage.save();
            io.emit("receiveMessage", { username, message });
        } catch (error) {
            console.error("Error saving chat message:", error);
        }
    });

    // Handle user typing event
    socket.on("userTyping", ({ username }) => {
        socket.broadcast.emit("displayTyping", { username });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start the server with Socket.IO
server.listen(port, () => console.log(`🚀 Server running on port ${port}`));
