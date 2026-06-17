"use client";

import Link from "next/link";
import { useState } from "react";
import api from "../lib/axios";
import Avatar from "./Avatar";
import CommentSection from "./CommentSection";

export default function PostCard({ post, currentUserId, onPostUpdated, onPostDeleted }) {
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const liked = post.likes?.some((id) => String(id) === String(currentUserId));
  const isOwner = String(post.author?._id) === String(currentUserId);

  const toggleLike = async () => {
    try {
      setError("");
      setLikeLoading(true);
      const { data } = await api.put(`/api/posts/${post._id}/like`);
      onPostUpdated(data.post);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update like");
    } finally {
      setLikeLoading(false);
    }
  };

  const deletePost = async () => {
    try {
      setError("");
      setDeleteLoading(true);
      await api.delete(`/api/posts/${post._id}`);
      onPostDeleted(post._id);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete post");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/profile/${post.author?._id}`} className="flex items-center gap-3">
          <Avatar src={post.author?.avatar} name={post.author?.name} />
          <div>
            <p className="font-semibold text-slate-900">{post.author?.name || "Developer"}</p>
            <time className="text-xs text-slate-500" dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleString()}
            </time>
          </div>
        </Link>
        {isOwner ? (
          <button
            type="button"
            onClick={deletePost}
            disabled={deleteLoading}
            className="rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        ) : null}
      </div>

      <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-800">{post.content}</p>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={toggleLike}
          disabled={likeLoading}
          className={`rounded-md px-3 py-2 text-sm font-semibold ${
            liked ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
          } disabled:opacity-60`}
        >
          {likeLoading ? "Saving..." : `${liked ? "Liked" : "Like"} (${post.likes?.length || 0})`}
        </button>
        <button
          type="button"
          onClick={() => setShowComments((value) => !value)}
          className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          {showComments ? "Hide comments" : "Comments"}
        </button>
      </div>

      {showComments ? <CommentSection postId={post._id} /> : null}
    </article>
  );
}
