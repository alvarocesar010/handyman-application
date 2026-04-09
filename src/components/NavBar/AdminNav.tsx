"use client";
import {
  X,
  LayoutList,
  SquareChevronRight,
  ChartLine,
  Layers,
  LucideIcon,
  BrickWall,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  icon: LucideIcon;
  children: {
    label: string;
    href: string;
  }[];
};

const data: NavItem[] = [
  {
    label: "Bookings",
    icon: LayoutList,
    children: [
      { label: "All Bookings", href: "/admin/bookings" },
      { label: "New Booking", href: "/admin/create-booking" },
    ],
  },
  {
    label: "Inventory",
    icon: Layers,
    children: [
      { label: "Inventory List", href: "/admin/inventory" },
      { label: "New Item", href: "/admin/inventory/new-item" },
    ],
  },
  {
    label: "Dashboard",
    icon: ChartLine,
    children: [{ label: "Dashs", href: "/admin/dashboard" }],
  },
  {
    label: "Development",
    icon: BrickWall,
    children: [
      { label: "The Budgeter", href: "/admin/developing/the-budgeter" },
    ],
  },
];

export default function AdminNav() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();

  const handleClose = () => setOpen(false);

  const toggleGroup = (label: string) => {
    setOpenGroup((prev) => (prev === label ? null : label));
  };
  return (
    <>
      {/* MENU BUTTON (ALL SCREENS) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className=" p-2 bg-white rounded-lg shadow"
        >
          <SquareChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* OVERLAY */}
      {open && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-gradient-to-b from-slate-900 to-slate-800 text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-bold text-lg">Admin</span>

          <button onClick={handleClose}>
            <X />
          </button>
        </div>

        {/* LINKS */}
        <nav className="flex flex-col gap-3 p-4">
          {data.map((group) => {
            const Icon = group.icon;
            const isOpen = openGroup === group.label;

            return (
              <div key={group.label}>
                {/* GROUP HEADER (clickable) */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{group.label}</span>
                  </div>
                </button>

                {/* CHILDREN */}
                <div
                  className={`
            overflow-hidden transition-all duration-300
            ${isOpen ? "max-h-40 mt-2" : "max-h-0"}
          `}
                >
                  <div className="flex flex-col gap-1">
                    {group.children.map((item) => {
                      const active = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleClose}
                          className={`
                    ml-8 px-3 py-2 rounded-lg text-sm transition
                    ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }
                  `}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
