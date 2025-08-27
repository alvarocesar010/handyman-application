// src/components/Footer.tsx
import Link from "next/link";
import { Phone, Mail, MessageCircle, MapPin, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      {/* Top CTA strip (optional) */}
      <div className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Need a repair this week? Same-day callouts when available.
          </p>
          <div className="flex gap-3">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Book a Repair <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
            <a
              href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER?.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand / About */}
          <div>
            <h3 className="text-base font-semibold text-white">
              Dublin Handyman
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Reliable repairs and maintenance for homes and small businesses in
              Dublin. Transparent pricing, fast response, fully insured.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer Navigation">
            <h3 className="text-base font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  Book a Repair
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/bookings"
                  className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </nav>

          {/* Service areas */}
          <div>
            <h3 className="text-base font-semibold text-white">
              Service Areas
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-400">
              <li>City Centre</li>
              <li>Rathmines</li>
              <li>Drumcondra</li>
              <li>Tallaght</li>
              <li>Blanchardstown</li>
              <li>Clondalkin</li>
              <li>Phibsborough</li>
              <li>Docklands</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              If you’re nearby, just ask.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-400" />
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER?.replace(
                    /\s/g,
                    ""
                  )}`}
                  className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  {process.env.NEXT_PUBLIC_PHONE_NUMBER}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                <a
                  href="mailto:info@handyman.ie"
                  className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  info@handyman.ie
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-cyan-400" />
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER?.replace(
                    /\D/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span>Dublin & surrounding areas</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Dublin Handyman Services. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <span>Mon–Sat 08:00–20:00 · Emergencies by phone</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
