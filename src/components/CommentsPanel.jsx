import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment"; // Add moment for timestamp formatting

const CommentsPanel = ({ documentId, user, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/drive/v3/files/${documentId}/comments?fields=comments(id,createdTime,author/displayName,author/emailAddress,content,replies,htmlContent)`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (documentId && user?.token) {
      fetchComments();
      const interval = setInterval(fetchComments, 10000);
      return () => clearInterval(interval);
    }
  }, [documentId, user]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `https://www.googleapis.com/drive/v3/files/${documentId}/comments`,
        {
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyContent.trim()) return;

    try {
      await axios.post(
        `https://www.googleapis.com/drive/v3/files/${documentId}/comments/${commentId}/replies`,
        {
          content: replyContent,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="comments-panel">
      <div className="comments-header">
        <h3>Comments</h3>
        <button className="close-btn" onClick={onClose}>

          ×
        </button>
      </div>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-thread">
            <div className="comment">
              <div className="comment-header">
                <div className="author-avatar">
                  {comment.author?.displayName?.[0]?.toUpperCase()}
                </div>
                <div className="comment-meta">
                  <span className="author-name">
                    {comment.author?.displayName}
                  </span>
                  <span className="comment-time">
                    {moment(comment.createdTime).fromNow()}
                  </span>
                </div>
              </div>
              <div
                className="comment-content"
                dangerouslySetInnerHTML={{ __html: comment.htmlContent }}
              />
              <div className="comment-actions">
                <button
                  className="reply-btn"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  Reply
                </button>
                {comment.replies?.length > 0 && (
                  <button className="view-replies-btn">
                    {comment.replies.length}{" "}
                    {comment.replies.length === 1 ? "reply" : "replies"}
                  </button>
                )}
              </div>

              {replyingTo === comment.id && (
                <div className="reply-input">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Reply..."
                    autoFocus
                  />
                  <div className="reply-controls">
                    <button
                      className="cancel-reply"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="post-reply"
                      onClick={() => handleAddReply(comment.id)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {comment.replies?.length > 0 && (
              <div className="replies-list">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="reply">
                    <div className="comment-header">
                      <div className="author-avatar small">
                        {reply.author?.displayName?.[0]?.toUpperCase()}
                      </div>
                      <div className="comment-meta">
                        <span className="author-name">
                          {reply.author?.displayName}
                        </span>
                        <span className="comment-time">
                          {moment(reply.createdTime).fromNow()}
                        </span>
                      </div>
                    </div>
                    <div
                      className="comment-content"
                      dangerouslySetInnerHTML={{ __html: reply.htmlContent }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="new-comment">
        <div className="comment-header">
          <div className="author-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="comment-input">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="1"
            />
          </div>
        </div>
        <div className="comment-controls">
          <button
            className="post-comment"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsPanel;
