"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import ProfileCard from "../../components/ProfileCard";
import SearchBar from "../../components/SearchBar";
import api from "../../lib/axios";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const params = query.trim() ? { skill: query.trim() } : {};
        const { data } = await api.get("/api/users", { params });
        setUsers(data.users);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to search users");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Find developers</h1>
          <p className="mt-2 text-slate-600">Search by skill and discover people building with similar tools.</p>
        </div>

        <SearchBar value={query} onChange={setQuery} loading={loading} />
        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <ProfileCard key={user._id} user={user} />
          ))}
        </div>
        {!loading && users.length === 0 ? (
          <p className="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-500">
            No developers found.
          </p>
        ) : null}
      </main>
    </>
  );
}
