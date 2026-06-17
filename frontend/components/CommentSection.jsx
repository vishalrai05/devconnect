"use client";

import { useEffect, useState } from "react";
import api from "../lib/axios";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/api/posts/${postId}/comments`);
        setComments(data.comments);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load comments");
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  const submitComment = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      const { data } = await api.post(`/api/posts/${postId}/comment`, { text });
      setComments((current) => [...current, data.comment]);
      setText("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-4 border-t border-slate-100 pt-4">
      <form onSubmit={submitComment} className="flex flex-col gap-2 sm:flex-row">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a comment"
          className="min-h-10 flex-1 rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Posting..." : "Post"}
        </button>
      </form>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="mt-3 text-sm text-slate-500">Loading comments...</p> : null}

      <div className="mt-4 space-y-3">
        {comments.map((comment) => (
          <div key={comment._id} className="rounded-md bg-slate-50 px-3 py-2">
            <p className="text-sm font-semibold text-slate-900">{comment.author?.name || "Developer"}</p>
            <p className="mt-1 text-sm text-slate-700">{comment.text}</p>
          </div>
        ))}
        {!loading && comments.length === 0 ? (
          <p className="text-sm text-slate-500">No comments yet.</p>
        ) : null}
      </div>
    </section>
  );
}
