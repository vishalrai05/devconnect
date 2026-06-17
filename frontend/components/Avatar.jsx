"use client";

import Image from "next/image";

export default function Avatar({ src, name, size = 44 }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const imageSrc = src ? `${apiUrl}${src}` : null;
  const initials = (name || "DC")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt={`${name || "User"} avatar`}
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-white"
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white ring-2 ring-white"
      style={{ width: size, height: size }}
      aria-label={`${name || "User"} avatar`}
    >
      {initials}
    </div>
  );
}
