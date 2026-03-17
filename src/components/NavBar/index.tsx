// src/components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import type { Messages } from "@/lib/getMessages";

type NavBarProps = {
  layout: Messages["layout"];
};

export default function Navbar({ layout }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navBar = layout.NavBar;
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY) {
        // scrolling down
        setShow(false);
      } else {
        // scrolling up
        setShow(true);
      }

      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={` fixed top-0 left-0 w-full bg-white shadow transition-transform duration-300 z-50
        ${show ? "translate-y-0" : "-translate-y-full"}`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-cyan-700 flex flex-row items-center"
        >
          <Image
            height={navBar.Image.height}
            src={navBar.Image.src}
            alt="Logo Dubliner Handyman"
            width={navBar.Image.width}
            className="rounded-lg mr-4 opacity-100"
          />
          {navBar.Image.text}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navBar.navLinks.map(({ href, label }) => (
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
            {navBar.buttons.book}
          </Link>
          <Link
            href="/customer/bookings"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-800 transition-colors"
          >
            {navBar.buttons.accessBookings}
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
            {navBar.navLinks.map(({ href, label }) => (
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
              {navBar.buttons.book}
            </Link>
            <Link
              href="/customer/bookings"
              onClick={() => setMobileOpen(false)}
              className="block rounded bg-emerald-600 px-3 py-2 text-white font-medium text-center hover:bg-cyan-800"
            >
              {navBar.buttons.accessBookings}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
