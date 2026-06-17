"use client";

import Link from "next/link";
import Avatar from "./Avatar";

export default function ProfileCard({ user }) {
  return (
    <Link
      href={`/profile/${user._id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <Avatar src={user.avatar} name={user.name} />
        <div>
          <h2 className="font-semibold text-slate-900">{user.name}</h2>
          <p className="text-sm text-slate-500">{user.bio || "Developer on DevConnect"}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(user.skills || []).slice(0, 6).map((skill) => (
          <span key={skill} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {skill}
          </span>
        ))}
        {(!user.skills || user.skills.length === 0) ? (
          <span className="text-sm text-slate-500">No skills listed</span>
        ) : null}
      </div>
    </Link>
  );
}
