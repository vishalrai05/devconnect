"use client";

export default function SearchBar({ value, onChange, loading }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search developers by skill, e.g. React"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-28 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
        {loading ? "Searching..." : "Skill search"}
      </span>
    </div>
  );
}
