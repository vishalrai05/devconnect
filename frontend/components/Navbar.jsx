"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../lib/axios";

export default function Navbar() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        setMe(data.user);
      } catch (_error) {
        setMe(null);
      }
    };

    loadMe();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await api.post("/api/auth/logout");
      router.push("/login");
      router.refresh();
    } catch (_error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/feed" className="text-xl font-bold text-emerald-700">
          DevConnect
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 sm:gap-4">
          <Link className="rounded-md px-2 py-2 hover:bg-slate-100" href="/feed">Feed</Link>
          <Link className="rounded-md px-2 py-2 hover:bg-slate-100" href="/search">Search</Link>
          <Link className="rounded-md px-2 py-2 hover:bg-slate-100" href={me ? `/profile/${me._id}` : "/feed"}>
            My Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="rounded-md bg-slate-900 px-3 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </nav>
    </header>
  );
}
