import { useEffect, useState, useContext } from "react";
import { useSocket } from "../../context/socketContext.jsx";
import { UserContext } from "../../context/userContext.jsx";
import "../css/CommunityChat.css";

const CommunityChat = () => {
    const socket = useSocket();
    const { user, loading } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!socket || !user) return;

        // Fetch old messages only once
        const fetchMessages = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/chat");
                const data = await res.json();
                setMessages(data); // Load existing chat history
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();

        // Listen for new messages from the server
        const handleReceiveMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage); // Cleanup listener
        };
    }, [socket, user]);

    const sendMessage = async () => {
        if (message.trim() && user?.name) {  // ✅ Changed from user.username to user.name
            const newMessage = { username: user.name, message };

            // Emit message through Socket.IO
            socket.emit("chatMessage", newMessage);

            // Save to backend
            try {
                const res = await fetch("http://localhost:8000/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newMessage),
                });
                if (!res.ok) throw new Error("Message sending failed");
            } catch (error) {
                console.error("Error sending message:", error);
            }

            setMessage(""); // Clear input field
        }
    };

    if (loading) return <p>Loading chat...</p>; // Wait until user data loads

    return (
        <div className="chat-container">
            <h2>Community Chat</h2>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.username === user?.name ? "self" : ""}`}>
                        <strong>{msg.username}</strong>: {msg.message}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default CommunityChat;
