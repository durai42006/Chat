import React, { useState, useEffect, useContext } from "react";
import { FaTrophy, FaComment, FaUser, FaReply, FaChevronDown, FaChevronUp, FaThumbsUp, FaTrash } from "react-icons/fa";
import { UserContext } from "../../context/userContext";
import  SocketContext  from "../../context/socketContext";
import axios from "axios";
import "../css/WeeklyContest.css";

const WeeklyContest = () => {
  const { user } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [comments, setComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [likedComments, setLikedComments] = useState(new Set());

  const questions = [
    { id: 1, question: "What is the LCM of 12 and 18?" },
    { id: 2, question: "Find the profit percentage if CP is $100 and SP is $120." },
    { id: 3, question: "A train travels 240 km in 4 hours. Find its speed." },
  ];

  useEffect(() => {
    questions.forEach((q) => fetchComments(q.id));

    socket.on("updateComments", ({ questionId, comment }) => {
      setComments((prev) => ({
        ...prev,
        [questionId]: [comment, ...(prev[questionId] || [])],
      }));
    });

    socket.on("commentLiked", ({ commentId, questionId }) => {
      setComments((prev) => ({
        ...prev,
        [questionId]: prev[questionId].map((c) =>
          c._id === commentId ? { ...c, likes: c.likes + 1 } : c
        ),
      }));
      setLikedComments((prev) => new Set(prev).add(commentId));
    });

    socket.on("commentDeleted", ({ commentId, questionId }) => {
      setComments((prev) => ({
        ...prev,
        [questionId]: prev[questionId]?.filter((c) => c._id !== commentId) || [],
      }));
    });

    return () => {
      socket.off("updateComments");
      socket.off("commentLiked");
      socket.off("commentDeleted");
    };
  }, [socket]);

  const fetchComments = async (questionId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/comments/${questionId}`);
      setComments((prev) => ({ ...prev, [questionId]: res.data }));
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleCommentSubmit = async (questionId, commentText) => {
    if (!commentText.trim()) return;
    
    const newComment = {
      questionId,
      username: user?.name || "Anonymous",
      text: commentText,
      likes: 0,
    };
    
    try {
      const res = await axios.post("http://localhost:8000/api/comments/add", newComment);
      socket.emit("newComment", { questionId, comment: res.data });
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleLike = async (questionId, commentId) => {
    if (likedComments.has(commentId)) return;

    try {
      await axios.post(`http://localhost:8000/api/comments/like/${commentId}`);
      socket.emit("commentLiked", { questionId, commentId });
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleDelete = async (questionId, commentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/comments/${commentId}`);
      socket.emit("commentDeleted", { questionId, commentId });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="weekly-contest-container">
      <h1 className="contest-title">
        <FaTrophy className="icon-trophy" /> Weekly Aptitude Contest
      </h1>
      {questions.map((q) => (
        <div key={q.id} className="question-card">
          <h3>{q.question}</h3>
          <div className="comment-section">
            <h4>
              <FaComment /> Comments
            </h4>
            <div className="comment-list scrollable-comments">
              {comments[q.id] &&
                comments[q.id]
                  .slice(0, expandedComments[q.id] ? comments[q.id].length : 3)
                  .map((c) => (
                    <CommentItem
                      key={c._id}
                      comment={c}
                      questionId={q.id}
                      onLike={handleLike}
                      onDelete={handleDelete}
                      liked={likedComments.has(c._id)}
                    />
                  ))}
            </div>

            {comments[q.id] && comments[q.id].length > 3 && (
              <button
                className="toggle-btn"
                onClick={() =>
                  setExpandedComments((prev) => ({
                    ...prev,
                    [q.id]: !prev[q.id],
                  }))
                }
              >
                {expandedComments[q.id] ? (
                  <>
                    Show Less <FaChevronUp />
                  </>
                ) : (
                  <>
                    Show More <FaChevronDown />
                  </>
                )}
              </button>
            )}

            <CommentInput questionId={q.id} onCommentSubmit={handleCommentSubmit} />
          </div>
        </div>
      ))}
    </div>
  );
};

const CommentItem = ({ comment, questionId, onLike, onDelete, liked }) => {
  return (
    <div className="comment">
      <FaUser className="user-icon" /> <strong>{comment.username}:</strong> {comment.text}
      <div className="comment-actions">
        <button
          className="like-btn"
          onClick={() => onLike(questionId, comment._id)}
          style={{ color: liked ? "red" : "black" }}
        >
          <FaThumbsUp /> {comment.likes}
        </button>
        <button className="delete-btn" onClick={() => onDelete(questionId, comment._id)} style={{ color: "red" }}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

const CommentInput = ({ questionId, onCommentSubmit }) => {
  const [comment, setComment] = useState("");

  return (
    <div className="comment-input">
      <input
        type="text"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={() => {
          onCommentSubmit(questionId, comment);
          setComment("");
        }}
      >
        Post
      </button>
    </div>
  );
};

export default WeeklyContest;