// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-cyan-700 flex flex-row items-center"
        >
          <Image
            height={40}
            src={"/images/logo.png"}
            alt="Logo Dubliner Handyman"
            width={40}
            className="rounded-lg mr-4 "
          />
          Dubliner Handyman
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-slate-700 hover:text-cyan-700 transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-medium text-white shadow hover:bg-cyan-800 transition-colors"
          >
            Book a Repair
          </Link>
          <Link
            href="/customer/bookings"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-800 transition-colors"
          >
            Access My Bookings
          </Link>
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden inline-flex items-center justify-center rounded p-2 text-slate-700 hover:bg-slate-100"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="space-y-1 px-6 py-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-cyan-700"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setMobileOpen(false)}
              className="block rounded bg-cyan-700 px-3 py-2 text-white font-medium text-center hover:bg-cyan-800"
            >
              Book a Repair
            </Link>
            <Link
              href="/customer/bookings"
              onClick={() => setMobileOpen(false)}
              className="block rounded bg-emerald-600 px-3 py-2 text-white font-medium text-center hover:bg-cyan-800"
            >
              Access My Bookings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
