"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Avatar from "../../../components/Avatar";
import api from "../../../lib/axios";

export default function ProfilePage({ params }) {
  const [user, setUser] = useState(null);
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ bio: "", skills: "", github: "", linkedin: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const [meResponse, userResponse] = await Promise.all([
          api.get("/api/auth/me"),
          api.get(`/api/users/${params.id}`)
        ]);
        const profile = userResponse.data.user;
        setMe(meResponse.data.user);
        setUser(profile);
        setForm({
          bio: profile.bio || "",
          skills: (profile.skills || []).join(", "),
          github: profile.github || "",
          linkedin: profile.linkedin || ""
        });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [params.id]);

  const isOwnProfile = String(me?._id) === String(user?._id);

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const { data } = await api.put(`/api/users/${params.id}`, form);
      setUser(data.user);
      setSuccess("Profile saved.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (event) => {
    event.preventDefault();
    if (!avatarFile) {
      setError("Choose an avatar image first");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");
      const payload = new FormData();
      payload.append("avatar", avatarFile);
      const { data } = await api.post(`/api/users/${params.id}/avatar`, payload);
      setUser(data.user);
      setSuccess("Avatar updated.");
      setAvatarFile(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {loading ? <p className="text-slate-600">Loading profile...</p> : null}
        {error ? <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {success ? <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}

        {user ? (
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <Avatar src={user.avatar} name={user.name} size={96} />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                <p className="mt-3 leading-7 text-slate-700">{user.bio || "No bio added yet."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(user.skills || []).map((skill) => (
                    <span key={skill} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
                  {user.github ? <a className="text-emerald-700 hover:underline" href={user.github} target="_blank" rel="noreferrer">GitHub</a> : null}
                  {user.linkedin ? <a className="text-emerald-700 hover:underline" href={user.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : null}
                </div>
              </div>
            </div>

            {isOwnProfile ? (
              <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
                <form onSubmit={saveProfile} className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">Edit profile</h2>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Bio</span>
                    <textarea
                      value={form.bio}
                      onChange={(event) => setForm({ ...form, bio: event.target.value })}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Skills</span>
                    <input
                      value={form.skills}
                      onChange={(event) => setForm({ ...form, skills: event.target.value })}
                      placeholder="React, Node.js, MongoDB"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">GitHub URL</span>
                    <input
                      value={form.github}
                      onChange={(event) => setForm({ ...form, github: event.target.value })}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">LinkedIn URL</span>
                    <input
                      value={form.linkedin}
                      onChange={(event) => setForm({ ...form, linkedin: event.target.value })}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save profile"}
                  </button>
                </form>

                <form onSubmit={uploadAvatar} className="rounded-lg bg-slate-50 p-4">
                  <h2 className="text-lg font-bold text-slate-900">Avatar</h2>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
                    className="mt-4 w-full text-sm text-slate-700"
                  />
                  <button
                    type="submit"
                    disabled={uploading || !avatarFile}
                    className="mt-4 w-full rounded-md bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? "Uploading..." : "Upload avatar"}
                  </button>
                </form>
              </div>
            ) : null}
          </section>
        ) : null}
      </main>
    </>
  );
}
