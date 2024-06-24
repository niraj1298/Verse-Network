import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ActionButton from "../../component/ActionButton";

const ViewPost = () => {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { postId } = useParams();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const postResponse = await fetch(
          `http://localhost:5000/posts/getPost/${postId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        if (!postResponse.ok) {
          throw new Error("Failed to fetch post");
        }
        const postData = await postResponse.json();
        setPost(postData); 
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId, auth.token]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return; 
    try {
      const response = await fetch(
        `http://localhost:5000/posts/comment/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const result = await response.json();
      setPost({ ...post, comments: [...post.comments, result] }); 
      setNewComment(""); 
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!post) {
    return <div className="text-center mt-4">Post not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto max-w-4xl p-5 mb-8">
        <article className="bg-white rounded-lg shadow overflow-hidden p-6 h-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">{post.title}</h1>
          <p className="text-gray-700 mb-1">
            By {post.user?.username || "Unknown"}
          </p>
          <p className="text-gray-500 text-xs mb-4">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <div
            className="post-content mb-6 whitespace-pre-line text-gray-800"
            style={{ height: "auto" }}
          >
            {post.content}
          </div>
        </article>
      </div>

      <div className="container mx-auto max-w-4xl p-5 mb-8">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-3xl font-bold mb-4">Comments</h2>
          {post.comments && post.comments.length > 0 ? (
            <ul className="space-y-4">
              {post.comments.map((comment) => (
                <li key={comment._id} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold">
                    {comment.user?.username || "Unknown author"}
                  </p>
                  <p className="text-gray-500 text-xs mb-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                  <p className="whitespace-pre-line text-gray-800">
                    {comment.content}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </section>
      </div>
      <div className="container mx-auto max-w-4xl p-5">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-3xl font-bold mb-4">Add a Comment</h2>
          <textarea
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button
            className="mt-4 bg-blue-500 text-white p-2 rounded-lg"
            onClick={handleAddComment}
          >
            Post Comment
          </button>
        </section>
      </div>
      <div className="fixed bottom-10 right-10 z-50">
        <ActionButton />
      </div>
    </div>
  );
};

export default ViewPost;