"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/profile" },
  { label: "Emergency Request", href: "/emergency" },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md font-medium transition-colors text-sm md:text-base 
                ${pathname.startsWith(link.href)
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
