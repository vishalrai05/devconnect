"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import PostCard from "../../components/PostCard";
import api from "../../lib/axios";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [me, setMe] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFeed = async () => {
      try {
        setLoading(true);
        setError("");
        const [meResponse, postsResponse] = await Promise.all([
          api.get("/api/auth/me"),
          api.get("/api/posts")
        ]);
        setMe(meResponse.data.user);
        setPosts(postsResponse.data.posts);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load feed");
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, []);

  const createPost = async (event) => {
    event.preventDefault();
    try {
      setPosting(true);
      setError("");
      const { data } = await api.post("/api/posts", { content });
      setPosts((current) => [data.post, ...current]);
      setContent("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create post");
    } finally {
      setPosting(false);
    }
  };

  const updatePost = (updatedPost) => {
    setPosts((current) => current.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

  const removePost = (postId) => {
    setPosts((current) => current.filter((post) => post._id !== postId));
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <form onSubmit={createPost} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Share an update</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              placeholder="What are you building, learning, or launching?"
              className="mt-2 w-full resize-none rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">{content.length}/2000</p>
            <button
              type="submit"
              disabled={posting || !content.trim()}
              className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>

        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {loading ? <p className="mt-6 text-slate-600">Loading feed...</p> : null}

        <div className="mt-6 space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={me?._id}
              onPostUpdated={updatePost}
              onPostDeleted={removePost}
            />
          ))}
          {!loading && posts.length === 0 ? (
            <p className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-500">
              No posts yet. Start the conversation.
            </p>
          ) : null}
        </div>
      </main>
    </>
  );
}
